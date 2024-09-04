<template>
    <div class="ts-content is-tertiary is-vertically-padded">
        <div class="ts-container is-very-narrow has-vertically-spaced">
            <div class="ts-header is-big is-heavy">註冊會員</div>
            <div class="ts-text is-secondary">初次見面，歡迎加入貓咪罐頭股份有限公司！</div>
        </div>
    </div>
    <div class="ts-container">
        <div class="ts-box">
            <table class="ts-table">
                <thead>
                    <tr>
                        <th>訂單編號</th>
                        <th>日期</th>
                        <th>總金額</th>
                        <th>付款方式</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    <tr>
                        <td>{{ orderData.orderId }}</td>
                        <td>{{ formatDate(orderData.orderDate) }}</td>
                        <td>{{ formatCurrency(orderData.totalAmounts) }}</td>
                        <td>{{ orderData.paymentMethod === 1 ? 'LinePay' : '其他' }}</td>
                        <td>
                            <button class="ts-button is-outlined" @click="toggleOrderDetails(orderData.orderId)">
                                {{ expandedOrderId === orderData.orderId ? '收起' : '展開' }}
                            </button>
                        </td>
                    </tr>
                    <tr v-if="expandedOrderId === orderData.orderId">
                        <td colspan="6" class="is-secondary is-padded is-insetted">
                            <div v-if="orderDetails.length > 0">
                                <table class="ts-table">
                                    <thead>
                                        <tr>
                                            <th>商品名稱</th>
                                            <th>數量</th>
                                            <th>價格</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="detail in orderDetails" :key="detail.id">
                                            <td>{{ detail.productName }}</td>
                                            <td>{{ detail.quantity }}</td>
                                            <td>{{ formatCurrency(detail.price) }}</td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-else>
                                正在加載訂單詳情...
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="is-secondary is-padded is-insetted" colspan="6">
                        </td>
                    </tr>
                </tbody>
            </table>
            <form class="ts-form" @submit="sendRefundApply">
                <div class="field">
                    <label class="label">退款理由</label>
                    <textarea class="ts-textarea" v-model="refundReason" placeholder="請輸入退款理由" rows="4"
                        required></textarea>
                </div>
                <button class="ts-button is-primary" type="submit">提交退款申請</button>
            </form>
        </div>
    </div>


</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axiosapi from '@/plugins/axios.js';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
const route = useRoute();
const orderId = route.params.orderId;
const orderData = ref({});
const expandedOrderId = ref(null);
const orderDetails = ref([]);
const refundReason = ref('');
const router = useRouter()


onMounted(async () => {
    try {
        const response = await axiosapi.get(`/order/findByOrderId/${orderId}`);
        if (response.data) {
            orderData.value = response.data;
        } else {
            console.log('找不到訂單數據');
        }
    } catch (error) {
        console.error('加載訂單數據失敗', error);
    }
});

const sendRefundApply = async (event) => {
    event.preventDefault(); // 阻止表單的默認提交行為
    try {
        const response = await axiosapi.post('/order/addRefund', {
            orderId: orderId,
            refundReason: refundReason.value
        });
        if (response.data) {
            Swal.fire({
                title: '成功!',
                icon: 'success',
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading()
                }
            }).then((result) => {
                // 確保 SweetAlert 的計時器結束後才執行路由跳轉
                if (result.dismiss === Swal.DismissReason.timer) {
                    router.push('/secure/profile');
                }
            })
        } else {

            console.log('退款申請失敗');
        }
    } catch (error) {
        console.error('退款申請出錯', error);
    }
};



const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD' }).format(amount);
};

const formatDate = (dateString) => {
    if (!dateString) return ''
    return dateString.replace('T', ' ').split('.')[0]
}


const toggleOrderDetails = orderId => {
    if (expandedOrderId.value === orderId) {
        expandedOrderId.value = null;
    } else {
        expandedOrderId.value = orderId;
        getOrderDetails(orderId);
    }
}

const getOrderDetails = async (orderId) => {
    await axiosapi.get('/order/findOd/' + orderId)
        .then(response => {
            console.log(response)
            orderDetails.value = response.data
        }).catch(
            error => {
                console.error('cant load orderDetails' + error)
            }
        )
}

</script>

<style></style>
<template>
    <div class="ts-container status-selection">
        <div class="ts-selection is-fluid">
            <label class="item">
                <input type="radio" name="language" value="1" v-model="status" />
                <div class="text">申請中</div>
            </label>
            <label class="item">
                <input type="radio" name="language" value="2" v-model="status" />
                <div class="text">已審核</div>
            </label>
        </div>
    </div>
    <div class="ts-container">
        <div class="ts-box">
            <table class="ts-table">
                <thead>
                    <tr>
                        <th>訂單編號</th>
                        <th>訂單日期</th>
                        <th>申請時間</th>
                        <th>總金額</th>
                        <th>付款方式</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="order in orders" :key="order.orderId">
                        <tr>
                            <td>{{ order.orderId }}</td>
                            <td>{{ formatDate(order.orderDate) }}</td>
                            <td>{{ formatDate(order.applyRefundDate) }}</td>
                            <td>{{ formatCurrency(order.totalAmounts) }}</td>
                            <td>{{ order.paymentMethod === 1 ? 'LinePay' : '其他' }}</td>
                            <td>
                                <button class="ts-button is-outlined" @click="toggleOrderDetails(order.orderId)">
                                    {{ expandedOrderId === order.orderId ? '收起' : '展開' }}
                                </button>
                            </td>
                        </tr>
                        <tr v-if="expandedOrderId === order.orderId">
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

                                    <div class="ts-box reason-box">
                                        <div class="ts-content reason-content">
                                            <span class="ts-text">{{ order.refundReason }} </span>
                                            <div class="ts-wrap" v-if="order.refundStatus == 1">
                                                <button class="ts-button" @click="agreeRefund(order)">同意</button>
                                                <button class="ts-button reject-button"
                                                    @click="rejectRefund(order)">拒絕</button>
                                            </div>
                                            <div v-else>
                                                狀態:{{ getStatusText(order.status) }}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div v-else>
                                    正在加載訂單詳情...
                                </div>
                            </td>
                        </tr>
                    </template>
                    <tr>
                        <td class="is-secondary is-padded is-insetted" colspan="6">
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import axiosapi from '@/plugins/axios.js';
import { ref } from 'vue';
import { watch } from 'vue';
import useUserStore from "@/stores/user.js"
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const status = ref(1);
const orders = ref([]);
const expandedOrderId = ref(null);
const orderDetails = ref([]);
const user = useUserStore().userId;
const router = useRouter()

const loadOrders = async () => {
    try {
        const response = await axiosapi.get(`/admin/findByRefundStatus/${status.value}`);
        console.log('findByRefundStatus : ' + JSON.stringify(response.data));
        if (response.data !== '') {
            orders.value = response.data;
        } else {
            console.log('cantfind');
        }
    } catch (error) {
        console.error('cant load orders' + error);
    }
};

watch(status, loadOrders, { immediate: true });

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
            orderDetails.value = response.data
        }).catch(
            error => {
                console.error('cant load orderDetails' + error)
            }
        )
}

const agreeRefund = async (order) => {
    try {
        const response = await axiosapi.post('/admin/agreeRefund', {
            orderId: order.orderId
        });
        if (response.data != '') {
            console.log(response.data)
            Swal.fire({
                icon: 'success',
                title: '操作成功',
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
            })
            await loadOrders();
        } else {
            console.log(response.data)
            Swal.fire({
                icon: 'error',
                title: '請稍後再試',
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
            })
        }
    } catch (error) {
        console.log(error);
        alert('操作出錯');
    }
};


const rejectRefund = async (order) => {
    try {
        const response = await axiosapi.post('/admin/rejectRefund', {
            orderId: order.orderId
        });
        if (response.data != '') {
            console.log(response.data)
            Swal.fire({
                icon: 'success',
                title: '操作成功',
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
            })
        } else {
            console.log(response.data)
            Swal.fire({
                icon: 'error',
                title: '請稍後再試',
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
            })
        }
        await loadOrders();
    } catch (error) {
        console.log(error);
        alert('操作出錯');
    }
};

const getStatusText = (status) => {
    switch (status) {
        case 1: return '拒絕退款';
        case 3: return '同意退款';
    }
}
</script>

<style scoped>
.status-selection {
    margin-top: 10px;
}

.reason-box {
    margin-top: 20px;
}

.reason-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.reject-button {
    background-color: #9e9e9e;
    border: 0;
}
</style>
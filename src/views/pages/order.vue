<template>
    <!DOCTYPE html>
    <html class="is-secondary">
    <div class="ts-container" style="margin-top: 10px;">
        <div class="ts-selection is-fluid">
            <label class="item">
                <input type="radio" name="language" value="1" v-model="status" />
                <div class="text">已付款</div>
            </label>
            <!-- <label class="item">
                <input type="radio" name="language" value="2" v-model="status" />
                <div class="text">已取消</div>
            </label> -->
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
                    <template v-for="order in orders" :key="order.orderId">
                        <tr>
                            <td>{{ order.orderId }}</td>
                            <td>{{ formatDate(order.orderDate) }}</td>
                            <td>{{ formatCurrency(order.totalAmounts) }}</td>
                            <td>{{ order.paymentMethod === 1 ? 'LinePay' : '其他' }}</td>
                            <td>
                                <button class="ts-button is-outlined" @click="toggleOrderDetails(order.orderId)">
                                    {{ expandedOrderId === order.orderId ? '收起' : '展開' }}
                                </button>
                            </td>
                        </tr>
                        <tr v-if="expandedOrderId === order.orderId">
                            <td colspan="5" class="is-secondary is-padded is-insetted">
                                <div v-if="orderDetails.length > 0">
                                    <table class="ts-table">
                                        <thead>
                                            <tr>
                                                <th>商品名稱</th>
                                                <th>數量</th>
                                                <th>價格</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="detail in orderDetails" :key="detail.id">
                                                <td>{{ detail.productName }}</td>
                                                <td>{{ detail.quantity }}</td>
                                                <td>{{ formatCurrency(detail.price) }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div v-else>
                                    正在加載訂單詳情...
                                </div>
                            </td>
                        </tr>
                    </template>
                    <tr>
                        <td class="is-secondary is-padded is-insetted" colspan="5">
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    </html>
</template>

<script setup>
import axiosapi from '@/plugins/axios.js';
import { ref } from 'vue';
import { watch } from 'vue';
import useUserStore from "@/stores/user.js"


const status = ref(1);
const orders = ref([]);
const expandedOrderId = ref(null);
const orderDetails = ref([]);
const user = useUserStore().userId;



watch(status, () => {
    axiosapi
        .get(`/order/find/${user}?status=${status.value}`)
        .then(response => {
            console.log(response)
            if (response.data !== '') {
                orders.value = response.data;
            } else {
                console.log('cantfind');
            }
        })
        .catch(error => {
            console.error('cant load orders' + error);
        });
}, { immediate: true }); // 确保组件加载时也会执行一次

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

<style>
.ts-table th,
.ts-table td,
.ts-table tr {
    text-align: center;
}
</style>
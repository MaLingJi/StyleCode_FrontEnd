<template>
    <!DOCTYPE html>
    <html class="is-secondary">
    <div class="ts-container">
        <div class="ts-selection is-fluid">
            <label class="item">
                <input type="radio" name="language" value="0" v-model="status" />
                <div class="text">未付款</div>
            </label>
            <label class="item">
                <input type="radio" name="language" value="1" v-model="status" />
                <div class="text">已付款</div>
            </label>
            <label class="item">
                <input type="radio" name="language" value="2" v-model="status" />
                <div class="text">已取消</div>
            </label>
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
                    <template v-for="order in orders" :key="order.id">
                        <tr>
                            <td>{{ order.id }}</td>
                            <td>{{ order.orderDate }}</td>
                            <td>{{ formatCurrency(order.totalAmounts) }}</td>
                            <td><button class="ts-button is-short is-outlined is-small"
                                    style="background-color:limegreen;">LinePay</button>
                                <button class="ts-button is-short is-outlined is-small"
                                    style="background-color:cornflowerblue;">綠界</button>
                            </td>
                            <td>
                                <button class="ts-button is-outlined" @click="toggleOrderDetails(order.id)">
                                    {{ expandedOrderId === order.id ? '收起' : '展開' }}
                                </button>
                            </td>
                        </tr>
                        <tr v-if="expandedOrderId === order.id">
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
import axios, { Axios } from 'axios';
import { ref } from 'vue';
import { watch } from 'vue';

const status = ref(0);
const orders = ref([]);
const expandedOrderId = ref(null);
const orderDetails = ref([]);

watch(status, () => {
    axios
        .get('http://localhost:8080/order/find/1?status=' + status.value)
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

const toggleOrderDetails = orderId => {
    if (expandedOrderId.value === orderId) {
        expandedOrderId.value = null;
    } else {
        expandedOrderId.value = orderId;
        axios.get('http://localhost:8080/order/findOd/' + orderId)
            .then(response => {
                console.log(response)
                orderDetails.value = response.data
            }).catch(
                error => {
                    console.error('cant load orderDetails' + error)
                }
            )
    }
}



</script>

<style>
.ts-table th,
.ts-table td {
    text-align: center;
}
</style>
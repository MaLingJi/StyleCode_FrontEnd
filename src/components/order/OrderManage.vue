<template>
    <div class="dashboard">
        <div class="date-picker">
            <DatePicker v-model="range" is-range @input="fetchOrders" />
        </div>
        <div class="orderAnalysis">
            <div>
                <h1>累積訂單數:{{ orders.length }}</h1>
                <h1>累積訂單金額:{{ formatCurrency(totalAmount) }}</h1>
            </div>
            <OrderManageLineChart></OrderManageLineChart>
        </div>

        <div class="productAnalysis">
            <OrderManageProChart></OrderManageProChart>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import axiosapi from '@/plugins/axios.js';
import OrderManageLineChart from './OrderManageLineChart.vue';
import OrderManageProChart from './OrderManageProChart.vue';



const range = ref({
    start: new Date(),
    end: new Date()
});

const orders = ref([]);


const fetchOrders = async () => {
    if (!range.value.start || !range.value.end) return;

    try {
        const response = await axiosapi.get(`/order/findByDate`, {
            params: {
                startDate: formatDate(range.value.start),
                endDate: formatDate(range.value.end)
            }
        });
        console.log(response.data);
        orders.value = response.data;
    } catch (error) {
        console.error('fetchOrderByDateFail', error);
    }
};


const formatDate = (date) => {
    if (date instanceof Date) {
        return date.toISOString().slice(0, 19);  // 返回格式为 "YYYY-MM-DDTHH:mm:ss"
    }
    // if (typeof date === 'string') {
    //     // 如果日期已经是字符串，确保格式正确
    //     return date.replace(' ', 'T').slice(0, 19);
    // }
    console.error('Invalid date format');
    return '';
};


// 监听日期变化
watch(range, () => {
    fetchOrders();
}, { deep: true });



const totalAmount = computed(() => {
    let total = 0;
    for (const order of orders.value) {
        total += order.totalAmounts
        console.log(total)
    }
    console.log('totalamount:' + total)
    return total;
})

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD' }).format(amount);
};
</script>

<style scoped>
/* 您的样式 */
</style>
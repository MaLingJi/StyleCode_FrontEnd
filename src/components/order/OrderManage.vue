<template>
    <div class="dashboard">
        <div class="header">
            <div class="stats">
                <div>累積訂單數:{{ orders.length }}</div>
                <div>累積訂單金額:{{ formatCurrency(totalAmount) }}</div>   
            </div>


            <div class="datePicker">
                <DatePicker v-model="range" mode="dateTime" is-range @input="fetchOrders" />
            </div>
        </div>

        <div class="charts">
            <div class="chart lineChart">
                <OrderManageLineChart :orders="orders"></OrderManageLineChart>
            </div>
            <div class="chart pieChart">
                <OrderManageProChart :orders="orders"></OrderManageProChart>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, toRaw, watch } from 'vue';
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


//取得範圍內商品
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

//加工資料庫資料成後端API可接受
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


//偵測日期選取變化
watch(range, () => {
    fetchOrders();
}, { deep: true });


//計算範圍內所有訂單總金額
const totalAmount = computed(() => {
    let total = 0;
    for (const order of orders.value) {
        total += order.totalAmounts
        console.log(total)
    }
    console.log('totalamount:' + total)
    return total;
})

//加工金額
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD' }).format(amount);
};


</script>

<style scoped>
.dashboard {
    display: grid;
    grid-template-rows: auto 1fr;
    gap: 20px;
    padding: 20px;
    height: 100vh;
    background-color: #f0f2f5;
}

.header {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    background-color: white;
    padding: 15px;
    border-radius: 10px;
}

.stats {
    font-size: 18px;
    font-weight: bold;
}



.datePicker {
    justify-self: end;
}

.charts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.chart {
    background-color: white;
    border-radius: 10px;
    padding: 20px;
}

.pie-chart,
.line-chart {
    height: 400px;
}
</style>
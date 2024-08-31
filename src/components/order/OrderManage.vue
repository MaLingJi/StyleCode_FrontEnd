<template>
    <div class="dashboard ts-content is-padded">
        <div class="ts-grid">
            <div class="stats column is-8-wide ts-box   ">

                <OrderManageStats :orders="orders"></OrderManageStats>

                <div>
                    <OrderManagePieChart></OrderManagePieChart>
                </div>
            </div>
            <div class="headers column is-8-wide ts-box is-horizontal">
                <div class="header datePicker">
                    <DatePicker expanded v-model="range" mode="dateTime" is-range @input="fetchOrders" />
                </div>
            </div>
        </div>
        <div class="charts ts-grid">
            <div class="chart lineChart column is-8-wide ts-container ts-box is-horizontal">
                <OrderManageLineChart :orders="orders"></OrderManageLineChart>
            </div>
            <div class="chart orderTable column is-8-wide ts-container ts-box is-horizontal">
                <!-- <OrderManageProChart :orders="orders"></OrderManageProChart> -->
                <OrderManageTable :orders="orders"></OrderManageTable>
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
import OrderManageTable from './OrderManageTable.vue';
import OrderManageStats from './OrderManageStats.vue';
import OrderManagePieChart from './OrderManagePieChart.vue';

const range = ref({
    start: new Date(),
    end: new Date()
});

const orders = ref([]);


//取得範圍內商品
const fetchOrders = async () => {
    if (!range.value.start || !range.value.end) return;
    try {
        console.log(formatDate(range.value.start))
        console.log(formatDate(range.value.end))
        const response = await axiosapi.get(`/order/findByDate`, {

            params: {
                startDate: formatDate(range.value.start),
                endDate: formatDate(range.value.end)
            }
        });
        orders.value = response.data;
    } catch (error) {
        console.error('fetchOrderByDateFail', error);
    }
};

//加工資料庫資料成後端API可接受
const formatDate = (date) => {
    if (date instanceof Date) {
        const offset = date.getTimezoneOffset();
        const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
        return adjustedDate.toISOString().slice(0, 19);  // 返回格式为 "YYYY-MM-DDTHH:mm:ss"
    }
    console.error('Invalid date format');
    return '';
};


//偵測日期選取變化
watch(range, () => {
    fetchOrders();
}, { deep: true });




</script>

<style scoped>
.dashboard {
    padding: 1.5rem;
}

.ts-box {
    margin-bottom: 1rem;
    padding: 1rem;
}

.ts-grid {
    gap: 1rem;
}

/* 对于特定的元素，如果需要更多空间 */
.datePicker {
    margin-top: 1rem;
    width:100%;
}

/* 确保图表有足够的空间 */
.chart {
    min-height: 300px;
    padding: 1rem;
}

.chart.orderTable {
    min-height: 300px;
    max-height: 500px; /* 设置最大高度 */
    overflow-y: auto; /* 添加垂直滚动条 */
}

/* 确保表格内容正确显示 */
.chart.orderTable :deep(table) {
    width: 100%;
}
</style>
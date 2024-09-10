<template>
    <div class="dashboard ts-container is-padded">
        <div class="ts-grid">
            <div class="stats column is-8-wide ts-box   ">
                <OrderManageStats :orders="orders"></OrderManageStats>
                <div claa="pieChart">
                    <OrderManagePieChart :orders="orders"></OrderManagePieChart>
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

//DatePicker api 屬性
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
        const response = await axiosapi.get(`/admin/findByDate`, {

            params: {
                startDate: formatDate(range.value.start),
                endDate: formatDate(range.value.end)
            }
        });
        console.log(response)
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
        return adjustedDate.toISOString().slice(0, 19);  
    }//DatePicker api 跟我們GMT+8會有時間差異 需要調整
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
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
}

.ts-box {
    margin-bottom: 1rem;
    padding: 1rem;
}

.ts-grid {
    gap: 1rem;
}


.datePicker {
    margin-top: 1rem;
    width: 100%;
}


.charts {
    min-height: 500px;
}

.chart.orderTable {
    display: flex;
    justify-content:center
}


</style>
<template>
    <div class="dashboard ts-container is-padded">
        <div class="ts-grid">
            <div class="stats column is-16-wide ts-box   ">
                <OrderManageStats :orders="orders"></OrderManageStats>
                <div claa="pieChart">
                    <OrderManagePieChart :orders="orders"></OrderManagePieChart>
                </div>
            </div>
            <div class="headers column is-16-wide ts-box is-horizontal">
                <div class="header datePicker">
                    <DatePicker expanded v-model="range" mode="dateTime" is-range @input="fetchOrders" />
                </div>
            </div>
        </div>
        <div class="charts ts-grid">
            <div class="chart lineChart column is-16-wide ts-container ts-box is-horizontal">
                <OrderManageLineChart :orders="orders"></OrderManageLineChart>
            </div>
            <div class="chart orderTable column is-16-wide ts-container ts-box is-horizontal">
                <!-- <OrderManageProChart :orders="orders"></OrderManageProChart> -->
                <OrderManageTable :orders="orders"></OrderManageTable>
            </div>
        </div>
    </div>
</template>

<script setup>
import {  ref, watch } from 'vue';
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
    width: 100%;
}

.charts {
    min-height: 500px;
}

.chart.orderTable {
    display: flex;
    justify-content: center;
}

/* 移动端样式 */
@media (max-width: 768px) {
    .dashboard {
        padding: 0;
        width: 100%;
        max-width: none;
        overflow-x: hidden;
    }

    .ts-grid {
        display: flex;
        flex-direction: column;
        gap: 0;
    }

    .ts-grid .column {
        width: 100% !important;
        margin-bottom: 0.5rem;
    }

    .ts-box {
        border-radius: 0;
        margin-bottom: 0.5rem;
        padding: 0.5rem;
        box-shadow: none;
    }

    .charts {
        min-height: auto;
    }

    .chart {
        margin-bottom: 0.5rem;
    }

    .pieChart {
        display: flex;
        justify-content: center;
    }

    .datePicker {
        margin: 0;
        width: 100%;
    }

    /* 确保DatePicker在移动端也能正常显示并占满宽度 */
    :deep(.vc-container) {
        width: 100% !important;
        max-width: none !important;
    }

    :deep(.vc-pane-container) {
        width: 100% !important;
    }

    :deep(.vc-weeks) {
        width: 100% !important;
    }

    /* 调整图表大小 */
    :deep(.echarts) {
        height: 50vh !important;
        width: 100% !important;
    }

    /* 确保所有内容都占满宽度 */
    .stats,
    .headers,
    .charts,
    .chart,
    .lineChart,
    .orderTable {
        width: 100% !important;
    }
}

/* 针对更小的屏幕做进一步调整 */
@media (max-width: 480px) {
    .ts-box {
        padding: 0.25rem;
    }

    :deep(.echarts) {
        height: 40vh !important;
    }

    /* 进一步缩小日期选择器的内部间距 */
    :deep(.vc-pane) {
        padding: 0 !important;
    }

    :deep(.vc-weeks) {
        padding: 0 !important;
    }

    :deep(.vc-day) {
        padding: 0 !important;
        min-height: 30px !important;
    }
}
</style>
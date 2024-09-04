<template>
        <Line :data="chartData" :options="options" />
</template>

<script setup>
import {
        Chart as ChartJS,
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { ref, computed } from 'vue';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const props = defineProps(['orders'])

const dailyTotal = computed(() => {
        const total = {}
        for (const order of props.orders) {
                const date = order.orderDate.split('T')[0];
                total[date] = (total[date] || 0) + order.totalAmounts
        }
 
        return total;
})

//把dailyTotal的key拿出來排序放進矩陣內
const dates = computed(() => Object.keys(dailyTotal.value).sort())
//把key一個一個拿來mapping,把拿到的值放進矩陣內
const amounts = computed(() => dates.value.map(date => dailyTotal.value[date]))

const chartData = computed(() => ({
        labels: dates.value,
        datasets: [
                {
                        label: '範圍內訂單總金額',
                        backgroundColor: 'rgba(135, 206, 250, 0.5)', // 淺藍色半透明背景
                        borderColor: 'rgb(0, 191, 255)',            // 稍深的藍色邊線
                        borderWidth: 2,
                        pointBackgroundColor: 'rgb(30, 144, 255)',   // 數據點顏色
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgb(30, 144, 255)',  // 懸停時的邊框顏色
                        data: amounts.value,
                        fill: true,
                        tension: 0.2
                }
        ]
}))

const options = ref({
        responsive: true,
        maintainAspectRatio: false
})
</script>
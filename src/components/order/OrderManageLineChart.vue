<template>
        <div style="height: 400px;">
                <Line :data="chartData" :options="options" />
        </div>
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
                        backgroundColor: '#f87979',
                        data: amounts.value,
                }
        ]
}))

const options = ref({
        responsive: true,
        maintainAspectRatio: false
})
</script>
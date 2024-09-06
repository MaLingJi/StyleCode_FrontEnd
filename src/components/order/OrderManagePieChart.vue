<template>
    <div class="ts-box" >
        <Pie :data="data" :options="options" />
    </div>
</template>

<script setup>
import { computed, defineProps, isReactive, onMounted } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps(['orders']);



const options = {
    responsive: true,
    maintainAspectRatio: false
}


const ordersData = computed(() => {
    const stats = {};

    props.orders.forEach(order => {
        order.ordersDetails.forEach(orderdetail => {
            const key = `${orderdetail.catogoryName}`;
            if (!stats[key]) {
                stats[key] = {
                    categoryName: orderdetail.catogoryName,
                    totalQuantity: 0
                };
            }
            stats[key].totalQuantity += orderdetail.quantity;
        });
    });
    return Object.values(stats)
})
// 把物件轉矩陣  原本是stats = {"類別1": {categoryName: "類別1",totalQuantity: 50},"類別2": {categoryName: "類別2"totalQuantity: 30})
// 變成[{ categoryName: "類別3", totalQuantity: 70 },{categoryName: "類別1",totalQuantity: 50},

const data = computed(() => {
    return {
        labels: ordersData.value.map(item => item.categoryName), //把上面拿到的依序拿出來
        datasets: [
            {
                backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                data: ordersData.value.map((item) => item.totalQuantity) //把上面拿到的依序拿出來
            }
        ]
    }
})
</script>

<style scoped>

.ts-box{
    margin-top: 5px;
}
</style>
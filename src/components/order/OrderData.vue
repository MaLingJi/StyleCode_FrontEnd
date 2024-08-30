<template>
    <div class="ts-box">
        <table class="ts-table ">
            <thead>
                <tr>
                    <th>商品名稱</th>
                    <th>商品分類</th>
                    <th>銷售數量</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in ordersData" :key="item.productName">
                    <td>{{ item.productName }}</td>
                    <td>{{ item.categoryName }}</td>
                    <td>{{ item.totalQuantity }}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div>
        <Pie :data="data" :options="options" />
    </div>
</template>

<script setup>
import { computed, defineProps, isReactive, onMounted } from 'vue';

const props = defineProps(['orders']);

const options = {
    responsive: true,
    maintainAspectRatio: false
}

const ordersData = computed(() => {
    const stats = {};
    props.orders.forEach(order => {
        order.ordersDetails.forEach(orderdetail => {
            const key = `${orderdetail.productName}_${orderdetail.catogoryName}`;
            if (!stats[key]) {
                stats[key] = {
                    productName: orderdetail.productName,
                    categoryName: orderdetail.catogoryName,
                    totalQuantity: 0
                };
            }
            stats[key].totalQuantity += orderdetail.quantity;
        });
    });
    // { "產品A_類別1": { productName: "產品A", categoryName: "類別1", totalQuantity: 100 },
    //  "產品B_類別2": { productName: "產品B", categoryName: "類別2", totalQuantity: 75 } }
    //把他轉成[{ productName: "產品A", categoryName: "類別1", totalQuantity: 100 }, { productName: "產品B", categoryName: "類別2", totalQuantity: 75 }]
    return Object.values(stats).sort((a, b) => b.totalQuantity - a.totalQuantity);
})

// const data = computed(() => {
//     return {
//         //把orderData的catogoryName拿出來變成矩陣 順序不會變 所以跟下方的totalQuantity還是有對應關係
//         labels: ordersData.value.map(item => item.productName),
//         datasets: [
//             {
//                 backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
//                 data: ordersData.value.map((item) => item.totalQuantity)
//             }
//         ]
//     }
// })
</script>

<style></style>
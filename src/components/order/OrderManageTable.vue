<template>
    <div class="table-container">
        <table class="ts-table ">
            <thead>
                <tr>
                    <th>名稱</th>
                    <th>分類</th>
                    <th>數量</th>
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

    return Object.values(stats).sort((a, b) => b.totalQuantity - a.totalQuantity);
})


</script>

<style scoped>
.table-container {
    justify-content: center;
}

.ts-table {
    text-align: center;
}

.ts-table th,
.ts-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
}

.ts-table th {
    background-color: #f2f2f2;
    font-weight: bold;
}
</style>
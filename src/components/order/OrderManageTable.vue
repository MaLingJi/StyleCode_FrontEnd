<template>
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

<style></style>
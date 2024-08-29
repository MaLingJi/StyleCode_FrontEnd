<template>
    <div>
        <table>
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
        訂單產品種類分析圖
    </div>
</template>

<script setup>
import { computed, defineProps } from 'vue';


const props = defineProps(['orders']);

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
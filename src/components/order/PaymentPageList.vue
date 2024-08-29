<template>
    <div class="ts-box">
        <table class="ts-table " >
            <thead>
                <tr>
                    <th>商品資料</th>
                    <th>單件價格</th>
                    <th>數量</th>
                    <th>小計</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in cartItems" >
                    <td>{{ item.productName }}</td>
                    <td>{{ formatCurrency(item.productPrice) }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ formatCurrency(cauculate(item)) }}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th colspan="5">購物車：{{ cartItems.length }} 件</th>
                </tr>
            </tfoot>
        </table>
    </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue';
import { ref } from 'vue';
import { onMounted } from 'vue';
const props = defineProps(['cartItems']);
const emit = defineEmits(['update:carItems']);
const stockStatus = ref(new Map());

const cauculate = (item) => {
    return computed(() => item.productPrice * item.quantity).value;
};



onMounted(() => {
    props.cartItems.forEach(item => {
        stockStatus.value.set(item.productId, false);
    });
});

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD' }).format(amount);
};

</script>

<style>
.custom-number-input {

    /* 設置寬度 */
    width: 50px;
    /* 您可以根據需要調整這個值 */
}

.custom-number-input::-webkit-inner-spin-button,
.custom-number-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
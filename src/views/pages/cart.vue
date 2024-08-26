<template>
        <!DOCTYPE html>
        <html class="is-secondary">
        <div class="ts-container">
                <div class="ts-content" style="display: flex;justify-content: space-between; align-items: center;">
                        <span class="ts-text">圈圈123</span>
                </div>

                <div class="ts-box" style="margin-top: 20px;">
                        <div class="ts-content"
                                style="display: flex;justify-content: space-between; align-items: center;">
                                <span class="ts-text">已經是會員？登入後可以更方便管理訂單！</span>
                                <div class="ts-wrap">
                                        <button class="ts-button">會員登入</button>
                                        <button class="ts-button">要幹嘛</button>
                                </div>
                        </div>
                </div>
                <br>

                <CartList :cart-items="cartItems" @update:car-items="updateCartItems"></CartList>
                <div>
                        <h3>訂單總金額:{{ formatCurrency(totalAmount) }}</h3>
                        <button class="ts-button" @click="proceedPayment">Submit</button>
                </div>

        </div>



        </html>

</template>

<script setup>
import CartList from '@/components/CartList.vue';
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import router from '@/router/router';



const cartItems = ref([]);


const loadCartItems = async () => {
        try {
                const response = await axios.get('http://localhost:8080/cart/find/1');
                cartItems.value = response.data;
                console.log("Cart items loaded:", cartItems.value);
        } catch (error) {
                console.error('Failed to load cart items:', error);
        }
};

onMounted(loadCartItems);

const proceedPayment = async () => {
        try {
                console.log(cartItems.value);
                if (cartItems.value == '') {
                        alert('請先加入商品 購物車不能為空')
                        return
                }

                if (!confirm('確定要產生訂單嗎？')) return;

                console.log('totalamount' + totalAmount.value)

                const response = await axios.post('http://localhost:8080/order/admin/add', {
                        userId: 1,
                        totalAmounts: totalAmount.value // 使用計算屬性的值
                });
                console.log('Payment response:', response.data);
                if (response.data) { // 假設後端返回 success 字段
                        console.log('Payment successful');
                        // 這裡可以添加成功後的邏輯，比如跳轉到成功頁面
                        router.push('/order');
                } else {
                        console.log('Payment failed or stock issues');
                        // 重新加載購物車數據以更新庫存信息
                        await loadCartItems();
                }
        } catch (error) {
                console.error('Failed to process payment:', error);
                // 這裡可以添加錯誤處理邏輯，比如顯示錯誤消息給用戶
        }
};

const updateCartItems = (updatedItems) => {
        cartItems.value = updatedItems;
        console.log("updateValue:" + cartItems.value)
};



const totalAmount = computed(() => {
        let total = 0;
        for (const item of cartItems.value) {
                // 確保 price 和 quantity 存在且為數字
                const price = Number(item.productPrice)
                const quantity = Number(item.quantity)
                total += price * quantity;
                console.log(`Item: ${item.productName}, Price: ${price}, Quantity: ${quantity}, Subtotal: ${price * quantity}`);
        }
        console.log("Total amount:", total);
        return total;
});

const formatCurrency = (amount) => {
        return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD' }).format(amount);
};

</script>

<style></style>
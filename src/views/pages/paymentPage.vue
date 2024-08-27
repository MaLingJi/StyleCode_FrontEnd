<template>
    <!DOCTYPE html>
    <html class="is-secondary">

    <div class="ts-container">
        <div class="ts-content" style="display: flex;justify-content: space-between; align-items: center;">
            <span class="ts-text">圈圈2</span>
        </div>
    </div>

    <div class="ts-container">
        <div class="ts-box2">
            <div class="order-summary">
                <div class="summary-item total">合計: {{ formatCurrency(totalAmount) }}</div>
                <div class="summary-item">購物車共 {{ cartItems.length }} 件</div>
            </div>
            <button @click="toggleOrderDetails" class="ts-button">
                {{ showOrderDetails ? '隱藏訂單詳情' : '顯示訂單詳情' }}
            </button>
        </div>

        <div v-if="showOrderDetails">
            <OrderList :cart-items="cartItems" @update:car-items="updateCartItems"></OrderList>
        </div>


        <div>
            <!-- <h3>合計:{{ formatCurrency(totalAmount) }}</h3> -->
            <!-- <button class="ts-button" @click="proceedPayment">Submit</button> -->
            <button class="ts-button" @click="lpPayment">LinePay</button>
        </div>

    </div>

    </html>
</template>

<script setup>
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import OrderList from '@/components/OrderList.vue';




const cartItems = ref([]);
const showOrderDetails = ref(true);

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

const lpPayment = async () => {
    try {
        const paymentData = {
            totalAmounts: totalAmount.value,
            userId: 1,
            items: cartItems.value.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                productName: item.productName,
                productPrice: item.productPrice
            }))
        };
        console.log('Payment Data:', JSON.stringify(paymentData, null, 2));
        const response = await axios.post('http://localhost:8080/pay/linePayRequest', paymentData)

        console.log('Payment initiation response:', response.data);

        if (response.data) {
            // 重定向到 LINE Pay 支付頁面
            window.location.href = response.data
        } else {
            console.error('Failed to get payment URL');
        }
    } catch (error) {
        console.error('Failed to initiate payment:', error);

    };
}

const toggleOrderDetails = () => {
    showOrderDetails.value = !showOrderDetails.value;
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

<style>


.ts-box2 {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
}

.order-summary {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 15px;
}

.summary-item.total {
  font-size: 24px;
  font-weight: bold;
}
</style>
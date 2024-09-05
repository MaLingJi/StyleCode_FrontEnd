<template>
        <!DOCTYPE html>
        <html class="is-secondary">
        <div class="ts-container">
                <div class="ts-content" style="display: flex;justify-content: space-between; align-items: center;">
                        <Circle :current-step="1" />
                        <!-- <span class="ts-text">圈圈1</span> -->
                </div>

                <div v-if="!user" class="ts-box" style="margin-top: 20px;">
                        <div class="ts-content"
                                style="display: flex; justify-content: space-between;align-items: center;">
                                <span class="ts-text">已經是會員？登入後可以更方便管理訂單！</span>
                                <div class="ts-wrap">
                                        <RouterLink to="/secure/login"><button class="ts-button">會員登入</button>
                                        </RouterLink>
                                </div>
                        </div>
                </div>

                <!-- <div v-if="!isLoggedIn" class="ts-box" style="margin-top: 20px;">
                        <div class="ts-content login-box">
                                <span class="ts-text">已經是會員？登入後可以更方便管理訂單！</span>
                                <div class="ts-wrap">
                                        <button class="ts-button" @click="login">會員登入</button>
                                        <button class="ts-button" @click="register">註冊會員</button>
                                </div>
                        </div>
                </div> -->
                <br>

                <CartList :cart-items="cartItems" @update:car-items="updateCartItems"></CartList>
                <div>
                        <h3 style="text-align: right; margin-top: 10px;" >訂單總金額:{{ formatCurrency(totalAmount) }}</h3>
                </div>
                <div style="text-align: right; margin-top: 10px;">
                        <RouterLink to="/shop"><button class="ts-button" style="margin-right: 10px;">繼續選購</button></RouterLink>
                        <!-- <button class="ts-button" @click="proceedPayment">Submit</button> -->
                        <button class="ts-button" @click="checkInventoryAndProceed"
                                >前往付款</button>
                </div>

        </div>



        </html>

</template>

<script setup>
import CartList from '@/components/order/CartList.vue';
import axiosapi from '@/plugins/axios.js';
import { computed, onMounted, ref } from 'vue';
import router from '@/router/router';
import Circle from '@/components/order/Circle.vue';
import useUserStore from "@/stores/user.js"
import Swal from 'sweetalert2';



const cartItems = ref([]);
const user = useUserStore().userId
// const isLoggedIn = ref(false);  // 新增：用於追蹤登入狀態

const loadCartItems = async () => {
        try {
                const response = await axiosapi.get(`/cart/find/${user}`);
                cartItems.value = response.data;

                console.log("Cart items loaded:", cartItems.value);
        } catch (error) {
                console.error('Failed to load cart items:', error);
        }
};

onMounted(loadCartItems);



const updateCartItems = (updatedItems) => {
        cartItems.value = updatedItems;
        console.log(" After update Value: " + JSON.stringify(cartItems.value))
};



const totalAmount = computed(() => {
        let total = 0;
        for (const item of cartItems.value) {
                // 確保 price 和 quantity 存在且為數字
                const price = Number(item.productPrice)
                const quantity = Number(item.quantity)
                total += price * quantity;
        }
        console.log("Total amount:", total);
        return total;
});

const formatCurrency = (amount) => {
        return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD' }).format(amount);
};


const checkInventoryAndProceed = async () => {
        try {
                // 調用檢查庫存的 API
                const response = await axiosapi.post('/cart/checkStock', {
                        items: cartItems.value.map(item => ({
                                productDetailsId: item.productDetailsId,
                                quantity: item.quantity,
                        }))
                })
                console.log('cartItem:' + cartItems.value)
                if (cartItems.value == '') {
                        Swal.fire({
                                icon: 'error',
                                title: '提交失敗',
                                text: '購物車不得為空',
                                confirmButtonText: '確認',
                                confirmButtonColor: 'rgb(35 40 44)',
                                showConfirmButton: true
                        })
                        return
                }
                if (response.data === 'ok') {
                        Swal.fire({
                                title: '讀取中...',
                                allowOutsideClick: false,
                                timer: 1000,
                                showConfirmButton: false,
                                didOpen: () => {
                                        Swal.showLoading();
                                }
                        }).then((result) => {
                                // 確保 SweetAlert 的計時器結束後才執行路由跳轉
                                if (result.dismiss === Swal.DismissReason.timer) {
                                        router.push('/payment')
                                }
                        })
                }
                else {
                        Swal.fire({
                                icon: 'error',
                                title: '加入購物車失敗',
                                text: '庫存不足',
                                showConfirmButton: false,
                                timer: 1000,
                                timerProgressBar: true,
                        })
                }
        } catch (error) {
                console.error('檢查庫存時發生錯誤:', error)
                alert('檢查庫存時發生錯誤，請稍後再試。')
        }
}



</script>

<style scoped>
.progress-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 300px;
        margin-bottom: 20px;
}

.step {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: #ccc;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        color: white;
}

.step.active {
        background-color: #007bff;
}

.line {
        flex-grow: 1;
        height: 2px;
        background-color: #ccc;
        margin: 0 10px;
}

.line.active {
        background-color: #007bff;
}
</style>
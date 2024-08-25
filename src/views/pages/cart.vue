<template>
        <!DOCTYPE html>
        <html class="is-secondary">
        <div class="ts-container">
                <div class="ts-content"
                style="display: flex;justify-content: space-between; align-items: center;">
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

                <CartList :cart-items="cartItems"></CartList>

        </div>
        <!-- <div>
                <ul>
                        <li v-for="item in cartItems" :key="item.id">
                                {{ item.productName}} - {{ item.productPrice }}-{{ item.quantity }}
                        </li>
                </ul>

        </div> -->

        </html>

</template>

<script setup>
import CartList from '@/components/CartList.vue';
import axios from 'axios';
import { ref } from 'vue';




const cartItems = ref([]);

axios.get('http://localhost:8080/cart/find/1')
        .then(response => {
                cartItems.value = response.data;
                console.log(response.data)
        })
        .catch(error => {
                console.error('Failed to load cart items')
        })

</script>

<style></style>
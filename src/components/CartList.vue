<template>
    <div class="ts-box">
        <table class="ts-table">
            <thead>
                <tr>
                    <th class="text-center">商品資料</th>
                    <th>單件價格</th>
                    <th>數量</th>
                    <th>小計</th>
                    <th>刪除按鈕</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in cartItems" :key="item.productId">
                    <td>{{ item.productName }}</td>
                    <td>{{ item.productPrice }}</td>

                    <td>
                        <div>
                            <div>
                                <!-- 要加判斷數量變0自動移除 -->
                                <button @click="decreaseQuantity(item)" :disabled="item.quantity < 1"
                                    class="ts-icon is-minus-icon"></button>
                                <input v-model.number="item.quantity" type="number" min="1" class="custom-number-input"
                                    @input="updateQuantity(item)">
                                <button @click="increaseQuantity(item)" class="ts-icon is-plus-icon"></button>
                            </div>
                            <div>
                                判斷庫存
                            </div>
                        </div>
                    </td>
                    <td>NT${{ cauculate(item) }}</td>
                    <td><button @click="removeItem(item)" class="ts-icon is-close-icon">X</button></td>
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
import axios from 'axios';

const props = defineProps(['cartItems']);
const emit = defineEmits(['update:carItems'])

const cauculate = (item) => {
    return computed(() => item.productPrice * item.quantity).value;
};

const updateParent = () => {
    emit('update:carItems', [...props.cartItems]);
}

const increaseQuantity = (item) => {

    // increase api
    axios.post('http://localhost:8080/cart/addOneVol', {

        userId: 1,
        productId: item.productId

    })
        .then(response => {
            console.log(response.data)
            if (response != null) {
                item.quantity++;
                updateParent();
            } else {
                console.log('超過庫存')
            }

        })
        .catch(error => {
            console.error('Failed to load cart items' + error)
        })
}

const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
        axios.post('http://localhost:8080/cart/minusOneVol', {
            cartId: {
                userId: 1,
                productId: item.productId
            }
        }).then(response => {
            if (response != null) {
                item.quantity--;
                updateParent();
            }
        }).catch(error => {
            console.error('Failed to load cart items' + error)
        })
    }
    else {
        removeItem(item);
    }
}


const updateQuantity = (item) => {
    if (item.quantity <= 0) {
        removeItem(item);
    } else {
        // updateapi     判
    }
    updateParent();
}

const removeItem = (item) => {
    if (!confirm('確定要從購物車移除此商品嗎？')) return;

    axios.delete('http://localhost:8080/cart/delete', {
        data:{userId: 1,
        productId: item.productId}
    }).then(response => {
        console.log(response);
        if (response != null) {
            const index = props.cartItems.indexOf(item);
            if (index > -1) {
                props.cartItems.splice(index, 1);
            }
            updateParent();
        }
    }).catch(error => {
        console.error('Failed to load cart items' + error)
    })



}




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
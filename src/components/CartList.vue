<template>
    <div class="ts-box">
        <table class="ts-table ">
            <thead>
                <tr>
                    <th>商品資料</th>
                    <th>單件價格</th>
                    <th>數量</th>
                    <th>小計</th>
                    <th class="is-collapsed">刪除按鈕</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in cartItems">
                    <td>{{ item.productName }}</td>
                    <td>{{ formatCurrency(item.productPrice) }}</td>

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
                                <span v-show="stockStatus.get(item.productId)">已達庫存上限</span>
                            </div>
                        </div>
                    </td>
                    <td>{{ formatCurrency(cauculate(item)) }}</td>
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
// import axios from 'axios';
import axiosapi from '@/plugins/axios.js';
import { ref } from 'vue';
import { onMounted } from 'vue';
const props = defineProps(['cartItems']);
const emit = defineEmits(['update:carItems']);
const stockStatus = ref(new Map());

const cauculate = (item) => {
    return computed(() => item.productPrice * item.quantity).value;
};

const updateParent = () => {
    emit('update:carItems', [...props.cartItems]);
}

const increaseQuantity = (item) => {

    // increase api
    axiosapi.post('/cart/addOneVol', {

        userId: 1,
        productId: item.productId

    })
        .then(response => {
            console.log(response.data)
            console.log(response);
            if (response.data != '') {
                item.quantity++;
                updateParent();
                stockStatus.value.set(item.productId, false)
            } else {
                console.log('超過庫存')
                stockStatus.value.set(item.productId, true)
            }

        })
        .catch(error => {
            console.error('Failed to load cart items' + error)
        })
}

const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
        axiosapi.post('/cart/minusOneVol', {
            cartId: {
                userId: 1,
                productId: item.productId
            }
        }).then(response => {
            if (response.data != '') {
                item.quantity--;
                updateParent();
                stockStatus.value.set(item.productId, false)
            } else {
                console.log('超過庫存')
                stockStatus.value.set(item.productId, true)
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
        axiosapi.put('/cart/update', {
            userId: 1,
            productId: item.productId,
            quantity: item.quantity

        }).then(response => {
            if (response.data != '') {
                updateParent();
                stockStatus.value.set(item.productId, false)
            } else {
                stockStatus.value.set(item.productId, true)
            }
        }).catch(error => {
            console.error('Failed to load cart items' + error)
        })
    }
    updateParent();
}

const removeItem = (item) => {
    if (!confirm('確定要從購物車移除此商品嗎？')) return;

    axiosapi.delete('/cart/delete', {
        data: {
            userId: 1,
            productId: item.productId
        }
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
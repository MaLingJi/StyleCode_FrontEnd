<template>
    <div class="ts-box">
        <table class="ts-table ">
            <thead>
                <tr>
                    <th>照片</th>
                    <th>商品資料</th>
                    <th>單件價格</th>
                    <th>數量</th>
                    <th>小計</th>
                    <th class="is-collapsed">刪除按鈕</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in cartItems" style="vertical-align: middle;">
                    <td><img :src="getImageUrl(findImgUrl(item.productDetailsId))" style="width: 50px;"/></td>
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
                                <span v-show="stockStatus.get(item.productDetailsId)"
                                    class="ts-text is-negative">已達庫存上限</span>
                            </div>
                        </div>
                    </td>
                    <td>{{ formatCurrency(cauculate(item)) }}</td>
                    <td><button @click="removeItem(item)" class="ts-icon is-close-icon">X</button></td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th colspan="6">購物車：{{ cartItems.length }} 件</th>
                </tr>
            </tfoot>
        </table>
    </div>
</template>

<script setup>
import { computed, defineProps, defineEmits, isReactive } from 'vue';
import axiosapi from '@/plugins/axios.js';
import { ref } from 'vue';
import { onMounted } from 'vue';
import useUserStore from "@/stores/user.js"

const props = defineProps(['cartItems']);
const emit = defineEmits(['update:carItems']);
const stockStatus = ref(new Map());
const user = useUserStore().userId
const pdPhotos = ref([])

const cauculate = (item) => {
    return computed(() => item.productPrice * item.quantity).value;
};

const updateParent = () => {
    emit('update:carItems', [...props.cartItems]);
}

const increaseQuantity = (item) => {

    // increase api
    axiosapi.post('/cart/addOneVol', {

        userId: user,
        productDetailsId: item.productDetailsId

    })
        .then(response => {
            console.log(response.data)
            console.log(response);
            if (response.data != '') {
                item.quantity++;
                updateParent();
                stockStatus.value.set(item.productDetailsId, false)
            } else {
                console.log('超過庫存')
                stockStatus.value.set(item.productDetailsId, true)
            }

        })
        .catch(error => {
            console.error('Failed to load cart items' + error)
        })
}

const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
        axiosapi.post('/cart/minusOneVol', {
            userId: user,
            productDetailsId: item.productDetailsId
        }).then(response => {
            if (response.data != '') {
                item.quantity--;
                updateParent();
                stockStatus.value.set(item.productDetailsId, false)
            } else {
                console.log('超過庫存')
                stockStatus.value.set(item.productDetailsId, true)
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
            userId: user,
            productDetailsId: item.productDetailsId,
            quantity: item.quantity

        }).then(response => {
            console.log('update response' + response.data)
            if (response.data != '') {
                updateParent();
                stockStatus.value.set(item.productDetailsId, false)
            } else {
                stockStatus.value.set(item.productDetailsId, true)
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
            userId: user,
            productDetailsId: item.productDetailsId
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

onMounted(async () => {
    props.cartItems.forEach(item => {
        stockStatus.value.set(item.productDetailsId, false);
    });

    //把接過來的props先用API找到封面照片放進pdPhotos 並設定對應的id跟照片
        for (const item of props.cartItems) {
            try {
                const response = await axiosapi.get(`/${item.productDetailsId}/cover`);
                console.log('responsecover'+response.data)
                pdPhotos.value.push({ id: item.productDetailsId, url: response.data.imgUrl })
                console.log('pdphotos'+pdPhotos.value)
            }
            catch (error) {
                console.error('pdphotosWrong' + error)
            }
        }
    }
);

//貨幣加工
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD' }).format(amount);
};

//當cartlist用 cartitem迴圈時 拿pdPhotos內的id跟cartItem的id 若有相同就回傳
const findImgUrl = (productDetailsId) => {
    const photo = pdPhotos.value.find(photo => photo.id === productDetailsId)
    return photo ? photo.url : null;
}
// 把找到的商品名稱路徑加上全域路徑
const getImageUrl = (imageName) => {
    const path = import.meta.env.VITE_PRODUCT_IMAGE_URL;
    if (imageName) {
        return `${path}${imageName}`;
    }
    return "../../../public/No_image.png";
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
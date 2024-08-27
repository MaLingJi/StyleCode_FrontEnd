<template>
    <div>
        <p v-if="isLoading">正在確認支付結果...</p>
        <p v-if="status === 'success'">支付成功！正在跳轉到訂單頁面...</p>
        <p v-if="status === 'error'">支付失敗：{{ errorMessage }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axiosapi from '@/plugins/axios.js';

const route = useRoute()
const router = useRouter()
const isLoading = ref(true)
const status = ref('')
const errorMessage = ref('')

onMounted(async () => {
    const orderId = route.query.orderId
    if (!orderId) {
        status.value = 'error'
        errorMessage.value = '未找到訂單 ID'
        isLoading.value = false
        return
    }

    try {
        const response = await axiosapi.get(`pay/linePayConfirm?orderId=${orderId}`)
        status.value = response.data.status
        if (status.value === 'success') {
            // 支付成功，跳轉到訂單頁面
            setTimeout(() => router.push(`/order`), 3000)
        } else {
            errorMessage.value = `錯誤代碼：${response.data.errorCode}`
        }
    } catch (error) {
        status.value = 'error'
        errorMessage.value = '確認支付狀態時發生錯誤'
    } finally {
        isLoading.value = false
    }
})
</script>
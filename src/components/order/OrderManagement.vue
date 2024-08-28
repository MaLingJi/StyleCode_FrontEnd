<template>
    <div class="dashboard">
        <div class="date-picker">
            <DatePicker v-model="range" is-range @input="fetchOrders" />
        </div>
        <div>
            <<!-- Your other content here -->>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import axiosapi from '@/plugins/axios.js';

const range = ref({
    start: new Date(),
    end: new Date()
});



const fetchOrders = async () => {
    if (!range.value.start || !range.value.end) return;

    try {
        const response = await axiosapi.get(`/order/findByDate`, {
            params: {
                startDate: formatDate(range.value.start),
                endDate: formatDate(range.value.end)
            }
        });
        console.log(response.data);
        // 处理返回的数据
    } catch (error) {
        console.error('fetchOrderByDateFail', error);
    }
};


const formatDate = (date) => {
    if (date instanceof Date) {
        return date.toISOString().slice(0, 19);  // 返回格式为 "YYYY-MM-DDTHH:mm:ss"
    }
    // if (typeof date === 'string') {
    //     // 如果日期已经是字符串，确保格式正确
    //     return date.replace(' ', 'T').slice(0, 19);
    // }
    console.error('Invalid date format');
    return '';
};

// 监听日期变化
watch(range, () => {
    fetchOrders();
}, { deep: true });

</script>

<style scoped>
/* 您的样式 */
</style>
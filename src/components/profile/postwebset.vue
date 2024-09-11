<template>
    <div>
    <h2>檢舉列表</h2>
    <ul>
        <li v-for="(report, index) in reports" :key="index">
        <strong>文章 ID:</strong> {{ report.postId }} | 
        <strong>檢舉類型:</strong> {{ report.violationType }} | 
        <strong>補充說明:</strong> {{ report.description }}
        </li>
    </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const reports = ref([]);

onMounted(() => {
    const reportsData = localStorage.getItem('reports');
    console.log('讀取的數據:', reportsData);
    
    if (reportsData) {
    try {
        const parsedData = JSON.parse(reportsData);
        console.log('解析後的數據:', parsedData);
        
        if (Array.isArray(parsedData)) {
        reports.value = parsedData;
        } else {
        console.error('解析後的數據不是數組:', parsedData);
        }
    } catch (error) {
        console.error('解析 JSON 時出錯:', error);
    }
    }
});
</script>
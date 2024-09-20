<template>
    <div>
      <h2>檢舉列表</h2>
      <p>路由參數: {{ $route.params }}</p>
      <p>當前 postId: {{ postId }}</p>
      <p>檢舉總數: {{ reports.length }}</p>
      <p>過濾後的檢舉數量: {{ filteredReports.length }}</p>
      <ul>
        <li v-for="(report, index) in filteredReports" :key="index">
          <strong>文章 ID:</strong> {{ report.postId }} | 
          <strong>檢舉類型:</strong> {{ report.violationType }} | 
          <strong>補充說明:</strong> {{ report.description }}
        </li>
      </ul>
      <p v-if="filteredReports.length === 0">目前沒有相關的檢舉資料。</p>
    </div>
  </template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router'; 

const reports = ref([]);
const route = useRoute(); 
const postId = computed(() => {
  const id = route.params.id;
  console.log('Route params:', route.params);
  console.log('Raw id from route:', id, typeof id);
  return id ? parseInt(id, 10) : null;
});

onMounted(() => {
  const reportsData = localStorage.getItem('reports');
  if (reportsData) {
    try {
      const parsedData = JSON.parse(reportsData);
      console.log('Parsed reports data:', parsedData);
      reports.value = parsedData.map(report => ({
        ...report,
        postId: Number(report.postId)
      }));
      console.log('Processed reports:', reports.value);
    } catch (error) {
      console.error('Error parsing reports data:', error);
    }
  }
});

// 計算屬性來過濾報告
    const filteredReports = computed(() => {
        console.log('Computed postId:', postId.value, typeof postId.value);
  if (postId.value === null) {
    console.warn('Invalid or missing postId');
    return [];
  }
  return reports.value.filter(report => Number(report.postId) === postId.value);
});
</script>

<style scoped>

</style>
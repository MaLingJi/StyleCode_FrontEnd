<template>
    <div>
        <h2>檢舉列表</h2>
        <ul>
            <li v-for="(report, index) in reports" :key="index">
                檢舉類型: {{ report.violationType }} - 補充說明: {{ report.description }}
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            reports: []
        }
    },
    mounted() {
        // 從 Local Storage 讀取檢舉數據
        const reportsData = localStorage.getItem('reports');
        if (reportsData) {
            this.reports = JSON.parse(reportsData);
        }
    }
}
</script>
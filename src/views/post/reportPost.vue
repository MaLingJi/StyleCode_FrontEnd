<template>
    <div class="report-container">
        <h2>檢舉貼文</h2>
        <form @submit.prevent="submitReport">
            <div class="ts fluid form">
                <div class="field">
                    <label for="violationType">違反類型</label>
                    <select v-model="violationType" id="violationType" class="ts dropdown">
                        <option value="">選擇違規類型</option>
                        <option>仇恨或歧視性言論</option>
                        <option>散布不實信息</option>
                        <option>侵犯隱私</option>
                        <option>侵犯版權</option>
                        <option>垃圾信息</option>
                        <option>騷擾或威脅</option>
                        <option>暴力或自殘內容</option>
                        <option>成人內容或色情</option>
                    </select>
                </div>
                <br><br>
                <div class="field">
                    <label for="description">補充說明 (選填)</label>
                    <textarea v-model="description" id="description" rows="4" class="ts textarea" placeholder="請提供更多信息..."></textarea>
                </div>

                <button type="submit" class="ts primary button">提交檢舉</button>
            </div>
        </form>
        <p v-if="submitted">檢舉理由: {{ violationType }} - {{ description }}</p>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const violationType = ref('');
const description = ref('');
const submitted = ref(false);

const submitReport = () => {
    console.log('選擇的違反類型:', violationType.value); 

    // 檢查是否選擇了違反類型
    if (!violationType.value) {
        alert('請選擇違反類型'); 
        return; 
    }

    // 準備要存儲的檢舉數據
    const reportData = {
        violationType: violationType.value,
        description: description.value,
    };

    // 將數據存儲到 Local Storage
    let reports = JSON.parse(localStorage.getItem('reports')) || [];
    reports.push(reportData);
    localStorage.setItem('reports', JSON.stringify(reports));

    alert(`您已檢舉貼文，違反類型: ${violationType.value}, 補充說明: ${description.value}`);
    
    // 清空表單
    violationType.value = '';
    description.value = '';
};
</script>

<style scoped>
.report-container {
    max-width: 800px; 
    margin: 30px auto; 
    padding: 60px;
    border: 1px solid #d9d9d9;
    border-radius: 8px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    min-height: 600px; /* 設置最小高度，根據需要進行調整 */
}
.ts.form {
    margin-bottom: 20px; /* 每個表單組的底部邊距 */
}
.ts.dropdown {
    width: 100%; 
    height: 40px; 
    font-size: 16px; 
    padding: 8px; 
    border: 1px solid #d9d9d9; 
    border-radius: 4px; 
}
.ts.textarea {
    width: 100%; 
    height: 100px; /* 增加文本區域的高度 */
    font-size: 16px; 
    padding: 8px; 
    border: 1px solid #d9d9d9; 
    border-radius: 4px; 
}
.ts.primary.button {
    background-color: #007bff; 
    color: white; 
    border: none; 
    padding: 10px 20px; 
    border-radius: 4px; 
    cursor: pointer; 
}
.ts.primary.button:hover {
    background-color: #0056b3; 
}
</style>
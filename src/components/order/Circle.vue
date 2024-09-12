<template>
    <div class="progress-bar">
        <div class="step">
            <div class="circle" :class="{ active: currentStep >= 1 }">1</div>
            <div class="label">購物車</div>
        </div>
        <div class="connector">
            <div class="line"></div>
        </div>
        <div class="step">
            <div class="circle" :class="{ active: currentStep >= 2 }">2</div>
            <div class="label">確認訂單</div>
        </div>
        <div class="connector">
            <div class="line"></div>
        </div>
        <div class="step">
            <div class="circle" :class="{ active: currentStep >= 3 }">3</div>
            <div class="label">付款</div>
        </div>
    </div>
</template>
<!-- 依照頁面傳來的數字決定圈圈顏色要不要變 -->
<script setup>
const props = defineProps({
    currentStep: {
        type: Number,
        default: 1
    }
});
</script>

<style scoped>
.progress-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 600px;
    margin: 20px auto;
}

.step {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80px;
}

.circle {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    color: white;
    margin-bottom: 8px;
}

.connector {
    flex-grow: 1;
    display: flex;
    align-items: center;
    padding: 0 10px;
}

.line {
    width: 100%;
    height: 2px;
    background-color: #ccc;
}

.label {
    font-size: 12px;
    text-align: center;
    color: #666;
}

.circle.active {
    background-color: rgb(84, 94, 190)
}
</style>
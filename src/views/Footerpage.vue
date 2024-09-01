<template>
  <div class="footer-content ">
    <div class="footer-section">
      <h3>Follow us</h3>
      <a href="#"><i class="fab fa-facebook"></i></a>
      <a href="#"><i class="fab fa-instagram"></i></a>
    </div>
    <div class="footer-section">
      <h3>We accept</h3>
      <!-- <img src="../../public/LINE-Pay(v)_W85_n.png" alt="LinePay" width="35"> -->
      <img src="https://resources.easystore.co/website/images/partners/partner-logo/mono/logo-line-pay.png" alt="LinePay" width="50">
      <img src="https://rasky.com/wp-content/uploads/2020/07/Mastercard-logo-black-and-white.png" alt="Mastercard" width="50">
    </div>
    <!-- <div class="footer-section"> -->
      <!-- <h3>Quick links</h3> -->
      <!-- Add your quick links here -->
    <!-- </div> -->
    <div class="footer-section">
      <h3>Our purpose</h3>
      <p>Quality materials, good designs, craftsmanship and sustainability.</p>
    </div>
  </div>
  <div class="footer-bottom">
    <p>版權所有 © 2024 ispan</p>
    <button>服務條款</button> | <button>隱私政策</button> | <button>退換政策</button> | <button>回饋金說明</button> | <button>出貨幫助</button>
    <br><br>
  </div>

</template>
    
<script setup>
    
</script>
    
<style>
    a {
    color: darkgray;
    text-decoration: underline;
     text-decoration: none;
}

footer {
  flex-shrink: 0; /* 防止footer被压缩 */
  background-color: #f8f8f8;
  padding: 20px 0;
  font-family: Arial, sans-serif;
  width: 100%; /* 确保footer占满宽度 */
}

/* 其余的footer样式保持不变 */
.footer-content {
  display: flex;
  justify-content: space-around;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-section {
  flex: 1;
  padding: 0 15px;
}

.footer-section h3 {
  font-size: 16px;
  margin-bottom: 10px;
}

.footer-bottom {
  text-align: center;
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid #ddd;
}

.footer-bottom p {
  font-size: 12px;
  color: #666;
}

button {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  color: inherit;
  text-decoration: none;
  
}

button:hover {
  text-decoration: underline;
}
</style>
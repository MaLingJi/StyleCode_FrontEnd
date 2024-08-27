<template>
    <div class="ts-container product-details">
      <div class="ts-content is-tertiary is-vertically-padded">
        <div class="ts-container">
          <div class="ts-header is-big is-heavy">新增商品</div>
          <div class="ts-text is-secondary">添加新的商品到您的商店。</div>
        </div>
      </div>
  
      <div class="ts-divider"></div>
  
      <div class="ts-container has-vertically-padded-big">
        <div class="ts-grid is-relaxed">
          <div class="column is-12-wide">
            <div class="ts-box">
              <form @submit.prevent="submitProduct">
                <div class="ts-content">
                  <div class="ts-grid">
                    <div class="column is-16-wide">
                      <div class="ts-text is-label">商品名称</div>
                      <div class="ts-input has-top-spaced">
                        <input type="text" v-model="product.productName" required />
                      </div>
                    </div>
                    <div class="column is-16-wide">
                      <div class="ts-grid is-relaxed is-4-columns has-top-spaced">
                        <div class="column">
                          <div class="ts-text is-label">价格</div>
                          <div class="ts-input is-start-labeled has-top-spaced">
                            <span class="label">$</span>
                            <input type="number" v-model="product.price" required />
                          </div>
                        </div>
                        <div class="column">
                          <div class="ts-text is-label">库存</div>
                          <div class="ts-input has-top-spaced">
                            <input type="number" v-model="product.stock" required />
                          </div>
                        </div>
                        <div class="column">
                          <div class="ts-text is-label">尺寸</div>
                          <div class="ts-input has-top-spaced">
                            <input type="text" v-model="product.size" required />
                          </div>
                        </div>
                        <div class="column">
                          <div class="ts-text is-label">颜色</div>
                          <div class="ts-input has-top-spaced">
                            <input type="text" v-model="product.color" required />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="column is-16-wide">
                      <div class="ts-text is-label">商品描述</div>
                      <div class="ts-textarea has-top-spaced">
                        <textarea v-model="product.productDescription" rows="4" required></textarea>
                      </div>
                    </div>
                    <div class="column is-16-wide">
                      <div class="ts-text is-label">上传图片</div>
                      <div class="ts-input has-top-spaced">
                        <input type="file" @change="handleFileUpload" multiple accept="image/*" />
                      </div>
                    </div>
                    <div class="column is-16-wide" v-if="previewImages.length > 0">
                      <div class="ts-grid is-4-columns has-top-spaced">
                        <div class="column" v-for="(image, index) in previewImages" :key="index">
                          <div class="ts-image">
                            <img :src="image" alt="Preview" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="ts-content">
                  <button class="ts-button is-positive" type="submit">添加商品</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axiosapi from '@/plugins/axios.js';
  
  const product = ref({
    productName: '',
    price: null,
    stock: null,
    size: '',
    color: '',
    productDescription: '',
  });
  
  const previewImages = ref([]);
  const uploadedFiles = ref([]);
  
  const handleFileUpload = (event) => {
    const files = event.target.files;
    uploadedFiles.value = Array.from(files);
    previewImages.value = [];
  
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImages.value.push(e.target.result);
      };
      reader.readAsDataURL(files[i]);
    }
  };
  
  const submitProduct = async () => {
    try {
      const formData = new FormData();
      formData.append('product', JSON.stringify(product.value));
      
      uploadedFiles.value.forEach((file, index) => {
        formData.append(`image${index}`, file);
      });
  
      const response = await axiosapi.post('/admin/products/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      console.log('Product created:', response.data);
      // 清空表单或重定向到商品列表页面
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };
  </script>
  
  <style scoped>
  /* 可以添加任何特定的样式 */
  </style>
<template>
    <div class="ts-container has-vertically-spaced-large">
        <div class="ts-grid">
            <div class="column is-fluid">
                <div class="cell is-fluid is-vertical">
                    <div class="ts-grid">
                        <div class="ts-image">
                            <img :src="userPhoto" width="40">
                        </div>
                        <div class="ts-header">{{ userName }}</div>
                    </div>
                    <div class="ts-divider"></div>
                    <div class="ts-text is-heavy is-big">標題</div>
                    <div class="ts-input is-solid">
                        <textarea v-model="postTitle" placeholder="請輸入文章標題"></textarea>
                    </div>
                    <div class="ts-text is-heavy is-big">內容</div>
                    <div class="ts-input is-solid">
                        <textarea v-model="contentText" placeholder="請輸入文章內容"></textarea>
                    </div>
                    <div class="ts-text is-heavy is-big">上傳圖片</div>
                    <div class="ts-file">
                        <input class="ts-input" type="file" @change="handleFileUpload" accept="image/*" multiple />
                    </div>

                    <div class="image-previews">
                        <div v-for="(image, index) in filteredImages" :key="index" class="image-preview"
                            @mouseover="hoverIndexPreview = index" @mouseleave="hoverIndexPreview = null">
                            <img :src="image.previewUrl || getImageUrl(image.imgUrl)" alt="Preview Image" />
                            <div class="image-controls" v-if="hoverIndexPreview === index">
                                <i class="ts-icon is-pen-to-square-icon" @click="editImage(index)"></i>
                                <i class="ts-icon is-trash-can-icon" @click="removeImage(image, index)"></i>
                            </div>
                        </div>
                    </div>

                    <br>
                    <button class="ts-button" @click="submitPost">更新文章</button>
                </div>
                <div>{{ imageFiles.value }}</div>

            </div>
            <div class="column is-3-wide">
                <div class="cell is-vertical">
                    <div class="ts-text is-heavy is-big">單品分享</div>

                    <!-- 新增或編輯單品表單 -->
                    <div v-if="showProductForm" class="product-form">
                        <div class="ts-input is-underlined">
                            <input type="text" v-model="newProduct.productName" placeholder="商品名稱"
                                @focus="showSuggestions = true" @blur="handleBlur" />
                        </div>

                        <ul v-if="showSuggestions && filteredSuggestions.length > 0" class="suggestions">
                            <li v-for="(suggestion, index) in filteredSuggestions" :key="index"
                                @click="selectSuggestion(suggestion)" class="suggestion-item">
                                {{ suggestion.productName }}
                            </li>
                        </ul>

                        <!-- 分類選擇 -->
                        <div class="ts-select is-underlined">
                            <select v-model="selectedCategoryId" @change="updateSubcategories">
                                <option value="">請選擇分類</option>
                                <option v-for="category in categories" :key="category.categoryId"
                                    :value="category.categoryId">
                                    {{ category.categoryName }}
                                </option>
                            </select>

                        </div>

                        <!-- 子分類選擇 -->
                        <div class="ts-select is-underlined" v-if="subcategories.length > 0">
                            <select v-model="newProduct.subcategoryId">
                                <option value="">請選擇子分類</option>
                                <option v-for="subcategory in subcategories" :key="subcategory.subcategoryId"
                                    :value="subcategory.subcategoryId">
                                    {{ subcategory.subcategoryName }}
                                </option>
                            </select>
                        </div>

                        <div class="ts-wrap is-center-aligned">
                            <button class="ts-button is-primary" @click="isEditing ? updateProduct() : addProduct()">
                                {{ isEditing ? '更新' : '新增' }}
                            </button>
                            <button class="ts-button is-secondary" @click="cancelProductForm">取消</button>
                        </div>
                    </div>

                    <!-- 顯示已新增的單品 -->
                    <div class="product-list" v-if="productTags.length">
                        <div class="ts-card" v-for="(product, index) in productTags" :key="index"
                            @mouseover="hoverIndexProduct = index" @mouseleave="hoverIndexProduct = null">
                            <div class="ts-content is-center-aligned">
                                <p>商品: {{ product.productName }}</p>
                                <p>分類: {{ product.subcategoryName }}</p>

                                <!-- 編輯與刪除按鈕 -->
                                <div class="product-controls" v-if="hoverIndexProduct === index">
                                    <button class="edit-button" @click="editProduct(index)">
                                        <span class="ts-icon is-pen-to-square-icon"></span>
                                    </button>
                                    <button class="delete-button" @click="deleteProduct(index)">
                                        <span class="ts-icon is-trash-can-icon"></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br>
                    <!-- 新增按鈕 -->
                    <div v-if="!showProductForm">
                        <button class="ts-button" @click="startAddProduct">+ 新增單品</button>
                    </div>

                    <div class="ts-text is-heavy is-big">標籤</div>
                    <div class="ts-input is-underlined">
                        <input type="text" placeholder="搜尋標籤…" v-model="inputTagValue" @blur="addTag" />
                    </div>
                    <div v-for="(tag, index) in tags" :key="index" class="ts-chip is-dense is-outlined"
                        @mouseover="hoverIndexTags = index" @mouseleave="hoverIndexTags = null">
                        <span class="ts-label">
                            {{ tag }}
                        </span>
                        <!-- 叉叉按鈕 -->
                        <button v-if="hoverIndexTags === index" class="delete-tag" @click="removeTag(index)">
                            &times;
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axiosapi from '@/plugins/axios.js';
import Swal from 'sweetalert2';
import useUserStore from "@/stores/user.js"

const userPhotoPath = import.meta.env.VITE_USER_IMAGE_URL;
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const postTitle = ref('');
const contentText = ref('');
const imageFiles = ref([]); // 用于存储已存在的图片和新上传的图片
const newImages = ref([]);  // 用于存储新上传的图片
const deletedImages = ref([]);  // 用于存储标记为删除的图片
const path = import.meta.env.VITE_POST_IMAGE_URL;
const hoverIndexTags = ref(null);
const hoverIndexPreview = ref(null); // 用於圖片預覽
const hoverIndexProduct = ref(null); // 用於商品資訊
const inputTagValue = ref('');
const tags = ref([]);
const userName = ref('');
const userPhoto = ref('');
const editingImageIndex = ref(null); // 用來追蹤正在編輯的圖片索引

const isEditing = ref(false);
const editingIndex = ref(null);
const showProductForm = ref(false);
const post = ref({});
const productTags = ref([]);
const categories = ref([]);
const subcategories = ref([]);
const selectedCategoryId = ref(null);

const products = ref([]); // 存储所有商品数据
const showSuggestions = ref(false);
const productSuggestions = ref([]);

const newProduct = ref({
    productName: '',
    categoryId: null,
    categoryName: '',
    subcategoryId: null,
    subcategoryName: ''
});

function updateSubcategories() {
    const selectedCategory = categories.value.find(category => category.categoryId === selectedCategoryId.value);
    subcategories.value = selectedCategory ? selectedCategory.subcategories : [];

    if (selectedCategory) {
        newProduct.value.categoryId = selectedCategory.categoryId;
        newProduct.value.categoryName = selectedCategory.categoryName;
    } else {
        newProduct.value.categoryId = null;
        newProduct.value.categoryName = '';
    }
}

function editProduct(index) {
    isEditing.value = true;
    showProductForm.value = true;
    editingIndex.value = index;
    newProduct.value = { ...productTags.value[index] };
}

function updateProduct() {
    if (editingIndex.value !== null) {
        productTags.value[editingIndex.value].productName = newProduct.value.productName;
        productTags.value[editingIndex.value].subcategoryName = newProduct.value.subcategoryName;
    }
    resetForm();
}

function cancelProductForm() {
    resetForm();
}

function resetForm() {
    isEditing.value = false;
    showProductForm.value = false;
    editingIndex.value = null;
    newProduct.value = {
        productName: '',
        categoryId: null,
        categoryName: '',
        subcategoryId: null,
        subcategoryName: ''
    };
}

function deleteProduct(index) {
    productTags.value.splice(index, 1);
}

function startAddProduct() {
    showProductForm.value = true;
    isEditing.value = false;
    editingIndex.value = null;
}

function addProduct() {
    if (newProduct.value.productName && newProduct.value.subcategoryId) {
        productTags.value.push({
            ...newProduct.value,
            subcategoryName: subcategories.value.find(sub => sub.subcategoryId === newProduct.value.subcategoryId)?.subcategoryName
        });
        resetForm();
    } else {
        console.warn('Product name or subcategory is missing');
    }
}

const request = {
    headers: {
        Authorization: "Bearer " + userStore.userToken,
    },
};

function addTag() {
    if (inputTagValue.value.trim() !== '') {
        tags.value.push(inputTagValue.value.trim());
        inputTagValue.value = '';
    }
}

function removeTag(index) {
    tags.value.splice(index, 1); // 从 tags 列表中删除对应的标签
}

const loadPostData = async (id) => {
    try {
        const response = await axiosapi.get(`/post/${id}`);
        post.value = response.data;
        postTitle.value = post.value.postTitle;
        contentText.value = post.value.contentText;
        imageFiles.value = post.value.images || [];
        tags.value = post.value.postTags.map(tag => tag.tagName);
        productTags.value = post.value.productTags;
    } catch (error) {
        console.error('加载文章数据时出错：', error);
    }
};

onMounted(() => {
    const postId = route.params.postId;
    if (postId) {
        loadPostData(postId);
    }

    axiosapi.get(`/member/profile/${userStore.userId}`, request)
        .then(response => {
            userName.value = response.data.userDetail.userName;
            userPhoto.value = userPhotoPath + response.data.userDetail.userPhoto;
        })
        .catch(error => {
            console.error('Error fetching URL:', error);
        });

    axiosapi.get('/categories')
        .then(catagoryResponse => {
            categories.value = catagoryResponse.data;
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
        });
});

async function fetchProductSuggestions() {
  const subcategoryId = newProduct.value.subcategoryId;
  if (!subcategoryId) {
    productSuggestions.value = [];
    return;
  }

  try {
    const response = await axiosapi.get(`/products/subcategory/${subcategoryId}`);
    productSuggestions.value = response.data;
  } catch (error) {
    console.error('Error fetching product suggestions:', error);
  }
}

const filteredSuggestions = computed(() => {
  if (!newProduct.value.productName) {
    // 如果输入框为空，显示前四个商品
    return productSuggestions.value.slice(0, 4);
  }

  const query = newProduct.value.productName.toLowerCase();
  return productSuggestions.value.filter(product =>
    product.productName.toLowerCase().includes(query)
  );
});

function selectSuggestion(suggestion) {
  newProduct.value.productName = suggestion.productName;
  showSuggestions.value = false;
}

function handleBlur() {
  // 设置一个延迟，让点击事件有时间触发
  setTimeout(() => {
    showSuggestions.value = false;
  }, 100);
}

watch(
  () => newProduct.value.subcategoryId,
  (newValue) => {
    if (newValue) {
      fetchProductSuggestions();
    } else {
      productSuggestions.value = [];
    }
  }
);

watch(
  () => newProduct.value.productName,
  (newValue) => {
    if (newValue) {
      showSuggestions.value = true;
    }
  }
);

// 確保顯示所有已存在且未被標記為刪除的圖片以及新上傳的圖片
const filteredImages = computed(() => {
    return [
        ...imageFiles.value.filter(image => !image.deletedAt),
        ...newImages.value
    ];
});

const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            newImages.value.push({
                file,
                previewUrl: e.target.result
            });
        };
        reader.readAsDataURL(file); // 開始讀取文件
    });
};

const removeImage = (image, index) => {
    if (image.imageId) {
        // 標記已存在的圖片為刪除
        deletedImages.value.push(image.imageId);
        // 從原有的圖片列表中刪除該圖片
        imageFiles.value = imageFiles.value.filter(img => img.imageId !== image.imageId);
    } else {
        // 對於新上傳的圖片，直接從 newImages 列表中刪除
        newImages.value.splice(index - imageFiles.value.length, 1);
    }
};

const getImageUrl = (imgUrl) => {
    return `${path}${imgUrl}`;
};

function editImage(index) {
    editingImageIndex.value = index;
    document.querySelector('input[type="file"]').click(); // 触发文件选择器
}

function submitPost() {
    if (!postTitle.value || !contentText.value) {
        Swal.fire({
            text: '标题和内容不能为空',
            icon: 'warning',
            confirmButtonColor: 'rgb(35 40 44)',
            confirmButtonText: '确认',
        });
        return;
    }

    Swal.fire({
        text: "更新文章中...",
        showConfirmButton: false,
        allowOutsideClick: false,
    });

    const unifiedPostTags = tags.value.map(tag => {
        return { tagName: tag.tagName || tag }; // 保留或转化成 { tagName: '...' } 格式
    });

    const putData = {
        postDTO: {
            postTitle: postTitle.value,
            contentText: contentText.value,
            contentType: 'share',
            userId: userStore.userId,
            productTags: productTags.value,
            postTags: unifiedPostTags
        }
    };

    axiosapi.put(`/post/postwithtags/${route.params.postId}`, putData)
        .then(postResponse => {
            const postId = postResponse.data.postId;

            // 软删除标记为删除的图片
            if (deletedImages.value.length > 0) {
                return Promise.all(deletedImages.value.map(imageId => {
                    return axiosapi.delete(`/images/${imageId}`);
                }));
            }
        })
        .then(() => {
            // 上传新的图片
            if (newImages.value.length > 0) {
                const formData = new FormData();
                formData.append('postId', route.params.postId);
                newImages.value.forEach(file => {
                    formData.append('file', file.file);
                });

                return axiosapi.post("/images", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
        })
        .then(() => {
            Swal.close();
            Swal.fire({
                text: '更新成功',
                icon: 'success',
                confirmButtonColor: 'rgb(35 40 44)',
                confirmButtonText: '確認',
            }).then(() => {
                router.push(`/shareDetails/${route.params.postId}`); // 跳转到文章详情页
            });
        })
        .catch(error => {
            Swal.close();
            Swal.fire({
                text: '更新失敗：' + error.message,
                icon: 'error',
                confirmButtonColor: 'rgb(35 40 44)',
                confirmButtonText: '確認',
            });
        });
}
</script>

<style scoped>
.ts-chip {
    /* display: flex; */
    flex-wrap: wrap;
    position: relative;
    /* 設置相對定位，以便定位叉叉按鈕 */
    display: inline-block;
    /* 使每個 chip 獨立顯示 */
    margin: 4px;
    /* 添加一點間距 */
}

.ts-label {
    /* background-color: #9d7e7e; */
    padding: 1px 1px;
    border-radius: 10px;
    white-space: nowrap;
    /* margin-bottom: 8px; */
}

.image-previews {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.image-preview {
    position: relative;
    width: 100px;
    height: 100px;
}

.image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
}

.image-controls {
    position: absolute;
    top: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    gap: 5px;
    padding: 5px;
    border-radius: 5px;
    cursor: pointer;
}

.product-form {
    margin-top: 1rem;
}

.product-list {
    margin-top: 1rem;
}

.ts-button.is-circle {
    border-radius: 10px;
    width: 40px;
    height: 40px;
    font-size: 24px;
}

.ts-card {
    margin-top: 1rem;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
}

.ts-content.is-center-aligned {
    white-space: normal;
    /* 允許內容自動換行 */
    word-wrap: break-word;
    /* 長單詞換行 */
    overflow-wrap: break-word;
    /* 使長字串在必要時換行 */
    text-align: center;
    /* 內容置中對齊 */
}

p {
    margin: 0;
    /* 消除 p 元素默認的外邊距 */
    overflow-wrap: anywhere;
    /* 強制在任何需要的地方換行 */
}

.delete-tag {
    position: absolute;
    top: 50%;
    right: 5px;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: red;
    font-size: 14px;
    cursor: pointer;
    display: none;
    /* 默認不顯示 */
}

.ts-chip:hover .delete-tag {
    display: inline;
    /* 滑鼠移入時顯示 */
}

.suggestions {
  border: 1px solid #ccc;
  max-height: 150px;
  overflow-y: auto;
  margin-top: 5px;
  background-color: white;
  list-style-type: none;
  padding-left: 0;
}

.suggestion-item {
  padding: 5px 10px;
  cursor: pointer;
}

.suggestion-item:hover {
  background-color: #eee;
}
</style>

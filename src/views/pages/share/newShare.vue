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
                        <!-- <div class="te-text">{{ productTags }}</div> -->
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
                        <div v-for="(image, index) in imageFiles" :key="index" class="image-preview"
                            @mouseover="hoverIndexImages = index" @mouseleave="hoverIndexImages = null">
                            <img :src="image.previewUrl" alt="Preview Image" />
                            <div class="image-controls" v-if="hoverIndexImages === index">
                                <i class="ts-icon is-pen-to-square-icon" @click="editImage(index)"></i>
                                <i class="ts-icon is-trash-can-icon" @click="removeImage(index)"></i>
                            </div>
                        </div>
                    </div>

                    <br>
                    <button class="ts-button" @click="submitPost">送出文章</button>
                </div>
                <!-- <div>{{ categories }}</div> -->
            </div>
            <div class="column is-3-wide">
                <div class="cell is-vertical">
                    <div class="ts-text is-heavy is-big">單品分享</div>

                    <!-- 新增或編輯單品表單 -->
                    <div v-if="showProductForm" class="product-form">
                        <div class="ts-input is-underlined">
                            <input type="text" v-model="newProduct.productName" placeholder="商品名稱" />
                        </div>

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
                            @mouseover="hoverIndexImages = index" @mouseleave="hoverIndexImages = null">
                            <div class="ts-content is-center-aligned">
                                <p>商品: {{ product.productName }}</p>
                                <p>分類: {{ product.subcategoryName }}</p>

                                <!-- 編輯與刪除按鈕 -->
                                <div class="product-controls" v-if="hoverIndexImages === index">
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
                    {{ tags }}
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axiosapi from '@/plugins/axios.js';
import Swal from 'sweetalert2';
import useUserStore from "@/stores/user.js"

const userPhotoPath = import.meta.env.VITE_USER_IMAGE_URL;
const router = useRouter();
const userStore = useUserStore();

const postTitle = ref('');
const contentText = ref('');
const imageFiles = ref([]);
const hoverIndexTags = ref(null);
const hoverIndexImages = ref(null);
const inputTagValue = ref('');
const tags = ref([]);
const userName = ref('');
const userPhoto = ref('');
const editingImageIndex = ref(null); // 用來追蹤正在編輯的圖片索引

const isEditing = ref(false);
const editingIndex = ref(null);
// 控制顯示/隱藏新增單品表單
const showProductForm = ref(false);

// 存儲單品資料
const productTags = ref([]);

const categories = ref([]);
const subcategories = ref([]);
const selectedCategoryId = ref(null);

// 新增的單品資料
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

    // 更新 newProduct 中的 categoryId 和 categoryName
    if (selectedCategory) {
        newProduct.value.categoryId = selectedCategory.categoryId;
        newProduct.value.categoryName = selectedCategory.categoryName;
    } else {
        newProduct.value.categoryId = null;
        newProduct.value.categoryName = '';
    }
}


// 編輯單品
function editProduct(index) {
    isEditing.value = true;
    showProductForm.value = true;
    editingIndex.value = index;
    newProduct.value = { ...productTags.value[index] };
}

// 更新單品
function updateProduct() {
    if (editingIndex.value !== null) {
        productTags.value[editingIndex.value].productName = newProduct.value.productName;
        productTags.value[editingIndex.value].subcategoryName = newProduct.value.subcategoryName;
    }
    resetForm();
}

// 取消新增/編輯
function cancelProductForm() {
    resetForm();
}

// 重置表單
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

// 刪除單品
function deleteProduct(index) {
    productTags.value.splice(index, 1);
}

// 開始新增單品
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
    tags.value.splice(index, 1); // 從 tags 列表中刪除對應的標籤
}

onMounted(() => {
    axiosapi.get(`/member/profile/${userStore.userId}`, request)
        .then(response => {
            userName.value = response.data.userDetail.userName;
            userPhoto.value = userPhotoPath + response.data.userDetail.userPhoto;
            // console.log("userId: ", userPhoto.value);
        })
        .catch(error => {
            console.error('Error fetching URL:', error);
        });

    axiosapi.get('/categories')
        .then(catagoryResponse => {
            categories.value = catagoryResponse.data;
            console.log("Categories:", categories.value);
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
        });
});

function handleFileUpload(event) {
    const files = Array.from(event.target.files); // 获取多个文件
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (editingImageIndex.value !== null) {
                // 如果正在编辑，更新相应的图片
                imageFiles.value[editingImageIndex.value] = {
                    file,
                    previewUrl: e.target.result,
                };
                editingImageIndex.value = null; // 重置编辑索引
            } else {
                // 否则，添加新的图片
                imageFiles.value.push({
                    file,
                    previewUrl: e.target.result,
                });
            }
        };
        reader.readAsDataURL(file);
    });
}

function removeImage(index) {
    imageFiles.value.splice(index, 1);
}

function editImage(index) {
    editingImageIndex.value = index;
    document.querySelector('input[type="file"]').click(); // 觸發文件選擇器
}

function submitPost() {
    if (!postTitle.value || !contentText.value) {
        Swal.fire({
            text: '標題和內容不能為空',
            icon: 'warning',
            confirmButtonText: '確認',
        });
        return;
    }

    if (imageFiles.value.length === 0) {
        Swal.fire({
            text: '至少上傳一張圖片',
            icon: 'warning',
            confirmButtonText: '確認',
        });
        return;
    }

    Swal.fire({
        text: "發文中......",
        showConfirmButton: false,
        allowOutsideClick: false,
    });

    const postData = {
        postDTO: {
            postTitle: postTitle.value,
            contentText: contentText.value,
            contentType: 'share',
            userId: userStore.userId,
            productTags: productTags.value,
            postTags: tags.value.map(tag => ({
                tagId: null, // 如果是新標籤，tagId 可以設為 null，後端會自動生成
                postId: null, // 這裡 postId 也可以設為 null 或後端自行生成
                tagName: tag
            }))
        }
        
    };

    console.log("postData", postData);

    // 1. 先發送發文請求
    axiosapi.post("/post/postwithtags", postData)
        .then(postResponse => {
            console.log("postResponse.data: ", postResponse.data)
            const postId = postResponse.data.postId;
            console.log('User ID: ', userStore.userId);
            console.log('Post ID: ', postId);
            // 2. 如果有圖片，發送圖片上傳請求
            if (imageFiles.value.length > 0) {
                const formData = new FormData();
                formData.append('postId', postId);
                imageFiles.value.forEach(file => {
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
                text: '發文成功',
                icon: 'success',
                confirmButtonText: '確認',
            }).then(() => {
                router.push('/share'); // 跳轉到文章列表頁面或其他頁面
            });
        })
        .catch(error => {
            Swal.close();
            Swal.fire({
                text: '發文失敗：' + error.message,
                icon: 'error',
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
</style>

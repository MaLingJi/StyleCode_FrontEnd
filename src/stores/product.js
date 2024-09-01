import { defineStore } from 'pinia'
import axiosapi from "@/plugins/axios.js"

// 定義並導出產品存儲
export const useProductStore = defineStore('product', {
   // 定義存儲的狀態
  state: () => ({
    allProducts: [],        // 所有產品
    searchResults: [],      // 搜索結果
    currentProducts: [],    // 當前顯示的產品
    selectedCategoryId: null,    // 選中的類別 ID
    selectedSubcategoryId: null, // 選中的子類別 ID
    sortOption: '',         // 排序選項
    currentPage: 1,         // 當前頁碼
    itemsPerPage: 18,       // 每頁顯示的商品數量
    productImages: {},      // 存儲商品圖片的對象
  }),

   // 定義存儲的操作（actions）
  actions: {
     // 獲取所有產品
    async fetchAllProducts() {
      try {
        const response = await axiosapi.get("/products/filter");
        this.allProducts = response.data;
        this.currentProducts = this.allProducts;
        await this.fetchProductImages(this.currentProducts);
      } catch (error) {
        console.error("Error fetching all products:", error);
      }
    },
      // 搜索產品
    async searchProducts(query) {
      try {
        const response = await axiosapi.get(`/products/search/${query}`);
        this.searchResults = response.data;
        this.currentProducts = this.searchResults;
        this.currentPage = 1;
        await this.fetchProductImages(this.currentProducts);
      } catch (error) {
        console.error('Error searching products:', error);
      }
    },
     // 根據類別獲取產品
    async fetchProductsByCategory(categoryId) {
      try {
        const response = await axiosapi.get(`/products/filter?categoryId=${categoryId}`);
        this.currentProducts = response.data;
        this.selectedCategoryId = categoryId;
        this.selectedSubcategoryId = null;
        this.currentPage = 1;
        await this.fetchProductImages(this.currentProducts);
      } catch (error) {
        console.error("Error fetching products by category:", error);
      }
    },
        // 根據子類別獲取產品
    async fetchProductsBySubcategory(categoryId, subcategoryId) {
      try {
        const response = await axiosapi.get(`/products/filter?categoryId=${categoryId}&subcategoryId=${subcategoryId}`);
        this.currentProducts = response.data;
        this.selectedCategoryId = categoryId;
        this.selectedSubcategoryId = subcategoryId;
        this.currentPage = 1;
        await this.fetchProductImages(this.currentProducts);
      } catch (error) {
        console.error("Error fetching products by subcategory:", error);
      }
    },
    // 排序產品
    async sortProducts() {
      try {
        let url = '/products/sort';
        if (this.selectedCategoryId) {
          url = `/products/category/${this.selectedCategoryId}/sort`;
        } else if (this.selectedSubcategoryId) {
          url = `/products/subcategory/${this.selectedSubcategoryId}/sort`;
        }
        url += `?direction=${this.sortOption === 'priceAsc' ? 'ASC' : 'DESC'}`;
        
        const response = await axiosapi.get(url);
        this.currentProducts = response.data;
        this.currentPage = 1;
        await this.fetchProductImages(this.currentProducts);
      } catch (error) {
        console.error("Error sorting products:", error);
      }
    },
   // 獲取產品圖片
    async fetchProductImages(products) {
      for (let product of products) {
        if (!this.productImages[product.productId]) {
          try {
            const response = await axiosapi.get(`/${product.productId}/cover`);
            this.productImages[product.productId] = response.data.imgUrl;
          } catch (error) {
            console.error(`Error fetching cover image for product ${product.productId}:`, error);
            this.productImages[product.productId] = null; // 設置為 null 表示獲取失敗
          }
        }
      }
    },
      // 設置當前頁碼
    setPage(page) {
      this.currentPage = page;
    },
    // 清除搜索結果
    clearSearchResults() {
      this.searchResults = [];
      this.currentProducts = this.allProducts;
    },
  },
     // 定義存儲的計算屬性（getters）
  getters: {
    getPaginatedProducts: (state) => {
      const startIndex = (state.currentPage - 1) * state.itemsPerPage; // 計算當前頁的起始索引
      const endIndex = startIndex + state.itemsPerPage; // 計算當前頁的結束索引
      return state.currentProducts.slice(startIndex, endIndex).map(product => ({
        ...product, // 從所有產品中截取當前頁的產品 ， 函數遍歷這些產品 ， 使用展開運算符複製原產品的所有屬性
        coverImage: state.productImages[product.productId]  // 添加封面圖片屬性
      }));
    },
      // 計算總頁數
    getPageCount: (state) => {
      return Math.ceil(state.currentProducts.length / state.itemsPerPage);  // Math.ceil() 函數向上取整，確保即使最後一頁不滿，也會被計算為一頁。
    },
  },
})
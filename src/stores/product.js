import { defineStore } from 'pinia'
import axiosapi from "@/plugins/axios.js"

export const useProductStore = defineStore('product', {
  state: () => ({
    allProducts: [],
    searchResults: [],
    currentProducts: [],
    selectedCategoryId: null,
    selectedSubcategoryId: null,
    sortOption: '',
    currentPage: 1,
    itemsPerPage: 18,
    productImages: {}, // 新增：用於存儲商品圖片的對象
  }),
  actions: {
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
    // 新增：獲取商品圖片的方法
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
    setPage(page) {
      this.currentPage = page;
    },
    clearSearchResults() {
      this.searchResults = [];
      this.currentProducts = this.allProducts;
    },
  },
  getters: {
    getPaginatedProducts: (state) => {
      const startIndex = (state.currentPage - 1) * state.itemsPerPage;
      const endIndex = startIndex + state.itemsPerPage;
      return state.currentProducts.slice(startIndex, endIndex).map(product => ({
        ...product,
        coverImage: state.productImages[product.productId] // 添加 coverImage 屬性
      }));
    },
    getPageCount: (state) => {
      return Math.ceil(state.currentProducts.length / state.itemsPerPage);
    },
  },
})
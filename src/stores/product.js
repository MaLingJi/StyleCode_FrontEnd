import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    allProducts: [],
    searchResults: [],
  }),
  actions: {
    setAllProducts(products) {
      this.allProducts = products;
    },
    setSearchResults(results) {
      this.searchResults = results;
    },
    clearSearchResults() {
      this.searchResults = [];
    },
  },
})
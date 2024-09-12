import { ref, provide, inject, readonly } from 'vue'
import axiosapi from "@/plugins/axios.js";

const CartSymbol = Symbol()

//在全域的地方使用
export function provideCart() {
    const cartItemCount = ref(0)

    const fetchCartCount = async (userId) => {
        if (userId) {
            try {
                const response = await axiosapi.get(`/cart/find/${userId}`)
                cartItemCount.value = response.data.length
            } catch (error) {
                console.error('Failed to fetch cart count:', error)
            }
        }
    }

    const updateCartCount = (newCount) => {
        cartItemCount.value = newCount
    }
    //透過provide將上方函數與CartSymbol關聯起來
    provide(CartSymbol, {
        cartItemCount: readonly(cartItemCount),
        fetchCartCount,
        updateCartCount
    })
}

//在要使用的地方使用這個 以inject此可以關聯使用上方函數
export function useCart() {
    const cart = inject(CartSymbol)
    if (!cart) {
        throw new Error('Cart not provided')
    }
    return cart
}
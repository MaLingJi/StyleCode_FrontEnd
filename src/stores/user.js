// import { defineStore } from "pinia";
// import { ref } from "vue";

// const user = defineStore("user",function(){
//     const userId = ref("");
//     const userToken = ref("");
//     const permissions = ref("");
//     const isLogedin = ref(false);

//     function setUserId(data){
//         userId.value = data;
//     }
//     function setPermissions(data){
//         permissions.value = data;
//     }
    
//     function setUserToken(data){
//         userToken.value = data;
//     }
//     function setLogedin(data){
//         isLogedin.value = data;
//     }

//     return{
//         userId, setUserId, isLogedin, setLogedin, userToken, setUserToken, permissions, setPermissions}
// }, {
//         persist:{
//             storage: localStorage,
//             paths:["userId", "isLogedin", "userToken", "permissions"]
//         }
    
// });

// export default user;




// stores/user.js
import { defineStore } from 'pinia'

export const user = defineStore('user', {
    state: () => ({
        userId: "",
        userToken: "",
        permissions: "",
        isLogedin: false,
        expirationTime: null,
    }),
    getters: {
        isAdmin: (state) => state.permissions === "Admin",
        isSessionExpired: (state) => state.expirationTime && new Date() > new Date(state.expirationTime)
    },
    actions: {
        setUserId(userId) {
            this.userId = userId
        },
        setUserToken(userToken) {
            this.userToken = userToken
        },
        setPermissions(permissions) {
            this.permissions = permissions
        },
        setLogedin(isLogedin) {
            this.isLogedin = isLogedin
        },
        setExpirationTime(expirationTime) {
            this.expirationTime = expirationTime
        },
        checkSession() {
            if (this.isSessionExpired) {
                this.logout()
            }
        },
        logout() {
            
            this.userId = ""
            this.userToken = ""
            this.permissions = ""
            this.isLogedin = false
            this.expirationTime = null
            localStorage.clear()
        }
},
persist: {
    storage: localStorage,
    paths: ["userId", "isLogedin", "userToken", "permissions", "expirationTime"]
}
})

export default user;
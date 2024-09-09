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
        isSessionExpired: (state) => {
            const curentime = new Date()
            const expirationTime = new Date(state.expirationTime);
            console.log("Current time:", curentime);
            console.log("Expiration time:", expirationTime);

            return state.expirationTime && new Date() > new Date(state.expirationTime)}
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
            }else {
                console.log("Session is still valid.");
            }
        },
        logout() {
            console.log("logout....")
            this.userId = "";
            this.userToken = "";
            this.permissions = "";
            this.isLogedin = false;
            this.expirationTime = null;

            // 同時刪除 localStorage 中的數據
            localStorage.removeItem('userId');
            localStorage.removeItem('userToken');
            localStorage.removeItem('permissions');
            localStorage.removeItem('isLogedin');
            localStorage.removeItem('expirationTime');
        }
},
persist: {
    storage: localStorage,
    paths: ["userId", "isLogedin", "userToken", "permissions", "expirationTime"]
}
})

export default user;
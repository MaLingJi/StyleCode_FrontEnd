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
import Swal from "sweetalert2";

export const user = defineStore('user', {
    state: () => ({
        userId: "",
        userToken: "",
        permissions: "",
        isLogedin: false,
        expirationTime: null,
        isThirdPartyLogin: false,
        sessionCheckInterval: null, // 定時器
    }),
    getters: {
        isAdmin: (state) => state.permissions === "Admin",
        
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
        setThirdPartyLogin(isThirdPartyLogin) {
            this.isThirdPartyLogin = isThirdPartyLogin
        },
        isSessionExpired () {
            const curentime = new Date()
            const expirationTime = new Date(this.expirationTime);
            console.log("Current time:", curentime);
            console.log("Expiration time:", expirationTime);

            return this.expirationTime && curentime > expirationTime
        },
        checkSession() {
            if (this.isSessionExpired()) {
                this.logout()
                Swal.fire({
                    icon: "warning",
                    title: "登入逾時",
                    text: "將返回首頁",
                    confirmButtonColor: "rgb(35 40 44)",
                    confirmButtonText: "確認",
                    allowOutsideClick: false,
                  }).then((result) => {
                    if (result.isConfirmed) {
                      // 按下確認後跳轉到首頁
                      window.location.href = "/";
                    }
                  });
            }else {
                console.log("Session is still valid.");
            }
        },
        startSessionCheck() {
            if (!this.sessionCheckInterval) {
              this.sessionCheckInterval = setInterval(() => this.checkSession(), 5 * 60 * 1000);
            }
          },
          stopSessionCheck() {
            if (this.sessionCheckInterval) {
              clearInterval(this.sessionCheckInterval);
              this.sessionCheckInterval = null;
            }
        },
        logout() {
            console.log("logout....")
            this.userId = "";
            this.userToken = "";
            this.permissions = "";
            this.isLogedin = false;
            this.expirationTime = null;
            this.isThirdPartyLogin = false;

            // 同時刪除 localStorage 中的數據
            localStorage.removeItem('userId');
            localStorage.removeItem('userToken');
            localStorage.removeItem('permissions');
            localStorage.removeItem('isLogedin');
            localStorage.removeItem('expirationTime');
            localStorage.removeItem('isThirdPartyLogin');
            this.stopSessionCheck();
        }
},
persist: {
    storage: localStorage,
    paths: ["userId", "isLogedin", "userToken", "permissions", "expirationTime","isThirdPartyLogin"]
}
})

export default user;
import { defineStore } from "pinia";
import { ref } from "vue";

const user = defineStore("user",function(){
    const userId = ref("");
    const userToken = ref("");
    const permissions = ref("");
    const isLogedin = ref(false);

    function setUserId(data){
        userId.value = data;
    }
    function setPermissions(data){
        permissions.value = data;
    }
    
    function setUserToken(data){
        userToken.value = data;
    }
    function setLogedin(data){
        isLogedin.value = data;
    }

    return{
        userId, setUserId, isLogedin, setLogedin, userToken, setUserToken, permissions, setPermissions}
}, {
        persist:{
            storage: localStorage,
            paths:["userId", "isLogedin", "userToken", "permissions"]
        }
    
});

export default user;
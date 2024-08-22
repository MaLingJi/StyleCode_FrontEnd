<template>
    <div class="ts-content is-padded is-secondary">
        <div class="ts-container ">
            <div class="ts-grid is-middle-aligned">
                <div class="column is-fluid">
                    <div class="ts-wrap is-middle-aligned">
                        <RouterLink to="/" class="ts-text is-undecorated"><img src="/favicon.ico" width="45px">
                        </RouterLink>
                        <RouterLink to="/share" class="ts-text is-undecorated is-big">穿搭</RouterLink>
                        <RouterLink to="/forum" class="ts-text is-undecorated is-big">論壇</RouterLink>
                        <RouterLink to="/shop" class="ts-text is-undecorated is-big">商城</RouterLink>
                        <RouterLink to="/backstage" class="ts-text is-undecorated is-big">後台</RouterLink>
                    </div>
                </div>
                <div class="column">
                    <div class="ts-wrap">
                        <div class="ts-input is-start-icon">
                            <span class="ts-icon is-angle-down-icon" data-dropdown="dropdown"></span>
                            <div class="ts-dropdown " id="dropdown">
                                <button class="item">文章</button>
                                <button class="item">商城</button>
                            </div>
                            <input type="text" placeholder="搜尋文章(商城)...">
                        </div>
                    </div>
                </div>
                <div class="column">
                    <div class="ts-wrap">
                        <a class="ts-text is-undecorated" href="#!"><span
                                class="ts-icon is-cart-shopping-icon is-big"></span></a>
                        <a class="ts-text is-undecorated" href="#!"><span
                                class="ts-icon is-bell-icon is-big"></span></a>
                        <a class="ts-text is-undecorated" data-dropdown="dropdown" href="#!"><span
                                class="ts-icon is-user-icon is-big"></span></a>
                        <div class="ts-dropdown" id="dropdown">
                            <button class="item">新增檔案</button>
                            <button class="item">移至回收桶</button>
                            <button class="item">登出</button>
                        </div>
                        <RouterLink to="/secure/login" class="ts-button is-circular is-outlined">登入</RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="ts-divider"></div>

</template>

<script setup>

</script>

<style scoped></style>
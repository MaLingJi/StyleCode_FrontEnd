<template>

    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" />

        <title>募資平台 - Tocas UI</title>
    </head>

    <body>
        <div class="ts-content is-padded is-secondary">
            <div class="ts-container ">
                <div class="ts-grid">
                    <div class="column is-fluid">
                        <div class="ts-wrap">
                            <RouterLink to="/" class="ts-text is-undecorated"><img src="../../public/favicon.ico"
                                    width="45px"></RouterLink>
                            <RouterLink to="/forum" class="ts-text is-undecorated is-big">論壇</RouterLink>
                            <RouterLink to="/shop" class="ts-text is-undecorated is-big">商城</RouterLink>
                            <RouterLink to="/backstage" class="ts-text is-undecorated is-big">後台</RouterLink>
                            <!-- <a class="ts-text is-undecorated" href="#"><img src="../../public/favicon.ico"
                                width="45px"></a>
                        <a class="ts-text is-undecorated is-big" href="#">論壇</a>
                        <a class="ts-text is-undecorated is-big" href="#">商城</a> -->
                        </div>
                    </div>
                    <div class="column is-narrow">
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
                                <button class="item">檢視資訊</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="ts-divider"></div>

    </body>

</template>

<script setup>

</script>

<style scoped></style>
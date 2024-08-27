<template>
    <div class="ts-app-layout is-fullscreen is-horizontal">
        <div class="cell has-dark" style="width: 240px; color: var(--ts-white)">
            <div class="ts-content is-center-aligned">
                <div class="ts-wrap is-vertical is-compact is-middle-aligned">
                    <div class="ts-image is-circular">
                        <img src="C:/StyleCode_Image/UserPhoto/user.png" width="80"  data-dialog="modal"/>
                    </div>
                    <div class="ts-header">Yami Odymel</div>
                </div>
            </div>
            <div class="ts-divider"></div>
            <div class="ts-content is-dense">
                <div class="ts-grid">
                    <div class="column is-fluid">
                        <div class="ts-text is-bold">使用者資訊</div>
                    </div>
                    <div class="column">
                        <span class="ts-icon is-users-icon"></span>
                    </div>
                </div>
            </div>
            <div class="ts-menu is-dense is-small" style="opacity: 0.8">
                <a class="item" @click="switchComps(userProfile)">個人資料</a>
                <a class="item" @click="switchComps(card)">信用卡資訊</a>
                <a href="#!" class="item">修改密碼</a>
            </div>
            <div class="ts-divider has-top-spaced-small"></div>
            <div class="ts-content is-dense">
                <div class="ts-grid">
                    <div class="column is-fluid">
                        <div class="ts-text is-bold">商城</div>
                    </div>
                    <div class="column">
                        <span class="ts-icon is-cogs-icon"></span>
                    </div>
                </div>
            </div>
            <div class="ts-menu is-dense is-small" style="opacity: 0.8">
                <a class="item">購買清單</a>
            </div>
            <div class="ts-divider has-top-spaced-small"></div>
            <a href="#!" class="ts-content is-interactive is-dense">
                <div class="ts-grid">
                    <div class="column is-fluid">
                        <div class="ts-text is-bold">管理文章</div>
                    </div>
                    <div class="column">
                        <span class="ts-icon is-newspaper-icon"></span>
                    </div>
                </div>
            </a>
            <div class="ts-menu is-dense is-small" style="opacity: 0.8">
                <a href="#!" class="item">我的文章</a>
                <a href="#!" class="item">收藏文章</a>
            </div>
        </div>
        <div class="cell is-fluid is-scrollable is-secondary">
            <div class="ts-container is-narrow has-vertically-padded-large">
                <component :is="currentComp"></component>
                
            </div>
        </div>
    </div>
    <dialog class="ts-modal is-large" id="modal">
                        <div class="content">
                            <div class="ts-content">
                                <div class="ts-grid">
                                    <div class="column is-fluid">
                                        <div class="ts-header">使用者照片</div>
                                    </div>
                                    <div class="column">
                                        <button class="ts-close is-large is-secondary" data-dialog="modal"></button>
                                    </div>
                                </div>
                            </div>
                            <div class="ts-divider"></div>
                            <div class="ts-content is-center-aligned">
                                <div class="ts-wrap is-vertical is-compact is-middle-aligned">
                                    <div class="ts-image is-circular">
                                        <img src="C:/StyleCode_Image/UserPhoto/user.png" width="200"  data-dialog="modal"/>
                                    </div>
                                        <div class="ts-content">
                                        <div class="ts-file">
                                            <input type="file" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="ts-divider"></div>
                            <div class="ts-content is-tertiary">
                                <div class="ts-wrap is-end-aligned">
                                    <button class="ts-button">確定</button>
                                    <button class="ts-button is-outlined">取消</button>
                                </div>
                            </div>
                        </div>
                    </dialog>
</template>

<script setup>
    import userProfile from '@/components/profile/userProfile.vue';
    import card from '@/components/profile/card.vue';

    import { shallowRef } from 'vue';
    const currentComp = shallowRef(userProfile);
    function switchComps(comp){
        currentComp.value = comp;
    }
</script>

<style scoped>

</style>
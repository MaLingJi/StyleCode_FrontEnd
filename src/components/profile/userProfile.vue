<template>
  <div class="ts-grid header-title is-middle-aligned is-spaced-between">
    <div class="ts-header is-huge is-heavy">會員資料</div>
    <button class="ts-button is-start-icon" data-dialog="updateProfileModal">
      <span class="ts-icon is-pen-icon"></span>
      修改資料
    </button>
  </div>
  <div class="ts-box is-raised is-top-indicated">
    <div class="ts-control ts-content is-vertically-padded">
      <div class="label">使用者名稱</div>
      <div class="content is-padded">{{ userDetail.userName }}</div>
    </div>
    <div class="ts-control ts-content is-vertically-padded">
      <div class="label">真實姓名</div>
      <div class="content is-padded">{{ userDetail.realName }}</div>
    </div>
    <div class="ts-control ts-content is-vertically-padded">
      <div class="label">電子信箱</div>
      <div class="content is-padded">{{ userDetail.userEmail }}</div>
    </div>
    <div class="ts-control ts-content is-vertically-padded">
      <div class="label">地址</div>
      <div class="content is-padded">{{ userDetail.address }}</div>
    </div>
    <div class="ts-control ts-content is-vertically-padded">
      <div class="label">電話</div>
      <div class="content is-padded">{{ userDetail.phone }}</div>
    </div>
  </div>
  <dialog class="ts-modal is-big" id="updateProfileModal">
    <div class="content">
      <div class="ts-content">
        <div class="ts-grid">
          <div class="column is-fluid">
            <div class="ts-header">修改使用者資訊</div>
          </div>
          <div class="column">
            <button
              class="ts-close is-large is-secondary"
              data-dialog="updateProfileModal"
            ></button>
          </div>
        </div>
      </div>
      <div class="ts-divider"></div>
      <div class="ts-content">
        <div class="ts-container is-very-narrow has-vertically-padded-big">
          <div class="ts-grid is-relaxed is-2-columns">
            <div class="column">
              <div class="ts-text is-label">暱稱</div>
              <div class="ts-input is-underlined has-top-spaced">
                <input type="text" v-model="userInput.userName" />
              </div>
              <div class="ts-text is-description has-top-spaced-small">
                此為發文時顯示名稱
              </div>
            </div>
            <div class="column">
              <div class="ts-text is-label">真實姓名</div>
              <div class="ts-input is-underlined has-top-spaced">
                <input type="text" v-model="userInput.realName" />
              </div>
              <div class="ts-text is-description has-top-spaced-small">
                下訂單時取貨人資料須提供真實姓名。
              </div>
            </div>
          </div>
          <div class="ts-text is-label has-top-spaced-large">地址</div>
          <div class="ts-input is-underlined has-top-spaced">
            <input type="text" v-model="userInput.address" />
          </div>
          <div class="ts-text is-description has-top-spaced-small">
            請填收貨地址
          </div>
          <div class="ts-text is-label has-top-spaced-large">電話</div>
          <div class="ts-input is-underlined has-top-spaced">
            <input type="text" v-model="userInput.phone" />
          </div>
        </div>
      </div>
      <div class="ts-divider"></div>
      <div class="ts-content is-tertiary">
        <div class="ts-wrap is-end-aligned">
          <button class="ts-button" @click="updateFields">快捷輸入</button>
          <button class="ts-button" @click="callUpdate">確定</button>
          <button
            class="ts-button is-outlined"
            data-dialog="updateProfileModal"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { defineProps, onMounted, reactive } from "vue";
import axiosapi from "@/plugins/axios.js";
import useUserStore from "@/stores/user.js";
import Swal from "sweetalert2";

const userStore = useUserStore();
const props = defineProps({ userDetail: Object });
const emit = defineEmits(["update"]);

const userInput = reactive({
  userName: "",
  realName: "",
  userEmail: "",
  address: "",
  phone: "",
});
onMounted(function () {
  Swal.fire({
    title: "讀取中...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
  // axiosapi.defaults.headers.authorization = `Bearer ${userStore.userToken}`;
  Object.assign(userInput, props.userDetail);
  Swal.close();
});

const updateFields = () => {
  userInput.userName = "hoge0707";
  userInput.realName = "郭子綺";
  userInput.address = "高雄市前金區中正四路211號8樓之1";
  userInput.phone = "0933530123";
};

async function callUpdate() {
  // 將空字串轉換為 null
  Object.keys(userInput).forEach((key) => {
    if (userInput[key as keyof typeof userInput] === "") {
      userInput[key as keyof typeof userInput] = null;
    }
  });
  (document.getElementById("updateProfileModal") as HTMLDialogElement).close();
  Swal.fire({
    title: "處理中...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
  try {
    const response = await axiosapi.put(
      `/member/profile/${userStore.userId}`,
      userInput
    );
    Swal.close();
    if (response.data.success) {
      Object.assign(props.userDetail, userInput);
      await Swal.fire({
        text: response.data.message,
        icon: "success",
        confirmButtonText: "確認",
        confirmButtonColor: 'rgb(35 40 44)',
        allowOutsideClick: false,
        customClass: {
          container: "my-swal",
        },
      });
      emit("update", userInput);
    } else {
      (
        document.getElementById("updateProfileModal") as HTMLDialogElement
      ).show();
      await Swal.fire({
        text: response.data.message,
        icon: "warning",
        confirmButtonText: "確認",
        confirmButtonColor: 'rgb(35 40 44)',
        allowOutsideClick: false,
        customClass: {
          container: "my-swal",
        },
      });
    }
  } catch (error) {
    Swal.close();
    await Swal.fire({
      text: "更新失敗，請稍後再試。" + error.message,
      icon: "error",
      confirmButtonText: "確認",
      confirmButtonColor: 'rgb(35 40 44)',
      allowOutsideClick: false,
    });
    (document.getElementById("updateProfileModal") as HTMLDialogElement).show();
  }
}
</script>

<style scoped>
.header-title {
  margin-bottom: 1rem;
}

:root {
  --ts-z-modal: 100;
}

.my-swal {
  z-index: 9999;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .ts-grid.header-title {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .ts-header.is-huge {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .ts-button {
    font-size: 0.9rem;
    padding: 0.5rem;
    width: 100%;
    margin-top: 0.5rem;
  }

  .ts-box {
    padding: 0.5rem;
    width: 95%;
    margin: 0 auto;
  }

  .ts-control {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
  }

  .ts-control .label {
    font-size: 0.9rem;
    font-weight: bold;
    width: 30%;
    text-align: right;
    padding-right: 1rem;
  }

  .ts-control .content {
    font-size: 0.9rem;
    width: 70%;
    text-align: left;
    word-break: break-word;
  }

  /* 模态框样式调整 */
  .ts-modal .content {
    max-height: 80vh;
    overflow-y: auto;
  }

  .ts-modal .ts-input input {
    font-size: 1rem;
  }

  .ts-modal .ts-text.is-description {
    font-size: 0.8rem;
  }
}

/* 更小屏幕的额外调整 */
@media (max-width: 480px) {
  .ts-grid.is-2-columns {
    grid-template-columns: 1fr;
  }

  .ts-modal.is-big {
    width: 95%;
    max-width: none;
  }

  .ts-box {
    width: 100%;
  }

  .ts-control .label {
    font-size: 0.8rem;
  }

  .ts-control .content {
    font-size: 0.8rem;
  }
}
</style>
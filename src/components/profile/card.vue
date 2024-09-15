<template>
  <div class="ts-grid header-title is-middle-aligned is-spaced-between">
    <div class="ts-header is-huge is-heavy">信用卡 / 金融卡</div>
    <button class="ts-button is-start-icon" data-dialog="createCardModal">
      <span class="ts-icon is-plus-icon"></span>
      新增信用卡
    </button>
  </div>

  <div v-if="cards.length > 0" class="ts-box">
    <table class="ts-table">
      <tbody>
        <tr class="is-middle-aligned" v-for="card in cards" :key="card.cardId">
          <td>{{ card.type }}</td>
          <td>{{ card.cardNumber }}</td>
          <td class="is-end-aligned">
            <button
              class="ts-button is-end-aligned is-negative"
              @click="deleteCard(card.cardId)"
            >
              刪除
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else class="ts-box is-hollowed">
    <div class="ts-blankslate">
      <div class="header ts-icon is-credit-card-icon"></div>
      <div class="description">尚無信用卡內容</div>
    </div>
  </div>
  <dialog class="ts-modal is-large" id="createCardModal">
    <div class="content">
      <div class="ts-content">
        <div class="ts-grid">
          <div class="column is-fluid">
            <div class="ts-header">新增信用卡</div>
          </div>
          <div class="column">
            <button
              class="ts-close is-large is-secondary"
              data-dialog="createCardModal"
            ></button>
          </div>
        </div>
      </div>
      <div class="ts-divider"></div>
      <div class="ts-content">
        <div class="column is-16-wide">
          <div class="ts-grid is-2-columns is-relaxed">
            <div class="column">
              <div class="ts-text is-label">持卡人姓名</div>
              <div class="ts-input has-top-spaced">
                <input type="text" v-model="userInput.holderName" />
              </div>
              <div class="ts-text is-description has-top-spaced-small">
                此為信用卡上的英文名稱。
              </div>
            </div>
            <div class="column">
              <div class="ts-text is-label">信用卡號碼</div>
              <div class="ts-input has-top-spaced">
                <input
                  type="text"
                  maxlength="19"
                  @input="formatCardNumber"
                  v-model="userInput.cardNumber"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="column is-16-wide">
          <div class="ts-grid is-2-columns is-relaxed">
            <div class="column is-10-wide">
              <div class="ts-text is-label">到期日</div>
              <div class="ts-input has-top-spaced">
                <input
                  type="text"
                  maxlength="5"
                  placeholder="月月/年年"
                  @input="formatExpirationDate"
                  v-model="userInput.expirationDate"
                />
              </div>
            </div>
            <div class="column is-6-wide">
              <div class="ts-text is-label">安全碼</div>
              <div class="ts-input has-top-spaced">
                <input
                  type="text"
                  maxlength="3"
                  v-model="userInput.securityCode"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="ts-text is-label has-top-spaced">帳單地址</div>
          <div class="ts-input has-top-spaced">
            <input type="text" v-model="userInput.billingAddress" />
          </div>
        </div>
      </div>
      <div class="ts-divider"></div>
      <div class="ts-content is-tertiary">
        <div class="ts-wrap is-end-aligned">
          <button class="ts-button" @click="updateFields">快捷輸入</button>
          <button class="ts-button" @click="callCreate">確定</button>
          <button class="ts-button is-outlined" data-dialog="createCardModal">
            取消
          </button>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import axiosapi from "@/plugins/axios.js";
import { onMounted, reactive, computed, defineProps, ref } from "vue";
import useUserStore from "@/stores/user.js";
import Swal from "sweetalert2";
const userStore = useUserStore();
const cards = ref([]);
const props = defineProps<{
  userDetail: {
    realName: string | null;
    updatedTime: string | null;
    address: string | null;
    userPhoto: string | null;
    phone: string | null;
  };
}>();

const userInput = reactive({
  holderName: "",
  cardNumber: "",
  expirationDate: "",
  securityCode: "",
  billingAddress: "",
});

const updateFields = () => {
  userInput.holderName = "郭子綺";
  userInput.cardNumber = "3577 5432 4236 1455";
  userInput.expirationDate = "12/26";
  userInput.securityCode = "452";
  userInput.billingAddress = "高雄市前金區中正四路211號8樓之1";
};

// 處理格式化信用卡號碼
const formattedCardNumber = computed({
  get: () => {
    return userInput.cardNumber
      .replace(/\s/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
  },
  set: (value: string) => {
    userInput.cardNumber = value.replace(/\D/g, "");
  },
});
// 處理輸入事件的函數
const formatCardNumber = (event: Event) => {
  const input = event.target as HTMLInputElement;

  // 獲取當前光標位置
  const cursorPosition = input.selectionStart || 0;
  // 先記錄格式化前的字串長度
  const oldLength = input.value.length;

  // 設置格式化後的值
  input.value = formattedCardNumber.value;

  // 計算新插入的空格數量
  const newLength = input.value.length;
  const spacesAdded = newLength - oldLength;

  // 根據插入的空格數量調整光標位置
  const newCursorPosition = cursorPosition + spacesAdded;

  // 設置光標位置
  input.setSelectionRange(newCursorPosition, newCursorPosition);
};
// 格式化到期日 (MM/YY 格式)
const formatExpirationDate = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/[^0-9]/g, ""); // 移除所有非數字字符

  // 當長度大於 2 時，插入 /
  if (value.length > 2) {
    let month = parseInt(value.slice(0, 2), 10);
    let year = value.slice(2, 4);

    if (month > 12) {
      month = 12;
    }
    value = String(month).padStart(2, "0") + "/" + year;
  }

  // 更新輸入框的值並保持光標位置
  input.value = value;
  userInput.expirationDate = value; // 更新 reactive 變量

  // 保持光標位置
  const cursorPosition = input.selectionStart || 0;
  input.setSelectionRange(cursorPosition, cursorPosition);
};

///////////// 新增信用卡
async function callCreate() {
  try {
    console.log(userInput);
    (document.getElementById("createCardModal") as HTMLDialogElement).close();

    Swal.fire({
      title: "處理中...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const response = await axiosapi.post(
      `/member/creditCard/${userStore.userId}`,
      userInput
    );
    Swal.close();
    if (response.data.success) {
      await Swal.fire({
        text: response.data.message,
        icon: "success",
        confirmButtonText: "確認",
        confirmButtonColor: "rgb(35 40 44)",
        allowOutsideClick: false,
      });
      callFindcard();
    } else {
      // 如果操作不成功
      await Swal.fire({
        text: response.data.message || "操作失敗，請稍後再試。",
        icon: "error",
        confirmButtonColor: "rgb(35 40 44)",
        confirmButtonText: "確認",
      });
      (document.getElementById("createCardModal") as HTMLDialogElement).show();
    }
  } catch (error) {
    console.error("Error creating credit card:", error);
    await Swal.fire({
      text: "系統錯誤，請稍後再試。",
      icon: "error",
      confirmButtonColor: "rgb(35 40 44)",
      confirmButtonText: "確認",
    });
    (document.getElementById("createCardModal") as HTMLDialogElement).show();
  }
}

///////////// 顯示信用卡

async function callFindcard() {
  Swal.fire({
    title: "讀取中...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
  try {
    const response = await axiosapi.get(
      `/member/creditCard/${userStore.userId}`
    );
    Swal.close();
    if (response.data.success) {
      if (
        Array.isArray(response.data.cardList) &&
        response.data.cardList.length > 0
      ) {
        cards.value = response.data.cardList.map((card: any) => {
          const cleanCardNumber = card.cardNumber.replace(/\s+/g, "");
          const formattedCardNumber = cleanCardNumber.replace(
            /\d{12}(\d{4})/,
            "**** **** **** $1"
          );
          const cardType = getCardType(cleanCardNumber);
          return { ...card, cardNumber: formattedCardNumber, type: cardType };
        });
      }
    } else {
      console.error("無法取得卡片資料:", response.data.message);
      Swal.fire({
        text: "取得卡片資料時發生錯誤:" + response.data.message,
        icon: "error",
        confirmButtonColor: "rgb(35 40 44)",
        confirmButtonText: "確認",
      });
    }
  } catch (error) {
    console.error("取得卡片資料時發生錯誤:", error);
    Swal.fire({
      text: "取得卡片資料時發生錯誤:" + error,
      icon: "error",
      confirmButtonColor: "rgb(35 40 44)",
      confirmButtonText: "確認",
    });
  }
}

///////////// 刪除信用卡

function deleteCard(cardId) {
  console.log("刪除?");
  Swal.fire({
    title: "確定要刪除這張信用卡嗎?",
    text: "此操作無法恢復。",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "刪除",
    cancelButtonText: "取消",
    confirmButtonColor: "rgb(35 40 44)",
    cancelButtonColor: "#9e9e9e",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "處理中...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      axiosapi
        .delete(`/member/creditCard/${userStore.userId}/${cardId}`)
        .then(function (response) {
          Swal.close();
          if (response.data.success) {
            cards.value = cards.value.filter((card) => card.cardId !== cardId);
            Swal.fire({
              text: response.data.message,
              icon: "success",
              confirmButtonText: "確認",
              allowOutsideClick: false,
            });
          } else {
            Swal.fire({
              text: response.data.message,
              icon: "warning",
              confirmButtonText: "確認",
              allowOutsideClick: false,
            });
          }
        });
    } else {
      // 用户取消删除操作
      console.log("用户取消了删除操作");
    }
  });
}
///////////// 信用卡種類
function getCardType(cardNumber) {
  const visaRegex = /^4/;
  const masterCardRegex = /^5[1-5]/;
  const jcbRegex = /^(?:2131|1800|35\d{3})\d{11}/;

  if (visaRegex.test(cardNumber)) {
    return "Visa";
  } else if (masterCardRegex.test(cardNumber)) {
    return "MasterCard";
  } else if (jcbRegex.test(cardNumber)) {
    return "JCB";
  } else {
    return "Unknown";
  }
}
onMounted(function () {
  window.scrollTo(0, 0);
  if (userStore.isLogedin) {
    callFindcard();
  }
});
</script>

<style scoped>
tr {
  height: 100px;
}
.header-title {
  margin-bottom: 2rem;
}
</style>

<template>
  <div class="ts-container status-selection">
    <div class="ts-selection is-fluid">
      <label class="item">
        <input type="radio" name="language" value="1" v-model="status" />
        <div class="text">申請中</div>
      </label>
      <label class="item">
        <input type="radio" name="language" value="2" v-model="status" />
        <div class="text">已審核</div>
      </label>
    </div>
  </div>
  <div class="ts-container table-container">
    <div class="ts-box">
      <div class="table-wrapper">
        <table class="ts-table">
          <thead>
            <tr>
              <th>訂單編號</th>
              <th>訂單日期</th>
              <th>申請時間</th>
              <th>總金額</th>
              <th>付款方式</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="order in orders" :key="order.orderId">
              <tr>
                <td data-label="訂單編號">{{ order.orderId }}</td>
                <td data-label="訂單日期">{{ formatDate(order.orderDate) }}</td>
                <td data-label="申請時間">{{ formatDate(order.applyRefundDate) }}</td>
                <td data-label="總金額">{{ formatCurrency(order.totalAmounts) }}</td>
                <td data-label="付款方式">{{ order.paymentMethod === 1 ? "LinePay" : "其他" }}</td>
                <td >
                  <button
                    class="ts-button is-outlined"
                    @click="toggleOrderDetails(order.orderId)"
                  >
                    {{ expandedOrderId === order.orderId ? "收起" : "展開" }}
                  </button>
                </td>
              </tr>
              <tr v-if="expandedOrderId === order.orderId">
                <td colspan="6" class="is-secondary is-padded is-insetted">
                  <div v-if="orderDetails.length > 0">
                    <table class="ts-table">
                      <thead>
                        <tr>
                          <th>商品名稱</th>
                          <th>數量</th>
                          <th>價格</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="detail in orderDetails" :key="detail.id">
                          <td>{{ detail.productName }}</td>
                          <td>{{ detail.quantity }}</td>
                          <td>{{ formatCurrency(detail.price) }}</td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>

                    <div class="ts-box reason-box">
                      <div class="ts-content reason-content">
                        <span class="ts-text">{{ order.refundReason }} </span>
                        <div class="ts-wrap" v-if="order.refundStatus == 1">
                          <button class="ts-button" @click="agreeRefund(order)">
                            同意
                          </button>
                          <button
                            class="ts-button reject-button"
                            @click="rejectRefund(order)"
                          >
                            拒絕
                          </button>
                        </div>
                        <div v-else>狀態:{{ getStatusText(order.status) }}</div>
                      </div>
                    </div>
                  </div>
                  <div v-else>正在加載訂單詳情...</div>
                </td>
              </tr>
            </template>
            <tr>
              <td class="is-secondary is-padded is-insetted" colspan="6"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import axiosapi from "@/plugins/axios.js";
import { ref } from "vue";
import { watch } from "vue";
import useUserStore from "@/stores/user.js";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

const status = ref(1);
const orders = ref([]);
const expandedOrderId = ref(null);
const orderDetails = ref([]);
const user = useUserStore().userId;
const router = useRouter();

const loadOrders = async () => {
  try {
    const response = await axiosapi.get(
      `/admin/findByRefundStatus/${status.value}`
    );
    console.log("findByRefundStatus : " + JSON.stringify(response.data));
    if (response.data !== "") {
      orders.value = response.data;
    } else {
      console.log("cantfind");
    }
  } catch (error) {
    console.error("cant load orders" + error);
  }
};

watch(status, loadOrders, { immediate: true });

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
  }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  return dateString.replace("T", " ").split(".")[0];
};
//把日期的T變成空白 UI

//展開收起功能
const toggleOrderDetails = (orderId) => {
  if (expandedOrderId.value === orderId) {
    expandedOrderId.value = null;
  } else {
    expandedOrderId.value = orderId;
    getOrderDetails(orderId);
  }
};

const getOrderDetails = async (orderId) => {
  await axiosapi
    .get("/order/findOd/" + orderId)
    .then((response) => {
      orderDetails.value = response.data;
    })
    .catch((error) => {
      console.error("cant load orderDetails" + error);
    });
};

const agreeRefund = async (order) => {
  try {
    const response = await axiosapi.post("/admin/agreeRefund", {
      orderId: order.orderId,
    });
    if (response.data != "") {
      console.log(response.data);
      Swal.fire({
        icon: "success",
        title: "操作成功",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      await loadOrders();
    } else {
      console.log(response.data);
      Swal.fire({
        icon: "error",
        title: "請稍後再試",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
    }
  } catch (error) {
    console.log(error);
    alert("操作出錯");
  }
};

const rejectRefund = async (order) => {
  try {
    const response = await axiosapi.post("/admin/rejectRefund", {
      orderId: order.orderId,
    });
    if (response.data != "") {
      console.log(response.data);
      Swal.fire({
        icon: "success",
        title: "操作成功",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
    } else {
      console.log(response.data);
      Swal.fire({
        icon: "error",
        title: "請稍後再試",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
    }
    await loadOrders();
  } catch (error) {
    console.log(error);
    alert("操作出錯");
  }
};

//根據訂單狀態顯示同意或拒絕
const getStatusText = (status) => {
  switch (status) {
    case 1:
      return "拒絕退款";
    case 3:
      return "同意退款";
  }
};
</script>

<style scoped>
.status-selection {
  margin-top: 10px;
}

.reason-box {
  margin-top: 20px;
}

.reason-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.reject-button {
  background-color: #9e9e9e;
  border: 0;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .ts-container {
    padding: 0.5rem;
    width: 100%;
    overflow-x: hidden; /* 防止水平溢出 */
  }

  .ts-box {
    padding: 0.5rem;
    overflow-x: auto; /* 允许内容水平滚动 */
  }

  .ts-table {
    font-size: 0.8rem;
    width: 100%;
  }

  .ts-table th,
  .ts-table td {
    padding: 0.4rem;
    white-space: nowrap; /* 防止内容换行 */
  }

  .ts-button {
    font-size: 0.8rem;
    padding: 0.3rem 0.5rem;
  }

  .reason-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .reason-content .ts-text {
    margin-bottom: 0.5rem;
    word-break: break-word; /* 允许长文本换行 */
  }

  .reason-content .ts-wrap {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    flex-wrap: wrap; /* 允许按钮换行 */
  }

  .reason-content .ts-wrap .ts-button {
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }

  /* 嵌套表格样式 */
  .is-secondary.is-padded.is-insetted {
    padding: 0.5rem;
  }

  .is-secondary.is-padded.is-insetted .ts-table {
    font-size: 0.7rem;
  }
}

/* 更小屏幕的额外调整 */
@media (max-width: 480px) {
  .ts-selection.is-fluid {
    flex-direction: column;
  }

  .ts-selection.is-fluid .item {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .table-wrapper {
    min-width: auto; /* 移除最小宽度限制 */
    width: 100%;
  }

  .ts-table {
    display: block; /* 将表格转换为块级元素 */
  }

  .ts-table thead {
    display: none; /* 隐藏表头 */
  }

  .ts-table tbody,
  .ts-table tr,
  .ts-table td {
    display: block;
    width: 100%;
  }

  .ts-table tr {
    margin-bottom: 1rem;
    border-bottom: 1px solid #ddd;
  }

  .ts-table td {
    text-align: right;
    padding-left: 50%;
    position: relative;
  }

  .ts-table td::before {
    content: attr(data-label);
    position: absolute;
    left: 6px;
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
    text-align: left;
    font-weight: bold;
  }
}
</style>

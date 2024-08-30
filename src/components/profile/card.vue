<template>
  <div class="ts-grid header-title is-middle-aligned is-spaced-between">
    <div class="ts-header is-huge is-heavy">信用卡 / 金融卡</div>
    <button class="ts-button is-start-icon" data-dialog="createCardModal">
      <span class="ts-icon is-plus-icon"></span>
      新增信用卡
    </button>
  </div>

  <div class="ts-box">
    <table class="ts-table">
      <!-- <thead>
            <tr>
                <th>交易日期</th>
                <th>項目名稱</th>
                <th>實際金額</th>
                <th class="is-collapsed"></th>
            </tr>
        </thead> -->
      <tbody>
        <tr class="is-middle-aligned">
          <td>2021/02/03</td>
          <td>煤果交換所</td>
          <td class="is-end-aligned">
            <button class="ts-button is-end-aligned is-negative">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
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
                <input type="text" />
              </div>
              <div class="ts-text is-description has-top-spaced-small">
                此為信用卡上的英文名稱。
              </div>
            </div>
            <div class="column">
              <div class="ts-text is-label">信用卡號碼</div>
              <div class="ts-input has-top-spaced">
                <input type="text" />
              </div>
            </div>
          </div>
        </div>
        <div class="column is-16-wide">
          <div class="ts-grid is-2-columns is-relaxed">
            <div class="column is-10-wide">
              <div class="ts-text is-label">到期日</div>
              <div class="ts-input has-top-spaced">
                <input type="text" placeholder="月月/年年" />
              </div>
            </div>
            <div class="column is-6-wide">
              <div class="ts-text is-label">安全碼</div>
              <div class="ts-input has-top-spaced">
                <input type="text" />
              </div>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="ts-text is-label">帳單地址</div>
          <div class="ts-input has-top-spaced">
            <input type="text" />
          </div>
        </div>
      </div>
      <div class="ts-divider"></div>
      <div class="ts-content is-tertiary">
        <div class="ts-wrap is-end-aligned">
          <button class="ts-button">確定</button>
          <button class="ts-button is-outlined" data-dialog="createCardModal">
            取消
          </button>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts"></script>

<style scoped>
tr {
  height: 100px;
}
.header-title {
  margin-bottom: 2rem;
}
</style>

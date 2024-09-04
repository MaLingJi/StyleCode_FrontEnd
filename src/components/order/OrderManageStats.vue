/<template>
    <div class="ts-grid is-2-columns ">
    <div class="column ">
        <div class="ts-box ">
            <div class="ts-content ">
                <div class="ts-statistic">
                    <div class="value">{{ orders.length }}</div>
                </div>
                累積訂單數
            </div>
            <!-- <div class="symbol">
                <span class="ts-icon is-eye-icon"></span>
            </div> -->
        </div>
    </div>
    <div class="column">
        <div class="ts-box">
            <div class="ts-content">
                <div class="ts-statistic">
                    <div class="value">{{ formatCurrency(totalAmount) }} </div>
                </div>
                累積訂單金額
            </div>
            <!-- <div class="symbol">
                <span class="ts-icon is-users-icon"></span>
            </div> -->
        </div>
    </div>
</div>
</template>

<script setup>
import { computed } from 'vue';



const props = defineProps(['orders'])


//計算範圍內所有訂單總金額
const totalAmount = computed(() => {
    let total = 0;
    for (const order of props.orders) {
        total += order.totalAmounts
        console.log(total)
    }
    console.log('totalamount:' + total)
    return total;
})

//加工金額
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD' }).format(amount);
};

</script>

<style></style>
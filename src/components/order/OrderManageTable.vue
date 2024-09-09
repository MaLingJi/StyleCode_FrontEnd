<template>
    <div class="container">
        <div class="table-container">
            <table class="ts-table ">
                <thead>
                    <tr>
                        <th>名稱</th>
                        <th>分類</th>
                        <th>數量</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in ordersData" :key="item.productName">
                        <td>{{ item.productName }}</td>
                        <td>{{ item.categoryName }}</td>
                        <td>{{ item.totalQuantity }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="button-container">
            <button @click="exportToCSV" class="ts-button is-secondary">Export</button>
        </div>
    </div>
</template>

<script setup>
import { computed, defineProps, } from 'vue';

const props = defineProps(['orders']);


const ordersData = computed(() => {
    const stats = {};
    props.orders.forEach(order => {
        order.ordersDetails.forEach(orderdetail => {
            const key = `${orderdetail.productName}_${orderdetail.catogoryName}`;
            if (!stats[key]) {
                stats[key] = {
                    productName: orderdetail.productName,
                    categoryName: orderdetail.catogoryName,
                    totalQuantity: 0
                };
            }
            stats[key].totalQuantity += orderdetail.quantity;
        });
    });
    console.log('this is stats' + JSON.stringify(stats))
    return Object.values(stats).sort((a, b) => b.totalQuantity - a.totalQuantity);
})
// 把物件轉矩陣  原本是stats = {"類別1": {categoryName: "類別1",totalQuantity: 50},"類別2": {categoryName: "類別2"totalQuantity: 30})
// 變成[{ categoryName: "類別3", totalQuantity: 70 },{categoryName: "類別1",totalQuantity: 50},


const exportToCSV = () => {
    //告訴EXCEL這是UTF-8編碼
    const BOM = "\uFEFF";
    const csvContent = BOM + [
        ['名稱', '分類', '數量'],
        ...ordersData.value.map(item => [
            item.productName,
            item.categoryName,
            item.totalQuantity
        ])
    ].map(e => e.join(',')).join('\n');
    //     [
    //   ['名稱', '分類', '數量'],
    //   ["a", "1", 10],
    //   ["b", "2", 5],
    //   ["c", "3", 20]
    // ]

    // [
    //   "名稱,分類,數量",
    //   "a,1,10",
    //   "b,2,5",
    //   "c,3,20"
    // ]


    //文件
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    //創造可以下載的URL
    const url = URL.createObjectURL(blob);


    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "table_data.csv");
    link.style.visibility = 'hidden';

    //自動下載
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
</script>

<style scoped>
.container {
    position: relative;
    width: 100%;
    padding-top: 50px;
}

.table-container {
    display: flex;
    justify-content: center;
}

.button-container {
    position: absolute;
    top: 10px;
  
}

.ts-table {
    text-align: center;
}

.ts-table th,
.ts-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
}

.ts-table th {
    background-color: #f2f2f2;
    font-weight: bold;
}



</style>
<template>
    <div>
        <div class="visualization-container" ref="containerRef">
            <div class="row">
                <div class="box left-box">
                    <div class="content">
                        <div class="left-content">
                            <div class="statistic-display">
                                <div class="title">{{ t('dashboard.account_deposit') }}</div>
                                <div class="value">{{ purse.transaction_amount }}</div>
                            </div>
                            <div class="statistic-display">
                                <div class="title">{{ t('dashboard.credit_number') }}</div>
                                <div class="value">{{ purse.number }}</div>
                            </div>
                        </div>
                        <div class="right-content" ref="barChart"></div>
                        <div class="time-box">
                            <el-date-picker
                                v-model="value1"
                                type="daterange"
                                range-separator="To"
                                start-placeholder="Start date"
                                end-placeholder="End date"
                                @change="changeDate"
                            />
                        </div>
                    </div>

                </div>
                <div class="box right-box">
                    <div class="title">{{ t('dashboard.system_bulletin') }}</div>
                    <div  class="announcement">
                        <div class="announcement-title" v-for="item in announcementList" :key="item.id" @click="changeItem(item)">{{ item.title }}</div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="box left-box">
                    <div class="title">{{ t('dashboard.account_details') }}</div>
                    <Table ref="tableRef" :pagination="false">
                        <template #transfer_type>
                            <el-table-column :label="t('dashboard.transaction_type')" align="center">
                                <template #default="scope">
                                    {{ scope.row.transfer_type === 'transfer_in' ? t('dashboard.transfer_in') : scope.row.transfer_type === 'transfer_out' ? t('dashboard.transfer_out') : '' }}
                                </template>
                            </el-table-column>
                        </template>
                        <template #original_amount>
                            <el-table-column :label="t('dashboard.original_amount')" align="center">
                                <template #default="scope">
                                    <span v-if="scope.row.original_amount">$</span>{{ scope.row.original_amount  }}
                                </template>
                            </el-table-column>
                        </template>
                        <template #transaction_amount>
                            <el-table-column :label="t('dashboard.transaction_amount')" align="center">
                                <template #default="scope">
                                    <span v-if="scope.row.transfer_type === 'transfer_in'" style="color: #51BA95;"><span v-if="scope.row.transaction_amount">+$</span>{{ scope.row.transaction_amount  }}</span>
                                    <span v-else style="color: #F66196;"><span v-if="scope.row.transaction_amount">-$</span>{{ scope.row.transaction_amount  }}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <template #business_type>
                            <el-table-column :label="t('dashboard.transaction_type')" align="center">
                                <template #default="scope">
                                    <span>{{ getbusinessTypeLabel(scope.row.business_type) }}</span>
                                </template>
                            </el-table-column>
                        </template>
                    </Table>
                </div>
                <div class="box right-box">
                    <div class="title">{{ t('dashboard.account_forewarning') }}</div>
                </div>
            </div>
        </div>
        <el-dialog v-model="dialogVisible" width="800">
            <div class="announcement-details" v-if="announcementDetails">
                <h3>{{ announcementDetails.title }}</h3>
                <p style="margin-top: 20px;">&nbsp;&nbsp;{{ announcementDetails.details }}</p>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted } from 'vue'
import baTableClass from '/@/utils/baTable'
import Table from '/@/components/table/index.vue'
import { baTableApi } from '/@/api/common'
import {
    adminAuthAdminMoneyLogGetPurse,
    adminAuthAdminMoneyLogGetPurseList,
    adminAnnouncementIndex,
    adminAnnouncementedit
} from '/@/api/backend/index.ts'
import { useI18n } from 'vue-i18n'
import * as echarts from 'echarts'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
interface Purse {
    number?: number
    transaction_amount?: number
}
interface PurseList {
    day?: string
    total?: number
}
interface Announcement {
    create_time?: number
    details?: string
    id?: number
    title?: string
    update_time?: number
}
const { t } = useI18n()
const businessTypeMap: Record<number, string> = {
    1: t('dashboard.Deposit'),
    2: t('dashboard.refund'),
    3: t('dashboard.Create_card'),
    4: t('dashboard.card_deposit'),
    5: t('dashboard.card_refund'),
    6: t('dashboard.card_out')
}
const barChart = ref<HTMLDivElement | null>(null)
const value1 = ref([
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 七天前
    new Date() // 现在
])
const formattedStartDate = ref<string>('');
const formattedEndDate = ref<string>('');
const tableRef = ref()
const purse = ref<Purse>({})
const purseList = ref<PurseList[]>([])
const announcementList = ref<Announcement[]>([])
const containerRef = ref<HTMLElement | null>(null)
const dialogVisible = ref(false)
const announcementDetails = ref<Announcement | null>(null);
// baTable 初始化
const baTable = new baTableClass(
    new baTableApi('/admin/auth.AdminMoneyLog/'),
    {
        column: [
            { label: t('dashboard.check_id'), prop: 'transaction_id', align: 'center', operator: 'LIKE', width: 160},
            { label: t('dashboard.transaction_type'), prop: 'transfer_type', align: 'center', operator: false, slotName: 'transfer_type', render: 'slot' , width: 160},
            { label: t('dashboard.original_amount'), prop: 'original_amount', align: 'center', operator: false, slotName: 'original_amount', render: 'slot', width: 160},
            { label: t('dashboard.transaction_amount'), prop: 'transaction_amount', align: 'center', operator: false, slotName: 'transaction_amount', render: 'slot', width: 160 },
            { label: t('dashboard.current_amount'), prop: 'current_amount', align: 'center', operator: false, operatorPlaceholder: t('Fuzzy query'), width: 160 },
            { label: t('dashboard.business_type'), prop: 'business_type', align: 'center', operator: false, slotName: 'business_type', render: 'slot', width: 160 },
            { label: t('dashboard.create_time'), prop: 'create_time', align: 'center', render: 'datetime',  operator: false, width: 160 }
        ],
        dblClickNotEditColumn: ['all'],
        filter: {
            limit:5,
            business_type:1
        }
    },
)

const getadminAuthAdminMoneyLogGetPurse = async () => {
    const res: any = await adminAuthAdminMoneyLogGetPurse({})
    purse.value = res.data.row
}

const getadminAnnouncementIndex = async () => {
    const res: any = await adminAnnouncementIndex({
        limit: 999
    })
    announcementList.value = res.data.list
}

const getAdminAuthAdminMoneyLogGetPurseList = async () => {
    // 处理结束日期：加一天
    const endDate = new Date(formattedEndDate.value);
    const nextDay = new Date(endDate.setDate(endDate.getDate() + 1));
    const formattedNextDay = formatDate(nextDay);

    let postData = {
        'search':[
            {
                'field': 'create_time',
                'val': `${formattedStartDate.value},${formattedNextDay}`,
                'operator':'RANGE',
                'render': 'datetime'
            }
        ],
        'limit': 7
    }
    const res: any = await adminAuthAdminMoneyLogGetPurseList(postData)
    purseList.value = res.data.list
    initBarChart()
}
const changeDate = (value: [Date, Date] | null) => {
    console.log('Selected date range:', value);
    if (value) {
        const startDate = new Date(value[0]);
        const endDate = new Date(value[1]);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        console.log('diffDays', diffDays)
        if (diffDays > 7) {
        // 提示用户选择的时间范围不能超过七天
            ElMessageBox.alert('Please select a date range within 7 days.', {
                confirmButtonText: 'OK'
            })
            // 重置日期选择器
            value1.value = [new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()];
            return;
        }

        formattedStartDate.value = formatDate(value[0]); // 格式化开始日期
        formattedEndDate.value = formatDate(value[1]); // 格式化结束日期
    } else {
        formattedStartDate.value = '';
        formattedEndDate.value = '';
    }
    getAdminAuthAdminMoneyLogGetPurseList()
}
// 定义 formatDate 方法
const formatDate = (date: Date | null): string => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 图表初始化函数
const initBarChart = () => {
    if (!barChart.value) return

    const myChart = echarts.init(barChart.value)
    const xData = purseList.value.map((item: PurseList) => item.day)
    const yData = purseList.value.map((item: PurseList) => item.total)

    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: [
            {
                type: 'category',
                data: xData,
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '金额',
                data: yData,
                type: 'bar',
                barWidth: '30%',
                itemStyle: {
                    color: '#8957FF',
                    borderRadius: [5, 5, 0, 0]
                }
            }
        ]
    }
    myChart.setOption(option)

    // 添加窗口resize监听
    window.addEventListener('resize', () => {
        myChart.resize()
    })
}
const getbusinessTypeLabel = (type: number) => {
    return businessTypeMap[type] || type
}
const changeItem = async (item: Announcement) => {
    await getadminAnnouncementedit(item)
    dialogVisible.value = true
}
const getadminAnnouncementedit = async (item: Announcement) => {
    const params = {
        id: item.id
    }
    const res: any = await adminAnnouncementedit(params)
    announcementDetails.value = res.data.row
}
// 生命周期钩子和初始化调用
onMounted(async () => {
    // 设置初始的日期范围
    formattedStartDate.value = formatDate(value1.value[0])
    formattedEndDate.value = formatDate(value1.value[1])

    await Promise.all([
        getadminAuthAdminMoneyLogGetPurse(),
        getAdminAuthAdminMoneyLogGetPurseList(),
        getadminAnnouncementIndex()
    ])
})

// baTable 相关初始化
baTable.mount()
baTable.getIndex()
provide('baTable', baTable)
</script>

<style scoped lang="scss">
.visualization-container {
  display: flex;
  flex-direction: column;
  margin: 40px 0;
  .row {
    display: flex;
    width: 100%;
    margin-bottom: 50px;
    .box {
        padding: 0 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        // background-color: var(--ba-bg-color-overlay);
        background: #fff;
        height: 311px;
        box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 16px 0px;
        border-radius: 6px;
        border: 1px solid rgb(232, 234, 237);
    }
    .content {
        display: flex;
        position: relative;
        .left-content {
            .statistic-display {
                display: flex;
                flex-direction: column;
                // text-align: center;
                width: 230px;
                height: 100px;
                padding: 10px 30px;
                margin: 30px 0;
            }
            .title {
                font-size: 18px;
                margin-bottom: 10px;
                // color: #333;
            }
            .value {
                font-size: 24px;
            }
        }
        .right-content{
            flex: 1;
            height: 350px; // 设置一个固定高度
            min-width: 330px; // 设置一个最小宽度
            width: 950px;
        }
        .time-box {
            position: absolute;
            bottom: 87%;
            right: 3%;
        }
    }
    .left-box {
        width: 67%;
        margin-right: 30px;
    }

    .right-box {
        width: 31%;
        .announcement {
            margin-bottom: 5px;
            padding: 0 10px;
            height: 260px; /* 设置固定高度 */
            overflow-y: auto;
            overflow-x: hidden;
        }
        /* 隐藏滚动条 */
         .announcement::-webkit-scrollbar {
             width: 0.5em;
         }

         .announcement::-webkit-scrollbar-track {
             background: transparent;
         }

         .announcement::-webkit-scrollbar-thumb {
             background-color: transparent;
        }

        .announcement-title {
            white-space: nowrap; /* 防止文本换行 */
            overflow: hidden; /* 隐藏超出部分 */
            text-overflow: ellipsis; /* 超出部分以...结尾 */
            width: 100%; /* 确保宽度适应父容器 */
            cursor: pointer; /* 鼠标悬停时显示手型 */
            transition: color 0.3s; /* 添加颜色过渡效果 */
            color:#808080;
            border-bottom: 1px solid 	#F5F5F5;
            padding: 5px 0;
        }
        .announcement-title:hover {
            color: #8957FF; /* 鼠标悬停时字体颜色变为紫色 */
        }
    }
    .title {
        padding: 10px 0;
        font-weight: bold;
    }
 }
 /* 对话框样式 */
.el-dialog {
    max-width: 800px;
}

.el-dialog__header {
    background-color: #f0f0f0;
    padding: 10px 20px;
    border-bottom: 1px solid #ddd;
}

.el-dialog__title {
    font-size: 18px;
    font-weight: bold;
}

.el-dialog__body {
    padding: 20px;
}

.el-dialog__footer {
    padding: 10px 20px;
    border-top: 1px solid #ddd;
    text-align: right;
}
}
.announcement-details {
    height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 15px; /* 为了防止内容被滚动条遮挡 */
}

/* 隐藏滚动条 */
 .announcement-details::-webkit-scrollbar {
     width: 0.5em;
 }

 .announcement-details::-webkit-scrollbar-track {
     background: transparent;
 }

 .announcement-details::-webkit-scrollbar-thumb {
     background-color: transparent;
}
::v-deep .el-dialog__title {
    font-weight: bold;
}
::v-deep .el-dialog {
    border-radius: 10px; /* 设置圆角半径 */
}
</style>

<template>
    <PageContainer :loading="isLoading">
        <headerContent>
            <span>{{ t('pagesTitle.dashboard') }}</span>
        </headerContent>
        <div style="padding: 0 40px;">
            <!-- <div style="margin: var(--ba-main-space) var(--ba-main-space) 60px var(--ba-main-space)">
                <div style="">
                    <div style="width:330px;height:130px;background-color: #fff;border-radius: 10px;padding:25px">
                        <div style="display: flex;width: 100%;justify-content: space-between;cursor: pointer;">
                            <span>{{ t('dashboard.Account_balance') }}</span>
                            <span><Icon name="el-icon-Warning" class="menu_icon"/></span>

                        </div>
                        <div style="font-size: 24px;padding: 10px 0;">
                            <span>$  {{ dataDialog.realTimeBalance  }}</span>
                        </div>
                    </div>

                </div>
            </div> -->
            <div class="statistics-container">
                <StatBox
                :iconColor="'BLUE'"
                :iconViewBox="'0 0 32 32'"
                :iconPath="'M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 16-16 16zm6.5-12.846c0-2.523-1.576-3.948-5.263-4.836v-4.44c1.14.234 2.231.725 3.298 1.496l1.359-2.196a9.49 9.49 0 00-4.56-1.776V6h-2.11v1.355c-3.032.234-5.093 1.963-5.093 4.486 0 2.64 1.649 3.925 5.19 4.813v4.58c-1.577-.234-2.886-.935-4.269-2.01L9.5 21.35a11.495 11.495 0 005.724 2.314V26h2.11v-2.313c3.08-.257 5.166-1.963 5.166-4.533zm-7.18-5.327c-1.867-.537-2.327-1.168-2.327-2.15 0-1.027.8-1.845 2.328-1.962zm4.318 5.49c0 1.122-.873 1.893-2.401 2.01v-4.229c1.892.538 2.401 1.168 2.401 2.22z'"
                :label="t('dashboard.Account_balance')"
                :value="dataDialog.realTimeBalance"
                >
                </StatBox>

                <StatBox
                :iconColor="'#000000'"
                :iconViewBox="'0 0 1920 1920'"
                :iconPath="'M960 0c530.193 0 960 429.807 960 960s-429.807 960-960 960S0 1490.193 0 960 429.807 0 960 0Zm-9.838 1342.685c-84.47 0-153.19 68.721-153.19 153.19 0 84.47 68.72 153.192 153.19 153.192s153.19-68.721 153.19-153.191-68.72-153.19-153.19-153.19ZM1153.658 320H746.667l99.118 898.623h208.755L1153.658 320Z'"
                :label="t('dashboard.repudiation_rate')"
                value="0.00%"
                >
                </StatBox>

                <div class="content-box">
                    <div class="stat-box">
                        <div>
                            <div class="icon-container">
                                <svg width="800px" height="800px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                    <g fill="none">
                                       <circle fill="#3E73C4" cx="16" cy="16" r="16"/>
                                        <g fill="#FFF">
                                           <path d="M20.022 18.124c0-2.124-1.28-2.852-3.84-3.156-1.828-.243-2.193-.728-2.193-1.578 0-.85.61-1.396 1.828-1.396 1.097 0 1.707.364 2.011 1.275a.458.458 0 00.427.303h.975a.416.416 0 00.427-.425v-.06a3.04 3.04 0 00-2.743-2.489V9.142c0-.243-.183-.425-.487-.486h-.915c-.243 0-.426.182-.487.486v1.396c-1.829.242-2.986 1.456-2.986 2.974 0 2.002 1.218 2.791 3.778 3.095 1.707.303 2.255.668 2.255 1.639 0 .97-.853 1.638-2.011 1.638-1.585 0-2.133-.667-2.316-1.578-.06-.242-.244-.364-.427-.364h-1.036a.416.416 0 00-.426.425v.06c.243 1.518 1.219 2.61 3.23 2.914v1.457c0 .242.183.425.487.485h.915c.243 0 .426-.182.487-.485V21.34c1.829-.303 3.047-1.578 3.047-3.217z"/>
                                           <path d="M12.892 24.497c-4.754-1.7-7.192-6.98-5.424-11.653.914-2.55 2.925-4.491 5.424-5.402.244-.121.365-.303.365-.607v-.85c0-.242-.121-.424-.365-.485-.061 0-.183 0-.244.06a10.895 10.895 0 00-7.13 13.717c1.096 3.4 3.717 6.01 7.13 7.102.244.121.488 0 .548-.243.061-.06.061-.122.061-.243v-.85c0-.182-.182-.424-.365-.546zm6.46-18.936c-.244-.122-.488 0-.548.242-.061.061-.061.122-.061.243v.85c0 .243.182.485.365.607 4.754 1.7 7.192 6.98 5.424 11.653-.914 2.55-2.925 4.491-5.424 5.402-.244.121-.365.303-.365.607v.85c0 .242.121.424.365.485.061 0 .183 0 .244-.06a10.895 10.895 0 007.13-13.717c-1.096-3.46-3.778-6.07-7.13-7.162z"/>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                        </div>
                        <div class="content">
                            <div class="title">{{ t('dashboard.trading_authorization') }}</div>
                            <div class="value">0.00%</div>
                        </div>
                    </div>
                    <div class="unit">
                        <slot></slot> <!-- 添加插槽 -->
                    </div>
                </div>
                <!-- <StatBox label="卡余额" :value="dataDialog.realTimeBalance" >
                </StatBox> -->
                <!-- <BoxComponent
                    icon="🔥"
                    title="可用金额"
                    unit=""
                    :percentage="75"
                    :image="imageUrl"
                    :value="dataDialog.realTimeBalance"
                    backgroundColor="#FFFFFF"
                    borderColor="#FFFFFF"
                    />
                    <BoxComponent
                    icon="🔥"
                    title="账户拒付率"
                    unit=""
                    :percentage="75"
                    :image="imageUrl"
                    value="25"
                    backgroundColor="#FFFFFF"
                    borderColor="#FFFFFF"
                    />
                    <BoxComponent
                    icon="🔥"
                    title="交易授权"
                    unit=""
                    :percentage="75"
                    :image="imageUrl"
                    value="25"
                    backgroundColor="#FFFFFF"
                    borderColor="#FFFFFF"
                    /> -->
                <!-- <StatBox icon="🔥" label="账户拒付率" :value="0 + '.00%'" />
                <StatBox icon="🔥" label="交易授权" :value="0 + '.00%'" /> -->
            </div>
            <Statistics></Statistics>
        </div>
    </PageContainer>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, nextTick, onActivated, watch, onBeforeMount, ref } from 'vue'
import headerSvg from '/@/assets/dashboard/header-1.svg'
import coffeeSvg from '/@/assets/dashboard/coffee.svg'
import { CountUp } from 'countup.js'
import * as echarts from 'echarts'
import { useNavTabs } from '/@/stores/navTabs'
import { useTemplateRefsList } from '@vueuse/core'
import { index } from '/@/api/backend/dashboard'
import { useI18n } from 'vue-i18n'
import { Local } from '/@/utils/storage'
import { useAdminInfo } from '/@/stores/adminInfo'
import { WORKING_TIME } from '/@/stores/constant/cacheKey'
import { fullUrl, getGreet } from '/@/utils/common'
import { useEventListener } from '@vueuse/core'
import {
    accountSingleApi
 } from '/@/api/backend/index.ts';
import headerContent from '/@/components/headerContent/index.vue'
import StatBox from '/@/components/StatBox/index.vue'
import Statistics from './Statistics.vue'
import BoxComponent from '/@/components/BoxComponent/index.vue'
import imageUrl from '/@/assets/svgviewer-output.svg'; // 引入图片
import PageContainer from '/@/components/PageContainer/index.vue'

let workTimer: number

defineOptions({
    name: 'dashboard',
})

const d = new Date()
const { t } = useI18n()
const navTabs = useNavTabs()
const adminInfo = useAdminInfo()
const chartRefs = useTemplateRefsList<HTMLDivElement>()
const state: {
    charts: any[]
    remark: string
    workingTimeFormat: string
    pauseWork: boolean
    AccountCountMoney:string
} = reactive({
    charts: [],
    remark: 'dashboard.Loading',
    workingTimeFormat: '',
    pauseWork: false,
    AccountCountMoney:''
})


const dataDialog: {
    totalMoney:string
    usedMoney:string
    usableMoney:string
    realTimeBalance:string
} = reactive({
    totalMoney:'0',
    usedMoney:'0',
    usableMoney:'0',
    realTimeBalance:'0'
})


index().then((res) => {
    state.remark = res.data.remark
})

const countUpFun = (id: string) => {
    nextTick(() => {
        let value = document.getElementById(id)?.innerText
        if (value) {
            new CountUp(id, parseInt(value), {
                startVal: 0,
                duration: 3,
            }).start()
        }
    })
}

const initCountUp = () => {
    countUpFun('user_reg_number')
    countUpFun('file_number')
    countUpFun('users_number')
    countUpFun('addons_number')
}


const getAccountCountMoneyFn = async ()=>{

    let postData = {}
    let res: anyObj = await accountSingleApi(postData)
    console.log(res,res);
    dataDialog.realTimeBalance = res.data.row.realTimeBalance
    // dataDialog.totalMoney = String(res.data.totalMoney);
    // dataDialog.usedMoney = String(res.data.usedMoney);
    // dataDialog.usableMoney = String(res.data.usableMoney);
    // console.log('dataDialog.AccountCountMoney:',dataDialog.AccountCountMoney);
}

const isLoading = ref(false)
onMounted(async () => {
    isLoading.value = true
    try {
        await getAccountCountMoneyFn()
    } finally {
        setTimeout(() => {
            isLoading.value = false
        }, 500)
    }
})

onBeforeMount(() => {
    for (const key in state.charts) {
        state.charts[key].dispose()
    }
})

onUnmounted(() => {
    clearInterval(workTimer)
})

</script>

<style scoped lang="scss">
.welcome {
    background: #e1eaf9;
    border-radius: 6px;
    display: flex;
    align-items: center;
    padding: 15px 20px !important;
    box-shadow: 0 0 30px 0 rgba(82, 63, 105, 0.05);
    .welcome-img {
        height: 100px;
        margin-right: 10px;
        user-select: none;
    }
    .welcome-title {
        font-size: 1.5rem;
        line-height: 30px;
        color: var(--ba-color-primary-light);
    }
    .welcome-note {
        padding-top: 6px;
        font-size: 15px;
        color: var(--el-text-color-primary);
    }
}
.working {
    height: 130px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    height: 100%;
    position: relative;
    &:hover {
        .working-coffee {
            -webkit-transform: translateY(-4px) scale(1.02);
            -moz-transform: translateY(-4px) scale(1.02);
            -ms-transform: translateY(-4px) scale(1.02);
            -o-transform: translateY(-4px) scale(1.02);
            transform: translateY(-4px) scale(1.02);
            z-index: 999;
        }
    }
    .working-coffee {
        transition: all 0.3s ease;
        width: 80px;
    }
    .working-text {
        display: block;
        width: 100%;
        font-size: 15px;
        text-align: center;
        color: var(--el-text-color-primary);
    }
    .working-opt {
        position: absolute;
        top: -40px;
        right: 10px;
        background-color: rgba($color: #000000, $alpha: 0.3);
        padding: 10px 20px;
        border-radius: 20px;
        color: var(--ba-bg-color-overlay);
        transition: all 0.3s ease;
        cursor: pointer;
        opacity: 0;
        z-index: 999;
        &:active {
            background-color: rgba($color: #000000, $alpha: 0.6);
        }
    }
    &:hover {
        .working-opt {
            opacity: 1;
            top: 0;
        }
        .working-done {
            opacity: 1;
            top: 50px;
        }
    }
}
.small-panel-box {
    margin-top: 20px;
}
.small-panel {
    background-color: #e9edf2;
    border-radius: var(--el-border-radius-base);
    padding: 25px;
    margin-bottom: 20px;
    .small-panel-title {
        color: #92969a;
        font-size: 15px;
    }
    .small-panel-content {
        display: flex;
        align-items: flex-end;
        margin-top: 20px;
        color: #2c3f5d;
        .content-left {
            font-size: 24px;
            .icon {
                margin-right: 10px;
            }
            span {
                display: inline-block;
                font-size: 28px;
            }
        }
        .content-right {
            font-size: 18px;
            margin-left: auto;
        }
        .color-success {
            color: var(--el-color-success);
        }
        .color-warning {
            color: var(--el-color-warning);
        }
        .color-danger {
            color: var(--el-color-danger);
        }
        .color-info {
            color: var(--el-text-color-secondary);
        }
    }
}
.growth-chart {
    margin-bottom: 20px;
}
.user-growth-chart,
.file-growth-chart {
    height: 260px;
}
.new-user-growth {
    height: 300px;
}

.user-source-chart,
.user-surname-chart {
    height: 400px;
}
.new-user-item {
    display: flex;
    align-items: center;
    padding: 20px;
    margin: 10px 15px;
    box-shadow: 0 0 30px 0 rgba(82, 63, 105, 0.05);
    background-color: var(--ba-bg-color-overlay);
    .new-user-avatar {
        height: 48px;
        width: 48px;
        border-radius: 50%;
    }
    .new-user-base {
        margin-left: 10px;
        color: #2c3f5d;
        .new-user-name {
            font-size: 15px;
        }
        .new-user-time {
            font-size: 13px;
        }
    }
    .new-user-arrow {
        margin-left: auto;
    }
}
.new-user-card :deep(.el-card__body) {
    padding: 0;
}

@media screen and (max-width: 425px) {
    .welcome-img {
        display: none;
    }
}
@media screen and (max-width: 1200px) {
    .lg-mb-20 {
        margin-bottom: 20px;
    }
}
html.dark {
    .welcome {
        background-color: var(--ba-bg-color-overlay);
    }
    .small-panel {
        background-color: var(--ba-bg-color-overlay);
        .small-panel-content {
            color: var(--el-text-color-regular);
        }
    }
    .new-user-item {
        .new-user-base {
            color: var(--el-text-color-regular);
        }
    }
}
.statistics-container {
    display: flex;
    padding: 20px 0px 0;
    // margin-left: 10px;
}
.content-box {
    // background-color: var(--ba-bg-color-overlay);s
     background: #fff;
     margin: 0 50px 0 0;
     padding: 0px;
     box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 16px 0px;
     border-radius: 6px;
     border: 1px solid rgb(232, 234, 237);
    //  font-family: 'FontTen', sans-serif !important;
     .unit {
        //  font-family: 'FontNine', sans-serif !important;
        padding: 3px 0 17px 20px;
     }
  }
  .stat-box {
    display: flex;
    align-items: center;
    width: 270px;
    // height: 110px;
    padding: 20px 20px 0;
    max-width: 300px;
    .icon-container {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
        .icon {
            color: white;
            font-size: 24px;
        }
    }
    .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 25px;
        .title {
            font-size: 14px;
            margin-bottom: 5px;
        }
        .value {
            font-size: 20px;
            font-weight: bold;
        }
    }
  }
</style>

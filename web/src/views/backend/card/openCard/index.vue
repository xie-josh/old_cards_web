<template>
  <div>
    <headerContent>
        <span>{{ t('pagesTitle.card/openCard') }}</span>
    </headerContent>
    <div class="default-main ba-table-box">
        <div v-if="false" class="header-title">
        {{ quickCardOpening }}
        </div>
        <div class="form-container">
            <el-form
                ref="ruleFormRef"
                :model="openCard"
                :rules="rules"
                label-width="130px"
                class="center-form"
                label-position="top"
                >
                <!-- <div class="title">{{cardholderUser}}</div> -->
                <el-form-item label="币种">
                    <div class="bin-container">
                        <el-button class="bin-button" disabled>
                        USD
                        </el-button>
                    </div>
                </el-form-item>
                <el-form-item :label="cardBin" prop="cardBin">
                    <div class="bin-container">
                        <el-button
                        v-for="(bin, index) in binOptions"
                        :key="index"
                        @click="selectBin(bin)"
                        :type="openCard.cardBin === bin ? 'primary' : ''"
                        class="bin-button"
                        >
                        {{ bin }}
                        </el-button>
                    </div>
                </el-form-item>
                <el-form-item label="卡介绍">
                    <el-input
                        v-model="textarea"
                        style="width: 440px"
                        :rows="9"
                        type="textarea"
                        placeholder="Please input"
                        disabled
                        resize="none"
                    />
                </el-form-item>
                <div style="display: flex;">
                    <el-form-item :label="number" required class="custom-label-position" prop="quantity">
                        <!-- <el-input-number v-model="openCard.quantity" :min="0" class="el-input" integer></el-input-number> -->
                        <el-input-number v-model="openCard.quantity" :min="0" class="el-input" integer controls-position="right">
                            <template #decrease-icon>
                            <el-icon>
                                <Minus />
                            </el-icon>
                            </template>
                            <template #increase-icon>
                            <el-icon>
                                <Plus />
                            </el-icon>
                            </template>
                        </el-input-number>
                    </el-form-item>
                    <el-form-item :label="amount" required class="custom-label-position" style="margin-left: 15px;" prop="amount">
                        <el-input v-model="openCard.amount" class="el-input" type="number" :min="1"></el-input>
                    </el-form-item>
                </div>
                <div class="form-actions">
                    <el-form-item>
                        <el-button type="primary" :loading="loading" @click="batchConfirmFn(ruleFormRef)">{{submit}}</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, reactive, watch, computed } from 'vue'
import baTableClass from '/@/utils/baTable'
import PopupForm from './popupForm.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index.vue'
import { defaultOptButtons } from '/@/components/table'
import { baTableApi } from '/@/api/common'
import { useI18n } from 'vue-i18n'
import { getCardBinApi,openCardApi} from '/@/api/backend/index.ts';
import { tips } from '/@/utils/common';
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import headerContent from '/@/components/headerContent/index.vue'
import { Minus, Plus } from '@element-plus/icons-vue'
defineOptions({
    name: 'user/user',
})

const { t } = useI18n()
const tableRef = ref()
const quickCardOpening = computed(() => t('card.openCard.quick_card_opening'))
const cardholderUser = computed(() => t('card.openCard.cardholder_user'))
const cardBin = computed(() => t('card.openCard.card_bin'))
const number = computed(() => t('card.openCard.number'))
const amount = computed(() => t('card.openCard.amount'))
const submit = computed(() => t('card.openCard.submit'))
const textarea = computed(() => t('card.openCard.card_introduce'))

const binOptions = ref(
    []
)
const loading = ref(false)
interface openCard {
  'quantity':number
  'amount':number
  'cardBin':string
}

const openCard:openCard = reactive({
    'quantity':0,
    'amount':1,
    'cardBin':''
})
const validateCardBin = (rule: any, value: string, callback: any) => {
    if (value === '') {
        callback(new Error(t('card.openCard.Please_select_card_bin')))
    } else {
        callback()
    }
}
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules<openCard>>({
    quantity: [
        { required: true, message: t('card.openCard.card_numbers_tips'), trigger: 'blur' },
        { type: 'number', min: 1, message: t('card.openCard.card_numbers_must_be_greater_than_zero_tips'), trigger: 'blur' }
    ],
    amount: [
        { required: true, message: t('card.openCard.Please_fill_in_the_amount'), trigger: 'blur' },
        // { type: 'number', min: 20, message: '金额必须大于等于20', trigger: 'blur' }
    ],
    cardBin: [
        { validator: validateCardBin, trigger: 'change' }
    ]
})
const resetForm = (formEl: FormInstance) => {
    openCard.quantity = 0
    openCard.cardBin = ''
    openCard.amount = 1
    formEl.resetFields()
}
const batchConfirmFn = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (openCard.amount < 1) {
            ElMessage({
                message: t('card.openCard.amount_must_be_greater_than_twenty_tips'),
                type: 'warning',
            })
            return
        }
        if (valid) {
            try {
                loading.value = true
                let postData = {
                    'card_bin': openCard.cardBin,
                    'arrival_amount': openCard.amount,
                    'number': openCard.quantity,
                }
                console.log('postData', postData)
                let res: anyObj = await openCardApi(postData)
                tips(t('card.openCard.open_card_tips'), 'success')
                resetForm(formEl)
            } catch (error) {
                console.error('error', error)
                // ElMessage.error('开卡失败，请重试')
                loading.value = false
                resetForm(formEl)
            } finally {
                setTimeout(() => {
                    loading.value = false
                }, 3000)
            }
        } else {
            console.log('error submit!', fields)
        }
    })
}
// const batchConfirmFn = async(type:number) =>{
//   if (openCard.quantity <= 0) {
//       ElMessage({
//           message: '开卡数量必须大于0',
//           type: 'warning',
//       })
//       return
//   }
//   loading.value = true
//   let postData = {
//       'card_bin':openCard.cardBin,
//       'arrival_amount':openCard.amount,
//       'number':openCard.quantity,
//   }
//   let res: anyObj = await openCardApi(postData)
//   tips('开卡中，请稍后刷新列表', 'success')
//   setTimeout(() => {
//       loading.value = false
//       openCard.quantity = 0
//       openCard.cardBin = ''
//   }, 3000)
// }

const getSelectBin = async() => {
    let postData = {}
    let res: anyObj = await getCardBinApi(postData)
    binOptions.value = res['data']['list']
    console.log(res);
}
getSelectBin()
// 监听 cardBin 的变化
watch(() => openCard.cardBin, (newValue) => {
    if (newValue) {
        ruleFormRef.value?.clearValidate('cardBin')
    }
})

const selectBin = (bin: string) => {
    openCard.cardBin = bin
    ruleFormRef.value?.validateField('cardBin')
}

</script>

<style scoped lang="scss">
.center-form {
    /* 保持其他表单项的样式不变 */
    --el-form-label-position: top;
}
.custom-label-position {
    --el-form-label-position: left;
    display: flex;
    align-items: center; /* 确保label和input垂直居中对齐 */
}
.custom-label-position .el-form-item__label {
    width: 130px; /* 或者您想要的宽度 */
    text-align: right;
    padding-right: 12px;
    line-height: normal; /* 重置行高 */
    margin-bottom: 0; /* 移除底部边距 */
}
.custom-label-position .el-form-item__content {
    margin-left: 0 !important;
    display: flex;
    align-items: center;
}
/* 如果textarea导致对齐问题，可以单独调整 */
.custom-label-position .el-textarea {
    margin-top: -4px; /* 微调textarea的位置 */
}
::v-deep .el-form-item__label{
    margin-top:10px !important;
}
.form-actions {
    display: flex;
    justify-content: flex-end; /* 将按钮固定在右边 */
    margin-right: 160px;
    margin-top: 10px;
}
.form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 78vh;
    background-color: var(--ba-bg-color-overlay);
    background: #fff;
}
.header-title {
    padding: 20px;
    background-color: #fff;
    border-bottom: 1px solid #DCDCDC;
}
.title {
    margin:10px 0 20px 50px;
    font-size: 16px;
    font-weight: bolder;
}
.center-form {
    width: 80%;
    max-width: 600px; /* 设置最大宽度 */
}
.form-item-label {
   padding: 5px 0;
}
.el-input {
   width: 120px
}
.bin-container {
    display: flex;
    flex-wrap: wrap;
    overflow-y: auto;
    max-height: 200px;
    padding-right: 10px;
    scrollbar-width: none;
    -ms-overflow-style: none;
    width: 440px;
}
.bin-container::-webkit-scrollbar {
    display: none;
}
.bin-button {
    margin: 7px;
    min-width: 0;
}
</style>

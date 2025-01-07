<template>
    <PageContainer :loading="isLoading">
        <headerContent>
            <span>{{ t('pagesTitle.auth/admin') }}</span>
        </headerContent>
        <div class="default-main ba-table-box">
            <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />

            <!-- 表格顶部菜单 -->
            <TableHeader
                :buttons="['refresh', 'add', 'edit', 'delete', 'comSearch', 'quickSearch', 'columnDisplay']"
                :quick-search-placeholder="t('Quick search placeholder', { fields: t('auth.admin.username') + '/' + t('auth.admin.nickname') })"
            />

            <!-- 表格 -->
            <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
            <Table>
                <template #totalRechargeSlot>
                    <el-table-column :label="t('auth.admin.totalRecharge')" align="center">
                        <template #header>
                            <el-tooltip
                                effect="dark"
                                placement="top"
                            >
                                <template #content>
                                    <div>{{ t('auth.admin.note') }}</div>
                                </template>
                                {{ t('auth.admin.totalRecharge') }}
                            </el-tooltip>
                        </template>
                        <template #default="scope">
                            <div>
                                {{ scope.row.get_sum_admin_money_log }}
                            </div>
                        </template>
                    </el-table-column>
                </template>
            </Table>

            <!-- 表单 -->
            <PopupForm />
            <el-dialog
            title="账户转账"
            :z-index="1000"
            v-model="dialogFormVisible"
            width="500"
            center
            destroy-on-close
            draggable
            >
            <div style="padding:10px;margin-bottom: 20px;font-size: 18px;">
                <span>卡余额:</span><span style="font-weight: bold">&nbsp;&nbsp;${{ dataDialog.realTimeBalance }}</span>
            </div>
                <el-form
                ref="ruleFormRef"
                :model="formData"
                :rules="formRules"
                label-width="100px"
                >
                    <el-form-item label="转账金额" required  prop="transfer_amount">
                    <el-input v-model="formData.transfer_amount" type="number" :min="0" />
                    </el-form-item>
                    <el-form-item label="转账类型" required  prop="transfer_type">
                        <el-select v-model="formData.transfer_type" placeholder="请选择转账类型">
                        <el-option label="转入到账户" value="transfer_in" />
                        <el-option label="账户转出" value="transfer_out" />
                        </el-select>
                    </el-form-item>
                </el-form>
                <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button :loading="loading" type="primary" @click="submit(ruleFormRef)">
                    确认
                    </el-button>
                </div>
                </template>
            </el-dialog>
        </div>
    </PageContainer>
</template>

<script setup lang="ts">
import { provide, ref, reactive, onMounted } from 'vue'
import baTableClass from '/@/utils/baTable'
import PopupForm from './popupForm.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index.vue'
import { defaultOptButtons } from '/@/components/table'
import { baTableApi } from '/@/api/common'
import { useAdminInfo } from '/@/stores/adminInfo'
import { useI18n } from 'vue-i18n'
import { tips } from '/@/utils/common';
import {
    postAdminCardCardsTransfer,
    accountSingleApi
} from '/@/api/backend/index.ts'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import headerContent from '/@/components/headerContent/index.vue'
import PageContainer from '/@/components/PageContainer/index.vue'
defineOptions({
    name: 'auth/admin',
})

const { t } = useI18n()
const adminInfo = useAdminInfo()

const optButtons = defaultOptButtons(['edit', 'delete'])
optButtons[1].display = (row) => {
    return row.id != adminInfo.id
}
let newButton: OptButton[] = [
    {
        // 渲染方式:tipButton=带tip的按钮,confirmButton=带确认框的按钮,moveButton=移动按钮
        render: 'tipButton',
        // 按钮名称
        name: 'info',
        // 鼠标放置时的 title 提示
        title: '账户转账',
        // 直接在按钮内显示的文字，title 有值时可为空
        text: '转账',
        // 按钮类型，请参考 element plus 的按钮类型
        type: 'primary',
        // 按钮 icon
        icon: '',
        class: 'table-row-info',
        // tipButton 禁用 tip
        disabledTip: false,
        // 自定义点击事件
        click: (row: TableRow, field: TableColumn) => {
            // if(!row.accountrequestProposal.cards_id){
            //     tips('未找到卡！')
            //     return
            // }
            console.log('row: TableRow, field: TableColumn', row, field)
            formData.admin_id = row.id
            getAccountCountMoneyFn()
            dialogFormVisible.value = true
            // accountAuditFn(1,row)
        },
        // 按钮是否显示，请返回布尔值
        display: (row: TableRow, field: TableColumn) => {
            return true
        },
        // 按钮是否禁用，请返回布尔值
        disabled: (row: TableRow, field: TableColumn) => {
            return false
        },
        // 自定义el-button属性
        attr: {}
    },
]
optButtons.push(...newButton);

const baTable = new baTableClass(
    new baTableApi('/admin/auth.Admin/'),
    {
        column: [
            { type: 'selection', align: 'center', operator: false },
            { label: t('Id'), prop: 'id', align: 'center', operator: '=', operatorPlaceholder: t('Id'), width: 70 },
            { label: t('auth.admin.username'), prop: 'username', align: 'center', operator: 'LIKE', operatorPlaceholder: t('Fuzzy query') },
            { label: t('auth.admin.nickname'), prop: 'nickname', align: 'center', operator: 'LIKE', operatorPlaceholder: t('Fuzzy query') },
            { label: t('auth.admin.grouping'), prop: 'group_name_arr', align: 'center', operator: false, render: 'tags' },
            // { label: t('auth.admin.head portrait'), prop: 'avatar', align: 'center', render: 'image', operator: false },
            // { label: t('auth.admin.mailbox'), prop: 'email', align: 'center', operator: 'LIKE', operatorPlaceholder: t('Fuzzy query') },
            // { label: t('auth.admin.mobile'), prop: 'mobile', align: 'center', operator: 'LIKE', operatorPlaceholder: t('Fuzzy query') },
            {
                label: t('auth.admin.Last login'),
                prop: 'last_login_time',
                align: 'center',
                render: 'datetime',
                sortable: 'custom',
                operator: 'RANGE',
                width: 160,
            },
            { label: t('Create time'), prop: 'create_time', align: 'center', render: 'datetime', sortable: 'custom', operator: 'RANGE', width: 160 },
            {
                label: t('State'),
                prop: 'status',
                align: 'center',
                render: 'tag',
                custom: { '0': 'danger', '1': 'success' },
                replaceValue: { '0': t('Disable'), '1': t('Enable') },
            },
            // { label: t('auth.admin.account_number'), prop: 'account_number', align: 'center' },
            // { label: t('auth.admin.open_account_number'), prop: 'open_account_number', align: 'center' },
            // { label: t('auth.admin.money'), prop: 'money', align: 'center' },
            // { label: t('auth.admin.used_money'), prop: 'used_money', align: 'center' },
            // { label: t('auth.admin.usable_money'), prop: 'usableMoney', align: 'center' },
            { label: t('auth.admin.totalRecharge'), prop: 'get_sum_admin_money_log', align: 'center', render: 'slot', slotName: 'totalRechargeSlot' },
            { label: t('auth.admin.amountUsed'), prop: 'get_sum_Transactions', align: 'center' },
            { label: t('auth.admin.cardBalance'), prop: 'get_sum_cards_info', align: 'center' },
            { label: t('auth.admin.walletAmount'), prop: 'money', align: 'center' },
            {
                label: t('Operate'),
                align: 'center',
                width: '150',
                render: 'buttons',
                buttons: optButtons,
                operator: false,
            },
        ],
        filter: {
            limit:100
        },
        dblClickNotEditColumn: [undefined, 'status'],
    },
    {
        defaultItems: {
            status: '1',
        },
    }
)
interface formDataType {
  'transfer_amount':number
  'transfer_type':string
  'admin_id':string
}
const formData:formDataType = reactive({
    'transfer_amount': 0,
    'transfer_type': 'transfer_in',
    'admin_id': ''
})
const ruleFormRef = ref<FormInstance>()
const formRules = reactive<FormRules<formDataType>>({
    transfer_amount: [
        { required: true, message: '请填写转账金额', trigger: 'blur' }
    ],
    transfer_type: [
        { required: true, message: '请选择转账方式', trigger: 'change' }
    ]
})
const dialogFormVisible = ref(false)
const loading = ref(false)
const resetForm = (formEl: FormInstance) => {
    formData.transfer_amount = 0
    formData.transfer_type = 'transfer_in'
    formData.admin_id = ''
    formEl.resetFields()
}
const submit =  async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (formData.transfer_amount <= 0) {
            ElMessage({
                message: '转账金额必须大于0',
                type: 'warning',
            })
            return
        }
        if (valid) {
            try {
                loading.value = true
                const params = {
                    'transfer_amount': formData.transfer_amount,
                    'transfer_type': formData.transfer_type,
                    'admin_id': formData.admin_id,
                }
                await postAdminCardCardsTransfer(params)
                tips('保存成功', 'success')
                dialogFormVisible.value = false
                console.log('dialogFormVisible', dialogFormVisible)
                resetForm(formEl)
            } catch (error) {
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
const getAccountCountMoneyFn = async ()=>{
    const postData = {
        'admin_id': formData.admin_id,
    }
    const res: anyObj = await accountSingleApi(postData)
    dataDialog.realTimeBalance = res.data.row.realTimeBalance
}
const isLoading = ref(false)

provide('baTable', baTable)
onMounted(async () => {
    isLoading.value = true
    try {
        // baTable 相关操作
        baTable.mount()
        baTable.getIndex()

    } finally {
        setTimeout(() => {
            isLoading.value = false
        }, 500)
    }
})
</script>

<style scoped lang="scss">
::v-deep .el-dialog {
    border-radius: 10px; /* 设置圆角半径 */
}
.dialog-footer {
    display: flex;
    justify-content: flex-end;
}
</style>

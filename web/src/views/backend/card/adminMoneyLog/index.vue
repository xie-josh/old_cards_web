<template>
    <PageContainer :loading="isLoading">
        <headerContent>
            <span>{{ t('pagesTitle.card/adminMoneyLog') }}</span>
        </headerContent>
        <div class="default-main ba-table-box">
            <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />

            <!-- 表格顶部菜单 -->
            <TableHeader
                :buttons="['refresh', 'add', 'edit', 'delete', 'columnDisplay']"
            />

            <!-- 表格 -->
            <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
            <Table ref="tableRef">
                <template #transfer_type>
                    <el-table-column :label="t('card.adminMoneyLog.transaction_type')" align="center">
                        <template #default="scope">
                            {{ scope.row.transfer_type === 'transfer_in' ? t('card.adminMoneyLog.transfer_in') : scope.row.transfer_type === 'transfer_out' ? t('card.adminMoneyLog.transfer_out') : '' }}
                        </template>
                    </el-table-column>
                </template>
                <template #original_amount>
                    <el-table-column :label="t('card.adminMoneyLog.original_amount')" align="center">
                        <template #default="scope">
                            <span v-if="scope.row.original_amount">$</span>{{ scope.row.original_amount  }}
                        </template>
                    </el-table-column>
                </template>
                <template #transaction_amount>
                    <el-table-column :label="t('card.adminMoneyLog.transaction_amount')" align="center">
                        <template #default="scope">
                            <span v-if="scope.row.transfer_type === 'transfer_in'" style="color: #51BA95;"><span v-if="scope.row.transaction_amount">+$</span>{{ scope.row.transaction_amount  }}</span>
                            <span v-else style="color: #F66196;"><span v-if="scope.row.transaction_amount">-$</span>{{ scope.row.transaction_amount  }}</span>
                        </template>
                    </el-table-column>
                </template>
                <template #business_type>
                    <el-table-column :label="t('card.adminMoneyLog.transaction_type')" align="center">
                        <template #default="scope">
                            <!-- {{ scope.row.business_type === 1 ? '钱包充值' : scope.row.business_type === 2 ? '钱包退款' : scope.row.business_type === 3 ? '开卡申请' : scope.row.business_type === 4 ? '卡片充值' : scope.row.business_type === 5 ? '卡片充退' : scope.row.business_type === 6 ? '卡片注销' : '' }} -->
                            <span>{{ getbusinessTypeLabel(scope.row.business_type) }}</span>
                        </template>
                    </el-table-column>
                </template>
            </Table>
            <!-- 表单 -->
            <PopupForm />
        </div>
    </PageContainer>
</template>

<script setup lang="ts">
import { ref, provide, onMounted } from 'vue'
import baTableClass from '/@/utils/baTable'
import PopupForm from './popupForm.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index.vue'
import { defaultOptButtons } from '/@/components/table'
import { baTableApi } from '/@/api/common'
import { useI18n } from 'vue-i18n'
import headerContent from '/@/components/headerContent/index.vue'
import { ElLoading } from 'element-plus'
import PageContainer from '/@/components/PageContainer/index.vue'

defineOptions({
    name: 'card/adminMoneyLog',
})

const { t } = useI18n()
const tableRef = ref()
const businessTypeMap: Record<number, string> = {
    1: t('card.adminMoneyLog.Deposit'),
    2: t('card.adminMoneyLog.refund'),
    3: t('card.adminMoneyLog.Create_card'),
    4: t('card.adminMoneyLog.card_deposit'),
    5: t('card.adminMoneyLog.card_refund'),
    6: t('card.adminMoneyLog.card_out')
}
const isLoading = ref(false)

const baTable = new baTableClass(
    new baTableApi('/admin/auth.AdminMoneyLog/'),
    {
        column: [
            { label: t('card.adminMoneyLog.check_id'), prop: 'transaction_id', align: 'center', operator: 'LIKE'},
            { label: t('card.adminMoneyLog.transaction_type'), prop: 'transfer_type', align: 'center', operator: false, slotName: 'transfer_type', render: 'slot' },
            { label: t('card.adminMoneyLog.original_amount'), prop: 'original_amount', align: 'center', operator: false, slotName: 'original_amount', render: 'slot'},
            { label: t('card.adminMoneyLog.transaction_amount'), prop: 'transaction_amount', align: 'center', operator: false, slotName: 'transaction_amount', render: 'slot' },
            { label: t('card.adminMoneyLog.current_amount'), prop: 'current_amount', align: 'center', operator: false, operatorPlaceholder: t('Fuzzy query') },
            { label: t('card.adminMoneyLog.business_type'), prop: 'business_type', align: 'center', operator: false, slotName: 'business_type', render: 'slot' },
            { label: t('card.adminMoneyLog.create_time'), prop: 'create_time', align: 'center', render: 'datetime',  operator: false, width: 160 },
        ],
        dblClickNotEditColumn: ['all'],
        filter: {
            limit:50
        }
    },
)
const getbusinessTypeLabel = (type: number) => {
    return businessTypeMap[type] || type
}
onMounted(async () => {
    isLoading.value = true
    try {
        // baTable 相关操作
        baTable.mount()
        baTable.getIndex()
    } finally {
        // setTimeout(() => {
        isLoading.value = false
        // }, 500)
    }
})

provide('baTable', baTable)
</script>

<style scoped lang="scss"></style>

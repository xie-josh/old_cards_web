<template>
    <PageContainer :loading="isLoading">
        <headerContent>
            <span>{{ t('pagesTitle.card/cardsTransactions') }}</span>
        </headerContent>
        <div class="default-main ba-table-box">
            <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />

            <!-- 表格顶部菜单 -->
            <TableHeader
            :buttons="['refresh', 'add', 'edit', 'delete', 'comSearch', 'columnDisplay']"
            :quick-search-placeholder="t('Quick search placeholder', { fields: t('card.cardsTransactions.id') + '/' + t('card.cardsTransactions.id') })"
            >
            <template #default>
                <el-button style="margin-left: 12px;" class="table-header-operate" :loading="loading" type="primary" plain :title="t('card.cardsTransactions.export_tips')"  @click="excelFn">
                    <span class="table-header-operate-text">{{ t('card.cardsTransactions.export') }}</span>
                </el-button>
                <el-tooltip
                    effect="dark"
                    placement="right"
                >
                    <template #content>
                        <div>1.{{ t('card.cardsTransactions.tips_1') }}</div>
                        <div>2.{{ t('card.cardsTransactions.tips_2') }}</div>
                        <div>3.{{ t('card.cardsTransactions.tips_3') }}</div>
                    </template>
                    <Icon name="el-icon-Warning" style="margin-left: 5px;color: #C0C0C0;"/>
                </el-tooltip>

            </template>
           </TableHeader>

            <!-- 表格 -->
            <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
            <Table ref="tableRef">
                <template #Transaction_type>
                    <el-table-column :label="t('card.cardsTransactions.Transaction_type')" align="center">
                        <template #default="scope">
                            <span>{{ getTransactionTypeLabel(scope.row.transaction_type) }}</span>
                        </template>
                    </el-table-column>
                </template>
                <template #Transaction_status>
                    <el-table-column :label="t('card.cardsTransactions.Transaction_status')" align="center">
                        <template #default="scope">
                            <span>{{ scope.row.status === 'succeed' || scope.row.status === 'authorized' ? t('card.cardsTransactions.succeed') : t('card.cardsTransactions.failed') }}</span>
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
import { onMounted, ref, provide } from 'vue'
import baTableClass from '/@/utils/baTable'
import PopupForm from './popupForm.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index.vue'
import { defaultOptButtons } from '/@/components/table'
import { baTableApi } from '/@/api/common'
import { useI18n } from 'vue-i18n'
import headerContent from '/@/components/headerContent/index.vue'
import PageContainer from '/@/components/PageContainer/index.vue'
import {
    adminCardCardsTransactionsExcel
} from '/@/api/backend/index.ts'
import { getUrl } from '/@/utils/axios'

defineOptions({
    name: 'card/cardsTransactions',
})
const { t } = useI18n()

const transactionTypeMap: Record<string, string> = {
    'auth': t('card.cardsTransactions.auth'),
    'corrective_auth': t('card.cardsTransactions.corrective_auth'),
    'verification': t('card.cardsTransactions.verification'),
    'void': t('card.cardsTransactions.void'),
    'refund': t('card.cardsTransactions.refund'),
    'corrective_refund': t('card.cardsTransactions.corrective_refund'),
    'recharge': t('card.cardsTransactions.recharge'),
    'recharge_return': t('card.cardsTransactions.recharge_return'),
    'discard_recharge_return': t('card.cardsTransactions.discard_recharge_return'),
    'service_fee': t('card.cardsTransactions.service_fee'),
    'refund_reversal': t('card.cardsTransactions.refund_reversal'),
    'fund_in': t('card.cardsTransactions.fund_in')
}
const tableRef = ref()
const isLoading = ref(false)
const loading = ref(false)
const baTable = new baTableClass(
    new baTableApi('/admin/card.CardsTransactions/'),
    {
        expandAll: false,
        column: [
            { type: 'selection', align: 'center', operator: false },
            { label: t('card.cardsTransactions.Trading_hours'), prop: 'created_at', align: 'center',render: 'datetime', operator: false },
            { label: t('card.cardsTransactions.Transaction_amount'), prop: 'txn_principal_change_amount', align: 'center', operator: false },
            { label: t('card.cardsTransactions.Merchant_name'), prop: 'merchant_name_location', align: 'center', operator: false },
            { label: t('card.cardsTransactions.Transaction_type'), prop: 'transaction_type', align: 'center', operator: false, slotName: 'Transaction_type', render: 'slot' },
            { label: t('card.cardsTransactions.Transaction_status'), prop: 'status', align: 'center', width: '180', operator: false, slotName: 'Transaction_status', render: 'slot' },
            { label: t('card.cardsTransactions.Transaction_number'), prop: 'system_transaction_id', align: 'center', operator: false },
            { label: t('card.cardsTransactions.Card_no'), prop: 'cards.card_no', align: 'center', operator: 'LIKE', operatorPlaceholder: t('card.cardsTransactions.Card_no')},
            // { label: t('Operate'), align: 'center', width: '130', render: 'buttons', buttons: defaultOptButtons() },
        ],
        dblClickNotEditColumn: ['all'],
    },
    {
        defaultItems: {},
    },
    {
        // 获得编辑数据后
        requestEdit: () => {
            if (baTable.form.items && !baTable.form.items.icon) baTable.form.items.icon = 'fa fa-circle-o'
        },
        onSubmit: () => {
            if (baTable.form.items!.type == 'route') {
                baTable.form.items!.menu_type = 'tab'
            } else if (['menu', 'menu_dir', 'nav_user_menu'].includes(baTable.form.items!.type)) {
                baTable.form.items!.no_login_valid = '0'
            }
        },
    }
)
const getTransactionTypeLabel = (type: string) => {
    return transactionTypeMap[type] || type
}
const excelFn = async () => {
    loading.value = true;
    try {
        const ids = baTable.getSelectionIds();
        const cardNo = baTable.comSearch.form['cards.card_no'];
        let params = {
            ids,
            card_no: cardNo
        }
        console.log(params)
        let res: anyObj =await adminCardCardsTransactionsExcel(params)
        let path = res.data.path
        downloadFile(path)
    } catch(error) {
        loading.value = false
    } finally {
        setTimeout(() => {
            loading.value = false
        }, 3000)
    }

}
const downloadFile = (url:string) => {
    let filePath = getUrl()+'/'+url
    const a = document.createElement('a');
    a.href = filePath;
    a.download = ''; // 如果你想指定文件名，可以在这里设置
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
onMounted(async () => {
    isLoading.value = true
    try {
        // baTable 相关操作
        baTable.table.ref = tableRef.value
        baTable.mount()
        baTable.getIndex()?.then(() => {
            baTable.dragSort()
        })

    } finally {
        setTimeout(() => {
            isLoading.value = false
        }, 500)
    }
})
provide('baTable', baTable)
baTable.table.showComSearch = true
</script>

<style scoped lang="scss"></style>

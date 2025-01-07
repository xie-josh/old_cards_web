<template>
    <PageContainer :loading="isLoading">
        <headerContent>
            <span>{{ t('pagesTitle.card/cardsMoneyLog') }}</span>
        </headerContent>
        <div class="default-main ba-table-box">
            <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />

            <!-- 表格顶部菜单 -->
            <TableHeader
                :buttons="['refresh', 'add', 'edit', 'delete', 'comSearch', 'quickSearch', 'columnDisplay']"
                :quick-search-placeholder="t('Quick search placeholder', { fields: t('user.user.User name') + '/' + t('user.user.nickname') })"
            />

            <!-- 表格 -->
            <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
            <Table ref="tableRef">
                <template #transfer_type>
                    <el-table-column :label="t('card.cardsMoneyLog.type')" align="center">
                    <template #default="scope">
                        {{ scope.row.transfer_type === 'transfer_in' ? t('card.cardsMoneyLog.top_up') : scope.row.transfer_type === 'transfer_out' ? t('card.cardsMoneyLog.roll_out') : '' }}
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
    name: 'card/cardsMoneyLog',
})

const { t } = useI18n()
const tableRef = ref()
const isLoading = ref(false)

const baTable = new baTableClass(
    new baTableApi('/admin/card.CardsMoneyLog/'),
    {
        column: [
            // { type: 'selection', align: 'center', operator: false },
            { label: t('card.cardsMoneyLog.amount'), prop: 'money', align: 'center', operator: 'LIKE', operatorPlaceholder: t('Fuzzy query') },
            { label: t('card.cardsMoneyLog.type'), prop: 'transfer_type', align: 'center', operator: 'LIKE', operatorPlaceholder: t('Fuzzy query'),slotName: 'transfer_type', render: 'slot' },
            { label: t('card.cardsMoneyLog.operating_time'), prop: 'create_time', align: 'center', render: 'datetime', operator: 'RANGE'},
        ],
        dblClickNotEditColumn: ['all'],
    },
)

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
provide('baTable', baTable)
</script>

<style scoped lang="scss"></style>

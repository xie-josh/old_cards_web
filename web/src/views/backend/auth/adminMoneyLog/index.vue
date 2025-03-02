<template>
    <PageContainer :loading="isLoading">
        <headerContent>
            <span>{{ t('pagesTitle.auth/adminMoneyLog') }}</span>
        </headerContent>
        <div class="default-main ba-table-box">
            <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />

            <!-- 表格顶部菜单 -->
            <!-- 自定义按钮请使用插槽，甚至公共搜索也可以使用具名插槽渲染，参见文档 -->
            <TableHeader
                :buttons="['refresh', 'add', 'edit', 'delete', 'comSearch', 'quickSearch', 'columnDisplay']"
                :quick-search-placeholder="t('Quick search placeholder', { fields: t('auth.adminMoneyLog.quick Search Fields') })"
            ></TableHeader>

            <!-- 表格 -->
            <!-- 表格列有多种自定义渲染方式，比如自定义组件、具名插槽等，参见文档 -->
            <!-- 要使用 el-table 组件原有的属性，直接加在 Table 标签上即可 -->
            <Table ref="tableRef"></Table>

            <!-- 表单 -->
            <PopupForm />
        </div>
    </PageContainer>
</template>

<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import PopupForm from './popupForm.vue'
import { baTableApi } from '/@/api/common'
import { defaultOptButtons } from '/@/components/table'
import TableHeader from '/@/components/table/header/index.vue'
import Table from '/@/components/table/index.vue'
import baTableClass from '/@/utils/baTable'
import headerContent from '/@/components/headerContent/index.vue'
import PageContainer from '/@/components/PageContainer/index.vue'
defineOptions({
    name: 'auth/adminMoneyLog',
})

const { t } = useI18n()
const tableRef = ref()
const optButtons: OptButton[] = defaultOptButtons(['edit', 'delete'])

/**
 * baTable 内包含了表格的所有数据且数据具备响应性，然后通过 provide 注入给了后代组件
 */
const baTable = new baTableClass(
    new baTableApi('/admin/auth.AdminMoneyLog/'),
    {
        pk: 'id',
        column: [
            { type: 'selection', align: 'center', operator: false },
            { label: t('auth.adminMoneyLog.id'), prop: 'id', align: 'center', width: 70, operator: 'RANGE', sortable: 'custom' },
            { label: t('auth.adminMoneyLog.admin__username'), prop: 'admin.username', align: 'center', operatorPlaceholder: t('Fuzzy query'), render: 'tags', operator: 'LIKE' },
            { label: t('auth.adminMoneyLog.raw_money'), prop: 'raw_money', align: 'center', operator: 'LIKE', sortable: false },
            { label: t('auth.adminMoneyLog.money'), prop: 'money', align: 'center', operator: 'LIKE', sortable: false },
            { label: t('auth.adminMoneyLog.credit_money'), prop: 'credit_money', align: 'center', operator: 'LIKE', sortable: false },
            { label: t('auth.adminMoneyLog.rate'), prop: 'rate', align: 'center', operator: 'LIKE', sortable: false },
            { label: t('auth.adminMoneyLog.recharge_channel_name'), prop: 'recharge_channel_name', align: 'center', operator: 'LIKE', sortable: false },
            { label: t('auth.adminMoneyLog.comment'), prop: 'comment', align: 'center', operatorPlaceholder: t('Fuzzy query'), operator: 'LIKE', sortable: false },
            { label: t('auth.adminMoneyLog.create_time'), prop: 'create_time', align: 'center', render: 'datetime', operator: 'RANGE', sortable: 'custom', width: 160, timeFormat: 'yyyy-mm-dd hh:MM' },
            { label: t('auth.adminMoneyLog.update_time'), prop: 'update_time', align: 'center', render: 'datetime', operator: 'RANGE', sortable: 'custom', width: 160, timeFormat: 'yyyy-mm-dd hh:MM' },
            { label: t('Operate'), align: 'center', width: 100, render: 'buttons', buttons: optButtons, operator: false },
        ],
        dblClickNotEditColumn: [undefined],
    },
    {
        defaultItems: {},
    }
)

provide('baTable', baTable)
const isLoading = ref(false)
onMounted(async () => {
    isLoading.value = true
    try {
        // baTable 相关操作
        baTable.table.ref = tableRef.value
        baTable.mount()
        baTable.getIndex()?.then(() => {
            baTable.initSort()
            baTable.dragSort()
        })

    } finally {
        setTimeout(() => {
            isLoading.value = false
        }, 500)
    }
})
</script>

<style scoped lang="scss"></style>

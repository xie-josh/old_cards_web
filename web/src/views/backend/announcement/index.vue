<template>
    <PageContainer :loading="isLoading">
        <headerContent>
            <span>{{ t('pagesTitle.announcement') }}</span>
        </headerContent>
        <div class="default-main ba-table-box">
            <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />

            <!-- 表格顶部菜单 -->
            <TableHeader
                :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']"
            />

            <!-- 表格 -->
            <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
            <Table ref="tableRef">
            </Table>
            <!-- 表单 -->
            <PopupForm />
        </div>
    </PageContainer>
</template>·

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
import PageContainer from '/@/components/PageContainer/index.vue'
import { ElLoading } from 'element-plus'

defineOptions({
    name: 'capitalCenter/depositOrder',
})

const { t } = useI18n()
const tableRef = ref()
const optButtons: OptButton[] = defaultOptButtons(['edit', 'delete'])
const baTable = new baTableClass(
    new baTableApi('/admin/Announcement/'),
    {
        expandAll: true,
        dblClickNotEditColumn: [undefined],
        column: [
            { type: 'selection', align: 'center' },
            { label: t('announcement.title'), prop: 'title', align: 'center', operator: false, showOverflowTooltip: true },
            { label: t('announcement.details'), prop: 'details', align: 'center', operator: false, operatorPlaceholder: t('Fuzzy query'), showOverflowTooltip: true },
            { label: t('announcement.updateTime'), prop: 'update_time', align: 'center', render: 'datetime', operator: false },
            { label: t('announcement.createTime'), prop: 'create_time', align: 'center', render: 'datetime',  operator: false },
            { label: t('Operate'), align: 'center', width: 130, render: 'buttons', buttons: optButtons, operator: false }
        ],
        dblClickNotEditColumn: ['all'],
        filter: {
            limit:20
        }
    },
)
const isLoading = ref(false)

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

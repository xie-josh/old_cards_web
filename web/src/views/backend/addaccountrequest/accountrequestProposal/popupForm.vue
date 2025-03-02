<template>
    <!-- 对话框表单 -->
    <!-- 建议使用 Prettier 格式化代码 -->
    <!-- el-form 内可以混用 el-form-item、FormItem、ba-input 等输入组件 -->
    <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="false"
        :model-value="['Add', 'Edit'].includes(baTable.form.operate!)"
        @close="baTable.toggleForm"
        width="50%"
    >
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                {{ baTable.form.operate ? t(baTable.form.operate) : '' }}
            </div>
        </template>
        <el-scrollbar v-loading="baTable.form.loading" class="ba-table-form-scrollbar">
            <div
                class="ba-operate-form"
                :class="'ba-' + baTable.form.operate + '-form'"
                :style="config.layout.shrink ? '':'width: calc(100% - ' + baTable.form.labelWidth! / 2 + 'px)'"
            >
                <el-form
                    v-if="!baTable.form.loading"
                    ref="formRef"
                    @submit.prevent=""
                    @keyup.enter="baTable.onSubmit(formRef)"
                    :model="baTable.form.items"
                    :label-position="config.layout.shrink ? 'top' : 'right'"
                    :label-width="baTable.form.labelWidth + 'px'"
                    :rules="rules"
                >
                    <FormItem :label="t('addaccountrequest.accountrequestProposal.bm')" type="string" v-model="baTable.form.items!.bm" prop="bm" :placeholder="t('Please input field', { field: t('addaccountrequest.accountrequestProposal.bm') })" />
                    <FormItem :label="t('addaccountrequest.accountrequestProposal.admin_id')" type="remoteSelect" v-model="baTable.form.items!.admin_id" prop="admin_id" :input-attr="{ pk: 'ba_admin.id', field: 'username', remoteUrl: '/admin/auth.Admin/index' }" :placeholder="t('Please select field', { field: t('addaccountrequest.accountrequestProposal.admin_id') })" />
                    <FormItem :label="t('addaccountrequest.accountrequestProposal.account_id')" type="string" v-model="baTable.form.items!.account_id" prop="account_id" :placeholder="t('Please input field', { field: t('addaccountrequest.accountrequestProposal.account_id') })" />
                    <FormItem :label="t('addaccountrequest.accountrequestProposal.status')" type="select" v-model="baTable.form.items!.status" prop="status" :input-attr="{ content: { 0 : t('addaccountrequest.accountrequestProposal.status 0'),1 : t('addaccountrequest.accountrequestProposal.status 1'),2 : t('addaccountrequest.accountrequestProposal.status 2'),3 : t('addaccountrequest.accountrequestProposal.status 3'),4 : t('addaccountrequest.accountrequestProposal.status 4')} }" :placeholder="t('Please select field', { field: t('addaccountrequest.accountrequestProposal.status') })" />
                    <FormItem :label="t('addaccountrequest.accountrequestProposal.time_zone')" type="select" v-model="baTable.form.items!.time_zone" prop="time_zone" :input-attr="{ content: { '' : '无','GMT -12:00' : 'GMT -12:00','GMT -11:00' : 'GMT -11:00','GMT -10:00' : 'GMT -10:00','GMT -9:00' : 'GMT -9:00','GMT -8:00' : 'GMT -8:00','GMT -7:00' : 'GMT -7:00','GMT -6:00' : 'GMT -6:00','GMT -5:00' : 'GMT -5:00','GMT -4:00' : 'GMT -4:00','GMT -3:00' : 'GMT -3:00','GMT -2:00' : 'GMT -2:00','GMT -1:00' : 'GMT -1:00','GMT 0:00' : 'GMT 0:00','GMT +1:00' : 'GMT +1:00','GMT +2:00' : 'GMT +2:00','GMT +3:00' : 'GMT +3:00','GMT +4:00' : 'GMT +4:00','GMT +5:00' : 'GMT +5:00','GMT +5:30' : 'GMT +5:30','GMT +6:00' : 'GMT +6:00','GMT +7:00' : 'GMT +7:00','GMT +8:00' : 'GMT +8:00','GMT +9:00' : 'GMT +9:00','GMT +10:00' : 'GMT +10:00','GMT +11:00' : 'GMT +11:00','GMT +12:00' : 'GMT +12:00','GMT +13:00' : 'GMT +13:00','GMT +14:00' : 'GMT +14:00'} }" :placeholder="t('Please select field', { field: t('account.time_zone') })" />
                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <div :style="'width: calc(100% - ' + baTable.form.labelWidth! / 1.8 + 'px)'">
                <el-button @click="baTable.toggleForm()">{{ t('Cancel') }}</el-button>
                <el-button v-blur :loading="baTable.form.submitLoading" @click="baTable.onSubmit(formRef)" type="primary">
                    {{ baTable.form.operateIds && baTable.form.operateIds.length > 1 ? t('Save and edit next item') : t('Save') }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import type { FormInstance, FormItemRule } from 'element-plus'
import { inject, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FormItem from '/@/components/formItem/index.vue'
import { useConfig } from '/@/stores/config'
import type baTableClass from '/@/utils/baTable'
import { buildValidatorData } from '/@/utils/validate'

const config = useConfig()
const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass

const { t } = useI18n()

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    accountrequest_id: [buildValidatorData({ name: 'number', title: t('addaccountrequest.accountrequestProposal.accountrequest_id') })],
    bm: [buildValidatorData({ name: 'required', title: t('addaccountrequest.accountrequestProposal.bm') })],
    admin_id: [buildValidatorData({ name: 'required', title: t('addaccountrequest.accountrequestProposal.admin_id') })],
    create_time: [buildValidatorData({ name: 'date', title: t('addaccountrequest.accountrequestProposal.create_time') })],
    update_time: [buildValidatorData({ name: 'date', title: t('addaccountrequest.accountrequestProposal.update_time') })],
})
</script>

<style scoped lang="scss"></style>

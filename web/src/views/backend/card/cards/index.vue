<template>
  <PageContainer :loading="isLoading">
    <headerContent>
        <span>卡片管理</span>
    </headerContent>
    <div class="default-main ba-table-box">
        <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />
        <!-- 表格顶部菜单 -->
        <TableHeader
            :buttons="['refresh', 'add', 'edit', 'delete', 'comSearch', 'columnDisplay']"
            :quick-search-placeholder="t('Quick search placeholder', { fields: t('card.cards.id') + '/' + t('card.cards.id') })"
        >
            <template #default>
                <!-- 批量搜索 -->
                <el-button class="table-header-operate" type="primary" @click="disposeFn(10,[])">
                    <span class="table-header-operate-text">{{ t('card.cards.batch_search') }}</span>
                </el-button>
                <el-button class="table-header-operate" type="danger" @click="batchAccountCancellation" :disabled="baTable.table.selection!.length > 0 ? false:true">
                <span class="table-header-operate-text">{{ t('card.cards.batch_del') }}</span>
            </el-button>
            </template>
        </TableHeader>
        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table ref="tableRef">
            <!-- 类型 -->
            <template #card_scheme>
                <el-table-column :label="t('card.cards.card_scheme')" width="180" align="center">
                    <template #default="scope">
                        {{ scope.row.card_scheme }}
                    </template>
                </el-table-column>
            </template>
            <template #operate>
                <el-table-column :label="t('card.cards.operate')" width="220" align="center">
                    <template #default="scope">
                        <el-dropdown placement="bottom-end" class="operate" v-if="scope.row.cardInfo.card_status !== 'cancelled' && scope.row.cardInfo.card_status != 'canceling'">
                            <el-button style="border: 0px; background-color: transparent;"> <Icon name="el-icon-MoreFilled" style="font-size: 14px;" color="#adadad" /></el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <!-- 限额 -->
                                    <el-dropdown-item v-if="scope.row.cardInfo.card_status == 'normal' || scope.row.cardInfo.card_status == 'cancelled'" @click="openQuotaDialog(scope.row)"><Icon name="el-icon-PieChart" class="menu_icon"/>
                                        {{ t('card.cards.quota') }}
                                    </el-dropdown-item>
                                    <!-- 冻结 -->
                                    <el-dropdown-item v-if="scope.row.cardInfo.card_status == 'normal'" @click="disposeFn(4,scope.row)"><Icon name="el-icon-Lock" class="menu_icon" />
                                        {{ t('card.cards.Frozen') }}
                                    </el-dropdown-item>
                                    <!-- 解冻 -->
                                    <el-dropdown-item v-if="scope.row.cardInfo.card_status == 'frozen'" @click="disposeFn(5,scope.row)"><Icon name="el-icon-Unlock" class="menu_icon" />
                                        {{ t('card.cards.thaw') }}
                                    </el-dropdown-item>
                                    <!-- 销卡 -->
                                    <el-popconfirm
                                        width="220"
                                        icon-color="#626AEF"
                                        :title="t('card.cards.Cancel_a_card_tips')"
                                        @confirm="() => handleConfirm(6)"
                                        @cancel="handleCancel"
                                        v-if="scope.row.cardInfo.card_status != 'cancelled' && scope.row.cardInfo.card_status != 'frozen'"
                                    >
                                        <template #reference>
                                            <div class="el-dropdown-menu__item" @click="setCurrentRow(scope.row)">
                                                <Icon name="el-icon-DocumentDelete" class="menu_icon" />
                                                <span>{{ t('card.cards.Cancel_a_card') }}</span>
                                            </div>
                                        </template>
                                    </el-popconfirm>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                        <!-- 详情 -->
                        <el-button v-if="scope.row.cardInfo.card_status !== 'cancelled' && scope.row.cardInfo.card_status !== 'canceling'"  type='primary' text='primary' @click="disposeFn(1,scope.row)">
                            {{t('card.cards.details')}}
                        </el-button>
                        <!-- 修改昵称 -->
                        <el-button v-if="scope.row.cardInfo.card_status !== 'cancelled' && scope.row.cardInfo.card_status !== 'canceling'"  type='primary' text='primary' @click="disposeFn(2,scope.row)">
                            {{ t('card.cards.note')}}
                        </el-button>
                    </template>
                </el-table-column>
            </template>
        </Table>
        <!-- 表单 -->
        <PopupForm />
        <!-- 详情 -->
        <div class="addPurchasingManagement-dialog">
            <el-dialog :title="t('card.cards.details')" :z-index="1000" v-model="card.show" @close="DialogCloseFn(1)" center destroy-on-close draggable>
                <div class="dialog-body">
                    <!-- table列表 -->
                    <el-form :model="card.info" label-position="top">
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <!-- 卡号 -->
                                <el-form-item :label="t('card.cards.Card_number')" class="width200">
                                    <div style="display: flex; align-items: center;">
                                        <el-input v-model="card.info.cardNumber" input-style="text-align: center;" disabled />
                                        <Icon name="el-icon-CopyDocument" style="font-size: 16px; margin-left: 4px;cursor: pointer;" color="#000" @click="copyText(card.info.cardNumber)" />
                                    </div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <!-- Expires -->
                                <el-form-item label="Expires" class="width200">
                                    <div style="display: flex; align-items: center;">
                                        <el-input v-model="card.info.expires" input-style="text-align: center;" disabled />
                                        <Icon name="el-icon-CopyDocument" style="font-size: 16px; margin-left: 4px;cursor: pointer;" color="#000" @click="copyText(card.info.expires)" />
                                    </div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <!-- CVV码 -->
                                <el-form-item :label="t('card.cards.CVV_code')" class="width200">
                                    <div style="display: flex; align-items: center;">
                                        <el-input v-model="card.info.cvv" input-style="text-align: center;" disabled />
                                        <Icon name="el-icon-CopyDocument" style="font-size: 16px; margin-left: 4px;cursor: pointer;" color="#000" @click="copyText(card.info.cvv)" />
                                    </div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </el-dialog>
        </div>
        <div class="addPurchasingManagement-dialog">
            <!-- 修改昵称 -->
            <el-dialog :title="t('card.cards.note')" class="width600" :z-index="1000" v-model="card.show1" @close="DialogCloseFn(2)" center destroy-on-close draggable>
                <div class="dialog-body">
                    <div class="tableList">
                        <el-input v-model="card.nickname" class="width240" placeholder="Please nickname" />
                    </div>
                </div>
                <template #footer>
                    <div>
                        <!-- 确认 -->
                        <el-button type="success" @click="confirmFn(1)" >{{ t('card.cards.verify') }} </el-button>
                        <!-- 取消 -->
                        <el-button @click="DialogCloseFn" class="cancel">{{ t('card.cards.Cancel') }}</el-button>
                    </div>
                </template>
            </el-dialog>
        </div>
        <div class="addPurchasingManagement-dialog">
            <!-- 扣款 -->
            <el-dialog :title="t('card.cards.Deduct_money')" class="width600" :z-index="1000" v-model="card.show11" @close="DialogCloseFn(11)" center destroy-on-close draggable>
                <div class="dialog-body">
                    <div class="tableList">
                        <el-input-number v-model="card.return_amount" class="width240" min="0" placeholder="Please return_amount" />
                    </div>
                </div>
                <template #footer>
                    <div>
                        <!-- 确认 -->
                        <el-button type="success" @click="confirmFn(11)" >{{ t('card.cards.verify') }}</el-button>
                        <!-- 取消 -->
                        <el-button @click="DialogCloseFn" class="cancel">{{ t('card.cards.Cancel') }}</el-button>
                    </div>
                </template>
            </el-dialog>
        </div>
        <div class="addPurchasingManagement-dialog">
            <!-- 修改限额 -->
            <el-dialog :title="t('card.cards.edit_quota')" class="width600" :z-index="1000" v-model="card.show12" @close="DialogCloseFn(12)" center destroy-on-close draggable>
                <div class="dialog-body">
                    <div class="tableList">
                        <el-input-number v-model="card.max_on_percent" class="width240" min="0"  placeholder="Please max_on_percent" />
                    </div>
                </div>
                <template #footer>
                    <div>
                        <!-- 确认 -->
                        <el-button type="success" @click="confirmFn(12)" >{{ t('card.cards.verify') }}</el-button>
                        <!-- 取消 -->
                        <el-button @click="DialogCloseFn" class="cancel">{{ t('card.cards.Cancel') }}</el-button>
                    </div>
                </template>
            </el-dialog>
        </div>
        <div class="addPurchasingManagement-dialog">
            <!-- 限额 -->
            <el-dialog :title="t('card.cards.quota')" class="dialog-width" :z-index="1000" v-model="card.show2" @close="DialogCloseFn(2)" center >
                <div class="dialog-body limitType">
                    <el-form :model="card.quota" label-width="160px" label-position="top">
                        <!-- 单笔最大交易额度 -->
                        <el-form-item :label="t('card.cards.single_stroke_Maximum_amount')" class="custom-form-item">
                            <!-- 最大额度 -->
                            <el-input v-model="card.quota.maxOnPercent" :placeholder="t('card.cards.Maximum_amount') + ': 00,000'">
                                <template #append>USD</template>
                            </el-input>
                        </el-form-item>
                        <!-- 日交易限额 -->
                        <el-form-item :label="t('card.cards.Day_trading_quota')" class="custom-form-item">
                            <!-- 最大额度 -->
                            <el-input v-model="card.quota.dailyLimit" :placeholder="t('card.cards.Maximum_amount') + ': 00,000'">
                                <template #append>USD</template>
                            </el-input>
                        </el-form-item>
                        <!-- 月交易限额 -->
                        <el-form-item :label="t('card.cards.Monthly_Transaction_quota')" class="custom-form-item">
                            <!-- 最大额度 -->
                            <el-input v-model="card.quota.monthlyLimit" :placeholder="t('card.cards.Maximum_amount') + ': 00,000'">
                                <template #append>USD</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item class="custom-form-item" style="margin-bottom: 0;">
                            <div class="form-item-content">
                                <!-- 交易限额 -->
                                <span class="left-text">
                                    {{ t('card.cards.Trading_quota') }}
                                </span>
                                <!-- 剩余额度 -->
                                <span style="padding: 0 5px;" v-if="card.quota.transactionLimitType != 'unlimited'" class="right-text">
                                    {{ t('card.cards.Remaining_amount') }}: {{ card.quota.availableTransactionLimit }}
                                </span>
                                <!-- 总限额 -->
                                <span v-if="card.quota.transactionLimitType != 'unlimited'" class="right-text">
                                    {{ t('card.cards.total_quota') }}: {{ card.quota.totalTransactionLimit }}
                                </span>
                            </div>
                        </el-form-item>
                        <el-form-item  class="custom-form-item">
                            <div style="display: flex; align-items: center;width:460px;">
                                <!-- 请选择 -->
                                <el-select v-model="card.quota.transactionLimitType" v-value="card.quota.transactionLimitType" :placeholder="t('card.cards.Please_select')" class="custom-select1" style="width: 150px;">
                                    <!-- 限制 -->
                                    <el-option :label="t('card.cards.restrict')" value="limited"></el-option>
                                    <!-- 不限 -->
                                    <el-option :label="t('card.cards.not_restrict')" value="unlimited"></el-option>
                                    <!-- 覆盖 -->
                                    <el-option :label="t('card.cards.cover')" value="cover"></el-option>
                                </el-select>
                                <el-select v-if="card.quota.transactionLimitType != 'unlimited'" v-model="card.quota.transaction_limit_change_type" :placeholder="t('card.cards.Please_select')" class="custom-select" style="margin-left: 25px;width: 80px;">
                                    <!-- 增加 -->
                                    <el-option :label="t('card.cards.augment')" value="increase"></el-option>
                                    <!-- 限制 -->
                                    <el-option :label="t('card.cards.restrict')" value="decrease"></el-option>
                                </el-select>
                                <el-input v-if="card.quota.transactionLimitType != 'unlimited'" v-model="card.quota.transaction_limit" placeholder="0" class="custom-select2" style="width: 230px;" />
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
                <template #footer>
                    <div class="footer-buttons">
                        <!-- 确认 -->
                        <el-button :disabled="card.isClickedShow2" type="success" @click="confirmFn(2)" style="padding: 19px;background-color: #ffb400;border:0;">{{ t('card.cards.verify') }}</el-button>
                        <!-- 取消 -->
                        <el-button @click="DialogCloseFn" style="color: #80108d;font-weight: bold;padding: 19px;background-color: #f5f7fa;border:0;">{{ t('card.cards.Cancel') }}</el-button>
                    </div>
                </template>
            </el-dialog>
        </div>
        <div class="addPurchasingManagement-dialog">
            <!-- 批量搜索 -->
            <el-dialog :title="t('card.cards.batch_search')" class="width600" :z-index="1000"  v-model="card.show10" @close="DialogCloseFn(10)" center>
                <div class="dialog-body">
                    <el-tabs v-model="activeName"  class="demo-tabs">
                        <!-- 卡号 -->
                        <el-tab-pane :label="t('card.cards.Card_number')" name="cards">
                            <el-input  v-model="card.cards_ids" style="width: 560px" :autosize="{ minRows: 20, maxRows: 25 }" type="textarea" placeholder="Please input"/>
                        </el-tab-pane>
                        <!-- 昵称 -->
                        <el-tab-pane :label="t('card.cards.nickname')" name="nickname">
                            <el-input v-model="card.nickname_ids" style="width: 560px" :autosize="{ minRows: 20, maxRows: 25 }" type="textarea" placeholder="Please input"/>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <template #footer>
                    <div>
                        <!-- 搜索 -->
                        <el-button type="success" @click="confirmFn(10)" >{{ t('card.cards.search') }}</el-button>
                    </div>
                </template>
            </el-dialog>
        </div>
        <!-- 详情 -->
        <el-dialog :title="t('card.cards.details')" :z-index="1000" v-model="card.showError" center destroy-on-close draggable>
            <div class="dialog-body">
                <el-table :data="card.error" style="width: 100%;max-height: 500px;overflow-y: auto;">
                    <!-- 卡号 -->
                    <el-table-column prop="card_no" :label="t('card.cards.Card_number')" />
                    <!-- 错误详情 -->
                    <el-table-column prop="msg" :label="t('card.cards.Error_details')" />
                </el-table>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <!-- 取消 -->
                    <el-button @click="DialogCloseFn">{{ t('card.cards.Cancel') }}</el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 充值 -->
        <el-dialog :title="t('card.cards.top_up')" class="width600" :z-index="1000" v-model="card.show7" @close="DialogCloseFn(2)" center destroy-on-close draggable>
            <div class="dialog-body">
                <div class="tableList">
                    <el-input-number v-model="card.arrivalAmount" min="1"></el-input-number>
                </div>
            </div>
            <template #footer>
                <div>
                    <!-- 确认 -->
                    <el-button type="success" @click="confirmFn(6)" >{{ t('card.cards.verify') }}</el-button>
                    <!-- 取消 -->
                    <el-button @click="DialogCloseFn" class="cancel">{{ t('card.cards.Cancel') }}</el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 批量限额 -->
        <el-dialog :title="t('card.cards.batch_quota')" class="dialog-width" :z-index="1000" v-model="card.showLimit" center >
            <div class="dialog-body limitType">
                <el-form :model="card.quota" label-width="160px" label-position="top">
                    <!-- 单笔最大交易额度 -->
                    <el-form-item :label="t('card.cards.single_stroke_Maximum_amount')" class="custom-form-item">
                        <!-- 最大额度 -->
                        <el-input v-model="card.quota.maxOnPercent" :placeholder="t('card.cards.Maximum_amount') + ': 00,000'">
                            <template #append>USD</template>
                        </el-input>
                    </el-form-item>
                    <!-- 日交易限额 -->
                    <el-form-item :label="t('card.cards.Day_trading_quota')" class="custom-form-item">
                        <el-input v-model="card.quota.dailyLimit" :placeholder="t('card.cards.Maximum_amount') + ': 00,000'">
                            <template #append>USD</template>
                        </el-input>
                    </el-form-item>
                    <!-- 月交易限额 -->
                    <el-form-item :label="t('card.cards.Monthly_Transaction_quota')" class="custom-form-item">
                        <el-input v-model="card.quota.monthlyLimit" :placeholder="t('card.cards.Maximum_amount') + ': 00,000'">
                            <template #append>USD</template>
                        </el-input>
                    </el-form-item>
                    <!-- 交易限额 -->
                    <el-form-item class="custom-form-item" style="margin-bottom: 0;">
                        <div class="form-item-content">
                            <!-- 交易限额 -->
                            <span class="left-text">{{t('card.cards.Trading_quota')}}</span>
                            <!-- 剩余额度 -->
                            <span v-if="card.quota.transactionLimitType == 'limited'" class="right-text">
                                {{ t('card.cards.Remaining_amount') }}: {{ card.quota.availableTransactionLimit }}
                            </span>
                        </div>
                    </el-form-item>
                    <el-form-item  class="custom-form-item">
                        <div style="display: flex; align-items: center;width:460px;">
                            <!-- 请选择 -->
                            <el-select v-model="card.quota.transactionLimitType" v-value="card.quota.transactionLimitType" :placeholder="t('card.cards.Please_select')" class="custom-select1" style="width: 150px;">
                                <!-- 限制 -->
                                <el-option :label="t('card.cards.restrict')" value="limited"></el-option>
                                <!-- 不限 -->
                                <el-option :label="t('card.cards.not_restrict')" value="unlimited"></el-option>
                                <!-- 覆盖 -->
                                <el-option :label="t('card.cards.cover')" value="cover"></el-option>
                            </el-select>
                            <el-select v-if="card.quota.transactionLimitType != 'unlimited'" v-model="card.quota.transaction_limit_change_type" :placeholder="t('card.cards.Please_select')" class="custom-select" style="margin-left: 25px;width: 80px;">
                                <!-- 增加 -->
                                <el-option :label="t('card.cards.augment')" value="increase"></el-option>
                                <!-- 减少 -->
                                <el-option :label="t('card.cards.decrease')" value="decrease"></el-option>
                            </el-select>
                            <el-input v-if="card.quota.transactionLimitType != 'unlimited'" v-model="card.quota.transaction_limit" placeholder="0" class="custom-select2" style="width: 230px;" />
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <div class="footer-buttons">
                    <!-- 确认 -->
                    <el-button :disabled="card.isClickedShowLimit" type="success" @click="batchConfirmFn(3)" style="padding: 19px;background-color: #ffb400;border:0;">{{ t('card.cards.verify') }}</el-button>
                    <!-- 取消 -->
                    <el-button @click="DialogCloseFn" style="color: #80108d;font-weight: bold;padding: 19px;background-color: #f5f7fa;border:0;">{{ t('card.cards.Cancel') }}</el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog title="限额" class="dialog-width" :z-index="1000" v-model="quotaDialog" @close="closeQuotaDialog" center >
            <div class="dialog-body limitType">
                <el-form :model="card.quota" label-width="160px" label-position="top">
                    <el-form-item label="单笔最大交易额度" class="custom-form-item">
                        <el-input v-model="card.quota.maxOnPercent" placeholder="最大额度: 00,000">
                            <template #append>USD</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="custom-form-item" style="margin-bottom: 0;">
                        <div class="form-item-content">
                            <span class="left-text">交易限额</span>
                            <span style="padding: 0 5px;" v-if="card.quota.transactionLimitType != 'unlimited'" class="right-text">剩余额度: {{ card.quota.availableTransactionLimit }}</span>
                            <span v-if="card.quota.transactionLimitType != 'unlimited'" class="right-text">总限额: {{ card.quota.totalTransactionLimit }}</span>
                        </div>
                    </el-form-item>
                    <el-form-item  class="custom-form-item">
                        <div style="display: flex; align-items: center;width:460px;">
                            <el-select v-model="card.quota.transactionLimitType" v-value="card.quota.transactionLimitType" placeholder="请选择" class="custom-select1" style="width: 150px;">
                                <el-option
                                    v-for="item in transactionLimitTypeList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                            <el-select v-if="card.quota.transactionLimitType != 'unlimited'" v-model="card.quota.transaction_limit_change_type" placeholder="请选择" class="custom-select" style="margin-left: 25px;width: 80px;">
                                <el-option
                                    v-for="item in transactionLimitChangeTypeList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                            <el-input v-if="card.quota.transactionLimitType != 'unlimited'" v-model="card.quota.transaction_limit" placeholder="0" class="custom-select2" style="width: 230px;" />
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <div class="footer-buttons">
                    <el-button :disabled="card.isClickedShow2" type="success" @click="addQuotaFn" style="padding: 19px;background-color: #ffb400;border:0;">确认</el-button>
                    <el-button @click="closeQuotaDialog" style="color: #80108d;font-weight: bold; padding: 19px; background-color: #f5f7fa;border:0;">取消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
    <el-dialog
    v-model="centerDialogVisible"
    :title="t('card.cards.batch_del')"
    width="500"
    align-center
  >
    <span>{{ t('card.cards.account_cancellation_tips') }}</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">{{ t('card.cards.Cancel') }}</el-button>
        <el-button type="primary" @click="verify">
            {{ t('card.cards.verify') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, provide, reactive, onMounted } from 'vue'
import baTableClass from '/@/utils/baTable'
import PopupForm from './popupForm.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index.vue'
import headerContent from '/@/components/headerContent/index.vue'
import { baTableApi } from '/@/api/common'
import { useI18n } from 'vue-i18n'
import {
    rechargeApi,
    cancelCardApi,
    cardInfoApi,
    cardsTransactionsApi,
    cardFreezeApi,
    updateCardApi,
    postAdminCardCardsRechargeReturn,
    postAdminCardCardsUpdateCard,
    cardUpdate,
    cardFreeze,
    postAdminCardCardsCancelCardIds
} from '/@/api/backend/index.ts';
import { tips } from '/@/utils/common';
import PageContainer from '/@/components/PageContainer/index.vue'
defineOptions({
    name: 'card/cards',
})

const { t } = useI18n()
const tableRef = ref()
const isLoading = ref(false)
const baTable = new baTableClass(
    new baTableApi('/admin/card.cards/'),
    {
        column: [
            { type: 'selection', align: 'center', operator: false },
            { label: t('card.cards.cardInfo__nickname'), prop: 'cardInfo.nickname', align: 'center', operator: 'LIKE',render: 'customTemplate', operatorPlaceholder: t('Fuzzy query'),
                customTemplate: (row: TableRow, field: TableColumn, value: any, column, index: number) => {
                    if(!value){
                        return '...';
                    }else{
                        return value;
                    }
                }
            },
            { label: t('card.cards.card_scheme'), prop: 'card_scheme', align: 'center', operator: false,slotName: 'card_scheme', render: 'slot' },
            { label: t('card.cards.mask_card_no'), prop: 'mask_card_no', align: 'center', operator: 'LIKE', operatorPlaceholder: t('Fuzzy query') },
            { label: t('card.cards.card_status'), prop: 'cardInfo.card_status', align: 'center', operator: false ,render: 'customTemplate',
                customTemplate: (row: TableRow, field: TableColumn, value: any, column, index: number) => {
                    if(value == 'normal'){
                        return '<span style="background-color:#f0fff3;padding:4px 9px;font-weight: bold;color:#22c55e;border-radius:4px;">'+t('card.cards.dynamic')+'</span>';
                    }else if(value == 'frozen'){
                        return '<span style="background-color:#fff5f0;padding:4px 9px;font-weight: bold;color: #ff5630;border-radius:4px;">'+t('card.cards.Frozen')+'</span>';
                    }else if(value == 'cancelled'){
                        return '<span style="background-color:#F5F5F5;padding:4px 9px;font-weight: bold;color: #808080;border-radius:4px;">'+ t('card.cards.Cancel_a_card') +'</span>';
                    }else if(value == 'canceling'){
                        return '<span style="background-color:#FFE4B5;padding:4px 9px;font-weight: bold;color: #FFA500;border-radius:4px;">'+ t('card.cards.Cancelling_the_card') +'</span>';
                    }else{
                        return value;
                    }
                }
            },
            { label: t('card.cards.created_at'), prop: 'created_at', align: 'center', operator: false },
            { label: t('card.cards.operate'), prop: 'created_at', align: 'center', operator: false,slotName: 'operate', render: 'slot' },
        ],
        dblClickNotEditColumn: ['all'],
        filter: {
            limit:50
        }
    },
    {
        defaultItems: {
            gender: 0,
            money: '0',
            score: '0',
            status: 'enable',
        },
    }
)
const activeName = ref('cards')
const card = reactive({
    id: 1,
    show: false,
    show1: false,
    show2: false,
    show7: false,
    show10: false,
    show11: false,
    show12: false,
    showError: false,
    showLimit: false,
    isClickedShow2: false,
    isClickedShowLimit: false,
    cards_ids: '',
    nickname_ids: '',
    info: {
        cardNumber: '',
        expires: '',
        cvv: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        cardBalance: '',
        info_amount: ''
    },
    transactions: [],
    nickname: '',
    return_amount: 0,
    max_on_percent: 0,
    quota: {
        maxOnPercent: '',
        dailyLimit: '',
        monthlyLimit: '',
        availableTransactionLimit: '0',
        totalTransactionLimit: '0',
        transactionLimitType: 'unlimited',
        transaction_limit_change_type: 'increase',
        transaction_limit: '',
    },
    error: [],
    is_d: true,
    arrivalAmount: 1
})
const selectType = ref<number>(0)
const currentRow = ref(null)
const quotaDialog = ref(false)

const transactionLimitTypeList = [
    {label:'限制', value: 'limited'},
    {label:'不限', value: 'unlimited'}
]
const transactionLimitChangeTypeList = [
    {label:'增加', value: 'increase'},
    {label:'减少', value: 'decrease'}
]

const disposeFn = (type: number, row:any) => {
    selectType.value = type
    card.id = row.card_id
    switch (type) {
        case 1:
            getCardIn(row.card_id)
            // cardsTransactionsFn(row.card_id)
            card.show = true
            break
        case 2:
            card.show1 = true
            card.nickname = row.nickname
            break
        case 3:
            card.show2 = true
            getCardIn(row.card_id)
            break
        case 4:
            confirmFn(3)
            break
        case 5:
            confirmFn(4)
            break
        case 6:
            confirmFn(5)
            break
        case 7:
            card.show7 = true
            break
        case 11:
            card.show11 = true
            break
        case 12:
            card.max_on_percent = row?.cardInfo?.max_on_percent
            card.show12 = true
            break
        case 8:
            if (baTable.table.selection!.length > 50) {
                tips('一次只能操作50条数据！')
                return
            }
            card.showLimit = true
            card.quota = {
                maxOnPercent: '',
                dailyLimit: '',
                monthlyLimit: '',
                availableTransactionLimit: '0',
                totalTransactionLimit: '0',
                transactionLimitType: 'unlimited',
                transaction_limit_change_type: 'increase',
                transaction_limit: '',
            }
            break
        case 10:
            card.show10 = true
            break
    }
}
const getCardIn = async (id: number) => {
    const res = await cardInfoApi({ id })
    const result = res.data.row
    card.info = {
        cardNumber: result.cardNo,
        expires: result.expirationDate,
        cvv: result.cvv,
        firstName: result.firstName,
        lastName: result.lastName,
        address: result.billingAddress,
        city: result.billingCity,
        state: result.billingState,
        zipCode: result.billingPostalCode,
        cardBalance: result.cardBalance,
        info_amount: result.info_amount
    }
    card.quota = {
        maxOnPercent: result.maxOnPercent,
        dailyLimit: result.max_on_daily,
        monthlyLimit: result.max_on_monthly,
        availableTransactionLimit: result.availableTransactionLimit,
        totalTransactionLimit: result.totalTransactionLimit,
        transactionLimitType: result.transactionLimitType,
        transaction_limit_change_type: 'increase',
        transaction_limit: '',
    }
    console.log('card.quota', card.quota)
}

const cardsTransactionsFn = async (id: number) => {
    const res = await cardsTransactionsApi({ id })
    card.transactions = res.data.row
    baTable.onTableHeaderAction('refresh', [])
}
const confirmFn = async (type: number) => {
    switch (type) {
        case 1:
            await updateCardApi({ card_id: card.id, nickname: card.nickname })
            tips('昵称修改成功', 'success')
            baTable.onTableHeaderAction('refresh', [])
            card.show1 = false
            break
        case 2:
            card.isClickedShow2 = true
            card.show2 = false
            const postData = {
                ids: [card.id],
                max_on_daily: card.quota.dailyLimit,
                max_on_monthly: card.quota.monthlyLimit,
                max_on_percent: card.quota.maxOnPercent,
                available_transaction_limit: card.quota.availableTransactionLimit,
                transaction_limit_type: card.quota.transactionLimitType,
                transaction_limit_change_type: card.quota.transactionLimitType !== 'unlimited' ? card.quota.transaction_limit_change_type : '',
                transaction_limit: card.quota.transactionLimitType !== 'unlimited' ? card.quota.transaction_limit : '',
            }
            const res = await cardUpdate(postData)
            baTable.onTableHeaderAction('refresh', [])
            if (Array.isArray(res.data.error) && res.data.error.length > 0) {
                card.error = res.data.error
                card.showError = true
            } else {
                tips('限额修改成功', 'success')
                baTable.onTableHeaderAction('refresh', [])
            }
            setTimeout(() => {
                card.isClickedShow2 = false
            }, 3000)
            break
        case 3:
            await cardFreezeApi({ id: card.id, status: 'freeze' })
            tips('冻结成功', 'success')
            baTable.onTableHeaderAction('refresh', [])
            card.show1 = false
            break
        case 4:
            await cardFreezeApi({ id: card.id, status: 'unfreeze' })
            tips('解冻成功', 'success')
            baTable.onTableHeaderAction('refresh', [])
            card.show1 = false
            break
        case 5:
            await cancelCardApi({ id: card.id })
            tips('销卡成功', 'success')
            baTable.onTableHeaderAction('refresh', [])
            card.show1 = false
            break
        case 6:
            await rechargeApi({ id: card.id, arrival_amount: card.arrivalAmount })
            tips('充值成功', 'success')
            card.show7 = false
            break
        case 10:
            const cards_ids = card.cards_ids.split('\n').map(item => item.trim()).filter(line => line).join(',')
            const nickname_ids = card.nickname_ids.split('\n').map(item => item.trim()).filter(line => line).join(',')
            if (cards_ids) {
        baTable.table.filter!.search?.push({
            field: 'cardInfo.card_no',
            val: cards_ids,
            operator: 'IN',
        })
            }
            if (nickname_ids) {
        baTable.table.filter!.search?.push({
            field: 'cardInfo.nickname',
            val: nickname_ids,
            operator: 'IN',
        })
            }
            baTable.onTableHeaderAction('quick-search', [])
            card.cards_ids = ''
            card.nickname_ids = ''
            card.show10 = false
            break
        case 11:
        case 12:
            await deductMoney()
            break
    }
}
const batchConfirmFn = async (type: number) => {
    const ids = baTable.getSelectionIds()
    switch (type) {
        case 1:
            card.is_d = false
            const freezeRes = await cardFreeze({ ids, status: 'freeze' })
            if (Array.isArray(freezeRes.data.error) && freezeRes.data.error.length > 0) {
                card.error = freezeRes.data.error
                card.showError = true
            }
            card.is_d = true
            tips('冻结成功', 'success')
            break
        case 2:
            card.is_d = false
            const unfreezeRes = await cardFreeze({ ids, status: 'unfreeze' })
            if (Array.isArray(unfreezeRes.data.error) && unfreezeRes.data.error.length > 0) {
                card.error = unfreezeRes.data.error
                card.showError = true
            }
            card.is_d = true
            tips('解冻成功', 'success')
            break
        case 3:
            card.isClickedShowLimit = true
            card.is_d = false
            card.showLimit = false
            const quotaPostData = {
                ids,
                max_on_daily: card.quota.dailyLimit,
                max_on_monthly: card.quota.monthlyLimit,
                max_on_percent: card.quota.maxOnPercent,
                available_transaction_limit: card.quota.availableTransactionLimit,
                transaction_limit_type: card.quota.transactionLimitType,
                transaction_limit_change_type: card.quota.transactionLimitType !== 'unlimited' ? card.quota.transaction_limit_change_type : '',
                transaction_limit: card.quota.transactionLimitType !== 'unlimited' ? card.quota.transaction_limit : '',
            }
            await cardUpdate(quotaPostData)
            card.is_d = true
            tips('限额修改成功', 'success')
            setTimeout(() => {
                card.isClickedShowLimit = false
            }, 3000)
            break
    }
}
const DialogCloseFn = (type: number = 1) => {
    card.show = false
    card.show1 = false
    card.show2 = false
    card.show7 = false
    card.showError = false
    card.showLimit = false
    card.is_d = true
    card.show11 = false
    card.show12 = false
}

const copyText = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        tips('复制成功', 'success')
    } catch (err) {
        tips('复制异常', 'error')
    }
};
const deductMoney = async () => {
    const params = selectType.value === 11
        ? { id: card.id, return_amount: card.return_amount }
        : { id: card.id, max_on_percent: card.max_on_percent }
    const api = selectType.value === 11 ? postAdminCardCardsRechargeReturn : postAdminCardCardsUpdateCard
    await api(params)
    const title = selectType.value === 11 ? '扣款成功' : '修改限额成功'
    tips(title, 'success')
    if (selectType.value === 11) {
        card.show11 = false
    } else {
        card.show12 = false
    }
}

baTable.table.showComSearch = true
const setCurrentRow = (row:any) => {
    currentRow.value = row
}

const handleConfirm = async (type: number) => {
    await cancelCardApi({ id: currentRow.value.card_id })
    tips('销卡成功', 'success')
    confirmFn(10)
}

const handleCancel = () => {
    console.log('Cancelled');
};

const openQuotaDialog = (row:any) => {
    card.id = row.card_id
    quotaDialog.value = true
    getCardIn(row.card_id)
}
const closeQuotaDialog = () => {
    quotaDialog.value = false
}
const addQuotaFn = async () => {
    try {
        card.isClickedShow2 = true
        const postData = {
            card_id: card.id,
            max_on_percent: card.quota.maxOnPercent,
            available_transaction_limit: card.quota.availableTransactionLimit,
            transaction_limit_type: card.quota.transactionLimitType,
            transaction_limit_change_type: card.quota.transactionLimitType !== 'unlimited' ? card.quota.transaction_limit_change_type : '',
            transaction_limit: card.quota.transactionLimitType !== 'unlimited' ? card.quota.transaction_limit : '',
        }
        await updateCardApi(postData)
        tips('保存成功', 'success')
        baTable.onTableHeaderAction('refresh', [])
    } catch (error){
        console.log(error)
    } finally {
        quotaDialog.value = false
        card.isClickedShow2 = false
    }
}
const centerDialogVisible = ref(false)
const cardIds = ref<any[]>([])
const batchAccountCancellation = () => {
    centerDialogVisible.value = true
    const selectedRows = baTable.table.selection || []
    cardIds.value = selectedRows.map((row:any)=>row.card_id)
}
const verify = async () => {
    try{
        const params = {
            card_ids: cardIds.value
        }
        await postAdminCardCardsCancelCardIds(params)
        tips('销卡成功', 'success')
    } catch (error) {
        console.log(error)
    } finally {
        centerDialogVisible.value = false
        baTable.onTableHeaderAction('quick-search',[])
    }
}
const cancel = () => {
    centerDialogVisible.value = false
}

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

<style scoped lang="scss">

.operate {
    el-button {
        border: 0px;
    }
}

.menu-button {
  display: inline-block;
  cursor: pointer;
  padding: 0px 10px;
}

.menu {
  position: absolute;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 1px 10px;
  z-index: 1000;
}

.menu-up{
  bottom: 90%;
  transform-origin: bottom left;
}

.menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu ul li {
  padding: 5px 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.menu ul li i {
  margin-right: 8px;
}

.menu_icon{
  margin:0 6px 0 0;
}

.dialog-body input{
  text-align: center !important;
}

.custom-dialog .el-dialog__title {
  color: #333;
  font-weight: bold;
  font-size: 18px;
}

.custom-dialog .el-dialog__body {
  padding: 20px 30px;
}

.custom-form-item .el-form-item__label {
  color: #666;
  font-size: 14px;
  font-weight: normal;
}

.custom-form-item .el-input,
.custom-form-item .el-select {
  width: 100%;
  max-width: 457px;
  height: 42px;
}

.custom-form-item .el-input__inner,
.custom-form-item .el-select__inner {
  background-color: #2360bd;
  border: 1px solid #dcdfe6;
  color: #333;
}

.custom-form-item .el-input__inner:disabled {
  background-color: #f5f7fa;
  color: #999;
}

.custom-confirm-btn {
  background-color: #ffcc00;
  border-color: #ffcc00;
  color: #fff;
}

.custom-cancel-btn {
  color: #333;
  border: none;
}

.custom-confirm-btn:hover,
.custom-cancel-btn:hover {
  background-color: #ffb400;
  border-color: #ffb400;
}

.dialog-footer {
  text-align: right;
}

.el-dialog__footer {
  padding: 15px 20px;
}

::v-deep .custom-select div{
  background-color: #dfdeea;
  border-radius: 5px 0 0 5px !important;
  height: 42px;
  display: flex;
  align-items: center;
  box-shadow: 0 0 0 0;
}

::v-deep .custom-select2 div{
  border-radius:0;
  width: 200px;
}

::v-deep .custom-select1 div{
  height: 42px;
  display: flex;
  align-items: center;
  background-color: #f5f5f9;
}

::v-deep .el-input-group__append{
  background-color: #dfdeea;
}

.footer-buttons {
    display: flex;
    justify-content: flex-start;
}
.form-item-content {
    width: 97%;
    display: inline-block;
    position: relative;
}
.left-text {
    float: left;
}
.right-text {
    float: right;
}
::v-deep .limitType {
    .el-input__inner{
        color: #afafaf
    }
    .el-input__wrapper {
        background-color: #f5f5f9; /* 设置边框颜色 */
    }
    .el-select__wrapper{
        box-shadow: 0 0 0 0 #fff;
    }
}
::v-deep .el-dialog {
    border-radius: 10px; /* 设置圆角半径 */
}
.statistics-container {
    display: flex;
    padding: 20px 20px 0;
}
.dialog-width {
    width: 518px;
    padding: 22px 27px;
}
.width200 {
    width: 200px;
}
.width240 {
    width: 240px
}
.width600 {
    width: 600px;
}
.cancel {
    right: 20px;
    position: absolute;
}
</style>

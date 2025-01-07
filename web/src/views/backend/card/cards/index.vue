<template>
  <PageContainer :loading="isLoading">
    <headerContent>
        <span>卡片管理</span>
    </headerContent>
    <div class="default-main ba-table-box">
        <div class="statistics-container" v-if="false">
            <CenteredContent title="总开卡数量" value="100" />
            <CenteredContent title="可开卡数量" value="15" />
            <CenteredContent title="可开卡数量" value="789" />
        </div>
        <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />

        <!-- 表格顶部菜单 -->
        <TableHeader
            :buttons="['refresh', 'add', 'edit', 'delete', 'comSearch', 'columnDisplay']"
            :quick-search-placeholder="t('Quick search placeholder', { fields: t('card.cards.id') + '/' + t('card.cards.id') })"
        >
            <template #default  >
            <!-- <el-button class="table-header-operate" type="danger" plain :disabled="baTable.table.selection!.length > 0  && card.is_d ? false:true" @click="disposeFn(6,[])">
                <span class="table-header-operate-text">批量冻结</span>
            </el-button>
            <el-button class="table-header-operate" type="success" plain :disabled="baTable.table.selection!.length > 0 && card.is_d ? false:true" @click="disposeFn(7,[])">
                <span class="table-header-operate-text">批量解冻</span>
            </el-button>
            <el-button class="table-header-operate" type="primary" plain :disabled="baTable.table.selection!.length > 0 && card.is_d ? false:true" @click="disposeFn(8,[])">
                <span class="table-header-operate-text">批量限额</span>
            </el-button> -->
            <el-button class="table-header-operate" type="primary" @click="disposeFn(10,[])">
                <span class="table-header-operate-text">{{ t('card.cards.batch_search') }}</span>
            </el-button>
        </template>
        </TableHeader>
        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table ref="tableRef">
            <template #card_scheme>
                <el-table-column :label="t('card.cards.card_scheme')" width="180" align="center">
                <template #default="scope">
                    <!-- <span v-if="scope.row.card_scheme === 'VISA'">
                    <img src="~assets/visa.svg" alt="VISA Icon" style="width: 50px; height: 50px;">
                    </span>
                    <span v-else>
                    {{ scope.row.card_scheme }}
                    </span> -->
                    {{ scope.row.card_scheme }}
                </template>
                </el-table-column>
            </template>
            <template #operate>
                <el-table-column :label="t('card.cards.operate')" width="220" align="center">
                    <template #default="scope">
                        <el-dropdown placement="bottom-end" class="operate" v-if="scope.row.card_status !== 'cancelled' && scope.row.card_status != 'canceling'">
                        <el-button style="border: 0px; background-color: transparent;"> <Icon name="el-icon-MoreFilled" style="font-size: 14px;" color="#adadad" /></el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                            <!-- <el-dropdown-item v-if="scope.row.card_status != 'cancelled'" @click="disposeFn(1,scope.row)"><Icon name="el-icon-Tickets" class="menu_icon"/>详情</el-dropdown-item> -->
                            <el-dropdown-item v-if="scope.row.card_status != 'cancelled'" @click="disposeFn(7,scope.row)"><Icon name="el-icon-Plus" class="menu_icon" />{{t('card.cards.top_up')}}</el-dropdown-item>
                            <!-- <el-dropdown-item><Icon name="el-icon-DeleteFilled" class="menu_icon"/>销卡</el-dropdown-item> -->
                            <el-dropdown-item v-if="scope.row.card_status != 'cancelled'" @click="disposeFn(11,scope.row)"><Icon name="el-icon-Minus" class="menu_icon" />{{t('card.cards.Deduct_money')}}</el-dropdown-item>
                            <el-dropdown-item v-if="scope.row.card_status == 'normal'" @click="disposeFn(4,scope.row)"><Icon name="el-icon-Lock" class="menu_icon" />{{t('card.cards.Frozen')}}</el-dropdown-item>
                            <el-dropdown-item v-if="scope.row.card_status == 'frozen'" @click="disposeFn(5,scope.row)"><Icon name="el-icon-Unlock" class="menu_icon" />{{t('card.cards.thaw')}}</el-dropdown-item>
                            <!-- <el-dropdown-item v-if="scope.row.card_status != 'cancelled'" @click="disposeFn(2,scope.row)"><Icon name="el-icon-EditPen" class="menu_icon"/>修改昵称</el-dropdown-item> -->
                            <el-dropdown-item v-if="scope.row.card_status != 'cancelled'" @click="disposeFn(12,scope.row)"><Icon name="el-icon-EditPen" class="menu_icon" />{{t('card.cards.edit_single_stroke_quota')}}</el-dropdown-item>
                            <!-- <el-dropdown-item v-if="scope.row.card_status != 'cancelled'" @click="disposeFn(6,scope.row)"><Icon name="el-icon-DocumentDelete" class="menu_icon" />销卡</el-dropdown-item> -->
                            <el-popconfirm
                                width="220"
                                icon-color="#626AEF"
                                :title="t('card.cards.Cancel_a_card_tips')"
                                @confirm="() => handleConfirm(6)"
                                @cancel="handleCancel"
                                v-if="scope.row.card_status != 'cancelled'"
                            >
                                <template #reference>
                                <div class="el-dropdown-menu__item" @click="setCurrentRow(scope.row)">
                                    <Icon name="el-icon-DocumentDelete" class="menu_icon" />
                                    <span>{{ t('card.cards.Cancel_a_card') }}</span>
                                </div>
                                </template>
                            </el-popconfirm>
                            <!-- <el-dropdown-item @click="disposeFn(3,scope.row)"><Icon name="el-icon-PieChart" class="menu_icon" />设置限额</el-dropdown-item> -->
                            </el-dropdown-menu>
                        </template>
                        </el-dropdown>
                        <el-button v-if="scope.row.card_status !== 'cancelled' && scope.row.card_status !== 'canceling'"  type='primary' text='primary' @click="disposeFn(1,scope.row)">{{t('card.cards.details')}}</el-button>
                        <el-button v-if="scope.row.card_status !== 'cancelled' && scope.row.card_status !== 'canceling'"  type='primary' text='primary' @click="disposeFn(2,scope.row)">{{ t('card.cards.note')}}</el-button>

                        <!-- <div @mouseover="showMenu(scope.$index)" @mouseleave="hideMenu" >
                            <div class="menu-button" >
                                <Icon name="el-icon-MoreFilled" style="font-size: 14px;" color="#adadad" />
                            </div>

                            <div v-if="menuVisible==scope.$index" :class="['menu', { 'menu-up': showAbove }]">
                                <ul>
                                <li @click="disposeFn(1,scope.row)"> <Icon name="el-icon-Tickets" class="menu_icon"/>详情</li>
                                <li @click="disposeFn(2,scope.row)"> <Icon name="el-icon-EditPen" class="menu_icon"/>编辑昵称</li>
                                <li><Icon name="el-icon-DeleteFilled" class="menu_icon"/>销卡</li>
                                <li v-if="scope.row.card_status == 'normal'" @click="disposeFn(4,scope.row)"> <Icon name="el-icon-Lock" class="menu_icon" />冻结</li>
                                <li v-if="scope.row.card_status == 'frozen'" @click="disposeFn(5,scope.row)"> <Icon name="el-icon-Unlock" class="menu_icon" />解冻</li>
                                <li @click="disposeFn(3,scope.row)"> <Icon name="el-icon-PieChart" class="menu_icon" />设置限额</li>
                                </ul>
                            </div>
                            </div> -->
                        <!-- <div><span :style="getColumnStyle(scope.$index)" @click="copyText(scope.row.account_id,scope.$index)" > {{ scope.row.account_id }}</span></div> -->
                        <!-- color:#409eff;background-color:#ecf5ff;border-radius:2px;padding: 5px 8px; -->
                    </template>
                </el-table-column>
                <!-- 在插槽内，您可以随意发挥，通常使用 el-table-column 组件 -->
            </template>
        </Table>
        <!-- 表单 -->
        <PopupForm />
        <div class="addPurchasingManagement-dialog">
            <el-dialog :title="t('card.cards.details')" :z-index="1000" v-model="card.show" @close="DialogCloseFn(1)" center destroy-on-close draggable>
                <div class="dialog-body">
                    <div style="padding:10px;margin-bottom: 20px;font-size: 18px;">
                    <span>{{t('card.cards.Card_balance')}}:</span><span style="font-weight: bold">&nbsp;&nbsp;${{ card.info.info_amount }}</span>
                    </div>
                    <!-- table列表 -->
                    <el-form :model="card.info" label-position="top">
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item :label="t('card.cards.Card_number')" style="width: 200px;">
                                    <div style="display: flex; align-items: center;">
                                        <el-input v-model="card.info.cardNumber" input-style="text-align: center;" disabled />
                                        <Icon name="el-icon-CopyDocument" style="font-size: 16px; margin-left: 4px;cursor: pointer;" color="#000" @click="copyText(card.info.cardNumber)" />
                                    </div>
                                    </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="Expires" style="width: 200px;">
                                    <div style="display: flex; align-items: center;">
                                        <el-input v-model="card.info.expires" input-style="text-align: center;" disabled />
                                        <Icon name="el-icon-CopyDocument" style="font-size: 16px; margin-left: 4px;cursor: pointer;" color="#000" @click="copyText(card.info.expires)" />
                                    </div>
                                    </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item :label="t('card.cards.CVV_code')" style="width: 200px;">
                                    <div style="display: flex; align-items: center;">
                                        <el-input v-model="card.info.cvv" input-style="text-align: center;" disabled />
                                        <Icon name="el-icon-CopyDocument" style="font-size: 16px; margin-left: 4px;cursor: pointer;" color="#000" @click="copyText(card.info.cvv)" />
                                    </div>
                                    </el-form-item>
                            </el-col>
                            </el-row>
                            <el-divider />
                            <div style="display: flex; align-items: center;margin-bottom: 10px;">
                                <el-button style="margin-left: 12px;"  class="table-header-operate" :loading="loading" type="primary" plain :title="t('card.cards.export_tips')"  @click="excelFn">
                                <span class="table-header-operate-text">{{ t('card.cards.export') }}</span>
                                </el-button>
                            </div>
                            <el-row>
                                <el-table :data="card.transactions" height="300" style="width: 100%;max-height: 300px;overflow-y: auto;">
                                    <el-table-column prop="created_at" :label="t('card.cards.Trading_hours')" />
                                    <el-table-column prop="txn_principal_change_amount" :label="t('card.cards.Transaction_amount')" />
                                    <el-table-column prop="merchant_name_location" :label="t('card.cards.Merchant_name')" />
                                    <el-table-column prop="transaction_type" :label="t('card.cards.Transaction_type')">
                                        <template #default="scope">
                                            <span>{{ getTransactionTypeLabel(scope.row.transaction_type) }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="status" :label="t('card.cards.Transaction_status')">
                                        <template #default="scope">
                                            <span>{{ scope.row.status === 'succeed' || scope.row.status === 'authorized' ? t('card.cards.succeed') : t('card.cards.failed') }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="system_transaction_id" :label="t('card.cards.Transaction_number')" />
                                </el-table>
                            </el-row>
                        </el-form>
                </div>

                <!-- <template #footer>
                    <div class="dialog-footer">
                        <el-button type="primary" @click="disposeFn(1)" >{{ t('card.cards.verify') }}</el-button>
                        <el-button @click="DialogCloseFn">{{ t('card.cards.Cancel') }}</el-button>
                    </div>
                </template> -->
            </el-dialog>
        </div>
        <div class="addPurchasingManagement-dialog">
            <el-dialog :title="t('card.cards.note')" style="width: 600px;" :z-index="1000" v-model="card.show1" @close="DialogCloseFn(2)" center destroy-on-close draggable>
                <div class="dialog-body">
                    <div class="tableList">
                        <el-input v-model="card.nickname" style="width: 240px" placeholder="Please nickname" />
                    </div>
                </div>

                <template #footer>
                    <div>
                        <el-button type="success" @click="confirmFn(1)" >{{ t('card.cards.verify') }} </el-button>
                        <el-button @click="DialogCloseFn" style="right: 20px;position: absolute;">{{ t('card.cards.Cancel') }}</el-button>
                    </div>
                </template>
            </el-dialog>
        </div>
        <div class="addPurchasingManagement-dialog">
            <el-dialog :title="t('card.cards.Deduct_money')" style="width: 600px;" :z-index="1000" v-model="card.show11" @close="DialogCloseFn(11)" center destroy-on-close draggable>
                <div class="dialog-body">
                    <div class="tableList">
                        <el-input-number v-model="card.return_amount" style="width: 240px" min="0" placeholder="Please return_amount" />
                    </div>
                </div>

                <template #footer>
                    <div>
                        <el-button type="success" @click="confirmFn(11)" >{{ t('card.cards.verify') }}</el-button>
                        <el-button @click="DialogCloseFn" style="right: 20px;position: absolute;">{{ t('card.cards.Cancel') }}</el-button>
                    </div>
                </template>
            </el-dialog>
        </div>
        <div class="addPurchasingManagement-dialog">
            <el-dialog :title="t('card.cards.edit_quota')" style="width: 600px;" :z-index="1000" v-model="card.show12" @close="DialogCloseFn(12)" center destroy-on-close draggable>
                <div class="dialog-body">
                    <div class="tableList">
                        <el-input-number v-model="card.max_on_percent" style="width: 240px" min="0"  placeholder="Please max_on_percent" />
                    </div>
                </div>

                <template #footer>
                    <div>
                        <el-button type="success" @click="confirmFn(12)" >{{ t('card.cards.verify') }}</el-button>
                        <el-button @click="DialogCloseFn" style="right: 20px;position: absolute;">{{ t('card.cards.Cancel') }}</el-button>
                    </div>
                </template>
            </el-dialog>
        </div>
        <div class="addPurchasingManagement-dialog">
            <el-dialog :title="t('card.cards.quota')" style="width: 518px;padding: 22px 27px;" :z-index="1000" v-model="card.show2" @close="DialogCloseFn(2)" center >
                <div class="dialog-body limitType">
                    <el-form :model="card.quota" label-width="160px" label-position="top">
                        <el-form-item :label="t('card.cards.single_stroke_Maximum_amount')" class="custom-form-item">
                        <el-input v-model="card.quota.singleLimit" :placeholder="t('card.cards.Maximum_amount') + ': 00,000'">
                            <template #append style="background-color: #dfdeea;" >USD</template>
                        </el-input>
                        </el-form-item>

                        <el-form-item :label="t('card.cards.Day_trading_quota')" class="custom-form-item">
                        <el-input v-model="card.quota.dailyLimit" :placeholder="t('card.cards.Maximum_amount') + ': 00,000'">
                            <template #append>USD</template>
                        </el-input>
                        </el-form-item>

                        <el-form-item :label="t('card.cards.Monthly_Transaction_quota')" class="custom-form-item">
                        <el-input v-model="card.quota.monthlyLimit" :placeholder="t('card.cards.Maximum_amount') + ': 00,000'">
                            <template #append>USD</template>
                        </el-input>
                        </el-form-item>

                        <!-- <el-form-item label="交易限额" class="custom-form-item">
                        <el-input v-model="card.quota.transactionLimit" placeholder="剩余额度" disabled>
                            <template #append>USD</template>
                        </el-input>
                        </el-form-item> -->

                        <el-form-item class="custom-form-item" style="margin-bottom: 0;">
                        <div class="form-item-content">
                            <span class="left-text">{{ t('card.cards.Trading_quota') }}</span>
                            <span style="padding: 0 5px;" v-if="card.quota.limitType != 'unlimited'" class="right-text">{{ t('card.cards.Remaining_amount') }}: {{card.quota.transactionLimit}}</span>
                            <span v-if="card.quota.limitType != 'unlimited'" class="right-text">{{ t('card.cards.total_quota') }}: {{card.quota.totalTransactionLimit}}</span>
                        </div>
                        </el-form-item>

                        <el-form-item  class="custom-form-item">
                        <div style="display: flex; align-items: center;width:460px;">
                            <el-select v-model="card.quota.limitType" v-value="card.quota.limitType" :placeholder="t('card.cards.Please_select')" class="custom-select1" style="width: 150px;">
                                <el-option :label="t('card.cards.restrict')" value="limited"></el-option>
                                <el-option :label="t('card.cards.not_restrict')" value="unlimited"></el-option>
                                <el-option :label="t('card.cards.cover')" value="cover"></el-option>
                            </el-select>

                            <el-select v-if="card.quota.limitType != 'unlimited'" v-model="card.quota.operationType" :placeholder="t('card.cards.Please_select')" class="custom-select" style="margin-left: 25px;width: 80px;">
                                <el-option :label="t('card.cards.augment')" value="increase"></el-option>
                                <el-option :label="t('card.cards.restrict')" value="decrease"></el-option>
                            </el-select>

                            <el-input v-if="card.quota.limitType != 'unlimited'" v-model="card.quota.amount" placeholder="0" class="custom-select2" style="width: 230px;" />
                        </div>
                        </el-form-item>
                    </el-form>
                    </div>

                <template #footer>
                    <div class="footer-buttons">
                        <el-button :disabled="card.isClickedShow2" type="success" @click="confirmFn(2)" style="padding: 19px;background-color: #ffb400;border:0;">{{ t('card.cards.verify') }}</el-button>
                        <el-button @click="DialogCloseFn" style="color: #80108d;font-weight: bold;padding: 19px;background-color: #f5f7fa;border:0;">{{ t('card.cards.Cancel') }}</el-button>
                    </div>
                </template>
            </el-dialog>
        </div>
        <div class="addPurchasingManagement-dialog">
            <el-dialog  :title="t('card.cards.batch_search')" style="width: 600px;" :z-index="1000"  v-model="card.show10" @close="DialogCloseFn(10)" center>
                <div class="dialog-body">
                    <el-tabs v-model="activeName"  class="demo-tabs">
                        <el-tab-pane :label="t('card.cards.Card_number')" name="cards">

                            <el-input
                                v-model="card.cards_ids"
                                style="width: 560px"
                                :autosize="{ minRows: 20, maxRows: 25 }"
                                type="textarea"
                                placeholder="Please input"
                            />
                        </el-tab-pane>
                        <el-tab-pane :label="t('card.cards.nickname')" name="nickname">

                        <el-input
                            v-model="card.nickname_ids"
                            style="width: 560px"
                            :autosize="{ minRows: 20, maxRows: 25 }"
                            type="textarea"
                            placeholder="Please input"
                        />
                    </el-tab-pane>
                    </el-tabs>
                </div>
                <template #footer>
                    <div>
                        <el-button type="success" @click="confirmFn(10)" >{{ t('card.cards.search') }}</el-button>
                    </div>
                </template>
            </el-dialog>
        </div>
    </div>


    <div class="addPurchasingManagement-dialog">
        <el-dialog :title="t('card.cards.details')" :z-index="1000" v-model="card.showError" center destroy-on-close draggable>
            <div class="dialog-body">
              <el-table :data="card.error" style="width: 100%;max-height: 500px;overflow-y: auto;">
                <el-table-column prop="card_no" :label="t('card.cards.Card_number')" />
                <el-table-column prop="msg" :label="t('card.cards.Error_details')" />
              </el-table>
            </div>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="DialogCloseFn">{{ t('card.cards.Cancel') }}</el-button>
                </div>
            </template>
        </el-dialog>
    </div>


    <div class="addPurchasingManagement-dialog">
      <el-dialog :title="t('card.cards.top_up')" style="width: 600px;" :z-index="1000" v-model="card.show7" @close="DialogCloseFn(2)" center destroy-on-close draggable>
          <div class="dialog-body">
              <div class="tableList">
                  <el-input-number v-model="card.arrivalAmount" min="1"></el-input-number>
                  <!-- <el-input v-model="card.arrivalAmount" style="width: 240px" placeholder="Please arrivalAmount" /> -->
              </div>
          </div>

          <template #footer>
              <div>
                  <el-button type="success" @click="confirmFn(6)" >{{ t('card.cards.verify') }}</el-button>
                  <el-button @click="DialogCloseFn" style="right: 20px;position: absolute;">{{ t('card.cards.Cancel') }}</el-button>
              </div>
          </template>
      </el-dialog>
  </div>

    <div class="addPurchasingManagement-dialog">
      <el-dialog :title="t('card.cards.batch_quota')" style="width: 518px;padding: 22px 27px;" :z-index="1000" v-model="card.showLimit" center >
          <div class="dialog-body limitType">
              <el-form :model="card.quota" label-width="160px" label-position="top">
                <el-form-item :label="t('card.cards.single_stroke_Maximum_amount')" class="custom-form-item">
                  <el-input v-model="card.quota.singleLimit" :placeholder="t('card.cards.Maximum_amount') + ': 00,000'">
                    <template #append style="background-color: #dfdeea;" >USD</template>
                  </el-input>
                </el-form-item>

                <el-form-item :label="t('card.cards.Day_trading_quota')" class="custom-form-item">
                  <el-input v-model="card.quota.dailyLimit" :placeholder="t('card.cards.Maximum_amount') + ': 00,000'">
                    <template #append>USD</template>
                  </el-input>
                </el-form-item>

                <el-form-item :label="t('card.cards.Monthly_Transaction_quota')" class="custom-form-item">
                  <el-input v-model="card.quota.monthlyLimit" :placeholder="t('card.cards.Maximum_amount') + ': 00,000'">
                    <template #append>USD</template>
                  </el-input>
                </el-form-item>

                <!-- <el-form-item label="交易限额" class="custom-form-item">
                  <el-input v-model="card.quota.transactionLimit" placeholder="剩余额度" disabled>
                    <template #append>USD</template>
                  </el-input>
                </el-form-item> -->

                <el-form-item class="custom-form-item" style="margin-bottom: 0;">
                  <div class="form-item-content">
                    <span class="left-text">{{t('card.cards.Trading_quota')}}</span>
                    <span v-if="card.quota.limitType == 'limited'" class="right-text">{{ t('card.cards.Remaining_amount') }}: {{card.quota.transactionLimit}}</span>
                  </div>
                </el-form-item>

                <el-form-item  class="custom-form-item">
                  <div style="display: flex; align-items: center;width:460px;">
                      <el-select v-model="card.quota.limitType" v-value="card.quota.limitType" :placeholder="t('card.cards.Please_select')" class="custom-select1" style="width: 150px;">
                          <el-option :label="t('card.cards.restrict')" value="limited"></el-option>
                          <el-option :label="t('card.cards.not_restrict')" value="unlimited"></el-option>
                          <el-option :label="t('card.cards.cover')" value="cover"></el-option>
                      </el-select>

                      <el-select v-if="card.quota.limitType != 'unlimited'" v-model="card.quota.operationType" :placeholder="t('card.cards.Please_select')" class="custom-select" style="margin-left: 25px;width: 80px;">
                          <el-option :label="t('card.cards.augment')" value="increase"></el-option>
                          <el-option :label="t('card.cards.decrease')" value="decrease"></el-option>
                      </el-select>

                      <el-input v-if="card.quota.limitType != 'unlimited'" v-model="card.quota.amount" placeholder="0" class="custom-select2" style="width: 230px;" />
                  </div>
                </el-form-item>
              </el-form>
            </div>

          <template #footer>
              <div class="footer-buttons">
                  <el-button :disabled="card.isClickedShowLimit"  type="success" @click="batchConfirmFn(3)" style="padding: 19px;background-color: #ffb400;border:0;">{{ t('card.cards.verify') }}</el-button>
                  <el-button @click="DialogCloseFn" style="color: #80108d;font-weight: bold;padding: 19px;background-color: #f5f7fa;border:0;">{{ t('card.cards.Cancel') }}</el-button>
              </div>
          </template>
      </el-dialog>
  </div>

  </PageContainer>
</template>

<script setup lang="ts">
import { ref, provide, nextTick, reactive, onMounted } from 'vue'
import baTableClass from '/@/utils/baTable'
import PopupForm from './popupForm.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index.vue'
import headerContent from '/@/components/headerContent/index.vue'
import CenteredContent from '/@/components/CenteredContent/index.vue'
import { defaultOptButtons } from '/@/components/table'
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
    adminCardCardsTransactionsExcel
} from '/@/api/backend/index.ts';
import { tips } from '/@/utils/common';
import { ElLoading } from 'element-plus'
import PageContainer from '/@/components/PageContainer/index.vue'
import { getUrl } from '/@/utils/axios'
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
            { label: t('card.cards.cardInfo__nickname'), prop: 'nickname', align: 'center', operator: 'LIKE',render: 'customTemplate',
                customTemplate: (row: TableRow, field: TableColumn, value: any, column, index: number) => {
                    if(!value){
                        return '...';
                    }else{
                        return value;
                    }
                }
            },
            // { label: t('Id'), prop: 'id', align: 'center', operator: '=', operatorPlaceholder: t('Id'), width: 70 },
            { label: t('card.cards.card_scheme'), prop: 'card_scheme', align: 'center', operator: false,slotName: 'card_scheme', render: 'slot' },
            { label: t('card.cards.mask_card_no'), prop: 'mask_card_no', align: 'center', operator: 'LIKE' },
            { label: t('card.cards.amount'), prop: 'cardInfo.amount', align: 'center', operator: false },
            { label: t('card.cards.card_status'), prop: 'card_status', align: 'center', operator: false ,render: 'customTemplate',
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
            // { label: '卡余额', prop: 'card_balance', align: 'center', operator: false },
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

interface quota{
  singleLimit: string,
  dailyLimit: string,
  monthlyLimit: string,
  transactionLimit: string,
  totalTransactionLimit: string,
  limitType: string,
  operationType: string,
  amount: string,
}

interface info{
  cardNumber:string,
  expires:string,
  cvv:string,
  firstName:string,
  lastName:string,
  address:string,
  city:string,
  state:string,
  zipCode:string,
  cardBalance:string,
  info_amount: string
}

interface card {
  id:number
  show:boolean
  show1:boolean
  show2:boolean
  show7:boolean
  show10:boolean
  show11: boolean
  show12: boolean
  showError:boolean
  showLimit:boolean
  isClickedShow2:boolean
  isClickedShowLimit:boolean
  info:info
  transactions:Array<any>
  nickname:string
  return_amount:number
  max_on_percent: number
  quota:quota
  cards_ids:string
  nickname_ids:string
  error:Array<any>
  is_d:boolean
  arrivalAmount:string
}

const card: card = reactive({
    id:1,
    show:false,
    show1:false,
    show2:false,
    show7:false,
    show10:false,
    show11: false,
    show12: false,
    showError:false,
    showLimit:false,
    isClickedShow2:false,
    isClickedShowLimit:false,
    cards_ids:'',
    nickname_ids:'',
    info:{
        orderNumber: '',
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
    transactions:[],
    nickname:'',
    return_amount: 0,
    max_on_percent: 0,
    quota:{
        singleLimit: '',
        dailyLimit: '',
        monthlyLimit: '',
        transactionLimit: '0',
        totalTransactionLimit:'0',
        limitType: 'unlimited',
        operationType: 'increase',
        amount: '',
    },
    error:[],
    is_d:true,
    arrivalAmount:1
})
const selectType = ref<number>(0)

const disposeFn = (type:number,row) => {
    selectType.value = type
    if(type == 1){
        infoFn(row.card_id)
        cardsTransactionsFn(row.card_id)
        card.show = true
    }else if(type == 2){
        card.id = row.card_id
        card.show1 = true
        card.nickname = row.nickname
    }else if(type ==3){
        card.id = row.card_id
        card.show2 = true
        infoFn(row.card_id)
    }else if(type ==4){
        card.id = row.card_id
        confirmFn(3)
    }else if(type ==5){
        card.id = row.card_id
        confirmFn(4)
    }else if(type ==6){
        card.id = row.card_id
        confirmFn(5)
    }else if(type ==7){
        card.id = row.card_id
        card.show7 = true
    } else if (type == 11) {
        card.id = row.card_id
        card.show11 = true
    } else if (type == 12) {
        const { max_on_percent } = row?.cardInfo
        card.id = row.card_id
        card.max_on_percent = max_on_percent
        card.show12 = true
    }else if(type ==8){
        if(baTable.table.selection!.length > 50){
            tips('一次只能操作50条数据！')
            return
        }
        card.showLimit = true
        card.quota = {
            singleLimit: '',
            dailyLimit: '',
            monthlyLimit: '',
            transactionLimit: '0',
            totalTransactionLimit:'0',
            limitType: 'unlimited',
            operationType: 'increase',
            amount: '',
        }
    }else if(type ==10){
        card.id = row.card_id
        card.show10 = true
    }
}


const infoFn =  async(id:number)=>{
    let postData = {
        'id':id
    }
    let res: anyObj = await cardInfoApi(postData)
    let result = res.data.row

    card.info = {
        cardNumber:result.cardNo,
        expires:result.expirationDate,
        cvv:result.cvv,
        firstName:result.firstName,
        lastName:result.lastName,
        address:result.billingAddress,
        city:result.billingCity,
        state:result.billingState,
        zipCode:result.billingPostalCode,
        cardBalance:result.cardBalance,
        info_amount: result.info_amount
    }

    // card.quota = {
    //     singleLimit: result.max_on_percent,
    //     dailyLimit:result.max_on_daily,
    //     monthlyLimit:result.max_on_monthly,
    //     transactionLimit:result.available_transaction_limit,
    //     totalTransactionLimit:result.total_transaction_limit,
    //     limitType:result.transaction_limit_type,
    //     operationType:'increase',
    //     amount:'',
    // }
}

const cardsTransactionsFn =  async(id:number)=>{
    let postData = {
        'id':id
    }
    let res: anyObj = await cardsTransactionsApi(postData)
    card.transactions = res.data.row
}


const confirmFn =  async(type:number)=>{
    if(type == 1){
        let postData = {
            'id':card.id,
            'nickname':card.nickname
        }
        console.log(postData)
        let res: anyObj = await updateCardApi(postData)
        tips('昵称修改成功', 'success')
        card.show1 = false
    }else if(type == 2){
        card.isClickedShow2 = true;
        card.show2 = false
        let postData = {
            'ids':[card.id],
            'max_on_daily':card.quota.dailyLimit,
            'max_on_monthly':card.quota.monthlyLimit,
            'max_on_percent':card.quota.singleLimit,
            'available_transaction_limit':card.quota.transactionLimit,
            'transaction_limit_type':card.quota.limitType,
            'transaction_limit_change_type':'',
            'transaction_limit':'',
        }
        if(card.quota.limitType != 'unlimited'){
            postData['transaction_limit_change_type'] = card.quota.operationType
            postData['transaction_limit'] = card.quota.amount
        }
        console.log(postData)
        let res: anyObj = await cardUpdate(postData)
        if(Array.isArray(res.data.error) && res.data.error.length > 0){
            card.error = res.data.error
            card.showError = true
        }else{
            card.is_d = true
            tips('限额修改成功', 'success')
            baTable.onTableHeaderAction('refresh',[])
        }
        setTimeout(() => {
            card.isClickedShow2 = false
        }, 3000);
    }else if(type ==  3){
        let postData = {
            'id':card.id,
            'status':'freeze'
        }
        console.log(postData)
        let res: anyObj = await cardFreezeApi(postData)
        tips('冻结成功', 'success')
        card.show1 = false

    }else if(type ==  4){
        let postData = {
            'id':card.id,
            'status':'unfreeze'
        }
        console.log(postData)
        let res: anyObj = await cardFreezeApi(postData)
        tips('解冻成功', 'success')
        card.show1 = false
    }else if(type ==  5){
        let postData = {
            'id':card.id,
        }
        console.log(postData)
        let res: anyObj = await cancelCardApi(postData)
        tips('销卡成功', 'success')
        card.show1 = false
    }else if(type ==  6){
        let postData = {
            'id':card.id,
            'arrival_amount':card.arrivalAmount
        }
        console.log(postData)
        let res: anyObj = await rechargeApi(postData)
        tips('充值成功', 'success')
        card.show7 = false
    }else if(type ==  10){
        let cards_ids = card.cards_ids
            .split('\n') // 按换行符分割
            .map(item => item.trim()) // 去掉每行的首尾空白字符
            .filter(line => line)
            .join(','); // 去掉空行


        let nickname_ids = card.nickname_ids
            .split('\n') // 按换行符分割
            .map(item => item.trim()) // 去掉每行的首尾空白字符
            .filter(line => line)
            .join(','); // 去掉空行

        if(card.cards_ids){
          baTable.table.filter!.search?.push({
              field: 'cardInfo.card_no',
              val: cards_ids,
              operator: 'IN',
          })
        }
        if(card.nickname_ids){
          baTable.table.filter!.search?.push({
              field: 'cardInfo.nickname',
              val: nickname_ids,
              operator: 'IN',
          })
        }
        baTable.onTableHeaderAction('quick-search',[])
        card.cards_ids = ''
        card.nickname_ids = ''
        card.show10 = false
    } else if (type == 11 || type == 12) {
        deductMoney()
    }
}


const batchConfirmFn = async(type:number) =>{
    let ids = baTable.getSelectionIds()
    if(type == 1){
        card.is_d = false
        //冻卡
        let postData = {
            'ids':ids,
            'status':'freeze'
        }
        console.log(postData)
        let res: anyObj = await cardFreeze(postData)
        if(Array.isArray(res.data.error) && res.data.error.length > 0){
            card.error = res.data.error
            card.showError = true
        }
        card.is_d = true
        tips('冻结成功', 'success')
        console.log('freeze:',res)

    }else if(type == 2){
        //解冻
        card.is_d = false
        let postData = {
            'ids':ids,
            'status':'unfreeze'
        }
        console.log(postData)
        let res: anyObj = await cardFreeze(postData)
        if(Array.isArray(res.data.error) && res.data.error.length > 0){
            card.error = res.data.error
            card.showError = true
        }
        card.is_d = true
        tips('解冻成功', 'success')
        console.log('unfreeze:',res)

    }else if(type == 3){
        //调整金额
        card.isClickedShowLimit = true
        card.is_d = false
        card.showLimit = false
        let postData = {
            'ids':ids,
            'max_on_daily':card.quota.dailyLimit,
            'max_on_monthly':card.quota.monthlyLimit,
            'max_on_percent':card.quota.singleLimit,
            'available_transaction_limit':card.quota.transactionLimit,
            'transaction_limit_type':card.quota.limitType,
            'transaction_limit_change_type':'',
            'transaction_limit':'',
        }
        if(card.quota.limitType != 'unlimited'){
            postData['transaction_limit_change_type'] = card.quota.operationType
            postData['transaction_limit'] = card.quota.amount
        }
        console.log(postData)
        let res: anyObj = await cardUpdate(postData)
        card.is_d = true
        tips('限额修改成功', 'success')
        setTimeout(() => {
            card.isClickedShowLimit = false
        }, 3000);
        console.log('limited:',res)
    }
    // baTable.onTableHeaderAction('refresh',[])
}

const DialogCloseFn = (type:number = 1) => {
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

const menuVisible = ref(-1)

const showAbove = ref(false)

const showMenu = (index:number) =>{
    // menuVisible.value = index
    // if(index > (baTable.table.filter.limit - 5)){
    //     showAbove.value = true
    // }else{
    //     showAbove.value = false
    // }
}
const hideMenu = () =>{
    menuVisible.value = -1

}

const copyText = async (text:string) => {
    try {
        await navigator.clipboard.writeText(text);
        tips('复制成功', 'success')
    } catch (err) {
        tips('复制异常', 'error')
    }
};
const deductMoney = async() => {
    const params1 = {
        "id": card.id,
        "return_amount":card.return_amount
    }
    const params2 = {
        "id": card.id,
        "max_on_percent":card.max_on_percent
    }
    const params = selectType.value === 11 ? params1 : params2
    const api = selectType.value === 11 ? postAdminCardCardsRechargeReturn : postAdminCardCardsUpdateCard
    await api(params)
    const title = selectType.value === 11 ? '扣款成功' : '修改限额成功'
    tips(title, 'success')
    if(selectType.value === 11){
        card.show11 = false
    } else {
        card.show12 = false
    }
}



baTable.table.showComSearch = true

const currentRow = ref(null)

const setCurrentRow = (row) => {
    console.log('row', row)
    currentRow.value = row
}

const handleConfirm = async (type:number) => {
    let postData = {
        'id':currentRow.value.card_id,
    }
    console.log(postData)
    await cancelCardApi(postData)
    tips('销卡成功', 'success')
    confirmFn(10)
}

const handleCancel = () => {
    // 处理取消操作
    console.log('Cancelled');
};
const transactionTypeMap: Record<string, string> = {
    'auth': t('card.cards.auth'),
    'corrective_auth': t('card.cards.corrective_auth'),
    'verification': t('card.cards.verification'),
    'void': t('card.cards.void'),
    'refund': t('card.cards.refund'),
    'corrective_refund': t('card.cards.corrective_refund'),
    'recharge': t('card.cards.recharge'),
    'recharge_return': t('card.cards.recharge_return'),
    'discard_recharge_return': t('card.cards.discard_recharge_return'),
    'service_fee': t('card.cards.service_fee'),
    'refund_reversal': t('card.cards.refund_reversal'),
    'fund_in': t('card.cards.fund_in')
}
const getTransactionTypeLabel = (type: string) => {
    return transactionTypeMap[type] || type
}
const loading = ref(false)
const excelFn = async () => {
    loading.value = true;
    try {
        let params = {
            card_no: card.info.cardNumber
        }
        console.log(params)
        let res: anyObj =await adminCardCardsTransactionsExcel(params)
        let path = res.data.path
        downloadFile(path)
    } catch (error) {
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

.operate{
el-button{
  border: 0px;
}
}

.el-table .el-table__cell {
  //border: 1px solid red;
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



/***** 限额 *********/


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

  //width: 182px;
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


    ::v-deep .limitType{
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
</style>

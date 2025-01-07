<template>
    <div class="nav-menus" :class="configStore.layout.layoutMode" style="padding: 0 10px;">
        <el-dropdown
            @visible-change="onCurrentNavMenu($event, 'lang')"
            class="lang-dropdown"
            size="large"
            :hide-timeout="50"
            placement="bottom"
            trigger="click"
            :hide-on-click="true"
        >
            <div
                class="nav-menu-item"
                :class="state.currentNavMenu == 'lang' ? 'hover' : ''"
            >
                <span class="lang-item">
                    <img
                        :src="getFlagImage(getCurrentLangFlag())"
                        :alt="getCurrentLangLabel()"
                        class="flag-icon"
                    />
                    <span class="lang-text">{{ getCurrentLangLabel() }}</span>
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
            </div>
            <template #dropdown>
                <el-dropdown-menu class="dropdown-menu-box">
                    <el-dropdown-item
                        v-for="item in configStore.lang.langArray"
                        :key="item.name"
                        @click="editDefaultLang(item.name)"
                        :class="{ 'is-active': isCurrentLang(item.name) }"
                    >
                        <span class="lang-item">
                            <img
                                :src="getFlagImage(getLangFlag(item.name))"
                                :alt="item.value"
                                class="flag-icon-dropdown"
                                style="margin-right: 10px;"
                            />
                            <span class="lang-text">{{ item.value }}</span>
                        </span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
        <el-popover
            v-if="siteConfig.userInitialize"
            @show="onCurrentNavMenu(true, 'adminInfo')"
            @hide="onCurrentNavMenu(false, 'adminInfo')"
            placement="bottom-end"
            :hide-after="0"
            :width="260"
            trigger="click"
            popper-class="admin-info-box"
            v-model:visible="state.showAdminInfoPopover"
        >
            <template #reference>
                <div class="admin-info" style="margin: 0 15px 0 0px;" :class="state.currentNavMenu == 'adminInfo' ? 'hover' : ''">
                    <!-- <Icon size="22" name="el-icon-User"></Icon> -->
                    <img class="user-img" src="~assets/user.svg"/>
                    <!-- <div class="admin-name">{{ adminInfo.nickname }}</div> -->
                </div>
            </template>
            <div>
                <div class="admin-info-base">
                    <div class="admin-info-other">
                        <div class="admin-info-name">{{ adminInfo.nickname }}</div>
                        <div class="admin-info-lasttime">{{ adminInfo.last_login_time }}</div>
                    </div>
                </div>
                <div class="admin-info-footer">
                    <el-button @click="onLogout" type="danger" plain>{{ t('layouts.cancellation') }}</el-button>
                </div>
            </div>
        </el-popover>
        <Config />
        <TerminalVue />
    </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { editDefaultLang } from '/@/lang'
import { useConfig } from '/@/stores/config'
import { useI18n } from 'vue-i18n'
import Config from './config.vue'
import { useAdminInfo } from '/@/stores/adminInfo'
import { Local } from '/@/utils/storage'
import { ADMIN_INFO } from '/@/stores/constant/cacheKey'
import router from '/@/router'
import { logout } from '/@/api/backend/index'
import TerminalVue from '/@/components/terminal/index.vue'
import { useSiteConfig } from '/@/stores/siteConfig'
import cnFlag from '/@/assets/cn.svg'
import usFlag from '/@/assets/us.svg'

const flagImages = {
    cn: cnFlag,
    us: usFlag
}

const { t } = useI18n()

const adminInfo = useAdminInfo()
const configStore = useConfig()
const siteConfig = useSiteConfig()

const state = reactive({
    isFullScreen: false,
    currentNavMenu: '',
    showLayoutDrawer: false,
    showAdminInfoPopover: false,
})

const onCurrentNavMenu = (status: boolean, name: string) => {
    state.currentNavMenu = status ? name : ''
}

const onLogout = () => {
    logout().then(() => {
        Local.remove(ADMIN_INFO)
        router.go(0);
    })
}

const getLangFlag = (lang: string) => {
    const flagMap: Record<string, string> = {
        'zh-cn': 'cn',
        'en': 'us'
    }
    return flagMap[lang] || 'cn'
}

const getFlagImage = (flag: string) => {
    return flagImages[flag as keyof typeof flagImages]
}

const getCurrentLangFlag = () => {
    return getLangFlag(configStore.lang.defaultLang)
}

const getCurrentLangLabel = () => {
    const currentLang = configStore.lang.defaultLang
    const langItem = configStore.lang.langArray.find(item => item.name === currentLang)
    return langItem ? langItem.value : ''
}

// 判断是否是当前选中的语言
const isCurrentLang = (langName: string) => {
    return configStore.lang.defaultLang === langName
}
</script>

<style scoped lang="scss">
.flag-icon-dropdown {
    width: 16px;
    height: 12px;
    object-fit: contain;
    border-radius: 2px;
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.2);
    flex-shrink: 0;
}
.nav-menus.Default {
    border-radius: var(--el-border-radius-base);
}
.nav-menus {
    display: flex;
    align-items: center;
    margin-left: auto;
    background-color: v-bind('configStore.getColorVal("headerBarBackground")');
    .nav-menu-item {
        cursor: pointer;
        padding: 0 16px;
        height: 100%;
        display: flex;
        align-items: center;
        transition: background-color 0.2s ease;
        .lang-item {
            display: inline-flex;
            align-items: center;
            height: 32px;
            padding: 4px 0;
        }
        .flag-icon {
            width: 35px;
            height: 20px;
            object-fit: contain;
            border-radius: 2px;
            box-shadow: 0 0 1px rgba(0, 0, 0, 0.2);
            flex-shrink: 0;
            margin-right: 8px;
            vertical-align: middle;
        }
        .lang-text {
            font-size: 15px;
            line-height: 1;
            margin-right: 4px;
            color: var(--el-text-color-primary);
        }
        .el-icon--right {
            margin-left: 4px;
            font-size: 12px;
            color: var(--el-text-color-secondary);
        }
    }
    .admin-info {
        display: flex;
        height: 100%;
        padding: 0 10px;
        align-items: center;
        cursor: pointer;
        user-select: none;
        color: v-bind('configStore.getColorVal("headerBarTabColor")');
        .user-img{
            max-width: 100%; /* 图片最大宽度100% */
            max-height: 100%; /* 图片最大高度100% */
            width: 35px; /* 图片宽度自适应 */
            height: auto; /* 图片高度自适应 */
        }
    }
    .admin-name {
        padding-left: 6px;
        white-space: nowrap;
        font-size: 15px;
    }
    .nav-menu-item:hover,
    .admin-info:hover,
    .nav-menu-item.hover,
    .admin-info.hover {
        background: v-bind('configStore.getColorVal("headerBarHoverBackground")');
    }
}
.admin-info-base {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    padding-top: 10px;
    .admin-info-other {
        display: block;
        width: 100%;
        text-align: center;
        padding: 10px 0;
        .admin-info-name {
            font-size: var(--el-font-size-large);
        }
    }
}
.admin-info-footer {
    padding: 10px 0;
    margin: 0 -12px -12px -12px;
    display: flex;
    justify-content: space-around;
}
.pt2 {
    padding-top: 2px;
}

@keyframes twinkle {
    0% {
        transform: scale(0);
    }
    80% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
    }
}
</style>

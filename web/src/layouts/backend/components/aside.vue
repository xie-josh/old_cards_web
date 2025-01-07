<template>
    <el-aside v-if="!navTabs.state.tabFullScreen" :class="'layout-aside-' + config.layout.layoutMode + ' ' + (config.layout.shrink ? 'shrink' : '')">
        <!-- logo -->
        <Logo v-if="config.layout.menuShowTopBar" />
        <!-- 菜单栏 -->
        <MenuVerticalChildren v-if="config.layout.layoutMode == 'Double'" />
        <MenuVertical v-else />
        <!-- <NavMenus /> -->
    </el-aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Logo from '/@/layouts/backend/components/logo.vue'
import MenuVertical from '/@/layouts/backend/components/menus/menuVertical.vue'
import MenuVerticalChildren from '/@/layouts/backend/components/menus/menuVerticalChildren.vue'
import { useConfig } from '/@/stores/config'
import { useNavTabs } from '/@/stores/navTabs'
// import NavMenus from './navMenus.vue'

defineOptions({
    name: 'layout/aside',
})

const config = useConfig()
const navTabs = useNavTabs()

const menuWidth = computed(() => config.menuWidth())
</script>

<style scoped lang="scss">
.layout-aside-Default {
    background: var(--ba-bg-color-overlay);
    //margin: 16px 0 16px 16px;
    // margin: 0 0 0 12px;
    height: calc(100vh);
    //height: calc(100vh - 32px);
    //box-shadow: var(--el-box-shadow-light);
    // border-radius: var(--el-border-radius-base);
    overflow: hidden;
    transition: width 0.3s ease;
    // width: v-bind(menuWidth);
    // border-right: 1px solid #f3f2f2;
    //border-inline-end: 1px solid rgba(5,5,5,.06);
    // border-inline-end: 2px solid #e5e5e5;
    width: 230px;
    background: #000;
}
.layout-aside-Classic,
.layout-aside-Double {
    background: var(--ba-bg-color-overlay);
    margin: 0;
    height: 100vh;
    overflow: hidden;
    transition: width 0.3s ease;
    width: v-bind(menuWidth);
}
.shrink {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999999;
}
::v-deep .el-menu-item {
    height: 40px;
}
::v-deep .el-menu-item:hover {
    color: #8957ff !important;
    background-color: transparent !important;
}
::v-deep .el-sub-menu.is-active > .el-sub-menu__title,
.el-menu-item.is-active {
  color: #fff !important;
  background-color: #535151 !important;
  border-radius: 7px !important;
}
::v-deep .el-menu-item:not(.is-active):hover,
.el-sub-menu:not(.is-active) > .el-sub-menu__title:hover {
  transition: background-color 0.3s ease;
}
::v-deep .el-menu-item.is-active:hover,
.el-sub-menu.is-active > .el-sub-menu__title:hover {
  transition: none;
}
::v-deep .el-sub-menu .el-menu-item {
  &.is-active {
    color: #8957ff !important;
    background-color: transparent !important;
  }
  &:hover {
    color: #8957ff !important;
    background-color: transparent !important;
  }
}
</style>

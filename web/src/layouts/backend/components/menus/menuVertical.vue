<template>
    <el-scrollbar ref="layoutMenuScrollbarRef" class="vertical-menus-scrollbar">
        <el-menu
            class="layouts-menu-vertical"
            :collapse-transition="false"
            :unique-opened="config.layout.menuUniqueOpened"
            :default-active="state.defaultActive"
            :collapse="config.layout.menuCollapse"
            ref="layoutMenuRef"
        >
            <MenuTree :menus="navTabs.state.tabsViewRoutes" />
        </el-menu>
    </el-scrollbar>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive } from 'vue'
import MenuTree from '/@/layouts/backend/components/menus/menuTree.vue'
import { useRoute, onBeforeRouteUpdate, type RouteLocationNormalizedLoaded } from 'vue-router'
import { layoutMenuRef, layoutMenuScrollbarRef } from '/@/stores/refs'
import { useConfig } from '/@/stores/config'
import { useNavTabs } from '/@/stores/navTabs'

const config = useConfig()
const navTabs = useNavTabs()
const route = useRoute()

const state = reactive({
    defaultActive: '',
})

const verticalMenusScrollbarHeight = computed(() => {
    let menuTopBarHeight = 0
    if (config.layout.menuShowTopBar) {
        menuTopBarHeight = 50
    }
    if (config.layout.layoutMode == 'Default') {
        return 'calc(100vh - ' + (100) + 'px)'
    } else {
        return 'calc(100vh - ' + menuTopBarHeight + 'px)'
    }
})

// 激活当前路由的菜单
const currentRouteActive = (currentRoute: RouteLocationNormalizedLoaded) => {
    state.defaultActive = currentRoute.path
}

// 滚动条滚动到激活菜单所在位置
const verticalMenusScroll = () => {
    nextTick(() => {
        let activeMenu: HTMLElement | null = document.querySelector('.el-menu.layouts-menu-vertical li.is-active')
        if (!activeMenu) return false
        layoutMenuScrollbarRef.value?.setScrollTop(activeMenu.offsetTop)
    })
}

onMounted(() => {
    currentRouteActive(route)
    verticalMenusScroll()
})

onBeforeRouteUpdate((to) => {
    currentRouteActive(to)
})
</script>
<style>
.vertical-menus-scrollbar {
    height: v-bind(verticalMenusScrollbarHeight);
    /* background-color: v-bind('config.getColorVal("menuBackground")'); */
    color: black;
    width: 220px;
}
.layouts-menu-vertical {
    border: 0;
    padding-bottom: 30px;
    /* --el-menu-bg-color: v-bind('config.getColorVal("menuBackground")');
    --el-menu-text-color: v-bind('config.getColorVal("menuColor")');
    --el-menu-active-color: v-bind('config.getColorVal("menuActiveColor")'); */
    background: #000;
    color: #C2B85E;
}
.el-sub-menu__title{
    /* font-weight: bold; */
    border-radius: 7px !important;
    margin: 9px 15px;
    color: 	#DCDCDC;
    font-size: 13px;
}
.el-menu-item{
    border-radius: 7px !important;
    margin: 9px 15px;
    color: #D3D3D3;
    font-size: 13px;
}
.el-menu--inline {
    transform-origin: top;
    transition: transform 10000000000s ease-in-out;
}
</style>

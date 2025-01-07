<template>
    <template v-for="menu in props.menus">
        <template v-if="menu.children && menu.children.length > 0">
            <el-sub-menu @click="onClickSubMenu(menu)" :index="menu.path" :key="menu.path">
                <template #title>
                    <Icon :name="menu.meta?.icon ? menu.meta?.icon : config.layout.menuDefaultIcon" />
                    <!-- <span >{{ menu.meta?.title ? menu.meta?.title : $t('noTitle') }}</span> -->
                    <span>{{ $t(`pagesTitle.${menu.meta?.name}`) }}</span>
                </template>
                <menu-tree :extends="{ ...props.extends, leel: props.extends.level + 1 }" :menus="menu.children"></menu-tree>
            </el-sub-menu>
        </template>
        <template v-else>
            <el-menu-item :index="menu.path" :key="menu.path" @click="onClickMenu(menu)">
                <Icon :name="menu.meta?.icon ? menu.meta?.icon : config.layout.menuDefaultIcon" />
                <!-- <span>{{ menu.meta?.title ? menu.meta?.title : $t('noTitle') }}</span> -->
                <span>{{ $t(`pagesTitle.${menu.meta?.name}`) }}</span>
            </el-menu-item>
        </template>
    </template>
</template>
<script setup lang="ts">
import { useConfig } from '/@/stores/config'
import type { RouteRecordRaw } from 'vue-router'
import { getFirstRoute, onClickMenu } from '/@/utils/router'
import { ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const config = useConfig()

interface Props {
    menus: RouteRecordRaw[]
    extends?: {
        level: number
        [key: string]: any
    }
}
const props = withDefaults(defineProps<Props>(), {
    menus: () => [],
    extends: () => {
        return {
            level: 1,
        }
    },
})

/**
 * sub-menu-item 被点击 - 用于单栏布局和双栏布局
 * 顶栏菜单：点击时打开第一个菜单
 * 侧边菜单（若有）：点击只展开收缩
 *
 * sub-menu-item 被点击时，也会触发到 menu-item 的点击事件，由 el-menu 内部触发，无法很好的排除，在此检查 level 值
 */
const onClickSubMenu = (menu: RouteRecordRaw) => {
    if (props.extends?.position == 'horizontal' && props.extends.level <= 1 && menu.children?.length) {
        const firstRoute = getFirstRoute(menu.children)
        if (firstRoute) {
            onClickMenu(firstRoute)
        } else {
            ElNotification({
                type: 'error',
                message: t('utils.No child menu to jump to!'),
            })
        }
    }
}
</script>

<style scoped lang="scss">
.el-sub-menu .icon,
.el-menu-item .icon {
    vertical-align: middle;
    margin-right: 5px;
    width: 24px;
    text-align: center;
    flex-shrink: 0;
    color: #fff !important;
}

.is-active > .icon {
    color: 	#ffffff !important;
    // font-weight: bold !important;

}
.el-menu-item.is-active {
    color: 	#ffffff !important;
    // font-weight: bold !important;

}
::v-deep .el-sub-menu__title {
    height: 40px;
}
::v-deep .el-menu {
    background: #000;
}
::v-deep .el-sub-menu__title:hover{
    background-color: #A9A9A9 !important;
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
    background-color: transparent !important;
  }
  &:hover {
    color: #8957ff !important;
    background-color: transparent !important;
  }
}
</style>

<template>
    <el-header v-if="!navTabs.state.tabFullScreen" class="layout-header">
        <!-- <div class="header-content">
            <NavMenus />
        </div> -->
    </el-header>
</template>

<script setup lang="ts">
import { useConfig } from '/@/stores/config'
import { useNavTabs } from '/@/stores/navTabs'
import DefaultNavBar from '/@/layouts/backend/components/navBar/default.vue'
import ClassicNavBar from '/@/layouts/backend/components/navBar/classic.vue'
import StreamlineNavBar from '/@/layouts/backend/components/menus/menuHorizontal.vue'
import DoubleNavBar from '/@/layouts/backend/components/navBar/double.vue'
import NavMenus from './navMenus.vue'

defineOptions({
    name: 'layout/header',
    components: { DefaultNavBar, ClassicNavBar, StreamlineNavBar, DoubleNavBar },
})

const config = useConfig()
const navTabs = useNavTabs()
</script>

<style scoped lang="scss">
.layout-header {
    height: auto;
    padding: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-content {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: flex-end;
}
</style>

<template>
    <div class="header">
        <div class="custom-slot">
            <slot></slot> <!-- 添加插槽 -->
        </div>
        <NavMenus />
    </div>
</template>
<script lang="ts" setup>
import NavMenus from '/@/layouts/backend/components/navMenus.vue'
import { useConfig } from '/@/stores/config'
const configStore = useConfig()

</script>

<style lang="scss">
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 60px;
    // background-color: #fff;
    // 暗黑模式---修改样式
    background-color: v-bind('configStore.getColorVal("headerBarBackground")');
    padding: 20px 0 20px 40px;
    border-bottom: 1px solid #E8EAED;
    position: relative;
}
.custom-slot {
    display: flex;
    align-items: center;
    font-size: 22px;
    font-weight: bold;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        bottom: -17px;
        left: 0;
        width: 100%;
        height: 4px;
        background-color: #7B68EE; /* 边框颜色 */
    }
}
</style>

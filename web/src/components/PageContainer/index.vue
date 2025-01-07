<!-- PageContainer.vue -->
<template>
    <div class="page-container" ref="containerRef">
        <div v-if="loading" class="loading-mask">
            <div class="spinner" :style="{ borderTopColor: loadingColor }"></div>
        </div>
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, withDefaults } from 'vue'

interface Props {
    loading?: boolean
    background?: string
    loadingColor?: string
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    // background: 'rgba(255, 255, 255, 0.9)', //白色透明
    // background: 'var(--ba-bg-color-overlay)',
    background: '#ffffff',
    loadingColor: '#8957FF'
})

const containerRef = ref<HTMLElement | null>(null)
</script>

<style lang="scss" scoped>
.page-container {
    position: relative;
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.loading-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: v-bind(background);
    z-index: 9999;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(137, 87, 255, 0.2);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>

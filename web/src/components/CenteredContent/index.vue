<template>
    <div>
        <div class="statistic-display">
            <div class="title">{{ title }}</div>
            <div class="value">{{ value }}</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
defineProps<{
    title: string
    value: string | number
}>()
</script>

<style scoped>
.statistic-display {
    display: flex;
    flex-direction: column;
    text-align: center;
    width: 300px;
    height: 100%;
    padding: 20px;
    box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 16px 0px;
    border-radius: 6px;
    border: 1px solid rgb(232, 234, 237);
    margin: 0 30px;
}

.title {
    font-size: 18px;
    margin-bottom: 10px;
    color: #333;
}

.value {
    font-size: 24px;
}
</style>

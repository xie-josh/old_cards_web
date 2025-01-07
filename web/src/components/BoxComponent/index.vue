<template>
    <div class="box" :style="{ backgroundColor: backgroundColor, borderColor: borderColor }">
      <!-- 上部分 -->
      <div class="top-section">
        <div class="icon-container">
            <span class="icon">{{ icon }}</span>
        </div>
        <div class="title-container">
          <div class="title">{{ title }}</div>
          <div class="unit">{{ unit }}</div>
        </div>
      </div>

      <!-- 中部分 -->
      <div class="middle-section">
        <div class="percentage">{{ percentage }}%</div>
        <div class="image-container">
          <img :src="image" alt="image" class="image" />
        </div>
      </div>

      <!-- 下部分 -->
      <div class="bottom-section">
        <div class="value">{{ value }}</div>
      </div>
    </div>
  </template>
<!-- 引用示例
<BoxComponent
icon="🔥"
title="可用金额"
unit=""
:percentage="75"
:image="imageUrl"
:value="dataDialog.realTimeBalance"
backgroundColor="#FFFFFF"
borderColor="#FFFFFF"
/>
-->
<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    icon: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },
    percentage: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    value: {
        type: [String, Number],
        required: true,
    },
    backgroundColor: {
        type: String,
        default: '#ffffff',
    },
    borderColor: {
        type: String,
        default: '#000000', // 默认边框颜色
    }
});
</script>

  <style scoped>
  .box {
    width: 300px;
    height: 170px;
    padding: 16px;
    /* border-radius: 8px; */
    /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /* border: 2px solid v-bind(borderColor); */
    margin: 0 50px 0 0;
    box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 16px 0px;
     border-radius: 6px;
     border: 1px solid rgb(232, 234, 237);
  }

  .top-section {
    display: flex;
    align-items: center;
  }

  .icon-container {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    border: 1px solid #000;
  }

  .icon {
    color: white;
            font-size: 24px;
  }

  .title-container {
    display: flex;
    flex-direction: column;
  }

  .title {
    font-size: 18px;
    /* font-weight: bold; */
  }

  .unit {
    font-size: 14px;
    color: #888;
  }

  .middle-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .percentage {
    font-size: 24px;
    /* font-weight: bold; */
  }

  .image-container {
    width: 60px;
    height: 60px;
  }

  .image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .bottom-section {
    display: flex;
    justify-content: flex-start;
  }

  .value {
    font-size: 20px;
    /* font-weight: bold; */
  }
  </style>

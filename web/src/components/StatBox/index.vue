<template>
    <div class="content-box">
      <div class="stat-box">
        <div>
          <div class="icon-container">
            <svg :fill="iconColor" :viewBox="iconViewBox" xmlns="http://www.w3.org/2000/svg">
              <path :d="iconPath" fill-rule="evenodd"/>
            </svg>
          </div>
        </div>
        <div class="content">
          <div class="title">{{ label }}</div>
          <div class="value">{{ value }}</div>
        </div>
      </div>
      <div class="unit">
        <slot></slot> <!-- 添加插槽 -->
      </div>
    </div>
  </template>

<script>
export default {
    name: 'StatBox',
    props: {
        iconColor: {
            type: String,
            required: true
        },
        iconViewBox: {
            type: String,
            required: true
        },
        iconPath: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        value: {
            type: [String, Number],
            required: true
        }
    }
}
</script>

  <style lang="scss" scoped>
  .content-box {
    background: #fff;
    margin: 0 50px 0 0;
    padding: 0px;
    box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 16px 0px;
    border-radius: 6px;
    border: 1px solid rgb(232, 234, 237);
    .unit {
      padding: 3px 0 17px 20px;
    }
  }
  .stat-box {
    display: flex;
    align-items: center;
    width: 270px;
    padding: 20px 20px 0;
    max-width: 300px;
    .icon-container {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
      .icon {
        color: white;
        font-size: 24px;
      }
    }
    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 25px;
      .title {
        font-size: 14px;
        margin-bottom: 5px;
      }
      .value {
        font-size: 20px;
        color: #333;
        font-weight: bold;
      }
    }
  }
  </style>

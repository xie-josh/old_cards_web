<template>
    <div class="page">
        <div class="container">
            <div class="left-panel">
                <!-- <div class="carousel">
                    <el-carousel  :autoplay="false" arrow="never" style="width:100%;height: 100vh;" height="100vh">
                        <div class="login_banner">
                            <img :src="fullUrl('/static/images/avatar.png')" style="width:100%;height:100%" />
                        </div>
                    </el-carousel>
                </div> -->
                <div class="carousel">
                    <video autoplay loop muted playsinline style="width:100%;height:100%; object-fit: cover;">
                        <source v-if="config.lang.defaultLang === 'zh-cn'" src="~assets/cn.mp4" type="video/mp4">
                        <source v-else-if="config.lang.defaultLang === 'en'" src="~assets/us.mp4" type="video/mp4">
                    </video>
                </div>
            </div>
            <div class="right-panel">
                <div class="image-container">
                    <img src="~assets/login-logo.png" class="centered-image"/>
                </div>
                <span class="title">{{ t('login.Login tips') }}</span>
                <span class="hint">{{ t('login.Tips') }}</span>
                <el-form @keyup.enter="onSubmitPre()" ref="formRef" :rules="rules" size="default" :model="form">
                    <el-form-item prop="username">
                        <el-input
                            ref="usernameRef"
                            type="text"
                            clearable
                            v-model="form.username"
                            :placeholder="t('login.Please enter an account')"
                            class="el-input"
                        >
                            <template #prefix>
                                <!-- <Icon name="fa fa-user" class="form-item-icon" size="16" color="var(--el-input-icon-color)" /> -->
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input
                            ref="passwordRef"
                            v-model="form.password"
                            type="password"
                            :placeholder="t('login.Please input a password')"
                            show-password
                            class="el-input"
                        >
                            <template #prefix>
                                <!-- <Icon name="fa fa-unlock-alt" class="form-item-icon" size="16" color="var(--el-input-icon-color)" /> -->
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-checkbox v-model="form.keep" :label="t('login.Hold session')" size="default"></el-checkbox>
                    <el-form-item>
                        <el-button
                            :loading="state.submitLoading"
                            class="submit-button"
                            type="primary"
                            size="large"
                            color="#8957FF"
                            @click="onSubmitPre()"
                        >
                            {{ t('login.Sign in') }}
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, reactive, ref, nextTick } from 'vue'
import * as pageBubble from '/@/utils/pageBubble'
import type { FormInstance, InputInstance } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { editDefaultLang } from '/@/lang/index'
import { useConfig } from '/@/stores/config'
import { useAdminInfo } from '/@/stores/adminInfo'
import { login } from '/@/api/backend'
import { uuid } from '/@/utils/random'
import { buildValidatorData } from '/@/utils/validate'
import router from '/@/router'
import clickCaptcha from '/@/components/clickCaptcha'
import toggleDark from '/@/utils/useDark'
import { fullUrl } from '/@/utils/common'
import { adminBaseRoutePath } from '/@/router/static/adminBase'

let timer: number

const config = useConfig()
const adminInfo = useAdminInfo()

toggleDark(config.layout.isDark)

const formRef = ref<FormInstance>()
const usernameRef = ref<InputInstance>()
const passwordRef = ref<InputInstance>()
const state = reactive({
    showCaptcha: false,
    submitLoading: false,
})
const form = reactive({
    username: '',
    password: '',
    keep: false,
    captchaId: uuid(),
    captchaInfo: '',
})

const { t } = useI18n()

// 表单验证规则
const rules = reactive({
    username: [buildValidatorData({ name: 'required', message: t('login.Please enter an account') }), buildValidatorData({ name: 'account' })],
    password: [buildValidatorData({ name: 'required', message: t('login.Please input a password') }), buildValidatorData({ name: 'password' })],
})

const focusInput = () => {
    if (form.username === '') {
        usernameRef.value!.focus()
    } else if (form.password === '') {
        passwordRef.value!.focus()
    }
}

onMounted(() => {
    timer = window.setTimeout(() => {
        pageBubble.init()
    }, 1000)

    login('get')
        .then((res) => {
            state.showCaptcha = res.data.captcha
            nextTick(() => focusInput())
        })
        .catch((err) => {
            console.log(err)
        })
})

onBeforeUnmount(() => {
    clearTimeout(timer)
    pageBubble.removeListeners()
})

const onSubmitPre = () => {
    formRef.value?.validate((valid) => {
        if (valid) {
            if (state.showCaptcha) {
                clickCaptcha(form.captchaId, (captchaInfo: string) => onSubmit(captchaInfo))
            } else {
                onSubmit()
            }
        }
    })
}

const onSubmit = (captchaInfo = '') => {
    state.submitLoading = true
    form.captchaInfo = captchaInfo
    login('post', form)
        .then((res) => {
            adminInfo.dataFill(res.data.userInfo)
            router.push({ path: adminBaseRoutePath })
        })
        .finally(() => {
            state.submitLoading = false
        })
}
</script>

<style scoped lang="scss">
.page {
    height: 100%;
    width: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background: linear-gradient(to bottom, rgba(144, 238, 144, 0.1), rgba(144, 238, 144, 0.5));
    background-size: cover;
    -webkit-background-size: cover;
    -o-background-size: cover;
    padding: 20px;
  }

  .container {
    height: 100%;
    width: 100%;
    display: flex;
    overflow: hidden;
    align-items: center;
    background-color: #fff;
    border-radius: 15px;
    padding: 40px 15px;
  }

  .left-panel {
    height: 100%;
    flex: 1;
    overflow: hidden;
    border-radius: 7px;
    background:#D3D3D3;
  }

  .carousel {
    width: 100%;
    height: 100%;
    // 背景最大化把上面注释放开
  }

  .right-panel {
    width: 27%;
    padding: 0 70px 30px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    margin:0 50px 0px 70px;
    position: relative;
    .title {
        text-align: center;
        margin-bottom: 10px;
        font-size: 24px;
        font-weight: bold;
    }
    .hint {
        text-align: center;
        margin-bottom: 10px;
        font-size: 15px;
        color: #6C6C6C;
    }
    .image-container {
        position: absolute;
        top: -60%; /* 调整图片的顶部位置 */
        left: 50%; /* 水平居中 */
        transform: translateX(-50%); /* 水平居中 */
    }
    .centered-image {
        max-width: 100%; /* 图片最大宽度100% */
    max-height: 100%; /* 图片最大高度100% */
    width: 150px; /* 图片宽度自适应 */
    height: auto; /* 图片高度自适应 */
    }
    .form-item-icon {
        height: auto;
    }
    .submit-button {
        width: 100%;
        letter-spacing: 2px;
        font-weight: 300;
        margin-top: 15px;
        --el-button-bg-color: var(--el-color-primary);
    }
  }
  ::v-deep .el-input__wrapper {
    height: 50px;
    border-radius: 11px;
    }
    ::v-deep .el-button--large {
    border-radius: 11px !important;
    height: 50px;
    }
  .qr-code-login {
    margin-top: 20px;
    text-align: center;
  }
.switch-language {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1;
}
.bubble {
    overflow: hidden;
    background: url(/@/assets/bg.jpg) repeat;
}
.form-item-icon {
    height: auto;
}
.login {
    position: absolute;
    top: 0;
    display: flex;
    width: 100vw;
    height: 100vh;
    align-items: center;
    justify-content: center;
    .login-box {
        overflow: hidden;
        width: 430px;
        padding: 0;
        background: var(--ba-bg-color-overlay);
        margin-bottom: 80px;
    }
    .head {
        background: #ccccff;
        img {
            display: block;
            width: 430px;
            margin: 0 auto;
            user-select: none;
        }
    }
    .form {
        position: relative;
        .profile-avatar {
            display: block;
            position: absolute;
            height: 100px;
            width: 100px;
            border-radius: 50%;
            border: 4px solid var(--ba-bg-color-overlay);
            top: -50px;
            right: calc(50% - 50px);
            z-index: 2;
            user-select: none;
        }
        .content {
            padding: 100px 40px 40px 40px;
        }
        .submit-button {
            width: 100%;
            letter-spacing: 2px;
            font-weight: 300;
            margin-top: 15px;
            --el-button-bg-color: var(--el-color-primary);
        }
    }
}

@media screen and (max-width: 720px) {
    .login {
        display: flex;
        align-items: center;
        justify-content: center;
        .login-box {
            width: 340px;
            margin-top: 0;
        }
    }
}
.chang-lang :deep(.el-dropdown-menu__item) {
    justify-content: center;
}
.content :deep(.el-input__prefix) {
    display: flex;
    align-items: center;
}

// 暗黑样式
@at-root .dark {
    .bubble {
        background: url(/@/assets/bg-dark.jpg) repeat;
    }
    .login {
        .login-box {
            background: #161b22;
        }
        .head {
            img {
                filter: brightness(61%);
            }
        }
        .form {
            .submit-button {
                --el-button-bg-color: var(--el-color-primary-light-5);
                --el-button-border-color: rgba(240, 252, 241, 0.1);
            }
        }
    }
}
@media screen and (max-height: 800px) {
    .login .login-box {
        margin-bottom: 0;
    }
}
</style>

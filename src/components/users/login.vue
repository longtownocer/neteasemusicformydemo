<template>
    <div class="login-root">
        <div class="login-list-container">
            <van-button round size="large" style="color: #f00;" @click="tologin">手机号登录</van-button>
            <van-button round size="large" @click="Enter"
                        style="background: transparent;border: 0.5px solid #ffffff;margin-top: 20px;color: #fff;">立即体验
            </van-button>
        </div>
        <div class="tologin-container" v-if="submitflag">
            <div class="goback" @click="goback">
                <van-icon name="arrow-left"/>
                <span class="arrow-info">手机号登录</span>
            </div>
            <div class="overlist" v-if="inputflag">
                <p>未注册手机登陆后将自动创建账号</p>
                <div class="input">
                    <div class="to-input">
                        <input @keydown="keyin" autofocus type="tel" v-model="username" ref="tel"
                               placeholder="+86  请输入手机号">
                    </div>
                </div>
                <div class="submit-next">
                    <van-button type="primary" @click="verification" size="large" round color="#ff2360" style="color: ">
                        下一步
                    </van-button>
                </div>
            </div>
            <div class="password-tologin pass-submit submit-password" v-else="inputflag">
                <div class="svb-submit">
                    <p class="submit-tips" style="color: #f00" v-if="tipsflag">{{suberrret.responseJSON.msg}}！</p>
                    <input type="password" v-model="password" autofocus ref="telpassword" placeholder="请输入密码">
                    <van-button type="primary" @click="verificationpassword" size="large" round
                                color="#ff2360" style="color: ">
                        登录
                    </van-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {Toast} from 'vant'
    import {mapMutations} from 'vuex'
    import Asynchronous from '@/api/asyc/asyc.js'

    export default {
        name: 'login',
        data() {
            return {
                submitflag: false,
                inputflag: true,
                username: '',
                password: '',
                usernametrim: '',
                tipsflag: false,
                suberrret: null
            }
        },
        methods: {
            ...mapMutations(['saveLoginInfo']),
            tologin() {
                this.submitflag = true
            },
            goback() {
                if (!this.inputflag) {
                    this.inputflag = !this.inputflag
                } else if (this.submitflag) {
                    this.submitflag = !this.submitflag
                } else {
                    this.$router.go(-1)
                }
            },
            keyin() {
                if (this.username.trim().length == 0) {
                    this.username = '+86   '
                }
            },
            verification() {
                this.usernametrim = this.username.trim()
                let phonum = this.usernametrim.substring(this.usernametrim.length - 11)
                if (/^1(3|4|5|7|8)\d{9}$/.test(phonum)) {
                    this.usernametrim = phonum
                    this.inputflag = false
                } else if (this.usernametrim.length == 0) {
                    this.$refs.tel.focus()
                    Toast({
                        position: 'bottom',
                        message: '手机号不能为空 ！    ',
                        duration: 2000
                    });
                } else {
                    this.$refs.tel.focus()
                    Toast({
                        position: 'bottom',
                        message: '请 输 入 正 确 格 式 的 手 机 号 码 !    ',
                        duration: 2000
                    });
                }
            },
            verificationpassword() {
                let phonepassword = this.password.trim()
                if (phonepassword.length == 0) {
                    this.$refs.telpassword.focus()
                    return Toast({
                        position: 'bottom',
                        message: '密 码 不 能 为 空 ！    ',
                        duration: 2000
                    });
                }
                this.getLogin()
            },
            getFocus() {
                if (this.submitflag) {
                    this.$refs.tel.focus()
                }
            },
            Enter() {
                this.$router.push({path: '/'})
            },
            getLogin() {
                Asynchronous({
                    type: 'get',
                    url: '/login/cellphone',
                    params: {
                        phone: this.usernametrim,
                        password: this.password
                    }
                }).then((ret) => {
                    if (ret.code == 200) {
                        this.saveLoginInfo(ret)
                        Toast({
                            message: '登录成功',
                            duration: 2000
                        })
                        this.$router.back()
                    }
                }).catch((err) => {
                    this.suberrret = err
                    this.tipsflag = true
                })
            }
        },
        created() {

        },
        mounted() {
            this.getFocus()
        },
        activated() {
            this.getFocus()
        }
    }
</script>
<style scoped lang="less">

    .login-list-container {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;

        .van-button--large {
            text-align: center;
            width: 70%;
            height: 40px;
            line-height: 40px;
            font-size: 14px;
            letter-spacing: 2px;

            button {

            }
        }
    }

    .login-root {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background-color: #ce1b2a;
        z-index: 999;
    }

    .tologin-container {
        position: fixed;
        top: 0;
        left: 0;
        background-color: #faf4ff;
        width: 100%;
        height: 100%;

        .overlist {
            padding: 20px 15px;
        }

        p {
            font-size: 13px;
            color: rgba(95, 94, 98, 0.71);
            text-align: left;
            margin-top: 60px;
            margin-left: 15px;
        }

        .goback {
            text-align: left;
            display: flex;
            flex-direction: row;
            align-items: center;
            font-weight: 400;
            margin: 20px 0 0 15px;

            span {
                font-size: 18px;
                margin-left: 10px;
            }

            i {
                font-size: 25px;
            }
        }

        .input, .pass-submit {
            text-align: left;
            margin-top: 40px;
            width: 100%;
            padding-right: 15px;
            box-sizing: border-box;

            .to-input {
                overflow: hidden;
            }

            input {
                width: 100%;
                outline: none;
                border: none;
                background: none;
                padding: 10px 0 10px 15px;
                border-bottom: 0.5px solid rgba(56, 56, 56, 0.73);
                font-size: 15px;
                letter-spacing: 1px;
            }
        }

        .submit-next, .submit-password {
            margin-top: 40px;

            button {
                letter-spacing: 1px;
            }

            .van-button--large {
                width: 85%;
                height: 40px;
                line-height: 40px;
            }
        }

        .pass-submit {
            margin-top: 80px;

            .svb-submit {
                position: relative;

                p {
                    position: absolute;
                    margin: 0;
                    right: 10px;
                    top: 10px;
                }

                text-align: center;
                padding: 0 15px;

                button {
                    margin-top: 40px;
                }
            }

        }
    }
</style>

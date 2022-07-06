<template>
	<view>
		<image src="../../static/logo-1.png" mode="widthFix" class="logo"></image>
		<view class="login-title">EMOS在线办公系统</view>
		<view class="login-subtitle">Version 2050.02</view>
		<button class="login-btn" open-type="getUserInfo" @tap="login()">登陆系统</button>
		<view class="register-container">
			没有账号?
			<text class="register" @tap="toRegiest()">立即注册</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		login: function() {
		 	let that = this;
			uni.login({
				provider: 'weixin',
				success(resp) {
					let Code = resp.code;
					console.log(Code)
					// return
					that.ajax(that.url.login, 'POST', { code: Code }, function(resp) {
						let permission = resp.data.permission;
						uni.setStorageSync('permission', permission);
						uni.switchTab({
							url:'../index/index'
						})
					});
				},
				fail() {
					uni.showToast({
						title: "执行异常",
						icon: 'none'
					});
				}
			});
		},
		toRegiest: function() {
			uni.navigateTo({
				// 跳转到注册页面
				url: '../register/register'
			});
		}
	}
};
</script>

<style lang="less">
// 引入login.less文件
@import url('login.less');
</style>

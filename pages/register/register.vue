<template>
	<view>
		<image src="../../static/logo-2.png" mode="widthFix" class="register-img"></image>
		<view class="register-container">
			<input type="text" class="register-code" placeholder="输入你的邀请码" maxlength="6" v-model="code" />
			<view class="register-desc">管理创建员工账号之后，你可以从你的个人邮箱中获得注册邀请码</view>
		</view>
		<button class="register-btn" open-type="getUserInfo" @tap="onRegister()">执行注册</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			code: ''
		};
	},
	methods: {
		onRegister: function() {}
	}
};
</script>

<style lang="less">
@import url('register.less');
</style>

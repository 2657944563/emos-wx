<template>
	<view>
		<image src="../../static/logo-2.png" mode="widthFix" class="register-img"></image>
		<view class="register-container">
			<input type="text" class="register-code" placeholder="输入你的邀请码" maxlength="6" v-model="registercode" />
			<view class="register-desc">管理创建员工账号之后，你可以从你的个人邮箱中获得注册邀请码</view>
		</view>
		<button class="register-btn" open-type="getUserInfo" @tap="onRegister()">执行注册</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			registercode: ''
		};
	},
	methods: {
		onRegister: function() {
			let that = this;
			if (that.registercode == null || that.registercode.length == 0) {
				uni.showToast({
					title: '请输入邀请码',
					icon: 'none'
				});
				return;
			} else if (/^[0-9]{6}$/.test(that.registercode) == false) {
				uni.showToast({
					title: '邀请码为6位数字',
					icon: 'none'
				});
				return;
			}
			// 弹出用户信息授权页面
			uni.getUserProfile({
				success(resp) {
					let Name = resp.userInfo.nickName;
					let ImgUrl = resp.userInfo.avatarUrl;
					//获取用户临时code
					uni.login({
						provider: 'weixin',
						success(resp) {
							let code = resp.code;
							console.log(code);
							// return	
							// 封装数据
							let data = {
								code: code,
								registerCode: that.registercode,
								nickName: Name,
								url: ImgUrl
							};
							console.log(that.url);
							console.log(data);
							// 调用注册接口
							that.ajax(that.url.register, 'POST', data, function(resp) {
								let permission = resp.data.permission;
								// 存储权限列表
								uni.setStorageSync('permission', permission);
								// 跳转首页
								uni.switchTab({
									url: '../index/index'
								});
							});
						}
					});
				},
				provider: 'weixin',
				desc: '用于登录系统'
			});
		}
	}
};
</script>

<style lang="less">
@import url('register.less');
</style>

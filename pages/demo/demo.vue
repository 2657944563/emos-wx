<template>
	<view>
		<!-- 输出普通文本 -->
		<view class="test">{{ test1 }}</view>
		<!-- 循环输出变量的值 -->
		<view v-for="one in tel">{{ one }}</view>
		<!-- if控制语句 -->
		<view v-if="age > 18"><button @click="singUp()" type="default" v-text="age"></button></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			test1: '测试数据1',
			tel: ['123456', '2345555'],
			age: 22
		};
	},
	methods: {
		singUp: function() {
			// 数据双向绑定可以回传数据
			this.age = this.age + 1;
			//弹出自动消失的通知
			uni.showToast({
				
				title: '登录成功' + this.age
			});
		}
	}
};
</script>

<style>
.test {
	width: 100%;
	text-align: center;
	font-size: 36rpx;
	color: #8f8f94;
}
</style>

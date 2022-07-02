<template>
	<view>
		<!-- 输出普通文本 -->
		<view class="test">{{ test1 }}</view>
		<!-- 循环输出变量的值 -->
		<view v-for="one in tel">{{ one }}</view>
		<!-- if控制语句 -->
		<view v-if="age > 18">
			<!-- 按钮：调用methods中的自定义方法 -->
			<button @tap="singUp()" type="default" v-text="age"></button>
		</view>
		<view>
			<!-- 双向绑定变量 -->
			<input type="text" v-model="name" />
		</view>
		<view>{{ name }}</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			test1: '测试数据1',
			tel: ['123456', '2345555'],
			age: 22,
			name: '请输入'
		};
	},
	methods: {
		singUp: function() {
			// 数据可以回传数据
			this.age = this.age + 1;
			console.log(this.age);
			//弹出自动消失的通知
			uni.showToast({
				// test1=this.age
				title: this.name + '欢迎您！'
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

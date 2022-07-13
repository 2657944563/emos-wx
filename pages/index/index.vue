<template>
	<view class="page">
		<swiper circular="true" interval="8000" duration="1000" class="swiper">
			<swiper-item><image mode="widthFix" src="https://emos-1253798770.cos.ap-chengdu.myqcloud.com/banner/swiper-1.jpg"></image></swiper-item>
			<swiper-item><image mode="widthFix" src="https://emos-1253798770.cos.ap-chengdu.myqcloud.com/banner/swiper-2.jpg"></image></swiper-item>
			<swiper-item><image mode="widthFix" src="https://emos-1253798770.cos.ap-chengdu.myqcloud.com/banner/swiper-3.jpg"></image></swiper-item>
			<swiper-item><image mode="widthFix" src="https://emos-1253798770.cos.ap-chengdu.myqcloud.com/banner/swiper-4.jpg"></image></swiper-item>
			<swiper-item><image mode="widthFix" src="https://emos-1253798770.cos.ap-chengdu.myqcloud.com/banner/swiper-5.jpg"></image></swiper-item>
		</swiper>
		<view class="notify-container" @tap="toPage('消息提醒','../message_list/message_list')">
			<view class="notify-title"><image src="../../static/icon-1.png" mode="widthFix" class="notify-icon">消息提醒</image></view>
			<view class="notify-content">你有{{ unreadRows }}条未读消息</view>
			<image src="../../static/icon-2.png" mode="widthFix" class="notify-more"></image>
		</view>
		<view class="nav-container">
			<view class="nav-row">
				<view @tap="toPage('在线签到', '../checkin/checkin')" class="nav">
					<image src="../../static/nav-1.png" mode="widthFix" class="icon"></image>
					<text class="name">在线签到</text>
				</view>
				<view class="nav">
					<image src="../../static/nav-2.png" mode="widthFix" class="icon"></image>
					<text class="name">员工健康</text>
				</view>
				<view class="nav">
					<image src="../../static/nav-3.png" mode="widthFix" class="icon"></image>
					<text class="name">在线请假</text>
				</view>
				<view class="nav">
					<image src="../../static/nav-4.png" mode="widthFix" class="icon"></image>
					<text class="name">公务出差</text>
				</view>
			</view>
			<view class="nav-row">
				<view class="nav">
					<image src="../../static/nav-5.png" mode="widthFix" class="icon"></image>
					<text class="name">员工日报</text>
				</view>
				<view class="nav">
					<image src="../../static/nav-6.png" mode="widthFix" class="icon"></image>
					<text class="name">我的加班</text>
				</view>
				<view class="nav">
					<image src="../../static/nav-7.png" mode="widthFix" class="icon"></image>
					<text class="name">付款申请</text>
				</view>
				<view class="nav">
					<image src="../../static/nav-8.png" mode="widthFix" class="icon"></image>
					<text class="name">费用报销</text>
				</view>
			</view>
			<view class="nav-row">
				<view class="nav">
					<image src="../../static/nav-9.png" mode="widthFix" class="icon"></image>
					<text class="name">公告通知</text>
				</view>
				<view class="nav">
					<image src="../../static/nav-10.png" mode="widthFix" class="icon"></image>
					<text class="name">在线审批</text>
				</view>
				<view class="nav">
					<image src="../../static/nav-11.png" mode="widthFix" class="icon"></image>
					<text class="name">物品领用</text>
				</view>
				<view class="nav">
					<image src="../../static/nav-12.png" mode="widthFix" class="icon"></image>
					<text class="name">采购申请</text>
				</view>
			</view>
		</view>
		<uni-popup ref="popupMsg" type="top">
			<uni-popup-message type="success" :message="'接收到' + lastRows + '条消息'" :duration="2000"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue';
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue';
import uniCalendar from '@/components/uni-calendar/uni-calendar.vue';

export default {
	components: {
		uniPopup,
		uniPopupMessage,
		uniPopupDialog,
		uniCalendar
	},
	data() {
		return {
			unreadRows: 0,
			lastRows: 0,
			timer: null
		};
	},
	onLoad() {
		let that = this;
		// 监听showMessage函数，如果showMessage被传入，那么触发函数内容
		uni.$on('showMessage', function() {
			// 弹出气泡窗格
			that.$refs.popupMsg.open();
		});
	},
	onUnload() {
		uni.$off('showMessage');
	},
	onShow() {
		let that = this;
		// 每五秒循环请求一次
		that.timer = setInterval(function() {
			that.ajax(that.url.refreshMessage, 'GET', {}, function(resp) {
				console.log(resp);
				that.unreadRows = resp.data.unreadRows;
				that.lastRows = resp.data.lastRows;
				// 如果新消息大于0，那么触发showMessage函数
				if (that.lastRows > 0) {
					uni.$emit('showMessage');
				}
			});
		}, 5 * 1000);
		// 进入页面需要
		that.ajax(that.url.refreshMessage, 'GET', null, function(resp) {
			console.log(resp);
			that.unreadRows = resp.data.unreadRows;
			that.lastRows = resp.data.lastRows;
			// 如果新消息大于0，那么触发showMessage函数
			if (that.lastRows > 0) {
				uni.$emit('showMessage');
				// console.log("多次消息")
			}
		});
	},
	onHide() {
		// 当隐藏小程序窗口，销毁轮询函数，避免无谓的请求
		let that = this;
		clearInterval(that.timer);
	},
	methods: {
		toPage: function(name, path) {
			console.log(name);
			uni.navigateTo({
				url: path
			});
		}
	}
};
</script>

<style lang="less">
@import url(index.less);
</style>

<template>
	<view class="page">
		<view class="summary-container">
			<view class="user-info">
				<image :src="photo" mode="widthFix" class="photo"></image>
				<view class="info">
					<view class="username">{{ name }}</view>
					<view class="dept">隶属部门：{{ deptName == null || deptName == '' ? '未分配部门' : deptName }}</view>
				</view>
			</view>
			<view class="date">{{ date }}</view>
		</view>
		<view class="result-container">
			<view class="left">
				<image src="../../static/icon-6.png" mode="widthFix" class="icon-timer"></image>
				<view class="line"></view>
				<image src="../../static/icon-6.png" mode="widthFix" class="icon-timer"></image>
			</view>
			<view class="right">
				<view class="row">
					<text class="start">上班 (时间:{{ attendanceTime }})</text>
				</view>
				<view class="row">
					<text class="checkin-time">签到时间 ({{ checkinTime }})</text>
					<text class="checkin-result green" v-if="status == '正常'">{{ status }}</text>
					<text class="checkin-result yellow" v-if="status == '迟到'">{{ status }}</text>
					<text class="checkin-result red" v-if="status == '缺勤'">{{ status }}</text>
				</view>
				<view class="row">
					<image src="../../static/icon-7.png" mode="widthFix" class="icon-small"></image>
					<text class="desc">{{ address }}</text>
					<text class="checkin-result green" v-if="risk == '低风险'">{{ risk }}</text>
					<text class="checkin-result yellow" v-if="risk == '中风险'">{{ risk }}</text>
					<text class="checkin-result red" v-if="risk == '高风险'">{{ risk }}</text>
				</view>
				<view class="row">
					<image src="../../static/icon-8.png" mode="widthFix" class="icon-small"></image>
					<text class="desc">身份验证</text>
					<text class="checkin-result green">已通过</text>
				</view>
				<view class="row">
					<text class="end">下班 (时间:{{ closingTime }})</text>
				</view>
			</view>
		</view>
		<view class="checkin-report">
			<image src="../../static/big-icon-1.png" mode="widthFix" class="big-icon"></image>
			<view class="report-title">
				<text class="days">{{ checkinDays }}</text>
				<text class="unit">天</text>
			</view>
			<view class="sub-title">
				<text>累计签到</text>
				<view class="line"></view>
			</view>
			<view class="calendar-container">
				<view class="calendar" v-for="one in weekCheckin" :key="one">
					<image src="../../static/icon-9.png" mode="widthFix" class="calendar-icon" v-if="one.type == '工作日'"></image>
					<image src="../../static/icon-10.png" mode="widthFix" class="calendar-icon" v-if="one.type != '工作日'"></image>
					<text class="day">{{ one.day }}</text>
					<text class="result green" v-if="one.status == '正常'">{{ one.status }}</text>
					<text class="result yellow" v-if="one.status == '迟到'">{{ one.status }}</text>
					<text class="result red" v-if="one.status == '缺勤'">{{ one.status }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			name: '无名氏',
			photo: 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJ2ibFME7vKuDXrxfpF6yQoCrfulRibMTiac5OTnRuZYPib5b1iaLIUqQrFof5ddiam88znTs4mnVMdqqHw/132',
			deptName: '',
			address: '四川省四川省四川省四川省四川省四川省',
			status: '正常',
			risk: '中风险',
			checkinTime: '08:23',
			date: '2022年7月8日',
			attendanceTime: '08:30',
			closingTime: '17:30',
			checkinDays: 201,
			weekCheckin: [
				{ type: '工作日', day: '周一', status: '缺勤' },
				{ type: '工作日', day: '周二', status: '迟到' },
				{ type: '工作日', day: '周三', status: '正常' },
				{ type: '工作日', day: '周四', status: '正常' },
				{ type: '工作日', day: '周五', status: '正常' },
				{ type: '节假日', day: '周六', status: '' },
				{ type: '节假日', day: '周日', status: '' }
			]
		};
	},
	onShow: function() {
		console.log('onShow方法执行');
		let that = this;
		that.ajax(that.url.searchTodayCheckin, 'GET', null, function(resp) {
			console.log(resp)
			let result = resp.data.result;
			console.log(result);
			that.date = result.date;
			that.name = result.name;
			that.photo = result.photo;
			that.deptName = result.deptName;
			that.address = result.address;
			that.status = result.status;
			that.risk = result.risk;
			that.checkinTime = result.checkinTime;
			that.attendanceTime = result.attendanceTime;
			that.closingTime = result.closingTime;
			that.weekCheckin = result.weekCheckin;
			that.checkinDays = result.checkinDays;
			that.endDate = result.endDate;
			that.userId = result.userId;
			that.startDate = result.startDate;
		});
	},
	methods: {}
};
</script>

<style lang="less">
@import url('checkin_result.less');
</style>

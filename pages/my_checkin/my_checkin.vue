<template>
	<view>
		<view class="statistics">
			<image src="../../static/big-icon-1.png" mode="widthFix" class="big-icon"></image>
			<view class="report-title">
				<text class="days">{{ sum_1 }}</text>
				<text class="unit">天</text>
			</view>
			<view class="sub-title"><text>本月签到</text></view>
			<view class="report">
				<view class="column green">
					<text class="column-title">正常签到</text>
					<text class="number">{{ sum_1 }}</text>
				</view>
				<view class="column orange">
					<text class="column-title">迟到签到</text>
					<text class="number">{{ sum_2 }}</text>
				</view>
				<view class="column red">
					<text class="column-title">缺勤签到</text>
					<text class="number">{{ sum_3 }}</text>
				</view>
			</view>
		</view>
		<view class="calendar-container"><uni-calendar @confirm="changgeMonth" @monthSwitch="changgeMonth" :insert="true" :lunar="false" :selected="list"></uni-calendar></view>
	</view>
</template>

<script>
import uniCalendar from '@/components/uni-calendar/uni-calendar.vue';
export default {
	components: {
		uniCalendar
	},
	data() {
		return {
			sum_1: 10,
			sum_2: 20,
			sum_3: 30,
			list: [{ date: '2022-07-08', info: '签到信息' }]
		};
	},
	onShow() {
		let date = new Date();
		this.searchCheckin(this, date.getFullYear(), date.getMonth() + 1);
	},
	methods: {
		changgeMonth: function(e) {
			// console.log(e)
			let year = parseInt(e.year);
			let month = parseInt(e.month);
			this.searchCheckin(this, e.year, e.month);
		},
		searchCheckin: function(ref, year, month) {
			let that = ref;
			that.sum_1 = 0;
			that.sum_2 = 0;
			that.sum_3 = 0;
			that.list = [];
			// setStorageSync
			let tempList = uni.getStorageSync(year + '-' + month);
			if (tempList != undefined && tempList.length > 0) {
				that.list = tempList;
				let sum_1 = uni.getStorageSync(year + '-' + month + 'sum_1');
				let sum_2 = uni.getStorageSync(year + '-' + month + 'sum_2');
				let sum_3 = uni.getStorageSync(year + '-' + month + 'sum_3');
				if (sum_1 != null || sum_1 != undefined) {
					that.sum_1 = sum_1;
					that.sum_2 = sum_2;
					that.sum_3 = sum_3;
					return;
				}
			}
			that.ajax(that.url.searchMonthCheckin, 'POST', { year: year, month: month }, function(resp) {
				console.log(resp);
				let temp = [];
				for (let one of resp.data.list) {
					if (one.status != null && one.status != '') {
						let color = '';
						if (one.status == '正常') {
							color = 'green';
						} else if (one.status == '迟到') {
							color = 'orange';
						} else if (one.status == '缺勤') {
							color = 'red';
						}
						that.list.push({
							date: one.date,
							info: one.status,
							color: color
						});
						temp.push({
							date: one.date,
							info: one.status,
							color: color
						});
					}
				}
				that.sum_1 = resp.data.sum_1;
				that.sum_2 = resp.data.sum_2;
				that.sum_3 = resp.data.sum_3;
				uni.setStorageSync(year + '-' + month, temp);
				uni.setStorageSync(year + '-' + month + 'sum_1', that.sum_1);
				uni.setStorageSync(year + '-' + month + 'sum_2', that.sum_2);
				uni.setStorageSync(year + '-' + month + 'sum_3', that.sum_3);
			});
		}
	}
};
</script>

<style lang="less">
@import url('my_checkin.less');
</style>

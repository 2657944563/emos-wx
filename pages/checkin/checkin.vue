<template>
	<view>
		<camera device-position="front" flash="off" class="camera" @error="error" v-if="showCamera"></camera>
		<image mode="widthFix" class="image" :src="photoPath" v-if="showImage"></image>
		<view class="operatre-container">
			<button type="primary" class="btn" @tap="clickBtn" :disabled="canCheckin">{{ btnText }}</button>
			<button type="warn" class="btn" @tap="afresh" :disabled="canCheckin">重拍</button>
		</view>
		<view class="notice-container">
			<text class="notice">注意事项</text>
			<text class="desc">拍照签到需要拍摄正脸信息，请不要遮挡人脸</text>
		</view>
	</view>
</template>

<script>
// 引入腾讯经纬度转换jdk
var QQMapWx = require('../../lib/qqmap-wx-jssdk.min.js');
var qqmapsdk;
export default {
	data() {
		return {
			showCamera: true,
			showImage: false,
			canCheckin: false,
			photoPath: '',
			btnText: '拍照'
		};
	},
	onLoad() {
		this.qqmapsdk = new QQMapWx({
			key: 'KZ2BZ-6EGEQ-3DW5R-GDI7O-3T3OV-X6BWU'
		});
	},
	methods: {
		clickBtn: function() {
			let that = this;
			uni.authorize({
				scope: 'scope.camera',
				success() {
					if (that.btnText == '拍照') {
						let ctxCamera = uni.createCameraContext();
						ctxCamera.takePhoto({
							quality: 'high',
							success(res) {
								console.log(res.tempImagePath);
								that.photoPath = res.tempImagePath;
								that.showImage = true;
								that.showCamera = false;
								that.btnText = '签到';
							}
						});
					} else {
						//TODO 签到功能
						console.log('签到');
						uni.showLoading({
							title: '签到中'
						});
						setTimeout(function() {
							uni.hideLoading();
						}, 3000);
						uni.authorize({
							// 获取地理位置权限
							scope: 'scope.userLocation',
							accuracy: 'best',
							isHighAccuracy: 'true',
							success() {
								// 获取经纬度
								uni.getLocation({
									type: 'gcj02',
									success(res) {
										// 赋予经纬度变量方便后面腾讯地图sdk调用接口查询具体地址
										let latitude = res.latitude;
										let longitude = res.longitude;
										// 腾讯sdk接口查询具体地址函数
										that.qqmapsdk.reverseGeocoder({
											location: {
												latitude: latitude,
												longitude: longitude
											},
											success(res) {
												// TODO 调用自己的服务器,缓存签到信息
												console.log(res); // 返回对象
												let address = res.result.address; // 地址
												let city = res.result.address_component.city; //城市
												let district = res.result.address_component.district; //区划
												let nation = res.result.address_component.nation; //国家
												let province = res.result.address_component.province; //省份
											}
										});
									}
								});
							},
							fail() {
								console.log('获取位置失败');
							}
						});
					}
				},
				fail() {
					console.log('没有相机权限');
				}
			});
		},
		afresh: function() {
			this.showCamera = true;
			this.showImage = false;
			this.btnText = '拍照';
		}
	}
};
</script>

<style lang="less">
@import url(checkin.less);
</style>

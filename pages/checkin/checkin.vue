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
			showCamera: false, //false:隐藏 true:显示
			showImage: false,  // false:隐藏 true:显示
			canCheckin: true, // false:开启 true:关闭
			photoPath: '',
			btnText: '拍照'
		};
	},
	onLoad() {
		this.qqmapsdk = new QQMapWx({
			key: 'KZ2BZ-6EGEQ-3DW5R-GDI7O-3T3OV-X6BWU'
		});
	},
	onShow() {
		let that = this;
		that.ajax(that.url.validCanCheckIn, 'GET', {}, function(resp) {
			console.log(resp);
			console.log(resp.data);
			if (resp.data.msg == '可以考勤') {
				that.showImage = false;
				that.showCamera = true;
				that.canCheckin = false;
				//可以考勤
				uni.showToast({
					title: resp.data.msg,
					icon: 'none',
					duration: 1000
				});
			} else if (resp.data.msg == '今日已考勤') {
				uni.showModal({
					title: '提示',
					content: '今日已经考勤是否覆盖考勤记录？',
					success(res) {
						if (res.confirm) {
							that.showCamera = true;
							that.canCheckin = false;
							that.showImag = false;
						}
					}
				});
			} else {
			
				uni.showToast({
					title: resp.data.msg,
					icon: 'error',
					duration: 1000
				});
			}
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
						}, 30000);
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
												let country = res.result.address_component.nation; //国家
												let province = res.result.address_component.province; //省份
												uni.uploadFile({
													url: that.url.checkin,
													name: 'photo',
													filePath: that.photoPath,
													header: {
														token: uni.getStorageSync('token')
													},
													formData: {
														address: address,
														country: country,
														province: province,
														city: city,
														district: district
													},
													success(resp) {
														let chekinFaceResp = JSON.parse(resp.data);
														if (resp.statusCode == 500 && chekinFaceResp.msg == '不存在人脸模型') {
															uni.hideLoading();
															uni.showModal({
																title: '提示',
																content: 'EMOS系统中不存在你的人脸模型，是否使用当前照片创建？',
																success(res) {
																	uni.showLoading({
																		title: '创建中'
																	});
																	// 如果用户点了确定按钮
																	if (res.confirm) {
																		uni.uploadFile({
																			url: that.url.createFaceModel,
																			filePath: that.photoPath,
																			name: 'photo',
																			header: {
																				token: uni.getStorageSync('token')
																			},
																			success(resp) {
																				let createFaceResp = JSON.parse(resp.data);
																				console.log(resp);
																				uni.hideLoading();
																				if (resp.statusCode == 500) {
																					uni.showToast({
																						title: createFaceResp.msg,
																						icon: 'none'
																					});
																				} else if (resp.statusCode == 200) {
																					uni.showToast({
																						title: createFaceResp.msg
																					});
																				}
																			}
																		});
																	}
																}
															});
															//todo 询问是否用当前图片创建人脸模型
														} else if (resp.statusCode == 200) {
															uni.hideLoading();
															if (chekinFaceResp.code == 200) {
																//todo 签到成功
																uni.showToast({
																	title: '签到成功',
																	complete() {
																		//todo 跳转到签到成功页面
																		uni.navigateTo({
																			url: '../checkin_result/checkin_result'																			
																		})
																	}
																});
															} else {
																uni.showToast({
																	title: '未知异常',
																	icon: 'error'																	
																});
															}
														} else if (resp.statusCode == 500) {
															uni.hideLoading();
															uni.showToast({
																title: chekinFaceResp.msg,
																icon: 'none'
															});
														}
													}
												});
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

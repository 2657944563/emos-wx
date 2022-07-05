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
	methods: {
		clickBtn: function() {
			let that = this;
			uni.authorize({
				scope:'scope.camera',
				success() {
					if (that.btnText == '拍照') {
						let ctxCamera = uni.createCameraContext();
						ctxCamera.takePhoto({
							quality:"high",
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
						console.log("签到")
					}
				},
				fail() {
					 console.log("没有相机权限")
				}
			})
			
		},
		afresh: function() {
			this.showCamera=true;
			this.showImage=false;
			this.btnText='拍照';
		}
	}
};
</script>

<style lang="less">
@import url(checkin.less);
</style>

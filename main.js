import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()

let baseUrl = "http://192.168.0.220:8080/emos-wx-api"

Vue.prototype.url = {
	register: baseUrl + "/user/register",
	login: baseUrl + "/user/login",
	checkin: baseUrl + "/checkin/checkin",
	createFaceModel: baseUrl + "/checkin/createFaceModel",
	validCanCheckIn: baseUrl + "/checkin/validCanCheckIn",
	searchTodayCheckin: baseUrl + "/checkin/searchTodayCheckin",
	searchUserSummary: baseUrl + "/user/searchUserSummary",
	searchMonthCheckin: baseUrl + "/checkin/searchMonthCheckin",
	refreshMessage: baseUrl + "/message/refreshMessage",
	searchMessageByPage: baseUrl + "/message/searchMessageByPage",
	deleteMessageRefById: baseUrl + "/message/deleteMessageRefById",
	searchMessageById: baseUrl + "/message/searchMessageById",
	updateUnreadMessage: baseUrl + "/message/updateUnreadMessage"
}
Vue.prototype.checkPermission = function(perms) {
	let permis = uni.getStorageSync("permission")
	let resu = false
	for (let one of perms) {
		if (permis.indexOf(one) != -1) {
			resu = true;
			break;
		}
	}
	return resu;
}

Vue.prototype.ajax = function(url, method, data, fun) {
	uni.request({
		"url": url,
		"method": method,
		sslVerify: 'false',
		"header": {
			'token': uni.getStorageSync('token')
		},
		"data": data,
		success(resp) {
			if (resp.statusCode == 401) {
				uni.redirectTo({
					url: '../pages/login/login.vue'
				})
			} else
			if (resp.statuCode == 500) {

			} else
			if (resp.statusCode == 200 && resp.data.code == 200) {
				let data = resp.data
				// 如果data中携带有token
				if (data.hasOwnProperty("token")) {
					console.log(resp.data)
					let token = data.token
					uni.setStorageSync("token", token)
				}
				// 调用传递参数中传递将来的函数
				fun(resp)
			} else {
				uni.showToast({
					icon: 'none',
					title: resp.data

				})
			}
		},
		fail(resp) {
			uni.showToast({
				icon: 'error',
				title: "系统服务器错误"
			})
		}

	});

}

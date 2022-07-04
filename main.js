import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()

let baseUrl = "http://127.0.0.1:8080/emos-wx-api"

Vue.prototype.url = {
	register: baseUrl + "/user/register",
	login: baseUrl + "/user/login"
}
Vue.prototype.ajax = function(url, method, data, fun) {
	uni.request({
		"url": url,
		"method": method,
		"header": {
			token: uni.getStorageSync('token')
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
		}

	})

}

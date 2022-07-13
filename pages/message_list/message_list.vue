<template>
	<view class="page">
		<uni-list>
			<uni-list-chat
				v-for="one in list"
				:key="one.id"
				:title="one.senderName"
				:note="one.msg"
				:avatar="one.photo"
				badgePositon="left"
				:badgeText="one.readFlag ? '' : 'dot'"
				link="navigateTo"
				:to="'../message/message?id=' + one.id + '&readFlag=' + one.readFlag + '&refId=' + one.refId"
			>
				<view class="chat-custom-right">
					<text class="chat-custom-text">{{ one.sendTime }}</text>
				</view>
			</uni-list-chat>
		</uni-list>
	</view>
</template>

<script>
import uniList from '@/components/uni-list/uni-list.vue';
import uniListItem from '@/components/uni-list-item/uni-list-item.vue';

export default {
	components: {
		uniList,
		uniListItem
	},
	data() {
		return {
			page: 1,
			length: 20,
			list: [],
			isLastPage: false
		};
	},
	onShow() {
		this.page = 1;
		this.isLastPage = false;
		// 将页面滚动到最顶部
		uni.pageScrollTo({
			scrollTop: 0
		});
		this.loadMessageList(this);
	},
	onReachBottom() {
		if (this.isLastPage) {
			return;
		}
		this.page = this.page + 1;
		this.loadMessageList(this);
	},
	methods: {
		loadMessageList: function(ref) {
			let data = {
				page: ref.page,
				length: ref.length
			};
			ref.ajax(ref.url.searchMessageByPage, 'POST', data, function(resp) {
				let result = resp.data.result;
				if (result == null || result.length == 0) {
					ref.isLastPage = true;
					ref.page = ref.page - 1;
					if (page == 1) {
						uni.showToast({
							icon: 'none',
							title: '没有新的消息'
						});
					} else {
						uni.showToast({
							icon: 'none',
							title: '已经到底了'
						});
					}
				} else {
					if (ref.page == 1) {
						ref.list = [];
					}
					// 将新获取的消息列表存放进变量中
					ref.list = ref.list.concat(result);
					if (ref.page > 1) {
						uni.showToast({
							icon: 'none',
							title: '又加载了' + result.length + '条消息'
						});
					}
				}
			});
		}
	}
};
</script>

<style lang="less">
@import url('message_list.less');
</style>

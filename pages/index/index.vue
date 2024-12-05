<template>
	<view class="content">
		<image class="running-man" src="../static/运动组.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
		<view class="button-group">
			<button class="training-btn" @click="goToTrunk">
				<image class="btn-icon" src="../static/躯干.png"></image>
				躯干训练
			</button>
			<button class="training-btn" @click="goToLimbs">
				<image class="btn-icon" src="../static/四肢.png"></image>
				四肢训练
			</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'AT,you are a hero!'
			}
		},
		onLoad() {

		},
		methods: {
			publish() {
				uniCloud.callFunction({
					name: 'Mbody',
					data: {
						content: 'Hello, World!'
					}
				})
			},
			goToTrunk() {
				uni.navigateTo({
					url: '/pages/trunk/trunk'
				})
			},
			goToLimbs() {
				uni.navigateTo({
					url: '/pages/limb/limb'
				})
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}

	.button-group {
		margin-top: 50rpx;
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.training-btn {
		width: 300rpx;
		background-color: #007AFF;
		color: #FFFFFF;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn-icon {
		width: 40rpx;
		height: 40rpx;
		margin-right: 10rpx;
	}

	.running-man {
		width: 400rpx;
		height: 400rpx;
		margin-top: 200rpx;
		margin-bottom: 20rpx;
	}
</style>

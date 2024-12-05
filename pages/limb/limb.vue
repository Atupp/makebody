<template>
	<view class="limb-container">
	  <picker mode="date" :value="selectedDate" @change="onDateChange" class="date-picker">
		<view class="picker-text">{{ selectedDate || '请选择日期' }}</view>
	  </picker>
	  <table class="exercise-table">
		<tr>
		  <th>动作名称</th>
		  <th>重量</th>
		  <th>组数</th>
		  <th>次数</th>
		  <th>间隔</th>
		  <th>备注</th>
		</tr> 	
		<tr>
		  <td>平板卧推</td>
		  <td><input type="number" v-model="weights.benchPress" class="weight-input"></td>
		  <td><input type="number" v-model="sets.benchPress" class="sets-input"></td>
		  <td><input type="number" v-model="reps.benchPress" class="reps-input"></td>
		  <td>1-2min</td>
		  <td>-</td>
		</tr>
		<tr>
		  <td>引体向上</td>
		  <td><input type="number" v-model="weights.pullUp" class="weight-input"></td>
		  <td><input type="number" v-model="sets.pullUp" class="sets-input"></td>
		  <td><input type="number" v-model="reps.pullUp" class="reps-input"></td>
		  <td>1-2min</td>
		  <td>组数自定</td>
		</tr>
		<tr>
		  <td>上斜卧推</td>
		  <td><input type="number" v-model="weights.inclineBenchPress" class="weight-input"></td>
		  <td><input type="number" v-model="sets.inclineBenchPress" class="sets-input"></td>
		  <td><input type="number" v-model="reps.inclineBenchPress" class="reps-input"></td>
		  <td>1-2min</td>
		  <td>-</td>
		</tr>
		<tr>
		  <td>坐姿划船</td>
		  <td><input type="number" v-model="weights.seatedRow" class="weight-input"></td>
		  <td><input type="number" v-model="sets.seatedRow" class="sets-input"></td>
		  <td><input type="number" v-model="reps.seatedRow" class="reps-input"></td>
		  <td>1-2min</td>
		  <td>-</td>
		</tr>
		<tr>
		  <td>绳索夹胸</td>
		  <td><input type="number" v-model="weights.cableFly" class="weight-input"></td>
		  <td><input type="number" v-model="sets.cableFly" class="sets-input"></td>
		  <td><input type="number" v-model="reps.cableFly" class="reps-input"></td>
		  <td>45-60S</td>
		  <td>每组力竭</td>
		</tr>
		<tr>
		  <td>单臂哑铃划船</td>
		  <td><input type="number" v-model="weights.singleArmRow" class="weight-input"></td>
		  <td><input type="number" v-model="sets.singleArmRow" class="sets-input"></td>
		  <td><input type="number" v-model="reps.singleArmRow" class="reps-input"></td>
		  <td>45-60S</td>
		  <td>每组力竭</td>
		</tr>
	  </table>
	  <view class="button-container">
		<button @click="limb_submitData" class="submit-button">提交</button>
		<button @click="limb_getLastRecord" class="history-button">查看数据</button>
	  </view>
	</view>
  </template>

<script>
	export default {
		name: 'Limb',
	data() {
	  return {
		weights: {
		  benchPress: 0,
		  pullUp: 0,
		  inclineBenchPress: 0,
		  seatedRow: 0,
		  cableFly: 0,
		  singleArmRow: 0
		},
		sets: {
		  benchPress: 0,
		  inclineBenchPress: 0,
		  seatedRow: 0,
		  cableFly: 0,
		  singleArmRow: 0
		},
		reps: {
		  benchPress: 0,
		  inclineBenchPress: 0,
		  seatedRow: 0,
		  cableFly: 0,
		  singleArmRow: 0
		},
		selectedDate: '',
	  }
	},
	methods: {
        limb_submitData() {
		if (!this.selectedDate) {
		  uni.showToast({
			title: '请先选择日期',
			icon: 'none'
		  });
		  return;
		}

		// 检查是否有数据输入
		const hasData = Object.values(this.weights).some(val => val > 0) ||
					   Object.values(this.sets).some(val => val > 0) ||
					   Object.values(this.reps).some(val => val > 0);

		if (!hasData) {
		  uni.showToast({
			title: '请输入训练数据',
			icon: 'none'
		  });
		  return;
		}

		// 创建时间戳
		const selectedDateTime = new Date(this.selectedDate);
		selectedDateTime.setHours(12, 0, 0, 0);
		const timestamp = selectedDateTime.toISOString();

		uni.showModal({
		  title: '确认提交',
		  content: `确定要提交 ${this.selectedDate} 的训练数据吗？`,
		  success: (res) => {
			if (res.confirm) {
			  uniCloud.callFunction({
				name: 'Mbody',
				data: {
				  api: 'limb_submitData',
				  uni_weights: this.weights,
				  uni_sets: this.sets,
				  uni_reps: this.reps,
				  timestamp: timestamp,
				  date: this.selectedDate // 额外保存日期字符串
				}
			  }).then(() => {
				uni.showToast({
				  title: '提交成功',
				  icon: 'success'
				});
			  }).catch(err => {
				console.error('提交失败:', err);
				uni.showToast({
				  title: '提交失败',
				  icon: 'none'
				});
			  });
			}
		  }
		});
	  },

      limb_getLastRecord() {
		if (!this.selectedDate) {
		  uni.showToast({
			title: '请先选择日期',
			icon: 'none'
		  });
		  return;
		}

		const selectedDateTime = new Date(this.selectedDate);
		selectedDateTime.setHours(12, 0, 0, 0);
		const timestamp = selectedDateTime.toISOString();

		uniCloud.callFunction({
			name: 'Mbody',
			data: {
				api: 'limb_getLastRecord',
				timestamp: timestamp,
				date: this.selectedDate
			}
		}).then(res => {
			if (res.result && res.result.data) {
				this.weights = { ...this.weights, ...res.result.data.uni_weights };
				this.sets = { ...this.sets, ...res.result.data.uni_sets };
				this.reps = { ...this.reps, ...res.result.data.uni_reps };
				
				uni.showToast({
					title: '数据加载成功',
					icon: 'success'
				});
			} else {
				uni.showToast({
					title: '该日期没有记录',
					icon: 'none'
				});
			}
		}).catch(err => {
			console.error('获取记录失败:', err);
			uni.showToast({
				title: '获取记录失败',
				icon: 'none'
			});
		});
	  },
	  onDateChange(e) {
		this.selectedDate = e.detail.value;
	  }

	}
}
</script>

<style>
  .limb-container {
	padding: 6px;
  }
   /* 设置包含输入框的单元格背景色 */
   .exercise-table td:nth-child(2),
  .exercise-table td:nth-child(3),
  .exercise-table td:nth-child(4) {
    background-color: #f5f5f5;
	font-size: 50%;
  }
  .exercise-table {
	width: 100%;
	border-collapse: collapse;
	font-size: 50%;
  }
  .exercise-table th {
	background-color: #6ea6e7;
	font-weight: bold;
  }
  .exercise-table th,
  .exercise-table td {
	border: 1px solid #ddd;
	padding: 2px;
	text-align: center;
  }
  
  /* 添加列宽控制 */
  .exercise-table th:nth-child(1) { width: 25%; }  /* 动作名称列 */
  .exercise-table th:nth-child(2) { width: 15%; }  /* 重量列 */
  .exercise-table th:nth-child(3) { width: 12%; }  /* 组数列 */
  .exercise-table th:nth-child(4) { width: 12%; }  /* 次数列 */
  .exercise-table th:nth-child(5) { width: 15%; }  /* 间隔列 */
  .exercise-table th:nth-child(6) { width: 21%; }  /* 备注列 */
  
  
 
  
  .weight-input,
  .sets-input,
  .reps-input {
	width: 80%;
	padding: 2px;
	text-align: center;
	border-radius: 3px;
	background-color: transparent;  /* 保持输入框背景透明 */
  }
  
  .button-container {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 10px;
	padding: 0 10px;
  }
  
  .date-picker {
	width: 30%;
	background-color: #f5f5f5;
	padding: 5px 10px;
	border-radius: 4px;
  }
  
  .picker-text {
	font-size: 14px;
	text-align: center;
  }
  
  .submit-button,
  .history-button {
	width: 30%;
	font-size: 14px;
  }
  
  
  
  </style>	
<template>
	<view class="trunk-container">
	  <picker mode="date" :value="selectedDate" @change="onDateChange" class="date-picker">
		<view class="picker-text">{{ selectedDate || '请选择日期' }}</view>
	  </picker>
	  <view class="calendar-container">
		<view class="calendar-header">
		  <text>{{ currentYear }}年{{ currentMonth }}月</text>
		</view>
		<view class="calendar-grid">
		  <view class="weekday" v-for="day in ['日','一','二','三','四','五','六']" :key="day">
			{{ day }}
		  </view>
		  <view 
			v-for="(day, index) in calendarDays" 
			:key="index"
			:class="['calendar-day', {
			  'has-workout': workoutDays.includes(day.date),
			  'current-month': day.currentMonth
			}]"
		  >
			{{ day.dayNumber }}
		  </view>
		</view>
	  </view>
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
		  <td colspan="2">
			<input type="text" v-model="pullUpNote" class="note-input" placeholder="次数">
		  </td>
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
		<button @click="trunk_submitData" class="submit-button">提交</button>
		<button @click="trunk_getLastRecord" class="history-button">查看数据</button>
	  </view>
	</view>
  </template>

<script>
	export default {
		name: 'Trunk',
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
		currentYear: new Date().getFullYear(),
		currentMonth: new Date().getMonth() + 1,
		calendarDays: [],
		workoutDays: [], // 存储运动记录日期
		pullUpNote: '', // 新增：用于记录引体向上的组数和次数
	  }
	},
	methods: {
        trunk_submitData() {
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
				  api: 'trunk_submitData',
				  uni_weights: this.weights,
				  uni_sets: this.sets,
				  uni_reps: this.reps,
				  timestamp: timestamp,
				  date: this.selectedDate
				}
			  }).then(() => {
				this.getMonthWorkouts(); // 提交成功后刷新日历
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

      trunk_getLastRecord() {
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
				api: 'trunk_getLastRecord',
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
	  },
	  // 获取当月运动记录
	  async getMonthWorkouts() {
		try {
		  const startDate = `${this.currentYear}-${String(this.currentMonth).padStart(2, '0')}-01`;
		  const endDate = `${this.currentYear}-${String(this.currentMonth).padStart(2, '0')}-31`;
		  
		  const res = await uniCloud.callFunction({
			name: 'Mbody',
			data: {
			  api: 'trunk_getMonthWorkouts',
			  startDate: startDate,
			  endDate: endDate
			}
		  });
		  
		  if (res.result && res.result.data) {
			this.workoutDays = res.result.data.map(item => item.date);
		  }
		} catch (err) {
		  console.error('获取月度记录失败:', err);
		}
	  },

	  // 生成日历数据
	  generateCalendar() {
		const firstDay = new Date(this.currentYear, this.currentMonth - 1, 1);
		const lastDay = new Date(this.currentYear, this.currentMonth, 0);
		const startingDay = firstDay.getDay();
		const monthLength = lastDay.getDate();
		
		let days = [];
		
		// 填充开始的空白天数
		for (let i = 0; i < startingDay; i++) {
		  days.push({
			dayNumber: '',
			date: '',
			currentMonth: false
		  });
		}
		
		// 填充当月天数
		for (let i = 1; i <= monthLength; i++) {
		  const date = `${this.currentYear}-${String(this.currentMonth).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
		  days.push({
			dayNumber: i,
			date: date,
			currentMonth: true
		  });
		}
		
		this.calendarDays = days;
	  },
	},
	onShow() {
	  this.generateCalendar();
	  this.getMonthWorkouts();
	},
	mounted() {
	  this.generateCalendar();
	  this.getMonthWorkouts();
	},
	watch: {
	  selectedDate(newDate) {
		if (newDate) {
		  const [year, month] = newDate.split('-');
		  this.currentYear = parseInt(year);
		  this.currentMonth = parseInt(month);
		  this.generateCalendar();
		  this.getMonthWorkouts();
		}
	  }
	}
}
</script>

<style>
  .trunk-container {
	padding: 6px;
  }
   /* 设置包含输入框的单元格背景色 */
   .exercise-table td:nth-child(2),
  .exercise-table td:nth-child(3),
  .exercise-table tr:nth-child(2)  :nth-child(4),
  .exercise-table tr:nth-child(4)  :nth-child(4),
  .exercise-table tr:nth-child(6)  :nth-child(4),
  .exercise-table tr:nth-child(7)  :nth-child(4),
  .exercise-table tr:nth-child(5)  :nth-child(4) {
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
  
  /* 添加日历相关样式 */
  .calendar-container {
	margin: 10px 0;
	padding: 10px;
	background: #fff;
	border-radius: 8px;
	box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .calendar-header {
	text-align: center;
	padding: 5px;
	font-size: 14px;
	font-weight: bold;
  }

  .calendar-grid {
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	gap: 2px;
  }

  .weekday {
	text-align: center;
	padding: 5px;
	font-size: 12px;
	color: #666;
  }

  .calendar-day {
	text-align: center;
	padding: 5px;
	font-size: 12px;
	height: 30px;
	line-height: 30px;
	position: relative;
	width: 30px;
	margin: auto;
  }

  .has-workout {
	background: rgba(0, 0, 0, 0.1);
	color: #222222;
	border-radius: 50%;
	aspect-ratio: 1;
	display: flex;
	align-items: center;
	justify-content: center;
  }

  .current-month {
	color: #333;
  }

  .calendar-day:not(.current-month) {
	color: #ccc;
  }
  
  
  
  </style>	
const db = uniCloud.database();

exports.main = async (event, context) => {
	//trunk
	if (event.api === 'trunk_submitData') {
		try {
			console.log('收到的数据:', event);
			const collection = db.collection('trunk');
			
			// 先检查是否已存在该日期的记录
			const existingRecord = await collection
				.where({
					timestamp: event.timestamp
				})
				.get();
			
			console.log('查询结果:', existingRecord);
			
			let res;
			if (existingRecord.data.length > 0) {
				// 如果存在记录，则更新
				res = await collection.doc(existingRecord.data[0]._id).update({
					uni_weights: event.uni_weights,
					uni_sets: event.uni_sets,
					uni_reps: event.uni_reps,
					timestamp: event.timestamp,
					date: event.date,
					updateTime: new Date().toISOString()
				});
			} else {
				// 如果不存在，则新增
				res = await collection.add({
					uni_weights: event.uni_weights,
					uni_sets: event.uni_sets,
					uni_reps: event.uni_reps,
					timestamp: event.timestamp,
					date: event.date,
					createTime: new Date().toISOString()
				});
			}
			
			console.log('操作结果:', res);
			
			return {
				success: true,
				message: existingRecord.data.length > 0 ? '数据更新成功' : '数据插入成功',
				data: res
			};
		} catch (error) {
			console.error('错误详情:', error);
			return {
				success: false,
				message: '操作失败',
				error: error.message
			};
		}
	}
	
	if (event.api === 'trunk_getLastRecord') {
		try {
			const collection = db.collection('trunk');
			const res = await collection
				.where({
					timestamp: event.timestamp
				})
				.get();
			
			return {
				success: true,
				message: res.data.length > 0 ? '获取记录成功' : '未找到记录',
				data: res.data[0] || null
			};
		} catch (error) {
			return {
				success: false,
				message: '获取记录失败',
				error: error.message
			};
		}
	}
	//limb
	if (event.api === 'limb_submitData') {
		try {
			const collection = db.collection('limb');
			
			// 先检查是否已存在该日期的记录
			const existingRecord = await collection
				.where({
					timestamp: event.timestamp
				})
				.get();
			
			let res;
			if (existingRecord.data.length > 0) {
				// 如果存在记录，则更新
				res = await collection.doc(existingRecord.data[0]._id).update({
					uni_weights: event.uni_weights,
					uni_sets: event.uni_sets,
					uni_reps: event.uni_reps,
					timestamp: event.timestamp,
					date: event.date,
					updateTime: new Date().toISOString()
				});
			} else {
				// 如果不存在，则新增
				res = await collection.add({
					uni_weights: event.uni_weights,
					uni_sets: event.uni_sets,
					uni_reps: event.uni_reps,
					timestamp: event.timestamp,
					date: event.date,
					createTime: new Date().toISOString()
				});
			}
			
			return {
				success: true,
				message: existingRecord.data.length > 0 ? '数据更新成功' : '数据插入成功',
				data: res
			};
		} catch (error) {
			return {
				success: false,
				message: '操作失败',
				error: error.message
			};
		}
	}
	
	if (event.api === 'limb_getLastRecord') {
		try {
			const collection = db.collection('limb');
			const res = await collection
				.where({
					timestamp: event.timestamp
				})
				.get();
			
			return {
				success: true,
				message: res.data.length > 0 ? '获取记录成功' : '未找到记录',
				data: res.data[0] || null
			};
		} catch (error) {
			return {
				success: false,
				message: '获取记录失败',
				error: error.message
			};
		}
	}
	
	// 添加获取月度运动记录的方法
	if (event.api === 'trunk_getMonthWorkouts') {
		try {
			const collection = db.collection('trunk');
			const res = await collection
				.where({
					date: db.command.gte(event.startDate).and(db.command.lte(event.endDate))
				})
				.field({ date: true }) // 只获取日期字段
				.get();
			
			return {
				success: true,
				message: '获取记录成功',
				data: res.data
			};
		} catch (error) {
			return {
				success: false,
				message: '获取记录失败',
				error: error.message
			};
		}
	}
	
	
	
	
};
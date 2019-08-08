const cloud = require('wx-server-sdk')

cloud.init({ env: 'roadservice-f3b4ee' })
const db = cloud.database()
const MAX_LIMIT = 100

exports.main = async (event, context) => {
  const { limit, skip, done } = event
  const wxContext = cloud.getWXContext()
  const limits = limit ? limit : 0
  const skips = skip ? skip : 0
  // const todoLists = [];
  // db.collection('todos').where({
  //   done: done  //查询数据表中的待办事项false和已完成事项true
  //   // _openid: wxContext.OPENID // 填入当前用户 openid
  // })
  //   .skip(skip)
  //   .limit(limit)
  //   // .orderBy('datetime', 'asc') // 按照datetime字段,升序排列
  //   .get()
  //   .then(res => {
  //     todoLists = res.data;
  //     return {
  //       todoLists: todoLists,
  //     }
  //   })
  //   .catch(err => {
  //     console.error(err);
  //   })

     // 先取出集合记录总数
  const countResult = await db.collection('todos').where({
    done: done  //查询数据表中的待办事项false和已完成事项true
    // _openid: wxContext.OPENID // 填入当前用户 openid
  }).count()
  const total = countResult.total
  if (total < 100) {
    return await db.collection('todos')
    .where({
      done: done, //查询数据表中的待办事项false和已完成事项true
      // _openid: wxContext.OPENID // 填入当前用户 openid
    })
    .skip(skips) // 跳过结果集中的前 10 条，从第 11 条开始返回
    .limit(limits) // 限制返回数量为 10 条
    .get()
  } else {
    // 计算需分几次取
    const batchTimes = Math.ceil(total / 100)
    // 承载所有读操作的 promise 的数组
    const tasks = []
    for (let i = 0; i < batchTimes; i++) {
      const promise = db.collection('todos').where({
        done: done
        // _openid: wxContext.OPENID // 填入当前用户 openid
      }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
      tasks.push(promise)
    }
    // 等待所有
    return (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data),
        errMsg: acc.errMsg,
      }
    })
  }
}
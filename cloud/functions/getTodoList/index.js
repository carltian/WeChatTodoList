const cloud = require('wx-server-sdk')

cloud.init({ env: 'roadservice-f3b4ee' })
const db = cloud.database()

exports.main = async (event, context) => {
    const { limit, skip, done } = event
    const wxContext = cloud.getWXContext()
    const todoLists = [];
    db.collection('todos').where({
        done: done  //查询数据表中的待办事项false和已完成事项true
        // _openid: wxContext.OPENID // 填入当前用户 openid
    })
    .skip(skip)
    .limit(limit)
    // .orderBy('datetime', 'asc') // 按照datetime字段,升序排列
    .get()
    .then (res => {
        todoLists = res.data;
        return {
            todoLists: todoLists,
        }
    })
    .catch(err => {
        console.error(err);
    })
}
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'roadservice-f3b4ee' })
const db = cloud.database()

exports.main = async (event, context) => {
  const { _id } = event;
  return await db.collection('todos').where({
    _id: _id // 填入当前用户 openid
  }).get()
}
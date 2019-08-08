const cloud = require('wx-server-sdk')

cloud.init({ env: 'roadservice-f3b4ee' })
const db = cloud.database()

exports.main = async (event, context) => {
  const { content, dateTime, name } = event;
  const wxContext = cloud.getWXContext();
  // const todoLists = [];
  // const addDB = db.collection('todos');
  // addDB.add({
  //   data: {
  //     content: content,
  //     dateTime: dateTime,
  //     name: name,
  //     done: false,
  //     _openid: wxContext.OPENID // 填入当前用户 openid
  //   }
  // })
  //   .then(res => {
  //     return res;
  //   })
  try {
    return await db.collection('todos').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        content: content,
        dateTime: dateTime,
        name: name,
        done: false,
        _openid: wxContext.OPENID // 填入当前用户 openid
      }
    })
  } catch(e) {
    console.error(e)
  }
}
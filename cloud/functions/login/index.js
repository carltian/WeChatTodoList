const cloud = require('wx-server-sdk')

cloud.init({ env: 'roadservice-f3b4ee' })
const db = cloud.database()

exports.main = async () => {
  const wxContext = cloud.getWXContext()

  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}
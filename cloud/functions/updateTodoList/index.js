const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({ env: 'roadservice-f3b4ee'})

exports.main = async (event, context) => {
    const { content, done } = event
    const wxContext = cloud.getWXContext()
    db.collection('todos').doc(content).update({
        data: {
            done: done,
        }
        // _openid: wxContext.OPENID // 填入当前用户 openid
    })
    .then (res => {
        return res.data
    })
    .catch(err => {
        console.error(err);
    })
}
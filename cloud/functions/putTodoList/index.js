const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({ env: 'roadservice-f3b4ee'})

exports.main = async (event, context) => {
    const { content, dateTime, name } = event;
    const wxContext = cloud.getWXContext();
    const todoLists = [];
    const addDB = db.collection('todos');
    addDB.add({
        data: {
            content: content,
            dateTime: dateTime,
            name: name,
            done: false,
            _openid: wxContext.OPENID // 填入当前用户 openid
        }
    })
    .then(res => {
        return res;
    })   
}
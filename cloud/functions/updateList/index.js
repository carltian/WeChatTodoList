const cloud = require('wx-server-sdk')

cloud.init({ env: 'roadservice-f3b4ee' })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { content, done, _id, doneTime } = event
  const wxContext = cloud.getWXContext()
  if (doneTime) {
    try {
      return await db.collection('todos').where({
        _id: _id
      })
      .update({
        data: {
          done: _.set(done),
          content: _.set(content),
          doneTime: _.set(doneTime),
        },
      })
    } catch(e) {
      console.error(e)
    }
  } else {
    try {
      return await db.collection('todos').where({
        _id: _id
      })
      .update({
        data: {
          done: _.set(done),
          content: _.set(content)
        },
      })
    } catch(e) {
      console.error(e)
    }
  }
}
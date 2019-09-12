import Taro, { Component } from '@tarojs/taro'
import Login from './pages/login'

import './app.less'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }
class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/doneList/index',
      'pages/todoList/index',
      'pages/login/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
    },
    tabBar: {
      // "color":"#666666",
      "selectedColor":"#f68d91",
      list: [
        {
          pagePath: 'pages/todoList/index',
          text: 'Todo',
          selectedIconPath: 'icons/todoselect.png',
          iconPath: 'icons/todo.png',
        },
        {
          pagePath: 'pages/index/index',
          text: 'Home',
          selectedIconPath: 'icons/homeselect.png',
          iconPath: 'icons/home.png',
        },
        {
          pagePath: 'pages/doneList/index',
          text: 'Done',
          selectedIconPath: 'icons/doneselect.png',
          iconPath: 'icons/done.png',
        },
      ]
    },
    cloud: true,
  }

  componentDidMount () {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init()
    }
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Login />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))

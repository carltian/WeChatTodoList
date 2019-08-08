import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Login from "../../components/login"
import './index.less'

export default class Index extends Component {

  config = {
    navigationBarTitleText: 'Rui❤Tian'
  }

  componentWillMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }


  render () {
    return (
      <View className='login'>
        <View className='btn1'>Rui ❤ Tian</View>
        <View className='btn2'>心愿清单</View>
         <Login />
    </View>
    )
  }
}

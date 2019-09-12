import Taro, { Component } from "@tarojs/taro"
import { View, Button } from "@tarojs/components"
import './index.less'

class Login extends Component {
  state = {
    context: {}
  }

  componentDidMount(){
    try {
      const value = Taro.getStorageSync('userInfo')
      if (value) {
        Taro.switchTab({
          url: '../../pages/index/index'
        })
      }
    } catch (e) {
      console.log(e);
    }
    
  }

  getLogin = () => {
    Taro.cloud
      .callFunction({
        name: "login",
        data: {}
      })
      .then(res => {
        this.setState({
          context: res.result
        })
      })
  }
  tobegin = () => {
    Taro.getSetting()
      .then(res=>{
        if(res.authSetting["scope.userInfo"]){
          Taro.setStorage({
            key: 'userInfo',
            data: res.authSetting["scope.userInfo"]
          })
          Taro.switchTab({
                url: '../../pages/index/index'
              })
          // return true;
        }else {
          throw new Error('没有授权')
        }
      })
      .then(()=>{
        return Taro.getUserInfo();
      })
      .catch(err=>{
        console.log(err)
      })
  };

  toIndexPage = () => {
    Taro.switchTab({
      url: '../../pages/index/index'
    })
  }

  render() {
    const { context } = this.state;
    console.log(context);
    return (
      <View className='index'>
        <Button className='btn' style='top: 150px' openType='getUserInfo' onGetUserInfo={this.tobegin} type='primary' lang='zh_CN'>
            微信授权
        </Button>
        <Button className='btn' style='top: 300px' onClick={this.toIndexPage} type='default' lang='zh_CN'>
            暂不授权
        </Button>
      </View>
    )
  }
}
export default Login;
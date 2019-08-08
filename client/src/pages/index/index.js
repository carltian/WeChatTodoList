import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import './index.less'
import imagefirstsrc from "../../images/1.jpg"
// import Login from '../../components/login'

export default class Index extends Component {

  state = {
    firstTime: '2019年05月11日 12:00:00',
    resultTime: undefined,
    h: undefined,
    m: undefined,
    s: undefined,
    lastTimey: undefined,
    lastTimemon: undefined,
    lastTimed: undefined,
    lastTimeh: undefined,
    lastTimem: undefined,
    lastTimes: undefined,
  }
  config = {
    navigationBarTitleText: 'Rui❤Tian'
  }

  componentWillMount () { }

  componentDidMount () {
    setInterval(() => {
      const t1 = new Date("2019/05/11 12:00:00");
      const t2 = new Date();
      const t = new Date(t2 - t1 + 16 * 3600 * 1000);
      const timestamp = Date.parse(new Date());

      //获取当前时间  
      const n = timestamp;
      const date = new Date(n);
      //年  
      const Year = date.getFullYear();
      //月  
      const Month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      //日  
      const Day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      //时  
      const hour = date.getHours();
      //分  
      const month = date.getMinutes();
      //秒  
      const sec = date.getSeconds();
      this.setState({
        resultTime: parseInt(t.getTime() / 1000 / 3600 / 24),
        h: t.getHours(),
        m: t.getMinutes(),
        s: t.getSeconds(),
        lastTimey: Year,
        lastTimemon: Month,
        lastTimed: Day,
        lastTimeh: hour,
        lastTimem: month,
        lastTimes: sec,
      })
    }, 1000)
   }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }


  render () {
    const {
      firstTime,
      resultTime,
      h,
      m,
      s,
      lastTimey,
      lastTimemon,
      lastTimed,
      lastTimeh,
      lastTimem,
      lastTimes,
    } = this.state;
    return (
      <View className='index'>
          <View>
            <View className='userLogin'>Rui<Text style='color: red'> ❤ </Text>Tian</View>
            <View className='imageDiv'><Image style='width:750rpx; height: 680rpx' src={imagefirstsrc}></Image></View>
            
            <View>
              <View>
                <View>
                  <View className='userlabel'>今日时间</View>
                </View>
                <View>
                  <View className='timelabel'>
                  { lastTimey }年{ lastTimemon }月{ lastTimed }日{ lastTimeh }:{ lastTimem }:{ lastTimes }
                  </View>
                </View>
              </View>
              <View>
                <View>
                  <View className='userlabel'>我们相识</View>
                </View>
                <View className='timelabel'>
                  { firstTime }
                </View>
              </View>
              <View>
                <View>
                  <View className='userlabel'>我们相爱</View>
                </View>
                <View className='timelabel'>
                  { resultTime }天{ h }小时{ m }分钟{ s }秒
        </View>
              </View>
            </View>
          </View>
    </View>
    )
  }
}

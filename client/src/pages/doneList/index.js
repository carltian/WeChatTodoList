import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { AtModal } from "taro-ui"
import './index.less'
import './index.scss'

export default class index extends Component {
    config = {
        navigationBarTitleText: 'Rui❤Tian',
        enablePullDownRefresh: true // 开启下拉刷新功能
      }
    state = {
        // todoList: 'hello let us do it !!',
        tableList: [],
        addShow: false,
        nickName: '',
        boyName: 'Charon',
        girlName: 'Pluto',
        listContent: '',
        creatDateTime: '',
        doneDateTime: '',
        listName: '',
        listId: '',
    }
    componentDidMount () {
        Taro.getUserInfo()
            .then(res=>{
                if(res.userInfo) {
                    this.setState({
                        nickName: res.userInfo.nickName,
                    });
                } else {
                    throw new Error('没有用户信息')
                }
            })
            .catch(() => {
                Taro.redirectTo({
                    url: '../login/index'
                })
            });
        this.getTodoList(true);
    }

    cancel = () => {
        this.setState({ addShow: false });
    }

    onPullDownRefresh() {
        // 下拉刷新
        this.getTodoList(true);
        // 处理完成后，终止下拉刷新
      }

    getSingleContent = (id) => {
        Taro.cloud.callFunction({
            // 要调用的云函数名称
            name: 'getListById',
            // 传递给云函数的event参数
            data: {
                _id: id,
            }
        }).then(res => {
            const { data } = res.result;
            const r = data[0];
            this.setState({
                listId: r._id,
                listContent: r.content,
                creatDateTime: r.dateTime,
                doneDateTime: r.doneTime,
                listName: r.name,
                addShow: !this.state.addShow
            }); 
            console.log('查询单个内容', res);
        }).catch(err => {
            Taro.showToast({
                title: `查询失败,${err.errCode}`,
                icon: "none"
                })
        })         
    }

    // formReset = e => {
    // console.log(e)
    // }
    getTodoList = (done) => {
        Taro.showNavigationBarLoading();
        Taro.cloud.callFunction({
            // 要调用的云函数名称
            name: 'getList',
            // 传递给云函数的event参数
            data: {
                done: done,
                // limit: 10,
                // skip: 10
            }
        }).then(res => {
            const { data } = res.result;
            this.setState({
                tableList: data,
            });
            Taro.hideNavigationBarLoading();
            Taro.stopPullDownRefresh();
            console.log('查询', res);
        }).catch(err => {
            console.log(err);
        }) 
    }
    getTodayTime = () => {
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
        return `${Year}-${Month}-${Day}`;
    }

    clickList = (id) => {
        const { nickName, boyName, girlName } = this.state;
        if (nickName === boyName || nickName === girlName) {
            this.getSingleContent(id);
        } else {
            Taro.showToast({
                title: '抱歉,仅Rui有查看权限',
                icon: "none"
            })
        }
    } 

    render () {
        const {
            listContent,
            creatDateTime,
            doneDateTime,
            listName,
            tableList,
            nickName,
            addShow } = this.state;
        console.log(nickName);
        const scrollStyle = {
            height: 'auto',
          };
        const scrollTop = 0;
        const Threshold = 20;
        const target = `❤❤❤\n${listContent}\n❤❤❤\n创建日期:${ creatDateTime }\n完成日期: ${ doneDateTime }\n记录人: ${ listName }\n完成情况: 已完成\n❤❤❤`;
        const winHeight = tableList.length * 100 + 30;
        return (
            <View>
            <View class='date'>
                <View>完成小❤愿({tableList.length})</View>
                <View style='padding-left:110rpx;'>记录人</View>
            </View>
            <ScrollView
              className='scrollview'
              scrollY
              scrollWithAnimation
              scrollTop={scrollTop}
              style={scrollStyle}
              lowerThreshold={Threshold}
              upperThreshold={Threshold}
            >
                <View class='listPage'>
                {
                tableList.map((item) => {
                    return (
                    <View key={item._id} class='content' style={{ 'height': {winHeight} }} onClick={() => {this.clickList(item._id)}}>
                         <View class='bg'>
                            <View class='item'>
                                <View class='listContent'>
                                    {item.content}
                                    <View class='listTime'>{item.dateTime}</View>
                                </View>
                                <View class='listName'>{item.name}</View>
                            </View>
                        </View>
                        <View class='hr'></View>
                    </View>)
                })
                }
                </View>
            </ScrollView>
            {
                 addShow && (
                         <AtModal
                           isOpened
                           cancelText='返回'
                           onClose={this.cancel}
                           onCancel={this.cancel}
                           content={target}
                         />
                )               
            }
            </View>
        )
    }
}
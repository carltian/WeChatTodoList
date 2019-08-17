import Taro, { Component } from '@tarojs/taro'
import { View, Button, Form, Textarea, ScrollView } from '@tarojs/components'
import './index.less'

export default class index extends Component {
    config = {
        navigationBarTitleText: 'Rui❤Tian TodoList',
        enablePullDownRefresh: true
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
            });
        this.getTodeList(true);
    }

    cancel = () => {
        this.setState({ addShow: false });
    }

    onPullDownRefresh() {
        // 下拉刷新
        this.getTodeList(true);
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
    getTodeList = (done) => {
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
        this.getSingleContent(id);
        const { nickName, boyName, girlName } = this.state;
        if (nickName === boyName || nickName === girlName) {
            setTimeout(() => {
                this.setState({
                    addShow: !this.state.addShow
                }), 500
            });
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
            height: 'auto'
          }
        const scrollTop = 0
        const Threshold = 20
        const target = `❤❤❤\n${listContent}\n❤❤❤\n创建日期:${ creatDateTime }\n完成日期: ${ doneDateTime }\n记录人: ${ listName }\n完成情况: 👍已完成👍\n❤❤❤`;
        const winHeight = tableList.length * 100 + 30;
        return (
            <View>
            <View class='date'>
                {/* <View>完成日期</View> */}
                <View>完成小❤愿({tableList.length})</View>
                <View style='padding-left:110rpx;'>记录人</View>
            </View>
            {/* <View> */}
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
                                    <View class='listTime'>{item.dateTime}👍</View>
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
                        <Form className='addContent'>
                            <View className='textArea'>
                                <Textarea
                                  disabled
                                  style='background:#fff;width:auto;min-height:80px;padding:0 30rpx;border-radius:15rpx;border:1rpx solid rgb(0, 0, 0);'
                                  autoHeight
                                  fixed
                                  maxlength={-1}
                                  value={target}
                                />
                            </View>
                            {/* <View className='btnArea'> */}
                                <Button
                                  onClick={this.cancel}
                                  plain style='position:absolute;bottom:5%;left:20%;width:300rpx;'
                                >
                                返回
                                </Button>
                            {/* </View> */}
                        </Form>
                )               
            }
            </View>
        )
    }
}
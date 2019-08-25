import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Form, Textarea, Radio, RadioGroup, ScrollView } from '@tarojs/components'
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
        showContent: false,
        listContent: '',
        listDateTime: '',
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
        this.getTodeList(false);
    }

    add = () => {
        const { nickName, boyName, girlName } = this.state;
        if (nickName === boyName || nickName === girlName) {
        this.setState({ addShow: true });
        } else {
            Taro.showToast({
                title: '抱歉,仅Rui有添加权限',
                icon: "none"
            })
        } 
    }

    cancel = () => {
        this.setState({ addShow: false });
    }

    onPullDownRefresh() {
        // 下拉刷新
        this.getTodeList(false)
        // 处理完成后，终止下拉刷新
        
    }

    formSubmit = e => {
        console.log(e.detail.value.content);
        const { detail } = e;
        const { value  } = detail;
        const { content, name } = value
        if (content.replace(/(^\s*)|(\s*$)/g, "")=="" || content === '') {
            Taro.showToast({
                title: '❤请将心愿填写完整哟❤',
                icon: "none"
                })
        } else {
            const dateTime = this.getTodayTime();
            Taro.cloud.callFunction({
                // 要调用的云函数名称
                name: 'addTodoList',
                // 传递给云函数的event参数
                data: {
                    name: name,
                    content: content,
                    dateTime: dateTime,
                }
            }).then(res => {
                Taro.showToast({
                    title: `保存成功`,
                    icon: "success"
                    })
                this.setState({ addShow: false });
                this.getTodeList(false);
                console.log('添加', res);
            }).catch(err => {
                Taro.showToast({
                    title: `保存失败,${err.errCode}`,
                    icon: "none"
                    })
                console.log(err);
            })                
        }
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
                listDateTime: r.dateTime,
                listName: r.name,
                showContent: !this.state.showContent
            }); 
            console.log('查询单个内容', res);
        }).catch(err => {
            Taro.showToast({
                title: `查询失败,${err.errCode}`,
                icon: "none"
                })
        })         
    }

    contentSubmit = e => {
        const { detail } = e;
        const { value  } = detail;
        const { hasDone, content } = value;
        const { listId } = this.state;
        const doneTime = this.getTodayTime();
        if (content.replace(/(^\s*)|(\s*$)/g, "")=="" || content === '') {
            Taro.showToast({
                title: '❤请将心愿补充完整哟❤',
                icon: "none"
                })
        } else { 
            if (hasDone === '1') {
                Taro.cloud.callFunction({
                    // 要调用的云函数名称
                    name: 'updateList',
                    // 传递给云函数的event参数
                    data: {
                        _id: listId,
                        content: content,
                        done: true,
                        doneTime: doneTime,
                    }
                })
                .then((res) =>{
                    this.getTodeList(false);
                    console.log(res);
                })
                .then(() => {
                    Taro.showToast({
                        title: `修改成功`,
                        icon: "success"
                        })
                    this.setState({ showContent: false });
                }).catch(err => {
                    Taro.showToast({
                        title: `保存失败,${err.errCode}`,
                        icon: "none"
                        })
                    console.log(err);
                })                
            } else {
                Taro.cloud.callFunction({
                    // 要调用的云函数名称
                    name: 'updateList',
                    // 传递给云函数的event参数
                    data: {
                        _id: listId,
                        content: content,
                        done: false,
                    }
                }).then(res => {
                    Taro.showToast({
                        title: `修改成功`,
                        icon: "success"
                        })
                    this.getTodeList(false);
                    this.setState({ showContent: false });
                    console.log(res);
                }).catch(err => {
                    Taro.showToast({
                        title: `保存失败,${err.errCode}`,
                        icon: "none"
                        })
                    console.log(err);
                })      
            }
        }
    }
    // formReset = e => {
    // console.log(e)
    // }
    listCancel = () => {
        this.setState({
            showContent: false,
        });
    }
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
            listDateTime,
            listName,
            tableList,
            addShow,
            nickName,
            showContent } = this.state;
        console.log(nickName);
        const scrollStyle = {
            height: 'auto'
          }
        const scrollTop = 0
        const Threshold = 20
        const winHeight = tableList.length * 100 + 30;
        return (
            <View>
            <View class='date'>
                <View>小❤愿({tableList.length})</View>
                <View style='padding-left:220rpx;'>记录人</View>
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
                                    <View class='listTime'>{item.dateTime}❤</View>
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
            <Button className='addButton' onClick={this.add}><Text style={{ color: 'white' }}>+</Text></Button>
            {
                addShow && (
                        <Form onSubmit={this.formSubmit} className='addContent'>
                            <View className='textArea'>
                                <Textarea
                                  name='content'
                                  style='background:#fff;width:100%;min-height:80px;padding:0 30rpx;border-radius:15rpx;border:1rpx solid rgb(0, 0, 0);'
                                  autoHeight
                                  placeholder='❤请输入小心愿内容❤'
                                  autoFocus
                                  fixed
                                />
                            </View>
                            <View className='dateArea'>
                                <Text>日期: {this.getTodayTime()}</Text>
                            </View>
                            <View className='nameArea'>
                                <RadioGroup name='name'>
                                    <Text>记录人: </Text>
                                    <Radio value='Rui' checked>Rui</Radio>
                                    <Radio style='margin-left: 20rpx' value='Tian'>Tian</Radio>
                                </RadioGroup>
                            </View>
                            <View className='btnArea'>
                                <Button form-type='submit' type='primary'>确定</Button>
                                <Button onClick={this.cancel} plain style='margin-left:10rpx;'>取消</Button>
                            </View>
                        </Form>
                )               
            }
            {
                showContent && (
                        <Form onSubmit={this.contentSubmit} className='addContent' style='height:600rpx'>
                            <View className='textArea' style='left:8%'>
                                <Textarea
                                  name='content'
                                  style='background:#fff;width:auto;min-height:80px;padding:0 30rpx;border-radius:15rpx;border:1rpx solid rgb(0, 0, 0);'
                                  autoHeight
                                  fixed
                                  value={listContent}
                                />
                            </View>
                            <View className='dateArea' style='left:8%'>
                                <Text>日期: { listDateTime }</Text>
                            </View>
                            <View className='dateArea' style='left:8%'>
                                    <Text>记录人: { listName }</Text>
                            </View>
                            <View className='nameArea' style='left:8%'>
                                <RadioGroup name='hasDone'>
                                    <Text>完成情况: </Text>
                                    <Radio value={0} checked>未完成</Radio>
                                    <Radio style='margin-left: 20rpx' value={1}>已完成</Radio>
                                </RadioGroup>
                            </View>
                            <View className='btnArea' style='left:8%'>
                                <Button form-type='submit' type='primary'>确定</Button>
                                <Button onClick={this.listCancel} plain style='margin-left:10rpx;'>返回</Button>
                            </View>
                        </Form>
                )               
            }
            </View>
        )
    }
}
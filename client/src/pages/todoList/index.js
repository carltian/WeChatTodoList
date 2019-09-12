import Taro, { Component } from '@tarojs/taro'
import { View, Text, Radio, RadioGroup, ScrollView } from '@tarojs/components'
import { AtForm, AtButton, AtTextarea, AtModal, AtModalContent, AtFab } from 'taro-ui'
import './index.less'
import './index.scss'

export default class index extends Component {
    config = {
        navigationBarTitleText: 'Rui❤Tian',
        enablePullDownRefresh: true
      }
    state = {
        /**
         * 使用表单组件时请注意！！！！！坑！！！
         * 携带 form 中的数据触发 submit 事件，由于小程序组件化的限制，
         * onSubmit 事件获得的 event 中的 event.detail.value 始终为空对象，
         * 开发者要获取数据，可以自行在页面的 state 中获取
         * 
         */
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
        content: '', // 表单内容
        staticName: 'Rui', // 表单提交人,给个默认值
        staticHasDone: '0', // 表单中的任务完成情况
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
        this.getTodoList(false);
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
        this.getTodoList(false)
        // 处理完成后，终止下拉刷新
        
    }

    formSubmit = e => {
        e.preventDefault();
        // const { detail } = e;
        // const { value  } = detail;
        // const { content, name } = value
        const { content, staticName } = this.state;
        const name = staticName;
        this.setState({
            staticName: 'Rui',
        });
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
                this.getTodoList(false);
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
        e.preventDefault();
        // const { detail } = e;
        // const { value  } = detail;
        const { staticHasDone, content } = this.state;
        const hasDone = staticHasDone;
        this.setState({
            staticHasDone: '0',
        });
        const { listId } = this.state;
        const doneTime = this.getTodayTime();
        if (content.replace(/(^\s*)|(\s*$)/g, "")=="" || content === '') {
            Taro.showToast({
                title: '❤您并没有修改任何设置哟❤',
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
                    this.getTodoList(false);
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
                    this.getTodoList(false);
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
    handleChangeContent = (event) => {
        this.setState({
          content: event.target.value,
        });
    }

    handleChangeName = (event) => {
        this.setState({
            staticName: event.target.value,
        });
    }

    handleChangeDone = (event) => {
        this.setState({
            staticHasDone: event.target.value,
        });
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
            <View className='addButton'>
                <AtFab onClick={this.add} size='small' style='background-color: #f68d91;'>
                    {/* <Text style={{ color: 'white' }}>+</Text> */}
                    <Text className='at-fab__icon at-icon at-icon-add'></Text>
                </AtFab>
            </View>
            {
                addShow && (
                    <AtModal
                      isOpened
                      closeOnClickOverlay={false}
                    >
                        <AtModalContent>
                            <AtForm
                              onSubmit={this.formSubmit}
                            >
                                <AtTextarea
                                  name='content'
                                  placeholder='❤请输入小心愿内容❤'
                                  autoFocus
                                  count={false}
                                  onChange={this.handleChangeContent}
                                  onFocus={this.handleChangeContent}
                                />
                                <View className='dateArea'>
                                    <Text>日期: {this.getTodayTime()}</Text>
                                </View>
                                <View className='nameArea'>
                                    <RadioGroup name='name' onChange={this.handleChangeName}>
                                        <Text>记录人: </Text>
                                        <Radio value='Rui' checked>Rui</Radio>
                                        <Radio style='margin-left: 20rpx' value='Tian'>Tian</Radio>
                                    </RadioGroup>
                                </View>
                                <View style='text-align: center;'>
                                    <View style='display: inline-block;'>
                                        <AtButton type='secondary' size='normal'  onClick={this.cancel}>取消</AtButton >
                                    </View>
                                    <View style='display: inline-block;margin-left: 20%;'>
                                        <AtButton type='primary' size='normal'  formType='submit'>提交</AtButton >
                                    </View>
                                </View>
                            </AtForm>
                        </AtModalContent>
                    </AtModal>
                )
            }

            {
                showContent && (
                    <AtModal
                      isOpened
                      closeOnClickOverlay={false}
                    >
                      <AtModalContent>
                          <AtForm
                            onSubmit={this.contentSubmit}
                          >
                              <AtTextarea
                                name='content'
                                placeholder='❤请输入小心愿内容❤'
                                autoFocus
                                count={false}
                                onChange={this.handleChangeContent}
                                onFocus={this.handleChangeContent}
                                value={listContent}
                              />
                              <View className='dateArea'>
                                  <Text>日期: { listDateTime }</Text>
                              </View>
                              <View className='nameArea'>
                                <Text>记录人: { listName }</Text>
                              </View>
                              <View className='nameArea'>
                                <RadioGroup name='hasDone' onChange={this.handleChangeDone}>
                                    <Text>完成情况: </Text>
                                    <Radio value={0} checked>未完成</Radio>
                                    <Radio style='margin-left: 20rpx' value={1}>已完成</Radio>
                                </RadioGroup>
                            </View>
                              <View style='text-align: center;'>
                                  <View style='display: inline-block;'>
                                      <AtButton type='secondary' size='normal' onClick={this.listCancel}>返回</AtButton >
                                  </View>
                                  <View style='display: inline-block;margin-left: 20%;'>
                                      <AtButton type='primary' size='normal' formType='submit'>修改</AtButton >
                                  </View>
                              </View>
                          </AtForm>
                      </AtModalContent>
                  </AtModal>
                )               
            }
            </View>
        )
    }
}
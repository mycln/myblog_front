<style lang="less">
    @import "./menu.less";
</style>
<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
</style>
<template>
    <div class="layout">
        <Layout>
            <div ref="content">
                <Card title="菜单管理" style="width:100%;height:100%">
                    <Content>
                        <Row>
                            <Col span="8">
                                <div ref="left">
                                    <Card title="菜单" style="width:90%;height:90%;margin-left:10%;max-height:auto;overflow:auto;">
                                        <p slot="title">
                                            <Icon type="ios-apps-outline" />
                                            菜单树
                                        </p>
                                        <template >
                                            <div  @click="clickHandler">
                                            <Tree :data="data5"  :render="renderContent" ref="reference"></Tree>
                                            </div>
                                        </template>
                                    </Card>
                            </div>
                            </Col>
                                <Col span="16">
                                <div ref="right">
                                    <Card  style="width:90%;margin-left:5%;height:90%;max-height:auto;overflow:auto;">
                                        <p slot="title">
                                        <Icon type="ios-menu" />
                                            {{cardTitle}}
                                        </p>
                                            <Card dis-hover :bordered="false" class="my_card">
                                                <Form :rules="addMenuRules" :model="addMenu" ref="addMenu">
                                                        <Row>
                                                            <i-col span="22">
                                                                <Form-item label="类型" :label-width="100" >
                                                                    <RadioGroup v-model="addMenu.ismenu">
                                                                        <Radio label="1">
                                                                            <span>菜单</span>
                                                                        </Radio>
                                                                        <Radio label="0">
                                                                            <span>按钮</span>
                                                                        </Radio>
                                                                    </RadioGroup>
                                                                </Form-item>
                                                            </i-col>
                                                            <i-col span="22">
                                                                <div v-show="addMenu.ismenu==1?true:false">
                                                                    <Form-item label="菜单名称:" :label-width="100" prop="menuName">
                                                                        <Input type="text"  class="text-input" v-model.trim="addMenu.menuName"  placeholder="请输入菜单名称(1-20个字)" :maxlength="20"/>
                                                                    </Form-item>
                                                                </div>
                                                                <div v-show="addMenu.ismenu==0?true:false">
                                                                        <Form-item label="按钮名称:" :label-width="100" prop="menuName">
                                                                            <Input type="text"  class="text-input" v-model.trim="addMenu.menuName"  placeholder="请输入按钮名称(1-20个字)" :maxlength="20"/>
                                                                        </Form-item>
                                                                </div>
                                                            </i-col>
                                                            <i-col span="22">
                                                                <div v-show="addMenu.ismenu==1?true:false">
                                                                    <Form-item label="菜单PATH:" :label-width="100" prop="code">
                                                                            <Input type="text"  class="text-input" v-model.trim="addMenu.code"  placeholder="请输入菜单Path(例如:/sys)" :maxlength="20"/>
                                                                    </Form-item>
                                                                </div>
                                                              <div v-show="addMenu.ismenu==0?true:false">
                                                                    <Form-item label="按钮规则:" :label-width="100" prop="code">
                                                                            <Input type="text"  class="text-input" v-model.trim="addMenu.code"  placeholder="输入按钮规则 (例如:user:list)" :maxlength="20"/>
                                                                    </Form-item>
                                                              </div>
                                                            </i-col>
                                                            <i-col span="22">
                                                                <div v-show="addMenu.ismenu==1?true:false">
                                                                    <Form-item label="菜单ICON:" :label-width="100" prop="menuIcon">
                                                                      <Input type="text" style="margin-right: 10px;" class="text-input"  v-model.trim="addMenu.menuIcon"  placeholder="请输入菜单ICON(例如:ios-settings)" :maxlength="20"/>
                                                                      <Poptip trigger="hover" placement="top-start"  word-wrap>
                                                                          <Icon type="md-help" size="20"  style="color:red" />
                                                                          <p slot="content">
                                                                          <a href='https://www.iviewui.com/components/icon' target="_Blank">点击前往选择icon</a>
                                                                          </p>
                                                                      </Poptip>
                                                                    </Form-item>
                                                                </div>
                                                            </i-col>
                                                            <i-col span="22">
                                                                <div v-show="addMenu.ismenu==1?true:false">
                                                                    <Form-item label="菜单路径:" :label-width="100" prop="menuUrl">
                                                                            <Input type="text"  class="text-input" v-model.trim="addMenu.menuUrl"  placeholder="请输入菜单在项目中的路径(例如:sysLogs/logs) " :maxlength="50"/>
                                                                    </Form-item>
                                                                </div>
                                                            </i-col>
                                                            <i-col span="22">
                                                                <div v-show="addMenu.ismenu==1?true:false">
                                                                    <Form-item label="菜单排序:" :label-width="100" prop="sort">
                                                                            <InputNumber class="text-input" :max="99" :min="0" v-model="addMenu.sort"></InputNumber>
                                                                    </Form-item>
                                                                </div>
                                                            </i-col>
                                                            <!-- <i-col span="22">
                                                                <Form-item label="菜单等级:" :label-width="100" prop="levels">
                                                                    <Select v-model.trim="addMenu.levels" class="text-select">
                                                                            <Option v-for="item in levelArray"  :value="item.value" :key="item.value">{{ item.label }}</Option>
                                                                    </Select>
                                                                </Form-item>
                                                            </i-col> -->
                                                            <i-col span="22">
                                                                <div v-show="addMenu.ismenu==1?true:false">
                                                                    <Form-item label="菜单描述:" :label-width="100"  prop="menuDesc">
                                                                      <Input  type="textarea" v-model.trim="addMenu.menuDesc" :rows="4" placeholder="请输入菜单描述(0-100个字)" :maxlength="100"/>
                                                                    </Form-item>
                                                                </div>
                                                            </i-col>
                                                        </Row>
                                                </Form>
                                                <div>
                                                <template v-if="addMenu.id">
                                                    <Button type="success"  @click="updateSubmit"  long>修改</Button>
                                                </template>
                                                <template v-else>
                                                    <Button type="primary"  @click="addMenuSubmit"  long>添加</Button>
                                                </template>
                                            </div>
                                            </Card>
                                    </Card>
                               </div>
                                </Col>
                        </Row>
                    </Content>
                </Card>
            </div>
        </Layout>

    </div>
    </template>
<script>
export default {
  name: 'sysLogs',
  data () {
    return {
      cardTitle: '修改数据',
      model: {
        addMenu: {
          show: false
        }
      },
      addData: {},
      levelArray: [
        {value: 1, label: '一级菜单'},
        {value: 2, label: '二级菜单'}
      ],
      addMenu: {
        menuIcon: '',
        menuName: '',
        menuUrl: '',
        code: '',
        pid: '',
        pids: '',
        ismenu: "1",
        menuDesc: '',
        levels: 1,
        id: '',
        sort: 0
      },
      addMenuRules: {
        menuIcon: [
          { required: true, validator: this.menuIconValidator, trigger: 'change' }
        ],
        menuName: [
          { required: true, message: '名称不能为空', trigger: 'change' }
        ],
        menuUrl: [
          { required: true, message: '菜单页面路径不能为空', trigger: 'change' }
        ],
        code: [
          { required: true, message: '输入内容不能为空', trigger: 'change' }
        ],
        levels: [
          { required: true, message: '菜单等级不能为空', trigger: 'change', type: 'number'}
        ],
        sort: [
          { required: true, message: '菜单序号不能为空', trigger: 'blur', type: 'number'}
        ]
      },
      clientHeight: '', // 右侧区域的card 铺满整个屏幕
      // 树结构数据 start
      data5: [],
      buttonProps: {
        type: 'default',
        size: 'small'
      }
      // 树结构数据 end
    }
  },
  computed: {

  },
  mounted () {
    this.getAllTreeData(true)
    this.clientHeight = `${document.documentElement.clientHeight}`
  },
  watch: {
    // 如果 `clientHeight ` 发生改变，这个函数就会运行
    clientHeight: function () {
      this.changeFixed(this.clientHeight)
    }
  },
  activated () {

  },
  methods: {
    menuIconValidator(rule, value, callback){
        let addMenu =  this.addMenu;
        value = addMenu.menuIcon
        if (value === '') {
           callback(new Error('菜单icon 不能为空'));
         }else{
            callback();
         };
    },
    clickHandler () {
      // console.log(this.$refs.reference)
    },
    /**
     * @description 获取左侧所有树的节点
     */
    getAllTreeData (noFirst) {
      this.$axios.get(this.$GLOBAL.S0108).then(res => {
        if (res.data.code == 0) {
          this.data5 = []
          let content = res.data.content
          // 找到根节点push进去
          this.data5.push({
            title: '系统菜单管理',
            expand: true,
            id: 0,
            render: (h, { root, node, data }) => {
              return h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%'
                }
              }, [
                h('span', [
                  h('Icon', {
                    props: {
                      type: 'ios-settings'
                    },
                    style: {
                      marginRight: '8px'
                    }
                  }),
                  h('span', data.title)
                ]),
                h('span', {
                  style: {
                    display: 'inline-block',
                    float: 'right',
                    marginRight: '32px'
                  }
                }, [
                  h('Button', {
                    props: Object.assign({}, this.buttonProps, {
                      icon: 'ios-add',
                      type: 'primary'
                    }),
                    style: {
                      width: '64px'
                    },
                    on: {
                      click: () => { this.appenChildNode(data) }
                    }
                  })
                ])
              ])
            },
            children: []
          })
          content.forEach(item => {
            if (item.ismenu == 1) {
              let data = this.deepTraversal(item, this.data5[0].children)
            }
          })
          if (this.data5[0].children[0] && noFirst) {
            this.addMenu.menuName = this.data5[0].children[0].title
            this.addMenu.menuIcon = this.data5[0].children[0].icon
            this.addMenu.menuUrl = this.data5[0].children[0].menuUrl
            this.addMenu.code = this.data5[0].children[0].code,
            this.addMenu.pid = this.data5[0].children[0].pid
            this.addMenu.pids = this.data5[0].children[0].pids
            this.addMenu.menuDesc = this.data5[0].children[0].menuDesc
            this.addMenu.levels = parseInt(this.data5[0].children[0].levels)
            this.addMenu.id = this.data5[0].children[0].id
            this.addMenu.sort = this.data5[0].children[0].sort
          }
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    /**
    * @description 深度优先遍历
    */
    deepTraversal (data, data5) {
      if (data) {
        data5.push(
          {
            id: data.id,
            pid: data.pid,
            pids: data.pids,
            title: data.menuName,
            code: data.code,
            expand: true,
            icon: data.menuIcon,
            levels: data.levels,
            menuUrl: data.menuUrl,
            menuDesc: data.menuDesc,
            sort: parseInt(data.sort),
            ismenu:data.ismenu,
            children: []
          }
        )
        if (data.nodes && data.nodes.length > 0) {
          var children = data.nodes
          for (var i = 0; i < children.length; i++) {
            // 每次递归的时候将  需要遍历的节点  和 节点所存储的数组传下去
            this.deepTraversal(children[i], data5[data5.length - 1].children)
          }
        }
      }
      return data5
    },

    /**
     * @description 获取card的高度
     */
    changeFixed (clientHeight) {
      this.$refs.content.style.height = clientHeight +'px';
      this.$refs.left.style.height = clientHeight +'px';
      this.$refs.right.style.height = clientHeight +'px';
    },
    // 树结构调用方法 start
    /**
     * @description 遍历树节点 显示在页面上
     */
    renderContent (h, { root, node, data }) {
      return h(
        'span', {
                style: {
                    display: 'inline-block',
                    width: '100%'
                },
                on: {
                    click: (e) => {}
                }
            }, 
        [
        h('span', [
            h('Icon', {
                props: {
                type: data.icon
                },
                style: {
                marginRight: '8px'
                }
            }),
          h('span', {
            style: {
              color: '#666',
              cursor: 'pointer'
            },
            domProps: {
              className: 'btn'
            },
            on: {
              click: (e) => {
                let btns = this.$refs.reference.$el.querySelectorAll('.btn')
                for (let i = 0; i < btns.length; i++) {
                  btns[i].style.backgroundColor = '#fff'
                }
                e.path[0].style.backgroundColor = '#2d8cf0'// 当前
                this.addMenu = {
                  menuIcon: '',
                  menuName: '',
                  menuUrl: '',
                  code: '',
                  pid: '',
                  pids: '',
                  ismenu: 1,
                  menuDesc: '',
                  levels: 1,
                  id: '',
                  sort: ''
                },
                this.addMenu.menuName = data.title
                this.addMenu.menuIcon = data.icon
                this.addMenu.menuUrl = data.menuUrl
                this.addMenu.code = data.code
                this.addMenu.pid = data.pid
                this.addMenu.pids = data.pids
                this.addMenu.menuDesc = data.menuDesc
                this.addMenu.levels = parseInt(data.levels)
                this.addMenu.id = data.id
                this.addMenu.sort = data.sort
                this.addMenu.ismenu = data.ismenu+""
              }
            }
          },data.title)
        ]),
        h('span', {
          style: {
            display: 'inline-block',
            float: 'right',
            marginRight: '32px'
          }
        }, 
        [
          h('Button',   data.ismenu==1?{
            props: Object.assign({}, this.buttonProps, {
              icon: 'ios-add',
              type:'primary',
            }),
            style: {
              marginRight: '8px',
            },
            on: {
              click: (e) => {
                this.appenChildNode(data) }
            }
          }:{
            props: Object.assign({}, this.buttonProps, {
              icon: 'ios-add',
              type: 'primary',
            }),
            style: {
              marginRight: '8px',
              display:'none'
            },
            on: {
              click: () => { this.appenChildNode(data) }
            }
          }),
          h('Button', {
            props: Object.assign({}, this.buttonProps, {
              type: 'error',
              icon: 'ios-remove'
            }),
            on: {
              click: () => { this.remove(root, node, data) }
            }
          })
        ])
      ])
    },
    /**
     * 点击加号 右侧增加节点
     */
    appenChildNode (data) {
      this.cardTitle = '增加数据'
      this.addData = data
      this.addMenu = {
        menuIcon: '',
        menuName: '',
        menuUrl: '',
        code: '',
        pid: '',
        pids: '',
        ismenu: "1",
        menuDesc: '',
        levels: 1,
        id: '',
        sort: 0
      }
     
    },
    /**
     * @description移除节点
     */
    remove (root, node, data) {
      this.$Modal.confirm({
        title: '删除',
        content: '删除菜单后数据不可恢复',
        loading: true,
        onOk: () => {
          let form = {
            id: data.id
          }
          this.$axios.post(this.$GLOBAL.S0402, this.$qs.stringify(form))
            .then(res => {
              if (res.data.code == 0) {
                this.$Modal.remove()
                this.$Message.info(res.data.message)
                // this.getAllTreeData()
                const parentKey = root.find(el => el === node).parent
                const parent = root.find(el => el.nodeKey === parentKey).node
                const index = parent.children.indexOf(data)
                parent.children.splice(index, 1)
              } else {
                this.$Message.error(res.data.message)
              }
            })
        }
      })
    },
    /**
     * @description向数据库中提交数据
     */
    addMenuSubmit () {
      this.$refs.addMenu.validate((valid) => {
        if (valid) {
          let form = {
            menuIcon:parseInt(this.addMenu.ismenu) ==1?this.addMenu.menuIcon:'ios-radio-button-on',
            menuName: this.addMenu.menuName,
            menuUrl: this.addMenu.menuUrl,
            code: this.addMenu.code,
            pid: parseInt(this.addData.id),
            pids: this.addData.id == 0 ? '[0]' : this.addData.pids + ',[' + this.addData.id + ']',
            sort: this.addMenu.sort,
            ismenu: parseInt(this.addMenu.ismenu),
            menuDesc: this.addMenu.menuDesc,
            levels: this.addData.id == 0 ? parseInt('1') : parseInt(this.addData.levels+1)
          }
          this.$axios.post(this.$GLOBAL.S0401, form)
            .then(res => {
              if (res.data.code == 0) {
                this.$Message.info(res.data.message)
                let noFirst = false
                this.getAllTreeData(noFirst)
              } else {
                this.$Message.error(res.data.message)
              }
            })
        }
      })
    },
    updateSubmit () {
      this.$refs.addMenu.validate((valid) => {
        if (valid) {
          let form = {
            menuIcon:parseInt(this.addMenu.ismenu) ==1?this.addMenu.menuIcon:'ios-radio-button-on',
            menuName: this.addMenu.menuName,
            menuUrl: this.addMenu.menuUrl,
            code: this.addMenu.code,
            pid: parseInt(this.addMenu.pid),
            pids: this.addMenu.pids,
            sort: this.addMenu.sort,
            ismenu:parseInt(this.addMenu.ismenu),
            id: parseInt(this.addMenu.id),
            menuDesc: this.addMenu.menuDesc,
            levels:parseInt(this.addMenu.levels)
          }
          this.$axios.post(this.$GLOBAL.S0401, form)
            .then(res => {
              if (res.data.code == 0) {
                this.$Message.info(res.data.message)
                let noFirst = false
                this.getAllTreeData(noFirst)
              } else {
                this.$Message.error(res.data.message)
              }
            })
        }
      })
    }
    // 树结构调用方法 end
  }
}

</script>

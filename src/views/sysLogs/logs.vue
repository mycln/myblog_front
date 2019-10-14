<style lang="less">
    @import "./logs.less";
</style>
<template>
    <Card>
        <p slot="title">
            <Icon type="navicon-round"></Icon>
            日志管理
        </p>
        <Card>
            <p slot="title">
                搜索条件
            </p>
            <Row>
                <Form>
                    <i-col span="6">
                        <Form-item label="请求IP地址" :label-width="100">
                            <Input type="text" v-model="query.remoteAddr" class="text-input"/>
                        </Form-item>
                    </i-col>
                    <i-col span="6">
                        <Form-item label="是否登录" :label-width="100">
                            <Select v-model="query.isLogin" class="text-select">
                                <Option  value="-1" key="-1" selected = "selected">全部</Option>
                                <Option v-for="item in statusArray" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Form-item>
                    </i-col>
                    <i-col span="6">
                        <Form-item label="日志添加时间" :label-width="100">
                            <DatePicker type="date"   @on-change="changeDate($event)" format="yyyy-MM-dd"  placeholder="请选择日志添加时间" class="text-input"></DatePicker>
                        </Form-item>
                    </i-col>
                    <i-col span="6">
                    <Form-item :label-width="100">
                        <Button type="primary"  shape="circle"  @click="search" v-has="{class:'logs:list'}">查询</Button>
                    </Form-item>
                    </i-col>
                </Form>
            </Row>
        </Card>
        <br/>
        <Card>
            <p slot="title">
                数据
            </p>
            <Table border stripe :columns="columns" :data="list" ></Table>
            <br/>
            <Row type="flex" justify="end">
                <i-col>
                <Page :total="page.total" :current="query.pageNum" show-total @on-change="pageClick"></Page>
                </i-col>
            </Row>
        </Card>
    </Card>
</template>

<script>
    export default {
        name: 'sysLogs',
        data () {
            return {
                statusArray:[
                    {
                        value: '0',
                        label: '未登录'
                    },
                    {
                        value: '1',
                        label: '已登录'
                    },
                ],
                query:{
                    remoteAddr:"",
                    isLogin:"-1",
                    addTime:"",
                    pageNum:1,
                    pageSize:10,
                },
                page:{
                    total:0,
                },
                list:[],
                columns:[
                    {
                        title:"请求IP地址",
                        align:"center",
                        key:"remoteAddr",
                        width: 200,
                        fixed: 'left',
                    },
                    {
                        title:"请求接口类名称",
                        align:"center",
                        width: 300,
                        key:"className",
                        ellipsis:true,
                        render:(h,column)=>{
                            return h('Poptip', {
                                props: { placement: 'top-start', trigger:'hover', width:'auto'}
                            }, [
                            column.row.className,
                                h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all'} },column.row.className)
                            ])           
                        }
                    },
                    {
                        title:"请求接口的方法",
                        align:"center",
                        width: 200,
                        key:"method",
                    },
                    {
                        title:"http请求content-type",
                        align:"center",
                        width: 300,
                        key:"contentType",
                    },
                    {
                        title:"请求参数",
                        align:"center",
                        ellipsis:true,
                        width: 300,
                        key:"requestParams",
                        render:(h,column)=>{
                            return h('Poptip', {
                                props: { placement: 'top-start', trigger:'hover', width:'auto'}
                            }, [
                            column.row.requestParams,
                                h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } },column.row.requestParams)
                            ])           
                        }
                    },
                    {
                        title:"http请求类型",
                        align:"center",
                        width: 200,
                        key:"requestType",
                    },
                    {
                        title:"请求方法的描述",
                        align:"center",
                        width: 150,
                        key:"description",
                    },
                    {
                        title:"请求接口地址",
                        align:"center",
                        width: 200,
                        key:"serverAddr",
                    },
                    {
                        title:"请求来源使用的设备",
                        align:"center",
                        width: 200,
                        key:"deviceName",
                    },
                    {
                        title:"请求来源使用的浏览器",
                        align:"center",
                        width: 200,
                        key:"browserName",
                    },
                    {
                        title:"用户代理",
                        align:"center",
                        ellipsis:true,
                        width: 400,
                        key:"userAgent",
                        render:(h,column)=>{
                            return h('Poptip', {
                                props: { placement: 'top-start', trigger:'hover', width:'auto'}
                            }, [
                            column.row.userAgent,
                                h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } },column.row.userAgent)
                            ])           
                        }
                    },

                    {
                        title:"请求方法的路径",
                        align:"center",
                        width: 200,
                        key:"requestUri",
                        ellipsis:true,
                         render:(h,column)=>{
                            return h('Poptip', {
                                props: { placement: 'top-start', trigger:'hover', width:'auto'}
                            }, [
                            column.row.requestUri,
                                h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } },column.row.requestUri)
                            ])           
                        }
                    },
                    {
                        title:"是否登录",
                        align:"center",
                        width: 100,
                        key:"isLogin",
                        render: (h, params) =>{
                            const row = params.row;
                            const text = row.isLogin=='1'?'登录':'未登录'
                            return text
                        }
                    },
                    {
                        title:"用户的id",
                        align:"center",
                        width: 200,
                        key:"userId",
                    },
                    {
                        title:"是否异常",
                        width: 100,
                        align:"center",
                        key:"isException",
                        render: (h, params) =>{
                            const row = params.row;
                            const text = row.isException=='0'?'无异常':'异常'
                            return text
                        }
                    },
                    {
                        title:"异常发生的类的名称",
                        align:"center",
                        width: 300,
                        key:"exceptionName",
                        ellipsis:true,
                        render:(h,column)=>{
                            return h('Poptip', {
                                props: { placement: 'top-start', trigger:'hover', width:'auto'}
                            }, [
                            column.row.exceptionName,
                                h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } },column.row.exceptionName)
                            ])           
                        }
                    },
                    {
                        title:"异常信息",
                        width: 200,
                        align:"center",
                        key:"exceptionMsg",
                        ellipsis:true,
                        render:(h,column)=>{
                            return h('Poptip', {
                                props: { placement: 'top-start', trigger:'hover', width:'auto'}
                            }, [
                            column.row.exceptionMsg,
                                h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } },column.row.exceptionMsg)
                            ])           
                        }
                    },
                    {
                        title:"添加时间",
                        width: 200,
                        align:"center",
                        key:"addTime",
                        fixed: 'right'
                    }
                ],
            };
        },
        computed: {
           
        },
        mounted(){
            this.init()
        },
        activated(){
        },
        methods: {
            init(){
                this.query.pageNum = 1
                this.goQuery()
            },
            goQuery(){
                let form = this.$objCopy(this.query)
                if(form.isLogin=='-1'){
                    form.isLogin = null;
                }
                if(form.addTime!=null && form.addTime!=undefined && form.addTime!=""){
                    form.addTime = this.query.addTime
                }else{
                    form.addTime = "";
                }
                this.$axios.get(this.$GLOBAL.S0301,{
                    params:form
                }).then(res=>{
                        if(res.data.code == 0){
                            this.list = res.data.content.list
                            this.page.total = parseInt(res.data.content.total)
                        }else{
                            this.$Message.error(res.data.message)
                        }
                    })
            },
            pageClick(page){
                this.query.pageNum = page
                this.goQuery()
            },
            search(){
                this.query.pageNum = 1
                this.goQuery()
            },
            changeDate(dateA) {
                console.log(dateA)
                this.query.addTime = dateA
            }
        }
    };

</script>

<style lang="less">
    @import "./user.less";
</style>
<template>
    <Card>
        <p slot="title">
            <Icon type="navicon-round"></Icon>
            用户管理
        </p>
        <Card>
            <p slot="title">
                搜索条件
            </p>
            <Row>
                <Form>
                    <i-col span="8">
                    <Form-item label="用户名称" :label-width="100">
                        <Input type="text" v-model="query.name" class="text-input"/>
                    </Form-item>
                    </i-col>
                    <i-col span="8">
                        <Form-item label="用户状态" :label-width="100">
                            <Select v-model="query.status" class="text-select">
                                <Option  value="0" key="0" selected = "selected">全部</Option>
                                <Option v-for="item in statusArray" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Form-item>
                    </i-col>
                    <i-col span="8">
                    <Form-item :label-width="100">
                        <Button type="primary" style="margin-right:10px;" shape="circle" @click="search" v-has="{class:'user:list'}">查询</Button>
                        <Button type="warning" @click="handleAdd" shape="circle" v-has="{class:'user:add'}">添加</Button>
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
            <Table border stripe :columns="columns" :data="list"></Table>
            <br/>
            <Row type="flex" justify="end">
                <i-col>
                <Page :total="page.total" :current="query.pageNum" show-total @on-change="pageClick"></Page>
                </i-col>
            </Row>
        </Card>
        <Modal
                v-model="modal.add.show"
                title="新增用户" width="60%" class="my_card">
            <Card dis-hover :bordered="false">
                <Form :rules="addRules" :model="add" ref="add" style="margin-left: 20px">
                    <Row>
                        <!--<i-col span="16">-->
                        <!--<Form-item label="用户头像" :label-width="100"  >-->
                            <!--<div class="admin-upload-list" v-for="item in add.uploadList" :key="item.url">-->
                                <!--<template v-if="item.status === 'finished'">-->
                                    <!--<img :src="item.response.content">-->
                                <!--</template>-->
                                <!--<template v-else>-->
                                    <!--<Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>-->
                                <!--</template>-->
                            <!--</div>-->
                            <!--<a class="ivu-upload-show-shadow" @click="goUpload" v-if="add.uploadList.length > 0">-->
                                <!--重新上传-->
                            <!--</a>-->
                            <!--<Upload-->
                                    <!--ref="upload"-->
                                    <!--:show-upload-list="false"-->
                                    <!--:default-file-list="add.defaultList"-->
                                    <!--:on-success="handleSuccess"-->
                                    <!--:format="['jpg','jpeg','png']"-->
                                    <!--:max-size="2048"-->
                                    <!--:on-format-error="handleFormatError"-->
                                    <!--:on-exceeded-size="handleMaxSize"-->
                                    <!--:before-upload="handleBeforeUpload"-->
                                    <!--multiple-->
                                    <!--type="drag"-->
                                    <!--:action="action"-->
                                    <!--:style="{display: add.uploadList.length > 0 ?'none':'inline-block',width:'58px'}">-->
                                <!--<div style="width: 58px;height:58px;line-height: 58px;">-->
                                    <!--<Icon type="camera" size="20"></Icon>-->
                                <!--</div>-->
                            <!--</Upload>-->
                        <!--</Form-item>-->
                        <!--</i-col>-->
                        <i-col span="22">
                            <Form-item label="用户名称" :label-width="100" prop="username">
                                <Input type="text"  v-model.trim="add.username" placeholder="请输入账号(2-10个字)"/>
                            </Form-item>
                        </i-col>
                        <i-col span="22">
                        <Form-item label="用户密码" :label-width="100" prop="pass">
                            <Input type="password"  v-model.trim="add.pass" placeholder="请输入密码(6-15个字)"/>
                        </Form-item>
                        </i-col>
                        <i-col span="22">
                            <Form-item label="确认密码" :label-width="100" prop="pass2">
                                <Input type="password"  v-model.trim="add.pass2" placeholder="请输入密码(6-15个字)"/>
                            </Form-item>
                        </i-col>
                        <i-col span="22">
                            <Form-item label="电话" :label-width="100" prop="phone">
                                <Input type="text"  v-model.trim="add.phone" placeholder="请输入电话"/>
                            </Form-item>
                        </i-col>
                    </Row>
                </Form>
            </Card>
                <div slot="footer">
                    <Button type="text" size="large" @click="modal.add.show=false">取消</Button>
                    <Button type="primary" size="large" @click="addSubmit">确定</Button>
                </div>
        </Modal>
        <Modal
                v-model="modal.update.show"
                title="编辑用户" width="60%">
            <Card dis-hover :bordered="false" class="my_card">
                <Form :rules="updateRules" :model="update"  ref="update" style="margin-left: 20px">
                    <Row>
                        <!--<i-col span="24">-->
                        <!--<Form-item label="用户头像" :label-width="100" >-->
                            <!--<div class="admin-upload-list" v-for="item in update.uploadList" :key="item.url">-->
                                <!--<template v-if="item.status === 'finished'">-->
                                    <!--<img :src="item.response.content">-->
                                <!--</template>-->
                                <!--<template v-else>-->
                                    <!--<Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>-->
                                <!--</template>-->
                            <!--</div>-->
                            <!--<a class="ivu-upload-show-shadow" @click="goUpload2" v-if="update.uploadList.length > 0">-->
                                <!--重新上传-->
                            <!--</a>-->
                            <!--<Upload-->
                                    <!--ref="upload2"-->
                                    <!--:show-upload-list="false"-->
                                    <!--:default-file-list="update.defaultList"-->
                                    <!--:on-success="handleSuccess"-->
                                    <!--:format="['jpg','jpeg','png']"-->
                                    <!--:max-size="2048"-->
                                    <!--:on-format-error="handleFormatError"-->
                                    <!--:on-exceeded-size="handleMaxSize"-->
                                    <!--:before-upload="handleBeforeUpload2"-->
                                    <!--multiple-->
                                    <!--type="drag"-->
                                    <!--:action="action"-->
                                    <!--:style="{display: update.uploadList.length > 0 ?'none':'inline-block',width:'58px'}">-->
                                <!--<div style="width: 58px;height:58px;line-height: 58px;">-->
                                    <!--<Icon type="camera" size="20"></Icon>-->
                                <!--</div>-->
                            <!--</Upload>-->
                        <!--</Form-item>-->
                        <!--</i-col>-->
                        <i-col span="22">
                        <Form-item label="账号" :label-width="100" prop="username">
                            <Input type="text" v-model.trim="update.username" placeholder="请输入账号(2-10个字)"/>
                        </Form-item>
                        </i-col>
                        <i-col span="22">
                            <Form-item label="电话" :label-width="100" prop="phone">
                                <Input type="text"  v-model.trim="update.phone" placeholder="请输入电话"/>
                            </Form-item>
                        </i-col>
                        <i-col span="22">
                        <Form-item label="用户状态" :label-width="100" prop="status">
                            <Select v-model="update.status">
                                <Option v-for="item in update.statusArray" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Form-item>
                        </i-col>
                    </Row>
                </Form>
            </Card>
                <div slot="footer">
                    <Button type="text" size="large" @click="modal.update.show=false">取消</Button>
                    <Button type="primary" size="large" @click="updateSubmit">确定</Button>
                </div>
        </Modal>
        <Modal
                v-model="modal.info.show"
                title="分配角色" width="60%">
            <Card dis-hover :bordered="false" class="my_card">
                <CheckboxGroup  v-model="info.roleList" style="margin-left: 20px">
                    <Checkbox   v-for="item in info.roleListAll" :label="item.value" :key="item.value">
                        <span>{{item.label}}</span>
                    </Checkbox>
                </CheckboxGroup>
            </Card>
                <div slot="footer">
                    <Button type="text" size="large" @click="modal.info.show=false">取消</Button>
                    <Button type="primary" size="large" @click="roleSubmit">确定</Button>
                </div>
        </Modal>

    </Card>

</template>

<script>
    import {formatDate} from '../../common/date.js';
    export default {
        name: 'sys_user',
        data () {
            return {
                statusArray:[
                    {
                        value: '1',
                        label: '启用'
                    },
                    {
                        value: '2',
                        label: '停用'
                    },
                ],
                query:{
                    name:"",
                    status:"0",
                    pageNum:1,
                    pageSize:10,
                },
                action:this.$GLOBAL.C0105,
                page:{
                    total:0,
                },
                add:{
                    username:"",
                    pass:"",
                    pass2:"",
                    phone:"",
                    defaultList: [],
                    uploadList: [],
                },
                update:{
                    username:"",
                    phone:"",
                    defaultList: [],
                    uploadList: [],
                    id:"",
                    status:"",
                    statusArray:[
                        {
                            value: '1',
                            label: '启用'
                        },
                        {
                            value: '2',
                            label: '停用'
                        },
                    ],
                },
                info:{
                    userId:"",
                    roleList: [],
                    roleListAll: [],
                    roleListId:[],
                },
                modal:{
                    add:{
                        show:false,
                        loading:true
                    },
                    update:{
                        show:false,
                        loading:true
                    },
                    info:{
                        show:false,
                        loading:true
                    }
                },
                list:[],
                columns:[
//                    {
//                        title:"头像",
//                        width:100,
//                        render:(h,column)=>{
//                            return [
//                                h("img",{
//                                    attrs:{
//                                        src: column.row.avatar,
//                                        class:"table-img"
//                                    },
//                                    on:{
//                                        click:()=>{
//                                            this.$Modal.info({
//                                                title:"头像",
//                                                render:(h)=>{
//                                                    return [
//                                                        h("img",{
//                                                            attrs:{
//                                                                src: column.row.avatar,
//                                                            },
//                                                            style:{
//                                                                marginTop:"24px",
//                                                                width:"100%"
//                                                            }
//                                                        }),
//
//                                                    ]
//                                                }
//                                            })
//                                        }
//                                    }
//                                })
//                            ]
//                        }
//                    },
                    {
                        title:"账号",
                        align:"center",
                        key:"username",
                    },
                    {
                        title:"电话",
                        align:"center",
                        key:"phone",
                    },
                    {
                        title:"角色",
                        align:"center",
                        render:(h,column)=>{
                            let roleName = "";
                            if(column.row.sysRole!=null){
                                for(var i=0;i<column.row.sysRole.length;i++){
                                    if(i == column.row.sysRole.length-1){
                                        roleName += column.row.sysRole[i].roleName ;
                                    }else{
                                        roleName += column.row.sysRole[i].roleName +" | " ;
                                    }
                                }
                            }
                            return h('div', {style:{}}, roleName)
                        }
                    },
                    {
                        title:"状态",
                        align:"center",
                        key:"status",
                        render: (h, params) =>{
                            const row = params.row;
                            const text = row.status=='1'?'启用':'停用'
                            return h('div', {style:{}}, text)
                        }
                    },
                    {
                        title:"添加时间",
                        align:"center",
                        render: (h, params) =>{
                            const row = params.row;
                            if(row.addTime!=null){
                                var date = new Date(row.addTime);
                                return h('div', {style:{}}, formatDate(date, 'yyyy-MM-dd hh:mm'));
                            }else{
                                 return h('div', {style:{}}, row.addTime);
                            }
                        }
                    },
                    {
                        title:"操作",
                        align:"center",
                        width:270,
                        render:(h,column)=>{
                            return [
                                 h('Button',{
                                     props:{
                                         type:"success",
                                         shape:"circle"
                                     },
                                     style:{
                                         marginRight:"6px"
                                     },
                                     on:{
                                         click:()=>{
                                             this.info.userId = "";
                                             this.info.roleList = [];
                                             this.info.roleListAll = [];
                                             this.info.userId = column.row.id;
                                             if(column.row.sysRole!=null &&column.row.sysRole.length>0){
                                                 for(var i=0;i<column.row.sysRole.length;i++){
                                                     this.info.roleList.push(column.row.sysRole[i].id)
                                                 };
                                             }
                                             let form = {
                                                 status:1,
                                                 pageNum:0,
                                                 pageSize:0
                                             }
                                             this.$axios.get(this.$GLOBAL.S0104,{
                                                 params:form
                                             })
                                                 .then(res=>{
                                                     if(res.data.code == 0){
                                                         for(var i = 0 ;i<res.data.content.list.length;i++)
                                                         {
                                                             this.info.roleListAll.push(
                                                                 {
                                                                     value:res.data.content.list[i].id,
                                                                     label:res.data.content.list[i].roleName,
                                                                 }
                                                             )
                                                         }
                                                     }else{
                                                         this.$Message.error(res.data.message)
                                                     }
                                                 })
                                             this.modal.info.show = true
                                         }
                                     }
                                 },"角色分配"),
                                h('Button',{
                                    props:{
                                        type:"primary",
                                        shape:"circle"
                                    },
                                    style:{
                                        marginRight:"6px"
                                    },
                                    on:{
                                        click:()=>{
//                                            this.$refs.upload2.fileList.splice(0,1);
                                            this.update.username = column.row.username;
                                            this.update.phone = column.row.phone;
                                            this.update.id = column.row.id;
                                            this.update.status = column.row.status+"";
//                                            this.update.defaultList = [{
//                                                status:'finished',
//                                                name: 'img1.jpg',
//                                                response:{
//                                                    content:  column.row.avatar
//                                                }
//
//                                            }]
//                                            setTimeout(()=>{ this.update.uploadList = this.$refs.upload2.fileList},1)
                                            this.modal.update.show = true
                                        }
                                    }
                                },"编辑"),
                                h('Poptip', {
                                props: {
                                    confirm: true,
                                    title: '你确定要删除吗?',
                                },
                                style:{
                                    textAlign:"left"
                                },
                                on: {
                                'on-ok': () => {
                                    this.$axios.post(this.$GLOBAL.S0203,this.$qs.stringify({
                                         id:column.row.id}))
                                        .then(res=>{
                                            if(res.data.code == 0){
                                                this.$Message.info(res.data.message)
                                                this.query.pageNum =   this.query.pageNum
                                                this.goQuery()
                                            }else{
                                                this.$Message.error(res.data.message)
                                            }
                                        })
                                     }
                                }
                            }, [
                                h('Button',{
                                    props:{
                                        type:"error",
                                        shape:"circle"
                                    },
                                },'删除')
                            ])
                            ]
                        }
                    },
                ],
                addRules:{
//                    uploadList:[
//                        { required: true, type:"array",message: '用户头像不能为空', trigger: 'blur' },
//                    ],
                    username:[
                        { required: true, message: '用户名称不能为空', trigger: 'blur' },
                        { required: true,max:10, message: '用户名称不能大于10个字', trigger: 'blur' }
                    ],
                    pass:[
                        { required: true, message: '用户密码不能为空', trigger: 'blur' },
                        { required: true,min:6, message: '用户密码不能小于6个字', trigger: 'blur' },
                        { required: true,max:15, message: '用户密码不能大于15个字', trigger: 'blur' }
                    ],
                    pass2:[
                        { required: true, validator: this.myValidator, trigger: 'blur' },
                    ],
                    phone:[
                        { required: true, validator: this.addphoneValidator, trigger: 'blur' },
                    ],

                },
                updateRules:{
//                    uploadList:[
//                        { required: true, type:"array",message: '用户头像不能为空', trigger: 'blur' },
//                    ],
                    username:[
                        { required: true, message: '用户名称不能为空', trigger: 'blur' },
                        { required: true,max:10, message: '用户名称不能大于10个字', trigger: 'blur' }
                    ],
                    phone:[
                        { required: true,  validator: this.updatephoneValidator, trigger: 'blur' },
                    ],
                },
            };
        },
        computed: {

        },
        mounted(){

        },
        activated(){
            this.init()

        },
        methods: {

            init(){
                this.query.pageNum = 1
                this.goQuery()
            },
            goQuery(){
                let form = this.$objCopy(this.query)
                if(form.status=='0'){
                    form.status = null;
                }
                this.$axios.get(this.$GLOBAL.S0204,{
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
            roleSubmit(){
                var params = new URLSearchParams();
                params.append('userId', this.info.userId);
                params.append('roleIds', this.info.roleList)
                this.$axios.post(this.$GLOBAL.S0106,params)
                    .then(res=>{
                        if(res.data.code == 0){
                            this.$Message.info(res.data.message)
                            this.query.pageNum = 1;
                            this.goQuery();
                            this.modal.info.show = false;
                        }else{
                            this.$Message.error(res.data.message)
                        }
                    })
            },
            handleAdd(){
                this.add.username=""
                this.add.phone=""
                this.add.pass=""
                this.add.pass2 =""
//                this.add.defaultList= this.add.defaultList
//                this.add.uploadList= this.$refs.upload.fileList
//                const fileList = this.$refs.upload.fileList;
//                this.$refs.upload.fileList.splice(0,1)
                this.modal.add.show = true
            },
            addSubmit(){
                this.$refs.add.validate((valid)=>{
                    if(valid){
                        let form = {
                            name:this.add.username,
                            pass:this.add.pass,
                        }
//                        if(this.add.uploadList!=null && this.add.uploadList.length>0){
//                            form.avatar = this.add.uploadList[0].response.content
//                        }
                        if(this.add.phone!=null){
                            form.phone=this.add.phone
                        }
                        this.$axios.post(this.$GLOBAL.S0201,this.$qs.stringify(form))
                            .then(res=>{
                                if(res.data.code == 0){
                                    this.$Message.info(res.data.message)
                                    this.query.pageNum = this.query.pageNum
                                    this.goQuery()
                                    this.modal.add.show = false
                                }else{
                                    this.$Message.error(res.data.message)
                                }
                            })
                    }
                })
            },
            updateSubmit(){
                this.$refs.update.validate((valid)=>{
                    if(valid){
                        let form = {
                            name:this.update.username,
                            id:this.update.id,
                            status:this.update.status
                        }
//                      if(this.update.uploadList!=null && this.update.uploadList.content!=""  && this.update.uploadList.length>0){
//                            form.avatar = this.update.uploadList[0].response.content
//                        }
                        if(this.update.phone!=null && this.update.phone!=""){
                            form.phone=this.update.phone
                        }

                        this.$axios.post(this.$GLOBAL.S0202,this.$qs.stringify(form))
                            .then(res=>{
                                if(res.data.code == 0){
                                    this.$Message.info(res.data.message)
                                    this.query.pageNum =  this.query.pageNum 
                                    this.goQuery()
                                    this.modal.update.show = false
                                }else{
                                    this.$Message.error(res.data.message)
                                }
                            })
                    }
                })
            },
            handleFormatError (file) {
                this.$Message.warning({
                    content: '文件 ' + file.name + ' 格式不正确，请选择图片文件。'
                });
            },
            handleBeforeUpload (file) {
                // this.$Message.warning({
                //     content: '文件 ' + file.name + ' 准备上传。'
                // });
                const check = this.add.uploadList.length < 1;
                if (!check) {
                    const fileList = this.$refs.upload.fileList;
                    this.$refs.upload.fileList.splice(fileList.indexOf(this.add.uploadList[0]), 1);
                }
            },
            handleBeforeUpload2 (file) {
                // this.$Message.warning({
                //     content: '文件 ' + file.name + ' 准备上传。'
                // });
                const check = this.update.uploadList.length < 1;
                if (!check) {
                    const fileList = this.$refs.upload2.fileList;
                    this.$refs.upload2.fileList.splice(fileList.indexOf(this.update.uploadList[0]), 1);
                }
            },
            handleProgress (event, file) {
                // this.$Message.info({
                //     content: '文件 ' + file.name + ' 正在上传。'
                // });
            },
            handleSuccess (evnet, file) {
                file.response.content =  evnet.content;
                file.name = file.name;
                this.$Message.success({
                    content: '文件 ' + file.name + ' 上传成功。'
                });
            },
            handleError (event, file) {
                this.$Message.error({
                    content: '文件 ' + file.name + ' 上传失败。'
                });
            },
            handleRemove (file) {
                // 从 upload 实例删除数据
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            handleMaxSize (file) {
                this.$Message.warning({
                    content: '文件 ' + file.name + ' 太大，不能超过 2M。'
                });
            },
            goUpload(){
                this.$refs.upload.$refs.input.click()
            },
            goUpload2(){
                this.$refs.upload2.$refs.input.click()
            },

            updatephoneValidator(rule, value, callback) {
                let update =  this.update;
                value = update.phone;
                if (value === '') {
                    callback();
//                    callback(new Error('负责人手机号不可为空'));
                } else {
                    if (value !== '') {
                        var reg=/^1[3456789]\d{9}$/;
                        if(!reg.test(value)){
                            callback(new Error('请输入有效的手机号码'));
                        }
                    }
                    callback();
                }
            },
            addphoneValidator(rule, value, callback) {
                let add =  this.add;
                value = add.phone;
                if (value === '') {
                    callback();
//                    callback(new Error('负责人手机号不可为空'));
                } else {
                    if (value !== '') {
                        var reg=/^1[3456789]\d{9}$/;
                        if(!reg.test(value)){
                            callback(new Error('请输入有效的手机号码'));
                        }
                    }
                    callback();
                }
            },

            myValidator(rule, value, callback){
                let add = this.add
                if(add.pass2 == ""){
                    callback(new Error('确认密码不能为空'))
                }else if(add.pass2.length<6){
                    callback(new Error('确认密码不能少于6位'))
                }else if(add.pass2.length>15){
                    callback(new Error('确认密码不能大于15位'))
                }else if(add.pass !=add.pass2){
                    callback(new Error('确认密码和密码不符合'))
                }else{
                    callback()
                }
            },
        }
    };

</script>

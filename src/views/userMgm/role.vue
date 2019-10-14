<style lang="less">
    @import "./role.less";
</style>
<style >
.ivu-tree-title-selected, .ivu-tree-title-selected:hover {
    background-color: #2b85e4;;
}
</style>
<template>
    <Card>
        <p slot="title">
            <Icon type="navicon-round"></Icon>
            角色管理
        </p>
        <Card>
            <p slot="title">
                搜索条件
            </p>
            <Row>
                <Form>
                    <i-col span="8">
                        <Form-item label="角色名称" :label-width="100">
                            <Input type="text" v-model="query.name" class="text-input"/>
                        </Form-item>
                    </i-col>
                    <i-col span="8">
                    <Form-item label="角色状态" :label-width="100">
                        <Select v-model="query.status"  class="text-select">
                            <Option  value="0" key="0">全部</Option>
                            <Option v-for="item in statusArray" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </Form-item>
                    </i-col>

                    <i-col span="8" >
                        <Form-item :label-width="100">
                            <Button type="primary" shape="circle" @click="search" v-has="{class:'role:list'}" style="margin-right:10px;"  >查询</Button>
                            <Button type="warning" shape="circle"  @click="handleAdd"  v-has="{class:'role:add'}">添加</Button>
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
            title="新增角色" width="60%" :mask-closable="false">
            <Card dis-hover :bordered="false" class="my_card">
                <Form :rules="addRules" :model="add" ref="add">
                    <Row>
                        <i-col span="22">
                            <Form-item label="角色名称" :label-width="100" prop="roleName">
                                <Input type="text"  v-model.trim="add.roleName" placeholder="请输入角色名称(1-10个字)" :maxlength="10"/>
                            </Form-item>
                        </i-col>
                        <i-col span="22">
                            <Form-item label="角色描述" :label-width="100">
                                <Input  type="textarea" v-model.trim="add.roleDesc" :rows="4" placeholder="请输入角色描述(1-100个字)" :maxlength="100"/>
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
            title="编辑角色"  width="60%">
            <Card dis-hover :bordered="false" class="my_card">
                <Form :rules="updateRules" :model="update" ref="update">
                    <Row>
                        <i-col span="22">
                        <Form-item label="角色名称" :label-width="100" prop="roleName">
                            <Input type="text"  v-model.trim="update.roleName" placeholder="请输入角色名称(1-10个字)" :maxlength="10"/>
                        </Form-item>
                        </i-col>
                        <i-col span="22">
                        <Form-item label="角色描述" :label-width="100" prop="roleDesc">
                            <Input  type="textarea"  v-model.trim="update.roleDesc" :rows="4" placeholder="请输入角色描述(1-100个字)" :maxlength="100"/>
                        </Form-item>
                        </i-col>
                        <i-col span="16">
                        <Form-item label="角色状态" :label-width="100">
                            <Select v-model="update.status" >
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
                title="分配权限" width="60%" class="my_card">
            <Card dis-hover :bordered="false">
               <template >
                    <Tree :data="data2"  show-checkbox multiple  ref="tree"  style="margin-left: 10%"> </Tree>
                </template>
            </Card>
                <div slot="footer">
                    <Button type="text" size="large" @click="modal.info.show=false">取消</Button>
                    <Button type="primary" size="large" @click="checkMenu" >确定</Button>
                </div>
        </Modal>
    </Card>
    
</template>

<script>
    import {formatDate} from '../../common/date.js';
export default {
    name: 'sys_role',
    data () {
        return {
            res:[],
            data2: [],
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
            page:{
                total:0,
            },
            add:{
                roleName:"",
                roleDesc:"",
            },
            update:{
                roleName:"",
                roleDesc:"",
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
                id:"",
            },
            info:{
              id : '',
              menuids : [],
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
                },
            },
            list:[],
            columns:[
                {
                    title:"角色名称",
                    align:"center",
                    key:"roleName",
                },
                {
                    title:"角色描述",
                    align:"center",
                    key:"roleDesc",
                },
                {
                    title:"状态",
                    align:"center",
                    key:"status",
                    render: (h, params) =>{
                        const row = params.row;
                        const text = row.status=='1'?'启用':'停用'
                         return h('div', {style:{}}, text);
                    }
                },
                {
                    title:"添加日期",
                    align:"center",
                    width:136,
                    key:"addTime",
                    render: (h, params) =>{
                        const row = params.row;
                        if(row.addTime!=null){
                            var date = new Date(row.addTime);
                            return h('div', {style:{}}, formatDate(date, 'yyyy-MM-dd hh:mm'));
                        }else{
                            return h('div', {style:{}}, formatDate(date, 'row.addTime'));
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
                                      this.info.id = column.row.id
                                      this.data2 = [];
                                        let form ={
                                            roleId:column.row.id
                                        }
                                        this.$axios.get(this.$GLOBAL.S0107,
                                            {
                                                params:form
                                            })
                                            .then(res=>{
                                                if(res.data.code == 0){
                                                    if(res.data.content!=null && res.data.content.length>0){
                                                        for(var j = 0;j<res.data.content.length;j++){
                                                           let content = res.data.content[j]
                                                           this.deepTraversal(res.data.content[j],this.data2,1)
                                                        }
                                                    }
                                                }else{
                                                    this.$Message.error(res.data.message)
                                                }
                                            })
                                        this.modal.info.show = true
                                    }
                                }
                            },"权限分配"),
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
                                        this.update.roleName = column.row.roleName
                                        this.update.roleDesc = column.row.roleDesc
                                        this.update.status = column.row.status+""
                                        this.update.id = column.row.id
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
                                     this.$axios.post(this.$GLOBAL.S0103,this.$qs.stringify({
                                        id:column.row.id}))
                                        .then(res=>{
                                            if(res.data.code == 0){
                                                this.$Message.info(res.data.message)
                                                this.query.pageNum =this.query.pageNum
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
                roleName:[
                    { required: true, message: '角色名称不能为空', trigger: 'blur' }
                ],
                roleDesc:[
                    { required: true, message: '角色描述不能为空', trigger: 'blur' }
                ],
            },
            updateRules:{
                roleName:[
                    { required: true, message: '角色名称不能为空', trigger: 'blur' }
                ],
                roleDesc:[
                    { required: true, message: '角色描述不能为空', trigger: 'blur' }
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
   /**
    * @description 深度优先遍历
    */
    deepTraversal (data, data5,level) {
        if (data) {
            data5.push(
                    {
                        title:data.menuName,
                        id : data.id,
                        pids:data.pids,
                        checked:data.checked,
                        expand:true,
                        children:[],
                    }
            )
            if (data.nodes && data.nodes.length > 0) {
            var children = data.nodes
            for (var i = 0; i < children.length; i++) {
                data5[data5.length - 1].checked = false;
                // 每次递归的时候将  需要遍历的节点  和 节点所存储的数组传下去
                this.deepTraversal(children[i], data5[data5.length - 1].children,0)
            }
            }
        }
        return data5
        },
        checkMenu(){
            this.info.menuids = [];
            var params = new URLSearchParams();
            params.append('roleId', this.info.id);
            this.data2.forEach(item=>{
                if(item.checked){
                    this.info.menuids.push(item.id)
                }
                if(item.children.length>0){
                    item.children.forEach(item2=>{
                        if(item2.checked){
                            if(!IsInArray(this.info.menuids,item.id)){
                                this.info.menuids.push(item.id)
                            }
                            this.info.menuids.push(item2.id)
                        }
                        if(item2.children.length>0){
                            item2.children.forEach(item3=>{
                                if(item3.checked){
                                    if(!IsInArray(this.info.menuids,item2.id)){
                                            this.info.menuids.push(item2.id)
                                     }
                                     this.info.menuids.push(item3.id)
                                }   
                            })
                          }
                    })
                }
            })
            params.append('menuIds', this.info.menuids)
            this.$axios.post(this.$GLOBAL.S0105,params)
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

        init(){
            this.query.pageNum = 1
            this.goQuery()
        },

        goQuery(){
            let form = this.$objCopy(this.query)
            if(form.status=='0'){
                form.status = null;
            }
            this.$axios.get(this.$GLOBAL.S0104,{
                params:form
            })
            .then(res=>{
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
        handleAdd(){
            this.add.roleName=""
            this.add.roleDesc= ""
            this.modal.add.show = true
        },
        addSubmit(){
            this.$refs.add.validate((valid)=>{
                if(valid){
                    let form = {
                        name:this.add.roleName,
                        desc:this.add.roleDesc,
                    }
                    this.$axios.post(this.$GLOBAL.S0101,this.$qs.stringify(form))
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
                        id:this.update.id,
                        name:this.update.roleName,
                        desc:this.update.roleDesc,
                        status:this.update.status,
                    }
                    this.$axios.post(this.$GLOBAL.S0102,this.$qs.stringify(form))
                    .then(res=>{
                        if(res.data.code == 0){
                            this.$Message.info(res.data.message)
                            this.query.pageNum = 1
                            this.goQuery()
                            this.modal.update.show = false
                        }else{
                            this.$Message.error(res.data.message)
                        }
                    })
                }
            })
        },
    }
};
    function IsInArray(arr,val){
        var testStr=','+arr.join(",")+",";
        return testStr.indexOf(","+val+",")!=-1;
    }
</script>

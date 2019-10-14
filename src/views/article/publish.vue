<style lang="less">
    @import "./publish.less";
    @import "../../styles/common.less";
</style>
<template><div>
    <input type="file" id="file" style="display:none" name="image" accept='image/*'/>
    <Card>
        <p slot="title">
            <Icon type="navicon-round"></Icon>
            发布文章
        </p>
        <Card>
            <Form ref="infoAddForm" :model="optForm" :rules="optRule">
            <Row>
                    <Col span="6" style="padding-left:16px;">
                        <FormItem label="文章标题" :label-width="100" prop="title">
                            <Input type="text" v-model="optForm.title" class="text-input" placeholder="请输入文章标题（必填）"/>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="文章标签" :label-width="100">
                            <Input type="text" v-model="optForm.labelId" class="text-input" placeholder="请输入文章标签"/>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="文章分类" :label-width="100" prop="categoryId">
                            <Select v-model="optForm.categoryId" class="text-select" aria-placeholder="请选择文章分类">
                                <!-- <Option  value="-1" key="-1" selected = "selected">javaScript</Option> -->
                                <Option v-for="item in statusArray" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
            </Row>
            <FormItem prop="content">
                <div>
                    <textarea id="tinymceEditer" v-model="optForm.content" ></textarea>
                </div>
                
                
                <div class='tinymce'>
                    <!-- <editor v-model="optForm.content" id="tinymceEditer" ></editor> -->
                    <!-- <editor v-model="optForm.content" id="tinymceEditer" :init='init'></editor> -->
                </div>
            </FormItem>
            </Form>
            <Row>
                <Col span="24" style="text-align: center; margin-top: 20px;">
                <Button type="primary" icon="ios-cloud-upload" @click="doinfoAdd()">发布</Button>
            </Col>
        </Row>
        </Card>
    </Card>
</div>
</template>

<script>
    import axios from 'axios';

    import tinymce from 'tinymce/tinymce'
    import 'tinymce/themes/modern/theme'
    import Editor from '@tinymce/tinymce-vue'
    import 'tinymce/plugins/image'
    import 'tinymce/plugins/link'
    import 'tinymce/plugins/code'
    import 'tinymce/plugins/table'
    import 'tinymce/plugins/lists'
    import 'tinymce/plugins/contextmenu'
    import 'tinymce/plugins/wordcount'
    import 'tinymce/plugins/colorpicker'
    import 'tinymce/plugins/textcolor'
    let imageUploding = null;
    export default {
        name: 'publish',
        data () {
            return {
                statusArray:[],
                optForm:{
                    title:'',
                    content:'',
                    categoryId: '',
                    labelId:''
                },
                optRule:{
                    title:[
                        {required:true,message:'文章标题不能为空',trigger:'blur'},
                        {required:true,min:2,message:'文章标题不能少于2个字',trigger:'blur'}
                    ],
                    content:[
                        {required:true,message:'文章内容不能为空',trigger:'blur'},
                        {required:true,min:10,message:'文章内容不能少于10个字',trigger:'blur'}
                    ],
                    categoryId:[
                        {required:true,message:'文章分类不能为空',trigger:'blur'}
                    ]
                },
                DefaultConfig: {
                    branding: false,
                    elementpath: false,
                    height: document.body.offsetHeight - 300,
                    skin_url: 'tinymce/skins/lightgray',
                    language_url: 'tinymce/langs/zh_CN.js',
                    language: 'zh_CN',
                    menubar: 'edit insert view format table tools',
                    plugins: 'link lists image code table colorpicker textcolor wordcount contextmenu',
                    toolbar:
                    'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat ',
                    autosave_interval: '20s',
                    image_advtab: true,
                    table_default_styles: {
                        width: '100%',
                        borderCollapse: 'collapse'
                    },
                    maxlength:10,
                },
                Editor: null
            };
        },
        props: {
            value: {
                default: '',
                type: String
            },
            config: {
                type: Object,
                default: () => {
                return {
                    theme: 'modern',
                    height: 300
                }
                }
            }
        },
        created(){
            // axios.get('http://localhost:9090/api/back/article/getAllCategorys').then(res => {
            axios.get(this.$GLOBAL.S0502).then(res => {
                if(res.data.code === 0){
                    this.statusArray = res.data.content;
                }
            })
        },
        computed: {
           
        },
        mounted(){
            // tinymce.init({})
            this.init();
        },
        activated(){
        },
        methods: {
            init() {
                let _this = this;
                this.Editor = tinymce.init({
                    // 默认配置
                    ...this.DefaultConfig,
                    
                    // prop内传入的的config
                    ...this.config,
                    selector: '#tinymceEditer',
                    setup: function (editor) {
                        editor.on('init', function (e) {
                            _this.tinymceStatus = true
                            tinymce.get('tinymceEditer').setContent(_this.optForm.content);
                        });
                        editor.on('keydown', function (e) {
                            _this.optForm.content = tinymce.get('tinymceEditer').getContent();
                        });
                        editor.on('change',function(e){
                            _this.optForm.content = tinymce.get('tinymceEditer').getContent();
                        })
                    },
                        
                    //上传图片
                    images_upload_handler:function (blobInfo, success, failure) {
                        if(imageUploding){
                            failure('有文件正在上传，请稍后再试')
                            return false;
                        }
                        if (blobInfo.blob().size > 1024 * 1024 * 10) {
                            failure('图片大小不能超过10MB！')
                            // this.$Message.warning('图片大小不能超过10MB！')
                            return false;
                        }
                        if (['jpeg', 'png', 'gif', 'jpg'].indexOf(blobInfo.blob().type.split("/")[1]) >= 0) {
                            const formData = new FormData();
                            formData.set("file",blobInfo.blob());
                            uploadImg(formData);

                        } else {
                            failure('图片类型仅支持 jpeg/png/gif！')
                            return false;
                        }

                        function uploadImg(formData){
                            const xhr = new XMLHttpRequest()
                            // xhr.open('POST', 'http://localhost:9090/api/common/upload/file', true);
                            xhr.open('POST', _this.$GLOBAL.C0105, true);
                            xhr.onload = function(){
                                if (xhr.status !== 200) {
                                    failure('上传失败: ' + xhr.status)
                                    return
                                }
                                if (xhr.status == 200) {
                                    const json = JSON.parse(xhr.responseText)
                                    success(json.content);
                                }
                                imageUploding = null
                            }
                            xhr.send(formData)
                        }
                    }
                })
            },
            getAllCategorys(){
                // axios.get('http://localhost:9090/api/back/article/getAllCategorys').then(res => {
                axios.get(this.$GLOBAL.S0502).then(res => {
                    if(res.data.code === 0){
                        // statusArray =res.data.
                        
                    }
                });
            },
            doinfoAdd(){
                this.$refs.infoAddForm.validate((valid) =>{
                    if(valid){
                        // axios.post('http://localhost:9090/api/back/article/publish',this.$qs.stringify(this.optForm)).then(res => {
                        axios.post(this.$GLOBAL.S0501,this.$qs.stringify(this.optForm)).then(res => {
                        if(res.data.code === 0){
                            this.$Message.error('发布成功！');
                            }
                        })
                    }else{
                        this.$Message.error('发布失败！');
                    }
                })
            },
        },
        destroyed () {
            tinymce.get('tinymceEditer').destroy();
        },
        components:{
            'editor':Editor
        }
    };

</script>


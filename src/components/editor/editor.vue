<template>
  <div class="editor-wrapper">
    <div :id="editorId"></div>
  </div>
</template>

<script>
import Editor from 'wangeditor'
import iView from 'iview'
import global from '@/libs/global'
import 'wangeditor/release/wangEditor.min.css'
import { oneOf } from '@/libs/tools'
export default {
  name: 'Editor',
  props: {
    value: {
      type: String,
      default: ''
    },
    /**
     * 绑定的值的类型, enum: ['html', 'text']
     */
    valueType: {
      type: String,
      default: 'html',
      validator: (val) => {
        return oneOf(val, ['html', 'text'])
      }
    },
    /**
     * @description 设置change事件触发时间间隔
     */
    changeInterval: {
      type: Number,
      default: 200
    },
    /**
     * @description 是否开启本地存储
     */
    cache: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    editorId () {
      return `editor${this._uid}`
    }
  },
  methods: {
    setHtml (val) {
      this.editor.txt.html(val)
    }
  },
  mounted () {
    this.editor = new Editor(`#${this.editorId}`)
    this.editor.customConfig.onchange = (html) => {
      let text = this.editor.txt.text()
      if (this.cache) localStorage.editorCache = html
      this.$emit('input', this.valueType === 'html' ? html : text)
      this.$emit('on-change', html, text)
    }
    this.editor.customConfig.onchangeTimeout = this.changeInterval
    // create这个方法一定要在所有配置项之后调用
    this.editor.customConfig.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        'fontName',  // 字体
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'link',  // 插入链接
        'list',  // 列表
        'justify',  // 对齐方式
        'emoticon',  // 表情
        'image',  // 插入图片
        'table',  // 表格
        'undo',  // 撤销
    ];
    this.editor.customConfig.zIndex = 100;
    //关闭粘贴样式的过滤
    this.editor.customConfig.pasteFilterStyle = false;
    //关闭忽略粘贴内容中的图片
    this.editor.customConfig.pasteIgnoreImg = false;
    // 将图片大小限制为 30M
    this.editor.customConfig.uploadImgMaxSize = 30 * 1024 * 1024;
    // 限制一次最多上传 1 张图片
    this.editor.customConfig.uploadImgMaxLength = 1;
    //上传图片到服务器可显示上传
    var url = global.C0105;
    this.editor.customConfig.uploadImgServer = url;
    this.editor.customConfig.customUploadImg = function (files, insert) {
      if(files == null || files == undefined) {
           iView.Message.error(请选择图片);  
           return;
      }
      var formData = new FormData();
      formData.append("file", files[0]);
      const xhr = new XMLHttpRequest()
      xhr.open('POST', global.C0105 , true);
      xhr.onload = function(){
        let response = JSON.parse(xhr.response)
          if(response.code == 0){
            iView.Message.success("上传成功");    
            insert(response.content)
          }else{
            iView.Message.error("上传失败");  
          }
          console.log(response.content)
      }
      xhr.send(formData)
    }
    this.editor.create()
    // 如果本地有存储加载本地存储内容
    let html = this.value || localStorage.editorCache
    if (html) this.editor.txt.html(html)
  }
}
</script>

<style lang="less">
.editor-wrapper *{
  z-index: 100 !important;
}
</style>

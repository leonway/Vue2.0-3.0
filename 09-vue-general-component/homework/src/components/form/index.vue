<template>
  <div>
    <!-- <ElementTest></ElementTest> -->
    <!-- KForm -->
    <k-form :model="model" :rules="rules" ref="loginForm">
      <k-form-item label='用户名' prop='username'>
        <k-input v-model="model.username" placeholder="请输入用户名"></k-input>
      </k-form-item>
      <k-form-item label='密码' prop='password'>
        <k-input type='password' v-model="model.password"></k-input>
      </k-form-item>
      <k-form-item>
        <button @click="onLogin">登录</button>
      </k-form-item>
    </k-form>
  </div>
</template>

<script>
  // import ElementTest from './ElementTest'
  import KInput from './KInput'
  import KForm from './KForm'
  import KFormItem from './KFormItem'
  // import Notice from '../Notice'
  // import create from '@/utils/create'

  export default {
    inheritAttrs:false,
    components: {
      KForm,
      KFormItem,
      KInput
    },
    data() {
      return {
        model: {
          username:'tom',
          password:''
        },
        rules:{
          username:[
            {
              required:true,
              message:"用户名为必填项"
            }
          ],
          password:[
            {
              required:true,
              message:"请输入密码"
            }
          ]
        }
      }
    },
    methods: {
      onLogin() {
        const that = this
        this.$refs.loginForm.validate(isValid=>{
          // if(isValid){
          //   console.log('submit login');
          // }else{
          //   alert('校验失败')
          // }
          console.log(that.$notice);
          that.$notice({
            title: "社会你杨哥喊你来搬砖",
            message: isValid ? "请求登录!" : "校验失败!",
            duration: 3000,
          }).show()
          // const comp = create(Notice,{
         
          //   title: "社会你杨哥喊你来搬砖",
          //   message: isValid ? "请求登录!" : "校验失败!",
          //   duration: 3000,
          // })
          // comp.show()
        })
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>

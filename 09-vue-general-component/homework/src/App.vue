<template>
  <div id="app">
    <router-link to="/">首页</router-link>|
    <router-link to="/form">表单</router-link>|
    <router-link to="/table">表格</router-link>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style>
.icon {
       width: 1em; height: 1em;
       vertical-align: -0.15em;
       fill: currentColor;
       overflow: hidden;
    }

</style>

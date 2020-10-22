<template>
<div class="about">
  <h1>This is an about page</h1>
  <p @click="$store.commit('add')">counter: {{$store.state.counter}}</p>
  <p @click="$store.dispatch('add')">async counter: {{$store.state.counter}}</p>
  <p>double：{{$store.getters.doubleCounter}}</p>
  <router-view></router-view>
</div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>

</style>

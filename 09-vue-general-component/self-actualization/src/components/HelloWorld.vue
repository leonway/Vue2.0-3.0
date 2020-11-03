<template>
  <div class="hello">
    <FormExample></FormExample>
  </div>
</template>

<script>
import FormExample from './form'
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  components: {
    FormExample,
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

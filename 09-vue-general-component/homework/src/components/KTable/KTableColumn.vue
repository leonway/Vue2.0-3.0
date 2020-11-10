<template>
  <div>
  </div>
</template>

<script>
  export default {
    name:"k-table-column",
    props: {
      label: {
        type: String,
        required:true
      },
      prop: {
        type: String,
      },
      value:{
      },
      isHeader:{},
      sortable:[String]
    },
    mounted () {
      const that = this
      try {
        const currentColumn = {
          props:that.$props,
          renderCell(value){
            if(that.$scopedSlots.default){
              const vNodes = that.$scopedSlots.default(value)
              // console.log(vNodes);
              return vNodes
            }else{
              // console.log(value);
              return value.row[that.prop]
            }
          }
        }
      let oldCol = this.owner.columns.find(col=>col.props.prop===that.prop)
      if(oldCol){
        oldCol = currentColumn  
      }else{
        this.owner.columns.push(currentColumn)
      }
      
      // console.log(this.owner.columns);
      } catch (e) {
        console.log(e);
      }
    },
    computed:{
      owner() {
        let parent = this.$parent;
        while (parent && !parent.tableId) {
          parent = parent.$parent;
        }
        return parent;
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>

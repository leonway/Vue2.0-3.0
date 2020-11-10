<template>
  <div class="container">
    <div class='hidden-columns'>
      <slot></slot>
    </div>
     <div class='row' :key="'table-header'+tableId">
      <div class='col' v-for='(col) in columns' :key="'table-header'+col.props.prop">
       {{col.props.label}}
        <div v-if="col.props.sortable===true||col.props.sortable===''" class="sortIconBox">
          <svg 
            :class="{icon:true, sortIcon:true, active:realSortProps&&realSortProps.order==='ascending'}"
            aria-hidden="true"
            @click="sortClick('ascending',col.props.prop)"
           >
              <use xlink:href="#icon-shengxu"></use>
          </svg>
          <svg 
            :class="{icon:true, sortIcon:true, active:realSortProps&&realSortProps.order==='descending'}" 
            aria-hidden="true"
            @click="sortClick('descending',col.props.prop)"
          >
              <use xlink:href="#icon-jiangxu"></use>
          </svg>
        </div>
      </div>
    </div>
    <div class='row' v-for='(item,index) in sourceData' :key='item.index+"table-body"'>
      <div class='col' v-for='(col,i) in columns' :key='col.props.prop+"table-body"+i'>
        <render-dom :vNode="col.renderCell({$index:index,row:item})"></render-dom>
      </div>
    </div>
  </div>
</template>

<script>

let tableIdSeed = 1;
const compare = function(a, b) {
    for (let i = 0, len = a.length; i < len; i++) {
      if (a[i] < b[i]) {
        return -1;
      }
      if (a[i] > b[i]) {
        return 1;
      } 
    }
    return 0;
  };

export default {
  name:"k-table",
  components: {
    RenderDom: {
      name:'RenderDom',
      props: {
        vNode: [Array, String, Object, Number] // 这里为什么要这么写其实报一个类型检测不通过我补一个的，一开始我只写了数组和字符串。因为我这里其实不一定是vnode，毕竟直接传字符串和数字也可以，干嘛非得是vnode
      },
      render (h) {
        if (typeof this.vNode === 'object') {
          return this.vNode
        } else {
          return h('div', this.vNode)
        }
      }
    },
  },
  data() {
    return {
      columns: [],
      sortableProps: null,
    }
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    defaultSort: {
      type: Object,
      default: () => null
    }
  },
  created() {
    this.tableId = 'el-table_' + tableIdSeed++;
  },
  computed: {
    realSortProps(){
      return this.sortableProps || this.defaultSort
    },
    sourceData() {
      let array = [...this.data].map((item,index)=>({...item,index}))
      // console.log(this.realSortProps);
      if (this.realSortProps&&this.realSortProps.order) {
        array = array.sort((a,b) => {
          let order = compare(a[this.realSortProps.prop],b[this.realSortProps.prop])
          if (!order) {
            // make stable https://en.wikipedia.org/wiki/Sorting_algorithm#Stability
            order = a.index - b.index;
          }
          let reverse
          if (typeof this.realSortProps.order === 'string') {
            reverse = this.realSortProps.order === 'descending' ? -1 : 1;
          } else {
            reverse = (this.realSortProps.order && this.realSortProps.order < 0) ? -1 : 1;
          }
          return order*reverse
        })
      }
      // console.log(array);
      return array
    },
  },
  methods: {
    sortClick(order,prop) {
      const originOrder = this.realSortProps&&this.realSortProps.order
      const originProp = this.realSortProps&&this.realSortProps.prop

      if(prop===originProp){
        if(order===originOrder){
          this.sortableProps = {}
          return 
        }
      }
      this.sortableProps = {order,prop}
      return
    }
  },

}
</script>

<style lang="less" scoped>
.container {
  .row {
    flex: 1;
    display: flex;
    justify-content: space-around;
    align-items: baseline;

    .col {
      flex: 1;
      display: flex;
      justify-content: center;
      
      
      .sortIconBox{
        display: flex;
        flex-direction: column;
        margin-left: 5px;
        cursor: pointer;

        .sortIcon{
          height: 0.6em;
          font-size: 1.1em;
          color:#c0c4cc
        }
        .active{
          color:#409eff
        }
      }
    }
  }

  .hidden-columns {
    visibility: hidden;
    position: absolute;
    z-index: -1;
  }
}
</style>

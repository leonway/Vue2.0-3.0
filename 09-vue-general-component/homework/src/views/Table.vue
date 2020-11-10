<template>
  <div class='container'>
    <k-table :data="tableData" :default-sort="{prop: 'date', order: 'descending'}">
      <k-table-column prop="name" label="姓名" ></k-table-column>
      <k-table-column prop="date" label="日期" sortable></k-table-column>
      <k-table-column prop="address" label="地址" ></k-table-column>
      <k-table-column label="操作">
        <template slot-scope="scope">
            <button
              ref='button'
              @click="click('del',scope.$index,scope.row)"
            >
              删除
            </button>
        </template>
      </k-table-column>
    </k-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      }
    },
    methods: {
      click(type,index,row) {
        switch (type) {
          case 'del':
            this.tableData = this.tableData.filter((a,i)=>i!==row.index)
            break;
          default:
            break;
        }
      }
    },    
  }
</script>

<style lang="less" scoped>
  .container{
    padding:24px
  }
</style>

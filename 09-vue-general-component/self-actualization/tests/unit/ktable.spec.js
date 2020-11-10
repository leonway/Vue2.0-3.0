import { mount, shallowMount, createLocalVue, createWrapper } from "@vue/test-utils";
import KTable, { KTableColumn } from '@/components/KTable'
import Table from '@/views/Table.vue'

const originDates = [
  '2016-05-02',
  '2016-05-04',
  '2016-05-01',
  '2016-05-03',
]

const ascendingDates = [
  '2016-05-01',
  '2016-05-02',
  '2016-05-03',
  '2016-05-04',
]

describe('KTable 组件', () => {
  
  test('组件的插件化是否成功', () => {
    const localVue = createLocalVue()
    localVue.use(KTable)
    const wrapper = shallowMount(Table,{
      localVue
    })
    expect(wrapper.findComponent(KTable).exists()).toBe(true)
    expect(wrapper.findComponent(KTableColumn).exists()).toBe(true)
  })
  
  it('KTable 自定义列模板是否成功', done=> {
    const localVue = createLocalVue()
    localVue.use(KTable)
    // const Ctor = localVue.extend(Table)
    // const vm = new Ctor().$mount()
    // const wrapper = createWrapper(vm)
    const wrapper = mount(Table,{
      localVue
    })
    expect(wrapper.vm.tableData.length).toBe(4)
    setTimeout(() => {
      const buttons = wrapper.findAll('button')
      // console.log(buttons.length);
      // console.log(wrapper.html());
      buttons.at(1).trigger('click')
      expect(wrapper.vm.tableData.length).toBe(3)
      done()
    }, 10); 
  })

  it('KTable 排序功能是否实现',(done) => {
    const localVue = createLocalVue()
    localVue.use(KTable)
    // const Ctor = localVue.extend(Table)
    // const vm = new Ctor().$mount()
    // const wrapper = createWrapper(vm)
    const wrapper = mount(Table,{
      localVue
    })
    // console.log(wrapper.findComponent({name:'k-table'}).vm.sourceData.map(item=>item.date));
    expect(wrapper.findComponent({name:'k-table'}).vm.sourceData.map(item=>item.date)).toEqual([...ascendingDates].reverse())
    setTimeout(() => {
      const sortIcons = wrapper.findAll('.sortIcon')
      sortIcons.at(0).trigger('click')
      // console.log(wrapper.findComponent({name:'k-table'}).vm.sourceData.map(item=>item.date));
      expect(wrapper.findComponent({name:'k-table'}).vm.sourceData.map(item=>item.date)).toEqual(ascendingDates)
      // expect(init).toEqual(ascendingDates)
      sortIcons.at(0).trigger('click')
      // console.log(wrapper.findComponent({name:'k-table'}).vm.sourceData.map(item=>item.date));
      expect(wrapper.findComponent({name:'k-table'}).vm.sourceData.map(item=>item.date)).toEqual(originDates)
      done()
    }, 10);
    
   
    // buttons.at(1).trigger('click')
    // expect(wrapper.vm.tableData.length).toBe(3)
  })

})

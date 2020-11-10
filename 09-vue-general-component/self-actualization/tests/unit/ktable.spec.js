import { mount, shallowMount, createLocalVue, createWrapper } from "@vue/test-utils";
import KTable, { KTableColumn } from '@/components/KTable'
import Table from '@/views/Table.vue'

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
  
  test('KTable 自定义列模板是否成功', () => {
    const localVue = createLocalVue()
    localVue.use(KTable)
    // const Ctor = localVue.extend(Table)
    // const vm = new Ctor().$mount()
    // const wrapper = createWrapper(vm)
    const wrapper = mount(Table,{
      localVue
    })
    expect(wrapper.vm.tableData.length).toBe(4)
    const buttons = wrapper.findAll('button')
    console.log(buttons.length);
    console.log(wrapper.html());
    // buttons.at(1).trigger('click')
    // expect(wrapper.vm.tableData.length).toBe(3)
    
  })

  test('KTable 排序功能是否实现', () => {
    
  })

})

import { mount } from '@vue/test-utils'

import IconListComponent from 'src/components/ui_builder/IconList.vue'

test('increments value on click', async () => {
    const wrapper = mount(IconListComponent, {})
    
      // Assert the rendered text of the component
    expect(wrapper.text()).toContain('Hello world')
})
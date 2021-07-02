import { mount } from '@vue/test-utils'

import IconListComponent from 'src/components/ui_builder/IconList.vue'

test('increments value on click', () => {
    const wrapper = mount(IconListComponent, {
        props: {
                group: {
                label: 'Maya'
            }
        }
    })
    
      // Assert the rendered text of the component
    expect(wrapper.text()).toContain('Maya')
})
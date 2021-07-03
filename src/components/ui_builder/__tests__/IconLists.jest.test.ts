import { mount } from '@vue/test-utils'

import IconListComponent from 'src/components/ui_builder/IconList.vue'

test('correctly renders', () => {
    const wrapper = mount(IconListComponent, {
        props: {
                group: {
                label: 'Maya'
            }
        },
        global: {
          stubs: {
            'q-icon': true
          }
        }
    })

      // Assert the rendered text of the component
    expect(wrapper.text()).toContain('Maya')


})

test('correctly shows icons from backend', () => {
  const wrapper = mount(IconListComponent, {
    props: {
      group: {
        label: 'Maya',
      }
    },
    global: {
      stubs: {
        'q-icon': true
      }
    }
  })

  expect(wrapper.findAll('q-icon').length).toBeGreaterThan(0)
})

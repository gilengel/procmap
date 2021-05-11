import { mountFactory } from '@quasar/quasar-app-extension-testing-unit-jest';
import ToggleButton from '../ToggleButton.vue'
import { QBtn } from 'quasar';
import { } from 'src/router'

const factory = mountFactory(ToggleButton, {
  // mount: { type: 'full' } <= uncomment this line to use `mount`; `shallowMount` is used by default as it will stub all **registered** components found into the template
  quasar: { components: { QBtn } },
});

describe('ToggleButton', () => {
  // DUMMY test, you should remove this and add your own tests
  test('mounts without errors', () => {
    const wrapper = factory(); // <= when no props are needed
    // const wrapper = factory({ propName: propValue }); <= when props are needed
    expect(wrapper).toBeTruthy();
  });
});

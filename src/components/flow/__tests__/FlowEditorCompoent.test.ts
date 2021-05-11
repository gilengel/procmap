import { mountFactory } from '@quasar/quasar-app-extension-testing-unit-jest';
import FlowEditorComponent from '../FlowEditorDock.vue'
import { QToolbar, QToolbarTitle, QList } from 'quasar';
import { } from 'src/router'

const factory = mountFactory(FlowEditorComponent, {
  // mount: { type: 'full' } <= uncomment this line to use `mount`; `shallowMount` is used by default as it will stub all **registered** components found into the template
  quasar: { components: { QToolbar, QToolbarTitle, QList } },
});

describe('FlowEditorComponent', () => {
  // DUMMY test, you should remove this and add your own tests
  test('mounts with valid properties', () => {
    //const wrapper = factory(); // <= when no props are needed
    const wrapper = factory();
    expect(wrapper).toBeTruthy();
  });

});

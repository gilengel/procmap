/* eslint-disable no-inner-declarations */
declare module 'rete-vue-render-plugin' {
    import Vue from 'vue'
    import { NodeEditor } from 'Rete'

    export interface mixin{
      props: [],
      methods: any,
      directives: any
    }

    export function createVue(el: HTMLElement, vueComponent: string, vueProps: Record<string, unknown>, options: Record<string, unknown>): Vue
    export function createNode(editor: NodeEditor, CommonVueComponent: any, obj: Record<string, unknown>, options: Record<string, unknown>): Vue
    export function createControl(editor: NodeEditor, obj: any, options: Record<string, unknown>): Vue
    export function install(editor: NodeEditor, obj: any): void

    export const name = 'vue-render'
}

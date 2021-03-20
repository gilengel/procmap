import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';

interface IPosition {
  x: number;
  y: number;
}

interface ISize {
  w: number;
  h: number;
}

interface IWidget extends IPosition, ISize {
  i: number;
  component: string;
  properties?: any;
  static: boolean;
}

@Module
export default class Layout extends VuexModule {
  widgets: Map<number, IWidget> = new Map();

  @Mutation
  addWidget(widget: IWidget) {
    this.widgets.set(widget.i, widget);
  }

  @Mutation
  removeWidget(widget: IWidget) {
    const l = this.widgets.get(widget.i);
    if(l === undefined) {
      throw `Layout.removeWidget failed because no widget is registered with the id ${widget.i}`
    }

    this.widgets.delete(widget.i)
  }
}

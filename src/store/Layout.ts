import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';

export interface IPosition {
  x: number;
  y: number;
}

export interface ISize {
  w: number;
  h: number;
}

export interface IWidget extends IPosition, ISize {
  i?: number;
  component: string;
  properties?: any;
  static: boolean;
}

@Module
export default class Layout extends VuexModule {
  widgets: Map<number, IWidget> = new Map();
  widgetsCount: number = 0;

  @Mutation
  _addWidget(widget: IWidget) {
    if(widget === undefined) {
      throw `Store.Layout.addWidget failed becase no widget was passed as parameter`
    }

    let count = this.widgetsCount;
    this.widgetsCount = count + 1;
    widget.i = count;
    this.widgets.set(count, widget);
  }

  @Mutation
  _removeWidget(widget: IWidget) {
    const l = this.widgets.get(widget.i);
    if(l === undefined) {
      throw `Store.Layout.removeWidget failed because no widget is registered with the id ${widget.i}`
    }

    this.widgets.delete(widget.i)
  }


  @Action
  addWidget(widget: IWidget) {
    this.context.commit('_addWidget', widget);
  }

  @Action
  removeWidget(widget: IWidget) {
    this.context.commit('_removeWidget', widget);
  }
}

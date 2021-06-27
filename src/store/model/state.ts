
export interface IModel {
  uuid: string
  model: Map<string, unknown>
}

export interface ModelStateInterface {
  _models: Array<IModel>,
  modelsCount: number,

}

function state(): ModelStateInterface {
  return {
    _models: [],
    modelsCount: 1,
  }
};

export default state;

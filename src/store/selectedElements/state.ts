
export interface IModel {
  uuid: string
  model: Map<string, unknown>
}

export interface ModelStateInterface {
  /**
   * Holds all selected elements as HTMLElement plus
   * a corresponding model for each element. The model
   * is freely choosable by the user but cannot be null
   * or undefined
   *
   * @private
   * @type {Array<HTMLElement>}
   * @memberof SelectedElements
   */
   _selectedElements: Array<string>;

   /**
    * Holds all selected models. The model
    * is freely choosable by the user but cannot be null
    * or undefined. Must have the same length as _selectedElements
    * and both indices correspond to each other
    *
    * @private
    * @type {Array<any>}
    * @memberof SelectedElements
    */
   _selectedModels: Array<unknown>;

}

function state(): ModelStateInterface {
  return {
    _selectedElements: [],
    _selectedModels: [],
  }
};

export default state;

<script lang="ts">
import { Element, ElementAttribute, ElementAttributeType } from 'src/layouts/FormModel'
import { Vue, Prop } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'
import IModel from '../../store/Model'
import copy from '../Copy'

export default class BaseElement extends Vue {
  @Prop({ default: 'uuid' }) uuid!: string

  @Getter('model')
  getModel!: (uuid: string) => IModel

  @Action('updateModel')
  updateModel!: (params: IModel) => void

/*
  get model () {
    return this.getModel(this.uuid)
  }
  */

  @Prop() model!: Element;

  protected getValueOfAttribute(name: String): any {
    const element = this.model as unknown as Element;
    const attribute = element.attributes.find(attribute => attribute.name === name) as ElementAttribute;

    if(attribute === undefined) {
      return undefined;
    }

    return (attribute === undefined) ? undefined : attribute.value
  }

  protected setValueOfAttribute(name: String, value: any): any {
      const attribute = this.model.attributes.find(attribute => attribute.name === name);

      if(attribute) {
        attribute.value = value;
      }
      /*
    let deepCopy = copy(this.model);

    const element = (deepCopy as unknown) as Element;
    const attribute = element.attributes.find(
      attribute => attribute.name === name
    );

    attribute.value = value;

    this.updateModel({
      uuid: this.uuid,
      model: deepCopy
    });
    */
  }
}
</script>

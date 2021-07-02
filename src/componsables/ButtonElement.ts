import { Element } from 'src/models/Grid';
import { computed } from 'vue';
import {
  getValueOfAttribute,
  setValueOfAttribute,
} from 'src/components/ui_builder/BaseElement';

import { Store } from 'vuex';

export default function buttonElement(element: Element, store: Store<unknown>) {
  const type = computed({
    get(): string {
      return getValueOfAttribute('type', element) as string;
    },

    set(value: string) {
      setValueOfAttribute('type', value, element, store);
    },
  });

  const label = computed({
    get(): string {
      return getValueOfAttribute('label', element) as string;
    },

    set(value: string) {
      setValueOfAttribute('label', value, element, store);
    },
  });

  const isHighlighted = computed({
    get(): string {
      return getValueOfAttribute('isHighlighted', element) as string;
    },

    set(value: string) {
      setValueOfAttribute('isHighlighted', value, element, store);
    },
  });

  const icon = computed({
    get(): string {
      return getValueOfAttribute('icon', element) as string;
    },

    set(value: string) {
      setValueOfAttribute('icon', value, element, store);
    },
  });

  const hasIcon = computed({
    get(): string {
      return getValueOfAttribute('hasIcon', element) as string;
    },

    set(value: string) {
      setValueOfAttribute('hasIcon', value, element, store);
    },
  });

  const previewIcon = computed(() => {
    let _icon;

    if (hasIcon.value && icon.value !== '') {
      _icon = icon.value;
    }

    return _icon;
  });

  return {
    label,
    type,
    icon,
    hasIcon,
    previewIcon,
    isHighlighted
  };
}

<template>
  <div class="column option-column">
    <h2 class="text-subtitle2">{{ group.label }}</h2>

    <div class="row">
      <q-icon
        :name="iconString(icon)"
        v-for="(icon, icon_index) in icons"
        :key="icon_index"
        :class="{ selected: selected(icon) }"
        @click="setIcon(icon)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, onMounted, ref } from 'vue'
import getIconsFromBackend, { Icon } from 'src/componsables/GetIconsFormBackend'
interface IconGroup {
    label: string
}

export default defineComponent({
    props: {
        group: {
            required: true,
            type: Object as PropType<IconGroup>
        }
    },

    setup(_, context) {
      const { status, icons, onFetch } = getIconsFromBackend('https://gist.githubusercontent.com/lukethacoder/e1a277c16f36cbbb76ffe8105de9d3ab/raw/b4751a329400642f7847d5f9953db649a820b7e7/line-awesome-array-objects.json')

      const iconString = (icon: Icon) => {
        return `las ${icon.type}-${icon.name}`
      }

      const setIcon = (icon: Icon) => {
        iconInput.value = iconString(icon)
        context.emit('setIcon', iconInput.value)
      }

      const iconInput = ref('');


      const selected = (icon: Icon) => {
        return iconString(icon) === iconInput.value;
      }

      onMounted(() => { onFetch(); })
      return {
        status,
        icons,
        setIcon,
        selected,
        iconString
      }
    }
})
</script>

<style lang="scss" scoped>
i {
  font-size: 2em;
  padding: 0.3em;

  border: solid 2px transparent;
  transition: all ease-in 0.2s;
}
.selected {
  color: $primary;
  border: solid 2px $primary;
  background: rgba($primary, 0.1);
  border-radius: 6px;
}
</style>

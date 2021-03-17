<template>
<Widget title="Text">
    <div class="editor">
    <editor-menu-bubble :editor="editor" :keep-in-bounds="keepInBounds" v-slot="{ commands, isActive, menu }">
      <div
        class="menububble shadow-3 rounded-borders"
        :class="{ 'is-active': menu.isActive }"
        :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
      >

        <button
          class="menububble__button"
          :class="{ 'is-active': isActive.bold() }"
          @click="commands.bold"
        >
            <q-icon name="las la-marker" />
        </button>

        <button
          class="menububble__button"
          :class="{ 'is-active': isActive.strike() }"
          @click="commands.strike"
        >
            <q-icon name="las la-eraser" />
        </button>

        <button
          class="menububble__button"
          :class="{ 'is-active': isActive.bold() }"
          @click="commands.bold"
        >
            <q-icon name="las la-comments" />
        </button>

      </div>
    </editor-menu-bubble>
   
    <editor-content :editor="editor" class="fooo" />
    </div>
</Widget>
</template>

<script lang="ts">
import Widget from './Widget.vue'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Editor, EditorContent, EditorMenuBubble } from 'tiptap'
import { Bold, Strike } from 'tiptap-extensions'

@Component({
    name: 'TextWidget',

    components: {
      Widget,
      EditorContent,
      EditorMenuBubble
    }
})
export default class TextWidget extends Vue {    
    editor = new Editor({
        content: '<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>',
        extensions: [
          new Bold(),
          new Strike()
        ],
    })

    keepInBounds = true

    beforeDestroy() {
        this.editor.destroy()
    }
}
</script>

<style lang="scss">
    .fooo {
        padding: 2em;
        margin-top: 4em;
    }
    p {
        color: white;
    }

    strong {
        color: $primary;
        font-weight: none;
    }

    s {
        color: $warning;
    }

    .menububble {
        position: absolute;
        background: $dark;
        padding: 0.4em;
        transform: translate(-50%, -40%);
        z-index: 1;

        > button {
            background: transparent;
            border: none;
            color: white;

            font-size: 24px;
        }
    }

    $indicator: 16px;
    .menububble::after {
        content: '';
        width: $indicator;
        height: $indicator;
        background: $dark;
        left: 50%;
        bottom: -$indicator / 2;
        position: absolute;
        transform: translate(-$indicator / 2, 0em) rotate(45deg);
    }
    

    .ProseMirror:focus {
        outline: none;
    }
</style>
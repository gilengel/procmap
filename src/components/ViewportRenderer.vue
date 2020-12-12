<template>
  <div class="vp_renderer">
    <q-toolbar class="bg-black text-white">
      <q-toolbar-title>
        Viewport Preview
      </q-toolbar-title>
      <q-btn flat round dense icon="sim_card" class="q-mr-xs" />
      <q-btn flat round dense icon="gamepad" />
    </q-toolbar>

    <div ref="viewport" class="viewport"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import * as THREE from "three";
export default Vue.extend({
  name: "ViewportRenderer",

  mounted() {
    const self = this
    setTimeout(function() {
      console.log()
      const viewportDOMElement = self.$refs.viewport as HTMLElement;
      const width = viewportDOMElement.clientWidth
      const height = viewportDOMElement.clientHeight
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)

      const renderer = new THREE.WebGLRenderer({ alpha: true })
      renderer.setSize(width, height);
      (self.$refs.viewport as HTMLElement).appendChild(renderer.domElement)

      const geometry = new THREE.BoxGeometry()
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      camera.position.z = 5;

      const animate = function() {
        requestAnimationFrame(animate);

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
      };

      animate();      
    }, 1);
    

  }
});
</script>

<style>
.vp_renderer {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.viewport {
  flex-grow: 2;
}
</style>

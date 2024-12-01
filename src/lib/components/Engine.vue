<script setup lang="ts">
import { EngineEvents, EngineOptions } from 'excalibur';
import { useAttrs, useTemplateRef, watchEffect } from 'vue';
import { provideEngine } from '../composables/useEngine';
import { until } from '@vueuse/core';
import { provideCurrentActor } from '../composables/useCurrentActor';

defineOptions({ inheritAttrs: false });
const props = defineProps<EngineOptions>();
const attrs = useAttrs();

const emit = defineEmits<{
  initialize: [EngineEvents['initialize']];
  visible: [EngineEvents['visible']];
  hidden: [EngineEvents['hidden']];
  start: [EngineEvents['start']];
  stop: [EngineEvents['stop']];
  fallbackgraphicscontext: [EngineEvents['fallbackgraphicscontext']];
  preframe: [EngineEvents['preframe']];
  postframe: [EngineEvents['postframe']];
  preupdate: [EngineEvents['preupdate']];
  postupdate: [EngineEvents['postupdate']];
  predraw: [EngineEvents['predraw']];
  postdraw: [EngineEvents['postdraw']];
}>();

const scene = defineModel<string>('scene');

const canvasEl = useTemplateRef('canvas');

const engine = provideEngine({
  ...props,
  canvasElement: canvasEl,
  emit
});

provideCurrentActor(null);

until(engine)
  .toBeTruthy()
  .then(engine => {
    engine.once('start', () => {
      watchEffect(() => {
        if (scene.value && engine.currentSceneName !== scene.value) {
          engine.goToScene(scene.value);
        }
      });
    });
    engine.director.events.on('navigationend', e => {
      scene.value = e.destinationName;
    });
  });
</script>

<template>
  <canvas ref="canvas" v-bind="attrs" />
  <slot v-if="engine" />
</template>

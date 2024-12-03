<script setup lang="ts">
import { Color, CollisionType } from 'excalibur';
import Actor from './lib/components/Actor.vue';
import { useEngine } from './lib/composables/useEngine';
import { ref } from 'vue';

const engine = useEngine();

const x = ref(150);

engine.value.input.pointers.primary.on('move', e => {
  x.value = e.worldPos.x;
});
</script>

<template>
  <Actor
    :x
    :y="engine.drawHeight - 40"
    :width="200"
    :height="20"
    :color="Color.Chartreuse"
    :collision-type="CollisionType.Fixed"
  />
</template>

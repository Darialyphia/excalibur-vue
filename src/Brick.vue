<script setup lang="ts">
import { Color, CollisionType } from 'excalibur';
import Actor from './lib/components/Actor.vue';

const { x, y, color, width, height } = defineProps<{
  x: number;
  y: number;
  width: number;
  height: number;
  color: Color;
}>();

const emit = defineEmits<{ destroy: [] }>();
</script>

<template>
  <Actor
    :x
    :y
    :width
    :height
    :color
    :collision-type="CollisionType.Active"
    @collisionstart="emit('destroy')"
  />
</template>

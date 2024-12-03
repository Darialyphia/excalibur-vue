<script setup lang="ts">
import { Color } from 'excalibur';
import { useEngine } from './lib/composables/useEngine';
import { Ref, ref } from 'vue';

import Paddle from './Paddle.vue';
import Ball from './Ball.vue';
import Brick from './Brick.vue';

const engine = useEngine();

const bricks = makeBricks();

function makeBricks() {
  const padding = 20;
  const xoffset = 65;
  const yoffset = 20;
  const columns = 5;
  const rows = 3;

  const brickColor = [Color.Violet, Color.Orange, Color.Yellow];
  const brickWidth = engine.value.drawWidth / columns - padding - padding / columns; // px
  const brickHeight = 30;

  const bricks = ref(
    Array.from({ length: rows }, (_, y) =>
      Array.from({ length: columns }, (_, x) => ({
        x: xoffset + x * (brickWidth + padding) + padding,
        y: yoffset + y * (brickHeight + padding) + padding,
        width: brickWidth,
        height: brickHeight,
        color: brickColor[y % brickColor.length]
      }))
    ).flat()
  ) as Ref<
    Array<{
      id: string;
      x: number;
      y: number;
      width: number;
      height: number;
      color: Color;
    }>
  >;

  return bricks;
}
</script>

<template>
  <Paddle />
  <Ball />
  <Brick
    v-for="brick in bricks"
    :key="`${brick.x}.${brick.y}`"
    v-bind="brick"
    @destroy="bricks.splice(bricks.indexOf(brick), 1)"
  />
</template>

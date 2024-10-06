<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { BG_COLOR, HEIGHT, WIDTH } from './constants';
import { DisplayMode, Engine, FadeInOut } from 'excalibur';
import { loader } from './resources';
import { MainScene } from './scenes/main.scene';

const canvas = ref<HTMLCanvasElement>();

onMounted(() => {
  const game = new Engine({
    canvasElement: canvas.value,
    width: WIDTH * 2,
    height: HEIGHT * 2,
    pixelArt: true,
    antialiasing: {
      canvasImageRendering: 'pixelated'
    },
    scenes: {
      main: MainScene
    },
    displayMode: DisplayMode.FitContainerAndFill
  });

  game
    .start('main', {
      inTransition: new FadeInOut({
        direction: 'in',
        color: BG_COLOR,
        duration: 0
      }),
      loader
    })
    .then(() => {
      game.canvas.addEventListener('contextmenu', e => {
        e.preventDefault();
      });
    });
});
</script>

<template>
  <div class="container">
    <canvas ref="canvas" />

    <div class="ui"></div>
  </div>
</template>

<style lang="postcss" scoped>
.container {
  height: 100dvh;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;

  > * {
    grid-column: 1;
    grid-row: 1;
  }
}

.ui {
  pointer-events: none;
}
</style>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { BG_COLOR, HEIGHT, WIDTH } from './constants';
import { DisplayMode, Engine, FadeInOut } from 'excalibur';
import { loader } from './resources';
import { MainScene } from './scenes/main.scene';
import UnitButton from './ui/components/unit-button.vue';
import { resources } from './resources';
import { AsepriteResource } from '@excaliburjs/plugin-aseprite';

const canvas = ref<HTMLCanvasElement>();
const isReady = ref(false);

export type UnitData = {
  name: string;
  resource: AsepriteResource;
};

export type UiState = {
  selectedUnitData: UnitData;
};

const units: UnitData[] = [
  {
    name: 'Footman',
    resource: resources.footman
  },
  {
    name: 'Archer',
    resource: resources.archer
  },
  {
    name: 'Paladin',
    resource: resources.paladin
  }
];

const uiState = ref<UiState>({
  selectedUnitData: units[0]
});

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
    .start('root', {
      inTransition: new FadeInOut({
        direction: 'in',
        color: BG_COLOR,
        duration: 0
      }),
      loader
    })
    .then(() => {
      game.goToScene('main', { sceneActivationData: uiState });
      game.canvas.addEventListener('contextmenu', e => {
        e.preventDefault();
      });
      isReady.value = true;
    });
});
</script>

<template>
  <div class="container">
    <canvas ref="canvas" />

    <div class="ui" v-if="isReady">
      <div class="units">
        <UnitButton
          v-for="unit in units"
          :key="unit.name"
          :unit
          class="ui-component"
          :class="uiState.selectedUnitData.name === unit.name && 'is-selected'"
          @click="uiState.selectedUnitData = unit"
        />
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.container {
  height: 100dvh;
  width: 100vw;
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

.ui-component {
  pointer-events: auto;
}

.units {
  margin: 1.5rem;
  display: flex;
  gap: 1rem;
}

.unit-button {
  transition: all 0.3s;
  &.is-selected {
    box-shadow: 0 3px 10px hsl(0 0 0 / 0.25);
    filter: brightness(125%);
    outline: solid 3px white;
    outline-offset: 0.35rem;
  }
}
</style>

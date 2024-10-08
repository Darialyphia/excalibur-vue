<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';
import { BG_COLOR, HEIGHT, WIDTH } from './constants';
import { DisplayMode, Engine, FadeInOut } from 'excalibur';
import { loader } from './resources';
import { MainScene } from './scenes/main.scene';
import UnitButton from './ui/components/unit-button.vue';
import { resources } from './resources';
import { AsepriteResource } from '@excaliburjs/plugin-aseprite';
import { Unit } from './unit/unit.actor';

const canvas = ref<HTMLCanvasElement>();
const isReady = ref(false);

export type UnitData = {
  name: string;
  speed: number;
  resource: AsepriteResource;
};

export type UiState = {
  selectedUnitData: UnitData | null;
  selectedUnit: Unit | null;
  selectUnitData(unitData: UnitData | null): void;
  selectUnit(unit: Unit | null): void;
};

const units: UnitData[] = [
  { name: 'Footman', speed: 3, resource: resources.footman },
  { name: 'Archer', speed: 3, resource: resources.archer },
  { name: 'Paladin', speed: 3, resource: resources.paladin },
  { name: 'Assassin', speed: 4, resource: resources.assassin },
  { name: 'Mage', speed: 3, resource: resources.mage },
  { name: 'Tank', speed: 2, resource: resources.tank }
];

const uiState = ref<UiState>({
  selectedUnitData: null,
  selectedUnit: null,
  selectUnit(unit) {
    uiState.value.selectedUnit = unit;
    uiState.value.selectedUnitData = null;
  },
  selectUnitData(unitData) {
    if (uiState.value.selectedUnitData === unitData) {
      uiState.value.selectedUnitData = null;
    } else {
      uiState.value.selectedUnitData = unitData;
    }
    uiState.value.selectedUnit = null;
  }
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
          :class="uiState.selectedUnitData?.name === unit.name && 'is-selected'"
          @click="uiState.selectUnitData(unit)"
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
  transition: box-shadow 0.3s, filter 0.3s;
  &.is-selected {
    box-shadow: 0 3px 10px hsl(0 0 0 / 0.25);
    filter: brightness(125%);
    outline: solid 3px white;
  }
}
</style>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import borderUrl from '@/assets/button-border.png';
import { UnitData } from '../../App-old.vue';

const { unit } = defineProps<{
  unit: UnitData;
}>();

const src = ref<string | null>(null);
const width = ref(0);
const height = ref(0);
onMounted(async () => {
  if (!unit.resource.isLoaded) await unit.resource.load();

  const sprite = unit.resource.getSpriteSheet()!.getSprite(0, 0);
  src.value = `url(${sprite.image.path})`;
  width.value = sprite.image.width;
  height.value = sprite.image.height;
});

const border = `url(${borderUrl})`;
</script>

<template>
  <button class="unit-button" :aria-label="unit.name" />
</template>

<style scoped lang="postcss">
.unit-button {
  width: 96px;
  aspect-ratio: 1;
  background: v-bind(src), radial-gradient(#1a1a1a, #1a1a1a 20%, black);
  background-position: center center;
  image-rendering: pixelated;
  background-size: calc(v-bind(width) * 2px) calc(v-bind(height) * 2px);
  border-style: solid;
  border-image: v-bind(border) 8 / 16px;
  cursor: pointer;
}
</style>

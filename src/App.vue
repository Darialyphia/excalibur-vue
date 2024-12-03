<script setup lang="ts">
import Engine from '@/lib/components/Engine.vue';
import Breakout from './Breakout.vue';
</script>

<template>
  <Engine :width="800" :height="600" suppress-console-boot-message>
    <Breakout />
  </Engine>
</template>

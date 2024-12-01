<script setup lang="ts">
import Engine from '@/lib/components/Engine.vue';
import Scene from './lib/components/Scene.vue';
import { ref } from 'vue';
import * as ex from 'excalibur';
import Actor from './lib/components/Actor.vue';

const updatesCount = ref(0);
const currentScene = ref('foo');

class RedCircle extends ex.Actor {
  constructor() {
    super({
      x: 100,
      y: 300,
      radius: 50,
      color: ex.Color.Red
    });
  }
}

class BlueRectangle extends ex.Actor {
  constructor() {
    super({
      x: 100,
      y: 300,
      width: 100,
      height: 100,
      color: ex.Color.Blue
    });
  }
}

const showActors = ref(true);
</script>

<template>
  <Engine
    :width="800"
    :height="600"
    v-model:scene="currentScene"
    @postupdate="updatesCount++"
  >
    <Scene name="foo">
      <Actor v-if="showActors" :actor="RedCircle" />
    </Scene>
    <Scene name="bar">
      <Actor v-if="showActors" :actor="BlueRectangle" />
    </Scene>

    <section class="ui">
      <div>Current scene: {{ currentScene }}</div>
      <div>Updates count: {{ updatesCount }}</div>
      <nav>
        <button @click="currentScene = 'foo'">Go to Foo</button>
        <button @click="currentScene = 'bar'">Go to Bar</button>
      </nav>
      <button @click="showActors = !showActors">
        {{ showActors ? 'Hide actors' : 'Show actors' }}
      </button>
    </section>
  </Engine>
</template>

<style scoped lang="postcss">
.ui {
  padding: 1rem;
  font-family: system-ui;
  background-color: #333;
  color: #eee;

  > nav {
    display: flex;
    gap: 0.5rem;
  }
}
</style>

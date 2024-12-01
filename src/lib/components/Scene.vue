<script setup lang="ts">
import {
  Scene,
  SceneConstructor,
  SceneEvents,
  SceneWithOptions,
  Subscription
} from 'excalibur';
import { useEngine } from '../composables/useEngine';
import { useCurrentSceneName } from '../composables/useCurrentScene';
import { computed } from 'vue';

const props = defineProps<
  Omit<SceneWithOptions, 'scene'> & {
    name: string;
    scene?: Scene | SceneConstructor;
  }
>();

const scene = defineModel();
const emit = defineEmits<{
  initialize: [SceneEvents['initialize']];
  activate: [SceneEvents['activate']];
  deactivate: [SceneEvents['deactivate']];
  preupdate: [SceneEvents['preupdate']];
  postupdate: [SceneEvents['postupdate']];
  predraw: [SceneEvents['predraw']];
  postdraw: [SceneEvents['postdraw']];
  predebugdraw: [SceneEvents['predebugdraw']];
  postdebugdraw: [SceneEvents['postdebugdraw']];
  preload: [SceneEvents['preload']];
}>();

const engine = useEngine();
engine.value.addScene(props.name, { ...props, scene: props.scene ?? Scene });

const currentSceneName = useCurrentSceneName();
const isActive = computed(() => {
  return currentSceneName.value === props.name;
});

let subscriptions: Subscription[] = [];

const setupSubscriptions = () => {
  const inst = engine.value.director.getSceneInstance(props.name);
  if (!inst) return;
  Object.values(SceneEvents).forEach(eventName => {
    subscriptions.push(
      inst.on(eventName, event =>
        //@ts-expect-error
        emit(eventName, event)
      )
    );
  });
};

const cleanupSubscriptions = () => {
  subscriptions.forEach(sub => sub.close());
  subscriptions = [];
};

engine.value.director.events.on('navigationstart', e => {
  cleanupSubscriptions();
  if (e.destinationName === props.name) {
    setupSubscriptions();
  }
});
</script>

<template>
  <slot v-if="isActive" />
</template>

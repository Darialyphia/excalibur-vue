<script setup lang="ts">
import { Entity, EntityEvents, Actor as ExActor } from 'excalibur';
import { provideCurrentActor, useCurrentActor } from '../composables/useCurrentActor';
import { useCurrentScene } from '../composables/useCurrentScene';
import { onBeforeUnmount } from 'vue';
import { ActorEvents } from 'excalibur/build/dist/Actor';

export type ActorConstructor = new (...args: any[]) => ExActor;

const props = defineProps<{
  actor?: ActorConstructor;
}>();

const emit = defineEmits<{
  initialize: [ActorEvents['initialize']];
  actionStart: [ActorEvents['actionstart']];
  actioncomplete: [ActorEvents['actioncomplete']];
  collisionstart: [ActorEvents['collisionstart']];
  collisionend: [ActorEvents['collisionend']];
  enterviewport: [ActorEvents['enterviewport']];
  exitviewport: [ActorEvents['exitviewport']];
  kill: [ActorEvents['kill']];
  prekill: [ActorEvents['prekill']];
  postkill: [ActorEvents['postkill']];
  pointercancel: [ActorEvents['pointercancel']];
  pointerdown: [ActorEvents['pointerdown']];
  pointerup: [ActorEvents['pointerup']];
  pointerenter: [ActorEvents['pointerenter']];
  pointerleave: [ActorEvents['pointerleave']];
  pointermove: [ActorEvents['pointermove']];
  pointerwheel: [ActorEvents['pointerwheel']];
  pointerdragenter: [ActorEvents['pointerdragenter']];
  pointerdragleave: [ActorEvents['pointerdragleave']];
  pointerdragmove: [ActorEvents['pointerdragmove']];
  pointerdragstart: [ActorEvents['pointerdragstart']];
  pointerdragend: [ActorEvents['pointerdragend']];
  preupdate: [ActorEvents['preupdate']];
  postupdate: [ActorEvents['postupdate']];
  predraw: [ActorEvents['predraw']];
  postdraw: [ActorEvents['postdraw']];
  predebugdraw: [ActorEvents['predebugdraw']];
  postdebugdraw: [ActorEvents['postdebugdraw']];
  pretransformdraw: [ActorEvents['pretransformdraw']];
  posttransformdraw: [ActorEvents['posttransformdraw']];
}>();

const actorInst = new (props.actor ?? ExActor)();

// importing the ActorEvents causes a weird esbuild error, so lets list them manually
const events = [
  'initialize',
  'actionstart',
  'actioncompleted',
  'collisionstart',
  'collisionend',
  'enterviewport',
  'exitviewport',
  'kill',
  'prekill',
  'postkill',
  'pointercancel',
  'pointerdown',
  'pointerup',
  'pointerenter',
  'pointerleave',
  'pointermove',
  'pointerwheel',
  'pointerdragenter',
  'pointerdragleave',
  'pointerdragstart',
  'pointerdragend',
  'pointerdragmove',
  'preupdate',
  'postupdate',
  'predraw',
  'postdraw',
  'predebugdraw',
  'postdebugdraw',
  'pretransformdraw',
  'posttransformdraw'
];
events.forEach(eventName => {
  actorInst.on(eventName, event => {
    // @ts-expect-error
    emit(eventName, event);
  });
});
const parent = useCurrentActor();
const currentScene = useCurrentScene();

if (parent) {
  parent.addChild(actorInst);
} else {
  currentScene.value.add(actorInst);
}

provideCurrentActor(actorInst);
onBeforeUnmount(actorInst.kill.bind(actorInst));
</script>

<template>
  <slot />
</template>

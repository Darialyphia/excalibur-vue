<script setup lang="ts" generic="T extends ExActor = ExActor">
import { CollisionType, Actor as ExActor, vec } from 'excalibur';
import { provideCurrentActor, useCurrentActor } from '../composables/useCurrentActor';
import { useForwardProps } from '../composables/useForwardProps';
import { useCurrentScene } from '../composables/useCurrentScene';
import { computed, onBeforeUnmount, watch, watchEffect } from 'vue';
import { ActorArgs, ActorEvents } from 'excalibur/build/dist/Actor';
import { isDefined } from '../utils/helpers';

export type ActorConstructor<T extends ExActor = ExActor> = new (...args: any[]) => T;

const props = defineProps<
  Omit<ActorArgs, 'vel'> & {
    actor?: ActorConstructor<T>;
    vel?: [number, number];
    velX?: number;
    velY?: number;
    collisionType?: CollisionType;
  }
>();

const emit = defineEmits<{
  initialize: [ActorEvents['initialize'], T];
  actionStart: [ActorEvents['actionstart'], T];
  actioncomplete: [ActorEvents['actioncomplete'], T];
  collisionstart: [ActorEvents['collisionstart'], T];
  collisionend: [ActorEvents['collisionend'], T];
  enterviewport: [ActorEvents['enterviewport'], T];
  exitviewport: [ActorEvents['exitviewport'], T];
  kill: [ActorEvents['kill'], T];
  prekill: [ActorEvents['prekill'], T];
  postkill: [ActorEvents['postkill'], T];
  pointercancel: [ActorEvents['pointercancel'], T];
  pointerdown: [ActorEvents['pointerdown'], T];
  pointerup: [ActorEvents['pointerup'], T];
  pointerenter: [ActorEvents['pointerenter'], T];
  pointerleave: [ActorEvents['pointerleave'], T];
  pointermove: [ActorEvents['pointermove'], T];
  pointerwheel: [ActorEvents['pointerwheel'], T];
  pointerdragenter: [ActorEvents['pointerdragenter'], T];
  pointerdragleave: [ActorEvents['pointerdragleave'], T];
  pointerdragmove: [ActorEvents['pointerdragmove'], T];
  pointerdragstart: [ActorEvents['pointerdragstart'], T];
  pointerdragend: [ActorEvents['pointerdragend'], T];
  preupdate: [ActorEvents['preupdate'], T];
  postupdate: [ActorEvents['postupdate'], T];
  predraw: [ActorEvents['predraw'], T];
  postdraw: [ActorEvents['postdraw'], T];
  predebugdraw: [ActorEvents['predebugdraw'], T];
  postdebugdraw: [ActorEvents['postdebugdraw'], T];
  pretransformdraw: [ActorEvents['pretransformdraw'], T];
  posttransformdraw: [ActorEvents['posttransformdraw'], T];
}>();

const ctor = props.actor ?? ExActor;
const forwardedProps = useForwardProps(props);
const vel = computed(() => {
  if (!isDefined(props.vel) && !isDefined(props.velX) && !isDefined(props.velY))
    return undefined;
  if (isDefined(props.vel)) {
    return vec(props.vel[0], props.vel[1]);
  }
  return vec(props.velX ?? 0, props.velY ?? 0);
});

const actorInst = new ctor({
  ...forwardedProps.value,
  vel: vel.value
});
watch(
  () => props.x,
  x => {
    if (isDefined(x)) actorInst.pos.x = x;
  }
);
watch(
  () => props.y,
  y => {
    if (isDefined(y)) actorInst.pos.y = y;
  }
);
watch(
  () => props.collisionType,
  collisionType => {
    if (isDefined(collisionType)) actorInst.body.collisionType = collisionType;
  }
);
watchEffect(() => {
  if (isDefined(props.color)) actorInst.color = props.color;
  if (isDefined(vel.value)) {
    actorInst.vel = vel.value;
  }
  if (isDefined(props.opacity)) actorInst.graphics.opacity = props.opacity;
  if (isDefined(props.anchor)) actorInst.anchor = props.anchor;
});

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
    emit(eventName, event, actorInst);
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

defineExpose({ actor: actorInst });
</script>

<template>
  <slot />
</template>

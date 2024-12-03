<script setup lang="ts">
import { Color, CollisionType, Actor as ExActor, CollisionStartEvent } from 'excalibur';
import Actor from './lib/components/Actor.vue';
import { useEngine } from './lib/composables/useEngine';
import { ref } from 'vue';
import { useTrack } from './lib/composables/useTrack';

const engine = useEngine();

const baseSpeed = [100, 100] as const;
const speed = ref<[number, number]>([0, 0]);
const isColliding = ref(false);
const ballActor = ref<{ actor: ExActor }>();

const x = useTrack(() => ballActor.value?.actor.pos.x, 100);
const y = useTrack(() => ballActor.value?.actor.pos.y, 300);
setTimeout(() => {
  speed.value = [100, -100];
}, 1000);

const handleWallBounce = (ball: ExActor) => {
  if (ball.pos.x < ball.width / 2) {
    speed.value[0] = baseSpeed[0];
  }

  if (ball.pos.x + ball.width / 2 > engine.value.drawWidth) {
    speed.value[0] = baseSpeed[0] * -1;
  }

  if (ball.pos.y < ball.height / 2) {
    speed.value[1] = baseSpeed[1];
  }
};

const handleCollision = (e: CollisionStartEvent<ExActor>) => {
  const intersection = e.contact.mtv.normalize();

  if (isColliding.value) return;
  isColliding.value = true;

  if (Math.abs(intersection.x) > Math.abs(intersection.y)) {
    speed.value[0] *= -1;
  } else {
    speed.value[1] *= -1;
  }
};

const gameOver = () => {
  alert('You lose !');
};
</script>

<template>
  <Actor
    ref="ballActor"
    :x
    :y
    :radius="10"
    :color="Color.Red"
    :vel="speed"
    :collision-type="CollisionType.Passive"
    @exitviewport="gameOver"
    @postupdate="(_, ball) => handleWallBounce(ball)"
    @collisionstart="handleCollision"
    @collisionend="isColliding = false"
  />
</template>

import { onUnmounted, ref, shallowRef } from 'vue';
import { useEngine } from './useEngine';
import { Scene } from 'excalibur';

export const useCurrentScene = <T = unknown>() => {
  const engine = useEngine();
  const scene = shallowRef<Scene<T>>(engine.value.currentScene);

  const sub = engine.value.director.events.on('navigationend', () => {
    scene.value = engine.value.currentScene;
  });

  onUnmounted(sub.close);
  return scene;
};

export const useCurrentSceneName = () => {
  const engine = useEngine();
  const scene = ref(engine.value.currentSceneName);

  const sub = engine.value.director.events.on('navigationend', e => {
    scene.value = e.destinationName;
  });

  onUnmounted(sub.close);

  return scene;
};

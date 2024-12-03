import { onUnmounted, ref } from 'vue';
import { useEngine } from './useEngine';

type OmitUndef<T> = Exclude<T, undefined>;

export const useTrack = <T>(getter: () => T, defaultValue: OmitUndef<T>) => {
  const tracked = ref(defaultValue);

  const engine = useEngine();
  const sub = engine.value.on('postupdate', () => {
    tracked.value = getter() ?? defaultValue;
  });

  onUnmounted(sub.close);

  return tracked;
};

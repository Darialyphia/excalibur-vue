import { Engine, EngineEvents, EngineOptions, Loader, Subscription } from 'excalibur';
import {
  InjectionKey,
  onUnmounted,
  provide,
  Ref,
  ShallowRef,
  shallowRef,
  watch
} from 'vue';
import { useSafeInject } from './useSafeInject';
import { Override } from '../types';
import { stripUndefined } from '../utils/helpers';

type EngineContext = ShallowRef<Engine>;

const ENGINE_INJECTION_KEY = Symbol('engine') as InjectionKey<EngineContext>;

export const provideEngine = (
  opts: Override<
    EngineOptions,
    {
      canvasElement: Ref<HTMLCanvasElement | null>;
      loader?: Loader;
      emit: (...args: any[]) => void;
      initialScene?: string;
    }
  >
) => {
  const engine = shallowRef<Engine>();
  const subscriptions: Subscription[] = [];
  const unwatch = watch(opts.canvasElement, canvas => {
    if (!canvas) return;
    const { emit, ...rest } = opts;
    engine.value = new Engine({ ...stripUndefined(rest), canvasElement: canvas });

    Object.values(EngineEvents).forEach(eventName => {
      subscriptions.push(engine.value!.on(eventName, event => emit(eventName, event)));
    });

    engine.value.start(opts.loader).then(() => {
      if (opts.initialScene) {
        engine.value?.goToScene(opts.initialScene);
      }
    });
    unwatch();
  });

  provide(ENGINE_INJECTION_KEY, engine as EngineContext);

  onUnmounted(() => {
    subscriptions.forEach(sub => sub.close());
  });

  return engine;
};

export const useEngine = () => {
  return useSafeInject(ENGINE_INJECTION_KEY);
};

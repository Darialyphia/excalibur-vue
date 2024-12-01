import { Actor } from 'excalibur';
import { inject, InjectionKey, provide } from 'vue';

export type CurrentActorContext = Actor | null;
export const CURRENT_ACTOR_INJECTION_KEY = Symbol(
  'currentActor'
) as InjectionKey<CurrentActorContext>;

export const provideCurrentActor = (actor: Actor | null) => {
  provide(CURRENT_ACTOR_INJECTION_KEY, actor);
};

export const useCurrentActor = () => {
  return inject(CURRENT_ACTOR_INJECTION_KEY);
};

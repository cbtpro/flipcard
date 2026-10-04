import type { FlipAnimationProps } from '@flipcard/vue';

export const flightStatuses = [
  { value: 'BOARDING', label: '登机', color: '#75d698' },
  { value: 'ON TIME', label: '准点', color: '#e8e7df' },
  { value: 'WAITING', label: '等待', color: '#efc66a' },
] as const;

export type DemoId = 'alphabet' | 'clock' | 'airport' | 'card' | 'countdown';
export function createDemoState(id: DemoId) {
  return {
    mode: 'index' as 'index' | 'value',
    itemsText: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').join(','),
    auto: true,
    hourFormat: '24' as '24' | '12',
    countdown: { seconds: 300, remaining: 300, running: false },
    tick: 0,
    time: new Date(),
    boardColors: { background: '#15181b', text: '#e8e7df' },
    statusColors: Object.fromEntries(flightStatuses.map(status => [status.value, status.color])) as Record<string, string>,
    card: { trigger: 'hover' as 'hover' | 'click', flipped: false },
    config: {
      currentIndex: 0, currentValue: 'A', duration: id === 'airport' ? 160 : 600,
      width: id === 'airport' ? 22 : 60, height: id === 'airport' ? 34 : 90,
      fontSize: id === 'airport' ? 25 : 64, theme: 'dark' as 'dark' | 'light',
      paused: false, respectReducedMotion: false, sound: true, volume: 0.15, flipMode: 'direct' as 'direct' | 'sequential',
      flipOrder: 'simultaneous' as 'simultaneous' | 'sequential', sequenceIndex: 0, stagger: id === 'alphabet' ? 240 : 80,
    },
  };
}
export type DemoState = ReturnType<typeof createDemoState>;
export function animationProps(state: DemoState, active: boolean): FlipAnimationProps {
  const { currentIndex: _index, currentValue: _value, ...props } = state.config;
  return { ...props, paused: props.paused || !active };
}
export function alphabetProps(state: DemoState, active: boolean): FlipAnimationProps {
  return {
    ...animationProps(state, active),
    items: state.itemsText.split(',').map(item => item.trim()).filter(Boolean),
    currentIndex: state.mode === 'index' ? state.config.currentIndex : undefined,
    currentValue: state.mode === 'value' ? state.config.currentValue : undefined,
  };
}

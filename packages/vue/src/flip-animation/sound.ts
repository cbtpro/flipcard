interface SoundVoice {
  time: number;
  duration: number;
  owners: Set<symbol>;
  sources: AudioBufferSourceNode[];
  gain: GainNode;
}
let context: AudioContext | undefined;
let users = 0;
let samples: { paper: AudioBuffer; contact: AudioBuffer }[] = [];
let variation = 0;
const voices = new Set<SoundVoice>();

/** 生成带摩擦起伏的纸片噪声和短促卡片碰撞声。 */
function createSamples(audio: AudioContext, seed: number) {
  let randomState = seed;
  const random = () => {
    randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0;
    return randomState / 0x100000000 * 2 - 1;
  };
  const paper = audio.createBuffer(1, Math.ceil(audio.sampleRate * 0.12), audio.sampleRate);
  const contact = audio.createBuffer(1, Math.ceil(audio.sampleRate * 0.045), audio.sampleRate);
  let low = 0;
  let previous = 0;
  const rustle = paper.getChannelData(0);
  for (let i = 0; i < rustle.length; i++) {
    const progress = i / rustle.length;
    const noise = random();
    low += 0.12 * (noise - low);
    const texture = (noise - previous) * 0.12 + low * 1.2;
    previous = noise;
    const envelope = Math.sin(Math.PI * progress) ** 1.4;
    const folds = 0.65 + 0.35 * Math.sin(progress * 34 + seed);
    rustle[i] = texture * envelope * folds * 0.8;
  }
  low = 0;
  const impact = contact.getChannelData(0);
  for (let i = 0; i < impact.length; i++) {
    const time = i / audio.sampleRate;
    low += 0.35 * (random() - low);
    const attack = Math.min(1, time / 0.0015);
    const body = Math.sin(2 * Math.PI * 145 * time) * 0.15 + Math.sin(2 * Math.PI * 310 * time) * 0.08;
    impact[i] = attack * (low * Math.exp(-time * 150) * 0.9 + body * Math.exp(-time * 105));
  }
  return { paper, contact };
}

/** 注册音频使用者，最后一个实例释放时关闭共享音频上下文。 */
export function retainSound() {
  users++;
  return () => {
    if (--users !== 0) return;
    for (const voice of voices) stopVoice(voice);
    void context?.close().catch(() => {});
    context = undefined;
    samples = [];
  };
}

/** 在用户点击或键盘操作后启用声音。 */
export function unlockSound() {
  try {
    if (!context) {
      context = new AudioContext();
      samples = Array.from({ length: 6 }, (_, i) => createSamples(context!, 7919 + i * 104729));
    }
    void context.resume().catch(() => {});
  } catch {
    return;
  }
}

/** 取消一个已没有使用者的声音及其尚未开始的落片声。 */
function stopVoice(voice: SoundVoice) {
  for (const source of voice.sources) {
    source.onended = null;
    source.stop();
    source.disconnect();
  }
  voice.gain.disconnect();
  voices.delete(voice);
}

/** 播放摩擦与落片声；同帧多实例共享声音，返回该实例的取消方法。 */
export function playSound(volume: number, duration: number): () => void {
  if (!context || context.state !== 'running' || duration <= 0 || volume <= 0) return () => {};
  const audio = context;
  const owner = Symbol();
  const level = Math.min(1, Math.max(0, volume));
  let voice = [...voices].find(item => audio.currentTime - item.time < 0.008 && item.duration === duration);
  if (voice) {
    voice.owners.add(owner);
    voice.gain.gain.value = Math.max(level, voice.gain.gain.value);
  } else {
    const sample = samples[variation++ % samples.length];
    const gain = audio.createGain();
    gain.gain.value = level;
    gain.connect(audio.destination);
    voice = { time: audio.currentTime, duration, owners: new Set([owner]), sources: [], gain };
    voices.add(voice);
    const created = voice;
    const half = duration / 2000;
    const friction = Math.min(0.18, Math.max(0.016, half));
    for (const [buffer, offset, length] of [[sample.paper, Math.max(0, half - friction), friction], [sample.contact, half, Math.min(0.045, half)]] as const) {
      const source = audio.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = buffer.duration / length;
      source.connect(gain);
      created.sources.push(source);
      source.start(audio.currentTime + offset);
    }
    created.sources[1].onended = () => {
      if (voices.has(created)) stopVoice(created);
    };
  }
  const owned = voice;
  return () => {
    owned.owners.delete(owner);
    if (owned.owners.size === 0 && voices.has(owned)) stopVoice(owned);
  };
}

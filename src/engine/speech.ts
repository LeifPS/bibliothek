/** Read-aloud via the browser's built-in German voice, if one exists. */
let voice: SpeechSynthesisVoice | null = null;
const listeners: (() => void)[] = [];

function pickVoice() {
  if (!('speechSynthesis' in window)) return;
  const vs = speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('de'));
  voice = vs.find((v) => /anna|petra|helena|katja|google/i.test(v.name)) ?? vs[0] ?? null;
  listeners.forEach((l) => l());
}

if ('speechSynthesis' in window) {
  pickVoice();
  speechSynthesis.addEventListener?.('voiceschanged', pickVoice);
}

export const canSpeak = () => !!voice;
export const onVoices = (cb: () => void) => listeners.push(cb);

export function speak(text: string) {
  if (!voice) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/[–—]/g, ', '));
  u.voice = voice;
  u.lang = voice.lang;
  u.rate = 0.92;
  u.pitch = 1.05;
  speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}

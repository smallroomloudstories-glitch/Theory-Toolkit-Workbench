const NOTE_TO_PITCH_CLASS = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  "E#": 5,
  Fb: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
  Cb: 11
};

let audioContext;
let masterCompressor;
let activeVoices = [];
const keyboardVoices = new Map();

const midiToFrequency = midi => 440 * (2 ** ((midi - 69) / 12));

function getAudioContext() {
  if (!audioContext) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();

    masterCompressor = audioContext.createDynamicsCompressor();
    masterCompressor.threshold.setValueAtTime(-18, audioContext.currentTime);
    masterCompressor.knee.setValueAtTime(12, audioContext.currentTime);
    masterCompressor.ratio.setValueAtTime(4, audioContext.currentTime);
    masterCompressor.attack.setValueAtTime(0.005, audioContext.currentTime);
    masterCompressor.release.setValueAtTime(0.2, audioContext.currentTime);
    masterCompressor.connect(audioContext.destination);
  }
  return audioContext;
}

function releaseActiveVoices(context) {
  const now = context.currentTime;
  activeVoices.forEach(({ gain, oscillators }) => {
    if (typeof gain.gain.cancelAndHoldAtTime === "function") {
      gain.gain.cancelAndHoldAtTime(now);
    } else {
      const currentLevel = Math.max(gain.gain.value, 0.0001);
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(currentLevel, now);
    }
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.065);
    oscillators.forEach(oscillator => oscillator.stop(now + 0.08));
  });
  activeVoices = [];
}

function createVoice(context, destination, midi, startTime, level = 1) {
  const gain = context.createGain();
  const filter = context.createBiquadFilter();
  const frequency = midiToFrequency(midi);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2400, startTime);
  filter.Q.setValueAtTime(0.55, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(0.17 * level, startTime + 0.032);
  gain.gain.exponentialRampToValueAtTime(0.075 * level, startTime + 0.48);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.15);

  gain.connect(filter);
  filter.connect(destination);

  const components = [
    { type: "triangle", ratio: 1, level: 1 },
    { type: "sine", ratio: 2, level: 0.16 }
  ];

  const oscillators = components.map(component => {
    const oscillator = context.createOscillator();
    const componentGain = context.createGain();
    oscillator.type = component.type;
    oscillator.frequency.setValueAtTime(frequency * component.ratio, startTime);
    componentGain.gain.setValueAtTime(component.level, startTime);
    oscillator.connect(componentGain);
    componentGain.connect(gain);
    oscillator.start(startTime);
    oscillator.stop(startTime + 2.2);
    return oscillator;
  });

  return { gain, oscillators };
}

function createKeyboardVoice(context, destination, midi, startTime) {
  const gain = context.createGain();
  const filter = context.createBiquadFilter();
  const frequency = midiToFrequency(midi);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2200, startTime);
  filter.Q.setValueAtTime(0.5, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(0.14, startTime + 0.028);
  gain.gain.exponentialRampToValueAtTime(0.07, startTime + 0.42);
  gain.connect(filter);
  filter.connect(destination);

  const components = [
    { type: "triangle", ratio: 1, level: 1 },
    { type: "sine", ratio: 2, level: 0.13 }
  ];
  const oscillators = components.map(component => {
    const oscillator = context.createOscillator();
    const componentGain = context.createGain();
    oscillator.type = component.type;
    oscillator.frequency.setValueAtTime(frequency * component.ratio, startTime);
    componentGain.gain.setValueAtTime(component.level, startTime);
    oscillator.connect(componentGain);
    componentGain.connect(gain);
    oscillator.start(startTime);
    return oscillator;
  });

  return { gain, oscillators };
}

function fadeAndStopVoice(context, voice, releaseTime = 0.08) {
  const now = context.currentTime;
  if (typeof voice.gain.gain.cancelAndHoldAtTime === "function") {
    voice.gain.gain.cancelAndHoldAtTime(now);
  } else {
    const currentLevel = Math.max(voice.gain.gain.value, 0.0001);
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(currentLevel, now);
  }
  voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + releaseTime);
  voice.oscillators.forEach(oscillator => oscillator.stop(now + releaseTime + 0.02));
}

export function triadMidiNotes(rootName, quality) {
  const pitchClass = NOTE_TO_PITCH_CLASS[rootName];
  if (pitchClass === undefined) throw new Error(`Unknown note name: ${rootName}`);

  const root = 48 + pitchClass;
  return triadMidiNotesFromRoot(root, quality);
}

export function ascendingMidiNote(tonicName, noteName) {
  const tonicPitchClass = NOTE_TO_PITCH_CLASS[tonicName];
  const notePitchClass = NOTE_TO_PITCH_CLASS[noteName];
  if (tonicPitchClass === undefined) throw new Error(`Unknown tonic name: ${tonicName}`);
  if (notePitchClass === undefined) throw new Error(`Unknown note name: ${noteName}`);

  const tonic = 48 + tonicPitchClass;
  const distanceFromTonic = (notePitchClass - tonicPitchClass + 12) % 12;
  return tonic + distanceFromTonic;
}

export function triadMidiNotesFromRoot(root, quality) {
  const intervals = quality === "diminished"
    ? [0, 3, 6]
    : quality === "minor"
      ? [0, 3, 7]
      : [0, 4, 7];

  return intervals.map(interval => root + interval);
}

export function dominantSeventhMidiNotesFromRoot(root) {
  return [0, 4, 7, 10].map(interval => root + interval);
}

async function playMidiNotes(midiNotes, voiceLevels = []) {
  const context = getAudioContext();
  if (context.state === "suspended") await context.resume();

  releaseActiveVoices(context);

  const startTime = context.currentTime + 0.008;
  activeVoices = midiNotes.map((midi, index) => createVoice(
    context,
    masterCompressor,
    midi,
    startTime,
    voiceLevels[index] ?? 1
  ));
}

export async function playTriad(rootName, quality, rootMidi = null) {
  const notes = rootMidi === null
    ? triadMidiNotes(rootName, quality)
    : triadMidiNotesFromRoot(rootMidi, quality);
  await playMidiNotes(notes, [1, 0.72, 0.58]);
}

export async function playDominantSeventh(rootMidi) {
  await playMidiNotes(dominantSeventhMidiNotesFromRoot(rootMidi), [1, 0.72, 0.58, 0.64]);
}

export async function playRoot(rootMidi) {
  await playMidiNotes([rootMidi]);
}

export async function startKeyboardNote(noteId, midi) {
  const context = getAudioContext();
  if (context.state === "suspended") await context.resume();
  if (keyboardVoices.has(noteId)) return;

  const voice = createKeyboardVoice(context, masterCompressor, midi, context.currentTime + 0.005);
  keyboardVoices.set(noteId, voice);
}

export function stopKeyboardNote(noteId) {
  if (!audioContext) return;
  const voice = keyboardVoices.get(noteId);
  if (!voice) return;
  fadeAndStopVoice(audioContext, voice);
  keyboardVoices.delete(noteId);
}

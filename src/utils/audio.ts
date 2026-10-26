/**
 * Audio synthesis helper using Web Audio API, studio-recorded audio assets, and Web Speech API.
 * Ensures 100% crystal-clear human pronunciation without robot TTS clipping.
 */

import { PhonicsItem } from '../types/curriculum';

// Web Audio API Sound Generator
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const playSoundEffect = (type: 'correct' | 'wrong' | 'click' | 'fanfare' | 'pop') => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.06);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'correct') {
      // Cheerful rising two-tone chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(659.25, now + 0.12); // E5
      osc1.frequency.setValueAtTime(783.99, now + 0.24); // G5
      osc1.frequency.setValueAtTime(1046.5, now + 0.36); // C6

      osc2.frequency.setValueAtTime(1046.5, now + 0.36);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.36);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now + 0.36);
      osc1.stop(now + 0.7);
      osc2.stop(now + 0.7);
    } else if (type === 'wrong') {
      // Gentle soft low buzz
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.linearRampToValueAtTime(210, now + 0.25);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'fanfare') {
      // Triumphant 5-note brass fanfare
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C5, E5, G5, C6, E6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const start = now + idx * 0.1;
        const dur = idx === notes.length - 1 ? 0.6 : 0.12;

        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + dur);
      });
    } else if (type === 'pop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch {
    // Graceful fallback if audio is not supported
  }
};

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Authentic studio human recordings for words with 100% phonetic clarity.
 * Prevents OS TTS synthesizers from mispronouncing "dog" as "duck".
 */
export const AUDIO_FILE_MAP: Record<string, string> = {
  dog: '/assets/audio/dog.mp3',
  apple: '/assets/audio/apple.mp3',
  baby: '/assets/audio/baby.mp3',
  cat: '/assets/audio/cat.mp3',
  egg: '/assets/audio/egg.mp3',
  friend: '/assets/audio/friend.mp3',
  girl: '/assets/audio/girl.mp3',
};

let currentAudioElement: HTMLAudioElement | null = null;

export const cancelSpeech = () => {
  if (currentAudioElement) {
    currentAudioElement.pause();
    currentAudioElement = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

/**
 * Plays a local human audio file if available
 */
export const playAudioFile = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }
    try {
      if (currentAudioElement) {
        currentAudioElement.pause();
        currentAudioElement = null;
      }
      const audio = new Audio(url);
      currentAudioElement = audio;
      audio.onended = () => {
        currentAudioElement = null;
        resolve();
      };
      audio.onerror = (e) => {
        currentAudioElement = null;
        reject(e);
      };
      audio.play().catch(reject);
    } catch (e) {
      reject(e);
    }
  });
};

/**
 * Normalizes English text for browser speech synthesis fallback
 */
export const normalizeTtsText = (text: string): string => {
  if (!text) return text;
  return text.replace(/\bdog\b/gi, 'dawg');
};

/**
 * Text to speech for English vocabulary and sentences.
 * Automatically uses human studio audio for "dog" to ensure zero confusion with "duck"!
 */
export const speakEnglish = (text: string, rate: number = 0.85) => {
  if (typeof window === 'undefined') return;

  const cleanKey = text.trim().toLowerCase();
  if (AUDIO_FILE_MAP[cleanKey]) {
    playAudioFile(AUDIO_FILE_MAP[cleanKey]).catch(() => {
      // fallback to TTS if file audio playback is blocked
      fallbackSpeechSynthesis(text, rate);
    });
    return;
  }

  fallbackSpeechSynthesis(text, rate);
};

const fallbackSpeechSynthesis = (text: string, rate: number = 0.85) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const cleanText = normalizeTtsText(text);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    utterance.pitch = 0.98;

    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Natural') ||
          v.name.includes('Google') ||
          v.name.includes('Samantha') ||
          v.name.includes('US'))
    );
    if (enVoice) {
      utterance.voice = enVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
};

/**
 * Promise-based speech utterance that resolves when spoken audio finishes.
 * Automatically checks AUDIO_FILE_MAP first for studio human voice recordings!
 */
export const speakAsync = (text: string, rate: number = 0.75): Promise<void> => {
  const cleanKey = text.trim().toLowerCase();
  if (AUDIO_FILE_MAP[cleanKey]) {
    return playAudioFile(AUDIO_FILE_MAP[cleanKey]).catch(() => {
      return fallbackSpeakAsync(text, rate);
    });
  }
  return fallbackSpeakAsync(text, rate);
};

const fallbackSpeakAsync = (text: string, rate: number = 0.75): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const cleanText = normalizeTtsText(text);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'en-US';
      utterance.rate = rate;
      utterance.pitch = 0.98;

      const voices = window.speechSynthesis.getVoices();
      const enVoice = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('Samantha') ||
            v.name.includes('US'))
      );
      if (enVoice) {
        utterance.voice = enVoice;
      }

      let settled = false;
      const finish = () => {
        if (!settled) {
          settled = true;
          resolve();
        }
      };

      utterance.onend = finish;
      utterance.onerror = finish;
      setTimeout(finish, 3500);

      window.speechSynthesis.speak(utterance);
    } catch {
      resolve();
    }
  });
};

/**
 * Text to speech for Vietnamese instructions so young kids who cannot read yet can listen!
 */
export const speakVietnamese = (text: string, rate: number = 0.9) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = rate;

    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find((v) => v.lang.startsWith('vi'));
    if (viVoice) {
      utterance.voice = viVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
};

// Global sequence controller to ensure multiple clicks don't overlap
let activeSequenceToken = 0;

/**
 * Phonics 3-step sequence:
 * 1. Letter name (e.g. D /diː/)
 * 2. Pause 1 second (1000ms)
 * 3. Letter sound (e.g. d /d/)
 * 4. Pause 1 second (1000ms)
 * 5. Example word (e.g. dog - uses authentic studio audio file!)
 */
export const playPhonicsSequence = async (
  item: PhonicsItem,
  onStepChange?: (step: 0 | 1 | 2 | 3) => void
): Promise<void> => {
  const currentToken = ++activeSequenceToken;
  cancelSpeech();

  const isCancelled = () => activeSequenceToken !== currentToken;

  try {
    // Step 1: Letter name (e.g. "D" /diː/)
    onStepChange?.(1);
    await speakAsync(item.letterPronounceText, 0.7);
    if (isCancelled()) return;

    // Pause 1 second (1000ms)
    await sleep(1000);
    if (isCancelled()) return;

    // Step 2: Letter sound (e.g. "d" /d/)
    onStepChange?.(2);
    await speakAsync(item.soundPronounceText, 0.65);
    if (isCancelled()) return;

    // Pause 1 second (1000ms)
    await sleep(1000);
    if (isCancelled()) return;

    // Step 3: Example word (e.g. "dog" plays real human recording!)
    onStepChange?.(3);
    await speakAsync(item.word, 0.72);
    if (isCancelled()) return;

    // Rest briefly then reset to idle
    await sleep(600);
    if (!isCancelled()) {
      onStepChange?.(0);
    }
  } catch (e) {
    console.warn('Phonics sequence error:', e);
    if (!isCancelled()) {
      onStepChange?.(0);
    }
  }
};

export const stopPhonicsSequence = () => {
  activeSequenceToken++;
  cancelSpeech();
};

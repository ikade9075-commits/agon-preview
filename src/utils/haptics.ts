import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'success' = 'light') {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
        if (type === 'light') navigator.vibrate(15);
        else if (type === 'medium') navigator.vibrate(30);
        else if (type === 'heavy') navigator.vibrate(50);
        else if (type === 'success') navigator.vibrate([20, 30, 40]);
      }
      return;
    }

    if (type === 'light') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (type === 'medium') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else if (type === 'heavy') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } else if (type === 'success') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  } catch (e) {
    // Ignore haptic errors on unsupported devices
  }
}

// Web audio gentle beep / click sound for tasbeeh counter
let audioCtx: any = null;

export function playCounterClick() {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      if (!audioCtx) audioCtx = new AudioContext();

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 pleasant tone
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    }
  } catch (e) {
    // Ignore audio errors
  }
}

export function playSuccessChime() {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      if (!audioCtx) audioCtx = new AudioContext();

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.09, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.25);
      });
    }
  } catch (e) {
    // Ignore
  }
}

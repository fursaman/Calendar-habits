/**
 * A short, bright two-note chime for completing a habit, synthesized with the
 * Web Audio API so there is no audio file to load.
 */

const NOTES_HZ = [880, 1318.5] // A5 then E6: a rising fifth
const NOTE_GAP_S = 0.085
const NOTE_LENGTH_S = 0.22
const PEAK_GAIN = 0.16

let context: AudioContext | null = null

function getContext(): AudioContext | null {
  if (typeof window === 'undefined' || !('AudioContext' in window)) return null
  context ??= new AudioContext()
  return context
}

export function playCompletionSound() {
  const audio = getContext()
  if (!audio) return
  // Browsers start contexts suspended until a user gesture; this runs inside one.
  if (audio.state === 'suspended') void audio.resume()

  const start = audio.currentTime + 0.005
  NOTES_HZ.forEach((frequency, index) => {
    const at = start + index * NOTE_GAP_S
    const oscillator = audio.createOscillator()
    const gain = audio.createGain()
    oscillator.type = 'triangle'
    oscillator.frequency.setValueAtTime(frequency, at)
    // Quick attack, smooth exponential decay: a "pop" rather than a beep.
    gain.gain.setValueAtTime(0.0001, at)
    gain.gain.exponentialRampToValueAtTime(PEAK_GAIN, at + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.0001, at + NOTE_LENGTH_S)
    oscillator.connect(gain).connect(audio.destination)
    oscillator.start(at)
    oscillator.stop(at + NOTE_LENGTH_S + 0.02)
  })
}

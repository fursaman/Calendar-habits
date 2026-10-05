/**
 * The completion sound: a soft, glassy two-note chime, synthesized with the
 * Web Audio API so there is no audio file to load. Each note is a sine with a
 * quiet bell-like overtone, shaped by a fast attack and a long smooth decay,
 * then given a little air with a short filtered echo.
 */

/** C6 then G6: an open fifth that sounds resolved rather than alarming. */
const NOTES_HZ = [1046.5, 1568]
const NOTE_GAP_S = 0.07
const DECAY_S = 0.55
const PEAK_GAIN = 0.11
/** Bell-like partial: an inharmonic overtone, very quiet. */
const OVERTONE_RATIO = 2.76
const OVERTONE_GAIN = 0.18

let context: AudioContext | null = null
let output: AudioNode | null = null

function getOutput(): { audio: AudioContext; destination: AudioNode } | null {
  if (typeof window === 'undefined' || !('AudioContext' in window)) return null
  if (!context || !output) {
    context = new AudioContext()
    // Gentle low-pass to round off the highs, plus a short damped echo for air.
    const tone = context.createBiquadFilter()
    tone.type = 'lowpass'
    tone.frequency.value = 6000
    const echo = context.createDelay()
    echo.delayTime.value = 0.09
    const feedback = context.createGain()
    feedback.gain.value = 0.22
    const damp = context.createBiquadFilter()
    damp.type = 'lowpass'
    damp.frequency.value = 2500

    tone.connect(context.destination)
    tone.connect(echo)
    echo.connect(damp).connect(feedback).connect(echo)
    feedback.connect(context.destination)
    output = tone
  }
  return { audio: context, destination: output }
}

function playPartial(
  audio: AudioContext,
  destination: AudioNode,
  frequency: number,
  at: number,
  peak: number,
  decay: number,
) {
  const oscillator = audio.createOscillator()
  const gain = audio.createGain()
  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(frequency, at)
  gain.gain.setValueAtTime(0.0001, at)
  gain.gain.exponentialRampToValueAtTime(peak, at + 0.005)
  gain.gain.exponentialRampToValueAtTime(0.0001, at + decay)
  oscillator.connect(gain).connect(destination)
  oscillator.start(at)
  oscillator.stop(at + decay + 0.05)
}

export function playCompletionSound() {
  const target = getOutput()
  if (!target) return
  const { audio, destination } = target
  // Browsers start contexts suspended until a user gesture; this runs inside one.
  if (audio.state === 'suspended') void audio.resume()

  const start = audio.currentTime + 0.005
  NOTES_HZ.forEach((frequency, index) => {
    const at = start + index * NOTE_GAP_S
    playPartial(audio, destination, frequency, at, PEAK_GAIN, DECAY_S)
    playPartial(
      audio,
      destination,
      frequency * OVERTONE_RATIO,
      at,
      PEAK_GAIN * OVERTONE_GAIN,
      DECAY_S * 0.35,
    )
  })
}

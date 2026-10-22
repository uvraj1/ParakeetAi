/**
 * Speech Recognition & Audio Streaming Service
 * Handles microphone capture, Web Speech API speech-to-text, and audio analyzer frequencies.
 */

export class SpeechService {
  constructor(onTranscriptChange, onSpeechEnd, onAudioLevel) {
    this.onTranscriptChange = onTranscriptChange;
    this.onSpeechEnd = onSpeechEnd;
    this.onAudioLevel = onAudioLevel;

    this.recognition = null;
    this.isListening = false;
    this.audioContext = null;
    this.mediaStream = null;
    this.analyser = null;
    this.animFrameId = null;
    this.silenceTimer = null;
    this.currentTranscript = "";
  }

  start() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = (finalTranscript || interimTranscript).trim();
        if (text) {
          this.currentTranscript = text;
          if (this.onTranscriptChange) {
            this.onTranscriptChange(text, Boolean(finalTranscript));
          }

          // Reset silence timer
          clearTimeout(this.silenceTimer);
          this.silenceTimer = setTimeout(() => {
            if (this.onSpeechEnd && this.currentTranscript) {
              this.onSpeechEnd(this.currentTranscript);
            }
          }, 1800);
        }
      };

      this.recognition.onerror = (err) => {
        console.warn("Speech recognition error:", err);
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          try {
            this.recognition.start();
          } catch (e) {
            // Already started or restarting
          }
        }
      };

      try {
        this.recognition.start();
      } catch (e) {
        console.warn("Speech recognition failed to start:", e);
      }
    }

    // Initialize Web Audio API for waveform
    this.initAudioAnalyzer();
  }

  async initAudioAnalyzer() {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 64;

        const source = this.audioContext.createMediaStreamSource(this.mediaStream);
        source.connect(this.analyser);

        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

        const checkAudio = () => {
          if (!this.isListening) return;
          this.analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          const normalized = Math.min(100, Math.round((avg / 255) * 100));

          if (this.onAudioLevel) {
            this.onAudioLevel(normalized, Array.from(dataArray.slice(0, 16)));
          }

          this.animFrameId = requestAnimationFrame(checkAudio);
        };

        checkAudio();
      }
    } catch (err) {
      console.log("Audio analyzer unavailable, falling back to dynamic simulated waveform:", err.message);
      this.startSimulatedAudio();
    }
  }

  startSimulatedAudio() {
    const loop = () => {
      if (!this.isListening) return;
      const fakeLevels = Array.from({ length: 16 }, () => Math.floor(Math.random() * 85 + 15));
      const avg = Math.floor(fakeLevels.reduce((a, b) => a + b, 0) / 16);
      if (this.onAudioLevel) {
        this.onAudioLevel(avg, fakeLevels);
      }
      this.animFrameId = setTimeout(loop, 120);
    };
    loop();
  }

  stop() {
    this.isListening = false;
    clearTimeout(this.silenceTimer);
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      clearTimeout(this.animFrameId);
    }
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }
}

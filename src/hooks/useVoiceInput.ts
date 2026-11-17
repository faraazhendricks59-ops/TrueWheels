"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Minimal structural types for the Web Speech API. The DOM lib does not ship
 * SpeechRecognition typings, and the API is still vendor-prefixed in Chromium.
 */
interface SpeechRecognitionAlternative {
  transcript: string;
}
interface SpeechRecognitionResult {
  0: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}
interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

interface UseVoiceInputReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  isSupported: boolean;
}

export function useVoiceInput(): UseVoiceInputReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  // Resolved in an effect, never during render: the server has no Speech API,
  // so computing it inline would render a different button than the client.
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;

    setIsSupported(true);

    const recognition = new Ctor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-ZA";

    recognition.onresult = (event) => {
      let current = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        current += event.results[i][0].transcript;
      }
      setTranscript(current);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    return () => {
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
      recognition.abort();
      recognitionRef.current = null;
    };
  }, []);

  const startListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    setTranscript("");
    try {
      recognition.start();
      setIsListening(true);
    } catch {
      // start() throws if a session is already active; treat as not listening.
      setIsListening(false);
    }
  }, []);

  const stopListening = useCallback(() => {
    // Set state directly rather than waiting for onend, which some browsers do
    // not fire when the session is cancelled.
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => setTranscript(""), []);

  return { isListening, transcript, startListening, stopListening, resetTranscript, isSupported };
}

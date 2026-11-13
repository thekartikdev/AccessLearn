import { useCallback, useEffect, useRef, useState } from 'react';

const supported = () => typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

/** Browser-native text-to-speech that reads an array of paragraphs one by one. */
export function useSpeech({ lang = 'en', rate = 1 } = {}) {
  const isSupported = supported();
  const [voices, setVoices] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | playing | paused
  const [index, setIndex] = useState(-1);
  const token = useRef(0);
  const rateRef = useRef(rate);
  rateRef.current = rate;

  useEffect(() => {
    if (!isSupported) return undefined;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener?.('voiceschanged', load);
    return () => window.speechSynthesis.removeEventListener?.('voiceschanged', load);
  }, [isSupported]);

  const voiceFor = useCallback(() => {
    const prefix = lang === 'hi' ? 'hi' : 'en';
    const list = voices.filter((v) => v.lang.toLowerCase().startsWith(prefix));
    return list.find((v) => v.lang.toLowerCase() === (lang === 'hi' ? 'hi-in' : 'en-in')) || list[0] || null;
  }, [voices, lang]);

  const hasVoice = voices.length === 0 ? true : !!voiceFor(); // unknown until voices load

  const stop = useCallback(() => {
    token.current += 1;
    if (isSupported) window.speechSynthesis.cancel();
    setStatus('idle');
    setIndex(-1);
  }, [isSupported]);

  const speak = useCallback(
    (paragraphs, start = 0) => {
      if (!isSupported || !paragraphs?.length) return;
      window.speechSynthesis.cancel();
      token.current += 1;
      const mine = token.current;
      setStatus('playing');
      const run = (i) => {
        if (mine !== token.current) return;
        if (i >= paragraphs.length) {
          setStatus('idle');
          setIndex(-1);
          return;
        }
        const u = new SpeechSynthesisUtterance(paragraphs[i]);
        u.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
        u.rate = rateRef.current;
        const v = voiceFor();
        if (v) u.voice = v;
        u.onstart = () => mine === token.current && setIndex(i);
        u.onend = () => run(i + 1);
        u.onerror = (e) => {
          if (mine !== token.current || e.error === 'canceled' || e.error === 'interrupted') return;
          setStatus('idle');
          setIndex(-1);
        };
        window.speechSynthesis.speak(u);
      };
      run(start);
    },
    [isSupported, lang, voiceFor],
  );

  const pause = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.pause();
    setStatus('paused');
  }, [isSupported]);

  const resume = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.resume();
    setStatus('playing');
  }, [isSupported]);

  useEffect(() => () => {
    token.current += 1;
    if (supported()) window.speechSynthesis.cancel();
  }, []);

  return { isSupported, hasVoice, status, index, speak, pause, resume, stop };
}

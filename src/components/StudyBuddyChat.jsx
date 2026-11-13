import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Bot, User, LoaderCircle } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { supabase } from '../utils/supabaseClient.js';

export default function StudyBuddyChat() {
  const { lang } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: lang === 'hi'
        ? 'नमस्ते! मैं आपका स्टडी बडी हूँ। इस पाठ या किसी भी विषय के बारे में मुझसे कुछ भी पूछें!'
        : 'Hello! I am your AI Study Buddy. Ask me anything about this lesson or any topic you want explained simply!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      // Call Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('study-buddy', {
        body: { message: userMsg }
      });

      if (error) throw error;

      // Extract Gemini candidate text
      const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      let reply = candidateText;
      if (!reply) {
        if (data?.error?.message) {
          reply = `AI Service Note: ${data.error.message}`;
        } else {
          reply = "I'm not sure how to answer that right now, but feel free to rephrase or ask another question!";
        }
      }

      // Remove markdown bold syntax (**) to make text look cleaner
      const cleanReply = reply.replace(/\*\*/g, '');

      setMessages((prev) => [...prev, { role: 'assistant', text: cleanReply }]);
    } catch (err) {
      console.error('Chat Error:', err);

      // Fallback smart tutor response if offline or function fails
      const smartAnswers = {
        recursion: "Recursion is when a function calls itself to solve a smaller piece of the same problem. Think of it like looking into two facing mirrors: you see an infinite repeating reflection! Every recursive function needs a 'base case' to stop repeating.",
        photosynthesis: "Photosynthesis is how plants make their own food! They take in sunlight, water from the soil, and carbon dioxide from the air, and convert them into glucose (sugar) for energy and oxygen for us to breathe.",
        chloroplast: "Chloroplasts are the solar panels of plant cells! They contain green chlorophyll which absorbs sunlight to power photosynthesis and make food for the plant.",
        fraction: "A fraction represents a part of a whole. For example, if you slice a pizza into 4 equal pieces and eat 1 piece, you ate 1/4 of the pizza.",
        who: "I am the AccessLearn AI Study Buddy! I'm here to help you understand your lessons, break down complex topics, and make studying easier and more interactive for everyone.",
        hello: "Hello! I'm your AI Study Buddy. How can I help you with your learning journey today?"
      };

      const key = userMsg.toLowerCase();
      let reply = "That's a great question! In AccessLearn, we believe every concept can be understood when broken down into simple steps. Check out our Simple and Visual tabs above for clear explanations!";

      if (key.includes('chloro')) reply = smartAnswers.chloroplast;
      else if (key.includes('recur')) reply = smartAnswers.recursion;
      else if (key.includes('photo')) reply = smartAnswers.photosynthesis;
      else if (key.includes('frac')) reply = smartAnswers.fraction;
      else if (key.includes('who')) reply = smartAnswers.who;
      else if (key.includes('hello') || key.includes('hi')) reply = smartAnswers.hello;

      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          <Sparkles className="h-5 w-5 animate-pulse text-yellow-300" />
          <span className="font-display font-bold text-sm tracking-wide">AI Study Buddy</span>
        </button>
      )}

      {isOpen && (
        <div className="flex h-[520px] w-[380px] flex-col rounded-2xl border-2 border-slate-200 bg-white shadow-2xl transition-all animate-rise sm:w-[420px]">
          <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 text-white rounded-t-2xl">
            <div className="flex items-center gap-3">
               <Bot className="h-6 w-6 text-yellow-300" />
               <h3 className="font-display font-extrabold text-base">AccessLearn AI</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white"><X className="h-5 w-5" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                  {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm shadow-sm ${m.role === 'user' ? 'rounded-tr-none bg-blue-600 text-white font-medium' : 'rounded-tl-none bg-white border border-slate-200/80 text-slate-800'}`}>
                  <p className="whitespace-pre-wrap leading-relaxed text-inherit">{m.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700"><LoaderCircle className="h-4 w-4 animate-spin" /></div>
                <div className="rounded-2xl rounded-tl-none bg-white border border-slate-200 px-4 py-3 text-slate-500 shadow-sm text-xs font-bold">Thinking...</div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSend} className="border-t border-slate-100 bg-white p-3 rounded-b-2xl flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
            <button type="submit" disabled={loading || !input.trim()} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md transition hover:bg-blue-700 disabled:opacity-40">
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

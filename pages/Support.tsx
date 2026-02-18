import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import { ChatMessage } from '../types';
import { LifeBuoyIcon } from '../components/Icons';

const Support: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'agent', text: 'Oracle System Online. Awaiting query.', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const responseText = await api.ai.chat(userMsg.text);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
       console.error(e);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <div className="h-full p-8 pb-32 flex flex-col gap-6">
       <div className="flex items-center gap-4 mb-4">
           <div className="p-3 bg-orange-600 rounded-full">
               <LifeBuoyIcon className="w-6 h-6 text-white" />
           </div>
           <div>
               <h2 className="text-2xl font-bold text-white">Oracle Support</h2>
               <p className="text-zinc-400 text-sm">AI-Powered assistance</p>
           </div>
       </div>

       <div className="flex-1 bg-zinc-900/50 border border-white/5 rounded-2xl flex flex-col overflow-hidden max-h-[600px]">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl ${
                          msg.sender === 'user' 
                          ? 'bg-orange-600 text-white rounded-tr-sm' 
                          : 'bg-zinc-800 text-zinc-200 rounded-tl-sm border border-white/5 font-mono text-sm'
                      }`}>
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                          <span className="text-[10px] opacity-50 block mt-2">{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                  </div>
              ))}
              {isTyping && (
                  <div className="flex justify-start">
                      <div className="bg-zinc-800 p-4 rounded-2xl rounded-tl-sm flex gap-2 items-center">
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-75"></div>
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-150"></div>
                      </div>
                  </div>
              )}
          </div>

          <div className="p-4 bg-zinc-900 border-t border-white/10 flex gap-4">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Oracle..."
                className="flex-1 bg-zinc-800 border-none rounded-full px-6 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none placeholder-zinc-500 font-mono"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="bg-orange-500 text-black font-bold px-6 py-3 rounded-full hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all"
              >
                  Send
              </button>
          </div>
       </div>
    </div>
  );
};

export default Support;
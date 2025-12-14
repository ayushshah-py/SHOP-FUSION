import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { getStylistAdvice } from '../services/geminiService';
import { useStore } from '../contexts/StoreContext';

const AIStylist: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    {role: 'ai', text: 'Hello! I am your personal AI stylist. Looking for an outfit for a specific occasion?'}
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { products } = useStore();

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, {role: 'user', text: userMsg}]);
    setLoading(true);

    const advice = await getStylistAdvice(userMsg, products);
    
    setMessages(prev => [...prev, {role: 'ai', text: advice}]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white p-4 rounded-full shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          <Sparkles size={20} />
          <span className="font-medium">AI Stylist</span>
        </button>
      )}

      {isOpen && (
        <div className="bg-white w-80 md:w-96 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col h-[500px]">
          {/* Header */}
          <div className="bg-primary p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-accent" />
              <h3 className="font-serif font-semibold">Lumière Stylist</h3>
            </div>
            <button onClick={() => setIsOpen(false)}><X size={20} /></button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-br-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-bl-none shadow-sm text-sm text-gray-400">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for advice..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className="p-2 bg-primary text-white rounded-full hover:bg-slate-800 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIStylist;

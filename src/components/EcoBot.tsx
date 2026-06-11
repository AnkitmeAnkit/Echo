import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  X, 
  Send, 
  ChevronRight,
  Bot
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const EcoBot: React.FC = () => {
  const { navigate, currentUser, currentPath } = useAppState();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hi there! I'm your support assistant. I can help you navigate the platform, find playbooks, or answer questions about our services. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputVal, setInputVal] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = "";
      const lowerText = textToSend.toLowerCase();

      if (lowerText.includes('playbook') || lowerText.includes('blueprints') || lowerText.includes('catalog')) {
        replyText = "We offer several premium playbooks. You can view them all in the Playbooks section. Would you like me to take you there?";
      } else if (lowerText.includes('consulting') || lowerText.includes('booking') || lowerText.includes('schedule')) {
        replyText = "You can schedule a strategic advisory session with our team through the Consulting page. We use a calendar booking system for easy scheduling.";

      } else if (lowerText.includes('login') || lowerText.includes('auth') || lowerText.includes('register')) {
        replyText = "You can sign in or create an account using the 'Sign In' button in the top navigation bar.";
      } else if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
        replyText = `Hello${currentUser ? ' ' + currentUser.name : ''}! How can I assist you with your navigation or queries today?`;
      } else {
        replyText = "I understand. If you need help finding a specific section, you can use the quick links below or ask me about our Playbooks and Consulting services.";
      }

      const ecoMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, ecoMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickCommand = (cmd: string, analyticsLabel: string) => {
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: analyticsLabel,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      let reply = "";
      if (cmd === 'goto_homepage') {
        navigate('/');
        reply = "Navigating to the Homepage.";
      } else if (cmd === 'goto_playbooks') {
        navigate('/playbooks');
        reply = "Opening the Playbooks catalog.";
      } else if (cmd === 'goto_consulting') {
        navigate('/consulting');
        reply = "Taking you to the Consulting scheduling page.";

      }

      const ecoMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, ecoMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center space-x-2 bg-primary text-on-primary hover:bg-primary-active p-3 md:px-4 rounded-full shadow-lg transition-colors cursor-pointer"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-sm font-semibold hidden md:inline">Support</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[340px] sm:w-[380px] bg-canvas border border-hairline rounded-lg shadow-xl flex flex-col h-[520px] max-h-[85vh] overflow-hidden"
          >
            <div className="bg-canvas p-4 flex justify-between items-center border-b border-hairline shrink-0">
              <div className="flex items-center space-x-2 text-ink">
                <Bot className="w-5 h-5 text-muted" />
                <h3 className="font-semibold text-sm">Support Assistant</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-muted hover:text-ink transition-colors cursor-pointer p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-soft">
              {messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                >
                  <div className={`p-3 rounded-lg text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-on-primary rounded-tr-none' 
                      : 'bg-canvas text-ink border border-hairline rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-muted mt-1 font-medium">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="flex flex-col items-start max-w-[80%] mr-auto">
                  <div className="bg-canvas border border-hairline p-3 rounded-lg rounded-tl-none flex space-x-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-hairline bg-canvas shrink-0 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickCommand('goto_homepage', 'Go to Homepage')}
                  className="px-3 py-2 border border-hairline hover:border-surface-strong bg-canvas rounded-md text-left transition-colors cursor-pointer text-xs font-medium text-ink flex items-center justify-between group"
                >
                  <span>Home</span>
                  <ChevronRight className="w-3 h-3 text-muted group-hover:text-ink" />
                </button>

                <button
                  onClick={() => handleQuickCommand('goto_playbooks', 'Browse Playbooks')}
                  className="px-3 py-2 border border-hairline hover:border-surface-strong bg-canvas rounded-md text-left transition-colors cursor-pointer text-xs font-medium text-ink flex items-center justify-between group"
                >
                  <span>Playbooks</span>
                  <ChevronRight className="w-3 h-3 text-muted group-hover:text-ink" />
                </button>

                <button
                  onClick={() => handleQuickCommand('goto_consulting', 'Consulting Services')}
                  className="px-3 py-2 border border-hairline hover:border-surface-strong bg-canvas rounded-md text-left transition-colors cursor-pointer text-xs font-medium text-ink flex items-center justify-between group"
                >
                  <span>Consulting</span>
                  <ChevronRight className="w-3 h-3 text-muted group-hover:text-ink" />
                </button>


              </div>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputVal);
              }}
              className="p-3 border-t border-hairline bg-surface-soft shrink-0 flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-canvas border border-hairline rounded-md px-3 py-2 text-sm text-ink focus:outline-none focus:border-surface-strong placeholder:text-muted transition-colors"
              />
              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="p-2 bg-primary hover:bg-primary-active text-on-primary rounded-md transition-colors cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

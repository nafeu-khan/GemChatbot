'use client';

import { useState, useRef, useEffect } from 'react';
import { sendMessage } from '@/lib/api';
import { ChatMessage } from '@/types/chat';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';


import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function ChatBox() {
  const [input, setInput] = useState('can you give me pallindrome in c?');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);


  const handleSend = async () => {
    if (!input.trim()) return;
    const newUserMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setLoading(true);
  
    try {
      const reply = await sendMessage(newUserMsg.content);
      setMessages(prev => [...prev, { role: 'bot', content: reply }]);
    } catch (err: any) {
      const errorMsg = err?.message || 'Unknown error occurred.';
      console.error('Fetch error:', errorMsg);
      setMessages(prev => [...prev, { role: 'bot', content: `${errorMsg}` }]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  const parseResponse = (text: string) => {
    return (
      <div className="prose max-w-none prose-sm sm:prose-base lg:prose-lg dark:prose-invert">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{ borderRadius: '0.5rem', padding: '1rem' }}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className="bg-gray-200 rounded px-1 text-md text-pretty">{children}</code>
              );
            },
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    );
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto h-[80vh] flex flex-col">
      <CardContent className="flex-1 overflow-y-auto space-y-3">
      {messages.map((msg, i) => (
        <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
            {/* {(() => { console.log('Message:', msg); return null; })()} */}
            <div className={`max-w-[75%] rounded-lg px-4 py-2 ${msg.role === 'bot' ? 'bg-gray-200  text-black':' text-red bg-blue-600 border text-red' }`}>
            {msg.role === 'bot' ? parseResponse(msg.content) : <p>{msg.content}</p>}
            </div>
        </div>
        ))}
        <div ref={scrollRef} />
      </CardContent>

      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask something..."
            className="flex-1 min-h-[48px] resize-none"
          />
          <Button
            onClick={handleSend}
            disabled={loading}
            className="h-[48px] px-6"
          >
            {loading ? 'Thinking...' : 'Send'}
          </Button>
        </div>
      </div>
    </Card>
  );
}

'use client';

import { useState } from 'react';
import { sendMessage } from '@/lib/api';
import { ChatMessage } from '@/types/chat';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function ChatBox() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newUserMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setLoading(true);

    try {
      const reply = await sendMessage(newUserMsg.content);
      setMessages(prev => [...prev, { role: 'bot', content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', content: `Error: Unable to fetch response. ${err}`}]);
    } finally {
      setLoading(false);
    }
  };

  const parseResponse = (text: string) => {
    if (text.includes('```')) {
      const parts = text.split(/```(?:\w+)?/);
      return parts.map((part, i) =>
        i % 2 === 1 ? (
          <pre key={i} className="bg-gray-900 text-white rounded p-4 overflow-x-auto">
            <code>{part.trim()}</code>
          </pre>
        ) : (
          <p key={i} className="whitespace-pre-wrap">{part.trim()}</p>
        )
      );
    }
    return <p>{text}</p>;
  };

  return (
    <Card className="w-full max-w-3xl mx-auto h-[80vh] flex flex-col">
    <CardContent className="flex-1 overflow-y-auto space-y-3">
      {messages.map((msg, i) => (
        <div key={i} className={`text-${msg.role === 'user' ? 'right' : 'left'}`}>
          {msg.role === 'bot' ? parseResponse(msg.content) : <p>{msg.content}</p>}
        </div>
      ))}
    </CardContent>
  
    <div className="p-4 border-t bg-white">
      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={e => setInput(e.target.value)}
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
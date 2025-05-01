import ChatBox from '@/components/ChatBox';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Gem Chatbot</h1>
      <ChatBox />
    </main>
  );
}

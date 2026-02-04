import { useState, useRef, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card } from '@/app/components/ui/card';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Plus, Mic, Send, Bot, User } from 'lucide-react';
import { OPENAI_API_KEY } from '@/config/apiKeys';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Get AI response from Supabase Edge Function
  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      // Call backend API function (works in development and production)
      const apiUrl = import.meta.env.DEV 
        ? 'http://localhost:8888/.netlify/functions/chat'  // Netlify Dev local
        : '/api/chat';  // Production
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 401) {
          return '❌ API key tidak valid. Hubungi administrator untuk memeriksa konfigurasi.';
        }
        
        if (response.status === 429) {
          return '⏳ Terlalu banyak permintaan. Silakan tunggu sebentar dan coba lagi.';
        }
        
        if (response.status === 403) {
          return '🚫 Akses ditolak. Pastikan akun OpenAI memiliki kredit yang cukup.';
        }

        // If backend not available, show demo mode message
        if (response.status >= 500) {
          return getDemoResponse(userMessage);
        }

        return errorData.error || 'Maaf, terjadi kesalahan. Silakan coba lagi.';
      }

      const data = await response.json();
      return data.message || 'Maaf, tidak ada respons.';
      
    } catch (error: any) {
      console.error('Chat API Error:', error);
      
      // If fetch fails (no backend), use demo mode
      return getDemoResponse(userMessage);
    }
  };

  const getDemoResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('ph')) {
      return `pH adalah ukuran tingkat keasaman atau kebasaan air, dengan skala 0-14. Untuk air minum:\n\n✅ pH Normal: 6.5 - 8.5\n⚠️ pH < 6.5: Terlalu asam (korosif)\n⚠️ pH > 8.5: Terlalu basa\n\nAir dengan pH normal aman untuk diminum dan tidak merusak pipa.\n\n💡 Tips: Air sumur di Jatinangor umumnya memiliki pH yang baik untuk konsumsi.\n\n---\n⚠️ Mode Demo: Untuk AI response penuh, jalankan: netlify dev`;
    }
    
    if (lowerMessage.includes('lokasi') || lowerMessage.includes('stasiun') || lowerMessage.includes('pemantauan')) {
      return `16 Stasiun Pemantauan Air di Cileles, Jatinangor:\n\n📍 TA01 - TA16: Tersebar di berbagai titik strategis\n\nStasiun-stasiun ini dipasang untuk:\n• Memantau kualitas air secara real-time\n• Mendeteksi perubahan parameter kualitas air\n• Memberikan data untuk analisis tren\n\nAnda dapat melihat lokasi persisnya di peta interaktif di atas.\n\n---\n⚠️ Mode Demo: Untuk AI response penuh, jalankan: netlify dev`;
    }
    
    if (lowerMessage.includes('aman') || lowerMessage.includes('minum')) {
      return `Air dinyatakan aman untuk diminum jika memenuhi standar:\n\n✅ pH: 6.5 - 8.5\n✅ TDS: < 500 mg/L (sangat baik)\n⚠️ TDS: 500-1000 mg/L (cukup baik, perlu perhatian)\n❌ TDS: > 1000 mg/L (tidak disarankan)\n\nRekomendasi:\n• Periksa data tabel untuk melihat kondisi stasiun terdekat\n• Air dengan status "Baik" (hijau) aman diminum\n• Air dengan status "Perlu Perhatian" (kuning) sebaiknya dimasak dulu\n• Air dengan status "Buruk" (merah) tidak disarankan\n\n---\n⚠️ Mode Demo: Untuk AI response penuh, jalankan: netlify dev`;
    }
    
    if (lowerMessage.includes('tds')) {
      return `TDS (Total Dissolved Solids) adalah ukuran total padatan terlarut dalam air, dalam satuan mg/L atau ppm.\n\n📊 Standar TDS Air Minum:\n✅ 0-300 mg/L: Sangat baik\n✅ 300-500 mg/L: Baik\n⚠️ 500-1000 mg/L: Cukup baik\n❌ > 1000 mg/L: Tidak disarankan\n\nTDS tinggi dapat menandakan:\n• Banyaknya mineral terlarut\n• Kontaminasi garam atau mineral lain\n• Perlu treatment sebelum konsumsi\n\n---\n⚠️ Mode Demo: Untuk AI response penuh, jalankan: netlify dev`;
    }
    
    if (lowerMessage.includes('ec') || lowerMessage.includes('konduktivitas')) {
      return `EC (Electrical Conductivity) atau Konduktivitas Listrik mengukur kemampuan air menghantarkan listrik, dalam satuan μS/cm.\n\n🔬 Apa artinya?\nEC tinggi = banyak ion terlarut dalam air\nEC rendah = sedikit ion terlarut\n\n📈 Hubungan EC dengan TDS:\nEC ≈ TDS/2 (dalam ppm)\n\nEC dapat mendeteksi:\n• Kontaminasi mineral\n• Pencemaran industri\n• Intrusi air laut\n• Perubahan kualitas air\n\n---\n⚠️ Mode Demo: Untuk AI response penuh, jalankan: netlify dev`;
    }
    
    // Default response
    return `🤖 Saya siap membantu Anda memahami kualitas air di Cileles, Jatinangor!\n\nBeberapa topik yang bisa saya bantu:\n• Parameter kualitas air (pH, TDS, EC)\n• Standar air minum yang aman\n• Interpretasi data monitoring\n• Lokasi stasiun pemantauan\n• Tips menjaga kualitas air\n\nSilakan tanyakan pertanyaan spesifik tentang kualitas air!\n\n---\n⚠️ Mode Demo: Untuk mengaktifkan AI OpenAI penuh:\n1. Install Netlify CLI: npm install -g netlify-cli\n2. Jalankan: netlify dev\n3. Buka: http://localhost:8888`;
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageText = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // Get AI response
      const responseText = await getAIResponse(messageText);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white border-gray-700 overflow-hidden">
      <div className="p-8 relative">
        {/* Greeting Section */}
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-3xl font-light mb-8">
              Halo! Ada yang bisa saya bantu?
            </h2>
            <div className="mb-6 p-4 bg-blue-900/30 border border-blue-700 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-blue-300">
                💬 Tanyakan apapun tentang kualitas air di Cileles, Jatinangor
              </p>
            </div>
          </div>
        ) : (
          /* Messages Section */
          <div className="mb-6">
            <ScrollArea className="h-96">
              <div ref={scrollRef} className="space-y-4 pr-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.sender === 'bot' && (
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-100'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    </div>
                    {message.sender === 'user' && (
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="bg-gray-700 rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Input Section */}
        <div className="relative">
          <div className="flex items-center gap-3 bg-gray-800 rounded-full px-4 py-3 border border-gray-700 focus-within:border-gray-600 transition-colors">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-gray-700 text-gray-400"
              disabled={isLoading}
            >
              <Plus className="h-5 w-5" />
            </Button>

            <Input
              placeholder="Tanya apa saja"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1 bg-transparent border-0 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
            />

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-gray-700 text-gray-400"
              disabled={isLoading}
            >
              <Mic className="h-5 w-5" />
            </Button>

            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={isLoading}
              className="h-10 w-10 rounded-full bg-white hover:bg-gray-200 text-gray-900 disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Suggestions (only show when no messages) */}
        {messages.length === 0 && (
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setInputValue('Apa itu pH dan bagaimana pengaruhnya terhadap kualitas air?');
              }}
              className="rounded-full bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Apa itu pH?
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setInputValue('Dimana lokasi stasiun pemantauan?');
              }}
              className="rounded-full bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Lokasi pemantauan
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setInputValue('Apakah airnya aman untuk diminum?');
              }}
              className="rounded-full bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Apakah aman diminum?
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
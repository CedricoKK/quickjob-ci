import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Bot, Send, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const AssistantIA = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Bonjour ! Je suis votre assistant IA QuickJob CI. Comment puis-je vous aider aujourd\'hui ?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('openai-chat', {
        body: { 
          message: inputMessage,
          context: "Tu es un assistant IA pour QuickJob CI, une plateforme ivoirienne de petits boulots. Tu aides les utilisateurs avec leurs questions sur la recherche d'emploi, le recrutement, et l'utilisation de la plateforme. Réponds en français et sois professionnel mais amical."
        }
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data?.message || 'Désolé, je n\'ai pas pu traiter votre demande.',
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de communiquer avec l'assistant IA. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-secondary border-b border-border/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Assistant IA
                </h1>
                <p className="text-muted-foreground text-sm">Propulsé par OpenAI</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="h-[600px] flex flex-col bg-gradient-card border-border/20 shadow-card">
          <CardHeader className="border-b border-border/20">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              Chat avec l'Assistant IA
            </CardTitle>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${
                    message.isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground p-4 rounded-lg flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>L'assistant réfléchit...</span>
                </div>
              </div>
            )}
          </CardContent>

          {/* Input */}
          <div className="p-6 border-t border-border/20">
            <div className="flex gap-2">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message ici..."
                className="flex-1 min-h-[60px] resize-none"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size="icon"
                className="h-[60px] w-[60px]"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            onClick={() => setInputMessage("Comment publier une offre d'emploi ?")}
            className="h-auto p-4 text-left justify-start"
          >
            <div>
              <div className="font-medium">Publier une offre</div>
              <div className="text-sm text-muted-foreground">Comment publier une annonce</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setInputMessage("Quels sont vos tarifs ?")}
            className="h-auto p-4 text-left justify-start"
          >
            <div>
              <div className="font-medium">Tarifs</div>
              <div className="text-sm text-muted-foreground">Découvrir nos prix</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setInputMessage("Comment postuler à un emploi ?")}
            className="h-auto p-4 text-left justify-start"
          >
            <div>
              <div className="font-medium">Postuler</div>
              <div className="text-sm text-muted-foreground">Comment candidater</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssistantIA;
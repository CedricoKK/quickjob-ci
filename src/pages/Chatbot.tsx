import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, MessageSquare, Send, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

// Knowledge base for QuickJob CI
const knowledgeBase = {
  "inscription": "L'inscription est gratuite pour tous les candidats. Vous pouvez créer un compte avec votre email, Google ou Facebook. Remplissez ensuite votre profil avec vos compétences, CV, ville et quartier.",
  "tarifs": "Gratuit pour candidats. Standard (1 500 FCFA/mois) : 10 annonces, accès CV. Pro (3 000 FCFA/mois) : annonces illimitées, mise en avant. Entreprise sur devis.",
  "paiement": "Tous les paiements se font via Paystack (Orange Money, MTN, Moov Money, cartes bancaires).",
  "villes": "QuickJob CI est disponible dans toutes les villes de Côte d'Ivoire : Abidjan, Bouaké, Yamoussoukro, San Pedro, Daloa, Korhogo, Man, Gagnoa, etc.",
  "contact": "Vous pouvez nous contacter par WhatsApp (+225 05 65 86 87 86), email (auroratech2222@gmail.com) ou via le chatbot 24/7.",
  "recruteur": "Les recruteurs doivent créer un compte, choisir un plan d'abonnement (Standard, Pro ou Entreprise), puis publier leurs annonces.",
  "sécurité": "Toutes vos données sont sécurisées avec Supabase et des politiques RLS. QuickJob CI ne partage jamais vos données sans accord."
};

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Bonjour ! Je suis le chatbot QuickJob CI. Je peux répondre à vos questions sur notre plateforme, les tarifs, l\'inscription, les paiements et plus encore. Comment puis-je vous aider ?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const findBestMatch = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // Direct keyword matching
    for (const [key, response] of Object.entries(knowledgeBase)) {
      if (lowerQuery.includes(key) || 
          (key === "inscription" && (lowerQuery.includes("inscrire") || lowerQuery.includes("compte"))) ||
          (key === "tarifs" && (lowerQuery.includes("prix") || lowerQuery.includes("coût"))) ||
          (key === "paiement" && (lowerQuery.includes("payer") || lowerQuery.includes("mobile money"))) ||
          (key === "villes" && (lowerQuery.includes("ville") || lowerQuery.includes("abidjan"))) ||
          (key === "contact" && (lowerQuery.includes("contacter") || lowerQuery.includes("support"))) ||
          (key === "recruteur" && (lowerQuery.includes("recruter") || lowerQuery.includes("entreprise"))) ||
          (key === "sécurité" && (lowerQuery.includes("données") || lowerQuery.includes("sécurisé")))
      ) {
        return response;
      }
    }

    // Default responses for common questions
    if (lowerQuery.includes("comment") && lowerQuery.includes("emploi")) {
      return "Pour chercher un emploi : 1) Inscrivez-vous gratuitement 2) Complétez votre profil 3) Parcourez les offres 4) Postulez directement via WhatsApp. Simple et rapide !";
    }
    
    if (lowerQuery.includes("publier") && lowerQuery.includes("annonce")) {
      return "Pour publier une annonce : 1) Créez un compte recruteur 2) Choisissez votre plan (Standard ou Pro) 3) Rédigez votre offre 4) Publiez ! Votre annonce sera visible immédiatement.";
    }
    
    if (lowerQuery.includes("avantage")) {
      return "QuickJob CI c'est : ✅ Inscription gratuite pour candidats ✅ Contact direct WhatsApp ✅ Géolocalisation par quartier ✅ Paiement mobile money ✅ Support 7j/7";
    }

    return "Je n'ai pas trouvé d'information spécifique à votre question. Contactez notre support WhatsApp au +225 05 65 86 87 86 pour une aide personnalisée, ou posez une question sur nos tarifs, l'inscription, les villes couvertes, etc.";
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    // Simulate processing time
    setTimeout(() => {
      const botResponse = findBestMatch(currentInput);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "Comment m'inscrire ?",
    "Quels sont vos prix ?",
    "Dans quelles villes êtes-vous ?",
    "Comment payer avec Mobile Money ?",
    "Comment publier une annonce ?",
    "Comment contacter le support ?"
  ];

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
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Chatbot QuickJob CI
                </h1>
                <p className="text-muted-foreground text-sm">Assistant automatique 24/7</p>
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
              <MessageSquare className="w-5 h-5 text-accent" />
              Questions fréquentes QuickJob CI
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
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-muted text-foreground border border-border/20'
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
                <div className="bg-muted text-foreground p-4 rounded-lg flex items-center gap-2 border border-border/20">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Recherche dans la base de connaissances...</span>
                </div>
              </div>
            )}
          </CardContent>

          {/* Input */}
          <div className="p-6 border-t border-border/20">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Posez votre question..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size="icon"
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

        {/* Quick Questions */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Questions fréquentes :</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => setInputMessage(question)}
                className="h-auto p-3 text-left justify-start text-sm"
                disabled={isLoading}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
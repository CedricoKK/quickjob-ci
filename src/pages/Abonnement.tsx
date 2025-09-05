import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CreditCard, Smartphone, Shield, Check, Crown, Star, Zap, Users, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

const Abonnement = () => {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const plans = [
    {
      id: 'free',
      name: 'Gratuit',
      price: 0,
      period: 'toujours',
      description: 'Parfait pour les candidats à la recherche d\'emploi',
      badge: 'Populaire',
      badgeColor: 'secondary',
      features: [
        'Accès à toutes les offres d\'emploi',
        'Candidatures illimitées',
        'Création de profil candidat',
        'Notifications par email',
        'Support communautaire'
      ],
      icon: Users,
      recommended: false
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 1500,
      period: 'mois',
      description: 'Idéal pour les petites entreprises et recruteurs indépendants',
      badge: '1 semaine gratuite',
      badgeColor: 'default',
      features: [
        'Publier jusqu\'à 10 annonces/mois',
        'Accès aux CV des candidats',
        'Statistiques de base',
        'Support email prioritaire',
        'Gestion des candidatures',
        'Profil recruteur vérifié'
      ],
      icon: Star,
      recommended: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 3000,
      period: 'mois',
      description: 'Pour les entreprises qui recrutent régulièrement',
      badge: 'Recommandé',
      badgeColor: 'destructive',
      features: [
        'Annonces illimitées',
        'Accès illimité aux profils candidats',
        'Mise en avant des offres',
        'Support prioritaire (WhatsApp + email)',
        'Statistiques avancées',
        'API d\'intégration',
        'Tableau de bord personnalisé',
        'Badge "Recruteur Pro"'
      ],
      icon: Crown,
      recommended: true
    }
  ];

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user?.email) {
        setEmail(user.email);
      }
    };
    
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) {
        setEmail(session.user.email);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handlePayment = async () => {
    if (!selectedPlan || !email) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un plan et saisir votre email.",
        variant: "destructive",
      });
      return;
    }

    if (selectedPlan === 'free') {
      if (!user) {
        navigate('/inscription');
        return;
      }
      toast({
        title: "Plan gratuit activé",
        description: "Vous utilisez déjà le plan gratuit !",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour souscrire à un abonnement payant.",
        variant: "destructive",
      });
      navigate('/connexion');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate Paystack payment initialization
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const selectedPlanData = plans.find(p => p.id === selectedPlan);
      
      toast({
        title: "Redirection vers Paystack",
        description: `Initialisation du paiement pour le plan ${selectedPlanData?.name} (${selectedPlanData?.price} FCFA/mois)`,
      });

      // Here you would normally redirect to Paystack
      // window.location.href = paystackUrl;
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'initialiser le paiement. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-secondary border-b border-border/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Plans d'abonnement
              </h1>
              <p className="text-muted-foreground mt-2">
                Choisissez le plan qui correspond le mieux à vos besoins
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            const isSelected = selectedPlan === plan.id;
            const isRecommended = plan.recommended;
            
            return (
              <Card 
                key={plan.id}
                className={`relative bg-gradient-card border-border/20 shadow-card hover:shadow-elegant transition-all duration-300 cursor-pointer ${
                  isSelected ? 'ring-2 ring-primary' : ''
                } ${isRecommended ? 'scale-105 border-primary/30' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {isRecommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge variant="destructive" className="px-3 py-1">
                      <Crown className="w-3 h-3 mr-1" />
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-xl ${plan.id === 'free' ? 'bg-secondary/20' : plan.id === 'standard' ? 'bg-primary/20' : 'bg-gradient-primary'} text-primary`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl font-bold text-foreground">
                    {plan.name}
                  </CardTitle>
                  
                  <div className="text-center">
                    <span className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                      {plan.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">
                      FCFA/{plan.period}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-2">
                    {plan.description}
                  </p>
                  
                  {!isRecommended && plan.badge && (
                    <Badge variant={plan.badgeColor as any} className="mt-2">
                      {plan.badge}
                    </Badge>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    className={`w-full mt-6 ${isSelected ? 'bg-gradient-primary hover:opacity-90' : ''}`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Sélectionné
                      </>
                    ) : (
                      `Choisir ${plan.name}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Payment Section */}
        {selectedPlan && (
          <div className="max-w-md mx-auto mt-12">
            <Card className="bg-gradient-card border-border/20 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-primary" />
                  Finaliser l'abonnement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Plan Summary */}
                <div className="p-4 bg-muted/10 rounded-lg border border-border/20">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Plan sélectionné:</span>
                    <span className="text-primary font-bold">
                      {plans.find(p => p.id === selectedPlan)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span>Prix:</span>
                    <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                      {plans.find(p => p.id === selectedPlan)?.price.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email de facturation</label>
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!!user}
                  />
                  {!user && (
                    <p className="text-xs text-muted-foreground">
                      <Lock className="w-3 h-3 inline mr-1" />
                      Connectez-vous pour un paiement plus rapide
                    </p>
                  )}
                </div>

                {/* Payment Methods */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Moyens de paiement acceptés</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-3 border border-border/20 rounded-lg">
                      <Smartphone className="w-5 h-5 text-primary" />
                      <div className="text-xs">
                        <div className="font-medium">Mobile Money</div>
                        <div className="text-muted-foreground">Orange, MTN, Moov</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 border border-border/20 rounded-lg">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <div className="text-xs">
                        <div className="font-medium">Cartes bancaires</div>
                        <div className="text-muted-foreground">Visa, Mastercard</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="flex items-start gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div className="text-xs">
                    <div className="font-medium text-primary">Paiement sécurisé</div>
                    <div className="text-muted-foreground">
                      Vos données sont protégées par Paystack (certifié PCI DSS)
                    </div>
                  </div>
                </div>

                {/* Payment Button */}
                <Button
                  onClick={handlePayment}
                  disabled={isLoading || !selectedPlan || !email}
                  className="w-full bg-gradient-primary hover:opacity-90"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Redirection en cours...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      {selectedPlan === 'free' ? 'Commencer gratuitement' : `Payer ${plans.find(p => p.id === selectedPlan)?.price.toLocaleString()} FCFA`}
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  En procédant au paiement, vous acceptez nos conditions d'utilisation.
                  {selectedPlan !== 'free' && ' Annulation possible à tout moment.'}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-primary bg-clip-text text-transparent">
            Questions fréquentes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-card border-border/20">
              <CardHeader>
                <CardTitle className="text-lg">Comment modifier mon abonnement ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Vous pouvez changer de plan à tout moment depuis votre tableau de bord. 
                  Les modifications prennent effet immédiatement.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-border/20">
              <CardHeader>
                <CardTitle className="text-lg">Puis-je annuler à tout moment ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Oui, vous pouvez annuler votre abonnement à tout moment. 
                  Aucun frais d'annulation n'est appliqué.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Abonnement;
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Crown, Zap } from 'lucide-react';

const PricingSection = () => {
  const plans = [
    {
      name: "Gratuit",
      price: "0",
      period: "toujours",
      description: "Pour les candidats à la recherche d'emploi",
      icon: <Star className="w-6 h-6" />,
      popular: false,
      features: [
        "Inscription gratuite",
        "Accès à toutes les offres",
        "Postuler sans limite",
        "Profil visible par les recruteurs",
        "Notifications par email",
        "Support par email"
      ],
      cta: "S'inscrire gratuitement",
      variant: "outline" as const
    },
    {
      name: "Standard",
      price: "1 500",
      period: "mois",
      description: "Pour les recruteurs particuliers",
      icon: <Zap className="w-6 h-6" />,
      popular: true,
      trial: "1 semaine gratuite",
      features: [
        "Publier jusqu'à 10 annonces/mois",
        "Accès aux CV des candidats",
        "Statistiques de base",
        "Support email prioritaire",
        "Gestion des candidatures",
        "Filtres de recherche avancés"
      ],
      cta: "Commencer l'essai gratuit",
      variant: "hero" as const
    },
    {
      name: "Pro",
      price: "3 000",
      period: "mois",
      description: "Pour les entreprises et recruteurs professionnels",
      icon: <Crown className="w-6 h-6" />,
      popular: false,
      trial: "1 semaine gratuite",
      features: [
        "Annonces illimitées",
        "Accès illimité aux profils candidats",
        "Mise en avant des offres",
        "Support prioritaire (WhatsApp + email)",
        "Statistiques avancées",
        "Gestionnaire de compte dédié",
        "API d'intégration",
        "Marque blanche disponible"
      ],
      cta: "Commencer l'essai gratuit",
      variant: "premium" as const
    }
  ];

  const handleSubscribe = (planName: string) => {
    if (planName === "Gratuit") {
      // Redirect to signup
      console.log('Redirection vers inscription gratuite');
    } else {
      // Redirect to Paystack payment
      console.log(`Redirection vers paiement Paystack pour plan ${planName}`);
    }
  };

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Nos Tarifs
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choisissez le plan qui correspond à vos besoins. Tous les plans recruteurs incluent un essai gratuit de 7 jours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name}
              className={`relative bg-gradient-card border-border/20 shadow-card hover:shadow-elegant transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-primary/50 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-primary text-white px-4 py-1">
                  Plus populaire
                </Badge>
              )}
              
              <CardHeader className="text-center pb-8">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center text-white">
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">{plan.name}</CardTitle>
                <div className="text-center">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  {plan.price !== "0" && <span className="text-muted-foreground"> FCFA</span>}
                  <div className="text-muted-foreground">/{plan.period}</div>
                  {plan.trial && (
                    <Badge variant="secondary" className="mt-2">
                      {plan.trial}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-sm mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={() => handleSubscribe(plan.name)}
                  variant={plan.variant}
                  size="lg" 
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enterprise section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-card border-border/20 shadow-card max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-foreground">Entreprise</h3>
              <p className="text-muted-foreground mb-6">
                Besoin d'une solution sur mesure ? Contactez-nous pour un devis personnalisé incluant :
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-lg font-semibold text-foreground">Gestion multi-compte</div>
                  <div className="text-sm text-muted-foreground">Plusieurs recruteurs</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-foreground">Dashboard RH personnalisé</div>
                  <div className="text-sm text-muted-foreground">Interface sur mesure</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-foreground">Support dédié</div>
                  <div className="text-sm text-muted-foreground">Gestionnaire de compte</div>
                </div>
              </div>
              <Button variant="premium" size="lg">
                Demander un devis
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Payment info */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Paiements sécurisés via Paystack • Annulation possible à tout moment
          </p>
          <div className="flex justify-center items-center gap-6 opacity-60">
            <span className="text-sm">Paiement mobile money accepté</span>
            <span className="text-sm">•</span>
            <span className="text-sm">Cartes bancaires</span>
            <span className="text-sm">•</span>
            <span className="text-sm">Virements</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
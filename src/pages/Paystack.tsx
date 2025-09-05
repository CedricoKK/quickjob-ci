import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CreditCard, Smartphone, Shield, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const Paystack = () => {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const plans = [
    {
      id: 'standard',
      name: 'Standard',
      price: 1500,
      period: 'mois',
      features: [
        'Publier jusqu\'à 10 annonces/mois',
        'Accès aux CV des candidats',
        'Statistiques de base',
        'Support email prioritaire'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 3000,
      period: 'mois',
      features: [
        'Annonces illimitées',
        'Accès illimité aux profils candidats',
        'Mise en avant des offres',
        'Support prioritaire (WhatsApp + email)',
        'Statistiques avancées',
        'API d\'intégration'
      ]
    }
  ];

  const handlePayment = async () => {
    if (!selectedPlan || !email) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un plan et saisir votre email.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Here you would integrate with Paystack
      // For now, we'll simulate the payment process
      
      const selectedPlanData = plans.find(p => p.id === selectedPlan);
      
      // Paystack configuration would go here
      const paystackConfig = {
        reference: `qjci_${Date.now()}`,
        email: email,
        amount: selectedPlanData!.price * 100, // Paystack expects amount in kobo
        currency: 'XOF', // West African CFA Franc
        callback: (response: any) => {
          toast({
            title: "Paiement réussi !",
            description: `Votre abonnement ${selectedPlanData!.name} est maintenant actif.`,
          });
        },
        onClose: () => {
          setIsLoading(false);
        }
      };

      // Simulate payment success for demo
      setTimeout(() => {
        toast({
          title: "Redirection vers Paystack",
          description: "Vous allez être redirigé vers la page de paiement sécurisée.",
        });
        setIsLoading(false);
      }, 1500);

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Erreur de paiement",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
      setIsLoading(false);
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
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Paiement Paystack
                </h1>
                <p className="text-muted-foreground text-sm">Paiement sécurisé pour votre abonnement</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plan Selection */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-border/20 shadow-card">
              <CardHeader>
                <CardTitle>Choisissez votre plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPlan === plan.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border/20 hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{plan.name}</h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {plan.price.toLocaleString()} FCFA
                        </div>
                        <div className="text-sm text-muted-foreground">/{plan.period}</div>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-success" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className="bg-gradient-card border-border/20 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Méthodes de paiement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 p-3 border border-border/20 rounded-lg">
                    <Smartphone className="w-5 h-5 text-orange-500" />
                    <span className="text-sm">Orange Money</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 border border-border/20 rounded-lg">
                    <Smartphone className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm">MTN Mobile Money</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 border border-border/20 rounded-lg">
                    <Smartphone className="w-5 h-5 text-blue-500" />
                    <span className="text-sm">Moov Money</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 border border-border/20 rounded-lg">
                    <CreditCard className="w-5 h-5 text-purple-500" />
                    <span className="text-sm">Carte bancaire</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-border/20 shadow-card">
              <CardHeader>
                <CardTitle>Informations de paiement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {selectedPlan && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Récapitulatif</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Plan sélectionné :</span>
                        <span className="font-medium">
                          {plans.find(p => p.id === selectedPlan)?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Prix :</span>
                        <span className="font-medium">
                          {plans.find(p => p.id === selectedPlan)?.price.toLocaleString()} FCFA/mois
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">Total :</span>
                        <span className="font-bold text-primary">
                          {plans.find(p => p.id === selectedPlan)?.price.toLocaleString()} FCFA
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handlePayment}
                  disabled={!selectedPlan || !email || isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Redirection...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Payer maintenant
                    </>
                  )}
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  En cliquant sur "Payer maintenant", vous acceptez nos conditions d'utilisation.
                  Paiement sécurisé par Paystack.
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="bg-gradient-card border-border/20 shadow-card">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-success mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium mb-1">Paiement 100% sécurisé</div>
                    <div className="text-muted-foreground">
                      Vos informations de paiement sont protégées par le cryptage SSL de Paystack.
                      Nous ne stockons aucune donnée bancaire.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Paystack;
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MessageCircle, MapPin, Clock, Globe } from 'lucide-react';

const ContactSection = () => {
  const handleEmail = () => {
    window.location.href = 'mailto:contact@quickjob-ci.auroratech.be';
  };

  const handlePhone = () => {
    window.location.href = 'tel:+2250000000000';
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Bonjour 👋, j'aimerais avoir plus d'informations sur QuickJob CI.");
    window.open(`https://wa.me/+2250000000000?text=${message}`, '_blank');
  };

  return (
    <section id="contact" className="py-20 bg-gradient-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Contactez-nous
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Notre équipe est disponible pour vous accompagner dans votre recherche d'emploi ou vos besoins de recrutement.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="bg-gradient-card border-border/20 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <Globe className="w-6 h-6 text-primary" />
                  Informations de contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">Email</h3>
                    <p className="text-muted-foreground">contact@quickjob-ci.auroratech.be</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">Téléphone</h3>
                    <p className="text-muted-foreground">+225 00 00 00 00 00</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <MessageCircle className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">WhatsApp</h3>
                    <p className="text-muted-foreground">Support disponible 24h/7j</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">Adresse</h3>
                    <p className="text-muted-foreground">
                      Plateau, Abidjan<br />
                      Côte d'Ivoire
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">Horaires</h3>
                    <p className="text-muted-foreground">
                      Lun - Ven: 8h00 - 18h00<br />
                      Sam: 9h00 - 16h00<br />
                      Dim: Support WhatsApp uniquement
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Actions */}
          <div className="space-y-8">
            <Card className="bg-gradient-card border-border/20 shadow-card">
              <CardHeader>
                <CardTitle className="text-foreground">Contactez-nous directement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleEmail}
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Envoyer un email
                </Button>
                
                <Button 
                  onClick={handlePhone}
                  variant="premium" 
                  size="lg" 
                  className="w-full"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Appeler maintenant
                </Button>
                
                <Button 
                  onClick={handleWhatsApp}
                  variant="glass" 
                  size="lg" 
                  className="w-full bg-green-500/20 hover:bg-green-500/30 border-green-500/20"
                >
                  <MessageCircle className="mr-2 h-5 w-5 text-green-400" />
                  WhatsApp
                </Button>
              </CardContent>
            </Card>

            {/* FAQ Links */}
            <Card className="bg-gradient-card border-border/20 shadow-card">
              <CardHeader>
                <CardTitle className="text-foreground">Questions fréquentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border/20">
                    <span className="text-sm">Comment publier une offre d'emploi ?</span>
                    <Button variant="ghost" size="sm">→</Button>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/20">
                    <span className="text-sm">Comment postuler à un job ?</span>
                    <Button variant="ghost" size="sm">→</Button>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/20">
                    <span className="text-sm">Quels sont les tarifs ?</span>
                    <Button variant="ghost" size="sm">→</Button>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm">Comment sécuriser les paiements ?</span>
                    <Button variant="ghost" size="sm">→</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
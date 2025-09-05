import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Mail, Phone, MessageCircle, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-secondary border-t border-border/20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/b3fa6b80-acf8-4cd8-8758-d3ce4cd3e808.png" 
                alt="QuickJob CI" 
                className="w-12 h-12"
              />
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                QuickJob CI
              </span>
            </div>
            <p className="text-muted-foreground">
              La première plateforme ivoirienne pour trouver rapidement un petit boulot ou recruter des talents locaux.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="icon" className="w-8 h-8" aria-label="Suivez-nous sur Facebook">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8" aria-label="Suivez-nous sur Twitter">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8" aria-label="Suivez-nous sur Instagram">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8" aria-label="Suivez-nous sur LinkedIn">
                <Linkedin className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Liens rapides</h3>
            <div className="space-y-2">
              <a href="#home" className="block text-muted-foreground hover:text-primary transition-colors">
                Accueil
              </a>
              <a href="#jobs" className="block text-muted-foreground hover:text-primary transition-colors">
                Emplois
              </a>
              <a href="#pricing" className="block text-muted-foreground hover:text-primary transition-colors">
                Tarifs
              </a>
              <a href="#contact" className="block text-muted-foreground hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Catégories populaires</h3>
            <div className="space-y-2">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Ménage
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Livraison
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Jardinage
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Informatique
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Garde d'enfant
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-sm">contact@quickjob-ci.auroratech.be</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-sm">+225 00 00 00 00 00</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">WhatsApp 24h/7j</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm">Plateau, Abidjan, CI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-muted-foreground text-sm">
                © {currentYear} QuickJob CI. Tous droits réservés.
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Développé avec ❤️ en Côte d'Ivoire
              </p>
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Conditions d'utilisation
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Aide
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
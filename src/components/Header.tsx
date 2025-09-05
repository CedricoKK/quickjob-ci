import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogIn } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Accueil', href: '#home' },
    { name: 'Emplois', href: '#jobs' },
    { name: 'Tarifs', href: '#pricing' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/b3fa6b80-acf8-4cd8-8758-d3ce4cd3e808.png" 
              alt="QuickJob CI" 
              className="w-10 h-10"
            />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              QuickJob CI
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm">
              <LogIn className="w-4 h-4 mr-2" />
              Connexion
            </Button>
            <Button variant="hero" size="sm">
              <User className="w-4 h-4 mr-2" />
              S'inscrire
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/20">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-border/20">
                <Button variant="ghost" size="sm" className="justify-start">
                  <LogIn className="w-4 h-4 mr-2" />
                  Connexion
                </Button>
                <Button variant="hero" size="sm" className="justify-start">
                  <User className="w-4 h-4 mr-2" />
                  S'inscrire
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
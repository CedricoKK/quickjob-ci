import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, Users, MapPin, Star } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted">
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-gradient-glow opacity-20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src="/lovable-uploads/b3fa6b80-acf8-4cd8-8758-d3ce4cd3e808.png" 
              alt="QuickJob CI Logo" 
              className="w-32 h-32 mx-auto mb-6 drop-shadow-2xl"
            />
          </div>

          {/* Main heading */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
            QuickJob CI
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-4 font-medium">
            Trouvez un petit boulot rapidement en Côte d'Ivoire
          </p>

          <p className="text-lg md:text-xl text-muted-foreground/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            La première plateforme ivoirienne qui connecte en temps réel les jeunes à la recherche de petits boulots avec les particuliers et entreprises qui ont besoin d'aide fiable.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button variant="hero" size="xl" className="min-w-[200px]">
              <Search className="mr-2 h-5 w-5" />
              Chercher un emploi
            </Button>
            <Button variant="premium" size="xl" className="min-w-[200px]">
              <Users className="mr-2 h-5 w-5" />
              Recruter maintenant
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">+1000</div>
              <div className="text-muted-foreground">Jobs disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">+500</div>
              <div className="text-muted-foreground">Candidats actifs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-glow mb-2">+100</div>
              <div className="text-muted-foreground">Recruteurs</div>
            </div>
          </div>

          {/* Location badges */}
          <div className="mt-16">
            <p className="text-muted-foreground mb-6">Disponible dans toutes les grandes villes de Côte d'Ivoire</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'Abidjan', 'Bouaké', 'Yamoussoukro', 'San Pedro', 
                'Daloa', 'Korhogo', 'Man', 'Gagnoa'
              ].map((city) => (
                <div 
                  key={city}
                  className="flex items-center gap-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-full px-4 py-2"
                >
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{city}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex items-center justify-center gap-2 text-warning">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
            <span className="ml-2 text-muted-foreground">
              Plateforme #1 des petits boulots en Côte d'Ivoire
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Clock, Briefcase, Users, Phone, ArrowLeft, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

// Sample job data
const jobs = [
  {
    id: 1,
    title: "Aide ménagère",
    company: "Famille Kouadio",
    location: "Plateau, Abidjan",
    type: "Temps partiel",
    salary: "25,000 FCFA/mois",
    description: "Recherche aide ménagère pour 3h/jour, 5 jours/semaine.",
    posted: "2 heures",
    urgent: true,
    contact: "+225 05 65 86 87 86"
  },
  {
    id: 2,
    title: "Livreur à moto",
    company: "Restaurant Le Palmier",
    location: "Cocody, Abidjan",
    type: "Temps plein",
    salary: "60,000 FCFA/mois",
    description: "Livraison de repas, permis moto obligatoire.",
    posted: "4 heures",
    urgent: false,
    contact: "+225 07 78 51 89 02"
  },
  {
    id: 3,
    title: "Garde d'enfant",
    company: "Famille Diabaté",
    location: "Marcory, Abidjan",
    type: "Temps partiel",
    salary: "35,000 FCFA/mois",
    description: "Garde d'enfants de 6 et 8 ans, après-midi uniquement.",
    posted: "1 jour",
    urgent: false,
    contact: "+225 05 65 86 87 86"
  },
  {
    id: 4,
    title: "Jardinier",
    company: "Villa Bingerville",
    location: "Bingerville",
    type: "Temps partiel",
    salary: "40,000 FCFA/mois",
    description: "Entretien jardin et espaces verts, 2 fois/semaine.",
    posted: "2 jours",
    urgent: true,
    contact: "+225 07 78 51 89 02"
  },
  {
    id: 5,
    title: "Vendeur ambulant",
    company: "Coopérative Attiéké",
    location: "Adjamé, Abidjan",
    type: "Temps plein",
    salary: "50,000 FCFA/mois",
    description: "Vente d'attiéké et accompagnements en journée.",
    posted: "3 jours",
    urgent: false,
    contact: "+225 05 65 86 87 86"
  },
  {
    id: 6,
    title: "Mécanicien assistant",
    company: "Garage Auto Plus",
    location: "Yopougon, Abidjan",
    type: "Temps plein",
    salary: "55,000 FCFA/mois",
    description: "Assistance en mécanique auto, formation souhaitée.",
    posted: "5 jours",
    urgent: false,
    contact: "+225 07 78 51 89 02"
  }
];

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === 'all' || job.location.includes(locationFilter);
    const matchesType = typeFilter === 'all' || job.type === typeFilter;
    
    return matchesSearch && matchesLocation && matchesType;
  });

  const handleContact = (contact: string) => {
    const message = encodeURIComponent("Bonjour, je suis intéressé(e) par l'offre d'emploi publiée sur QuickJob CI.");
    window.open(`https://wa.me/${contact.replace(/\s+/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-secondary border-b border-border/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Offres d'emploi
            </h1>
          </div>
          
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher un emploi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes les villes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les villes</SelectItem>
                <SelectItem value="Abidjan">Abidjan</SelectItem>
                <SelectItem value="Bouaké">Bouaké</SelectItem>
                <SelectItem value="Yamoussoukro">Yamoussoukro</SelectItem>
                <SelectItem value="Bingerville">Bingerville</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type de contrat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="Temps plein">Temps plein</SelectItem>
                <SelectItem value="Temps partiel">Temps partiel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            {filteredJobs.length} emploi(s) trouvé(s)
          </p>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtres avancés
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="bg-gradient-card border-border/20 shadow-card hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg text-foreground">{job.title}</CardTitle>
                      {job.urgent && (
                        <Badge variant="destructive" className="text-xs">
                          Urgent
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground font-medium">{job.company}</p>
                  </div>
                  <Badge variant="secondary">{job.type}</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-foreground">{job.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-sm font-medium text-primary">{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Publié il y a {job.posted}</span>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={() => handleContact(job.contact)}
                    variant="hero" 
                    size="sm" 
                    className="flex-1"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Contacter
                  </Button>
                  <Button variant="outline" size="sm">
                    Détails
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No results */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun emploi trouvé</h3>
            <p className="text-muted-foreground">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
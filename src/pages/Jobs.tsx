import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Clock, Briefcase, Users, Phone, ArrowLeft, Search, Filter, Lock, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import type { User } from '@supabase/supabase-js';

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  city: string;
  commune?: string;
  quartier?: string;
  salary_min?: number;
  salary_max?: number;
  is_urgent?: boolean;
  is_featured?: boolean;
  created_at: string;
  contact_email?: string;
  contact_phone?: string;
  recruiter_id: string;
}

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Check user authentication status
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch jobs based on authentication status
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        let query;
        
        if (user) {
          // Authenticated users get full job details including contact info
          query = supabase
            .from('jobs')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });
        } else {
          // Anonymous users get limited job details (no contact info)
          query = supabase
            .from('jobs_public_safe')
            .select('*')
            .order('created_at', { ascending: false });
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching jobs:', error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les offres d'emploi",
            variant: "destructive",
          });
          return;
        }

        setJobs(data || []);
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [user, toast]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === 'all' || job.city.includes(locationFilter);
    
    return matchesSearch && matchesLocation;
  });

  const handleContact = (job: Job) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez vous connecter pour accéder aux informations de contact",
        variant: "destructive",
      });
      return;
    }

    if (!job.contact_phone) {
      toast({
        title: "Information manquante",
        description: "Les informations de contact ne sont pas disponibles pour cette offre",
        variant: "destructive",
      });
      return;
    }

    const message = encodeURIComponent(`Bonjour, je suis intéressé(e) par l'offre "${job.title}" publiée sur QuickJob CI.`);
    const phoneNumber = job.contact_phone.replace(/\s+/g, '').replace(/^\+/, '');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const formatSalary = (job: Job) => {
    if (job.salary_min && job.salary_max) {
      return `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} FCFA`;
    } else if (job.salary_min) {
      return `À partir de ${job.salary_min.toLocaleString()} FCFA`;
    } else if (job.salary_max) {
      return `Jusqu'à ${job.salary_max.toLocaleString()} FCFA`;
    }
    return 'Salaire à négocier';
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Moins d\'une heure';
    if (diffInHours < 24) return `${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    
    return date.toLocaleDateString('fr-FR');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des offres d'emploi...</p>
        </div>
      </div>
    );
  }

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
            {!user && (
              <Badge variant="outline" className="ml-auto">
                <Lock className="w-3 h-3 mr-1" />
                Connectez-vous pour voir les contacts
              </Badge>
            )}
          </div>
          
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <SelectItem value="San Pedro">San Pedro</SelectItem>
                <SelectItem value="Daloa">Daloa</SelectItem>
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
          {!user && (
            <Link to="/auth">
              <Button variant="outline" size="sm">
                <LogIn className="w-4 h-4 mr-2" />
                Se connecter
              </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="bg-gradient-card border-border/20 shadow-card hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg text-foreground">{job.title}</CardTitle>
                      {job.is_urgent && (
                        <Badge variant="destructive" className="text-xs">
                          Urgent
                        </Badge>
                      )}
                      {job.is_featured && (
                        <Badge variant="secondary" className="text-xs">
                          En vedette
                        </Badge>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {job.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-foreground line-clamp-3">{job.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">
                      {job.city}
                      {job.commune && `, ${job.commune}`}
                      {job.quartier && `, ${job.quartier}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-sm font-medium text-primary">
                      {formatSalary(job)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      Publié il y a {formatTimeAgo(job.created_at)}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  {user ? (
                    <Button 
                      onClick={() => handleContact(job)}
                      variant="hero" 
                      size="sm" 
                      className="flex-1"
                      disabled={!job.contact_phone}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Contacter
                    </Button>
                  ) : (
                    <Link to="/auth" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Lock className="w-4 h-4 mr-2" />
                        Se connecter pour contacter
                      </Button>
                    </Link>
                  )}
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
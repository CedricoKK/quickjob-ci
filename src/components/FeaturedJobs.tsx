import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, DollarSign, Briefcase } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

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
  is_urgent: boolean;
  is_featured: boolean;
  created_at: string;
}

const FeaturedJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedJobs();
  }, []);

  const fetchFeaturedJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs_public_safe')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des emplois:', error);
    } finally {
      setLoading(false);
    }
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

    if (diffInHours < 24) {
      return `il y a ${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `il y a ${diffInDays}j`;
    }
  };

  const getCategoryLabel = (category: string) => {
    const categories: { [key: string]: string } = {
      'menage': 'Ménage',
      'jardinage': 'Jardinage',
      'bricolage': 'Bricolage',
      'livraison': 'Livraison',
      'garde_enfant': 'Garde d\'enfant',
      'aide_personne_agee': 'Aide personne âgée',
      'cours_particulier': 'Cours particulier',
      'evenementiel': 'Événementiel',
      'restauration': 'Restauration',
      'informatique': 'Informatique',
      'autre': 'Autre'
    };
    return categories[category] || category;
  };

  if (loading) {
    return (
      <div className="py-16 bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Emplois Disponibles</h2>
            <p className="text-muted-foreground">Découvrez les dernières opportunités</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="h-64 animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded mb-4"></div>
                  <div className="h-3 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-4"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Emplois Disponibles</h2>
          <p className="text-muted-foreground">Découvrez les dernières opportunités d'emploi en Côte d'Ivoire</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow border-border/50 bg-card">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={job.is_featured ? "default" : "secondary"} className="text-xs">
                    {job.is_featured ? "Featured" : getCategoryLabel(job.category)}
                  </Badge>
                  {job.is_urgent && (
                    <Badge variant="destructive" className="text-xs">
                      Urgent
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg font-semibold text-card-foreground line-clamp-2">
                  {job.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {job.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>
                      {job.city}
                      {job.commune && `, ${job.commune}`}
                      {job.quartier && `, ${job.quartier}`}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>{formatSalary(job)}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{formatTimeAgo(job.created_at)}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => navigate('/jobs')} 
                  className="w-full"
                  size="sm"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Voir l'emploi
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            onClick={() => navigate('/jobs')} 
            variant="outline" 
            size="lg"
            className="px-8"
          >
            Voir tous les emplois
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedJobs;
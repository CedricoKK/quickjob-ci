import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  User as UserIcon, 
  FileText, 
  Upload,
  LogOut,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';

interface CandidateDashboardProps {
  user: User;
}

const CandidateDashboard = ({ user }: CandidateDashboardProps) => {
  const [profile, setProfile] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    category: '',
    salary_min: ''
  });
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, [user.id]);

  useEffect(() => {
    fetchFilteredJobs();
  }, [filters]);

  const fetchDashboardData = async () => {
    try {
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch user's applications
      const { data: applicationsData } = await supabase
        .from('job_applications')
        .select(`
          *,
          jobs (title, city, category, salary_min, salary_max, recruiter_id)
        `)
        .eq('candidate_id', user.id)
        .order('created_at', { ascending: false });

      if (applicationsData) {
        setApplications(applicationsData);
        
        // Calculate stats
        const totalApplications = applicationsData.length;
        const pendingApplications = applicationsData.filter(app => app.status === 'pending').length;
        const acceptedApplications = applicationsData.filter(app => app.status === 'accepted').length;
        const rejectedApplications = applicationsData.filter(app => app.status === 'rejected').length;

        setStats({
          totalApplications,
          pendingApplications,
          acceptedApplications,
          rejectedApplications
        });
      }

      fetchFilteredJobs();
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du tableau de bord",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFilteredJobs = async () => {
    try {
      let query = supabase
        .from('jobs_public_safe')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      if (filters.city) {
        query = query.eq('city', filters.city);
      }
      if (filters.category) {
        query = query.eq('category', filters.category as any);
      }
      if (filters.salary_min) {
        query = query.gte('salary_min', parseInt(filters.salary_min));
      }

      const { data: jobsData } = await query.limit(20);

      if (jobsData) {
        setJobs(jobsData);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleApplyToJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          candidate_id: user.id,
          status: 'pending'
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Candidature déjà envoyée",
            description: "Vous avez déjà postulé à cette offre",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Candidature envoyée",
        description: "Votre candidature a été envoyée avec succès",
      });

      // Refresh applications
      fetchDashboardData();
    } catch (error) {
      console.error('Error applying to job:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre candidature",
        variant: "destructive",
      });
    }
  };

  const updateAvailabilityStatus = async (status: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ availability_status: status })
        .eq('id', user.id);

      if (error) throw error;

      setProfile({ ...profile, availability_status: status });
      toast({
        title: "Statut mis à jour",
        description: "Votre statut de disponibilité a été mis à jour",
      });
    } catch (error) {
      console.error('Error updating availability:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre statut",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const isJobApplied = (jobId: string) => {
    return applications.some(app => app.jobs && app.jobs.id === jobId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-secondary border-b border-border/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Tableau de bord Candidat
                </h1>
                <p className="text-muted-foreground text-sm">
                  Bienvenue {profile?.full_name || user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {profile?.availability_status && (
                <Badge 
                  variant={profile.availability_status === 'available' ? 'default' : 'secondary'}
                >
                  {profile.availability_status === 'available' ? 'Disponible' : 'Non disponible'}
                </Badge>
              )}
              <Button onClick={handleLogout} variant="ghost" size="icon">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Candidatures</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalApplications}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Attente</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingApplications}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Acceptées</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.acceptedApplications}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Refusées</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rejectedApplications}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="jobs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="jobs">Offres d'emploi</TabsTrigger>
            <TabsTrigger value="applications">Mes candidatures</TabsTrigger>
            <TabsTrigger value="profile">Mon profil</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-4">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtrer les offres
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Recherche</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Titre ou mots-clés..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Ville</Label>
                    <Input
                      placeholder="Ville..."
                      value={filters.city}
                      onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Catégorie</Label>
                    <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Toutes</SelectItem>
                        <SelectItem value="menage">Ménage</SelectItem>
                        <SelectItem value="jardinage">Jardinage</SelectItem>
                        <SelectItem value="bricolage">Bricolage</SelectItem>
                        <SelectItem value="livraison">Livraison</SelectItem>
                        <SelectItem value="garde_enfant">Garde d'enfant</SelectItem>
                        <SelectItem value="aide_personne_agee">Aide personne âgée</SelectItem>
                        <SelectItem value="cours_particulier">Cours particulier</SelectItem>
                        <SelectItem value="evenementiel">Événementiel</SelectItem>
                        <SelectItem value="restauration">Restauration</SelectItem>
                        <SelectItem value="informatique">Informatique</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Salaire minimum</Label>
                    <Input
                      type="number"
                      placeholder="Montant..."
                      value={filters.salary_min}
                      onChange={(e) => setFilters({ ...filters, salary_min: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Jobs List */}
            <div className="grid gap-4">
              {jobs.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucune offre trouvée</h3>
                    <p className="text-muted-foreground">
                      Modifiez vos filtres de recherche pour voir plus d'offres
                    </p>
                  </CardContent>
                </Card>
              ) : (
                jobs.map((job) => (
                  <Card key={job.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{job.title}</CardTitle>
                          <div className="flex items-center gap-2 text-muted-foreground mt-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.city}</span>
                            {job.quartier && <span>• {job.quartier}</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{job.category}</Badge>
                          {job.salary_min && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {job.salary_min.toLocaleString()} FCFA
                              {job.salary_max && ` - ${job.salary_max.toLocaleString()} FCFA`}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {job.description.length > 200 
                          ? `${job.description.substring(0, 200)}...`
                          : job.description
                        }
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          Publiée le {new Date(job.created_at).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Voir détails
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleApplyToJob(job.id)}
                            disabled={isJobApplied(job.id)}
                          >
                            {isJobApplied(job.id) ? 'Déjà postulé' : 'Postuler'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <h2 className="text-xl font-semibold">Mes candidatures</h2>
            
            <div className="grid gap-4">
              {applications.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucune candidature</h3>
                    <p className="text-muted-foreground">
                      Commencez à postuler aux offres qui vous intéressent
                    </p>
                  </CardContent>
                </Card>
              ) : (
                applications.map((application) => (
                  <Card key={application.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{application.jobs?.title}</h4>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {application.jobs?.city}
                          </p>
                          {application.jobs?.salary_min && (
                            <p className="text-sm text-muted-foreground">
                              {application.jobs.salary_min.toLocaleString()} FCFA
                              {application.jobs.salary_max && ` - ${application.jobs.salary_max.toLocaleString()} FCFA`}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={
                              application.status === 'pending' ? 'outline' :
                              application.status === 'accepted' ? 'default' : 'destructive'
                            }
                          >
                            {application.status === 'pending' ? 'En attente' :
                             application.status === 'accepted' ? 'Acceptée' : 'Refusée'}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(application.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <h2 className="text-xl font-semibold">Mon profil</h2>
            
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Statut de disponibilité</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Button 
                      variant={profile?.availability_status === 'available' ? 'default' : 'outline'}
                      onClick={() => updateAvailabilityStatus('available')}
                    >
                      Disponible
                    </Button>
                    <Button 
                      variant={profile?.availability_status === 'unavailable' ? 'default' : 'outline'}
                      onClick={() => updateAvailabilityStatus('unavailable')}
                    >
                      Non disponible
                    </Button>
                    <Button 
                      variant={profile?.availability_status === 'busy' ? 'default' : 'outline'}
                      onClick={() => updateAvailabilityStatus('busy')}
                    >
                      Occupé
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Nom complet</Label>
                    <p className="text-sm text-muted-foreground">
                      {profile?.full_name || 'Non renseigné'}
                    </p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm text-muted-foreground">{profile?.email}</p>
                  </div>
                  <div>
                    <Label>Téléphone</Label>
                    <p className="text-sm text-muted-foreground">
                      {profile?.phone || 'Non renseigné'}
                    </p>
                  </div>
                  <div>
                    <Label>Ville</Label>
                    <p className="text-sm text-muted-foreground">
                      {profile?.city || 'Non renseigné'}
                    </p>
                  </div>
                  <Button variant="outline">Modifier le profil</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    CV (Optionnel)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile?.cv_url ? (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">CV téléchargé</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Télécharger</Button>
                        <Button variant="outline" size="sm">Remplacer</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Ajoutez votre CV pour augmenter vos chances d'être recruté
                      </p>
                      <Button variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        Télécharger un CV
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CandidateDashboard;
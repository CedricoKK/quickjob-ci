import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PlusCircle, 
  Users, 
  Briefcase, 
  Star, 
  CreditCard, 
  Settings,
  LogOut,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';

interface RecruiterDashboardProps {
  user: User;
}

const RecruiterDashboard = ({ user }: RecruiterDashboardProps) => {
  const [subscription, setSubscription] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, [user.id]);

  const fetchDashboardData = async () => {
    try {
      // Fetch subscription info
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (subData) {
        setSubscription(subData);
        
        // Check if subscription is expired
        if (subData.plan !== 'free' && subData.expires_at && new Date(subData.expires_at) < new Date()) {
          toast({
            title: "Abonnement expiré",
            description: "Votre abonnement a expiré. Veuillez le renouveler pour continuer à utiliser les fonctionnalités recruteur.",
            variant: "destructive",
          });
        }
      }

      // Fetch recruiter's jobs
      const { data: jobsData } = await supabase
        .from('jobs')
        .select(`
          *,
          job_applications (
            id,
            candidate_id,
            status,
            created_at,
            profiles!job_applications_candidate_id_fkey (full_name, email, phone, availability_status)
          )
        `)
        .eq('recruiter_id', user.id)
        .order('created_at', { ascending: false });

      if (jobsData) {
        setJobs(jobsData);
        
        // Calculate stats
        const totalJobs = jobsData.length;
        const activeJobs = jobsData.filter(job => job.is_active).length;
        const allApplications = jobsData.flatMap(job => job.job_applications || []);
        const totalApplications = allApplications.length;
        const pendingApplications = allApplications.filter(app => app.status === 'pending').length;

        setStats({
          totalJobs,
          activeJobs,
          totalApplications,
          pendingApplications
        });

        setApplications(allApplications);
      }
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return "Expiré";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} jour${days > 1 ? 's' : ''}`;
    return `${hours} heure${hours > 1 ? 's' : ''}`;
  };

  const isSubscriptionValid = () => {
    if (!subscription) return false;
    if (subscription.plan === 'free') return false;
    if (!subscription.expires_at) return true;
    return new Date(subscription.expires_at) > new Date();
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
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Tableau de bord Recruteur
                </h1>
                <p className="text-muted-foreground text-sm">Bienvenue {user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {subscription && (
                <div className="text-right">
                  <Badge variant={isSubscriptionValid() ? "default" : "destructive"}>
                    {subscription.plan.toUpperCase()}
                  </Badge>
                  {subscription.expires_at && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {isSubscriptionValid() 
                        ? `Expire dans ${formatTimeRemaining(subscription.expires_at)}`
                        : "Abonnement expiré"
                      }
                    </p>
                  )}
                </div>
              )}
              <Button onClick={handleLogout} variant="ghost" size="icon">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Alert */}
      {subscription && !isSubscriptionValid() && (
        <div className="bg-destructive/10 border border-destructive/20 p-4 m-4 rounded-lg">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <div>
              <h3 className="font-semibold text-destructive">Abonnement requis</h3>
              <p className="text-destructive/80 text-sm">
                Votre accès aux fonctionnalités recruteur est limité. Choisissez un plan pour continuer.
              </p>
            </div>
            <Button onClick={() => navigate('/paystack')} className="ml-auto">
              Souscrire
            </Button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Offres</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalJobs}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Offres Actives</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeJobs}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Candidatures</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
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
        </div>

        {/* Main Content */}
        <Tabs defaultValue="jobs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="jobs">Mes Offres</TabsTrigger>
            <TabsTrigger value="applications">Candidatures</TabsTrigger>
            <TabsTrigger value="subscription">Abonnement</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Gestion des offres</h2>
              <Button 
                onClick={() => navigate('/create-job')}
                disabled={!isSubscriptionValid()}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Nouvelle offre
              </Button>
            </div>
            
            <div className="grid gap-4">
              {jobs.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucune offre</h3>
                    <p className="text-muted-foreground mb-4">
                      Commencez par créer votre première offre d'emploi
                    </p>
                    <Button 
                      onClick={() => navigate('/create-job')}
                      disabled={!isSubscriptionValid()}
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Créer une offre
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                jobs.map((job) => (
                  <Card key={job.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{job.title}</CardTitle>
                          <p className="text-muted-foreground">{job.city}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={job.is_active ? "default" : "secondary"}>
                            {job.is_active ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline">
                            {job.job_applications?.length || 0} candidature{(job.job_applications?.length || 0) > 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {job.description.substring(0, 150)}...
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          Créée le {new Date(job.created_at).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Voir
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Modifier
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
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
            <h2 className="text-xl font-semibold">Candidatures reçues</h2>
            
            <div className="grid gap-4">
              {applications.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucune candidature</h3>
                    <p className="text-muted-foreground">
                      Les candidatures apparaîtront ici une fois que des candidats postuleront à vos offres
                    </p>
                  </CardContent>
                </Card>
              ) : (
                applications.map((application) => (
                  <Card key={application.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{application.profiles?.full_name}</h4>
                          <p className="text-sm text-muted-foreground">{application.profiles?.email}</p>
                          <p className="text-sm text-muted-foreground">{application.profiles?.phone}</p>
                          {application.profiles?.availability_status && (
                            <Badge 
                              variant={application.profiles.availability_status === 'available' ? 'default' : 'secondary'}
                              className="mt-2"
                            >
                              {application.profiles.availability_status === 'available' ? 'Disponible' : 'Non disponible'}
                            </Badge>
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
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline">
                          <Star className="w-4 h-4 mr-1" />
                          Noter
                        </Button>
                        <Button size="sm" variant="outline">Accepter</Button>
                        <Button size="sm" variant="outline">Refuser</Button>
                        <Button size="sm" variant="outline">Contacter</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="subscription" className="space-y-4">
            <h2 className="text-xl font-semibold">Gestion de l'abonnement</h2>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Abonnement actuel
                </CardTitle>
              </CardHeader>
              <CardContent>
                {subscription ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Plan actuel :</span>
                      <Badge variant={isSubscriptionValid() ? "success" : "destructive"}>
                        {subscription.plan.toUpperCase()}
                      </Badge>
                    </div>
                    {subscription.expires_at && (
                      <div className="flex justify-between items-center">
                        <span>Expire le :</span>
                        <span className={isSubscriptionValid() ? "text-foreground" : "text-destructive"}>
                          {new Date(subscription.expires_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span>Renouvellement automatique :</span>
                      <Badge variant={subscription.auto_renew ? "default" : "secondary"}>
                        {subscription.auto_renew ? "Activé" : "Désactivé"}
                      </Badge>
                    </div>
                    <div className="pt-4 border-t">
                      <Button 
                        onClick={() => navigate('/paystack')}
                        className="w-full"
                      >
                        {isSubscriptionValid() ? "Mettre à niveau" : "Renouveler l'abonnement"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">Aucun abonnement actif</p>
                    <Button onClick={() => navigate('/paystack')}>
                      Choisir un plan
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
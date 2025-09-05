import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Shield, 
  Users, 
  Briefcase, 
  DollarSign, 
  Settings,
  LogOut,
  Search,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Eye
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';

interface AdminDashboardProps {
  user: User;
}

const AdminDashboard = ({ user }: AdminDashboardProps) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCandidates: 0,
    totalRecruiters: 0,
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    totalSubscriptions: 0,
    activeSubscriptions: 0
  });
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Fetch users/profiles
      const { data: usersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersData) {
        setUsers(usersData);
        const totalUsers = usersData.length;
        const totalCandidates = usersData.filter(u => u.role === 'candidate').length;
        const totalRecruiters = usersData.filter(u => u.role === 'recruiter').length;
        
        setStats(prev => ({
          ...prev,
          totalUsers,
          totalCandidates,
          totalRecruiters
        }));
      }

      // Fetch jobs
      const { data: jobsData } = await supabase
        .from('jobs')
        .select(`
          *,
          profiles!jobs_recruiter_id_fkey (full_name, email),
          job_applications (id, status)
        `)
        .order('created_at', { ascending: false });

      if (jobsData) {
        setJobs(jobsData);
        const totalJobs = jobsData.length;
        const activeJobs = jobsData.filter(j => j.is_active).length;
        
        setStats(prev => ({
          ...prev,
          totalJobs,
          activeJobs
        }));
      }

      // Fetch applications
      const { data: applicationsData } = await supabase
        .from('job_applications')
        .select(`
          *,
          jobs (title),
          profiles!job_applications_candidate_id_fkey (full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (applicationsData) {
        setApplications(applicationsData);
        setStats(prev => ({
          ...prev,
          totalApplications: applicationsData.length
        }));
      }

      // Fetch subscriptions
      const { data: subscriptionsData } = await supabase
        .from('subscriptions')
        .select(`
          *,
          profiles (full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (subscriptionsData) {
        setSubscriptions(subscriptionsData);
        const totalSubscriptions = subscriptionsData.length;
        const activeSubscriptions = subscriptionsData.filter(s => s.is_active).length;
        
        setStats(prev => ({
          ...prev,
          totalSubscriptions,
          activeSubscriptions
        }));
      }

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données administrateur",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole as 'candidate' | 'recruiter' | 'admin' })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Rôle mis à jour",
        description: "Le rôle de l'utilisateur a été modifié avec succès",
      });

      fetchAdminData();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le rôle de l'utilisateur",
        variant: "destructive",
      });
    }
  };

  const handleJobStatusChange = async (jobId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ is_active: isActive })
        .eq('id', jobId);

      if (error) throw error;

      toast({
        title: "Statut mis à jour",
        description: `L'offre a été ${isActive ? 'activée' : 'désactivée'} avec succès`,
      });

      fetchAdminData();
    } catch (error) {
      console.error('Error updating job status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de l'offre",
        variant: "destructive",
      });
    }
  };

  const handleApplicationStatusChange = async (applicationId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Candidature mise à jour",
        description: "Le statut de la candidature a été modifié",
      });

      fetchAdminData();
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de la candidature",
        variant: "destructive",
      });
    }
  };

  const sendNotification = async (userId: string, title: string, message: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title,
          message,
          type: 'admin'
        });

      if (error) throw error;

      toast({
        title: "Notification envoyée",
        description: "La notification a été envoyée à l'utilisateur",
      });
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la notification",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du tableau de bord administrateur...</p>
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
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Administration QuickJob CI
                </h1>
                <p className="text-muted-foreground text-sm">Contrôle total de la plateforme</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                ADMIN
              </Badge>
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
              <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalCandidates} candidats • {stats.totalRecruiters} recruteurs
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Offres d'emploi</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalJobs}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeJobs} actives
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Candidatures</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalApplications}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Abonnements</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
              <p className="text-xs text-muted-foreground">
                / {stats.totalSubscriptions} total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="jobs">Offres</TabsTrigger>
            <TabsTrigger value="applications">Candidatures</TabsTrigger>
            <TabsTrigger value="subscriptions">Abonnements</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Gestion des utilisateurs</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Rechercher un utilisateur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid gap-4">
              {filteredUsers.map((userProfile) => (
                <Card key={userProfile.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{userProfile.full_name || 'Sans nom'}</h4>
                        <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                        <p className="text-sm text-muted-foreground">{userProfile.phone}</p>
                        <p className="text-sm text-muted-foreground">{userProfile.city}</p>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge 
                          variant={
                            userProfile.role === 'admin' ? 'destructive' :
                            userProfile.role === 'recruiter' ? 'default' : 'secondary'
                          }
                        >
                          {userProfile.role?.toUpperCase()}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          Inscrit le {new Date(userProfile.created_at).toLocaleDateString('fr-FR')}
                        </p>
                        {userProfile.availability_status && (
                          <Badge variant={userProfile.availability_status === 'available' ? 'default' : 'outline'}>
                            {userProfile.availability_status === 'available' ? 'Disponible' : 'Non disponible'}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Voir profil
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleUserRoleChange(userProfile.id, userProfile.role === 'candidate' ? 'recruiter' as const : 'candidate' as const)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Changer rôle
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => sendNotification(userProfile.id, 'Message administrateur', 'Vous avez reçu un message de l\'administration.')}
                      >
                        Notifier
                      </Button>
                      <Button size="sm" variant="outline">
                        <Ban className="w-4 h-4 mr-1" />
                        Suspendre
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            <h2 className="text-xl font-semibold">Gestion des offres d'emploi</h2>
            
            <div className="grid gap-4">
              {jobs.map((job) => (
                <Card key={job.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{job.title}</h4>
                        <p className="text-sm text-muted-foreground">{job.city} • {job.category}</p>
                        <p className="text-sm text-muted-foreground">
                          Par: {job.profiles?.full_name} ({job.profiles?.email})
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {job.job_applications?.length || 0} candidature{(job.job_applications?.length || 0) > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge variant={job.is_active ? 'default' : 'secondary'}>
                          {job.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        {job.is_urgent && <Badge variant="destructive">Urgent</Badge>}
                        {job.is_featured && <Badge variant="default">Mise en avant</Badge>}
                        <p className="text-xs text-muted-foreground">
                          {new Date(job.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Voir détails
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleJobStatusChange(job.id, !job.is_active)}
                      >
                        {job.is_active ? 'Désactiver' : 'Activer'}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-1" />
                        Modifier
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="w-4 h-4 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <h2 className="text-xl font-semibold">Gestion des candidatures</h2>
            
            <div className="grid gap-4">
              {applications.map((application) => (
                <Card key={application.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{application.profiles?.full_name}</h4>
                        <p className="text-sm text-muted-foreground">{application.profiles?.email}</p>
                        <p className="text-sm text-muted-foreground">
                          Offre: {application.jobs?.title}
                        </p>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge 
                          variant={
                            application.status === 'pending' ? 'outline' :
                            application.status === 'accepted' ? 'default' : 'destructive'
                          }
                        >
                          {application.status === 'pending' ? 'En attente' :
                           application.status === 'accepted' ? 'Acceptée' : 'Refusée'}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {new Date(application.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleApplicationStatusChange(application.id, 'accepted')}
                        disabled={application.status === 'accepted'}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Accepter
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleApplicationStatusChange(application.id, 'rejected')}
                        disabled={application.status === 'rejected'}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Refuser
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleApplicationStatusChange(application.id, 'pending')}
                        disabled={application.status === 'pending'}
                      >
                        Remettre en attente
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-4">
            <h2 className="text-xl font-semibold">Gestion des abonnements</h2>
            
            <div className="grid gap-4">
              {subscriptions.map((subscription) => (
                <Card key={subscription.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{subscription.profiles?.full_name}</h4>
                        <p className="text-sm text-muted-foreground">{subscription.profiles?.email}</p>
                        <p className="text-sm text-muted-foreground">Plan: {subscription.plan}</p>
                        {subscription.expires_at && (
                          <p className="text-sm text-muted-foreground">
                            Expire le: {new Date(subscription.expires_at).toLocaleDateString('fr-FR')}
                          </p>
                        )}
                      </div>
                      <div className="text-right space-y-2">
                        <Badge variant={subscription.is_active ? 'default' : 'secondary'}>
                          {subscription.is_active ? 'Actif' : 'Inactif'}
                        </Badge>
                        <Badge variant={subscription.auto_renew ? 'default' : 'outline'}>
                          {subscription.auto_renew ? 'Auto-renew' : 'Manuel'}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {new Date(subscription.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <h2 className="text-xl font-semibold">Envoyer une notification globale</h2>
            
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="notification-title">Titre</Label>
                  <Input id="notification-title" placeholder="Titre de la notification..." />
                </div>
                <div>
                  <Label htmlFor="notification-message">Message</Label>
                  <Textarea id="notification-message" placeholder="Contenu de la notification..." rows={4} />
                </div>
                <div className="flex gap-2">
                  <Button>Envoyer à tous les utilisateurs</Button>
                  <Button variant="outline">Envoyer aux candidats</Button>
                  <Button variant="outline">Envoyer aux recruteurs</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
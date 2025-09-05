import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import type { User } from '@supabase/supabase-js';
import RecruiterDashboard from '@/components/dashboard/RecruiterDashboard';
import CandidateDashboard from '@/components/dashboard/CandidateDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          navigate('/auth');
          return;
        }

        setUser(user);

        // Get user profile to check role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError || !profile) {
          console.error('Error fetching profile:', profileError);
          toast({
            title: "Erreur",
            description: "Impossible de récupérer votre profil",
            variant: "destructive",
          });
          return;
        }

        setUserRole(profile.role);
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderDashboard = () => {
    switch (userRole) {
      case 'admin':
        return <AdminDashboard user={user} />;
      case 'recruiter':
        return <RecruiterDashboard user={user} />;
      case 'candidate':
        return <CandidateDashboard user={user} />;
      default:
        return (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">Rôle non reconnu</h1>
              <p className="text-muted-foreground">Contactez l'administrateur pour résoudre ce problème.</p>
            </div>
          </div>
        );
    }
  };

  return renderDashboard();
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import type { User } from '@supabase/supabase-js';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form states
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'candidate'
  });

  // Check if user is already authenticated
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        navigate('/', { replace: true });
      }
    };
    
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        navigate('/', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Erreur de connexion",
            description: "Email ou mot de passe incorrect",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erreur",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });

    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupData.email || !signupData.password || !signupData.confirmPassword || !signupData.fullName) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    if (signupData.password.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: signupData.fullName,
            role: 'candidate'
          }
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          toast({
            title: "Erreur d'inscription",
            description: "Un compte existe déjà avec cette adresse email",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erreur",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      toast({
        title: "Inscription réussie",
        description: "Vérifiez votre email pour confirmer votre compte",
      });

      // Reset form
      setSignupData({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        role: 'candidate'
      });

    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-secondary border-b border-border/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Authentification
                </h1>
                <p className="text-muted-foreground text-sm">Connectez-vous ou créez un compte</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Form */}
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card className="bg-gradient-card border-border/20 shadow-card">
          <CardHeader className="text-center">
            <CardTitle>Accédez à QuickJob CI</CardTitle>
            <p className="text-muted-foreground text-sm">
              Connectez-vous pour accéder aux informations de contact des recruteurs
            </p>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Connexion</TabsTrigger>
                <TabsTrigger value="signup">Inscription</TabsTrigger>
              </TabsList>
              
              {/* Login Tab */}
              <TabsContent value="login" className="mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="votre@email.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Connexion...
                      </>
                    ) : (
                      'Se connecter'
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              {/* Signup Tab */}
              <TabsContent value="signup" className="mt-6">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nom complet</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Votre nom complet"
                        value={signupData.fullName}
                        onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value, role: signupData.role })}
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Type de compte</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="role" 
                          value="candidate" 
                          checked={signupData.role === 'candidate'}
                          onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
                          className="text-primary"
                        />
                        <span>Candidat (Gratuit)</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="role" 
                          value="recruiter" 
                          checked={signupData.role === 'recruiter'}
                          onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
                          className="text-primary"
                        />
                        <span>Recruteur</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="votre@email.com"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value, role: signupData.role })}
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value, role: signupData.role })}
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirmer le mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="signup-confirm"
                        type="password"
                        placeholder="••••••••"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value, role: signupData.role })}
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Inscription...
                      </>
                    ) : (
                      'Créer un compte'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Security Notice */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            En vous connectant, vous acceptez nos conditions d'utilisation 
            et notre politique de confidentialité.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Briefcase, Users, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import type { User } from '@supabase/supabase-js';
import { LocationSelectors } from '@/components/ui/location-selectors';

const PosterUnJob = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    city: '',
    commune: '',
    quartier: '',
    salary_min: '',
    salary_max: '',
    contact_email: '',
    contact_phone: '',
    is_urgent: false,
    is_featured: false,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }
      setUser(user);
      
      // Pre-fill contact email
      setFormData(prev => ({
        ...prev,
        contact_email: user.email || ''
      }));
    };

    checkAuth();
  }, [navigate]);

  const handleLocationChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'city' ? { commune: '', quartier: '' } : {}),
      ...(field === 'commune' ? { quartier: '' } : {})
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    try {
      const jobData = {
        title: formData.title,
        description: formData.description,
        category: formData.category as any, // Type assertion for enum
        city: formData.city,
        commune: formData.commune || null,
        quartier: formData.quartier || null,
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
        contact_email: formData.contact_email || null,
        contact_phone: formData.contact_phone || null,
        is_urgent: formData.is_urgent,
        is_featured: formData.is_featured,
        recruiter_id: user.id,
        is_active: true,
      };

      const { error } = await supabase
        .from('jobs')
        .insert([jobData]);

      if (error) throw error;

      toast({
        title: "Offre publiée !",
        description: "Votre offre d'emploi a été publiée avec succès.",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error posting job:', error);
      toast({
        title: "Erreur",
        description: "Impossible de publier l'offre d'emploi",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-secondary border-b border-border/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Publier une offre d'emploi
              </h1>
              <p className="text-muted-foreground mt-2">
                Créez une nouvelle offre d'emploi pour attirer les meilleurs candidats
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gradient-card border-border/20 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-primary" />
                Détails de l'offre
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Titre du poste *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: Développeur Web Senior"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Catégorie *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="informatique">Informatique</SelectItem>
                        <SelectItem value="restauration">Restauration</SelectItem>
                        <SelectItem value="menage">Ménage</SelectItem>
                        <SelectItem value="jardinage">Jardinage</SelectItem>
                        <SelectItem value="bricolage">Bricolage</SelectItem>
                        <SelectItem value="livraison">Livraison</SelectItem>
                        <SelectItem value="garde_enfant">Garde d'enfant</SelectItem>
                        <SelectItem value="aide_personne_agee">Aide personne âgée</SelectItem>
                        <SelectItem value="cours_particulier">Cours particulier</SelectItem>
                        <SelectItem value="evenementiel">Événementiel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description du poste *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Décrivez les missions, compétences requises, conditions de travail..."
                      rows={5}
                      required
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <Label>Localisation *</Label>
                  <LocationSelectors
                    selectedCity={formData.city}
                    selectedCommune={formData.commune}
                    selectedQuartier={formData.quartier}
                    onCityChange={(value) => handleLocationChange('city', value)}
                    onCommuneChange={(value) => handleLocationChange('commune', value)}
                    onQuartierChange={(value) => handleLocationChange('quartier', value)}
                  />
                </div>

                {/* Salary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="salary_min">Salaire minimum (FCFA)</Label>
                    <Input
                      id="salary_min"
                      type="number"
                      value={formData.salary_min}
                      onChange={(e) => setFormData(prev => ({ ...prev, salary_min: e.target.value }))}
                      placeholder="50000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="salary_max">Salaire maximum (FCFA)</Label>
                    <Input
                      id="salary_max"
                      type="number"
                      value={formData.salary_max}
                      onChange={(e) => setFormData(prev => ({ ...prev, salary_max: e.target.value }))}
                      placeholder="100000"
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="contact_email">Email de contact *</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_phone">Téléphone / WhatsApp</Label>
                    <Input
                      id="contact_phone"
                      value={formData.contact_phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                      placeholder="+225 XX XX XX XX XX"
                    />
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_urgent"
                      checked={formData.is_urgent}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_urgent: !!checked }))}
                    />
                    <Label htmlFor="is_urgent">Marquer comme urgent</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: !!checked }))}
                    />
                    <Label htmlFor="is_featured">Mettre en vedette (Premium)</Label>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-6">
                  <Link to="/dashboard" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Annuler
                    </Button>
                  </Link>
                  <Button type="submit" disabled={isLoading} className="flex-1 bg-gradient-primary hover:opacity-90">
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    Publier l'offre
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PosterUnJob;
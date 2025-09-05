import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { citiesData, getCommunesByCity, getQuartiersByCommune } from '@/data/locations';

interface LocationSelectorsProps {
  selectedCity: string;
  selectedCommune: string;
  selectedQuartier: string;
  onCityChange: (city: string) => void;
  onCommuneChange: (commune: string) => void;
  onQuartierChange: (quartier: string) => void;
  disabled?: boolean;
}

export const LocationSelectors: React.FC<LocationSelectorsProps> = ({
  selectedCity,
  selectedCommune,
  selectedQuartier,
  onCityChange,
  onCommuneChange,
  onQuartierChange,
  disabled = false
}) => {
  const communes = getCommunesByCity(selectedCity);
  const quartiers = getQuartiersByCommune(selectedCity, selectedCommune);

  const handleCityChange = (city: string) => {
    onCityChange(city);
    onCommuneChange(''); // Reset commune when city changes
    onQuartierChange(''); // Reset quartier when city changes
  };

  const handleCommuneChange = (commune: string) => {
    onCommuneChange(commune);
    onQuartierChange(''); // Reset quartier when commune changes
  };

  return (
    <div className="space-y-4">
      {/* Ville */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Ville</label>
        <Select 
          value={selectedCity} 
          onValueChange={handleCityChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionnez votre ville" />
          </SelectTrigger>
          <SelectContent className="bg-background border border-border shadow-lg z-50">
            {citiesData.map((city) => (
              <SelectItem key={city.name} value={city.name}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Commune */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Commune</label>
        <Select 
          value={selectedCommune} 
          onValueChange={handleCommuneChange}
          disabled={disabled || !selectedCity}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionnez votre commune" />
          </SelectTrigger>
          <SelectContent className="bg-background border border-border shadow-lg z-50">
            {communes.map((commune) => (
              <SelectItem key={commune.name} value={commune.name}>
                {commune.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Quartier */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Quartier</label>
        <Select 
          value={selectedQuartier} 
          onValueChange={onQuartierChange}
          disabled={disabled || !selectedCommune}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionnez votre quartier" />
          </SelectTrigger>
          <SelectContent className="bg-background border border-border shadow-lg z-50">
            {quartiers.map((quartier) => (
              <SelectItem key={quartier.name} value={quartier.name}>
                {quartier.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
// Données géographiques de la Côte d'Ivoire pour le système de sélection en cascade

export interface Quartier {
  name: string;
}

export interface Commune {
  name: string;
  quartiers: Quartier[];
}

export interface Ville {
  name: string;
  communes: Commune[];
}

export const citiesData: Ville[] = [
  {
    name: "Abidjan",
    communes: [
      {
        name: "Plateau",
        quartiers: [
          { name: "Plateau Centre" },
          { name: "Plateau Administratif" },
          { name: "Plateau Lagunaire" },
          { name: "Plateau Nord" }
        ]
      },
      {
        name: "Cocody",
        quartiers: [
          { name: "Riviera Golf" },
          { name: "Deux-Plateaux Vallon" },
          { name: "Cocody Angré" },
          { name: "Cocody Riviera Palmeraie" },
          { name: "Cocody II Plateaux" },
          { name: "Cocody Centre" },
          { name: "Cocody Danga" }
        ]
      },
      {
        name: "Adjamé",
        quartiers: [
          { name: "Adjamé Marché" },
          { name: "Adjamé Liberté" },
          { name: "Adjamé Bracodi" },
          { name: "Adjamé Williamsville" }
        ]
      },
      {
        name: "Yopougon",
        quartiers: [
          { name: "Yopougon Sideci" },
          { name: "Yopougon Millionnaire" },
          { name: "Yopougon Maroc" },
          { name: "Yopougon Andokoi" },
          { name: "Yopougon Siporex" }
        ]
      },
      {
        name: "Marcory",
        quartiers: [
          { name: "Marcory Zone 4" },
          { name: "Marcory Anoumabo" },
          { name: "Marcory Résidentiel" },
          { name: "Marcory Biafra" }
        ]
      },
      {
        name: "Treichville",
        quartiers: [
          { name: "Treichville Centre" },
          { name: "Treichville Biafra" },
          { name: "Treichville Ancien Pont" },
          { name: "Treichville Belleville" }
        ]
      },
      {
        name: "Koumassi",
        quartiers: [
          { name: "Koumassi Remblais" },
          { name: "Koumassi Centre" },
          { name: "Koumassi Sicogi" }
        ]
      },
      {
        name: "Port-Bouët",
        quartiers: [
          { name: "Port-Bouët Zone 3" },
          { name: "Port-Bouët Aéroport" },
          { name: "Port-Bouët Vridi" }
        ]
      },
      {
        name: "Bingerville",
        quartiers: [
          { name: "Bingerville Centre" },
          { name: "Bingerville Adiopodoumé" }
        ]
      }
    ]
  },
  {
    name: "Bouaké",
    communes: [
      {
        name: "Bouaké Centre",
        quartiers: [
          { name: "Commerce" },
          { name: "Dar Es Salam" },
          { name: "Belleville" }
        ]
      },
      {
        name: "Gonfreville",
        quartiers: [
          { name: "Gonfreville Centre" },
          { name: "Petit Paris" }
        ]
      }
    ]
  },
  {
    name: "Yamoussoukro",
    communes: [
      {
        name: "Yamoussoukro Centre",
        quartiers: [
          { name: "Habitat" },
          { name: "Moronou" },
          { name: "N'Zuessy" }
        ]
      }
    ]
  },
  {
    name: "San-Pédro",
    communes: [
      {
        name: "San-Pédro Centre",
        quartiers: [
          { name: "Bardot" },
          { name: "Wharf" },
          { name: "Balmer" }
        ]
      }
    ]
  },
  {
    name: "Daloa",
    communes: [
      {
        name: "Daloa Centre",
        quartiers: [
          { name: "Tazibouo" },
          { name: "Lobia" },
          { name: "Gbeleban" }
        ]
      }
    ]
  },
  {
    name: "Korhogo",
    communes: [
      {
        name: "Korhogo Centre",
        quartiers: [
          { name: "Résidentiel" },
          { name: "Tchégbaré" },
          { name: "Petit Paris" }
        ]
      }
    ]
  },
  {
    name: "Man",
    communes: [
      {
        name: "Man Centre",
        quartiers: [
          { name: "Libreville" },
          { name: "Dokoré" },
          { name: "Zouatta" }
        ]
      }
    ]
  },
  {
    name: "Gagnoa",
    communes: [
      {
        name: "Gagnoa Centre",
        quartiers: [
          { name: "Dioulabougou" },
          { name: "Belleville" },
          { name: "Château" }
        ]
      }
    ]
  }
];

// Fonctions utilitaires pour le système de sélection
export const getCommunesByCity = (cityName: string): Commune[] => {
  const city = citiesData.find(c => c.name === cityName);
  return city ? city.communes : [];
};

export const getQuartiersByCommune = (cityName: string, communeName: string): Quartier[] => {
  const city = citiesData.find(c => c.name === cityName);
  if (!city) return [];
  
  const commune = city.communes.find(c => c.name === communeName);
  return commune ? commune.quartiers : [];
};
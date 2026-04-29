Voici le **PRD (Product Requirements Document)** complet pour l'interface de gestion Djolof Chicken.

---

# PRD - Interface de Gestion Djolof Chicken

## Version : 1.0
## Date : 29 Avril 2026
## Statut : À approuver

---

## 1. Introduction

### 1.1 Objectif du document

Ce document définit l'ensemble des spécifications fonctionnelles et techniques pour le développement de l'interface de gestion du restaurant **Djolof Chicken** (Conakry, Guinée).

### 1.2 Contexte

Djolof Chicken reçoit actuellement des commandes via WhatsApp. Un agent IA (DeepSeek) prend les commandes et les enregistre dans une base PostgreSQL. Il manque une **interface visuelle** pour que la caissière et le gestionnaire puissent :

- Visualiser les commandes en temps réel
- Changer les statuts (en cuisine → prête → livraison → livrée)
- Gérer le menu
- Analyser les revenus et performances

### 1.3 Objectifs

| Objectif | Priorité |
|---|---|
| Permettre à la caissière de gérer les commandes en 1 clic | P0 (Critique) |
| Donner une vue temps réel des commandes | P0 |
| Permettre au gestionnaire de consulter les revenus | P1 |
| Permettre au gestionnaire de modifier le menu | P1 |
| Être utilisable sur mobile (responsive) | P2 |

### 1.4 Périmètre

**Inclus :**

- Authentification simple (mot de passe)
- Dashboard avec statistiques
- Gestion complète des commandes (CRUD + statuts)
- Gestion du menu (CRUD + ordre)
- Export CSV des commandes
- Mode clair/sombre automatique

**Exclus (phase 2) :**

- Interface motard dédiée
- Interface cuisine dédiée
- Notifications push
- Paiement en ligne
- Application mobile native

---

## 2. Utilisateurs et rôles

| Rôle | Accès | Nombre estimé |
|---|---|---|
| **Gestionnaire** | Accès total (dashboard, commandes, menu, stats, export) | 1-2 |
| **Caissière** | Commandes uniquement (changer statut) | 2-3 |

> **Note Phase 1** : Authentification simplifiée par mot de passe unique. La distinction des rôles viendra plus tard.

---

## 3. Spécifications fonctionnelles

### 3.1 Page Dashboard (accueil)

| Composant | Description |
|---|---|
| **En-tête** | Logo, titre, notification, menu utilisateur, mode clair/sombre |
| **Navigation** | Liens : Dashboard, Commandes, Menu, Statistiques |
| **Cartes stats** | 4 cartes : Commandes aujourd'hui / CA jour / En cours / Ticket moyen |
| **Graphique** | Évolution des commandes sur 7 jours (Recharts) |
| **Commandes récentes** | Tableau des 5 dernières commandes avec statut et action rapide |
| **Top produits** | Classement des 5 plats les plus commandés (semaine) |

### 3.2 Page Commandes

| Fonction | Description |
|---|---|
| **Tableau** | Colonnes : ID, Client, Quartier, Plats, Total, Statut, Date, Actions |
| **Filtres** | Par statut (tous/en cuisine/prête/livraison/livrée) |
| **Recherche** | Par nom client ou numéro de téléphone |
| **Tri** | Par date (défaut : plus récent en premier) |
| **Pagination** | 20 commandes par page |
| **Changement statut** | Boutons pour chaque commande selon son statut actuel |
| **Détails** | Modal cliquable avec tous les détails |
| **Annulation** | Bouton annuler (avec confirmation) |
| **Export** | Bouton pour exporter la liste visible en CSV |

**Statuts et transitions :**

| Statut actuel | Actions possibles |
|---|---|
| `en_cuisine` | → Prête, Annuler |
| `prete` | → En livraison, Annuler |
| `en_livraison` | → Livrée |
| `livree` | (aucune action) |
| `annulee` | (aucune action) |

### 3.3 Page Menu

| Fonction | Description |
|---|---|
| **Groupement** | Plats regroupés par catégorie (Poulets / Accompagnements / Boissons / Spécialités) |
| **Listing** | Pour chaque plat : Nom, Prix, Disponibilité, Actions |
| **Ajouter** | Formulaire modal : Catégorie, Nom, Description, Prix, Disponibilité |
| **Modifier** | Édition d'un plat existant (même formulaire) |
| **Activer/Désactiver** | Toggle pour `is_available` (sans supprimer) |
| **Supprimer** | Bouton supprimer (avec confirmation) |
| **Réordonner** | Glisser-déposer pour changer l'affichage (priorité phase 2) |

### 3.4 Page Statistiques

| Fonction | Description |
|---|---|
| **Période** | Sélecteur : Aujourd'hui / 7 jours / 30 jours / Ce mois / Personnalisée |
| **Graphique CA** | Courbe du chiffre d'affaires sur la période |
| **Graphique commandes** | Nombre de commandes par jour |
| **Répartition par quartier** | Camembert (Top 5 quartiers) |
| **Répartition par statut** | Diagramme des commandes par statut |
| **Tableau récapitulatif** | CA total, Nb commandes, Ticket moyen, Nb clients uniques |
| **Export** | Export CSV des données affichées |

### 3.5 Page Paramètres (simplifiée)

| Fonction | Description |
|---|---|
| **Infos restaurant** | Nom, téléphone, email (modifiable) |
| **Frais de livraison** | Champ modifiable (défaut : 10000 GNF) |
| **Horaires** | Ouverture et fermeture |
| **Sécurité** | Changement de mot de passe |
| **Export** | Export complet de la base (commandes + menu) |

---

## 4. Identité visuelle (UI/UX)

### 4.1 Palette de couleurs (logo Djolof Chicken)

| Rôle | Couleur | Code HEX |
|---|---|---|
| **Primary (énergie, CTA)** | Jaune vif | `#FFC107` |
| **Primary dark** | Jaune foncé | `#FFA000` |
| **Secondary (alerte, urgence)** | Rouge vif | `#D32F2F` |
| **Secondary light** | Rouge clair | `#E53935` |
| **Accent (structure)** | Noir/gris profond | `#111827` |
| **Background light** | Blanc cassé | `#FDFBF7` |
| **Background dark** | Bleu nuit | `#0F172A` |
| **Card light** | Blanc | `#FFFFFF` |
| **Card dark** | Gris foncé | `#1E293B` |
| **Text primary** | Gris foncé | `#2C3E50` |
| **Text secondary** | Gris clair | `#7F8C8D` |

### 4.2 Statuts des commandes

| Statut | Couleur | Badge |
|---|---|---|
| `en_cuisine` | Jaune `#FFC107` | 🔥 En cuisine |
| `prete` | Orange `#E67E22` | ✓ Prête |
| `en_livraison` | Noir `#111827` | 🚚 En livraison |
| `livree` | Vert `#27AE60` | ✅ Livrée |
| `annulee` | Rouge `#D32F2F` | ✗ Annulée |

### 4.3 Typographie

- **Titres** : Inter (semi-bold, 600)
- **Corps** : Inter (regular, 400)
- **Chiffres** : Inter (bold, 700)

### 4.4 Mode clair / sombre automatique

- Détection automatique basée sur **l'heure système**
- Light mode : 7h00 → 19h00
- Dark mode : 19h00 → 7h00
- Possibilité de forcer manuellement via un toggle

---

## 5. Architecture technique

### 5.1 Stack

| Couche | Technologie |
|---|---|
| **Frontend** | React 18 + TypeScript |
| **UI Components** | shadcn/ui |
| **Styling** | Tailwind CSS |
| **Graphiques** | Recharts |
| **Tables** | TanStack Table |
| **État / Data** | TanStack Query |
| **Base de données** | Supabase (PostgreSQL) |
| **Realtime** | Supabase Realtime |
| **Routing** | React Router |
| **Date** | Day.js |
| **Déploiement** | Vercel (gratuit) |

### 5.2 Structure du projet

```
src/
├── components/
│   ├── ui/              # Composants shadcn
│   ├── layout/          # Sidebar, Header, Layout
│   ├── dashboard/       # StatsCards, RevenueChart, RecentOrders
│   ├── orders/          # OrdersTable, StatusBadge, OrderDetailsModal
│   └── menu/            # MenuTable, MenuForm, MenuCategories
├── hooks/
│   ├── useThemeMode.js  # Mode clair/sombre automatique
│   ├── useOrders.js     # Requêtes commandes
│   ├── useStats.js      # Requêtes statistiques
│   └── useMenu.js       # Requêtes menu
├── lib/
│   ├── supabase.js      # Client Supabase
│   └── utils.js         # Fonctions utilitaires
├── pages/
│   ├── Dashboard.jsx
│   ├── Orders.jsx
│   ├── MenuPage.jsx
│   ├── Stats.jsx
│   └── Settings.jsx
├── App.jsx
└── main.jsx
```

### 5.3 Variables d'environnement

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon
VITE_ADMIN_PASSWORD=admin123
```

### 5.4 Supabase Realtime

Activer Realtime sur les tables `djolof_orders` :

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE djolof_orders;
```

Les changements de statut seront **immédiatement visibles** sur l'interface.

---

## 6. API / Webhooks (optionnels)

Pour la **communication avec n8n**, Supabase sert déjà d'API.

Mais pour certaines actions (ex: notification WhatsApp quand commande prête), on peut ajouter des webhooks n8n :

| Endpoint | Méthode | Rôle |
|---|---|---|
| `/webhook/order-update` | POST | Déclenché par Supabase sur changement statut |

---

## 7. Performances et contraintes

| Paramètre | Valeur |
|---|---|
| Temps de chargement initial | < 2 secondes |
| Temps de rafraîchissement Realtime | < 500 ms |
| Compatibilité navigateurs | Chrome, Firefox, Safari (2 dernières versions) |
| Responsive | Desktop d'abord, tablette supportée, mobile minimal |
| Langue | Français (par défaut) |

---

## 8. Sécurité

| Mécanisme | Description |
|---|---|
| **Authentification** | Mot de passe unique (stocké en variable d'environnement) |
| **Row Level Security (Supabase)** | À configurer (accès lecture seul pour caissière) |
| **CORS** | Restreint aux domaines autorisés |

---

## 9. Livrables

| Livrable | Format |
|---|---|
| Code source complet | GitHub / ZIP |
| Documentation technique | README.md |
| Scripts SQL (tables, RLS) | .sql |
| Guide d'installation | PDF / Markdown |
| Déploiement sur Vercel | URL publique |

---

## 10. Planning estimé (phase 1)

| Tâche | Durée |
|---|---|
| Configuration projet + Supabase | 0.5 jour |
| Layout + Sidebar + Header + Thème auto | 0.5 jour |
| Dashboard (cartes + graphiques) | 1 jour |
| Page Commandes (tableau + filtres + statuts) | 1.5 jours |
| Page Menu (CRUD) | 1 jour |
| Page Statistiques (graphiques + exports) | 1 jour |
| Page Paramètres | 0.5 jour |
| Tests et corrections | 0.5 - 1 jour |
| Déploiement + Documentation | 0.5 jour |

**Total estimé : 6 à 7 jours**

---

## 11. Validations

| Rôle | Nom | Date | Signature |
|---|---|---|---|
| Gestionnaire | ... | ... | ... |

---

## 12. Annexes

### Annexe A : Structure des tables (rappel)

**`djolof_orders`**

```sql
id SERIAL PRIMARY KEY,
customer_name TEXT NOT NULL,
customer_phone TEXT NOT NULL,
customer_quartier TEXT NOT NULL,
items TEXT NOT NULL,
total_price INTEGER NOT NULL,
delivery_fee INTEGER DEFAULT 10000,
final_total INTEGER NOT NULL,
status TEXT DEFAULT 'en_cuisine',
created_at TIMESTAMP DEFAULT NOW()
```

**`djolof_menus`**

```sql
id SERIAL PRIMARY KEY,
category TEXT NOT NULL,
name TEXT NOT NULL,
description TEXT,
price INTEGER NOT NULL,
is_available BOOLEAN DEFAULT true,
display_order INTEGER DEFAULT 0
```

---

**Fin du PRD**


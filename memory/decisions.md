# Décisions de conception — Corex v1.0

> Source : `corex-cdc.md`. Ce fichier explicite les décisions et leur rationale pour éviter de les rouvrir à chaque prompt.

---

## 1. Choix techniques

### 1.1 Pourquoi Next.js 14 (App Router) + TypeScript

- App Router = routing par dossier, layouts imbriqués, server components → idéal pour un site marketing + dashboard mixte
- Support natif de l'i18n par segment de route (`/[locale]`)
- TypeScript strict pour fiabiliser un projet qui mêle formulaires complexes, gestion de tokens, et logique de créneaux
- Déploiement Vercel zero-config

### 1.2 Pourquoi Supabase

- **Tout-en-un** : Auth + Postgres + Edge Functions + Storage → un seul fournisseur pour tout le backend
- **Auth managé** pour le dashboard admin (email + mdp, sessions persistantes)
- **Edge Functions** pour déclencher les emails transactionnels (Resend / SendGrid)
- **Postgres natif** = schémas relationnels nets, RLS pour la sécurité
- Pas besoin d'un backend Node séparé en v1

### 1.3 Pourquoi next-intl

- Routing par locale en first-class (`/fr/...` et `/en/...`)
- Détection automatique de la langue navigateur + persistance cookie
- Fichiers JSON simples (`messages/fr.json`, `messages/en.json`)

### 1.4 Pourquoi Resend (avec SendGrid en fallback)

- API moderne, templates HTML responsive, intégration directe via Edge Functions
- SendGrid en fallback si quota / délivrabilité

---

## 2. Logique du formulaire booking en 5 étapes

Forme : **page plein écran 2 colonnes** (gauche verte branding, droite noir formulaire), transitions horizontales fluides entre étapes.

| # | Étape | Validation |
|---|---|---|
| 1 | **Service** : digitalisation / saas / je ne sais pas encore | Choix unique requis |
| 2 | **Description du projet** | Textarea libre, **min 20 caractères**, compteur visible, placeholder contextuel selon service |
| 3 | **Profil** : startup / pme / freelance / autre | Choix unique requis |
| 4 | **Créneau** : calendrier custom + horaires | Date + heure obligatoires |
| 5 | **Coordonnées** : prénom, nom, email (+ tel/entreprise optionnels) | Email validé au format |

Bouton "Continuer" désactivé tant que l'étape n'est pas complète.

**Étape 4 — règles** :
- Calendrier **custom** (pas de lib externe)
- Jours passés grisés et non cliquables
- Weekends toujours indisponibles
- Jours bloqués (admin) non disponibles
- Créneaux déjà réservés affichés barrés

**Confirmation** : animation succès, récap, message "Nous confirmerons dans les 24h".

---

## 3. Confirmation manuelle par l'admin (pas d'email auto à la soumission)

Décision clé : à la soumission du formulaire, **aucun email de confirmation n'est envoyé au visiteur**.

Flow :
```
Soumission → reservations.status = 'pending' + lead créé
            → email de notification à l'ADMIN uniquement
            → admin confirme manuellement → status = 'confirmed' → email envoyé au visiteur
            OU
            → admin annule → email annulation (avec ou sans lien reschedule)
```

**Rationale** : Corex se positionne premium, l'admin valide chaque demande qualifiée. Pas de RV "automatique" sans validation humaine.

---

## 4. Tokens de reschedule (usage unique, expiration 7 jours)

- Généré uniquement quand l'admin **annule** avec le toggle "Proposer un nouveau créneau" activé
- Stocké dans `reservations.reschedule_token` (uuid)
- **Usage unique** : invalidé dès le premier accès réussi
- **Expiration : 7 jours**
- Visiteur arrive directement à l'étape 4 (créneau), infos pré-remplies non modifiables
- Nouveau créneau → ancienne réservation archivée → nouvelle créée avec status `pending`

---

## 5. Logique de la file d'attente (mode qualifié, invitation manuelle)

### Bascule automatique vers la file
La page `/booking` bascule automatiquement vers le formulaire de file d'attente si :
- **Aucun créneau disponible dans les 30 prochains jours**, OU
- L'admin a activé le **mode "file d'attente forcée"** dans le dashboard

### Formulaire file d'attente
Étapes 1, 2, 3 identiques au booking. Remplace l'étape 4 (créneau) par :
- Message : "Aucun créneau disponible actuellement"
- Champ urgence : moins d'une semaine / dans le mois / pas pressé

### Mode qualifié (gestion admin)
- L'admin **choisit** qui inviter en priorité selon profil et besoin
- Action "Inviter à booker" → email avec lien personnalisé
- Le visiteur accède à un booking pré-rempli
- Lien expire après **7 jours** (invitation manuelle admin)

### Notification automatique (créneau libéré)
- Quand un créneau se libère (annulation OU nouvelle dispo) → email aux personnes en file **par ordre d'inscription**
- Lien valable **48h** ; non utilisé → passe au suivant
- Inscription file unique pour la même période
- Après usage → status `converted`

---

## 6. Règles métier verrouillées en v1

- **Un créneau = une seule personne** (optimistic lock)
- **Une annulation libère immédiatement le créneau**
- **Weekends jamais disponibles** (non configurable en v1)
- **Blocages admin > règles récurrentes** (priorité absolue sur la période)
- **Créneaux générés à la volée** (jamais pré-générés en DB)
- **Durée minimum d'un créneau : 30 minutes**

---

## 7. Hors scope v1 (explicitement)

| Élément | Raison / Renvoi |
|---|---|
| Prix sur le site | Positionnement premium, devis sur mesure |
| Mention localisation Canada | Choix de positionnement marque international |
| Blog / ressources | Reporté |
| Intégration Google Calendar | v2 |
| Paiement en ligne | Pas dans le modèle |
| Portail client | Reporté |
| App mobile native | Reporté |

Ces éléments ne doivent **pas** apparaître dans le code, le contenu, ou les templates email v1.

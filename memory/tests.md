# Stratégie de tests — Corex

> À utiliser à la fin de chaque prompt (étape 4 du workflow défini dans `claude.md`).

---

## 1. Stratégie par phase

### Phase 1 — Foundation
**Vérifications :**
- `npm run build` passe sans erreur ni warning critique
- `npm run dev` démarre sur `localhost:3000`
- Routes `/fr` et `/en` répondent en 200 (même si la page est vide)
- Connexion Supabase opérationnelle (ping + lecture d'une table de test)
- Les 4 tables sont créées avec les bons champs et types
- RLS policies actives (tentative d'accès non autorisée échoue)
- Build Vercel réussi (preview ou prod) avec les variables d'env configurées
- Switch FR/EN dans le header bascule l'URL et les textes

### Phase 2 — Pages publiques
**Vérifications :**
- Toutes les pages listées dans `architecture.md` répondent en 200, en FR et en EN
- Aucun texte brut anglais sur `/fr/...`, aucun texte brut français sur `/en/...`
- Aucune mention de prix dans le code/contenu
- Aucune mention "Canada" ou de localisation dans les textes publics
- Responsive : test à 320px, 768px, 1024px, 1440px (mobile, tablet, laptop, desktop)
- Animations (fade-in, hover, scroll) fluides, pas de saccade
- Lighthouse mobile + desktop > 80 sur Performance, Accessibility, Best Practices
- Liens internes (anchors, nav, footer) fonctionnent

### Phase 3 — Système de booking
**Vérifications :**
- Les 5 étapes du formulaire s'affichent dans l'ordre
- Bouton "Continuer" reste désactivé tant que l'étape n'est pas valide
- Étape 2 : compteur de caractères visible, refus < 20 caractères
- Étape 4 : weekends et jours bloqués sont non cliquables ; créneaux réservés barrés
- Soumission : ligne créée dans `reservations` avec `status='pending'` + ligne dans `leads` (`source='booking'`)
- AUCUN email de confirmation n'est envoyé au visiteur à la soumission
- Email de notification est envoyé à l'admin à la soumission
- Page `/booking/reschedule/[token]` :
  - Token valide : ouvre l'étape 4 avec infos pré-remplies
  - Token expiré (>7j) ou déjà utilisé : 410/404 ou message clair
- Bascule auto vers la file d'attente si aucun créneau dispo dans les 30 prochains jours
- Formulaire file d'attente crée bien une ligne `queue_entries` + `leads` (`source='queue'`)

### Phase 4 — Dashboard Admin
**Vérifications :**
- Routes `/admin/*` redirigent vers login si non authentifié
- Login Supabase Auth fonctionne, session persistante
- KPIs reflètent les vraies valeurs DB (compter à la main 1 fois pour vérifier)
- Action "Confirmer" :
  - Statut → `confirmed` + `confirmed_at` rempli
  - Email de confirmation envoyé au visiteur
- Action "Annuler" sans toggle reschedule :
  - Statut → `cancelled` + `cancelled_at` rempli
  - Email d'annulation envoyé (motif inclus, sans lien reschedule)
- Action "Annuler" avec toggle reschedule :
  - Token uuid généré et stocké dans `reschedule_token`
  - Email d'annulation contient le lien `/booking/reschedule/[token]`
- Disponibilités : ajout d'une règle apparaît immédiatement dans la vue semaine
- Blocages : un blocage masque les créneaux sur la période côté booking public
- File d'attente : "Inviter à booker" déclenche un email avec lien tokenisé (48h auto / 7j manuel)
- Leads : export CSV produit un fichier valide avec les filtres appliqués

### Phase 5 — Polish & lancement
**Vérifications :**
- Sitemap.xml généré et valide
- robots.txt présent
- Métadonnées (title, description, OG) sur toutes les pages
- Images en formats modernes (webp/avif), lazy loading actif
- Tests manuels mobile iOS Safari + Android Chrome
- Tests cross-browser : Chrome, Firefox, Safari, Edge
- DNS pointe sur Vercel, certificat HTTPS valide
- Analytics (Plausible/Vercel) reçoit des hits

---

## 2. Vérifications systématiques après chaque prompt

À faire à l'étape 4 du workflow, quel que soit le prompt :

| Catégorie | Check |
|---|---|
| Build | `npm run build` (à partir du Prompt 01) — zéro erreur |
| Routes | Les routes touchées par le prompt répondent en 200 (FR + EN) |
| DB | Si la DB a changé : schéma cohérent, données de test OK |
| Emails | Si un déclencheur email est touché : log Edge Function, mail reçu en bac de test |
| Lint / Types | `tsc --noEmit` ou équivalent : zéro erreur |
| Mémoire | `PROJECT_STATE.md` mis à jour avec checklist + fichiers créés |
| Hors scope | Aucune mention de prix, ni "Canada" sur le site public |

---

## 3. Critères d'acceptation par fonctionnalité

### Booking (Phase 3)
- [ ] Les 5 étapes s'affichent dans l'ordre, transition horizontale
- [ ] Validation correcte à chaque étape (service / 20 chars min / profil / date+heure / email valide)
- [ ] Créneau bloqué après réservation pour tout autre visiteur (test concurrent)
- [ ] Confirmation : récap visible + message "24h" + retour au site
- [ ] Lead créé en DB avec `source='booking'`
- [ ] Pas d'email auto envoyé au visiteur à la soumission

### Admin — Auth & actions
- [ ] Routes `/admin/*` protégées (redirect login si pas de session)
- [ ] Login admin fonctionne, session persistante
- [ ] "Confirmer" change statut + envoie email de confirmation
- [ ] "Annuler" sans reschedule : envoie email avec motif uniquement
- [ ] "Annuler" avec reschedule : génère token + email avec lien `/booking/reschedule/[token]`

### File d'attente (Phase 3 + 4)
- [ ] Bascule automatique si aucun créneau dans 30 prochains jours
- [ ] Inscription en file → ligne `queue_entries` + `leads`
- [ ] Action admin "Inviter à booker" → email avec lien tokenisé valable 7j
- [ ] Créneau libéré (annulation/dispo ajoutée) → email auto à la 1ère personne en file (lien 48h)
- [ ] Lien non utilisé après 48h → email envoyé à la personne suivante
- [ ] Après usage du lien → status passe à `converted`

### i18n
- [ ] Toutes les pages publiques disponibles en `/fr/...` ET `/en/...`
- [ ] Switch FR/EN dans le header change la langue ET l'URL (préserve le slug équivalent)
- [ ] Détection automatique de la langue navigateur au premier accès
- [ ] Choix persisté en cookie après switch manuel
- [ ] Aucune chaîne de caractères en dur (tout via `messages/{fr,en}.json`)
- [ ] Formulaire booking et emails entièrement traduits

### Tokens
- [ ] Token reschedule : usage unique + invalidé après 7 jours
- [ ] Token invitation file (auto) : valable 48h
- [ ] Token invitation file (manuel) : valable 7 jours
- [ ] Token invalide ou expiré → page d'erreur claire (pas un crash)

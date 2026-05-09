# Claude — Règles de travail Corex

> Ce fichier définit le protocole à suivre pour tous les prompts. À lire **avant chaque tâche**.

---

## 1. Workflow obligatoire pour chaque prompt

À exécuter dans cet ordre, sans exception :

1. **Snapshot avant action**
   ```
   git add . && git commit -m "snapshot avant prompt-XX"
   ```
   (Si aucune modif, créer un commit vide ou skip — mais toujours partir d'un working tree propre.)

2. **Relire les 4 fichiers mémoire** (architecture, decisions, PROJECT_STATE, tests)

3. **Exécuter la tâche** demandée par le prompt

4. **Tests + rapport** — faire les vérifications listées dans `tests.md` pour la phase courante (build, routes, DB, emails) et produire un rapport synthétique

5. **Mettre à jour `memory/PROJECT_STATE.md`**
   - Prompt en cours, dernier prompt complété
   - Statut des phases
   - Cocher les cases de la checklist
   - Ajouter les fichiers créés
   - Noter les problèmes connus

6. **Commit final**
   ```
   git add . && git commit -m "prompt-XX : description courte"
   ```

7. **En cas de problème bloquant**
   ```
   git revert HEAD
   ```
   Puis documenter le problème dans `PROJECT_STATE.md` et stopper.

---

## 2. Conventions de code

- **TypeScript strict** activé partout — pas de `any` implicite
- **Composants React** : PascalCase, un composant = un fichier
- **Hooks/utilitaires** : camelCase
- **Routes App Router** : kebab-case en URL, segments traduits par locale (`/fr/rendez-vous`, `/en/booking`)
- **Fichiers** :
  - Composants → `/components/<Nom>.tsx`
  - Lib partagée → `/lib/<nom>.ts`
  - Pages → `/app/[locale]/...`
  - Traductions → `/messages/{fr,en}.json`
- **Imports** : alias `@/` pour la racine
- **Tailwind** : pas de CSS custom hors design tokens, utiliser les classes utilitaires
- **Pas de prix** ni de mention "Canada" dans les textes du site public (voir §4)

---

## 3. Rappels critiques (à ne JAMAIS oublier)

- ❌ **Pas de prix sur le site** (v1 — voir CDC §11)
- ❌ **Pas de mention de la localisation Canada** sur le site public (v1 — voir CDC §11)
- ✅ **Bilingue FR / EN obligatoire** sur toutes les pages publiques + booking
- ✅ **Email de confirmation envoyé UNIQUEMENT lorsque l'admin confirme manuellement** — jamais à la soumission du formulaire
- ✅ **Weekends toujours indisponibles** dans le booking (non configurable v1)
- ✅ **Blocages admin overrident** les règles récurrentes
- ✅ **Token reschedule** : usage unique, expire après 7 jours
- ✅ **Token invitation file d'attente** : auto = 48h, manuel admin = 7 jours
- ✅ **Créneaux générés à la volée**, jamais pré-générés en DB

---

## 4. Branding

### Couleurs (hex)
| Nom | Hex |
|---|---|
| Vert profond (principal) | `#016B2D` |
| Vert vif | `#01EA62` |
| Noir | `#050505` |
| Blanc | `#FFFFFF` |
| Gris | `#D1D5DB` |
| Dégradé | `#016B2D` → `#01EA62` |

### Typographies
| Usage | Police |
|---|---|
| Titres | Astonpoliz |
| Body | Heywow |

### Style global
- **Dark mode first**
- **Glassmorphism** (effets de verre, blur, transparence)
- **Animations fluides** (transitions horizontales sur le formulaire booking, micro-interactions)
- Tagline officielle : *Your tech partner, from day one.*

---

## 5. Hors scope v1 (ne pas implémenter)

- Pas de blog / ressources
- Pas d'intégration Google Calendar
- Pas de paiement en ligne
- Pas de portail client
- Pas d'app mobile native

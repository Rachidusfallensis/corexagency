# Project State — Corex

> Source de vérité sur l'avancement. À mettre à jour à la fin de chaque prompt.

---

## Statut global

| Champ | Valeur |
|---|---|
| Phase courante | **Phase 0 — Initialisation** |
| Prompt en cours | `00` |
| Dernier prompt complété | aucun (00.1 = sous-tâche d'init des références) |
| Date dernière maj | 2026-05-09 |
| Branche de dev | `claude/init-corex-project-qdFMv` |

---

## Phases de développement

| # | Phase | Statut |
|---|---|---|
| 1 | Foundation (Next.js, Supabase, i18n, Vercel) | non démarré |
| 2 | Pages publiques (homepage, digitalisation, saas, about, responsive) | non démarré |
| 3 | Système de booking (form 5 étapes, créneaux, reschedule, file d'attente, emails) | non démarré |
| 4 | Dashboard admin (auth, KPIs, réservations, dispos, file, leads, emails admin) | non démarré |
| 5 | Polish & lancement (SEO, perf, mobile, cross-browser, DNS, analytics) | non démarré |

---

## Checklist Phase 1 — Foundation

- [ ] Setup Next.js 14 + TypeScript + Tailwind
- [ ] Setup Supabase (projet, tables, RLS policies)
- [ ] Setup next-intl (FR/EN, fichiers de traduction)
- [ ] Design system : couleurs, typographies, composants de base
- [ ] Layout principal (nav, footer)
- [ ] Déploiement Vercel initial

---

## Fichiers créés

| Chemin | Rôle |
|---|---|
| `corex-cdc.md` | Cahier des charges (existant) |
| `references/corex-site.html` | Prototype HTML site public |
| `references/corex-booking.html` | Prototype HTML page booking |
| `references/corex-admin.html` | Prototype HTML dashboard admin |
| `memory/architecture.md` | Stack, structure dossiers, schéma DB, URLs, relations |
| `memory/claude.md` | Workflow obligatoire, conventions, rappels, branding |
| `memory/decisions.md` | Décisions de conception (techno, booking, file, tokens, hors scope) |
| `memory/PROJECT_STATE.md` | Ce fichier — état du projet |
| `memory/tests.md` | Stratégie de test, vérifications par phase, critères d'acceptation |

---

## Problèmes connus

Aucun.

---

## Prochaine étape

**Prompt 01 — Setup Next.js + Supabase + i18n**

Démarrera la Phase 1 :
1. Init Next.js 14 (App Router, TypeScript, Tailwind)
2. Connexion projet Supabase + variables d'env
3. Création des 4 tables + enums + relations
4. Setup next-intl avec `/fr` et `/en`
5. Layout racine + nav + footer minimaux
6. Déploiement Vercel initial

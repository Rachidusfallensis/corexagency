# Project State — Corex

> Source de vérité sur l'avancement. À mettre à jour à la fin de chaque prompt.

---

## Statut global

| Champ | Valeur |
|---|---|
| Phase courante | **Phase 1 — Foundation (en cours)** |
| Prompt en cours | `01` ✅ |
| Dernier prompt complété | `01` (Setup Next.js + Supabase + i18n + DB schema) |
| Date dernière maj | 2026-05-09 |
| Branche de dev | `claude/init-corex-project-qdFMv` |

---

## Phases de développement

| # | Phase | Statut |
|---|---|---|
| 1 | Foundation (Next.js, Supabase, i18n, Vercel) | **en cours** (déploiement Vercel restant) |
| 2 | Pages publiques (homepage, digitalisation, saas, about, responsive) | non démarré |
| 3 | Système de booking (form 5 étapes, créneaux, reschedule, file d'attente, emails) | non démarré |
| 4 | Dashboard admin (auth, KPIs, réservations, dispos, file, leads, emails admin) | non démarré |
| 5 | Polish & lancement (SEO, perf, mobile, cross-browser, DNS, analytics) | non démarré |

---

## Checklist Phase 1 — Foundation

- [x] Setup Next.js + TypeScript + Tailwind (Next 16 / React 19 / Tailwind v4 — voir Problèmes connus)
- [~] Setup Supabase — clients TS créés ; **schéma SQL à exécuter manuellement** (`supabase/schema.sql`)
- [x] Setup next-intl (FR/EN, fichiers de traduction, middleware)
- [x] Design system : couleurs (vert profond, vert vif, noir, gris) + dégradé via `@theme` Tailwind v4
- [ ] Layout principal (nav, footer) — placeholders en place, vrai design au Prompt 02
- [ ] Déploiement Vercel initial

---

## Fichiers créés

### Init / référence
| Chemin | Rôle |
|---|---|
| `corex-cdc.md` | Cahier des charges |
| `references/corex-{site,booking,admin}.html` | Prototypes HTML |
| `memory/{architecture,claude,decisions,PROJECT_STATE,tests}.md` | Mémoire projet |

### Prompt 01
| Chemin | Rôle |
|---|---|
| `.env.local`, `.env.example`, `.gitignore` (+ `!.env.example`) | Variables d'env |
| `package.json`, `package-lock.json`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `next-env.d.ts` | Config Next.js scaffold |
| `next.config.ts` | Wrappé avec `createNextIntlPlugin` |
| `src/middleware.ts` | next-intl middleware (`fr`/`en`, `localePrefix: always`) |
| `src/lib/i18n.ts` | `getRequestConfig` next-intl v4 (`requestLocale` + fallback `fr`) |
| `src/lib/utils.ts` | Helper `cn()` |
| `src/lib/supabase/client.ts` | `createBrowserClient` |
| `src/lib/supabase/server.ts` | `createServerClient` (cookies async) |
| `src/messages/{fr,en}.json` | Traductions de base (nav, hero, offers, footer) |
| `src/app/globals.css` | Tokens design system via `@theme` Tailwind v4 |
| `src/app/layout.tsx` | Root layout pass-through |
| `src/app/[locale]/layout.tsx` | Locale layout (html/body, Inter, NextIntlClientProvider, `setRequestLocale`) |
| `src/app/[locale]/page.tsx` | Homepage (placeholder bilingue) |
| `src/app/[locale]/{digitalisation,saas-builder,a-propos}/page.tsx` | Pages publiques placeholders |
| `src/app/[locale]/rendez-vous/page.tsx` | Booking placeholder |
| `src/app/[locale]/rendez-vous/confirmation/page.tsx` | Confirmation placeholder |
| `src/app/[locale]/rendez-vous/replanifier/[token]/page.tsx` | Reschedule placeholder |
| `src/app/[locale]/admin/{layout,page}.tsx` | Admin shell + dashboard |
| `src/app/[locale]/admin/{reservations,disponibilites,file-attente,leads}/page.tsx` | Admin placeholders |
| `src/components/layout/{Navbar,Footer}.tsx` | Composants layout placeholders |
| `src/components/{ui,booking,admin}/.gitkeep` | Dossiers vides préservés |
| `supabase/schema.sql` | Migration SQL (5 tables + RLS) — à exécuter |

---

## Problèmes connus

1. **Stack version** — `npx create-next-app@latest` a installé **Next.js 16.2.6 + React 19 + Tailwind v4** (le CDC mentionne Next 14). Décision : on continue avec la version `latest` puisque c'est ce que la commande produit. Impact : `params` est désormais une `Promise`, Tailwind v4 utilise `@theme` en CSS au lieu de `tailwind.config.ts`. La structure d'origine (App Router, TypeScript strict, i18n par segment) reste identique.
2. **Schéma Supabase non exécuté** — pas de connectivité Supabase depuis ce sandbox. Le SQL est dans `supabase/schema.sql`, à exécuter manuellement dans le SQL Editor avant le Prompt 02 (ou à la première utilisation des tables).
3. **Déploiement Vercel non effectué** — étape manuelle, à faire par l'utilisateur (link repo → Vercel project → set env vars `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`).
4. **Warning Next 16** — `middleware` est renommé `proxy` (non bloquant, le build passe). À migrer plus tard.
5. **Slugs EN partagés** — la config `next-intl` actuelle utilise des slugs partagés (`/en/rendez-vous` répond 200, `/en/booking` répond 404). Pour avoir les URLs CDC `/en/booking` et `/en/about`, ajouter la config `pathnames` (`defineRouting`) au Prompt 02 ou Phase 2.

---

## Prochaine étape

**Prompt 02 — Navbar + Footer + Layout**

Cible : design system effectif (Astonpoliz/Heywow/Inter), Navbar fixe avec switch FR/EN, Footer 4 colonnes, layout racine reproduisant la nav du proto `corex-site.html`.

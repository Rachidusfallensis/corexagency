# Project State — Corex

> Source de vérité sur l'avancement. À mettre à jour à la fin de chaque prompt.

---

## Statut global

| Champ | Valeur |
|---|---|
| Phase courante | **Phase 1 — Foundation (en cours)** |
| Prompt en cours | `04` ✅ |
| Dernier prompt complété | `04` (Offers + ExamplesDigital + ExamplesSaas) |
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
- [x] Layout principal (nav fixe + blur + scroll shadow + switch FR/EN, footer 4 cols)
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

### Prompt 01.1
| Chemin | Rôle |
|---|---|
| `public/logos/.gitkeep` + `README.md` | Dossier logos (uploadés manuellement par le client) |
| `public/images/.gitkeep` | Dossier images |
| `public/icons/.gitkeep` | Dossier icônes |
| `src/lib/assets.ts` | Chemins centralisés (`LOGOS`) + tailles standard (`LOGO_SIZES`) |

### Prompt 02
| Chemin | Rôle |
|---|---|
| `src/components/layout/Navbar.tsx` | Client Component — fixed top, blur, scroll shadow, switch FR/EN, CTA RV (responsive : texte court mobile) |
| `src/components/layout/Footer.tsx` | Server Component — 4 colonnes (logo+tagline / Offres / Entreprise / Contact), responsive 1/2/4 cols |
| `src/app/[locale]/layout.tsx` (modifié) | Intègre `<Navbar/>` + `<main pt-16>` + `<Footer/>` |
| `src/app/[locale]/page.tsx` (modifié) | Homepage temporaire brandée (logo + h1 + desc + CTA vert vif) |
| `src/messages/{fr,en}.json` (modifiés) | Clés `nav.bookingShort` + bloc `footer` complet (col1/2/3, copyright, madeWith) |
| `src/app/icon.png` (ajouté) | Favicon (copie de `Corex_Logo_icon.png`) — convention Next.js `app/icon.png`. Default `favicon.ico` du scaffold supprimé. |
| `public/logos/Corex_Logo_{Blanc,color,icon}.png` | Uploadés par le client en parallèle (rebase pris en compte) |
| `public/icons/Corex_Logo_icon.png` | Uploadé par le client |

### Prompt 03
| Chemin | Rôle |
|---|---|
| `src/components/home/Hero.tsx` | Section Hero (light bg + radial gradient + dot grid pattern, 2 colonnes, badge animé pulse-dot, h1 clamp 2.8-5.2rem avec em vert profond, CTA primary noir + secondary outline, hero-visual 380x400 avec 3 cards animées) |
| `src/components/ui/FadeIn.tsx` | Wrapper IntersectionObserver, applique `fadeInUp` à l'entrée du viewport, prop `delay?: number` (ms) |
| `src/app/globals.css` (modifié) | Ajout `@theme` `--animate-{floatA,floatB,fadeInUp,popIn,pulse-dot}` + 5 keyframes correspondantes |
| `src/components/layout/Navbar.tsx` (modifié) | Logo `LOGOS.color` au lieu de `LOGOS.blanc` (résout problème connu #6) |
| `src/app/[locale]/layout.tsx` (modifié) | `<main>` sans `pt-16` (chaque section gère son padding au-dessus) |
| `src/app/[locale]/page.tsx` (modifié) | Affiche `<Hero/>` (placeholder précédent supprimé) |

### Prompt 04
| Chemin | Rôle |
|---|---|
| `src/lib/data/offers.ts` | `OFFERS` (services digital + saas), `EXAMPLES_DIGITAL` (6 secteurs FR), `EXAMPLES_SAAS` (4 secteurs FR), type `SectorExample` |
| `src/components/ui/SectionLabel.tsx` | Label uppercase tracking-wide, prop `color: 'green-deep' \| 'green-vivid'` |
| `src/components/ui/ExampleCard.tsx` | Card 1 secteur (light ou `dark`), tag coloré, h4, desc, "→ result" |
| `src/components/home/Offers.tsx` | Section `#offres` fond gris clair, header + 2 cards (Digital light blanche / SaaS dark verte), pills services, lien arrow gap-anim, cercle décoratif bottom-right, FadeIn par card |
| `src/components/home/ExamplesDigital.tsx` | Section `#exemples-digital` fond blanc, header + grid 1/2/3 cols, 6 `<ExampleCard>` light avec FadeIn delay i*100 |
| `src/components/home/ExamplesSaas.tsx` | Section `#exemples-saas` fond noir `#050505`, header label vert vif + h2 blanc, grid 1/2/3 cols, 4 `<ExampleCard dark>` avec FadeIn delay i*100 |
| `src/app/[locale]/page.tsx` (modifié) | Compose `<Hero/>` + `<Offers/>` + `<ExamplesDigital/>` + `<ExamplesSaas/>` |
| `src/messages/{fr,en}.json` (modifiés) | Bloc `offers.{digital,saas}` (tag/title/desc/link) + `examplesDigital` + `examplesSaas` |

---

## Problèmes connus

1. **Stack version** — `npx create-next-app@latest` a installé **Next.js 16.2.6 + React 19 + Tailwind v4** (le CDC mentionne Next 14). Décision : on continue avec la version `latest` puisque c'est ce que la commande produit. Impact : `params` est désormais une `Promise`, Tailwind v4 utilise `@theme` en CSS au lieu de `tailwind.config.ts`. La structure d'origine (App Router, TypeScript strict, i18n par segment) reste identique.
2. **Schéma Supabase non exécuté** — pas de connectivité Supabase depuis ce sandbox. Le SQL est dans `supabase/schema.sql`, à exécuter manuellement dans le SQL Editor avant le Prompt 02 (ou à la première utilisation des tables).
3. **Déploiement Vercel non effectué** — étape manuelle, à faire par l'utilisateur (link repo → Vercel project → set env vars `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`).
4. **Warning Next 16** — `middleware` est renommé `proxy` (non bloquant, le build passe). À migrer plus tard.
5. **Slugs EN partagés** — la config `next-intl` actuelle utilise des slugs partagés (`/en/rendez-vous` répond 200, `/en/booking` répond 404). Pour avoir les URLs CDC `/en/booking` et `/en/about`, ajouter la config `pathnames` (`defineRouting`) au Prompt 03 ou Phase 2.
6. ~~Contradiction visuelle Navbar~~ ✅ **Résolu prompt-03** : nav utilise désormais `Corex_Logo_color.png` (logo foncé) sur son fond blanc.

---

## Prochaine étape

**Prompt 05 — Sections Processus + Why Corex + SaaS Focus + CTA**

Cible : finaliser la homepage avec les sections restantes du proto — 4 étapes du processus, 6 cards "Pourquoi Corex" (fond noir), focus SaaS Builder avec progression MVP visuel + tech badges, CTA final fond vert profond.

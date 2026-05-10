# Project State — Corex

> Source de vérité sur l'avancement. À mettre à jour à la fin de chaque prompt.

---

## Statut global

| Champ | Valeur |
|---|---|
| Phase courante | **Phase 1 — Foundation (en cours)** |
| Prompt en cours | `09` ✅ |
| Dernier prompt complété | `09` (Responsive + PWA + Cron + Calendrier admin) |
| Date dernière maj | 2026-05-09 |
| Branche de dev | `claude/init-corex-project-qdFMv` |

---

## Phases de développement

| # | Phase | Statut |
|---|---|---|
| 1 | Foundation (Next.js, Supabase, i18n, Vercel) | **en cours** (déploiement Vercel restant) |
| 2 | Pages publiques (homepage, digitalisation, saas, about, responsive) | **OK** — homepage + Digitalisation + SaaS Builder + À propos toutes complètes (Phase 2 close) |
| 3 | Système de booking (form 5 étapes, créneaux, reschedule, file d'attente, emails) | **form 5 étapes + calendrier + file d'attente OK** ; reschedule + emails restent (Prompt 06.1+) |
| 4 | Dashboard admin (auth, KPIs, réservations, dispos, file, leads, emails admin) | **auth + 5 pages OK** ; mini-cal avec marqueurs RV + emails admin restent (Prompt 07.1+) |
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

### Prompt 05
| Chemin | Rôle |
|---|---|
| `src/lib/data/offers.ts` (modifié) | Ajout `PROCESS_STEPS` (4), `WHY_ITEMS` (6) avec type `WhyIcon`, `SAAS_STEPS` (4), `SAAS_PROGRESS` (5 barres pct), `TECH_BADGES` (5) |
| `src/components/home/Process.tsx` | Section `#processus` fond blanc, header + grid 1/2/4 cols, 4 cards (numéro vert vif 38px, h4, desc), hover border vert vif + translate, FadeIn cascadé |
| `src/components/home/WhyCorex.tsx` | Section fond noir, header label vert vif + h2 blanc, grid 1/2/3 cols, 6 cards glass (border 7%/bg 2%) avec icônes SVG inline (`lightning, clock, users, code, shield, support`), hover border vert vif 30%, FadeIn cascadé |
| `src/components/home/SaasSection.tsx` | Section `#saas` fond gris clair, grid 1/2 cols ; **Gauche** : header + 4 step-cards (numéro 32px noir, h4/p) ; **Droite** (`saas-visual`) : panel noir radius 28, 5 progress bars avec gradient `linear-gradient(90deg, #016B2D, #01EA62)` aux pct 100/80/65/40/10, 5 tech badges (Next.js, Supabase, React, TypeScript, Node.js) |
| `src/components/home/CtaSection.tsx` | Section `#contact` fond vert deep, gradient ellipse décoratif bottom, h2 blanc + p + bouton vert vif arrondi `→ /[locale]/rendez-vous` avec hover translate-up + shadow vert |
| `src/app/[locale]/page.tsx` (modifié) | Compose les **8 sections** : Hero, Offers, ExamplesDigital, ExamplesSaas, Process, WhyCorex, SaasSection, CtaSection |
| `src/messages/{fr,en}.json` (modifiés) | Ajout blocs `process.{label,title,desc,step1..4}`, `why.{label,title,item1..6}`, `saas.{label,title,desc,step1..4}`, `cta.{title,desc,btn}` |

### Prompt 06
| Chemin | Rôle |
|---|---|
| `src/lib/types/booking.ts` | Types `Service`, `Profile`, `BookingStatus`, `Urgency`, `BookingState`, `TimeSlot`, `AvailabilityRule`, `AvailabilityBlock`, `Reservation` + `EMPTY_BOOKING_STATE` |
| `src/lib/booking/availability.ts` | Fonctions pures `generateSlots`, `isDateBlocked`, `hasAvailableSlots`, `hasAnySlotInNext30Days`, helpers `dateKey`. Convention `0=Lun..6=Dim`, weekends auto-bloqués (CDC §10.2), créneaux générés à la volée |
| `src/lib/booking/actions.ts` | Server Actions `getAvailabilityData`, `createReservation` (re-check slot avant insert + insert lead `source='booking'`), `createQueueEntry` (insert queue + lead `source='queue'`). Validation email/champs obligatoires |
| `src/components/booking/ProgressBar.tsx` | Barre gradient 3px + label étape + compteur N/5 |
| `src/components/booking/OptionButton.tsx` | Card option avec icône, titre, desc, indicateur check vert vif, hover translate-x |
| `src/components/booking/BookingCalendar.tsx` | Calendrier custom 7 cols (Lun→Dim), navigation mois (current → +2), past/weekend/blocked désactivés, créneaux 3 cols sous calendrier, slot booké barré opacity 25% |
| `src/components/booking/ContactForm.tsx` | 4 champs : prénom/nom (grid 2), email, tel, entreprise. Style dark glassmorphism focus vert vif |
| `src/components/booking/ConfirmationScreen.tsx` | Cercle check `popIn` + h2 + message 24h + recap card 5 lignes + retour site |
| `src/components/booking/QueueFallback.tsx` | Formulaire urgence (3 options) → `createQueueEntry` → écran confirmation |
| `src/app/[locale]/rendez-vous/page.tsx` | Page client 2 colonnes : panel gauche vert (logo Blanc + tagline + 4 features), panel droit noir (ProgressBar + 6 steps animés `fadeInUp` + bottom-nav). Détection auto `queueMode` via `hasAnySlotInNext30Days` |
| `src/app/[locale]/(public)/layout.tsx` | **Refactor** — Navbar/Footer désormais portés par ce route group ; booking et admin n'héritent plus de la nav publique |
| `src/app/[locale]/layout.tsx` (modifié) | Plus de Navbar/Footer ; juste html/body + NextIntlClientProvider |
| `src/app/[locale]/(public)/{page,digitalisation,saas-builder,a-propos}` | Pages publiques déplacées dans le route group `(public)` |
| `supabase/seed.sql` | Données de test — 2 règles (Mar/Mer/Jeu matin 9-12, Mar/Jeu après-midi 14-17) + 1 blocage T+21j à exécuter manuellement dans Supabase |

### Prompt 07
| Chemin | Rôle |
|---|---|
| `src/components/home/Hero.tsx` (corrigé) | `shrink-0` ajouté sur conteneur hero-visual 380×400 (A1) |
| `src/components/home/Offers.tsx` (corrigé) | `items-stretch` sur grid + `h-full` sur FadeIn et `<article>` ; cercle décoratif `pointer-events-none` (A2) |
| `src/lib/types/admin.ts` | Types `ReservationRow`, `QueueRow`, `LeadRow`, `AvailabilityRuleRow`, `AvailabilityBlockRow`, `StatsData` |
| `src/lib/supabase/service.ts` | `createServiceClient()` — client service-role pour les écritures admin (bypass RLS, à utiliser après vérification auth) |
| `src/lib/admin/actions.ts` | 13 Server Actions toutes protégées par `requireAdmin()` : `getStats`, `getReservations`, `confirmReservation`, `cancelReservation` (génère `reschedule_token` UUID si `withReschedule`), `getQueue`, `inviteFromQueue` (génère `invite_token`), `rejectFromQueue`, `getLeads`, `getAvailabilityRules/Blocks`, `addAvailabilityRule/Block`, `deleteAvailabilityRule/Block` |
| `src/components/admin/StatCard.tsx` | Card KPI (icon-box coloré 36px, valeur 1.6rem, label, badge tendance optionnel) |
| `src/components/admin/StatusBadge.tsx` | Badge statut (pending/confirmed/cancelled/waiting/invited/converted/rejected/new) avec point + label |
| `src/components/admin/ServiceBadge.tsx` | Badge service (digitalisation bleu / saas violet / other gris) |
| `src/components/admin/CancelModal.tsx` | Modale annulation : motif obligatoire + toggle reschedule (note conditionnelle), submit → `(reason, withReschedule)` |
| `src/components/admin/DetailModal.tsx` | Modale détail réservation : grid info 6 cellules + description avec border-left vert + bouton confirm si `pending` |
| `src/components/admin/Toast.tsx` | `ToastProvider` + `useToast()`, position bottom-right, success vert / danger rouge, auto-dismiss 3.5s |
| `src/components/admin/AdminSidebar.tsx` | Sidebar 220px : logo Corex + 5 items nav (active = vert vif, dérivé via `usePathname()`), card admin "AD" en bas |
| `src/components/admin/AdminShell.tsx` | Layout admin Client : grid sidebar 220 + main avec topbar (titre/sous-titre + notif + "Voir le site" + "Nouvelle dispo"), wraps `ToastProvider` |
| `src/app/[locale]/admin/login/page.tsx` | Page login `'use client'` : `supabase.auth.signInWithPassword()` → redirect `/admin` ; pas dans le route group `(dash)` donc pas d'auth check |
| `src/app/[locale]/admin/(dash)/layout.tsx` | **Auth guard Server Component** : `supabase.auth.getUser()`, redirect `/admin/login` si pas de user |
| `src/app/[locale]/admin/(dash)/page.tsx` | Dashboard overview Server Component : 4 StatCards + tableau réservations récentes + side panel "Prochains RV" |
| `src/app/[locale]/admin/(dash)/reservations/page.tsx` | Client page : filtres pills (statut + service), tableau complet, actions Détail (modale) / Confirmer / Annuler (modale avec reschedule), toasts |
| `src/app/[locale]/admin/(dash)/disponibilites/page.tsx` | Client page : 2 colonnes (règles + blocages), modales d'ajout (jours toggle, durée select, dates), suppression au hover |
| `src/app/[locale]/admin/(dash)/file-attente/page.tsx` | Client page : 3 stats + cards expandable avec rang/urgence/desc, actions Inviter / Rejeter |
| `src/app/[locale]/admin/(dash)/leads/page.tsx` | Client page : search input + filtres pills (service + source) + bouton **Export CSV** (génération côté client + download) |

### Prompt 08
| Chemin | Rôle |
|---|---|
| `src/app/[locale]/(public)/digitalisation/page.tsx` | Page Digitalisation (5 sections) : Hero noir + 6 cards services (ERP/CRM/E-commerce/Site/Auto/API avec icônes SVG inline) + `<ExamplesDigital>` + `<Process>` + `<CtaSection>`. Metadata SEO. 100% inline styles. |
| `src/app/[locale]/(public)/saas-builder/page.tsx` | Page SaaS Builder (6 sections) : Hero noir + 3 profils (Startup/Entrepreneur/PME) + 4 étapes process détaillées avec semaines + 5 stack badges fond noir + `<ExamplesSaas>` + `<CtaSection>`. Metadata SEO. 100% inline styles. |
| `src/app/[locale]/(public)/a-propos/page.tsx` | Page À propos (4 sections) : Hero noir + Mission grid 2 cols (texte + 3 valeurs Honnêteté/Excellence/Impact) + 2 cards offres (liens vers Digital/SaaS) + `<CtaSection>`. Metadata SEO. 100% inline styles. |
| `src/components/layout/Navbar.tsx` (modifié) | Liens nav : "Nos offres" → `/digitalisation`, "SaaS Builder" → `/saas-builder` (au lieu d'ancres home) |

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

**Prompt 10 — Emails transactionnels + page reschedule + polish final**

Cible : Resend / SendGrid via Edge Function, page `/rendez-vous/replanifier/[token]` complète (validation token, pré-remplissage, ré-insertion), SEO/sitemap/robots, performance, polish.

### Prompt 09 (livré)
- Responsive mobile homepage (media queries 768/480px) + menu hamburger fonctionnel + booking responsive
- PWA : `public/manifest.json`, layout `metadata.manifest` + `viewport.themeColor` + `appleWebApp` + `icons.apple`
- Cron Supabase keep-alive : `/api/keep-alive` GET avec auth `Bearer ${CRON_SECRET}` + `vercel.json` schedule `0 12 */5 * *` + var env `CRON_SECRET` dans `.env.example`
- Calendrier admin mensuel interactif : grid 7 cols, statuts par jour (weekend/past/blocked/reserved/available/empty), nav mois ◄ ►, légende, panel détail au clic d'un jour avec liste des créneaux (libre / réservé par X) + bouton "Bloquer ce jour" (preset date dans modale)

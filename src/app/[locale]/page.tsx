'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useLocale } from 'next-intl'

const PROTO_CSS = `
*{margin:0;padding:0;box-sizing:border-box}
:root{--gd:#016B2D;--gv:#01EA62;--bk:#050505;--wh:#fff;--gl:#F4F6F4;--gm:#6B7280;--gray:#D1D5DB}
html{scroll-behavior:smooth}
body{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;background:#fff;color:#050505;line-height:1.6;overflow-x:hidden}
.proto-home h1,.proto-home h2,.proto-home h3,.proto-home h4{line-height:1.15;letter-spacing:-0.02em}
.proto-home h1{font-size:clamp(2.8rem,6vw,5.2rem);font-weight:800}
.proto-home h2{font-size:clamp(2rem,4vw,3rem);font-weight:700}
.proto-home h3{font-size:1.5rem;font-weight:600}
.proto-home h4{font-size:1rem;font-weight:600}
.proto-home p{font-size:1rem;color:#6B7280;line-height:1.75}
.proto-home .container{max-width:1200px;margin:0 auto;padding:0 2rem}
.proto-home{background:#fff;color:#050505}

/* NAV */
.proto-home nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(255,255,255,0.93);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(0,0,0,0.07);padding:1rem 2rem;transition:box-shadow 0.3s}
.proto-home .nav-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between}
.proto-home .nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
.proto-home .logo-mark{width:36px;height:36px;background:#016B2D;border-radius:10px;display:flex;align-items:center;justify-content:center}
.proto-home .nav-logo-text{font-size:1.2rem;font-weight:700;color:#050505;letter-spacing:-0.02em}
.proto-home .nav-links{display:flex;align-items:center;gap:2rem}
.proto-home .nav-links a{text-decoration:none;color:#6B7280;font-size:0.9rem;font-weight:500;transition:color 0.2s}
.proto-home .nav-links a:hover{color:#050505}
.proto-home .nav-cta{background:#050505;color:#fff;padding:0.6rem 1.4rem;border-radius:50px;text-decoration:none;font-size:0.875rem;font-weight:600;transition:all 0.2s}
.proto-home .nav-cta:hover{background:#016B2D;transform:translateY(-1px)}

/* HERO */
.proto-home .hero{min-height:100vh;display:flex;align-items:center;padding-top:5rem;background:#fff;position:relative;overflow:hidden}
.proto-home .hero-bg{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 70% 60% at 80% 50%,rgba(1,234,98,0.07) 0%,transparent 70%)}
.proto-home .hero-dots{position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(circle,rgba(1,107,45,0.11) 1px,transparent 1px);background-size:32px 32px}
.proto-home .hero-inner{position:relative;z-index:1;display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:center;max-width:1200px;margin:0 auto;padding:0 2rem;width:100%}
.proto-home .hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(1,107,45,0.08);border:1px solid rgba(1,107,45,0.2);color:#016B2D;padding:0.4rem 1rem;border-radius:50px;font-size:0.78rem;font-weight:700;margin-bottom:1.5rem;text-transform:uppercase;letter-spacing:0.06em}
.proto-home .badge-dot{width:6px;height:6px;background:#01EA62;border-radius:50%;display:inline-block}
.proto-home .hero h1{margin-bottom:1.25rem}
.proto-home .hero h1 em{font-style:normal;color:#016B2D}
.proto-home .hero-desc{font-size:1.1rem;margin-bottom:2.5rem;max-width:460px}
.proto-home .hero-actions{display:flex;gap:1rem;flex-wrap:wrap}
.proto-home .btn-primary{background:#050505;color:#fff;padding:0.9rem 2rem;border-radius:50px;text-decoration:none;font-weight:600;font-size:0.95rem;transition:all 0.2s;display:inline-flex;align-items:center;gap:8px;border:none;cursor:pointer}
.proto-home .btn-primary:hover{background:#016B2D;transform:translateY(-2px)}
.proto-home .btn-secondary{background:transparent;color:#050505;padding:0.9rem 2rem;border-radius:50px;text-decoration:none;font-weight:600;font-size:0.95rem;border:1.5px solid #D1D5DB;transition:all 0.2s;display:inline-flex;align-items:center;gap:8px;cursor:pointer}
.proto-home .btn-secondary:hover{border-color:#050505;transform:translateY(-2px)}

/* HERO VISUAL */
.proto-home .hero-visual{display:flex;flex-direction:column;gap:1rem}
.proto-home .hero-value-card{border-radius:20px;padding:1.75rem}
.proto-home .hvc-main{background:#016B2D;color:white}
.proto-home .hvc-main h3{color:white;font-size:1.2rem;margin-bottom:0.5rem}
.proto-home .hvc-main p{color:rgba(255,255,255,0.7);font-size:0.9rem}
.proto-home .hvc-tag{display:inline-block;background:rgba(1,234,98,0.2);color:#01EA62;padding:0.25rem 0.8rem;border-radius:50px;font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.75rem}
.proto-home .hvc-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.proto-home .hvc-small{border-radius:16px;padding:1.25rem;border:1px solid rgba(0,0,0,0.08);background:#fff}
.proto-home .hvc-small h4{font-size:0.85rem;margin-bottom:0.3rem}
.proto-home .hvc-small p{font-size:0.8rem}
.proto-home .hvc-dark{background:#050505;border-color:transparent}
.proto-home .hvc-dark h4{color:#fff}
.proto-home .hvc-dark p{color:rgba(255,255,255,0.5)}
.proto-home .service-chips{display:flex;flex-wrap:wrap;gap:5px;margin-top:0.6rem}
.proto-home .s-chip{background:#F4F6F4;padding:0.2rem 0.6rem;border-radius:50px;font-size:0.72rem;font-weight:500;color:#050505}
.proto-home .s-chip.green{background:rgba(1,234,98,0.15);color:#016B2D}

/* OFFRES */
.proto-home .offers{background:#F4F6F4;padding:6rem 0}
.proto-home .section-label{display:inline-block;font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#016B2D;margin-bottom:0.75rem}
.proto-home .section-header{margin-bottom:3.5rem}
.proto-home .section-header h2{margin-bottom:0.75rem}
.proto-home .offers-grid{display:grid;grid-template-columns:1fr 1fr;gap:2rem}
.proto-home .offer-card{border-radius:28px;padding:2.5rem;position:relative;overflow:hidden;transition:transform 0.25s,box-shadow 0.25s}
.proto-home .offer-card:hover{transform:translateY(-4px);box-shadow:0 20px 50px rgba(0,0,0,0.09)}
.proto-home .offer-card.light{background:#fff;border:1px solid rgba(0,0,0,0.07)}
.proto-home .offer-card.dark{background:#016B2D;border:none}
.proto-home .offer-tag{display:inline-flex;align-items:center;gap:6px;padding:0.3rem 0.85rem;border-radius:50px;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:1.5rem}
.proto-home .offer-card.light .offer-tag{background:rgba(1,107,45,0.08);color:#016B2D}
.proto-home .offer-card.dark .offer-tag{background:rgba(1,234,98,0.2);color:#01EA62}
.proto-home .offer-card h3{margin-bottom:0.75rem;font-size:1.5rem}
.proto-home .offer-card.dark h3{color:#fff}
.proto-home .offer-card.dark p{color:rgba(255,255,255,0.65)}
.proto-home .offer-services{display:flex;flex-wrap:wrap;gap:7px;margin:1.5rem 0 2rem}
.proto-home .offer-service{padding:0.35rem 0.85rem;border-radius:50px;font-size:0.8rem;font-weight:500}
.proto-home .offer-card.light .offer-service{background:#F4F6F4;color:#050505}
.proto-home .offer-card.dark .offer-service{background:rgba(255,255,255,0.1);color:#fff}
.proto-home .offer-link{display:inline-flex;align-items:center;gap:8px;font-weight:600;font-size:0.9rem;text-decoration:none;transition:gap 0.2s}
.proto-home .offer-link:hover{gap:14px}
.proto-home .offer-card.light .offer-link{color:#050505}
.proto-home .offer-card.dark .offer-link{color:#01EA62}
.proto-home .offer-bg-icon{position:absolute;right:-15px;bottom:-15px;width:110px;height:110px;border-radius:50%;display:flex;align-items:center;justify-content:center;opacity:0.12;pointer-events:none}
.proto-home .offer-card.light .offer-bg-icon{background:#016B2D}
.proto-home .offer-card.dark .offer-bg-icon{background:#01EA62}

/* PROCESSUS */
.proto-home .process-sec{padding:6rem 0}
.proto-home .process-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem;margin-top:3rem}
.proto-home .process-step{padding:1.75rem;border-radius:16px;background:#fff;border:1px solid rgba(0,0,0,0.07);transition:border-color 0.2s,transform 0.2s}
.proto-home .process-step:hover{border-color:#01EA62;transform:translateY(-2px)}
.proto-home .step-num{width:38px;height:38px;border-radius:50%;background:#01EA62;color:#050505;font-weight:800;font-size:0.85rem;display:flex;align-items:center;justify-content:center;margin-bottom:1rem}
.proto-home .process-step h4{margin-bottom:0.4rem}
.proto-home .process-step p{font-size:0.875rem}

/* WHY */
.proto-home .why-sec{background:#050505;padding:6rem 0}
.proto-home .why-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;margin-top:3rem}
.proto-home .why-card{padding:2rem;border-radius:20px;border:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.02);transition:border-color 0.2s,background 0.2s}
.proto-home .why-card:hover{border-color:rgba(1,234,98,0.3);background:rgba(1,234,98,0.03)}
.proto-home .why-icon{width:44px;height:44px;border-radius:10px;background:rgba(1,234,98,0.1);display:flex;align-items:center;justify-content:center;margin-bottom:1.25rem}
.proto-home .why-card h4{color:#fff;margin-bottom:0.4rem}
.proto-home .why-card p{color:rgba(255,255,255,0.5);font-size:0.875rem}

/* SAAS */
.proto-home .saas-sec{background:#F4F6F4;padding:6rem 0}
.proto-home .saas-inner{display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:center}
.proto-home .saas-steps{display:flex;flex-direction:column;gap:1rem;margin-top:2rem}
.proto-home .saas-step{display:flex;gap:1.25rem;align-items:flex-start;padding:1.25rem;background:#fff;border-radius:12px;border:1px solid rgba(0,0,0,0.07)}
.proto-home .saas-num{min-width:32px;height:32px;border-radius:50%;background:#050505;color:#fff;font-weight:700;font-size:0.78rem;display:flex;align-items:center;justify-content:center}
.proto-home .saas-step h4{margin-bottom:0.2rem;font-size:0.95rem}
.proto-home .saas-step p{font-size:0.82rem}
.proto-home .saas-visual{background:#050505;border-radius:28px;padding:2.25rem}
.proto-home .vis-label{font-size:0.7rem;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:1.5rem}
.proto-home .prog-item{margin-bottom:1rem}
.proto-home .prog-lbl{display:flex;justify-content:space-between;margin-bottom:0.35rem}
.proto-home .prog-lbl span{font-size:0.78rem}
.proto-home .prog-lbl span:first-child{color:rgba(255,255,255,0.65)}
.proto-home .prog-lbl span:last-child{color:#01EA62;font-weight:600}
.proto-home .prog-bar{height:5px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden}
.proto-home .prog-fill{height:100%;background:linear-gradient(90deg,#016B2D,#01EA62);border-radius:3px}
.proto-home .tech-row{display:flex;gap:7px;flex-wrap:wrap;margin-top:1.5rem}
.proto-home .tech-badge{padding:0.35rem 0.9rem;border-radius:50px;font-size:0.75rem;font-weight:500;background:rgba(1,234,98,0.1);color:#01EA62;border:1px solid rgba(1,234,98,0.18)}

/* CTA */
.proto-home .cta-sec{background:#016B2D;padding:7rem 0;text-align:center;position:relative;overflow:hidden}
.proto-home .cta-sec::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 80% at 50% 120%,rgba(1,234,98,0.15),transparent 70%)}
.proto-home .cta-sec h2{color:#fff;margin-bottom:1rem;position:relative}
.proto-home .cta-sec p{color:rgba(255,255,255,0.7);max-width:480px;margin:0 auto 2.5rem;position:relative}
.proto-home .btn-vivid{background:#01EA62;color:#050505;padding:1rem 2.5rem;border-radius:50px;text-decoration:none;font-weight:700;font-size:1rem;transition:all 0.2s;display:inline-flex;align-items:center;gap:10px;border:none;cursor:pointer;position:relative}
.proto-home .btn-vivid:hover{transform:translateY(-3px);box-shadow:0 14px 35px rgba(1,234,98,0.3)}

/* FOOTER */
.proto-home footer{background:#050505;padding:4rem 0 2rem;border-top:1px solid rgba(255,255,255,0.06)}
.proto-home .footer-inner{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:3rem;margin-bottom:3rem}
.proto-home .footer-brand p{color:rgba(255,255,255,0.45);font-size:0.875rem;margin-top:1rem;max-width:240px}
.proto-home .footer-col h5{color:#fff;font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:1.25rem}
.proto-home .footer-col a{display:block;color:rgba(255,255,255,0.45);text-decoration:none;font-size:0.875rem;margin-bottom:0.6rem;transition:color 0.2s}
.proto-home .footer-col a:hover{color:#01EA62}
.proto-home .footer-bottom{border-top:1px solid rgba(255,255,255,0.06);padding-top:2rem;display:flex;justify-content:space-between;align-items:center}
.proto-home .footer-bottom p{color:rgba(255,255,255,0.3);font-size:0.8rem}
.proto-home .footer-bottom span{color:#01EA62}

/* EXEMPLES */
.proto-home .exemples-sec{padding:5rem 0;background:#fff}
.proto-home .exemples-sec.dark-bg{background:#050505}
.proto-home .ex-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem;margin-top:3rem}
.proto-home .ex-card{border-radius:16px;padding:1.5rem;border:1px solid rgba(0,0,0,0.07);background:#fff;transition:transform 0.2s,box-shadow 0.2s;position:relative;overflow:hidden}
.proto-home .ex-card:hover{transform:translateY(-3px);box-shadow:0 12px 35px rgba(0,0,0,0.08)}
.proto-home .ex-card.dark-card{background:#111;border-color:rgba(255,255,255,0.07)}
.proto-home .ex-card.dark-card:hover{box-shadow:0 12px 35px rgba(1,234,98,0.08)}
.proto-home .ex-sector{display:inline-flex;align-items:center;gap:6px;padding:0.25rem 0.75rem;border-radius:50px;font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:1rem}
.proto-home .ex-sector.green{background:rgba(1,107,45,0.08);color:#016B2D}
.proto-home .ex-sector.vivid{background:rgba(1,234,98,0.12);color:#01EA62}
.proto-home .ex-card h4{font-size:0.95rem;margin-bottom:0.5rem;line-height:1.3}
.proto-home .ex-card.dark-card h4{color:#fff}
.proto-home .ex-card p{font-size:0.82rem;line-height:1.65}
.proto-home .ex-card.dark-card p{color:rgba(255,255,255,0.5)}
.proto-home .ex-result{display:inline-flex;align-items:center;gap:5px;margin-top:0.85rem;font-size:0.78rem;font-weight:600;color:#016B2D}
.proto-home .ex-card.dark-card .ex-result{color:#01EA62}
.proto-home .ex-result::before{content:'→';font-size:0.85rem}

/* ANIMATIONS */
@keyframes floatA{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.proto-home .hero-value-card{animation:floatA 6s ease-in-out infinite}
.proto-home .hvc-row .hvc-small:first-child{animation:floatA 5s ease-in-out infinite 0.5s}
.proto-home .hvc-row .hvc-small:last-child{animation:floatA 7s ease-in-out infinite 1s}

/* FADE IN */
.proto-home .fade-in{opacity:0;transform:translateY(18px);transition:opacity 0.55s ease,transform 0.55s ease}
.proto-home .fade-in.visible{opacity:1;transform:translateY(0)}

/* RESPONSIVE */
@media(max-width:960px){
  .proto-home .hero-inner{grid-template-columns:1fr}
  .proto-home .hero-visual{display:none}
  .proto-home .offers-grid{grid-template-columns:1fr}
  .proto-home .why-grid{grid-template-columns:1fr 1fr}
  .proto-home .process-grid{grid-template-columns:1fr 1fr}
  .proto-home .saas-inner{grid-template-columns:1fr}
  .proto-home .footer-inner{grid-template-columns:1fr 1fr}
  .proto-home .nav-links{display:none}
  .proto-home .ex-grid{grid-template-columns:1fr 1fr}
}
@media(max-width:600px){
  .proto-home .why-grid{grid-template-columns:1fr}
  .proto-home .process-grid{grid-template-columns:1fr}
  .proto-home .footer-inner{grid-template-columns:1fr}
  .proto-home .ex-grid{grid-template-columns:1fr}
}
`

const EXAMPLES_DIGITAL = [
  {
    sector: 'Restauration',
    title: 'Gestion des stocks et commandes fournisseurs automatisée',
    desc: "Une chaîne de restaurants élimine les ruptures de stock et la saisie manuelle grâce à un ERP sur mesure synchronisé avec ses fournisseurs.",
    result: 'Zéro rupture, zéro saisie manuelle',
  },
  {
    sector: 'Immobilier',
    title: 'CRM centralisé pour prospects, visites et relances',
    desc: 'Une agence immobilière remplace ses fichiers Excel par un CRM qui automatise les relances et donne une vue complète sur chaque prospect.',
    result: '50% de temps commercial économisé',
  },
  {
    sector: 'Santé',
    title: 'Digitalisation des rendez-vous et dossiers patients',
    desc: "Une clinique dentaire digitalise ses prises de rendez-vous, dossiers patients et rappels SMS. L'équipe se concentre sur le soin, pas sur l'administratif.",
    result: '2h gagnées par jour par employé',
  },
  {
    sector: 'E-commerce',
    title: 'Boutique en ligne synchronisée avec le magasin physique',
    desc: 'Une boutique de mode lance sa présence en ligne avec gestion des stocks unifiée entre le magasin et le web.',
    result: 'Stocks toujours à jour sur tous les canaux',
  },
  {
    sector: 'Logistique',
    title: 'Automatisation des bons de livraison et de la facturation',
    desc: 'Une PME de transport automatise ses bons de livraison, le suivi des chauffeurs et la génération des factures clients.',
    result: 'Facturation instantanée à la livraison',
  },
  {
    sector: 'Formation',
    title: 'Plateforme de gestion des inscriptions et certifications',
    desc: "Un centre de formation remplace ses processus papier par une plateforme qui gère inscriptions, paiements et délivrance de certificats automatiquement.",
    result: '100% du parcours apprenant digital',
  },
]

const EXAMPLES_SAAS = [
  {
    sector: 'RH',
    title: 'SaaS de gestion des congés pour TPE et PME',
    desc: 'Un fondateur RH lance un outil simple de gestion des congés et absences pour les petites entreprises sans SIRH complet.',
    result: 'MVP livré en 8 semaines',
  },
  {
    sector: 'Juridique',
    title: 'Générateur automatique de contrats pour freelances',
    desc: "Une startup juridique construit un outil qui permet aux freelances de générer des contrats conformes en quelques clics, sans passer par un avocat.",
    result: 'Contrat prêt en moins de 5 minutes',
  },
  {
    sector: 'Retail',
    title: 'Programme de fidélisation pour commerces de proximité',
    desc: 'Un entrepreneur développe un SaaS qui permet aux petits commerces de lancer leur propre programme de fidélité sans infrastructure technique complexe.',
    result: 'Activé en 1 jour par le commerçant',
  },
  {
    sector: 'Éducation',
    title: 'Plateforme de micro-learning avec suivi de progression',
    desc: 'Une EdTech lance une plateforme de formation courte avec suivi de progression, quiz et certification automatisée pour ses apprenants.',
    result: 'Lancement en moins de 10 semaines',
  },
]

function CorexLogoMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 8C8 6 12 12 16 18C20 16 20 16 20 16" stroke="#01EA62" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M4 16C8 14 12 12 16 10C20 8 20 8 20 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="12" cy="12" rx="4" ry="8" stroke="#01EA62" strokeWidth="1.5" fill="none" transform="rotate(-15 12 12)" />
    </svg>
  )
}

function FadeInBlock({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true)
            observer.unobserve(e.target)
          }
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return (
    <div ref={ref} className={`fade-in${visible ? ' visible' : ''}`}>
      {children}
    </div>
  )
}

export default function HomePage() {
  const locale = useLocale()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const home = `/${locale}`
  const booking = `/${locale}/rendez-vous`

  return (
    <div className="proto-home">
      <style dangerouslySetInnerHTML={{ __html: PROTO_CSS }} />

      {/* NAV */}
      <nav style={{ boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.07)' : 'none' }}>
        <div className="nav-inner">
          <Link href={home} className="nav-logo">
            <div className="logo-mark">
              <CorexLogoMark />
            </div>
            <span className="nav-logo-text">Corex</span>
          </Link>
          <div className="nav-links">
            <a href="#offres">Nos offres</a>
            <a href="#processus">Comment ça marche</a>
            <a href="#saas">SaaS Builder</a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Link
                href="/fr"
                style={{
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: locale === 'fr' ? '#050505' : '#9CA3AF',
                  textDecoration: 'none',
                }}
              >
                FR
              </Link>
              <span style={{ color: '#D1D5DB' }}>|</span>
              <Link
                href="/en"
                style={{
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: locale === 'en' ? '#050505' : '#9CA3AF',
                  textDecoration: 'none',
                }}
              >
                EN
              </Link>
            </div>
          </div>
          <Link href={booking} className="nav-cta">
            Prendre un rendez-vous →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-dots" />
        <div className="hero-inner">
          <div>
            <div className="hero-badge">
              <span className="badge-dot" />
              Votre partenaire tech
            </div>
            <h1>
              Your tech partner,
              <br />
              <em>from day one.</em>
            </h1>
            <p className="hero-desc">
              Nous digitalisons vos opérations et transformons vos idées en produits SaaS. Une seule équipe, deux expertises, des résultats concrets.
            </p>
            <div className="hero-actions">
              <a href="#offres" className="btn-primary">
                Découvrir nos offres →
              </a>
              <Link href={booking} className="btn-secondary">
                Prendre un RV
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-value-card hvc-main">
              <div className="hvc-tag">Ce qu&apos;on fait</div>
              <h3>Deux offres, zéro compromis.</h3>
              <p>Digitalisation d&apos;entreprise ou construction de SaaS — on s&apos;engage à 100% sur votre projet.</p>
            </div>
            <div className="hvc-row" style={{ marginTop: '1rem' }}>
              <div className="hero-value-card hvc-small">
                <h4>Digitalisation</h4>
                <p style={{ fontSize: '0.8rem', marginBottom: '0.6rem' }}>
                  ERP, CRM, e-commerce, automatisations
                </p>
                <div className="service-chips">
                  <span className="s-chip green">ERP</span>
                  <span className="s-chip green">CRM</span>
                  <span className="s-chip">SaaS</span>
                </div>
              </div>
              <div className="hero-value-card hvc-small hvc-dark">
                <h4>SaaS Builder</h4>
                <p style={{ fontSize: '0.8rem', marginBottom: '0.6rem' }}>
                  De l&apos;idée au produit livré
                </p>
                <div className="service-chips">
                  <span className="s-chip" style={{ background: 'rgba(1,234,98,0.12)', color: '#01EA62' }}>MVP</span>
                  <span className="s-chip" style={{ background: 'rgba(1,234,98,0.12)', color: '#01EA62' }}>Design</span>
                  <span className="s-chip" style={{ background: 'rgba(1,234,98,0.12)', color: '#01EA62' }}>Dev</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OFFRES */}
      <section className="offers" id="offres">
        <div className="container">
          <FadeInBlock>
            <div className="section-header">
              <span className="section-label">Nos offres</span>
              <h2>
                Deux expertises,
                <br />
                une seule vision.
              </h2>
              <p>
                Que vous soyez une entreprise qui veut se digitaliser ou un entrepreneur avec une idée de produit, on a la bonne offre pour vous.
              </p>
            </div>
          </FadeInBlock>
          <div className="offers-grid">
            <FadeInBlock>
              <div className="offer-card light">
                <div className="offer-tag">Digitalisation</div>
                <h3>Transformez votre entreprise avec les bons outils.</h3>
                <p>
                  ERP, CRM, e-commerce, sites sur mesure, automatisations — on construit les fondations digitales de votre croissance.
                </p>
                <div className="offer-services">
                  <span className="offer-service">ERP</span>
                  <span className="offer-service">CRM</span>
                  <span className="offer-service">E-commerce</span>
                  <span className="offer-service">Site sur mesure</span>
                  <span className="offer-service">Automatisation</span>
                  <span className="offer-service">Intégrations API</span>
                </div>
                <a href="#processus" className="offer-link">
                  Voir comment ça marche →
                </a>
                <div className="offer-bg-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="50" height="50">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                  </svg>
                </div>
              </div>
            </FadeInBlock>
            <FadeInBlock>
              <div className="offer-card dark">
                <div className="offer-tag">SaaS Builder</div>
                <h3>De l&apos;idée au produit.</h3>
                <p>
                  Vous avez une idée de SaaS ? On la construit avec vous — de la conception au lancement, en passant par le MVP.
                </p>
                <div className="offer-services">
                  <span className="offer-service">Product Design</span>
                  <span className="offer-service">MVP rapide</span>
                  <span className="offer-service">Architecture</span>
                  <span className="offer-service">Développement</span>
                  <span className="offer-service">Lancement</span>
                  <span className="offer-service">Itération</span>
                </div>
                <a href="#saas" className="offer-link">
                  En savoir plus →
                </a>
                <div className="offer-bg-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="50" height="50">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
              </div>
            </FadeInBlock>
          </div>
        </div>
      </section>

      {/* EXEMPLES DIGITALISATION */}
      <section className="exemples-sec" id="exemples-digital">
        <div className="container">
          <FadeInBlock>
            <div className="section-header">
              <span className="section-label">Digitalisation — Exemples de projets</span>
              <h2>
                Ce qu&apos;on peut construire
                <br />
                pour votre secteur.
              </h2>
              <p>
                Des exemples concrets de ce qu&apos;une transformation digitale peut apporter à différents types d&apos;entreprises.
              </p>
            </div>
          </FadeInBlock>
          <div className="ex-grid">
            {EXAMPLES_DIGITAL.map((ex) => (
              <FadeInBlock key={ex.sector}>
                <div className="ex-card">
                  <div className="ex-sector green">{ex.sector}</div>
                  <h4>{ex.title}</h4>
                  <p>{ex.desc}</p>
                  <div className="ex-result">{ex.result}</div>
                </div>
              </FadeInBlock>
            ))}
          </div>
        </div>
      </section>

      {/* EXEMPLES SAAS */}
      <section className="exemples-sec dark-bg" id="exemples-saas">
        <div className="container">
          <FadeInBlock>
            <div className="section-header">
              <span className="section-label" style={{ color: '#01EA62' }}>
                SaaS Builder — Exemples de projets
              </span>
              <h2 style={{ color: '#fff' }}>
                Des idées qu&apos;on peut
                <br />
                transformer en produits.
              </h2>
              <p>
                Exemples de SaaS qu&apos;on peut concevoir et développer avec vous, de zéro à la mise en production.
              </p>
            </div>
          </FadeInBlock>
          <div className="ex-grid">
            {EXAMPLES_SAAS.map((ex) => (
              <FadeInBlock key={ex.sector}>
                <div className="ex-card dark-card">
                  <div className="ex-sector vivid">{ex.sector}</div>
                  <h4>{ex.title}</h4>
                  <p>{ex.desc}</p>
                  <div className="ex-result">{ex.result}</div>
                </div>
              </FadeInBlock>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESSUS */}
      <section className="process-sec" id="processus">
        <div className="container">
          <FadeInBlock>
            <div className="section-header">
              <span className="section-label">Comment ça marche</span>
              <h2>
                Simple, rapide,
                <br />
                structuré.
              </h2>
              <p>Notre processus est conçu pour aller vite sans perdre en qualité.</p>
            </div>
          </FadeInBlock>
          <div className="process-grid">
            {[
              ['01', 'Appel découverte', 'On comprend votre contexte, vos besoins et vos objectifs en 30 minutes.'],
              ['02', 'Proposition', 'On vous présente un plan clair — périmètre, délais, budget.'],
              ['03', 'Développement', 'On construit avec des points de suivi réguliers et une transparence totale.'],
              ['04', 'Livraison', 'Mise en production, formation et support pour assurer la continuité.'],
            ].map(([n, t, d]) => (
              <FadeInBlock key={n}>
                <div className="process-step">
                  <div className="step-num">{n}</div>
                  <h4>{t}</h4>
                  <p>{d}</p>
                </div>
              </FadeInBlock>
            ))}
          </div>
        </div>
      </section>

      {/* WHY COREX */}
      <section className="why-sec">
        <div className="container">
          <FadeInBlock>
            <div className="section-header">
              <span className="section-label" style={{ color: '#01EA62' }}>
                Pourquoi Corex
              </span>
              <h2 style={{ color: '#fff' }}>Ce qui nous différencie.</h2>
            </div>
          </FadeInBlock>
          <div className="why-grid">
            {[
              {
                t: 'Livraison rapide',
                d: 'On itère vite et livre des résultats concrets dès les premières semaines.',
                svg: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
              },
              {
                t: 'Transparence totale',
                d: "Vous voyez tout — l'avancement, les décisions, les blocages. Pas de mauvaises surprises.",
                svg: (
                  <>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4l3 3" />
                  </>
                ),
              },
              {
                t: 'Équipe dédiée',
                d: 'Focalisée sur votre projet uniquement, pas mutualisée entre 10 clients.',
                svg: (
                  <>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                  </>
                ),
              },
              {
                t: 'Expertise technique',
                d: 'Stack moderne, code propre, architecture scalable. On construit pour durer.',
                svg: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
              },
              {
                t: 'Sécurité & souveraineté',
                d: 'Vos données vous appartiennent. Solutions sécurisées et maîtrisées.',
                svg: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
              },
              {
                t: 'Support continu',
                d: "Le projet ne s'arrête pas à la livraison. On reste là pour évoluer avec vous.",
                svg: (
                  <>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </>
                ),
              },
            ].map((it) => (
              <FadeInBlock key={it.t}>
                <div className="why-card">
                  <div className="why-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#01EA62" strokeWidth="2">
                      {it.svg}
                    </svg>
                  </div>
                  <h4>{it.t}</h4>
                  <p>{it.d}</p>
                </div>
              </FadeInBlock>
            ))}
          </div>
        </div>
      </section>

      {/* SAAS */}
      <section className="saas-sec" id="saas">
        <div className="container">
          <div className="saas-inner">
            <div>
              <span className="section-label">SaaS Builder</span>
              <h2>
                De l&apos;idée
                <br />
                au produit.
              </h2>
              <p style={{ marginBottom: '0.5rem' }}>
                Vous avez validé un problème, vous voyez la solution — il vous manque l&apos;équipe tech pour l&apos;exécuter. C&apos;est exactement ce qu&apos;on fait.
              </p>
              <div className="saas-steps" style={{ marginTop: '2rem' }}>
                {[
                  ['1', 'Cadrage produit', "On définit ensemble le périmètre du MVP, les user stories et l'architecture."],
                  ['2', 'Design & prototype', "Maquettes interactives pour valider l'expérience avant de coder."],
                  ['3', 'Développement MVP', "Construction rapide avec les bonnes technologies pour une mise sur marché rapide."],
                  ['4', 'Lancement & itération', 'Mise en production, feedback, amélioration continue.'],
                ].map(([n, t, d]) => (
                  <FadeInBlock key={n}>
                    <div className="saas-step">
                      <div className="saas-num">{n}</div>
                      <div>
                        <h4>{t}</h4>
                        <p>{d}</p>
                      </div>
                    </div>
                  </FadeInBlock>
                ))}
              </div>
            </div>
            <FadeInBlock>
              <div className="saas-visual">
                <p className="vis-label">Progression MVP — exemple</p>
                {[
                  ['Cadrage & Design', 'Semaine 1–2', 100],
                  ['Backend & API', 'Semaine 3–5', 80],
                  ['Frontend', 'Semaine 4–6', 65],
                  ['Tests & QA', 'Semaine 7', 40],
                  ['Lancement', 'Semaine 8', 10],
                ].map(([label, weeks, pct]) => (
                  <div key={label as string} className="prog-item">
                    <div className="prog-lbl">
                      <span>{label}</span>
                      <span>{weeks}</span>
                    </div>
                    <div className="prog-bar">
                      <div className="prog-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
                <div className="tech-row">
                  {['Next.js', 'Supabase', 'React', 'TypeScript', 'Node.js'].map((t) => (
                    <span key={t} className="tech-badge">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </FadeInBlock>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-sec" id="contact">
        <div className="container">
          <h2>Prêt à démarrer ?</h2>
          <p>
            Réservez un appel découverte de 30 minutes. On analyse votre situation et on voit ensemble comment avancer.
          </p>
          <Link href={booking} className="btn-vivid">
            Prendre un rendez-vous →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <div className="footer-inner">
            <div className="footer-brand">
              <Link href={home} className="nav-logo" style={{ display: 'inline-flex', marginBottom: '0.5rem' }}>
                <div className="logo-mark">
                  <CorexLogoMark />
                </div>
                <span className="nav-logo-text" style={{ color: 'white' }}>
                  Corex
                </span>
              </Link>
              <p>Your tech partner, from day one.</p>
            </div>
            <div className="footer-col">
              <h5>Offres</h5>
              <a href="#offres">Digitalisation</a>
              <a href="#saas">SaaS Builder</a>
              <a href="#processus">Notre processus</a>
            </div>
            <div className="footer-col">
              <h5>Entreprise</h5>
              <Link href={`${home}/a-propos`}>À propos</Link>
              <a href="#contact">Contact</a>
            </div>
            <div className="footer-col">
              <h5>Contact</h5>
              <a href="mailto:hello@corex.com">hello@corex.com</a>
              <a href="#contact">Prendre un RV</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Corex. Tous droits réservés.</p>
            <p>
              Fait avec <span>♥</span> par Corex
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

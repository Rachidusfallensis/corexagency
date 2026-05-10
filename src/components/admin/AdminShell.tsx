'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { LOGOS } from '@/lib/assets'
import { ToastProvider } from './Toast'
import NewDispoButton from './NewDispoButton'
import RealtimeNotifications from './RealtimeNotifications'

const PROTO_ADMIN_CSS = `
*{margin:0;padding:0;box-sizing:border-box}
.proto-admin,.proto-admin *{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif}
.proto-admin{
  --gd:#016B2D;--gv:#01EA62;--bk:#050505;--wh:#fff;
  --bg:#0A0A0A;--surface:#111;--surface2:#161616;--surface3:#1C1C1C;
  --border:rgba(255,255,255,0.07);--border2:rgba(255,255,255,0.12);
  --text:rgba(255,255,255,0.9);--text2:rgba(255,255,255,0.5);--text3:rgba(255,255,255,0.25);
  --radius:12px;--radius-lg:18px;
  background:var(--bg);color:var(--text);font-size:14px;
  height:100vh;overflow:hidden;
}

/* LAYOUT */
.proto-admin .app{display:grid;grid-template-columns:220px 1fr;grid-template-rows:1fr;height:100vh}

/* SIDEBAR */
.proto-admin .sidebar{background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;padding:1.25rem 0;overflow-y:auto}
.proto-admin .sidebar-logo{display:flex;align-items:center;gap:9px;padding:0 1.25rem 1.5rem;border-bottom:1px solid var(--border);margin-bottom:1rem;text-decoration:none;color:inherit}
.proto-admin .logo-mark{width:32px;height:32px;background:var(--gd);border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden}
.proto-admin .logo-text{font-size:1rem;font-weight:700;letter-spacing:-0.02em}
.proto-admin .sidebar-section{padding:0 0.75rem;margin-bottom:1.5rem}
.proto-admin .sidebar-section-label{font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text3);padding:0 0.5rem;margin-bottom:0.4rem}
.proto-admin .nav-item{display:flex;align-items:center;gap:10px;padding:0.6rem 0.75rem;border-radius:9px;cursor:pointer;transition:all 0.15s;color:var(--text2);font-size:0.82rem;font-weight:500;position:relative;text-decoration:none}
.proto-admin .nav-item:hover{background:rgba(255,255,255,0.04);color:var(--text)}
.proto-admin .nav-item.active{background:rgba(1,234,98,0.08);color:var(--gv)}
.proto-admin .nav-item svg{flex-shrink:0;opacity:0.7}
.proto-admin .nav-item.active svg{opacity:1}
.proto-admin .nav-badge{margin-left:auto;background:var(--gd);color:var(--gv);font-size:0.65rem;font-weight:700;padding:0.15rem 0.5rem;border-radius:50px;min-width:18px;text-align:center}
.proto-admin .nav-badge.red{background:rgba(239,68,68,0.15);color:#EF4444}
.proto-admin .sidebar-bottom{margin-top:auto;padding:0.75rem;border-top:1px solid var(--border)}
.proto-admin .admin-card{display:flex;align-items:center;gap:10px;padding:0.6rem 0.75rem;border-radius:9px;background:rgba(255,255,255,0.03)}
.proto-admin .admin-avatar{width:30px;height:30px;border-radius:50%;background:var(--gd);display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;color:var(--gv);flex-shrink:0}
.proto-admin .admin-info{flex:1;min-width:0}
.proto-admin .admin-name{font-size:0.78rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.proto-admin .admin-role{font-size:0.68rem;color:var(--text3)}

/* MAIN */
.proto-admin .main{display:flex;flex-direction:column;overflow:hidden}

/* TOPBAR */
.proto-admin .topbar{background:var(--surface);border-bottom:1px solid var(--border);padding:0 1.75rem;height:56px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.proto-admin .topbar-left h1{font-size:1rem;font-weight:600}
.proto-admin .topbar-left p{font-size:0.75rem;color:var(--text3);margin-top:1px}
.proto-admin .topbar-right{display:flex;align-items:center;gap:0.75rem}
.proto-admin .topbar-btn{display:flex;align-items:center;gap:6px;padding:0.45rem 0.9rem;border-radius:8px;font-size:0.78rem;font-weight:600;cursor:pointer;transition:all 0.15s;border:none;text-decoration:none}
.proto-admin .topbar-btn.primary{background:var(--gv);color:var(--bk)}
.proto-admin .topbar-btn.primary:hover{opacity:0.9}
.proto-admin .topbar-btn.secondary{background:rgba(255,255,255,0.05);color:var(--text2);border:1px solid var(--border)}
.proto-admin .topbar-btn.secondary:hover{background:rgba(255,255,255,0.08);color:var(--text)}
.proto-admin .notif-btn{width:34px;height:34px;border-radius:8px;background:rgba(255,255,255,0.05);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;transition:all 0.15s}
.proto-admin .notif-btn:hover{background:rgba(255,255,255,0.08)}
.proto-admin .notif-dot{position:absolute;top:7px;right:7px;width:7px;height:7px;background:#EF4444;border-radius:50%;border:1.5px solid var(--surface)}

/* CONTENT */
.proto-admin .content{flex:1;overflow-y:auto;padding:1.5rem 1.75rem}

/* STATS ROW */
.proto-admin .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.5rem}
.proto-admin .stat-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.25rem}
.proto-admin .stat-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem}
.proto-admin .stat-icon{width:36px;height:36px;border-radius:9px;display:flex;align-items:center;justify-content:center}
.proto-admin .stat-icon.green{background:rgba(1,234,98,0.1)}
.proto-admin .stat-icon.orange{background:rgba(251,146,60,0.1)}
.proto-admin .stat-icon.blue{background:rgba(96,165,250,0.1)}
.proto-admin .stat-icon.purple{background:rgba(167,139,250,0.1)}
.proto-admin .stat-trend{font-size:0.7rem;font-weight:600;padding:0.2rem 0.5rem;border-radius:50px}
.proto-admin .stat-trend.up{background:rgba(1,234,98,0.1);color:var(--gv)}
.proto-admin .stat-trend.neutral{background:rgba(255,255,255,0.06);color:var(--text2)}
.proto-admin .stat-value{font-size:1.6rem;font-weight:800;letter-spacing:-0.03em;line-height:1}
.proto-admin .stat-label{font-size:0.72rem;color:var(--text2);margin-top:0.3rem}

/* MAIN GRID */
.proto-admin .main-grid{display:grid;grid-template-columns:1fr 340px;gap:1.25rem}

/* CARDS / TABLE */
.proto-admin .card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden}
.proto-admin .card-header{padding:1rem 1.25rem;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.proto-admin .card-title{font-size:0.88rem;font-weight:600}
.proto-admin .card-action{font-size:0.75rem;color:var(--gv);cursor:pointer;font-weight:500}
.proto-admin .filters{display:flex;gap:0.5rem;padding:0.75rem 1.25rem;border-bottom:1px solid var(--border);flex-wrap:wrap}
.proto-admin .filter-btn{padding:0.3rem 0.75rem;border-radius:50px;font-size:0.72rem;font-weight:600;cursor:pointer;border:1px solid var(--border);background:transparent;color:var(--text2);transition:all 0.15s}
.proto-admin .filter-btn:hover{border-color:var(--border2);color:var(--text)}
.proto-admin .filter-btn.active{background:rgba(1,234,98,0.1);border-color:rgba(1,234,98,0.3);color:var(--gv)}
.proto-admin table{width:100%;border-collapse:collapse}
.proto-admin th{font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--text3);padding:0.75rem 1.25rem;text-align:left;white-space:nowrap}
.proto-admin td{padding:0.85rem 1.25rem;border-top:1px solid var(--border);vertical-align:middle}
.proto-admin tr:hover td{background:rgba(255,255,255,0.015)}
.proto-admin .res-name{font-weight:600;font-size:0.85rem;margin-bottom:2px}
.proto-admin .res-email{font-size:0.72rem;color:var(--text2)}
.proto-admin .res-service{display:inline-flex;align-items:center;gap:5px;font-size:0.72rem;font-weight:600;padding:0.2rem 0.6rem;border-radius:50px}
.proto-admin .res-service.digital{background:rgba(96,165,250,0.1);color:#60A5FA}
.proto-admin .res-service.saas{background:rgba(167,139,250,0.1);color:#A78BFA}
.proto-admin .res-service.other{background:rgba(255,255,255,0.06);color:var(--text2)}
.proto-admin .status-badge{display:inline-flex;align-items:center;gap:5px;font-size:0.72rem;font-weight:600;padding:0.2rem 0.65rem;border-radius:50px;white-space:nowrap}
.proto-admin .status-badge::before{content:'';width:5px;height:5px;border-radius:50%;flex-shrink:0}
.proto-admin .status-badge.pending{background:rgba(251,191,36,0.1);color:#FBBF24}.proto-admin .status-badge.pending::before{background:#FBBF24}
.proto-admin .status-badge.confirmed{background:rgba(1,234,98,0.1);color:var(--gv)}.proto-admin .status-badge.confirmed::before{background:var(--gv)}
.proto-admin .status-badge.cancelled{background:rgba(239,68,68,0.1);color:#EF4444}.proto-admin .status-badge.cancelled::before{background:#EF4444}
.proto-admin .status-badge.waiting{background:rgba(156,163,175,0.1);color:#9CA3AF}.proto-admin .status-badge.waiting::before{background:#9CA3AF}
.proto-admin .status-badge.invited{background:rgba(96,165,250,0.1);color:#60A5FA}.proto-admin .status-badge.invited::before{background:#60A5FA}
.proto-admin .status-badge.converted{background:rgba(1,234,98,0.1);color:var(--gv)}.proto-admin .status-badge.converted::before{background:var(--gv)}
.proto-admin .status-badge.rejected{background:rgba(239,68,68,0.1);color:#EF4444}.proto-admin .status-badge.rejected::before{background:#EF4444}
.proto-admin .status-badge.new{background:rgba(96,165,250,0.1);color:#60A5FA}.proto-admin .status-badge.new::before{background:#60A5FA}
.proto-admin .action-btns{display:flex;gap:0.4rem}
.proto-admin .action-btn{padding:0.3rem 0.65rem;border-radius:7px;font-size:0.72rem;font-weight:600;cursor:pointer;border:none;transition:all 0.15s;white-space:nowrap}
.proto-admin .action-btn.confirm{background:rgba(1,234,98,0.1);color:var(--gv)}.proto-admin .action-btn.confirm:hover{background:rgba(1,234,98,0.2)}
.proto-admin .action-btn.cancel{background:rgba(239,68,68,0.08);color:#EF4444}.proto-admin .action-btn.cancel:hover{background:rgba(239,68,68,0.15)}
.proto-admin .action-btn.view{background:rgba(255,255,255,0.05);color:var(--text2)}.proto-admin .action-btn.view:hover{background:rgba(255,255,255,0.08);color:var(--text)}
.proto-admin .action-btn.invite{background:rgba(1,234,98,0.1);color:var(--gv)}.proto-admin .action-btn.invite:hover{background:rgba(1,234,98,0.2)}
.proto-admin .res-date{font-size:0.8rem;color:var(--text2);white-space:nowrap}

/* SIDE STACK */
.proto-admin .side-stack{display:flex;flex-direction:column;gap:1.25rem}
.proto-admin .upcoming-list{padding:0 1.25rem 1.25rem;display:flex;flex-direction:column;gap:0.6rem}
.proto-admin .upcoming-item{display:flex;align-items:center;gap:0.75rem;padding:0.7rem;border-radius:10px;background:var(--surface2);border:1px solid var(--border)}
.proto-admin .upcoming-time{text-align:center;min-width:40px}
.proto-admin .upcoming-time .time{font-size:0.75rem;font-weight:700;color:var(--gv)}
.proto-admin .upcoming-time .date{font-size:0.62rem;color:var(--text3)}
.proto-admin .upcoming-info{flex:1;min-width:0}
.proto-admin .upcoming-name{font-size:0.78rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.proto-admin .upcoming-service{font-size:0.68rem;color:var(--text2)}
.proto-admin .upcoming-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.proto-admin .upcoming-dot.digital{background:#60A5FA}
.proto-admin .upcoming-dot.saas{background:#A78BFA}

/* MODAL */
.proto-admin .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);z-index:100;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity 0.2s}
.proto-admin .modal-overlay.open{opacity:1;pointer-events:all}
.proto-admin .modal{background:var(--surface);border:1px solid var(--border2);border-radius:20px;width:460px;max-width:90vw;overflow:hidden;transform:scale(0.95);transition:transform 0.2s}
.proto-admin .modal-overlay.open .modal{transform:scale(1)}
.proto-admin .modal-header{padding:1.25rem 1.5rem;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.proto-admin .modal-header h3{font-size:0.95rem;font-weight:700}
.proto-admin .modal-close{width:28px;height:28px;border-radius:7px;background:rgba(255,255,255,0.05);border:none;color:var(--text2);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.15s}
.proto-admin .modal-close:hover{background:rgba(255,255,255,0.1);color:var(--text)}
.proto-admin .modal-body{padding:1.5rem}
.proto-admin .modal-field{margin-bottom:1.1rem}
.proto-admin .modal-field label{display:block;font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--text2);margin-bottom:0.4rem}
.proto-admin .modal-field textarea,.proto-admin .modal-field select,.proto-admin .modal-field input{width:100%;background:rgba(255,255,255,0.04);border:1.5px solid var(--border);border-radius:10px;padding:0.75rem 1rem;color:var(--text);font-size:0.85rem;font-family:inherit;outline:none;transition:border-color 0.2s;resize:none}
.proto-admin .modal-field textarea:focus,.proto-admin .modal-field select:focus,.proto-admin .modal-field input:focus{border-color:rgba(1,234,98,0.4)}
.proto-admin .toggle-row{display:flex;align-items:center;justify-content:space-between;padding:0.85rem 1rem;background:rgba(255,255,255,0.03);border-radius:10px;border:1px solid var(--border)}
.proto-admin .toggle-row span{font-size:0.82rem;font-weight:500}
.proto-admin .toggle{position:relative;width:38px;height:22px;display:inline-block}
.proto-admin .toggle input{opacity:0;width:0;height:0;position:absolute}
.proto-admin .toggle-slider{position:absolute;inset:0;background:rgba(255,255,255,0.1);border-radius:50px;cursor:pointer;transition:all 0.2s}
.proto-admin .toggle-slider::before{content:'';position:absolute;width:16px;height:16px;left:3px;top:3px;background:#fff;border-radius:50%;transition:all 0.2s}
.proto-admin .toggle input:checked+.toggle-slider{background:var(--gd)}
.proto-admin .toggle input:checked+.toggle-slider::before{transform:translateX(16px);background:var(--gv)}
.proto-admin .modal-footer{padding:1rem 1.5rem;border-top:1px solid var(--border);display:flex;gap:0.75rem;justify-content:flex-end}
.proto-admin .modal-btn{padding:0.6rem 1.25rem;border-radius:9px;font-size:0.82rem;font-weight:600;cursor:pointer;border:none;transition:all 0.15s}
.proto-admin .modal-btn.cancel-btn{background:rgba(255,255,255,0.05);color:var(--text2)}.proto-admin .modal-btn.cancel-btn:hover{background:rgba(255,255,255,0.08);color:var(--text)}
.proto-admin .modal-btn.danger{background:rgba(239,68,68,0.1);color:#EF4444}.proto-admin .modal-btn.danger:hover{background:rgba(239,68,68,0.2)}
.proto-admin .modal-btn.success{background:var(--gv);color:var(--bk)}.proto-admin .modal-btn.success:hover{opacity:0.9}

/* DETAIL MODAL */
.proto-admin .detail-section{margin-bottom:1.25rem}
.proto-admin .detail-section h4{font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--text3);margin-bottom:0.6rem}
.proto-admin .detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem}
.proto-admin .detail-item{background:rgba(255,255,255,0.03);border-radius:8px;padding:0.65rem 0.85rem}
.proto-admin .detail-item .key{font-size:0.68rem;color:var(--text3);margin-bottom:2px}
.proto-admin .detail-item .val{font-size:0.82rem;font-weight:500}
.proto-admin .detail-note{background:rgba(255,255,255,0.03);border-radius:8px;padding:0.85rem;font-size:0.82rem;color:var(--text2);line-height:1.6;border-left:2px solid var(--gd)}

/* DISPONIBILITES */
.proto-admin .dispos-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem}
.proto-admin .dispo-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden}
.proto-admin .dispo-header{padding:1rem 1.25rem;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.proto-admin .dispo-title{font-size:0.85rem;font-weight:600}
.proto-admin .add-btn{display:flex;align-items:center;gap:5px;padding:0.3rem 0.75rem;border-radius:7px;background:rgba(1,234,98,0.1);color:var(--gv);font-size:0.72rem;font-weight:600;border:none;cursor:pointer;transition:all 0.15s}
.proto-admin .add-btn:hover{background:rgba(1,234,98,0.18)}
.proto-admin .rule-list{padding:0.75rem}
.proto-admin .rule-item{display:flex;align-items:center;gap:0.75rem;padding:0.7rem 0.85rem;border-radius:9px;background:var(--surface2);border:1px solid var(--border);margin-bottom:0.5rem}
.proto-admin .rule-days{display:flex;gap:3px}
.proto-admin .rule-day{width:22px;height:22px;border-radius:5px;font-size:0.65rem;font-weight:700;display:flex;align-items:center;justify-content:center;border:none;cursor:pointer;font-family:inherit}
.proto-admin .rule-day.active{background:rgba(1,234,98,0.15);color:var(--gv)}
.proto-admin .rule-day.inactive{background:rgba(255,255,255,0.04);color:var(--text3)}
.proto-admin .rule-info{flex:1}
.proto-admin .rule-time{font-size:0.78rem;font-weight:600}
.proto-admin .rule-sub{font-size:0.68rem;color:var(--text2)}
.proto-admin .rule-del{width:24px;height:24px;border-radius:6px;background:rgba(239,68,68,0.08);border:none;color:#EF4444;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.15s}
.proto-admin .rule-del:hover{background:rgba(239,68,68,0.15)}
.proto-admin .block-item{display:flex;align-items:center;justify-content:space-between;padding:0.7rem 0.85rem;border-radius:9px;background:var(--surface2);border:1px solid rgba(239,68,68,0.15);margin-bottom:0.5rem}
.proto-admin .block-dates{font-size:0.78rem;font-weight:600;color:#EF4444}
.proto-admin .block-reason{font-size:0.68rem;color:var(--text2)}

/* QUEUE */
.proto-admin .queue-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1.25rem}
.proto-admin .queue-stat{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:1rem;text-align:center}
.proto-admin .queue-stat .num{font-size:1.5rem;font-weight:800;color:var(--gv)}
.proto-admin .queue-stat .lbl{font-size:0.72rem;color:var(--text2);margin-top:2px}
.proto-admin .queue-item-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);margin-bottom:0.75rem;overflow:hidden;transition:border-color 0.2s}
.proto-admin .queue-item-card:hover{border-color:var(--border2)}
.proto-admin .queue-item-header{padding:0.85rem 1.25rem;display:flex;align-items:center;justify-content:space-between;cursor:pointer;background:none;border:none;width:100%;color:inherit;font-family:inherit;text-align:left}
.proto-admin .queue-item-left{display:flex;align-items:center;gap:0.85rem}
.proto-admin .queue-rank{width:26px;height:26px;border-radius:7px;background:rgba(255,255,255,0.05);font-size:0.72rem;font-weight:700;display:flex;align-items:center;justify-content:center;color:var(--text2)}
.proto-admin .queue-name{font-size:0.85rem;font-weight:600}
.proto-admin .queue-meta{font-size:0.72rem;color:var(--text2);margin-top:1px}
.proto-admin .urgency-badge{font-size:0.68rem;font-weight:700;padding:0.2rem 0.6rem;border-radius:50px}
.proto-admin .urgency-badge.high{background:rgba(239,68,68,0.1);color:#EF4444}
.proto-admin .urgency-badge.medium{background:rgba(251,191,36,0.1);color:#FBBF24}
.proto-admin .urgency-badge.low{background:rgba(156,163,175,0.1);color:#9CA3AF}
.proto-admin .queue-expand{padding:0 1.25rem 1rem;border-top:1px solid var(--border);background:rgba(255,255,255,0.01)}
.proto-admin .queue-desc{font-size:0.8rem;color:var(--text2);line-height:1.65;margin:0.85rem 0}
.proto-admin .queue-actions{display:flex;gap:0.5rem;margin-top:0.75rem}

/* LEADS */
.proto-admin .leads-filters{display:flex;gap:0.75rem;margin-bottom:1.25rem;flex-wrap:wrap;align-items:center}
.proto-admin .search-input{background:var(--surface);border:1px solid var(--border);border-radius:9px;padding:0.5rem 0.9rem 0.5rem 2.25rem;color:var(--text);font-size:0.82rem;outline:none;transition:border-color 0.2s;width:200px;font-family:inherit}
.proto-admin .search-input:focus{border-color:var(--border2)}
.proto-admin .search-wrap{position:relative}
.proto-admin .search-wrap svg{position:absolute;left:0.7rem;top:50%;transform:translateY(-50%);pointer-events:none;opacity:0.4}
.proto-admin .export-btn{display:flex;align-items:center;gap:6px;padding:0.5rem 0.9rem;border-radius:9px;background:rgba(255,255,255,0.05);border:1px solid var(--border);color:var(--text2);font-size:0.78rem;font-weight:600;cursor:pointer;margin-left:auto;transition:all 0.15s;font-family:inherit}
.proto-admin .export-btn:hover{background:rgba(255,255,255,0.08);color:var(--text)}
.proto-admin .leads-table-wrap{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden}

/* SCROLLBAR */
.proto-admin ::-webkit-scrollbar{width:4px;height:4px}
.proto-admin ::-webkit-scrollbar-track{background:transparent}
.proto-admin ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:2px}

/* MOBILE BOTTOM NAV */
.proto-admin .mobile-bottom-nav{display:none}

@media (max-width: 768px) {
  .proto-admin .app{grid-template-columns:1fr !important}
  .proto-admin .sidebar{display:none !important}
  .proto-admin .main{padding-bottom:70px !important}
  .proto-admin .topbar{padding:0 1rem !important}
  .proto-admin .topbar-left h1{font-size:0.95rem !important}
  .proto-admin .topbar-subtitle{display:none !important}
  .proto-admin .topbar-actions-desktop{display:none !important}
  .proto-admin .mobile-bottom-nav{display:flex !important;position:fixed;bottom:0;left:0;right:0;height:64px;background:#111;border-top:1px solid rgba(255,255,255,0.08);align-items:center;justify-content:space-around;z-index:50;padding:0 0.5rem}
  .proto-admin .mobile-bottom-nav svg{width:20px !important;height:20px !important}
}`

const ICON_BASE = {
  width: 15,
  height: 15,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor' as const,
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function NavIcon({ name }: { name: string }) {
  switch (name) {
    case 'overview':
      return (
        <svg {...ICON_BASE}>
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      )
    case 'reservations':
      return (
        <svg {...ICON_BASE}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    case 'dispos':
      return (
        <svg {...ICON_BASE}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    case 'queue':
      return (
        <svg {...ICON_BASE}>
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      )
    case 'leads':
      return (
        <svg {...ICON_BASE}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
        </svg>
      )
    default:
      return null
  }
}

type AdminShellProps = {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export default function AdminShell({ title, subtitle, children }: AdminShellProps) {
  const locale = useLocale()
  const pathname = usePathname() ?? ''
  const base = `/${locale}/admin`

  const items = [
    { href: base, label: "Vue d'ensemble", icon: 'overview' as const },
    { href: `${base}/reservations`, label: 'Réservations', icon: 'reservations' as const },
    { href: `${base}/disponibilites`, label: 'Disponibilités', icon: 'dispos' as const },
    { href: `${base}/file-attente`, label: "File d'attente", icon: 'queue' as const },
    { href: `${base}/leads`, label: 'Leads', icon: 'leads' as const },
  ]

  return (
    <ToastProvider>
      <div className="proto-admin">
        <style dangerouslySetInnerHTML={{ __html: PROTO_ADMIN_CSS }} />

        <div className="app">
          {/* SIDEBAR */}
          <aside className="sidebar">
            <Link href={base} className="sidebar-logo">
              <div className="logo-mark">
                <Image src={LOGOS.icon} alt="" width={20} height={20} />
              </div>
              <span className="logo-text">Corex Admin</span>
            </Link>

            <div className="sidebar-section">
              <div className="sidebar-section-label">Navigation</div>
              {items.map((it) => {
                const active = it.href === base ? pathname === base : pathname.startsWith(it.href)
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    className={`nav-item${active ? ' active' : ''}`}
                  >
                    <NavIcon name={it.icon} />
                    {it.label}
                  </Link>
                )
              })}
            </div>

            <div className="sidebar-bottom">
              <div className="admin-card">
                <div className="admin-avatar">AD</div>
                <div className="admin-info">
                  <div className="admin-name">Admin Corex</div>
                  <div className="admin-role">Super Admin</div>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN */}
          <main className="main">
            <div className="topbar">
              <div className="topbar-left">
                <h1>{title}</h1>
                {subtitle && <p className="topbar-subtitle">{subtitle}</p>}
              </div>
              <div className="topbar-right">
                <RealtimeNotifications />
                <Link href={`/${locale}`} className="topbar-btn secondary topbar-actions-desktop">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Voir le site
                </Link>
                <span className="topbar-actions-desktop">
                  <NewDispoButton />
                </span>
              </div>
            </div>

            <div className="content">{children}</div>
          </main>
        </div>

        {/* Mobile bottom navigation */}
        <nav className="mobile-bottom-nav">
          {items.map((it) => {
            const active = it.href === base ? pathname === base : pathname.startsWith(it.href)
            const labelMap: Record<string, string> = {
              overview: 'Accueil',
              reservations: 'RV',
              dispos: 'Dispos',
              queue: 'File',
              leads: 'Leads',
            }
            return (
              <Link
                key={it.href}
                href={it.href}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '3px',
                  padding: '0.5rem',
                  textDecoration: 'none',
                  color: active ? '#01EA62' : 'rgba(255,255,255,0.4)',
                  flex: 1,
                }}
              >
                <NavIcon name={it.icon} />
                <span style={{ fontSize: '0.6rem', fontWeight: 600 }}>
                  {labelMap[it.icon]}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>
    </ToastProvider>
  )
}

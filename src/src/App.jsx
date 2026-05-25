import { useState } from "react";

const STATUTS = ["Reçu en Chine", "En transit", "Arrivé Conakry", "En dédouanement", "Disponible", "Livré"];

const STATUT_COLORS = {
  "Reçu en Chine": "#3b82f6",
  "En transit": "#f59e0b",
  "Arrivé Conakry": "#8b5cf6",
  "En dédouanement": "#ef4444",
  "Disponible": "#10b981",
  "Livré": "#6b7280",
};

const TAUX = { USD: 8600, CNY: 1180, GNF: 1 };

const INIT_CLIENTS = [
  { id: 1, nom: "Mamadou Diallo", tel: "224621001122", ville: "Conakry" },
  { id: 2, nom: "Fatoumata Bah", tel: "224622334455", ville: "Kindia" },
  { id: 3, nom: "Ibrahim Sow", tel: "224623556677", ville: "Conakry" },
  { id: 4, nom: "Aissatou Camara", tel: "224624778899", ville: "Conakry" },
];

const INIT_COLIS = [
  { id: 1, clientId: 1, description: "Téléphones Samsung x10", poids: 12, valeur: 800, devise: "USD", statut: "Disponible", lot: "LOT-052", fraisKg: 6, paye: 50000, dateCreation: "2026-04-10" },
  { id: 2, clientId: 2, description: "Vêtements & tissus", poids: 25, valeur: 400, devise: "USD", statut: "En dédouanement", lot: "LOT-052", fraisKg: 6, paye: 0, dateCreation: "2026-04-10" },
  { id: 3, clientId: 3, description: "Accessoires électroniques", poids: 8, valeur: 200, devise: "USD", statut: "En transit", lot: "LOT-053", fraisKg: 6, paye: 0, dateCreation: "2026-04-18" },
  { id: 4, clientId: 4, description: "Cosmétiques", poids: 15, valeur: 300, devise: "USD", statut: "Reçu en Chine", lot: "LOT-053", fraisKg: 6, paye: 0, dateCreation: "2026-04-20" },
  { id: 5, clientId: 1, description: "Chaussures x20 paires", poids: 30, valeur: 600, devise: "USD", statut: "Livré", lot: "LOT-051", fraisKg: 6, paye: 180000, dateCreation: "2026-03-25" },
];

const INIT_LOTS = [
  { id: "LOT-051", vol: "ET-509", dateDepart: "2026-03-22", dateArrivee: "2026-03-25", statut: "Livré", escale: "Addis-Abeba" },
  { id: "LOT-052", vol: "AT-202", dateDepart: "2026-04-08", dateArrivee: "2026-04-12", statut: "En dédouanement", escale: "Casablanca" },
  { id: "LOT-053", vol: "ET-511", dateDepart: "2026-04-20", dateArrivee: "2026-04-24", statut: "En transit", escale: "Addis-Abeba" },
];

const montantDu = (c) => c.poids * c.fraisKg * TAUX[c.devise];
const solde = (c) => montantDu(c) - c.paye;
const formatGNF = (n) => Math.round(n).toLocaleString("fr-FR") + " GNF";

const msgWhatsApp = (colis, client) => {
  if (!client) return "";
  const msgs = {
    "Reçu en Chine": `Bonjour ${client.nom}, votre colis (${colis.description}) a bien été reçu en Chine. Numéro de lot: ${colis.lot}. Merci — DSL Cargo`,
    "En transit": `Bonjour ${client.nom}, votre colis est en transit vers Conakry. Lot: ${colis.lot}. — DSL Cargo`,
    "Arrivé Conakry": `Bonjour ${client.nom}, votre colis est arrivé à Conakry. En cours de dédouanement. Lot: ${colis.lot}. — DSL Cargo`,
    "En dédouanement": `Bonjour ${client.nom}, votre colis est en cours de dédouanement. Nous vous contactons dès qu'il est disponible. — DSL Cargo`,
    "Disponible": `Bonjour ${client.nom}, votre colis (${colis.description}) est DISPONIBLE ! Solde à régler: ${formatGNF(solde(colis))}. — DSL Cargo`,
    "Livré": `Bonjour ${client.nom}, votre colis a été livré. Merci pour votre confiance ! — DSL Cargo`,
  };
  return msgs[colis.statut] || "";
};

const Icon = ({ name, size = 18 }) => {
  const icons = {
    dashboard: "M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 4h2v-2h-2zm0 4h2v-2h-2zm4-4h2v-2h-2zm0 4h2v-2h-2z",
    package: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
    money: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16.93v-1.02c1.07-.2 2-.76 2-1.91 0-1.21-.86-1.75-2.35-2.18-1.18-.34-2.15-.68-2.15-1.71 0-.88.72-1.47 1.85-1.54V9h1v1.59c1 .2 1.65.84 1.67 1.82h-1c-.02-.73-.52-1.32-1.52-1.32-1.01 0-1.65.5-1.65 1.22 0 .69.57 1.06 1.9 1.45 1.58.46 2.61 1.04 2.61 2.44 0 1.27-.92 1.96-2.02 2.14V18h-1v-1.07z",
    plane: "M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z",
    users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
    alert: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01",
    check: "M20 6L9 17l-5-5",
    plus: "M12 5v14M5 12h14",
    search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    whatsapp: "M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l5.08-1.35A9.96 9.96 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z",
    close: "M18 6L6 18M6 6l12 12",
    customs: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
    save: "M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8M7 3v5h8",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={icons[name] || icons.dashboard} />
    </svg>
  );
};

const Badge = ({ statut }) => (
  <span style={{ background: STATUT_COLORS[statut] + "22", color: STATUT_COLORS[statut], border: `1px solid ${STATUT_COLORS[statut]}44`, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{statut}</span>
);

const Modal = ({ title, onClose, children }) => (
  <div style={{ position: "fixed", inset: 0, background: "#000b", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
    <div style={{ background: "#0f1629", border: "1px solid #1e3a5f", borderRadius: 16, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ color: "#e2c97e", fontFamily: "'Playfair Display', serif", margin: 0, fontSize: 18 }}>{title}</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: 4 }}><Icon name="close" /></button>
      </div>
      {children}
    </div>
  </div>
);

const Field = ({ label, children }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: "block", color: "#94a3b8", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 5 }}>{label}</label>
    {children}
  </div>
);

const inputStyle = { width: "100%", background: "#1a2744", border: "1px solid #1e3a5f", borderRadius: 8, padding: "9px 12px", color: "#e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif" };
const Input = (props) => <input {...props} style={{ ...inputStyle, ...props.style }} />;
const Select = ({ value, onChange, children, style }) => <select value={value} onChange={onChange} style={{ ...inputStyle, ...style }}>{children}</select>;
const BtnPrimary = ({ onClick, children, style }) => (
  <button onClick={onClick} style={{ background: "linear-gradient(135deg, #c9a84c, #e2c97e)", color: "#080e1f", border: "none", borderRadius: 8, padding: "10px 18px", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "'DM Sans', sans-serif", ...style }}>{children}</button>
);

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [colis, setColis] = useState(() => { try { return JSON.parse(localStorage.getItem("dsl_colis")) || INIT_COLIS; } catch { return INIT_COLIS; } });
  const [clients, setClients] = useState(() => { try { return JSON.parse(localStorage.getItem("dsl_clients")) || INIT_CLIENTS; } catch { return INIT_CLIENTS; } });
  const [lots, setLots] = useState(() => { try { return JSON.parse(localStorage.getItem("dsl_lots")) || INIT_LOTS; } catch { return INIT_LOTS; } });
  const [modal, setModal] = useState(null);
  const [msgModal, setMsgModal] = useState(null);
  const [search, setSearch] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("Tous");
  const [notification, setNotification] = useState(null);
  const [formColis, setFormColis] = useState({ clientId: "", description: "", poids: "", valeur: "", devise: "USD", lot: "", fraisKg: 6, paye: 0, notes: "" });
  const [formClient, setFormClient] = useState({ nom: "", tel: "", ville: "" });
  const [formLot, setFormLot] = useState({ id: "", vol: "", dateDepart: "", dateArrivee: "", escale: "Addis-Abeba", statut: "En transit" });

  const save = (key, data) => { try { localStorage.setItem(key, JSON.stringify(data)); } catch {} };
  const updateColis = (d) => { setColis(d); save("dsl_colis", d); };
  const updateClients = (d) => { setClients(d); save("dsl_clients", d); };
  const updateLots = (d) => { setLots(d); save("dsl_lots", d); };

  const showNotif = (msg, type = "success") => { setNotification({ msg, type }); setTimeout(() => setNotification(null), 3000); };

  const totalDu = colis.reduce((s, c) => s + montantDu(c), 0);
  const totalPaye = colis.reduce((s, c) => s + c.paye, 0);
  const totalImpaye = totalDu - totalPaye;
  const colisParStatut = STATUTS.reduce((acc, s) => ({ ...acc, [s]: colis.filter(c => c.statut === s).length }), {});
  const alertes = colis.filter(c => ["En dédouanement", "Disponible"].includes(c.statut) && solde(c) > 0);
  const colisFiltres = colis.filter(c => {
    const cl = clients.find(x => x.id === c.clientId);
    const matchSearch = !search || [cl?.nom, c.description, c.lot].some(v => v?.toLowerCase().includes(search.toLowerCase()));
    return matchSearch && (filtreStatut === "Tous" || c.statut === filtreStatut);
  });

  const saveNewColis = () => {
    if (!formColis.clientId || !formColis.description || !formColis.poids) return showNotif("Remplir tous les champs obligatoires", "error");
    const newC = { ...formColis, id: Date.now(), clientId: parseInt(formColis.clientId), poids: parseFloat(formColis.poids), valeur: parseFloat(formColis.valeur) || 0, fraisKg: parseFloat(formColis.fraisKg) || 6, paye: parseFloat(formColis.paye) || 0, statut: "Reçu en Chine", dateCreation: new Date().toISOString().split("T")[0] };
    updateColis([...colis, newC]); setModal(null); showNotif("✓ Colis enregistré");
  };

  const saveNewClient = () => {
    if (!formClient.nom || !formClient.tel) return showNotif("Nom et téléphone requis", "error");
    updateClients([...clients, { ...formClient, id: Date.now() }]); setModal(null); showNotif("✓ Client ajouté");
  };

  const saveNewLot = () => {
    if (!formLot.id || !formLot.vol) return showNotif("Numéro de lot et vol requis", "error");
    updateLots([...lots, { ...formLot }]); setModal(null); showNotif("✓ Lot créé");
  };

  const nav = [
    { key: "dashboard", label: "Accueil", icon: "dashboard" },
    { key: "colis", label: "Colis", icon: "package" },
    { key: "finance", label: "Finances", icon: "money" },
    { key: "vols", label: "Vols", icon: "plane" },
    { key: "clients", label: "Clients", icon: "users" },
    { key: "douane", label: "Douane", icon: "customs" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#080e1f", fontFamily: "'DM Sans', sans-serif", color: "#e2e8f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080e1f; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; }
        button { cursor: pointer; font-family: 'DM Sans', sans-serif; }
        input, select, textarea { font-family: 'DM Sans', sans-serif; }
        .nav-btn:hover { background: #1a2744 !important; }
        .row-hover:hover { background: #1a2744 !important; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: fadeIn 0.3s ease; }
      `}</style>

      {notification && (
        <div style={{ position: "fixed", top: 20, right: 16, zIndex: 2000, background: notification.type === "error" ? "#ef444420" : "#10b98120", border: `1px solid ${notification.type === "error" ? "#ef4444" : "#10b981"}`, color: notification.type === "error" ? "#ef4444" : "#10b981", borderRadius: 10, padding: "10px 18px", fontSize: 14, fontWeight: 600, boxShadow: "0 8px 30px #0006" }}>{notification.msg}</div>
      )}

      <div style={{ background: "#0f1629", borderBottom: "1px solid #1e3a5f", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #c9a84c, #e2c97e)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#080e1f" }}><Icon name="plane" size={18} /></div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "#e2c97e", fontWeight: 700 }}>DSL Cargo</div>
            <div style={{ fontSize: 10, color: "#64748b", letterSpacing: 1.5, textTransform: "uppercase" }}>Chine → Guinée</div>
          </div>
        </div>
        {alertes.length > 0 && <div style={{ background: "#ef444420", border: "1px solid #ef444440", borderRadius: 20, padding: "4px 12px", display: "flex", alignItems: "center", gap: 5, color: "#ef4444", fontSize: 12, fontWeight: 700 }}><Icon name="alert" size={13} /> {alertes.length} alerte{alertes.length > 1 ? "s" : ""}</div>}
      </div>

      <div style={{ background: "#0f1629", borderBottom: "1px solid #1e3a5f", display: "flex", overflowX: "auto", padding: "0 8px" }}>
        {nav.map(n => (
          <button key={n.key} className="nav-btn" onClick={() => setTab(n.key)} style={{ background: "none", border: "none", borderBottom: tab === n.key ? "2px solid #c9a84c" : "2px solid transparent", color: tab === n.key ? "#e2c97e" : "#64748b", padding: "11px 14px", display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: tab === n.key ? 700 : 400, whiteSpace: "nowrap", transition: "all 0.2s" }}>
            <Icon name={n.icon} size={14} /> {n.label}
          </button>
        ))}
      </div>

      <div style={{ padding: 16, maxWidth: 900, margin: "0 auto" }} className="fade-in">

        {tab === "dashboard" && (
          <div>
            <div style={{ marginBottom: 18 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#e2c97e", fontSize: 22, marginBottom: 2 }}>Tableau de Bord</h2>
              <p style={{ color: "#64748b", fontSize: 12 }}>{new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 16 }}>
              {[
                { label: "Total Colis", val: colis.length, icon: "package", color: "#3b82f6" },
                { label: "En Transit", val: colisParStatut["En transit"] || 0, icon: "plane", color: "#f59e0b" },
                { label: "Disponibles", val: colisParStatut["Disponible"] || 0, icon: "check", color: "#10b981" },
                { label: "Impayés", val: formatGNF(totalImpaye), icon: "alert", color: "#ef4444" },
              ].map((k, i) => (
                <div key={i} style={{ background: "#0f1629", border: "1px solid #1e3a5f", borderRadius: 14, padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ color: "#64748b", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>{k.label}</div>
                      <div style={{ color: "#e2e8f0", fontSize: 18, fontWeight: 800 }}>{k.val}</div>
                    </div>
                    <div style={{ background: k.color + "20", color: k.color, borderRadius: 8, padding: 7 }}><Icon name={k.icon} size={16} /></div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: "#0f1629", border: "1px solid #1e3a5f", borderRadius: 14, padding: 16, marginBottom: 14 }}>
              <div style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Pipeline des colis</div>
              <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
                {STATUTS.map(s => (
                  <div key={s} onClick={() => { setTab("colis"); setFiltreStatut(s); }} style={{ flex: 1, minWidth: 70, background: STATUT_COLORS[s] + "15", border: `1px solid ${STATUT_COLORS[s]}30`, borderRadius: 10, padding: "10px 6px", textAlign: "center", cursor: "pointer" }}>
                    <div style={{ color: STATUT_COLORS[s], fontSize: 20, fontWeight: 800 }}>{colisParStatut[s] || 0}</div>
                    <div style={{ color: "#64748b", fontSize: 9, fontWeight: 700, textTransform: "uppercase", marginTop: 3, lineHeight: 1.3 }}>{s}</div>
                  </div>
                ))}
              </div>
            </div>
            {alertes.length > 0 && (
              <div style={{ background: "#ef444410", border: "1px solid #ef444430", borderRadius: 14, padding: 16, marginBottom: 14 }}>
                <div style={{ color: "#ef4444", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}><Icon name="alert" size={14} /> Alertes — Impayés urgents</div>
                {alertes.map(c => {
                  const cl = clients.find(x => x.id === c.clientId);
                  return (
                    <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #1e3a5f20" }}>
                      <div>
                        <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600 }}>{cl?.nom}</div>
                        <div style={{ color: "#64748b", fontSize: 11 }}>{c.description}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color: "#ef4444", fontWeight: 700, fontSize: 13 }}>{formatGNF(solde(c))}</span>
                        <a href={`https://wa.me/${cl?.tel}?text=${encodeURIComponent(msgWhatsApp(c, cl))}`} target="_blank" rel="noreferrer" style={{ background: "#25D36620", border: "1px solid #25D36640", color: "#25D366", borderRadius: 6, padding: "4px 8px", fontSize: 11, textDecoration: "none", fontWeight: 600 }}>WA</a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ background: "#0f1629", border: "1px solid #1e3a5f", borderRadius: 14, padding: 16 }}>
              <div style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Résumé Financier</div>
              {[
                { label: "Facturation totale", val: totalDu, color: "#e2e8f0" },
                { label: "Total encaissé", val: totalPaye, color: "#10b981" },
                { label: "Reste à recevoir", val: totalImpaye, color: "#ef4444" },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: i < 2 ? "1px solid #1e3a5f" : "none" }}>
                  <span style={{ color: "#94a3b8", fontSize: 13 }}>{r.label}</span>
                  <span style={{ color: r.color, fontWeight: 700, fontSize: 14 }}>{formatGNF(r.val)}</span>
                </div>
              ))}
              <div style={{ marginTop: 12 }}>
                <div style={{ height: 6, background: "#1e3a5f", borderRadius: 6, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${totalDu > 0 ? (totalPaye / totalDu * 100) : 0}%`, background: "linear-gradient(90deg, #c9a84c, #10b981)", borderRadius: 6 }} />
                </div>
                <div style={{ color: "#64748b", fontSize: 11, marginTop: 5, textAlign: "right" }}>Recouvrement: <strong style={{ color: "#e2c97e" }}>{totalDu > 0 ? (totalPaye / totalDu * 100).toFixed(0) : 0}%</strong></div>
              </div>
            </div>
          </div>
        )}

        {tab === "colis" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#e2c97e", fontSize: 22 }}>Colis & Lots</h2>
              <BtnPrimary onClick={() => { setFormColis({ clientId: "", description: "", poids: "", valeur: "", devise: "USD", lot: "", fraisKg: 6, paye: 0, notes: "" }); setModal("colis"); }}><Icon name="plus" size={15} /> Nouveau</BtnPrimary>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 150, position: "relative" }}>
                <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#64748b", pointerEvents: "none" }}><Icon name="search" size={15} /></div>
                <Input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 34 }} />
              </div>
              <Select value={filtreStatut} onChange={e => setFiltreStatut(e.target.value)} style={{ flex: 1, minWidth: 130 }}>
                <option value="Tous">Tous</option>
                {STATUTS.map(s => <option key={s}>{s}</option>)}
              </Select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {colisFiltres.map(c => {
                const cl = clients.find(x => x.id === c.clientId);
                const rest = solde(c);
                return (
                  <div key={c.id} className="row-hover" style={{ background: "#0f1629", border: "1px solid #1e3a5f", borderRadius: 12, padding: 14, transition: "background 0.15s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4, flexWrap: "wrap" }}>
                          <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 14 }}>{cl?.nom || "?"}</span>
                          <Badge statut={c.statut} />
                        </div>
                        <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 2 }}>{c.description}</div>
                        <div style={{ color: "#64748b", fontSize: 11 }}>{c.lot} · {c.poids} kg · {c.dateCreation}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ color: rest > 0 ? "#ef4444" : "#10b981", fontWeight: 700, fontSize: 13 }}>{rest > 0 ? `Doit: ${formatGNF(rest)}` : "✓ Soldé"}</div>
                        <div style={{ color: "#64748b", fontSize: 11 }}>{formatGNF(montantDu(c))}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap", alignItems: "center" }}>
                      <Select value={c.statut} onChange={e => { const d = colis.map(x => x.id === c.id ? { ...x, statut: e.target.value } : x); updateColis(d); }} style={{ flex: 1, minWidth: 130, fontSize: 12, padding: "6px 10px" }}>
                        {STATUTS.map(s => <option key={s}>{s}</option>)}
                      </Select>
                      <button onClick={() => setMsgModal({ colis: c, client: cl })} style={{ background: "#25D36620", border: "1px solid #25D36640", color: "#25D366", borderRadius: 8, padding: "6px 10px", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><Icon name="whatsapp" size={13} /> WA</button>
                      <button onClick={() => { updateColis(colis.filter(x => x.id !== c.id)); showNotif("Colis supprimé"); }} style={{ background: "#ef444415", border: "1px solid #ef444430", color: "#ef4444", borderRadius: 8, padding: "6px 8px", display: "flex", alignItems: "center" }}><Icon name="trash" size={13} /></button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, background: "#1a2744", borderRadius: 8, padding: "6px 10px" }}>
                      <span style={{ color: "#64748b", fontSize: 11, flexShrink: 0 }}>Payé:</span>
                      <input type="number" value={c.paye} onChange={e => { const d = colis.map(x => x.id === c.id ? { ...x, paye: parseFloat(e.target.value) || 0 } : x); updateColis(d); }} style={{ background: "none", border: "none", color: "#10b981", fontWeight: 700, fontSize: 13, flex: 1, outline: "none", minWidth: 80 }} />
                      <span style={{ color: "#64748b", fontSize: 11 }}>GNF</span>
                    </div>
                  </div>
                );
              })}
              {colisFiltres.length === 0 && <div style={{ textAlign: "center", color: "#64748b", padding: 40, background: "#0f1629", borderRadius: 14, border: "1px solid #1e3a5f" }}>Aucun colis trouvé</div>}
            </div>
          </div>
        )}

        {tab === "finance" && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#e2c97e", fontSize: 22, marginBottom: 16 }}>Comptabilité</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginBottom: 16 }}>
              {[
                { label: "Facturation totale", val: formatGNF(totalDu), color: "#e2e8f0" },
                { label: "Total encaissé", val: formatGNF(totalPaye), color: "#10b981" },
                { label: "Impayés", val: formatGNF(totalImpaye), color: "#ef4444" },
                { label: "Recouvrement", val: `${totalDu > 0 ? (totalPaye / totalDu * 100).toFixed(0) : 0}%`, color: "#f59e0b" },
              ].map((k, i) => (
                <div key={i} style={{ background: "#0f1629", border: "1px solid #1e3a5f", borderRadius: 14, padding: 14 }}>
                  <div style={{ color: "#64748b", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>{k.label}</div>
                  <div style={{ color: k.color, fontSize: 16, fontWeight: 800 }}>{k.val}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "#0f1629", border: "1px solid #1e3a5f", borderRadius: 14, padding: 16 }}>
              <div style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Détail par client</div>
              {clients.map(cl => {
                const mc = colis.filter(c => c.clientId === cl.id);
                if (!mc.length) return null;
                const totalCl = mc.reduce((s, c) => s + montantDu(c), 0);
                const resteCl = totalCl - mc.reduce((s, c) => s + c.paye, 0);
                return (
                  <div key={cl.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #1e3a5f" }}>
                    <div>
                      <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 14 }}>{cl.nom}</div>
                      <div style={{ color: "#64748b", fontSize: 11 }}>{mc.length} colis</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: resteCl > 0 ? "#ef4444" : "#10b981", fontWeight: 700, fontSize: 13 }}>{resteCl > 0 ? `Doit ${formatGNF(resteCl)}` : "✓ Soldé"}</div>
                      <div style={{ color: "#64748b", fontSize: 11 }}>/{formatGNF(totalCl)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "vols" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#e2c97e", fontSize: 22 }}>Vols & Lots</h2>
              <BtnPrimary onClick={() => { setFormLot({ id: "", vol: "", dateDepart: "", dateArrivee: "", escale: "Addis-Abeba", statut: "En transit" }); setModal("lot"); }}><Icon name="plus" size={15} /> Nouveau lot</BtnPrimary>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {lots.map(lot => {
                const nColis = colis.filter(c => c.lot === lot.id).length;
                const idxStatut = STATUTS.indexOf(lot.statut);
                return (
                  <div key={lot.id} style={{ background: "#0f1629", border: "1px solid #1e3a5f", borderRadius: 14, padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <span style={{ fontFamily: "'Playfair Display', serif", color: "#e2c97e", fontSize: 16, fontWeight: 700 }}>{lot.id}</span>
                          <Badge statut={lot.statut} />
                        </div>
                        <div style={{ color: "#94a3b8", fontSize: 13 }}>Vol: <strong style={{ color: "#e2e8f0" }}>{lot.vol}</strong> · {lot.escale}</div>
                        <div style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>{lot.dateDepart} → {lot.dateArrivee}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ color: "#3b82f6", fontWeight: 800, fontSize: 22 }}>{nColis}</div>
                        <div style={{ color: "#64748b", fontSize: 11 }}>colis</div>
                      </div>
                    </div>
                    <div style={{ marginTop: 14, display: "flex", gap: 3 }}>
                      {STATUTS.map((s, i) => (
                        <div key={s} style={{ flex: 1 }}>
                          <div style={{ height: 4, background: i <= idxStatut ? "#c9a84c" : "#1e3a5f", borderRadius: 2, marginBottom: 4 }} />
                          <div style={{ color: i <= idxStatut ? "#c9a84c" : "#64748b", fontSize: 8, textAlign: "center" }}>{s.split(" ")[0]}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "clients" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#e2c97e", fontSize: 22 }}>Clients ({clients.length})</h2>
              <BtnPrimary onClick={() => { setFormClient({ nom: "", tel: "", ville: "" }); setModal("client"); }}><Icon name="plus" size={15} /> Nouveau</BtnPrimary>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {clients.map(cl => {
                const mc = colis.filter(c => c.clientId === cl.id);
                const totalCl = mc.reduce((s, c) => s + montantDu(c), 0);
                const resteCl = totalCl - mc.reduce((s, c) => s + c.paye, 0);
                return (
                  <div key={cl.id} style={{ background: "#0f1629", border: "1px solid #1e3a5f", borderRadius: 12, padding: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{cl.nom}</div>
                        <div style={{ color: "#64748b", fontSize: 12 }}>📞 {cl.tel} {cl.ville && `· 📍 ${cl.ville}`}</div>
                        <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>{mc.length} colis</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ color: resteCl > 0 ? "#ef4444" : "#10b981", fontWeight: 700, fontSize: 13 }}>{resteCl > 0 ? formatGNF(resteCl) : "✓ Soldé"}</div>
                        {resteCl > 0 && <div style={{ color: "#64748b", fontSize: 10 }}>impayé</div>}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                      <a href={`https://wa.me/${cl.tel}`} target="_blank" rel="noreferrer" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: "#25D36620", border: "1px solid #25D36640", color: "#25D366", borderRadius: 8, padding: "7px", fontSize: 12, fontWeight: 600, textDecoration: "none" }}><Icon name="whatsapp" size={14} /> WhatsApp</a>
                      <button onClick={() => { setTab("colis"); setSearch(cl.nom); }} style={{ flex: 1, background: "#3b82f620", border: "1px solid #3b82f640", color: "#3b82f6", borderRadius: 8, padding: "7px", fontSize: 12, fontWeight: 600 }}>Voir colis</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "douane" && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#e2c97e", fontSize: 22, marginBottom: 16 }}>Suivi Douane</h2>
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: "#ef4444", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}><Icon name="alert" size={13} /> En dédouanement ({colis.filter(c => c.statut === "En dédouanement").length})</div>
              {colis.filter(c => c.statut === "En dédouanement").map(c => {
                const cl = clients.find(x => x.id === c.clientId);
                return (
                  <div key={c.id} style={{ background: "#ef444410", border: "1px solid #ef444430", borderRadius: 12, padding: 14, marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                      <div>
                        <div style={{ color: "#e2e8f0", fontWeight: 700 }}>{cl?.nom}</div>
                        <div style={{ color: "#94a3b8", fontSize: 12 }}>{c.description} · {c.poids} kg</div>
                        <div style={{ color: "#64748b", fontSize: 11 }}>Valeur: {c.valeur} {c.devise}</div>
                      </div>
                      <button onClick={() => { const d = colis.map(x => x.id === c.id ? { ...x, statut: "Disponible" } : x); updateColis(d); showNotif("✓ Colis libéré"); }} style={{ background: "#10b98120", border: "1px solid #10b98140", color: "#10b981", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, alignSelf: "center" }}>✓ Libéré</button>
                    </div>
                    <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {["Facture", "Colisage", "Cert. Origine", "AWB"].map(doc => (
                        <span key={doc} style={{ background: "#1a2744", border: "1px solid #1e3a5f", borderRadius: 20, padding: "3px 10px", fontSize: 11, color: "#94a3b8" }}>✓ {doc}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
              {colis.filter(c => c.statut === "En dédouanement").length === 0 && <div style={{ background: "#0f1629", border: "1px solid #1e3a5f", borderRadius: 12, padding: 20, textAlign: "center", color: "#64748b" }}>Aucun colis en dédouanement</div>}
            </div>
            <div style={{ background: "#0f1629", border: "1px solid #1e3a5f", borderRadius: 14, padding: 16 }}>
              <div style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Documents requis</div>
              {[
                { doc: "Facture commerciale", desc: "Valeur + description + vendeur/acheteur" },
                { doc: "Liste de colisage", desc: "Poids, dimensions, contenu détaillé" },
                { doc: "Certificat d'origine", desc: "Prouve la fabrication en Chine" },
                { doc: "Lettre de transport (AWB)", desc: "Numéro de suivi aérien" },
                { doc: "Procuration D.T.L", desc: "Pour dédouanement par agent agréé" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: i < 4 ? "1px solid #1e3a5f" : "none" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9a84c", marginTop: 5, flexShrink: 0 }} />
                  <div>
                    <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600 }}>{item.doc}</div>
                    <div style={{ color: "#64748b", fontSize: 11 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {modal === "colis" && (
        <Modal title="Nouveau Colis" onClose={() => setModal(null)}>
          <Field label="Client *"><Select value={formColis.clientId} onChange={e => setFormColis(p => ({ ...p, clientId: e.target.value }))}><option value="">— Sélectionner —</option>{clients.map(cl => <option key={cl.id} value={cl.id}>{cl.nom}</option>)}</Select></Field>
          <Field label="Description *"><Input value={formColis.description} onChange={e => setFormColis(p => ({ ...p, description: e.target.value }))} placeholder="Ex: Téléphones Samsung x5" /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Poids (kg) *"><Input type="number" value={formColis.poids} onChange={e => setFormColis(p => ({ ...p, poids: e.target.value }))} /></Field>
            <Field label="Valeur déclarée"><Input type="number" value={formColis.valeur} onChange={e => setFormColis(p => ({ ...p, valeur: e.target.value }))} /></Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Devise"><Select value={formColis.devise} onChange={e => setFormColis(p => ({ ...p, devise: e.target.value }))}><option>USD</option><option>CNY</option><option>GNF</option></Select></Field>
            <Field label="Frais/kg (USD)"><Input type="number" value={formColis.fraisKg} onChange={e => setFormColis(p => ({ ...p, fraisKg: e.target.value }))} /></Field>
          </div>
          <Field label="Lot"><Select value={formColis.lot} onChange={e => setFormColis(p => ({ ...p, lot: e.target.value }))}><option value="">— Sélectionner —</option>{lots.map(l => <option key={l.id} value={l.id}>{l.id}</option>)}</Select></Field>
          <Field label="Montant payé (GNF)"><Input type="number" value={formColis.paye} onChange={e => setFormColis(p => ({ ...p, paye: e.target.value }))} placeholder="0" /></Field>
          <Field label="Notes"><textarea value={formColis.notes} onChange={e => setFormColis(p => ({ ...p, notes: e.target.value }))} rows={2} style={{ ...inputStyle, resize: "vertical" }} /></Field>
          {formColis.poids && <div style={{ background: "#1a2744", borderRadius: 8, padding: 10, marginBottom: 14, display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748b", fontSize: 12 }}>Montant estimé:</span><span style={{ color: "#e2c97e", fontWeight: 700 }}>{formatGNF(parseFloat(formColis.poids || 0) * parseFloat(formColis.fraisKg || 0) * (TAUX[formColis.devise] || 1))}</span></div>}
          <BtnPrimary onClick={saveNewColis} style={{ width: "100%", justifyContent: "center", padding: 12 }}><Icon name="save" size={16} /> Enregistrer</BtnPrimary>
        </Modal>
      )}

      {modal === "client" && (
        <Modal title="Nouveau Client" onClose={() => setModal(null)}>
          <Field label="Nom complet *"><Input value={formClient.nom} onChange={e => setFormClient(p => ({ ...p, nom: e.target.value }))} /></Field>
          <Field label="Téléphone WhatsApp *"><Input value={formClient.tel} onChange={e => setFormClient(p => ({ ...p, tel: e.target.value }))} placeholder="224XXXXXXXXX" /></Field>
          <Field label="Ville"><Input value={formClient.ville} onChange={e => setFormClient(p => ({ ...p, ville: e.target.value }))} /></Field>
          <BtnPrimary onClick={saveNewClient} style={{ width: "100%", justifyContent: "center", padding: 12 }}><Icon name="save" size={16} /> Enregistrer</BtnPrimary>
        </Modal>
      )}

      {modal === "lot" && (
        <Modal title="Nouveau Lot" onClose={() => setModal(null)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="N° Lot *"><Input value={formLot.id} onChange={e => setFormLot(p => ({ ...p, id: e.target.value }))} placeholder="LOT-054" /></Field>
            <Field label="N° Vol *"><Input value={formLot.vol} onChange={e => setFormLot(p => ({ ...p, vol: e.target.value }))} placeholder="ET-511" /></Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Date départ"><Input type="date" value={formLot.dateDepart} onChange={e => setFormLot(p => ({ ...p, dateDepart: e.target.value }))} /></Field>
            <Field label="Date arrivée"><Input type="date" value={formLot.dateArrivee} onChange={e => setFormLot(p => ({ ...p, dateArrivee: e.target.value }))} /></Field>
          </div>
          <Field label="Escale"><Select value={formLot.escale} onChange={e => setFormLot(p => ({ ...p, escale: e.target.value }))}>{["Addis-Abeba", "Casablanca", "Dubaï", "Paris", "Direct"].map(e => <option key={e}>{e}</option>)}</Select></Field>
          <BtnPrimary onClick={saveNewLot} style={{ width: "100%", justifyContent: "center", padding: 12 }}><Icon name="save" size={16} /> Créer le lot</BtnPrimary>
        </Modal>
      )}

      {msgModal && (
        <Modal title={`Message — ${msgModal.client?.nom}`} onClose={() => setMsgModal(null)}>
          <div style={{ background: "#1a2744", borderRadius: 10, padding: 14, marginBottom: 16 }}>
            <div style={{ color: "#64748b", fontSize: 11, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>Message automatique</div>
            <p style={{ color: "#e2e8f0", fontSize: 14, margin: 0, lineHeight: 1.7 }}>{msgWhatsApp(msgModal.colis, msgModal.client)}</p>
          </div>
          <a href={`https://wa.me/${msgModal.client?.tel}?text=${encodeURIComponent(msgWhatsApp(msgModal.colis, msgModal.client))}`} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "linear-gradient(135deg, #25D366, #128C7E)", color: "white", borderRadius: 8, padding: 12, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
            <Icon name="whatsapp" size={18} /> Envoyer sur WhatsApp
          </a>
        </Modal>
      )}
    </div>
  );
}

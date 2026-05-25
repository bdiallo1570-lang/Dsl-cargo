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
    { key: "colis", label: "Colis", icon: "package

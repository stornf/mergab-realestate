import { useState, useEffect } from "react";

const SB_URL = "https://ontnilzksopzrlkflxnc.supabase.co";
const SB_KEY = "sb_publishable_CX8aZRJci63Rr0KB6UaRJQ_GgSQBsWE";
const H = { apikey: SB_KEY, Authorization: "Bearer " + SB_KEY, "Content-Type": "application/json", Prefer: "return=representation" };

async function dbGet(table, extra = "") {
  try { const r = await fetch(`${SB_URL}/rest/v1/${table}?select=*${extra}`, { headers: H }); const d = await r.json(); return r.ok ? d : []; } catch { return []; }
}
async function dbInsert(table, row) {
  try { const r = await fetch(`${SB_URL}/rest/v1/${table}`, { method: "POST", headers: H, body: JSON.stringify(row) }); const d = await r.json(); return r.ok ? (Array.isArray(d) ? d[0] : d) : null; } catch { return null; }
}
async function dbPatch(table, id, col, data) {
  try { await fetch(`${SB_URL}/rest/v1/${table}?${col}=eq.${id}`, { method: "PATCH", headers: H, body: JSON.stringify(data) }); } catch { }
}
async function dbDel(table, id, col = "id") {
  try { await fetch(`${SB_URL}/rest/v1/${table}?${col}=eq.${id}`, { method: "DELETE", headers: H }); } catch { }
}

const fmtN = n => n ? Number(n).toLocaleString("ar-SA") : "—";
const waLink = p => { const c = (p || "").replace(/\D/g, ""); return "https://wa.me/" + (c.startsWith("0") ? "966" + c.slice(1) : c); };

const SC = { "متاح": ["#15803d", "#dcfce7"], "تفاوض": ["#b45309", "#fef3c7"], "مباع": ["#dc2626", "#fee2e2"], "مؤجر": ["#2563eb", "#dbeafe"] };
const RC = { "معلق": ["#b45309", "#fef3c7"], "مقبول": ["#15803d", "#dcfce7"], "مرفوض": ["#dc2626", "#fee2e2"] };
const ACCENTS = ["#B8902A", "#dc2626", "#2563eb", "#7c3aed", "#15803d", "#0891b2", "#db2777"];
const CITIES = ["الرياض", "جدة", "الدمام", "مكة المكرمة", "المدينة المنورة", "الطائف", "أبها", "تبوك"];

const SO = [
  { id: 1, code: "M-001", type: "فيلا", deal: "بيع", city: "الرياض", district: "الملقا", floor: "أرضي+أول", rooms: 5, baths: 4, area: 400, price: 1800000, comm: 45000, pay: "تحويل", status: "متاح", owner_name: "فهد العتيبي", owner_phone: "0501234567", direction: "شمال", furnished: "نعم", details: "فيلا راقية بحديقة" },
  { id: 2, code: "M-002", type: "شقة", deal: "إيجار", city: "الرياض", district: "الياسمين", floor: "ثالث", rooms: 3, baths: 2, area: 150, price: 45000, comm: 2250, pay: "شيك", status: "متاح", owner_name: "سلطان الشمري", owner_phone: "0557654321", direction: "شرق", furnished: "لا", details: "شقة نظيفة مجددة" },
  { id: 3, code: "M-003", type: "أرض", deal: "بيع", city: "جدة", district: "النزهة", floor: "—", rooms: 0, baths: 0, area: 600, price: 2200000, comm: 55000, pay: "تحويل", status: "تفاوض", owner_name: "محمد الزهراني", owner_phone: "0544332211", direction: "جنوب", furnished: "—", details: "أرض سكنية شارعين" },
  { id: 4, code: "M-004", type: "فيلا", deal: "بيع", city: "الدمام", district: "العقربية", floor: "أرضي", rooms: 4, baths: 3, area: 350, price: 1200000, comm: 30000, pay: "تحويل", status: "مباع", owner_name: "خالد المطيري", owner_phone: "0533221100", direction: "غرب", furnished: "لا", details: "فيلا جاهزة للسكن" },
];
const SOW = [
  { code: "OWN-001", name: "فهد العتيبي", phone: "0501234567", city: "الرياض" },
  { code: "OWN-002", name: "سلطان الشمري", phone: "0557654321", city: "الرياض" },
  { code: "OWN-003", name: "محمد الزهراني", phone: "0544332211", city: "جدة" },
];
const SCL = [
  { code: "CL-001", name: "أحمد الرشيدي", phone: "0500112233", city: "الرياض", req_type: "شراء", property_type: "فيلا", budget_from: 1000000, budget_to: 2000000, closed: false },
  { code: "CL-002", name: "نورة القحطاني", phone: "0551122334", city: "جدة", req_type: "إيجار", property_type: "شقة", budget_from: 30000, budget_to: 60000, closed: false },
];
const SR = [
  { id: 1, name: "بندر الحربي", phone: "0506789012", city: "الرياض", type: "فيلا", deal: "بيع", district: "النرجس", area: 380, price: 1600000, details: "فيلا حديثة", status: "معلق" },
  { id: 2, name: "هنوف السلطان", phone: "0569012345", city: "مكة المكرمة", type: "شقة", deal: "إيجار", district: "العزيزية", area: 140, price: 40000, details: "شقة مفروشة", status: "مقبول" },
];

export default function App() {
  const [auth, setAuth] = useState(false);
  const [page, setPage] = useState("home");
  const [dark, setDark] = useState(false);
  const [accent, setAccent] = useState("#B8902A");
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [conn, setConn] = useState(false);
  const [offers, setOffers] = useState(SO);
  const [owners, setOwners] = useState(SOW);
  const [clients, setClients] = useState(SCL);
  const [reqs, setReqs] = useState(SR);

  const G = accent;
  const C = {
    bg: dark ? "#09090e" : "#f0efe8", card: dark ? "#0e0e14" : "#fff",
    card2: dark ? "#131319" : "#f7f6f1", txt: dark ? "#eeeef8" : "#18181f",
    sub: dark ? "#7070a0" : "#888896", bdr: dark ? "#1e1e2e" : "#e2e2d8",
  };

  const toast$ = (msg, type = "ok") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3200); };
  const closeModal = () => setModal(null);

  const loadData = async () => {
    const [o, ow, cl, rq] = await Promise.all([dbGet("offers", "&order=id.desc"), dbGet("owners"), dbGet("clients"), dbGet("owner_requests", "&order=id.desc")]);
    if (o?.length) setOffers(o); if (ow?.length) setOwners(ow);
    if (cl?.length) setClients(cl); if (rq?.length) setReqs(rq);
    setConn(true);
  };
  useEffect(() => { if (auth) loadData(); }, [auth]);

  const inStyle = { width: "100%", padding: "11px 14px", background: C.card2, border: `1.5px solid ${C.bdr}`, borderRadius: 12, color: C.txt, fontSize: 14, outline: "none", fontFamily: "inherit" };

  const NAV = [
    { id: "home", ic: "📊", lb: "الرئيسية" },
    { id: "offers", ic: "🏠", lb: "العروض" },
    { id: "clients", ic: "🤝", lb: "العملاء" },
    { id: "requests", ic: "📥", lb: "الطلبات" },
    { id: "settings", ic: "⚙️", lb: "الإعدادات" },
  ];

  const sp = { C, G, inStyle, offers, setOffers, owners, setOwners, clients, setClients, reqs, setReqs, toast$, modal, setModal, closeModal, setPage, conn };

  if (!auth) return <Login G={G} C={C} inStyle={inStyle} offers={offers} onLogin={() => { setAuth(true); setPage("home"); }} />;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Tajawal','Arial',sans-serif", direction: "rtl", color: C.txt }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}input,select,textarea,button{font-family:inherit}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:${C.bdr};border-radius:4px}@keyframes su{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}@keyframes fd{from{opacity:0}to{opacity:1}}.su{animation:su .22s ease}.fd{animation:fd .2s ease}`}</style>

      {toast && <div className="fd" style={{ position: "fixed", top: 14, left: "50%", transform: "translateX(-50%)", zIndex: 9999, background: toast.type === "err" ? "#dc2626" : toast.type === "warn" ? "#d97706" : "#15803d", color: "#fff", padding: "10px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,.3)", maxWidth: "88vw", textAlign: "center" }}>{toast.msg}</div>}

      {modal && (
        <div className="fd" onClick={e => e.target === e.currentTarget && closeModal()} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div className="su" style={{ background: C.card, width: "100%", maxWidth: 480, maxHeight: "88vh", overflowY: "auto", borderRadius: "20px 20px 0 0", padding: "20px 16px 32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: C.txt }}>{modal.title}</h3>
              <button onClick={closeModal} style={{ background: C.card2, border: `1px solid ${C.bdr}`, borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16, color: C.sub }}>✕</button>
            </div>
            {modal.content}
          </div>
        </div>
      )}

      <div style={{ paddingBottom: 80 }}>
        <div className="su" key={page}>
          {page === "home" && <HomePage {...sp} dark={dark} setDark={setDark} />}
          {page === "offers" && <OffersPage {...sp} />}
          {page === "addOffer" && <AddOfferPage {...sp} />}
          {page === "owners" && <OwnersPage {...sp} />}
          {page === "clients" && <ClientsPage {...sp} />}
          {page === "requests" && <RequestsPage {...sp} />}
          {page === "ownerForm" && <OwnerFormPage {...sp} />}
          {page === "settings" && <SettingsPage {...sp} dark={dark} setDark={setDark} accent={accent} setAccent={setAccent} loadData={loadData} />}
        </div>
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: C.card, borderTop: `1px solid ${C.bdr}`, display: "flex", alignItems: "center", justifyContent: "space-around", padding: "6px 4px 10px", zIndex: 100 }}>
        {NAV.map((n, i) => {
          if (i === 2) return (
            <div key="fab" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <button onClick={() => setPage("addOffer")} style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg,${G},${G}bb)`, border: "none", cursor: "pointer", fontSize: 26, color: "#fff", transform: "translateY(-14px)", boxShadow: `0 4px 18px ${G}66`, display: "flex", alignItems: "center", justifyContent: "center" }}>＋</button>
            </div>
          );
          const active = page === n.id || (n.id === "offers" && page === "addOffer");
          return (
            <button key={n.id} onClick={() => setPage(n.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", cursor: "pointer", color: active ? G : C.sub, minWidth: 52, padding: "4px 6px" }}>
              <span style={{ fontSize: 22 }}>{n.ic}</span>
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 400 }}>{n.lb}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* LOGIN */
function Login({ G, C, inStyle, offers, onLogin }) {
  const [u, setU] = useState(""); const [p, setP] = useState(""); const [show, setShow] = useState(false); const [err, setErr] = useState("");
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#0d0b07,#1c1608 60%,#0d0b07)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Tajawal',sans-serif", direction: "rtl" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}input,button{font-family:inherit}@keyframes pl{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}.pl{animation:pl 2.5s ease-in-out infinite}`}</style>
      <div className="pl" style={{ fontSize: 60, marginBottom: 10, filter: `drop-shadow(0 0 20px ${G})` }}>💎</div>
      <h1 style={{ color: G, fontSize: 22, fontWeight: 900, marginBottom: 4 }}>المرقاب الذهبي</h1>
      <p style={{ color: "#ffffff55", fontSize: 13, marginBottom: 28 }}>نظام إدارة العقارات</p>
      <div style={{ display: "flex", gap: 24, marginBottom: 28 }}>
        {[["عرض", offers.length], ["متاح", offers.filter(o => o.status === "متاح").length], ["مباع", offers.filter(o => o.status === "مباع").length]].map(([l, v]) => (
          <div key={l} style={{ textAlign: "center" }}><div style={{ fontSize: 24, fontWeight: 900, color: G }}>{v}</div><div style={{ fontSize: 11, color: "#ffffff44" }}>{l}</div></div>
        ))}
      </div>
      <div style={{ width: "100%", maxWidth: 340, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 20, padding: 22, display: "flex", flexDirection: "column", gap: 14 }}>
        {[["اسم المستخدم", u, setU, "text"], ["كلمة المرور", p, setP, show ? "text" : "password"]].map(([lb, val, set, type], i) => (
          <div key={i}>
            <div style={{ color: "#ffffff77", fontSize: 12, marginBottom: 6 }}>{lb}</div>
            <div style={{ position: "relative" }}>
              <input value={val} onChange={e => set(e.target.value)} type={type} onKeyDown={e => e.key === "Enter" && (u === "Nawaf" && p === "Aa1234" ? (setErr(""), onLogin()) : setErr("❌ بيانات غلط"))}
                style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,.08)", border: "1.5px solid rgba(255,255,255,.15)", borderRadius: 12, color: "#fff", fontSize: 15, outline: "none" }} />
              {i === 1 && <button onClick={() => setShow(!show)} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#ffffff55" }}>{show ? "🙈" : "👁"}</button>}
            </div>
          </div>
        ))}
        {err && <div style={{ color: "#f87171", fontSize: 13, textAlign: "center" }}>{err}</div>}
        <button onClick={() => u === "Nawaf" && p === "Aa1234" ? (setErr(""), onLogin()) : setErr("❌ بيانات غلط")} style={{ background: `linear-gradient(135deg,${G},#9a7820)`, color: "#fff", border: "none", borderRadius: 12, padding: 13, fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 4 }}>تسجيل الدخول</button>
      </div>
    </div>
  );
}

/* HOME */
function HomePage({ C, G, offers, clients, reqs, setPage, dark, setDark, conn }) {
  const stats = [
    { ic: "🏢", v: offers.length, l: "إجمالي العروض", c: G, bg: G + "18" },
    { ic: "✅", v: offers.filter(o => o.status === "متاح").length, l: "عروض متاحة", c: "#15803d", bg: "#dcfce7" },
    { ic: "🤝", v: clients.filter(c => !c.closed).length, l: "عملاء نشطين", c: "#2563eb", bg: "#dbeafe" },
    { ic: "📥", v: reqs.filter(r => r.status === "معلق").length, l: "طلبات معلقة", c: "#d97706", bg: "#fef3c7" },
  ];
  return (
    <div style={{ padding: "14px 14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 900, color: C.txt }}>💎 المرقاب الذهبي</div>
          <div style={{ fontSize: 12, color: C.sub, display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: conn ? "#15803d" : "#dc2626", display: "inline-block" }} />
            {conn ? "متصل بـ Supabase ✓" : "وضع تجريبي"}
          </div>
        </div>
        <button onClick={() => setDark(!dark)} style={{ width: 38, height: 38, borderRadius: 10, background: C.card2, border: `1px solid ${C.bdr}`, cursor: "pointer", fontSize: 18 }}>{dark ? "☀️" : "🌙"}</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.bdr}`, borderRadius: 14, padding: "14px 14px" }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, marginBottom: 7 }}>{s.ic}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: C.txt }}>{s.v}</div>
            <div style={{ fontSize: 12, color: C.sub }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.bdr}`, borderRadius: 14, padding: 14, marginBottom: 14 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: C.txt, marginBottom: 12 }}>⚡ إجراءات سريعة</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[["➕ إضافة عرض", "addOffer", G], ["👤 المالكون", "owners", "#7c3aed"], ["🌐 نموذج مالك", "ownerForm", "#0891b2"], ["⚙️ الإعدادات", "settings", "#475569"]].map(([l, pg, c]) => (
            <button key={pg} onClick={() => setPage(pg)} style={{ background: c + "15", color: c, border: `1px solid ${c}30`, borderRadius: 12, padding: "12px 8px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.bdr}`, borderRadius: 14, padding: 14, marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: C.txt }}>🏠 آخر العروض</h3>
          <button onClick={() => setPage("offers")} style={{ background: G + "15", color: G, border: `1px solid ${G}30`, borderRadius: 8, padding: "5px 12px", fontSize: 12, cursor: "pointer", fontWeight: 700 }}>الكل</button>
        </div>
        {offers.slice(0, 4).map(o => { const [tc, bc] = SC[o.status] || ["#666", "#eee"]; return (
          <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.bdr}` }}>
            <div><div style={{ fontSize: 14, fontWeight: 600, color: C.txt }}>{o.type} للـ{o.deal} — {o.city}</div><div style={{ fontSize: 12, color: C.sub }}>{o.district} | {fmtN(o.price)} ر.س</div></div>
            <span style={{ fontSize: 11, fontWeight: 700, color: tc, background: bc, padding: "3px 10px", borderRadius: 20, flexShrink: 0 }}>{o.status}</span>
          </div>
        ); })}
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.bdr}`, borderRadius: 14, padding: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: C.txt }}>📥 آخر الطلبات</h3>
          <button onClick={() => setPage("requests")} style={{ background: G + "15", color: G, border: `1px solid ${G}30`, borderRadius: 8, padding: "5px 12px", fontSize: 12, cursor: "pointer", fontWeight: 700 }}>الكل</button>
        </div>
        {reqs.slice(0, 3).map(r => { const [tc, bc] = RC[r.status] || ["#666", "#eee"]; return (
          <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.bdr}` }}>
            <div><div style={{ fontSize: 14, fontWeight: 600, color: C.txt }}>{r.name}</div><div style={{ fontSize: 12, color: C.sub }}>{r.type} — {r.city} — {fmtN(r.price)} ر.س</div></div>
            <span style={{ fontSize: 11, fontWeight: 700, color: tc, background: bc, padding: "3px 10px", borderRadius: 20 }}>{r.status}</span>
          </div>
        ); })}
      </div>
    </div>
  );
}

/* OFFERS */
function OffersPage({ C, G, inStyle, offers, setOffers, toast$, setModal, closeModal }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const fl = offers.filter(o => (filter === "all" || o.status === filter) && (!search || [o.code, o.city, o.district, o.owner_name].some(v => (v || "").includes(search))));

  const delOffer = async id => { setOffers(p => p.filter(o => o.id !== id)); await dbDel("offers", id); toast$("✅ تم حذف العرض"); closeModal(); };
  const openEdit = o => setModal({ title: "تعديل — " + o.code, content: <EditOffer C={C} G={G} inStyle={inStyle} o={o} onSave={async u => { setOffers(p => p.map(x => x.id === o.id ? u : x)); await dbPatch("offers", o.id, "id", { status: u.status, price: u.price, comm: u.comm, details: u.details, floor: u.floor }); toast$("✅ تم التحديث"); closeModal(); }} onClose={closeModal} /> });
  const openWA = o => { const comm = o.comm || Math.round((o.price || 0) * 0.025); let m = `🏡 *${o.deal} ${o.type}*\n━━━━━━━━━━━━━\n📍 *الموقع:* ${o.city} - ${o.district}\n`; if (o.area) m += `📐 *المساحة:* ${o.area} م²\n`; if (o.floor) m += `🪜 *الدور:* ${o.floor}\n`; if (o.rooms) m += `🛏 *الغرف:* ${o.rooms}\n`; m += `━━━━━━━━━━━━━\n💰 *السعر:* ${fmtN(o.price)} ر.س\n🤝 *العمولة:* ${fmtN(comm)} ر.س\n━━━━━━━━━━━━━\n🏢 المرقاب الذهبي للعقارات`; window.open("https://wa.me/?text=" + encodeURIComponent(m), "_blank"); };

  return (
    <div style={{ padding: "14px 14px" }}>
      <h2 style={{ fontSize: 18, fontWeight: 900, color: C.txt, marginBottom: 14 }}>🏠 العروض العقارية</h2>
      <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 4, marginBottom: 12 }}>
        {[["all", "الكل"], ["متاح", "متاح"], ["تفاوض", "تفاوض"], ["مباع", "مباع"], ["مؤجر", "مؤجر"]].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${filter === v ? G : C.bdr}`, background: filter === v ? G : C.card, color: filter === v ? "#fff" : C.sub, fontSize: 13, cursor: "pointer", fontWeight: filter === v ? 700 : 400 }}>{l}</button>
        ))}
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 بحث بالمدينة أو الكود أو المالك..." style={{ ...inStyle, marginBottom: 14 }} />
      {!fl.length && <div style={{ textAlign: "center", padding: "50px 20px", color: C.sub }}><div style={{ fontSize: 44, marginBottom: 10 }}>🔍</div><p>لا توجد عروض مطابقة</p></div>}
      {fl.map(o => { const [tc, bc] = SC[o.status] || ["#666", "#eee"]; return (
        <div key={o.id} style={{ background: C.card, border: `1px solid ${C.bdr}`, borderRadius: 16, padding: 14, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <div><div style={{ fontSize: 15, fontWeight: 700, color: C.txt }}>{o.type} للـ{o.deal}</div><div style={{ fontSize: 13, color: C.sub, marginTop: 2 }}>📍 {o.city} - {o.district}</div></div>
            <span style={{ fontSize: 11, fontWeight: 700, color: tc, background: bc, padding: "4px 10px", borderRadius: 20, flexShrink: 0 }}>{o.status}</span>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
            {[o.rooms && `🛏 ${o.rooms}`, o.baths && `🚿 ${o.baths}`, o.area && `📐 ${o.area}م²`, o.direction && `🧭 ${o.direction}`].filter(Boolean).map((s, i) => <span key={i} style={{ fontSize: 12, color: C.sub }}>{s}</span>)}
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, color: G, marginBottom: 8 }}>{fmtN(o.price)} <span style={{ fontSize: 13, fontWeight: 400, color: C.sub }}>ر.س</span></div>
          <div style={{ fontSize: 12, color: C.sub, marginBottom: 12 }}>👤 {o.owner_name} | {o.code}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 7 }}>
            {[["💬 واتساب", "#25D366", () => openWA(o)], ["✏️ تعديل", G, () => openEdit(o)], ["📋 نسخ", "#2563eb", () => { navigator.clipboard?.writeText(`${o.type} للـ${o.deal} - ${o.city} - ${fmtN(o.price)} ر.س`); toast$("✅ تم النسخ"); }], ["🗑️ حذف", "#dc2626", () => setModal({ title: "تأكيد الحذف", content: <Confirm C={C} msg={`حذف عرض ${o.code}؟`} onOk={() => delOffer(o.id)} onNo={closeModal} okTxt="حذف" okBg="#dc2626" /> })]].map(([t, c, fn]) => (
              <button key={t} onClick={fn} style={{ background: c + "18", color: c, border: `1px solid ${c}25`, borderRadius: 10, padding: "9px 4px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{t}</button>
            ))}
          </div>
        </div>
      ); })}
    </div>
  );
}

/* ADD OFFER */
function AddOfferPage({ C, G, inStyle, offers, setOffers, owners, toast$, setPage }) {
  const [step, setStep] = useState(1);
  const [d, setD] = useState({ type: "فيلا", deal: "بيع", status: "متاح", pay: "تحويل", furnished: "لا" });
  const SL = ["المالك", "العقار", "التسعير", "مراجعة"];

  const FI = (lb, k, type = "text", opts = null) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 13, color: C.sub, marginBottom: 5, fontWeight: 500 }}>{lb}</div>
      {opts ? <select value={d[k] || ""} onChange={e => setD({ ...d, [k]: e.target.value })} style={inStyle}>{!d[k] && <option value="">اختر</option>}{opts.map(o => <option key={o}>{o}</option>)}</select>
        : <input type={type} value={d[k] || ""} onChange={e => setD({ ...d, [k]: type === "number" ? parseFloat(e.target.value) || 0 : e.target.value })} style={inStyle} />}
    </div>
  );

  const save = async () => {
    const code = "M-" + String(offers.length + 1).padStart(3, "0");
    const rec = { ...d, code, comm: d.comm || Math.round((d.price || 0) * 0.025), images: [] };
    const saved = await dbInsert("offers", rec);
    setOffers(p => [{ ...rec, id: saved?.id || Date.now() }, ...p]);
    toast$("✅ تم حفظ العرض — " + code); setPage("offers");
  };

  return (
    <div style={{ padding: "14px 14px" }}>
      <h2 style={{ fontSize: 18, fontWeight: 900, color: C.txt, marginBottom: 18 }}>➕ إضافة عرض جديد</h2>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 22, position: "relative" }}>
        <div style={{ position: "absolute", top: 15, right: 15, left: 15, height: 2, background: C.bdr }} />
        {SL.map((lb, i) => { const n = i + 1, dn = n < step, ac = n === step; return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, zIndex: 1 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: dn ? "#15803d" : ac ? G : C.card, border: `2px solid ${dn ? "#15803d" : ac ? G : C.bdr}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: dn || ac ? "#fff" : C.sub }}>{dn ? "✓" : n}</div>
            <span style={{ fontSize: 10, color: ac ? G : C.sub, fontWeight: ac ? 700 : 400 }}>{lb}</span>
          </div>
        ); })}
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.bdr}`, borderRadius: 16, padding: 16 }}>
        {step === 1 && <>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: C.txt, marginBottom: 14 }}>بيانات المالك</h4>
          {owners.length > 0 && <>
            <div style={{ fontSize: 13, color: C.sub, marginBottom: 8 }}>اختر من المسجلين:</div>
            <div style={{ maxHeight: 150, overflowY: "auto", border: `1px solid ${C.bdr}`, borderRadius: 12, marginBottom: 14 }}>
              {owners.map(o => <div key={o.code} onClick={() => setD({ ...d, owner_name: o.name, owner_phone: o.phone })} style={{ padding: "10px 14px", borderBottom: `1px solid ${C.bdr}`, cursor: "pointer", background: d.owner_name === o.name ? G + "15" : "transparent", display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 600, color: C.txt }}>{o.name}</span><span style={{ fontSize: 12, color: C.sub }}>{o.phone}</span></div>)}
            </div>
            <div style={{ textAlign: "center", color: C.sub, fontSize: 13, marginBottom: 12 }}>— أو أضف مالكاً جديداً —</div>
          </>}
          {FI("اسم المالك *", "owner_name")}
          {FI("جوال المالك", "owner_phone", "tel")}
          {FI("مدينة المالك", "owner_city")}
        </>}
        {step === 2 && <>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: C.txt, marginBottom: 14 }}>بيانات العقار</h4>
          {FI("نوع العقار", "type", "text", ["فيلا", "شقة", "أرض", "تجاري", "مستودع"])}
          {FI("نوع الصفقة", "deal", "text", ["بيع", "إيجار"])}
          {FI("المدينة *", "city", "text", CITIES)}
          {FI("الحي", "district")}
          {FI("الدور", "floor")}
          {FI("الاتجاه", "direction", "text", ["شمال", "جنوب", "شرق", "غرب", "شمال شرق", "شمال غرب"])}
          {FI("المساحة (م²)", "area", "number")}
          {FI("الغرف", "rooms", "number")}
          {FI("الحمامات", "baths", "number")}
          {FI("مفروش", "furnished", "text", ["لا", "نعم", "جزئي"])}
          <div style={{ marginBottom: 14 }}><div style={{ fontSize: 13, color: C.sub, marginBottom: 5 }}>تفاصيل</div><textarea value={d.details || ""} onChange={e => setD({ ...d, details: e.target.value })} style={{ ...inStyle, minHeight: 75, resize: "vertical" }} /></div>
        </>}
        {step === 3 && <>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: C.txt, marginBottom: 14 }}>التسعير والحالة</h4>
          {FI("السعر (ر.س) *", "price", "number")}
          <div style={{ background: G + "15", borderRadius: 10, padding: "9px 14px", fontSize: 13, color: G, marginBottom: 14 }}>💡 عمولة مقترحة (2.5%): <strong>{fmtN(Math.round((d.price || 0) * 0.025))} ر.س</strong></div>
          {FI("العمولة (ر.س)", "comm", "number")}
          {FI("طريقة الدفع", "pay", "text", ["تحويل", "شيك", "نقد", "تقسيط"])}
          {FI("حالة العرض", "status", "text", ["متاح", "تفاوض", "مباع", "مؤجر"])}
        </>}
        {step === 4 && <>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: C.txt, marginBottom: 14 }}>مراجعة البيانات</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[["المالك", d.owner_name], ["الجوال", d.owner_phone], ["النوع", d.type], ["الصفقة", d.deal], ["المدينة", d.city], ["الحي", d.district], ["المساحة", d.area ? d.area + " م²" : "—"], ["الغرف", d.rooms || "—"], ["السعر", fmtN(d.price) + " ر.س"], ["العمولة", fmtN(d.comm || Math.round((d.price || 0) * 0.025)) + " ر.س"], ["الحالة", d.status], ["الدفع", d.pay]].map(([k, v]) => (
              <div key={k} style={{ background: C.card2, borderRadius: 10, padding: 10 }}><div style={{ fontSize: 11, color: C.sub }}>{k}</div><div style={{ fontSize: 13, fontWeight: 600, color: C.txt, marginTop: 2 }}>{v || "—"}</div></div>
            ))}
          </div>
        </>}
        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          {step > 1 && <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, padding: 13, background: C.card2, border: `1px solid ${C.bdr}`, borderRadius: 12, color: C.txt, fontSize: 14, cursor: "pointer" }}>→ السابق</button>}
          {step < 4
            ? <button onClick={() => { if (step === 1 && !d.owner_name) { toast$("يرجى إدخال اسم المالك", "warn"); return; } if (step === 2 && !d.city) { toast$("يرجى اختيار المدينة", "warn"); return; } if (step === 3 && !d.price) { toast$("يرجى إدخال السعر", "warn"); return; } setStep(s => s + 1); }} style={{ flex: 1, padding: 13, background: G, border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>التالي ←</button>
            : <button onClick={save} style={{ flex: 1, padding: 13, background: `linear-gradient(135deg,${G},#9a7820)`, border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>💾 حفظ العرض</button>}
        </div>
      </div>
    </div>
  );
}

/* OWNERS */
function OwnersPage({ C, G, inStyle, owners, setOwners, offers, toast$, setModal, closeModal }) {
  const [search, setSearch] = useState("");
  const fl = owners.filter(o => !search || o.name.includes(search) || o.phone.includes(search));
  const openAdd = () => setModal({ title: "إضافة مالك جديد", content: <AddOwner C={C} G={G} inStyle={inStyle} onSave={async data => { if (!data.name || !data.phone) { toast$("يرجى إدخال الاسم والجوال", "warn"); return; } const code = "OWN-" + String(owners.length + 1).padStart(3, "0"); const rec = { code, ...data }; const saved = await dbInsert("owners", rec); setOwners(p => [...p, { ...rec, ...(saved || {}) }]); toast$("✅ تم إضافة " + data.name); closeModal(); }} onClose={closeModal} /> });
  const del = (code, name) => setModal({ title: "تأكيد الحذف", content: <Confirm C={C} msg={`حذف المالك ${name}؟`} onOk={async () => { setOwners(p => p.filter(o => o.code !== code)); await dbDel("owners", code, "code"); toast$("✅ تم الحذف"); closeModal(); }} onNo={closeModal} okTxt="حذف" okBg="#dc2626" /> });
  return (
    <div style={{ padding: "14px 14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: C.txt }}>👤 المالكون</h2>
        <button onClick={openAdd} style={{ background: G, color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ إضافة</button>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 بحث..." style={{ ...inStyle, marginBottom: 14 }} />
      {!fl.length && <div style={{ textAlign: "center", padding: "50px 20px", color: C.sub }}><div style={{ fontSize: 44 }}>👤</div><p style={{ marginTop: 10 }}>لا يوجد مالكون</p></div>}
      {fl.map(o => { const cnt = offers.filter(f => f.owner_phone === o.phone || f.owner_name === o.name).length; return (
        <div key={o.code} style={{ background: C.card, border: `1px solid ${C.bdr}`, borderRadius: 14, padding: 14, marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.txt }}>👤 {o.name}</div>
              <div style={{ fontSize: 13, color: C.sub, marginTop: 3 }}>📱 {o.phone} {o.city ? `— 📍 ${o.city}` : ""}</div>
              <div style={{ fontSize: 11, color: C.sub, marginTop: 3 }}>كود: {o.code} | {cnt} عقار مسجل</div>
            </div>
            <div style={{ display: "flex", gap: 7 }}>
              <a href={waLink(o.phone)} target="_blank" rel="noreferrer" style={{ background: "#25D366", color: "#fff", borderRadius: 9, padding: "8px 11px", fontSize: 15, textDecoration: "none" }}>💬</a>
              <button onClick={() => del(o.code, o.name)} style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 9, padding: "8px 11px", fontSize: 15, cursor: "pointer" }}>🗑️</button>
            </div>
          </div>
        </div>
      ); })}
    </div>
  );
}

/* CLIENTS */
function ClientsPage({ C, G, inStyle, clients, setClients, offers, setOffers, toast$, setModal, closeModal }) {
  const [filter, setFilter] = useState("open");
  const getM = c => !c.budget_to ? [] : offers.filter(o => o.status === "متاح" && o.price <= c.budget_to && (!c.budget_from || o.price >= c.budget_from) && (!c.property_type || o.type === c.property_type) && (c.req_type === "شراء" ? o.deal === "بيع" : c.req_type === "إيجار" ? o.deal === "إيجار" : true));
  const close = (cc, oc) => setModal({ title: "إغلاق الصفقة", content: <Confirm C={C} msg={`إغلاق صفقة ${cc} مع عرض ${oc}؟`} onOk={async () => { setClients(p => p.map(c => c.code === cc ? { ...c, closed: true, matched_offer: oc } : c)); setOffers(p => p.map(o => o.code === oc ? { ...o, status: "مباع" } : o)); await dbPatch("clients", cc, "code", { closed: true, matched_offer: oc }); await dbPatch("offers", oc, "code", { status: "مباع" }); toast$("🎉 تم إغلاق الصفقة!"); closeModal(); }} onNo={closeModal} okTxt="✅ إغلاق" okBg="#15803d" /> });
  const openAdd = () => setModal({ title: "إضافة عميل جديد", content: <AddClient C={C} G={G} inStyle={inStyle} onSave={async data => { if (!data.name || !data.phone) { toast$("يرجى إدخال الاسم والجوال", "warn"); return; } const code = "CL-" + String(clients.length + 1).padStart(3, "0"); const rec = { code, ...data, matched_offer: "", closed: false }; const saved = await dbInsert("clients", rec); setClients(p => [...p, { ...rec, ...(saved || {}) }]); toast$("✅ تم إضافة " + data.name); closeModal(); }} onClose={closeModal} /> });
  const fl = clients.filter(c => filter === "all" || (filter === "open" ? !c.closed : c.closed));
  return (
    <div style={{ padding: "14px 14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: C.txt }}>🤝 العملاء</h2>
        <button onClick={openAdd} style={{ background: G, color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ إضافة</button>
      </div>
      <div style={{ display: "flex", gap: 7, marginBottom: 14 }}>
        {[["open", "نشط"], ["closed", "مغلق"], ["all", "الكل"]].map(([v, l]) => <button key={v} onClick={() => setFilter(v)} style={{ padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${filter === v ? G : C.bdr}`, background: filter === v ? G : C.card, color: filter === v ? "#fff" : C.sub, fontSize: 13, cursor: "pointer", fontWeight: filter === v ? 700 : 400 }}>{l}</button>)}
      </div>
      {!fl.length && <div style={{ textAlign: "center", padding: "50px 20px", color: C.sub }}><div style={{ fontSize: 44 }}>🤝</div><p style={{ marginTop: 10 }}>لا يوجد عملاء</p></div>}
      {fl.map(c => { const M = getM(c); return (
        <div key={c.code} style={{ background: C.card, border: `1px solid ${C.bdr}`, borderRadius: 14, padding: 14, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg,${G},#9a7820)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#fff", fontWeight: 700, flexShrink: 0 }}>{c.name?.charAt(0)}</div>
              <div><div style={{ fontWeight: 700, color: C.txt }}>{c.name} {c.closed && <span style={{ fontSize: 10, background: C.card2, color: C.sub, padding: "2px 7px", borderRadius: 10 }}>مغلق</span>}</div><div style={{ fontSize: 12, color: C.sub }}>📱 {c.phone} {c.city ? `— 📍 ${c.city}` : ""}</div></div>
            </div>
            <a href={waLink(c.phone)} target="_blank" rel="noreferrer" style={{ background: "#25D366", color: "#fff", borderRadius: 9, padding: "8px 10px", fontSize: 15, textDecoration: "none", flexShrink: 0 }}>💬</a>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: M.length && !c.closed ? 10 : 0 }}>
            <span style={{ fontSize: 11, fontWeight: 700, background: "#dbeafe", color: "#2563eb", padding: "3px 10px", borderRadius: 20 }}>{c.req_type} {c.property_type}</span>
            {(c.budget_from || c.budget_to) && <span style={{ fontSize: 11, fontWeight: 700, background: "#dcfce7", color: "#15803d", padding: "3px 10px", borderRadius: 20 }}>{fmtN(c.budget_from)} - {fmtN(c.budget_to)} ر.س</span>}
          </div>
          {!c.closed && M.length > 0 && <>
            <div style={{ fontSize: 12, color: C.sub, fontWeight: 600, marginBottom: 7 }}>🎯 عروض مطابقة ({M.length})</div>
            {M.slice(0, 2).map(m => <div key={m.id} style={{ background: G + "10", border: `1px solid ${G}22`, borderRadius: 10, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div><div style={{ fontSize: 13, fontWeight: 600, color: C.txt }}>{m.type} — {m.city} ({m.code})</div><div style={{ fontSize: 11, color: C.sub }}>{fmtN(m.price)} ر.س | {m.area} م²</div></div>
              <button onClick={() => close(c.code, m.code)} style={{ background: "#15803d", color: "#fff", border: "none", borderRadius: 8, padding: "7px 11px", fontSize: 11, fontWeight: 700, cursor: "pointer", flexShrink: 0, marginRight: 8 }}>إغلاق</button>
            </div>)}
          </>}
          {!c.closed && M.length === 0 && <p style={{ fontSize: 12, color: C.sub, marginTop: 4 }}>لا توجد عروض مطابقة حالياً</p>}
        </div>
      ); })}
    </div>
  );
}

/* REQUESTS */
function RequestsPage({ C, G, reqs, setReqs, setOffers, toast$ }) {
  const [filter, setFilter] = useState("all");
  const accept = async id => { const r = reqs.find(x => x.id === id); if (!r) return; setReqs(p => p.map(x => x.id === id ? { ...x, status: "مقبول" } : x)); const draft = { id: Date.now(), code: "D-" + Date.now(), type: r.type, deal: r.deal, city: r.city, district: r.district || "", floor: r.floor || "", rooms: r.rooms || 0, baths: 0, area: r.area || 0, price: r.price || 0, comm: Math.round((r.price || 0) * 0.025), pay: "تحويل", status: "متاح", owner_name: r.name, owner_phone: r.phone, direction: "", furnished: "لا", details: (r.details || "") + " (طلب مالك)", images: [] }; setOffers(p => [draft, ...p]); await dbPatch("owner_requests", id, "id", { status: "مقبول" }); toast$("✅ تم القبول وإضافته كعرض"); };
  const reject = async id => { setReqs(p => p.map(x => x.id === id ? { ...x, status: "مرفوض" } : x)); await dbPatch("owner_requests", id, "id", { status: "مرفوض" }); toast$("تم رفض الطلب"); };
  const fl = filter === "all" ? reqs : reqs.filter(r => r.status === filter);
  return (
    <div style={{ padding: "14px 14px" }}>
      <h2 style={{ fontSize: 18, fontWeight: 900, color: C.txt, marginBottom: 14 }}>📥 طلبات المالكين</h2>
      <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 4, marginBottom: 14 }}>
        {[["all", "الكل"], ["معلق", "معلق"], ["مقبول", "مقبول"], ["مرفوض", "مرفوض"]].map(([v, l]) => <button key={v} onClick={() => setFilter(v)} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${filter === v ? G : C.bdr}`, background: filter === v ? G : C.card, color: filter === v ? "#fff" : C.sub, fontSize: 13, cursor: "pointer", fontWeight: filter === v ? 700 : 400 }}>{l}</button>)}
      </div>
      {!fl.length && <div style={{ textAlign: "center", padding: "50px 20px", color: C.sub }}><div style={{ fontSize: 44 }}>📥</div><p style={{ marginTop: 10 }}>لا توجد طلبات</p></div>}
      {fl.map(r => { const [tc, bc] = RC[r.status] || ["#666", "#eee"]; return (
        <div key={r.id} style={{ background: C.card, border: `1px solid ${C.bdr}`, borderRadius: 14, padding: 14, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <div><div style={{ fontSize: 15, fontWeight: 700, color: C.txt }}>{r.name}</div><div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>📱 {r.phone} — 📍 {r.city}</div></div>
            <span style={{ fontSize: 11, fontWeight: 700, color: tc, background: bc, padding: "4px 10px", borderRadius: 20, flexShrink: 0 }}>{r.status}</span>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, background: G + "18", color: G, padding: "3px 10px", borderRadius: 20 }}>{r.type} — {r.deal}</span>
            {r.district && <span style={{ fontSize: 11, background: "#dbeafe", color: "#2563eb", fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>{r.district}</span>}
            {r.area && <span style={{ fontSize: 11, background: C.card2, color: C.sub, padding: "3px 10px", borderRadius: 20 }}>{r.area} م²</span>}
            {r.price && <span style={{ fontSize: 11, fontWeight: 700, background: "#dcfce7", color: "#15803d", padding: "3px 10px", borderRadius: 20 }}>{fmtN(r.price)} ر.س</span>}
          </div>
          {r.details && <p style={{ fontSize: 13, color: C.sub, marginBottom: 10 }}>{r.details}</p>}
          <div style={{ display: "flex", gap: 8 }}>
            {r.status === "معلق" && <>
              <button onClick={() => accept(r.id)} style={{ flex: 1, background: "#dcfce7", color: "#15803d", border: "none", borderRadius: 10, padding: "11px 8px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>✅ قبول وتحويل</button>
              <a href={waLink(r.phone)} target="_blank" rel="noreferrer" style={{ background: "#25D366", color: "#fff", borderRadius: 10, padding: "11px 13px", fontSize: 15, textDecoration: "none", display: "flex", alignItems: "center" }}>💬</a>
              <button onClick={() => reject(r.id)} style={{ flex: 1, background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 10, padding: "11px 8px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>❌ رفض</button>
            </>}
            {r.status !== "معلق" && <a href={waLink(r.phone)} target="_blank" rel="noreferrer" style={{ background: "#25D366", color: "#fff", borderRadius: 10, padding: "11px 18px", fontSize: 15, textDecoration: "none" }}>💬 واتساب</a>}
          </div>
        </div>
      ); })}
    </div>
  );
}

/* OWNER FORM */
function OwnerFormPage({ C, G, inStyle, reqs, setReqs, toast$ }) {
  const [f, setF] = useState({ name: "", phone: "", city: "", deal: "", type: "", district: "", floor: "", rooms: "", area: "", price: "", details: "" });
  const FI = (lb, k, type = "text", opts = null, req = false) => (
    <div style={{ marginBottom: 13 }}>
      <div style={{ fontSize: 13, color: C.sub, marginBottom: 5 }}>{lb}{req && <span style={{ color: "#dc2626" }}> *</span>}</div>
      {opts ? <select value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })} style={inStyle}><option value="">اختر</option>{opts.map(o => <option key={o}>{o}</option>)}</select>
        : <input type={type} value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })} style={inStyle} />}
    </div>
  );
  const submit = async () => {
    if (!f.name || !f.phone || !f.city || !f.deal || !f.type) { toast$("يرجى تعبئة الحقول المطلوبة *", "warn"); return; }
    const rec = { ...f, rooms: parseInt(f.rooms) || 0, area: parseFloat(f.area) || 0, price: parseFloat(f.price) || 0, status: "معلق" };
    const saved = await dbInsert("owner_requests", rec);
    setReqs(p => [{ ...rec, id: saved?.id || Date.now() }, ...p]);
    toast$("✅ تم إرسال طلبك! سنتواصل معك قريباً");
    setF({ name: "", phone: "", city: "", deal: "", type: "", district: "", floor: "", rooms: "", area: "", price: "", details: "" });
  };
  return (
    <div style={{ padding: "14px 14px" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 44, marginBottom: 6 }}>💎</div>
        <h1 style={{ fontSize: 20, fontWeight: 900, color: G }}>المرقاب الذهبي للعقارات</h1>
        <p style={{ fontSize: 13, color: C.sub, marginTop: 4 }}>ارفع عقارك وسنتواصل معك قريباً</p>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.bdr}`, borderRadius: 16, padding: 16 }}>
        {FI("الاسم الكامل", "name", "text", null, true)}
        {FI("رقم الجوال", "phone", "tel", null, true)}
        {FI("المدينة", "city", "text", CITIES, true)}
        {FI("نوع الصفقة", "deal", "text", ["بيع", "إيجار"], true)}
        {FI("نوع العقار", "type", "text", ["فيلا", "شقة", "أرض", "تجاري", "مستودع"], true)}
        {FI("الحي", "district")}
        {FI("عدد الغرف", "rooms", "number")}
        {FI("المساحة (م²)", "area", "number")}
        {FI("السعر المطلوب (ر.س)", "price", "number")}
        <div style={{ marginBottom: 16 }}><div style={{ fontSize: 13, color: C.sub, marginBottom: 5 }}>تفاصيل</div><textarea value={f.details} onChange={e => setF({ ...f, details: e.target.value })} style={{ ...inStyle, minHeight: 75, resize: "vertical" }} /></div>
        <button onClick={submit} style={{ width: "100%", padding: 14, background: `linear-gradient(135deg,${G},#9a7820)`, border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>إرسال الطلب 📤</button>
      </div>
    </div>
  );
}

/* SETTINGS */
function SettingsPage({ C, G, dark, setDark, accent, setAccent, loadData, conn }) {
  return (
    <div style={{ padding: "14px 14px" }}>
      <h2 style={{ fontSize: 18, fontWeight: 900, color: C.txt, marginBottom: 14 }}>⚙️ الإعدادات</h2>
      {[
        { title: "🎨 المظهر", body: <div><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}><span style={{ fontSize: 14, color: C.txt }}>الوضع الداكن</span><div onClick={() => setDark(!dark)} style={{ width: 48, height: 26, borderRadius: 13, background: dark ? G : C.bdr, cursor: "pointer", position: "relative", transition: "background .2s" }}><div style={{ position: "absolute", width: 20, height: 20, borderRadius: "50%", background: "#fff", top: 3, right: dark ? 3 : 25, transition: "right .2s" }} /></div></div><div style={{ fontSize: 13, color: C.sub, marginBottom: 10 }}>اللون الرئيسي</div><div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{ACCENTS.map(c => <div key={c} onClick={() => setAccent(c)} style={{ width: 32, height: 32, borderRadius: "50%", background: c, cursor: "pointer", border: `3px solid ${accent === c ? C.txt : "transparent"}`, transition: "transform .15s", transform: accent === c ? "scale(1.15)" : "scale(1)" }} />)}</div></div> },
        { title: "🔌 الاتصال", body: <div><div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 14 }}><div style={{ width: 10, height: 10, borderRadius: "50%", background: conn ? "#15803d" : "#dc2626" }} /><span style={{ fontSize: 14, color: C.txt }}>{conn ? "متصل بـ Supabase ✓" : "غير متصل — وضع تجريبي"}</span></div><button onClick={loadData} style={{ background: G + "15", color: G, border: `1px solid ${G}33`, borderRadius: 10, padding: "11px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>🔄 تحديث البيانات</button></div> },
        { title: "👤 الحساب", body: <div><div style={{ fontSize: 14, color: C.txt, marginBottom: 6 }}>المستخدم: <strong>Nawaf</strong></div><div style={{ fontSize: 13, color: C.sub }}>المرقاب الذهبي للعقارات v2.1</div></div> },
      ].map(({ title, body }) => (
        <div key={title} style={{ background: C.card, border: `1px solid ${C.bdr}`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: C.txt, marginBottom: 14, paddingBottom: 10, borderBottom: `1px solid ${C.bdr}` }}>{title}</h4>
          {body}
        </div>
      ))}
    </div>
  );
}

/* SHARED MODAL CONTENTS */
function Confirm({ C, msg, onOk, onNo, okTxt = "تأكيد", okBg = "#dc2626" }) {
  return <div><p style={{ fontSize: 15, color: C.txt, textAlign: "center", marginBottom: 22 }}>{msg}</p><div style={{ display: "flex", gap: 10 }}><button onClick={onNo} style={{ flex: 1, padding: 12, background: C.card2, border: `1px solid ${C.bdr}`, borderRadius: 12, color: C.txt, fontSize: 14, cursor: "pointer" }}>إلغاء</button><button onClick={onOk} style={{ flex: 1, padding: 12, background: okBg, border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{okTxt}</button></div></div>;
}
function EditOffer({ C, G, inStyle, o, onSave, onClose }) {
  const [d, setD] = useState({ ...o });
  return <div>{[["الحالة", "status", ["متاح", "تفاوض", "مباع", "مؤجر"]], ["السعر (ر.س)", "price", null, "number"], ["العمولة (ر.س)", "comm", null, "number"], ["الدور", "floor"]].map(([lb, k, opts, t]) => <div key={k} style={{ marginBottom: 12 }}><div style={{ fontSize: 13, color: C.sub, marginBottom: 5 }}>{lb}</div>{opts ? <select value={d[k] || ""} onChange={e => setD({ ...d, [k]: e.target.value })} style={inStyle}>{opts.map(o => <option key={o}>{o}</option>)}</select> : <input type={t || "text"} value={d[k] || ""} onChange={e => setD({ ...d, [k]: t === "number" ? parseFloat(e.target.value) || 0 : e.target.value })} style={inStyle} />}</div>)}<div style={{ marginBottom: 14 }}><div style={{ fontSize: 13, color: C.sub, marginBottom: 5 }}>التفاصيل</div><textarea value={d.details || ""} onChange={e => setD({ ...d, details: e.target.value })} style={{ ...inStyle, minHeight: 70, resize: "vertical" }} /></div><div style={{ display: "flex", gap: 10 }}><button onClick={onClose} style={{ flex: 1, padding: 12, background: C.card2, border: `1px solid ${C.bdr}`, borderRadius: 12, color: C.txt, fontSize: 14, cursor: "pointer" }}>إلغاء</button><button onClick={() => onSave(d)} style={{ flex: 1, padding: 12, background: G, border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>💾 حفظ</button></div></div>;
}
function AddOwner({ C, G, inStyle, onSave, onClose }) {
  const [d, setD] = useState({ name: "", phone: "", city: "" });
  return <div>{[["الاسم *", "name", "text"], ["الجوال *", "phone", "tel"], ["المدينة", "city", "text"]].map(([lb, k, t]) => <div key={k} style={{ marginBottom: 12 }}><div style={{ fontSize: 13, color: C.sub, marginBottom: 5 }}>{lb}</div><input type={t} value={d[k]} onChange={e => setD({ ...d, [k]: e.target.value })} style={inStyle} /></div>)}<div style={{ display: "flex", gap: 10, marginTop: 16 }}><button onClick={onClose} style={{ flex: 1, padding: 12, background: C.card2, border: `1px solid ${C.bdr}`, borderRadius: 12, color: C.txt, fontSize: 14, cursor: "pointer" }}>إلغاء</button><button onClick={() => onSave(d)} style={{ flex: 1, padding: 12, background: G, border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>💾 حفظ</button></div></div>;
}
function AddClient({ C, G, inStyle, onSave, onClose }) {
  const [d, setD] = useState({ name: "", phone: "", city: "", req_type: "شراء", property_type: "فيلا", budget_from: 0, budget_to: 0 });
  return <div>{[["الاسم *", "name", "text"], ["الجوال *", "phone", "tel"], ["المدينة", "city", "text"]].map(([lb, k, t]) => <div key={k} style={{ marginBottom: 12 }}><div style={{ fontSize: 13, color: C.sub, marginBottom: 5 }}>{lb}</div><input type={t} value={d[k]} onChange={e => setD({ ...d, [k]: e.target.value })} style={inStyle} /></div>)}{[["نوع الطلب", "req_type", ["شراء", "إيجار"]], ["نوع العقار", "property_type", ["فيلا", "شقة", "أرض"]]].map(([lb, k, opts]) => <div key={k} style={{ marginBottom: 12 }}><div style={{ fontSize: 13, color: C.sub, marginBottom: 5 }}>{lb}</div><select value={d[k]} onChange={e => setD({ ...d, [k]: e.target.value })} style={inStyle}>{opts.map(o => <option key={o}>{o}</option>)}</select></div>)}{[["الميزانية من (ر.س)", "budget_from"], ["الميزانية حتى (ر.س)", "budget_to"]].map(([lb, k]) => <div key={k} style={{ marginBottom: 12 }}><div style={{ fontSize: 13, color: C.sub, marginBottom: 5 }}>{lb}</div><input type="number" value={d[k]} onChange={e => setD({ ...d, [k]: parseFloat(e.target.value) || 0 })} style={inStyle} /></div>)}<div style={{ display: "flex", gap: 10, marginTop: 16 }}><button onClick={onClose} style={{ flex: 1, padding: 12, background: C.card2, border: `1px solid ${C.bdr}`, borderRadius: 12, color: C.txt, fontSize: 14, cursor: "pointer" }}>إلغاء</button><button onClick={() => onSave(d)} style={{ flex: 1, padding: 12, background: G, border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>💾 حفظ</button></div></div>;
}

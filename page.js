
'use client';
import React, { useState } from 'react';

const greekPhone = /^(\+30)?\s?6\d{9}$/;

const TABS = [
  { key: 'car', label: 'Αυτοκίνητο' },
  { key: 'home', label: 'Κατοικία' },
  { key: 'health', label: 'Υγεία' },
  { key: 'business', label: 'Επιχείρηση' },
  { key: 'life', label: 'Ζωής' },
  { key: 'travel', label: 'Ταξιδιωτική' },
];

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </div>
  );
}

function Field({ label, required, children, hint }) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="font-medium">{label} {required && <span className="text-red-600">*</span>}</span>
      {children}
      {hint && <span className="text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

function Input(props){ return <input {...props} className={`border rounded-xl px-3 py-2 focus:outline-none focus:ring w-full ${props.className||''}`} /> }
function Select({children,...props}){ return <select {...props} className="border rounded-xl px-3 py-2 focus:outline-none focus:ring w-full">{children}</select> }
function Textarea(props){ return <textarea {...props} className={`border rounded-xl px-3 py-2 focus:outline-none focus:ring w-full min-h-[96px] ${props.className||''}`} /> }

export default function Page(){
  const [tab, setTab] = useState('car');
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [gdpr, setGdpr] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate(data){
    const e = {};
    if(!data.fullName) e.fullName='Ονοματεπώνυμο';
    if(!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email='Email';
    if(!data.phone || !greekPhone.test(data.phone)) e.phone='Κινητό (69… ή +3069… )';
    if(!gdpr) e.gdpr='Απαιτείται συγκατάθεση';

    if(tab==='car'){ ['car_plate','car_make','car_model','car_firstYear','driver_age','license_years'].forEach(k=>{ if(!data[k]) e[k]='Υποχρεωτικό'; }); }
    if(tab==='home'){ ['home_type','home_m2','home_year','home_region'].forEach(k=>{ if(!data[k]) e[k]='Υποχρεωτικό'; }); }
    if(tab==='health'){ ['health_age','health_plan','health_franchise'].forEach(k=>{ if(!data[k]) e[k]='Υποχρεωτικό'; }); }
    if(tab==='business'){ ['biz_activity','biz_address','biz_area_m2'].forEach(k=>{ if(!data[k]) e[k]='Υποχρεωτικό'; }); }
    if(tab==='life'){ ['life_age','life_capital','life_duration'].forEach(k=>{ if(!data[k]) e[k]='Υποχρεωτικό'; }); }
    if(tab==='travel'){ ['travel_start','travel_end','travel_country'].forEach(k=>{ if(!data[k]) e[k]='Υποχρεωτικό'; }); }

    setErrors(e);
    return Object.keys(e).length===0;
  }

  async function onSubmit(ev){
    ev.preventDefault();
    const data = Object.fromEntries(new FormData(ev.currentTarget));
    if(!validate(data)) return;
    setLoading(true);
    try{
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: tab,
          contact: { fullName: data.fullName, email: data.email, phone: data.phone, pref: data.contact_pref||'phone' },
          data,
          consent: { gdprAccepted: gdpr, timestamp: new Date().toISOString() },
          attribution: Object.fromEntries(new URLSearchParams(window.location.search).entries())
        })
      });
      if(!res.ok) throw new Error('send_failed');
      setSubmitted(true);
    }catch(err){
      alert('Σφάλμα αποστολής. Δοκίμασε ξανά.');
      console.error(err);
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Markakos Trust — Αίτηση Προσφοράς</h1>
          <p className="text-slate-600">Παράρτημα MegaBrokers · Σπάρτη</p>
        </header>

        <nav className="flex gap-2 flex-wrap mb-6">
          {TABS.map(t => (
            <button key={t.key} type="button"
              onClick={()=>setTab(t.key)}
              className={`px-4 py-2 rounded-2xl border transition shadow-sm ${tab===t.key?'bg-black text-white':'bg-white hover:bg-slate-100'}`}>
              {t.label}
            </button>
          ))}
        </nav>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-2">Ευχαριστούμε!</h3>
            <p>Λάβαμε το αίτημα. Θα επικοινωνήσουμε άμεσα με προσφορά.</p>
            <button className="mt-4 px-4 py-2 rounded-xl border" onClick={()=>setSubmitted(false)}>Νέα αίτηση</button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-6">
            <Section title="Στοιχεία Επικοινωνίας">
              <Field label="Ονοματεπώνυμο" required><Input name="fullName" /></Field>
              {errors.fullName && <span className="text-xs text-red-600">{errors.fullName}</span>}
              <Field label="Email" required><Input name="email" type="email" /></Field>
              {errors.email && <span className="text-xs text-red-600">{errors.email}</span>}
              <Field label="Κινητό" required hint="69XXXXXXXX ή +3069XXXXXXXX">
                <Input name="phone" /></Field>
              {errors.phone && <span className="text-xs text-red-600">{errors.phone}</span>}
              <Field label="Τρόπος Επικοινωνίας">
                <Select name="contact_pref" defaultValue="phone">
                  <option value="phone">Τηλέφωνο</option>
                  <option value="email">Email</option>
                  <option value="viber">Viber/WhatsApp</option>
                </Select>
              </Field>
            </Section>

            {tab==='car' && (
              <Section title="Αυτοκίνητο">
                <Field label="Αρ. Κυκλοφορίας" required><Input name="car_plate" /></Field>
                <Field label="Μάρκα" required><Input name="car_make" /></Field>
                <Field label="Μοντέλο" required><Input name="car_model" /></Field>
                <Field label="Έτος 1ης Κυκλοφορίας" required><Input name="car_firstYear" type="number" min="1970" max="2026" /></Field>
                <Field label="Κυβικά (cc)"><Input name="car_cc" type="number" /></Field>
                <Field label="Ηλικία οδηγού" required><Input name="driver_age" type="number" min="18" /></Field>
                <Field label="Έτη διπλώματος" required><Input name="license_years" type="number" min="0" /></Field>
                <Field label="Καλύψεις"><Select name="car_cover" defaultValue="third"><option value="third">Αστική Ευθύνη</option><option value="third_plus">Μερική</option><option value="full">Πλήρης</option></Select></Field>
                <Field label="Ζημιές τελευταίας 3ετίας"><Select name="car_claims" defaultValue="0"><option value="0">0</option><option value="1">1</option><option value="2+">2+</option></Select></Field>
              </Section>
            )}

            {tab==='home' && (
              <Section title="Κατοικία">
                <Field label="Τύπος" required><Select name="home_type" defaultValue="Διαμέρισμα"><option>Διαμέρισμα</option><option>Μονοκατοικία</option><option>Μεζονέτα</option></Select></Field>
                <Field label="Τ.μ." required><Input name="home_m2" type="number" min="10" /></Field>
                <Field label="Έτος κατασκευής" required><Input name="home_year" type="number" min="1900" max="2026" /></Field>
                <Field label="Περιοχή/ΤΚ" required><Input name="home_region" /></Field>
                <Field label="Χρήση"><Select name="home_use" defaultValue="Κύρια"><option>Κύρια</option><option>Εξοχική</option><option>Μίσθωση</option></Select></Field>
                <Field label="Καλύψεις"><Select name="home_cover" defaultValue="basic"><option value="basic">Βασικές</option><option value="fire_theft">Πυρκαγιά/Κλοπή</option><option value="full">Πλήρες</option></Select></Field>
              </Section>
            )}

            {tab==='health' && (
              <Section title="Υγείας">
                <Field label="Ηλικία" required><Input name="health_age" type="number" min="18" /></Field>
                <Field label="Πλάνο" required><Select name="health_plan" defaultValue="combo"><option value="inpatient">Νοσηλεία</option><option value="outpatient">Εξωνοσοκ.</option><option value="combo">Συνδυαστικό</option></Select></Field>
                <Field label="Franchise" required><Select name="health_franchise" defaultValue="1500"><option value="500">€500</option><option value="1500">€1.500</option><option value="3000">€3.000</option></Select></Field>
                <Field label="Θάλαμος"><Select name="health_room" defaultValue="double"><option value="single">Μονόκλινο</option><option value="double">Δίκλινο</option></Select></Field>
                <Field label="Καπνιστής"><Select name="health_smoker" defaultValue="no"><option value="no">Όχι</option><option value="yes">Ναι</option></Select></Field>
              </Section>
            )}

            {tab==='business' && (
              <Section title="Επιχείρηση">
                <Field label="Δραστηριότητα" required><Input name="biz_activity" /></Field>
                <Field label="Διεύθυνση έδρας" required><Input name="biz_address" /></Field>
                <Field label="Τ.μ. χώρου" required><Input name="biz_area_m2" type="number" min="10" /></Field>
                <Field label="Καλύψεις"><Select name="biz_cover" defaultValue="liability"><option value="liability">Αστική ευθύνη</option><option value="property">Περιουσίας</option><option value="combined">Συνδυαστικό</option></Select></Field>
              </Section>
            )}

            {tab==='life' && (
              <Section title="Ζωής">
                <Field label="Ηλικία" required><Input name="life_age" type="number" min="18" /></Field>
                <Field label="Κεφάλαιο (€)" required><Input name="life_capital" type="number" min="10000" step="1000" /></Field>
                <Field label="Διάρκεια (έτη)" required><Input name="life_duration" type="number" min="5" /></Field>
                <Field label="Καπνιστής"><Select name="life_smoker" defaultValue="no"><option value="no">Όχι</option><option value="yes">Ναι</option></Select></Field>
              </Section>
            )}

            {tab==='travel' && (
              <Section title="Ταξιδιωτική">
                <Field label="Έναρξη" required><Input name="travel_start" type="date" /></Field>
                <Field label="Λήξη" required><Input name="travel_end" type="date" /></Field>
                <Field label="Προορισμός" required><Input name="travel_country" /></Field>
                <Field label="Σκοπός"><Select name="travel_purpose" defaultValue="Αναψυχή"><option>Αναψυχή</option><option>Εργασία</option><option>Σπουδές</option></Select></Field>
              </Section>
            )}

            <div className="bg-white rounded-2xl shadow p-6">
              <label className="flex gap-3 items-start text-sm">
                <input type="checkbox" checked={gdpr} onChange={e=>setGdpr(e.target.checked)} />
                <span>Δίνω τη συγκατάθεσή μου για επεξεργασία των δεδομένων για σκοπό λήψης ασφαλιστικών προσφορών.</span>
              </label>
              {errors.gdpr && <div className="text-red-600 text-xs mt-2">{errors.gdpr}</div>}
              <div className="flex items-center gap-3 mt-4">
                <button type="submit" className="px-5 py-2 rounded-2xl bg-black text-white" disabled={loading}>
                  {loading ? 'Αποστολή…' : 'Ζήτα Προσφορά'}
                </button>
                <span className="text-xs text-slate-500">Χωρίς δέσμευση · Απάντηση εντός 24–48 ωρών</span>
              </div>
            </div>
          </form>
        )}
        <footer className="text-xs text-slate-500 mt-6">© {new Date().getFullYear()} Markakos Trust · Όροι & Απόρρητο</footer>
      </div>
    </div>
  );
}

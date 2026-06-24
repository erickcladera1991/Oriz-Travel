"use client";
import { useState } from "react";

// ── ORIZ TRAVEL BRAND TOKENS ──────────────────────────────────
const B = {
  purple:     "#AE4CED",
  purpleDeep: "#7077E2",
  navy:       "#253A5E",
  navyMid:    "#2B369E",
  white:      "#FFFFFF",
  offWhite:   "#F7F5FF",
  border:     "#E2DEFF",
  textDark:   "#1A1240",
  textMid:    "#4A5578",
  textLight:  "#8A94B2",
};

const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Poppins:wght@400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Poppins', sans-serif; }
  h1,h2,h3,h4,h5 { font-family: 'Sora', sans-serif; }
`;

const CITIES_FROM = ["New York (JFK)","Los Angeles (LAX)","Chicago (ORD)","Miami (MIA)","Houston (IAH)","Mexico City (MEX)","Guadalajara (GDL)","Monterrey (MTY)","Tijuana (TIJ)","Cancún (CUN)"];
const CITIES_TO   = ["Cancún (CUN)","New York (JFK)","Barcelona (BCN)","Tokyo (NRT)","Dubai (DXB)","Monterrey (MTY)","Miami (MIA)","Los Angeles (LAX)","London (LHR)","Paris (CDG)"];

const STATS = [
  { val: "50K+",  label: "Teams Served" },
  { val: "120+",  label: "Countries" },
  { val: "$2.4B", label: "Bookings Processed" },
  { val: "99.8%", label: "Uptime" },
];

// ── HELPERS ───────────────────────────────────────────────────
function Inp({ label, icon, value, onChange, type = "text", list }) {
  return (
    <div style={{ flex: 1, minWidth: 130 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: B.textMid, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.6 }}>{icon} {label}</div>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} list={list}
        style={{ width: "100%", border: `1.5px solid ${B.border}`, borderRadius: 10, padding: "10px 12px", fontSize: 14, fontFamily: "Poppins, sans-serif", color: B.textDark, background: B.white, outline: "none" }} />
      {list && (
        <datalist id={list}>
          {(list === "from-list" ? CITIES_FROM : CITIES_TO).map(c => <option key={c} value={c} />)}
        </datalist>
      )}
    </div>
  );
}

function Sel({ label, icon, options, value, onChange }) {
  return (
    <div style={{ flex: 1, minWidth: 110 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: B.textMid, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.6 }}>{icon} {label}</div>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ width: "100%", border: `1.5px solid ${B.border}`, borderRadius: 10, padding: "10px 12px", fontSize: 14, fontFamily: "Poppins, sans-serif", color: B.textDark, background: B.white }}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ── FLIGHT RESULTS ────────────────────────────────────────────
function FlightResults({ from, to, date, passengers }) {
  const routes = [
    { airline: "Aeroméxico",    code: "AM 231", dep: "06:15", arr: "07:50", dur: "1h 35m", stops: "Direct",  price: 320, badge: "Best Value" },
    { airline: "United Airlines",code: "UA 812", dep: "09:00", arr: "11:05", dur: "2h 05m", stops: "Direct",  price: 285, badge: "Cheapest" },
    { airline: "Volaris",       code: "Y4 540", dep: "14:20", arr: "16:30", dur: "2h 10m", stops: "Direct",  price: 210, badge: "" },
    { airline: "Spirit",        code: "NK 120", dep: "18:45", arr: "21:30", dur: "2h 45m", stops: "1 Stop",  price: 175, badge: "" },
  ];
  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ fontSize: 13, color: B.textMid, marginBottom: 14 }}>
        Showing <strong style={{ color: B.textDark }}>{routes.length} flights</strong> · {from || "MEX"} → {to || "MTY"} · {date} · {passengers} passenger{passengers > 1 ? "s" : ""}
      </div>
      {routes.map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, background: B.white, border: `1.5px solid ${r.badge ? B.purple : B.border}`, borderRadius: 14, padding: "16px 20px", marginBottom: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: B.offWhite, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>✈️</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 14 }}>{r.airline} <span style={{ color: B.textLight, fontWeight: 400 }}>{r.code}</span></div>
            <div style={{ fontSize: 12, color: B.textMid, marginTop: 2 }}>{r.dep} → {r.arr} · {r.dur} · {r.stops}</div>
          </div>
          {r.badge && <span style={{ fontSize: 11, fontWeight: 700, background: B.purple + "20", color: B.purple, borderRadius: 20, padding: "3px 10px", whiteSpace: "nowrap" }}>{r.badge}</span>}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "Sora, sans-serif", fontSize: 22, fontWeight: 800, color: B.navy }}>${r.price * passengers}</div>
            <div style={{ fontSize: 11, color: B.textLight }}>per group</div>
          </div>
          <button style={{ background: `linear-gradient(135deg, ${B.purple}, ${B.navyMid})`, border: "none", borderRadius: 10, padding: "10px 18px", color: B.white, fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>
            Select
          </button>
        </div>
      ))}
    </div>
  );
}

// ── HOTEL RESULTS ─────────────────────────────────────────────
function HotelResults({ destination, checkIn, checkOut, rooms, nights }) {
  const hotels = [
    { name: "Camino Real Monterrey",  stars: 4, dist: "2.1km from venue", price: 142, badge: "Team Favorite", emoji: "🏨", amenities: ["Pool", "Gym", "Breakfast"] },
    { name: "Grand Fiesta Americana", stars: 5, dist: "3.5km from venue", price: 210, badge: "Best Rated",    emoji: "⭐", amenities: ["Spa", "Pool", "Restaurant"] },
    { name: "Holiday Inn Express",    stars: 3, dist: "0.8km from venue", price: 88,  badge: "Closest",       emoji: "🏩", amenities: ["Breakfast", "Parking"] },
  ];
  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ fontSize: 13, color: B.textMid, marginBottom: 14 }}>
        Showing <strong style={{ color: B.textDark }}>{hotels.length} hotels</strong> in {destination || "Monterrey"} · {checkIn} – {checkOut} · {rooms} room{rooms > 1 ? "s" : ""}
      </div>
      {hotels.map((h, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, background: B.white, border: `1.5px solid ${h.badge ? B.purple : B.border}`, borderRadius: 14, padding: "16px 20px", marginBottom: 10 }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, background: B.offWhite, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{h.emoji}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 14 }}>{h.name}</div>
            <div style={{ fontSize: 12, color: B.textMid, marginTop: 2 }}>{"⭐".repeat(h.stars)} · {h.dist}</div>
            <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
              {h.amenities.map(a => <span key={a} style={{ fontSize: 10, background: B.offWhite, border: `1px solid ${B.border}`, borderRadius: 20, padding: "2px 8px", color: B.textMid }}>{a}</span>)}
            </div>
          </div>
          {h.badge && <span style={{ fontSize: 11, fontWeight: 700, background: B.purple + "20", color: B.purple, borderRadius: 20, padding: "3px 10px", whiteSpace: "nowrap" }}>{h.badge}</span>}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "Sora, sans-serif", fontSize: 22, fontWeight: 800, color: B.navy }}>${h.price * nights * rooms}</div>
            <div style={{ fontSize: 11, color: B.textLight }}>{nights} nights · {rooms} room{rooms > 1 ? "s" : ""}</div>
          </div>
          <button style={{ background: `linear-gradient(135deg, ${B.purple}, ${B.navyMid})`, border: "none", borderRadius: 10, padding: "10px 18px", color: B.white, fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>
            Book
          </button>
        </div>
      ))}
    </div>
  );
}

// ── BOOKING ENGINE ────────────────────────────────────────────
function BookingEngine() {
  const [tab, setTab]           = useState("flights");
  const [searched, setSearched] = useState(false);

  // Flights
  const [from, setFrom]         = useState("Mexico City (MEX)");
  const [to, setTo]             = useState("Monterrey (MTY)");
  const [depDate, setDepDate]   = useState("2026-07-13");
  const [retDate, setRetDate]   = useState("2026-07-15");
  const [pax, setPax]           = useState(10);
  const [tripType, setTripType] = useState("Round Trip");

  // Hotels
  const [dest, setDest]         = useState("Monterrey");
  const [checkIn, setCheckIn]   = useState("2026-07-13");
  const [checkOut, setCheckOut] = useState("2026-07-15");
  const [rooms, setRooms]       = useState(5);
  const [guestsPerRoom, setGuestsPerRoom] = useState(2);

  // Cars
  const [carPickup, setCarPickup]     = useState("Monterrey Airport (MTY)");
  const [carPickDate, setCarPickDate] = useState("2026-07-13");
  const [carDropDate, setCarDropDate] = useState("2026-07-15");
  const [carType, setCarType]         = useState("SUV");

  // Tours
  const [tourDest, setTourDest]       = useState("Cancún, Mexico");
  const [tourDate, setTourDate]       = useState("2026-07-13");
  const [tourPax, setTourPax]         = useState(10);
  const [tourType, setTourType]       = useState("Group Tour");

  // Calculate nights dynamically
  const nights = Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)));

  const tabs = [
    { id: "flights", icon: "✈️", label: "Flights" },
    { id: "hotels",  icon: "🏨", label: "Hotels" },
    { id: "cars",    icon: "🚗", label: "Cars" },
    { id: "tours",   icon: "🗺️", label: "Tours" },
  ];

  function handleTabChange(id) {
    setTab(id);
    setSearched(false);
  }

  return (
    <div style={{ background: B.white, borderRadius: 20, boxShadow: "0 8px 48px rgba(110,70,200,0.13)", overflow: "hidden", border: `1px solid ${B.border}` }}>
      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${B.border}` }}>
        {tabs.map(tb => (
          <button key={tb.id} onClick={() => handleTabChange(tb.id)}
            style={{ flex: 1, padding: "16px 8px", border: "none", background: tab === tb.id ? B.offWhite : B.white, borderBottom: tab === tb.id ? `3px solid ${B.purple}` : "3px solid transparent", cursor: "pointer", fontFamily: "Sora, sans-serif", fontWeight: tab === tb.id ? 700 : 500, fontSize: 14, color: tab === tb.id ? B.purple : B.textMid, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <span>{tb.icon}</span> {tb.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "24px 28px" }}>

        {/* FLIGHTS */}
        {tab === "flights" && (
          <>
            <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
              {["Round Trip", "One Way", "Multi-City"].map(opt => (
                <label key={opt} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: tripType === opt ? B.purple : B.textMid, fontWeight: tripType === opt ? 600 : 400, cursor: "pointer" }}>
                  <input type="radio" name="trip" checked={tripType === opt} onChange={() => setTripType(opt)} style={{ accentColor: B.purple }} /> {opt}
                </label>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
              <Inp label="From" icon="📍" value={from} onChange={setFrom} list="from-list" />
              <button onClick={() => { const tmp = from; setFrom(to); setTo(tmp); }}
                style={{ background: B.offWhite, border: `1px solid ${B.border}`, borderRadius: 10, width: 36, height: 36, cursor: "pointer", fontSize: 16, flexShrink: 0, alignSelf: "flex-end", marginBottom: 1 }}>⇄</button>
              <Inp label="To" icon="📍" value={to} onChange={setTo} list="to-list" />
              <Inp label="Departure" icon="📅" value={depDate} onChange={setDepDate} type="date" />
              {tripType === "Round Trip" && <Inp label="Return" icon="📅" value={retDate} onChange={setRetDate} type="date" />}
              <Sel label="Passengers" icon="👥" value={pax} onChange={v => setPax(Number(v))} options={[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]} />
              <button onClick={() => setSearched(true)}
                style={{ background: `linear-gradient(135deg, ${B.purple}, ${B.navyMid})`, border: "none", borderRadius: 12, padding: "12px 28px", color: B.white, fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer", alignSelf: "flex-end", whiteSpace: "nowrap" }}>
                🔍 Search Flights
              </button>
            </div>
            {searched && <FlightResults from={from} to={to} date={depDate} passengers={pax} />}
          </>
        )}

        {/* HOTELS */}
        {tab === "hotels" && (
          <>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
              <Inp label="Destination" icon="📍" value={dest} onChange={setDest} />
              <Inp label="Check-in" icon="📅" value={checkIn} onChange={setCheckIn} type="date" />
              <Inp label="Check-out" icon="📅" value={checkOut} onChange={setCheckOut} type="date" />
              <Sel label="Rooms" icon="🛏️" value={rooms} onChange={v => setRooms(Number(v))} options={[1,2,3,4,5,6,7,8,9,10]} />
              <Sel label="Guests/Room" icon="👥" value={guestsPerRoom} onChange={v => setGuestsPerRoom(Number(v))} options={[1,2,3,4]} />
              <button onClick={() => setSearched(true)}
                style={{ background: `linear-gradient(135deg, ${B.purple}, ${B.navyMid})`, border: "none", borderRadius: 12, padding: "12px 28px", color: B.white, fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer", alignSelf: "flex-end", whiteSpace: "nowrap" }}>
                🔍 Search Hotels
              </button>
            </div>
            {searched && <HotelResults destination={dest} checkIn={checkIn} checkOut={checkOut} rooms={rooms} nights={nights} />}
          </>
        )}

        {/* CARS */}
        {tab === "cars" && (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
            <Inp label="Pick-up Location" icon="📍" value={carPickup} onChange={setCarPickup} />
            <Inp label="Pick-up Date" icon="📅" value={carPickDate} onChange={setCarPickDate} type="date" />
            <Inp label="Drop-off Date" icon="📅" value={carDropDate} onChange={setCarDropDate} type="date" />
            <Sel label="Car Type" icon="🚗" value={carType} onChange={setCarType} options={["Economy", "Compact", "SUV", "Van", "Minibus"]} />
            <button onClick={() => setSearched(true)}
              style={{ background: `linear-gradient(135deg, ${B.purple}, ${B.navyMid})`, border: "none", borderRadius: 12, padding: "12px 28px", color: B.white, fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer", alignSelf: "flex-end" }}>
              🔍 Search Cars
            </button>
            {searched && (
              <div style={{ width: "100%", marginTop: 20, padding: "16px 20px", background: B.offWhite, borderRadius: 14, border: `1px solid ${B.border}`, fontSize: 14, color: B.textMid }}>
                3 {carType} vehicles found near {carPickup} — <strong style={{ color: B.purple }}>Prices from $45/day</strong>. Full inventory coming soon.
              </div>
            )}
          </div>
        )}

        {/* TOURS */}
        {tab === "tours" && (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
            <Inp label="Destination" icon="📍" value={tourDest} onChange={setTourDest} />
            <Inp label="Travel Date" icon="📅" value={tourDate} onChange={setTourDate} type="date" />
            <Sel label="Travelers" icon="👥" value={tourPax} onChange={v => setTourPax(Number(v))} options={[1,2,3,4,5,6,7,8,9,10,15,20,25,30]} />
            <Sel label="Tour Type" icon="🗺️" value={tourType} onChange={setTourType} options={["Group Tour", "Private Tour", "Event Package", "Cultural", "Adventure"]} />
            <button onClick={() => setSearched(true)}
              style={{ background: `linear-gradient(135deg, ${B.purple}, ${B.navyMid})`, border: "none", borderRadius: 12, padding: "12px 28px", color: B.white, fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer", alignSelf: "flex-end" }}>
              🔍 Search Tours
            </button>
            {searched && (
              <div style={{ width: "100%", marginTop: 20, padding: "16px 20px", background: B.offWhite, borderRadius: 14, border: `1px solid ${B.border}`, fontSize: 14, color: B.textMid }}>
                5 {tourType} packages found in {tourDest} for {tourPax} travelers — <strong style={{ color: B.purple }}>From $299/person</strong>. Full catalog coming soon.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────
export default function Page() {
  const [email, setEmail]   = useState("");
  const [subDone, setSubDone] = useState(false);

  return (
    <div style={{ fontFamily: "Poppins, sans-serif", background: B.white }}>
      <style>{fontStyle}</style>

      {/* ── NAV ── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: B.white, borderBottom: `1px solid ${B.border}`, padding: "0 32px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", alignItems: "center", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", marginRight: 40 }}>
            <img src="/Logo-N.png" alt="Oriz Travel" style={{ height: 44, width: "auto", objectFit: "contain" }} />
          </div>
          <div style={{ display: "flex", gap: 28, flex: 1 }}>
            {["Flights", "Hotels", "Cars", "B2B Portal"].map(l => (
              <a key={l} href="#" style={{ fontSize: 13, color: B.textMid, textDecoration: "none", fontWeight: 500 }}>{l}</a>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{ background: "transparent", border: `1.5px solid ${B.border}`, borderRadius: 10, padding: "8px 18px", color: B.navy, fontFamily: "Sora, sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Sign In</button>
            <button style={{ background: `linear-gradient(135deg, ${B.purple}, ${B.navyMid})`, border: "none", borderRadius: 10, padding: "8px 18px", color: B.white, fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ background: `linear-gradient(160deg, ${B.navy} 0%, ${B.navyMid} 50%, ${B.purple}55 100%)`, padding: "72px 32px 0", minHeight: 540, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 400, height: 400, borderRadius: "50%", background: B.purple + "18", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 40, left: -80, width: 300, height: 300, borderRadius: "50%", background: B.purpleDeep + "15", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1140, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ display: "inline-block", background: B.purple + "30", border: `1px solid ${B.purple}55`, borderRadius: 20, padding: "5px 16px", fontSize: 12, color: B.white, fontWeight: 600, marginBottom: 16, letterSpacing: 0.8 }}>
              ✦ FLIGHTS · HOTELS · CARS · GROUPS · PERSONAL
            </div>
            <h1 style={{ fontSize: 52, fontWeight: 800, color: B.white, lineHeight: 1.15, marginBottom: 16, fontFamily: "Sora, sans-serif" }}>
              Travel Smarter.<br />
              <span style={{ color: B.purple }}>Solo or Together.</span>
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.75)", maxWidth: 560, margin: "0 auto 20px" }}>
              Book flights, hotels, and cars for yourself — or organize travel for your entire group. One platform, every trip.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              {[{icon:"🧳",label:"Solo Travelers"},{icon:"👥",label:"Groups & Teams"},{icon:"🏢",label:"Corporate Travel"},{icon:"⚽",label:"Sports Organizations"},{icon:"🔧",label:"Work Crews"}].map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, padding: "5px 14px", fontSize: 12, color: B.white, fontWeight: 500 }}>
                  <span>{p.icon}</span>{p.label}
                </div>
              ))}
            </div>
          </div>
          <BookingEngine />
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: B.navy, padding: "28px 32px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 20 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Sora, sans-serif", fontSize: 30, fontWeight: 800, color: B.purple }}>{s.val}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOR EVERYONE ── */}
      <section style={{ padding: "80px 32px", background: B.white }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: B.purple, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>One Platform, Every Trip</div>
            <h2 style={{ fontFamily: "Sora, sans-serif", fontSize: 38, fontWeight: 800, color: B.navy, marginBottom: 12 }}>Traveling alone or with a group?<br/>We've got you covered.</h2>
            <p style={{ color: B.textMid, fontSize: 15, maxWidth: 500, margin: "0 auto" }}>Whether you're booking a solo weekend getaway or organizing travel for 50 people — Oriz Travel handles both.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Personal */}
            <div style={{ background: `linear-gradient(135deg, ${B.offWhite}, ${B.white})`, border: `2px solid ${B.border}`, borderRadius: 24, padding: "36px 32px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: B.purple + "08" }} />
              <div style={{ fontSize: 12, fontWeight: 700, color: B.purple, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>For Individuals</div>
              <h3 style={{ fontFamily: "Sora, sans-serif", fontSize: 26, fontWeight: 800, color: B.navy, marginBottom: 10 }}>Book your own trips, your way.</h3>
              <p style={{ fontSize: 14, color: B.textMid, lineHeight: 1.7, marginBottom: 24 }}>Search and book flights, hotels, and cars just like Expedia — but smarter. Your passport, payment, and loyalty points are saved from day one.</p>
              {["Search real-time flights & hotels","Save your passport & preferences","Track all your loyalty points","AI suggests best deals for your routes","Manage all trips in one place"].map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13, color: B.textMid, marginBottom: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: B.purple + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: B.purple, fontWeight: 700, flexShrink: 0 }}>✓</div>
                  {f}
                </div>
              ))}
              <button style={{ marginTop: 8, background: `linear-gradient(135deg, ${B.purple}, ${B.navyMid})`, border: "none", borderRadius: 12, padding: "13px 28px", color: B.white, fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                Book a Personal Trip →
              </button>
            </div>
            {/* Group */}
            <div style={{ background: `linear-gradient(135deg, ${B.navy}, ${B.navyMid})`, borderRadius: 24, padding: "36px 32px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: B.purple + "25" }} />
              <div style={{ fontSize: 12, fontWeight: 700, color: B.purple, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>For Groups & Organizations</div>
              <h3 style={{ fontFamily: "Sora, sans-serif", fontSize: 26, fontWeight: 800, color: B.white, marginBottom: 10 }}>Organize travel for your entire group.</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 24 }}>Sports teams, work crews, corporate groups — book every traveler from their own city with one event.</p>
              {["Per-traveler flights from any city","Group hotel block in one booking","Manager approval & budget control","Every traveler gets a mobile itinerary","Membership points across the whole group"].map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13, color: "rgba(255,255,255,0.75)", marginBottom: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: B.purple + "40", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: B.purple, fontWeight: 700, flexShrink: 0 }}>✓</div>
                  {f}
                </div>
              ))}
              <button style={{ marginTop: 8, background: B.purple, border: "none", borderRadius: 12, padding: "13px 28px", color: B.white, fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                Organize Group Travel →
              </button>
            </div>
          </div>
          {/* Bridge */}
          <div style={{ marginTop: 20, background: B.offWhite, border: `1px solid ${B.border}`, borderRadius: 16, padding: "18px 24px", display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 24 }}>💡</span>
            <div>
              <span style={{ fontWeight: 700, color: B.navy, fontSize: 14 }}>Already part of a group? </span>
              <span style={{ fontSize: 14, color: B.textMid }}>Once your manager adds you to a trip, your profile is ready. Use it anytime to book your own personal travel — no signup needed.</span>
            </div>
            <button style={{ marginLeft: "auto", background: "transparent", border: `1.5px solid ${B.purple}`, borderRadius: 10, padding: "8px 18px", color: B.purple, fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
              Learn more →
            </button>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: "80px 32px", background: B.offWhite }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: B.purple, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Why Choose Us</div>
            <h2 style={{ fontFamily: "Sora, sans-serif", fontSize: 36, fontWeight: 800, color: B.navy }}>Everything you need. Solo or as a group.</h2>
            <p style={{ color: B.textMid, fontSize: 15, marginTop: 10, maxWidth: 500, margin: "10px auto 0" }}>Personal trips, group events, corporate travel — one platform handles it all.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {[
              {icon:"📍", title:"Per-Traveler Booking",  desc:"Each traveler flies from their city. We handle different origins, one event."},
              {icon:"💎", title:"Membership Points",     desc:"Track and redeem airline & hotel points across all your memberships."},
              {icon:"✦",  title:"AI Recommendations",   desc:"Smart suggestions for best flights, timing, and savings for your group."},
              {icon:"📱", title:"Traveler Mobile View",  desc:"Every traveler gets their own boarding pass and hotel info on their phone."},
              {icon:"✅", title:"Manager Approvals",     desc:"Set budgets, approve expenses, and manage policies with one click."},
              {icon:"🔒", title:"Secure Payments",       desc:"Stripe-powered payments with virtual cards per event."},
            ].map((f, i) => (
              <div key={i} style={{ background: B.white, border: `1px solid ${B.border}`, borderRadius: 16, padding: "24px" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: B.purple + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 14 }}>{f.icon}</div>
                <div style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 8, color: B.textDark }}>{f.title}</div>
                <div style={{ fontSize: 13, color: B.textMid, lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "80px 32px", background: `linear-gradient(160deg, ${B.navy}, ${B.navyMid})` }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: B.purple, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>How It Works</div>
          <h2 style={{ fontFamily: "Sora, sans-serif", fontSize: 34, fontWeight: 800, color: B.white, marginBottom: 48 }}>Book in 4 simple steps</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
            {[
              {step:"01", icon:"📅", title:"Create Event",          desc:"Set your destination, date, and purpose. Add all travelers to the group."},
              {step:"02", icon:"✈️", title:"Book Flights",          desc:"Each traveler gets a flight from their city. AI finds the best options."},
              {step:"03", icon:"🏨", title:"Reserve Hotel",         desc:"One group block for the whole team — nearby the venue."},
              {step:"04", icon:"📱", title:"Travelers Get Notified",desc:"Everyone receives their itinerary on their phone instantly."},
            ].map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18, padding: "28px 20px", textAlign: "left" }}>
                <div style={{ fontFamily: "Sora, sans-serif", fontSize: 36, fontWeight: 900, color: B.purple + "66", marginBottom: 12 }}>{s.step}</div>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
                <div style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 16, color: B.white, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ padding: "80px 32px", background: B.offWhite }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: B.purple, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Pricing</div>
          <h2 style={{ fontFamily: "Sora, sans-serif", fontSize: 34, fontWeight: 800, color: B.navy, marginBottom: 8 }}>Simple, transparent pricing</h2>
          <p style={{ color: B.textMid, marginBottom: 48 }}>No booking fees. Pay only your SaaS subscription.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, maxWidth: 860, margin: "0 auto" }}>
            {[
              {name:"Starter", price:99,  period:"/mo", desc:"1 group · up to 20 travelers",         features:["Flights & Hotels","Personal Bookings","Traveler Mobile View","Basic Reports","Email Support"],        accent:false},
              {name:"Pro",     price:249, period:"/mo", desc:"Up to 5 groups · unlimited travelers",  features:["Everything in Starter","Membership Points","AI Recommendations","Virtual Cards","Priority Support"],  accent:true},
              {name:"League",  price:599, period:"/mo", desc:"Unlimited groups & organizations",       features:["Everything in Pro","White-label","API Access","Dedicated Manager","Custom Integrations"],             accent:false},
            ].map((pl, i) => (
              <div key={i} style={{ background: pl.accent ? `linear-gradient(160deg, ${B.purple}, ${B.navyMid})` : B.white, border: `1.5px solid ${pl.accent ? "transparent" : B.border}`, borderRadius: 20, padding: "32px 24px", position: "relative" }}>
                {pl.accent && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: B.purple, color: B.white, fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "4px 14px", whiteSpace: "nowrap" }}>Most Popular</div>}
                <div style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 16, color: pl.accent ? B.white : B.navy, marginBottom: 4 }}>{pl.name}</div>
                <div style={{ fontSize: 13, color: pl.accent ? "rgba(255,255,255,0.7)" : B.textMid, marginBottom: 20 }}>{pl.desc}</div>
                <div style={{ fontFamily: "Sora, sans-serif", fontSize: 44, fontWeight: 800, color: pl.accent ? B.white : B.navy }}>
                  ${pl.price}<span style={{ fontSize: 16, fontWeight: 500, color: pl.accent ? "rgba(255,255,255,0.6)" : B.textMid }}>{pl.period}</span>
                </div>
                <div style={{ margin: "20px 0", borderTop: `1px solid ${pl.accent ? "rgba(255,255,255,0.15)" : B.border}` }} />
                {pl.features.map((f, j) => (
                  <div key={j} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10, fontSize: 13, color: pl.accent ? "rgba(255,255,255,0.85)" : B.textMid }}>
                    <span style={{ color: pl.accent ? B.white : B.purple, fontSize: 14 }}>✓</span> {f}
                  </div>
                ))}
                <button style={{ width: "100%", marginTop: 20, background: pl.accent ? B.white : `linear-gradient(135deg, ${B.purple}, ${B.navyMid})`, color: pl.accent ? B.purple : B.white, border: "none", borderRadius: 12, padding: "12px", fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section style={{ padding: "60px 32px", background: B.white }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Sora, sans-serif", fontSize: 28, fontWeight: 800, color: B.navy, marginBottom: 8 }}>Get the best travel deals</h2>
          <p style={{ color: B.textMid, fontSize: 14, marginBottom: 24 }}>Join 12,000+ travelers and managers getting exclusive flight deals, hotel offers, and travel tips.</p>
          {subDone ? (
            <div style={{ background: B.purple + "18", border: `1px solid ${B.purple}44`, borderRadius: 14, padding: "16px 24px", color: B.purple, fontWeight: 600 }}>✓ You're in! Check your inbox.</div>
          ) : (
            <div style={{ display: "flex", gap: 10 }}>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                style={{ flex: 1, border: `1.5px solid ${B.border}`, borderRadius: 12, padding: "12px 16px", fontSize: 14, fontFamily: "Poppins, sans-serif", color: B.textDark, outline: "none" }} />
              <button onClick={() => email && setSubDone(true)}
                style={{ background: `linear-gradient(135deg, ${B.purple}, ${B.navyMid})`, border: "none", borderRadius: 12, padding: "12px 22px", color: B.white, fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap" }}>
                Subscribe
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: B.navy, padding: "48px 32px 24px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ marginBottom: 14 }}>
                <img src="/Logo-N.png" alt="Oriz Travel" style={{ height: 40, width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)" }} />
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 240 }}>
                Your trusted partner for corporate and group travel worldwide. Where Business Meets the World.
              </p>
            </div>
            {[
              {title:"Product", links:["Flights","Hotels","Cars","Tours","B2B Portal"]},
              {title:"Company", links:["About Us","Blog","Careers","Press","Contact"]},
              {title:"Support", links:["Help Center","API Docs","Status","Privacy Policy","Terms"]},
            ].map((col, i) => (
              <div key={i}>
                <div style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 13, color: B.white, marginBottom: 14, letterSpacing: 0.5 }}>{col.title}</div>
                {col.links.map(l => (
                  <a key={l} href="#" style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 9 }}>{l}</a>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>© 2026 Oriz Travel. All rights reserved.</div>
            <div style={{ display: "flex", gap: 14 }}>
              {["𝕏","in","f","📸"].map((s, i) => (
                <a key={i} href="#" style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

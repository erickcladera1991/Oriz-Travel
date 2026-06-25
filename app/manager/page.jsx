"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// ── ORIZ TRAVEL BRAND ─────────────────────────────────────────
const B = {
  // Brand colors
  purple:     "#AE4CED",
  purpleMid:  "#7077E2",
  purpleDim:  "#AE4CED18",
  purpleBorder:"#AE4CED33",
  navy:       "#253A5E",
  navyMid:    "#2B369E",
  navyLight:  "#57739B",
  // UI
  bg:         "#F7F5FF",
  surface:    "#FFFFFF",
  surfaceHi:  "#F1EFF8",
  border:     "#E2DEFF",
  borderMid:  "#C8C0F0",
  // Status
  green:      "#00C48C",
  greenDim:   "#00C48C15",
  greenBorder:"#00C48C33",
  amber:      "#F5A623",
  amberDim:   "#F5A62315",
  red:        "#FF5C5C",
  redDim:     "#FF5C5C15",
  // Text
  text:       "#1A1240",
  textMid:    "#4A5578",
  textLight:  "#8A94B2",
  textDim:    "#B8C0D4",
};

const font = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Poppins',sans-serif;background:${B.bg};color:${B.text};}
  h1,h2,h3,h4,h5{font-family:'Sora',sans-serif;}
  input,select,textarea{font-family:'Poppins',sans-serif;}
  input[type=range]{accent-color:${B.purple};}
  ::-webkit-scrollbar{width:4px;height:4px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:${B.border};border-radius:4px;}
`;

// ── DATA ──────────────────────────────────────────────────────
const GROUP = {
  name:"Tigres FC", type:"Soccer Team", logo:"🐯",
  manager:"Coach Rivera", email:"rivera@tigresfc.mx",
  plan:"Pro", budget:45000, spent:18400,
  travelers:10, events:2,
};

const TRAVELERS = [
  {id:1,  name:"Carlos Mendoza",  role:"Goalkeeper",   number:1,  city:"Mexico City",  code:"MEX", status:"confirmed", avatar:"CM", email:"carlos@tigres.mx"},
  {id:2,  name:"Diego Ramírez",   role:"Defender",     number:4,  city:"Guadalajara",  code:"GDL", status:"confirmed", avatar:"DR", email:"diego@tigres.mx"},
  {id:3,  name:"Andrés Torres",   role:"Defender",     number:5,  city:"Mexico City",  code:"MEX", status:"confirmed", avatar:"AT", email:"andres@tigres.mx"},
  {id:4,  name:"Luis Herrera",    role:"Midfielder",   number:8,  city:"Monterrey",    code:"MTY", status:"pending",   avatar:"LH", email:"luis@tigres.mx"},
  {id:5,  name:"Marcos Vega",     role:"Midfielder",   number:10, city:"Mexico City",  code:"MEX", status:"confirmed", avatar:"MV", email:"marcos@tigres.mx"},
  {id:6,  name:"Javier Ríos",     role:"Forward",      number:9,  city:"Tijuana",      code:"TIJ", status:"confirmed", avatar:"JR", email:"javier@tigres.mx"},
  {id:7,  name:"Roberto Silva",   role:"Forward",      number:11, city:"Mexico City",  code:"MEX", status:"confirmed", avatar:"RS", email:"roberto@tigres.mx"},
  {id:8,  name:"Felipe Castro",   role:"Defender",     number:3,  city:"Puebla",       code:"PBC", status:"confirmed", avatar:"FC", email:"felipe@tigres.mx"},
  {id:9,  name:"Santiago López",  role:"Midfielder",   number:6,  city:"Guadalajara",  code:"GDL", status:"pending",   avatar:"SL", email:"santiago@tigres.mx"},
  {id:10, name:"Emilio Navarro",  role:"Goalkeeper",   number:13, city:"Mexico City",  code:"MEX", status:"confirmed", avatar:"EN", email:"emilio@tigres.mx"},
];

const EVENTS = [
  {id:1, name:"Regional Final — Monterrey", date:"Jul 14, 2026", rival:"Rayados Sub-20", venue:"Estadio BBVA", status:"confirmed", flights:10, hotel:true, cost:12400},
  {id:2, name:"Semifinal — Guadalajara",    date:"Jul 28, 2026", rival:"Chivas Sub-20",  venue:"Estadio Akron",status:"planning",  flights:6,  hotel:false,cost:5800},
];

const MEMBERSHIPS = [
  {id:1, name:"Aeroméxico Club Premier", logo:"✈️", color:B.navyMid, tier:"Platinum", points:284500, value:0.012, expiry:"Dec 2027"},
  {id:2, name:"Marriott Bonvoy",         logo:"🏨", color:B.amber,   tier:"Gold Elite",points:156000, value:0.008, expiry:"Mar 2028"},
  {id:3, name:"Volaris V-Club",          logo:"🟣", color:B.green,   tier:"Silver",    points:48200,  value:0.009, expiry:"Sep 2026"},
];

const EXPENSES = [
  {id:1, who:"Marcos Vega",    what:"Airport food",   amount:320, status:"approved", event:"Regional Final", date:"Jun 13"},
  {id:2, who:"Luis Herrera",   what:"Pharmacy",       amount:180, status:"pending",  event:"Regional Final", date:"Jun 13"},
  {id:3, who:"Diego Ramírez",  what:"Taxi to stadium",amount:250, status:"approved", event:"Regional Final", date:"Jun 14"},
  {id:4, who:"Javier Ríos",    what:"Extra luggage",  amount:600, status:"pending",  event:"Regional Final", date:"Jun 13"},
];

// Corporate connections
const CORP_AIRLINES = [
  {id:"am",  name:"Aeroméxico",      logo:"✈️", program:"Club Premier Business", saving:"18%", color:"#001F5B", status:"connected",  corpId:"AM-TFC-447821"},
  {id:"ua",  name:"United Airlines", logo:"🔷", program:"PerksPlus",             saving:"15%", color:"#0033A0", status:"connected",  corpId:"UA-TFC-88234"},
  {id:"dl",  name:"Delta",           logo:"🔴", program:"SkyBonus",              saving:"12%", color:"#E01933", status:"pending",    corpId:""},
  {id:"vb",  name:"Volaris",         logo:"🟣", program:"V-Corp",                saving:"20%", color:"#7B2D8B", status:"available",  corpId:""},
  {id:"aa",  name:"American Airlines",logo:"🔵",program:"Business Extra",        saving:"14%", color:"#0078D2", status:"available",  corpId:""},
];
const CORP_HOTELS = [
  {id:"mr",  name:"Marriott Bonvoy", logo:"🏨", program:"Bonvoy for Business",  saving:"22%", color:"#8B0000", status:"connected",  corpId:"MBY-TFC-88234"},
  {id:"hi",  name:"Hilton",          logo:"🏩", program:"Hilton for Business",  saving:"18%", color:"#003087", status:"available",  corpId:""},
  {id:"ih",  name:"IHG",             logo:"🏦", program:"Business Rewards",     saving:"15%", color:"#006A4E", status:"available",  corpId:""},
];

// Flight routes mock
const ROUTES = {
  "MEX-MTY":[
    {id:"f1",airline:"Aeroméxico",code:"AM 231",dep:"06:15",arr:"07:50",dur:"1h 35m",stops:"Direct",price:3200,rec:true,  memId:1,earn:1840,redeem:2200,saving:26},
    {id:"f2",airline:"Volaris",   code:"Y4 890",dep:"08:40",arr:"10:25",dur:"1h 45m",stops:"Direct",price:2650,rec:false, memId:3,earn:910, redeem:1500,saving:13},
  ],
  "GDL-MTY":[
    {id:"f3",airline:"Aeroméxico",code:"AM 441",dep:"07:00",arr:"08:10",dur:"1h 10m",stops:"Direct",price:2800,rec:true,  memId:1,earn:1600,redeem:2000,saving:22},
  ],
  "TIJ-MTY":[
    {id:"f4",airline:"Aeroméxico",code:"AM 812",dep:"05:45",arr:"08:30",dur:"2h 45m",stops:"Direct",price:4100,rec:true,  memId:1,earn:2400,redeem:3200,saving:38},
  ],
  "PBC-MTY":[
    {id:"f5",airline:"Aeroméxico",code:"AM 320",dep:"07:30",arr:"09:15",dur:"1h 45m",stops:"Direct",price:2900,rec:true,  memId:1,earn:1700,redeem:2100,saving:24},
  ],
};
const HOTELS_LIST = [
  {id:1,name:"Camino Real Monterrey",stars:4,dist:"2.1km from venue",price:4200,rooms:5,amenities:["Pool","Gym","Breakfast"],rec:true, note:"Group room block available.",   memId:2,earn:8400,redeem:25000,saving:200},
  {id:2,name:"Fiesta Inn Estadio",   stars:3,dist:"0.8km from venue",price:3100,rooms:5,amenities:["Gym","Breakfast"],       rec:false,note:"Closest but no group lounge.",  memId:null,earn:0,redeem:0,saving:0},
  {id:3,name:"Holiday Inn Express",  stars:3,dist:"4.5km from venue",price:2800,rooms:5,amenities:["Breakfast"],             rec:false,note:"Far from venue.",               memId:null,earn:0,redeem:0,saving:0},
];

// ── HELPERS ──────────────────────────────────────────────────
const fmt  = n => `$${Number(n).toLocaleString()}`;
const fpts = n => `${Number(n).toLocaleString()} pts`;
const pct  = (a,b) => Math.min(100,Math.round((a/b)*100));
const groupByCity = arr => arr.reduce((acc,p)=>{
  const k=`${p.city} (${p.code})`; if(!acc[k])acc[k]=[]; acc[k].push(p); return acc;
},{});

// ── SHARED UI ─────────────────────────────────────────────────
function Avatar({initials,color,size=32}){
  return <div style={{width:size,height:size,borderRadius:size*0.3,background:color+"22",border:`1.5px solid ${color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.33,fontWeight:800,color,flexShrink:0}}>{initials}</div>;
}
function Badge({color,children,small}){
  const sz=small?{fontSize:10,padding:"2px 8px"}:{fontSize:11,padding:"3px 10px"};
  return <span style={{...sz,borderRadius:20,fontWeight:700,background:color+"20",color,border:`1px solid ${color}44`,whiteSpace:"nowrap",display:"inline-block"}}>{children}</span>;
}
function Btn({children,primary,ghost,small,danger,purple:isPurple,onClick,disabled}){
  const base={border:"none",borderRadius:8,fontWeight:700,cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.4:1,fontSize:small?11:13,padding:small?"6px 12px":"10px 20px",fontFamily:"Sora,sans-serif",transition:"all 0.15s",whiteSpace:"nowrap"};
  const s=primary?{...base,background:`linear-gradient(135deg,${B.purple},${B.navyMid})`,color:"#fff"}
    :isPurple?{...base,background:B.purple,color:"#fff"}
    :danger?{...base,background:B.redDim,color:B.red,border:`1px solid ${B.red}33`}
    :ghost?{...base,background:"transparent",color:B.textMid,border:`1px solid ${B.border}`}
    :{...base,background:B.surfaceHi,color:B.text,border:`1px solid ${B.border}`};
  return <button style={s} onClick={onClick} disabled={disabled}>{children}</button>;
}
function Card({children,style={}}){
  return <div style={{background:B.surface,border:`1px solid ${B.border}`,borderRadius:14,...style}}>{children}</div>;
}
function Section({title,action,children}){
  return(
    <div style={{marginBottom:28}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:15,color:B.text}}>{title}</div>
        {action}
      </div>
      {children}
    </div>
  );
}
function Input({label,value,onChange,placeholder,type="text"}){
  return(
    <div>
      {label&&<label style={{fontSize:11,fontWeight:600,color:B.textMid,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:0.5}}>{label}</label>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{width:"100%",border:`1.5px solid ${B.border}`,borderRadius:9,padding:"10px 13px",fontSize:13,color:B.text,background:B.surface,outline:"none"}}/>
    </div>
  );
}

// ── SIDEBAR ──────────────────────────────────────────────────
function Sidebar({screen,setScreen}){
  const router = useRouter();
  const nav=[
    {id:"dashboard",  icon:"⊞",  label:"Dashboard"},
    {id:"booking",    icon:"🗺️", label:"Booking"},
    {id:"events",     icon:"📅", label:"Events"},
    {id:"travelers",  icon:"👥", label:"Travelers"},
    {id:"memberships",icon:"💎", label:"Memberships"},
    {id:"expenses",   icon:"💳", label:"Expenses"},
    {id:"reports",    icon:"📊", label:"Reports"},
    {id:"settings",   icon:"⚙️", label:"Settings"},
  ];
  const budgetPct = pct(GROUP.spent,GROUP.budget);
  return(
    <div style={{width:210,background:B.surface,borderRight:`1px solid ${B.border}`,display:"flex",flexDirection:"column",flexShrink:0,height:"100vh"}}>
      {/* Logo */}
      <div style={{padding:"18px 16px",borderBottom:`1px solid ${B.border}`}}>
        <img src="/Logo-N.png" alt="Oriz Travel" style={{height:32,objectFit:"contain",marginBottom:14}}/>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,borderRadius:10,background:B.purple+"20",border:`1px solid ${B.purple}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{GROUP.logo}</div>
          <div>
            <div style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:13,color:B.text}}>{GROUP.name}</div>
            <div style={{fontSize:11,color:B.textLight}}>{GROUP.type}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{padding:"10px 8px",flex:1,overflowY:"auto"}}>
        {nav.map(n=>(
          <button key={n.id} onClick={()=>setScreen(n.id)}
            style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:9,border:"none",cursor:"pointer",marginBottom:2,textAlign:"left",
              background:screen===n.id?B.purple+"18":"transparent",
              color:screen===n.id?B.purple:B.textMid,
              fontWeight:screen===n.id?700:500,fontSize:13}}>
            <span style={{fontSize:16}}>{n.icon}</span>{n.label}
            {n.id==="expenses"&&<span style={{marginLeft:"auto",background:B.amber+"20",color:B.amber,fontSize:10,fontWeight:700,borderRadius:20,padding:"1px 7px"}}>2</span>}
          </button>
        ))}
      </nav>

      {/* Budget */}
      <div style={{padding:"14px 16px",borderTop:`1px solid ${B.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
          <span style={{fontSize:11,color:B.textLight}}>Season budget</span>
          <span style={{fontSize:11,fontWeight:700,color:B.text}}>{budgetPct}%</span>
        </div>
        <div style={{height:5,background:B.border,borderRadius:5,marginBottom:5}}>
          <div style={{height:"100%",width:`${budgetPct}%`,background:`linear-gradient(90deg,${B.purple},${B.navyMid})`,borderRadius:5}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between"}}>
          <span style={{fontSize:11,fontWeight:700,color:B.text}}>{fmt(GROUP.spent)}</span>
          <span style={{fontSize:11,color:B.textDim}}>{fmt(GROUP.budget)}</span>
        </div>
      </div>

      {/* User */}
      <div style={{padding:"12px 16px",borderTop:`1px solid ${B.border}`}}>
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
          <div style={{width:32,height:32,borderRadius:8,background:B.purple+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:B.purple}}>CR</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12,fontWeight:700,color:B.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{GROUP.manager}</div>
            <div style={{fontSize:10,color:B.textLight}}>Manager · {GROUP.plan} Plan</div>
          </div>
        </div>
        <button onClick={async()=>{await supabase.auth.signOut();router.replace("/login");}}
          style={{width:"100%",background:"transparent",border:`1px solid ${B.border}`,borderRadius:8,padding:"6px 10px",color:B.textMid,fontSize:11,cursor:"pointer",fontWeight:600}}>
          Sign out
        </button>
      </div>
    </div>
  );
}

// ── DASHBOARD ────────────────────────────────────────────────
function DashboardScreen({setScreen}){
  const totalPtsVal = MEMBERSHIPS.reduce((s,m)=>s+m.points*m.value,0);
  return(
    <div style={{padding:28,overflowY:"auto",flex:1}}>
      <div style={{marginBottom:24}}>
        <div style={{fontSize:11,color:B.purple,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",marginBottom:4}}>Welcome back</div>
        <div style={{fontFamily:"Sora,sans-serif",fontSize:26,fontWeight:800}}>Good morning, {GROUP.manager.split(" ")[1]} 👋</div>
        <div style={{fontSize:14,color:B.textMid,marginTop:4}}>You have 2 upcoming events and 2 pending expense approvals.</div>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
        {[
          {label:"Active Events",   val:"2",               sub:"this season",        color:B.navyMid},
          {label:"Travelers",       val:`${TRAVELERS.filter(t=>t.status==="confirmed").length}/10`, sub:"confirmed",  color:B.green},
          {label:"Points Value",    val:fmt(Math.round(totalPtsVal)), sub:`${MEMBERSHIPS.length} memberships`, color:B.purple},
          {label:"Pending Expenses",val:"2",               sub:"need approval",      color:B.amber},
        ].map((s,i)=>(
          <Card key={i} style={{padding:"18px 20px"}}>
            <div style={{fontSize:10,color:B.textLight,textTransform:"uppercase",letterSpacing:0.6,fontWeight:600,marginBottom:6}}>{s.label}</div>
            <div style={{fontFamily:"Sora,sans-serif",fontSize:26,fontWeight:800,color:s.color}}>{s.val}</div>
            <div style={{fontSize:11,color:B.textLight,marginTop:3}}>{s.sub}</div>
          </Card>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:20,marginBottom:20}}>
        {/* Upcoming events */}
        <Card style={{padding:"20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:14}}>Upcoming Events</div>
            <Btn small ghost onClick={()=>setScreen("events")}>View all</Btn>
          </div>
          {EVENTS.map(ev=>(
            <div key={ev.id} style={{display:"flex",gap:12,alignItems:"center",padding:"12px",background:B.surfaceHi,borderRadius:10,marginBottom:8}}>
              <div style={{width:40,height:40,borderRadius:10,background:ev.status==="confirmed"?B.purple+"18":B.amberDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>⚽</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:13}}>{ev.name}</div>
                <div style={{fontSize:11,color:B.textMid,marginTop:2}}>{ev.date} · {ev.venue}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <Badge color={ev.status==="confirmed"?B.green:B.amber} small>{ev.status==="confirmed"?"Confirmed":"Planning"}</Badge>
                <div style={{fontSize:12,fontWeight:700,marginTop:4}}>{fmt(ev.cost)}</div>
              </div>
            </div>
          ))}
        </Card>

        {/* Quick actions */}
        <Card style={{padding:"20px"}}>
          <div style={{fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:14,marginBottom:16}}>Quick Actions</div>
          {[
            {icon:"✈️",label:"Book flights",    sub:"Per-traveler from their city",  action:()=>setScreen("booking"),     color:B.navyMid},
            {icon:"🏨",label:"Reserve hotel",   sub:"Group block for next event",    action:()=>setScreen("booking"),     color:B.amber},
            {icon:"🚗",label:"Rent cars",        sub:"Vehicles for the group",        action:()=>setScreen("booking"),     color:B.green},
            {icon:"💎",label:"View points",     sub:`${fmt(Math.round(totalPtsVal))} available`, action:()=>setScreen("memberships"),color:B.purple},
          ].map((a,i)=>(
            <button key={i} onClick={a.action}
              style={{width:"100%",display:"flex",gap:12,alignItems:"center",padding:"11px 12px",background:"transparent",border:`1px solid ${B.border}`,borderRadius:10,cursor:"pointer",marginBottom:8,textAlign:"left",transition:"all 0.15s"}}>
              <div style={{width:34,height:34,borderRadius:9,background:a.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{a.icon}</div>
              <div>
                <div style={{fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:13}}>{a.label}</div>
                <div style={{fontSize:11,color:B.textLight,marginTop:1}}>{a.sub}</div>
              </div>
              <span style={{marginLeft:"auto",color:B.textDim,fontSize:14}}>›</span>
            </button>
          ))}
        </Card>
      </div>

      {/* AI tip */}
      <Card style={{padding:"16px 20px",background:B.purple+"10",border:`1px solid ${B.purple}33`}}>
        <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
          <span style={{fontSize:20}}>✦</span>
          <div>
            <div style={{fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:13,color:B.purple,marginBottom:4}}>AI Recommendation</div>
            <div style={{fontSize:13,color:B.text,lineHeight:1.6}}>
              For the Regional Final on Jul 14, flights on <strong>AM 231</strong> are 18% cheaper if booked this week.
              You also have <strong style={{color:B.purple}}>284,500 Club Premier pts</strong> — enough to save $264 on group flights.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ── BOOKING ──────────────────────────────────────────────────
function BookingScreen({bookings,setBookings}){
  const [mode,setMode]           = useState("home");
  const [selTravelers,setSelT]   = useState({});
  const [usePoints,setUsePoints] = useState({});
  const [selHotel,setSelHotel]   = useState(null);
  const [useHotelPts,setUHPts]   = useState(false);
  const [doneFlights,setDoneF]   = useState(false);
  const [doneHotel,setDoneH]     = useState(false);
  const [pickupLoc,setPickupLoc]=useState("Monterrey Airport (MTY)");
  const [pickupDate,setPickupDate]=useState("2026-07-13");
  const [dropDate,setDropDate]=useState("2026-07-15");
  const [selCar,setSelCar]=useState(null);
  const DEST = "MTY";

  function confirmFlights(){
    const nb={...bookings};
    TRAVELERS.forEach(t=>{
      const fid=selTravelers[t.id]; if(!fid)return;
      const rk=`${t.code}-${DEST}`;
      const fl=(ROUTES[rk]||[]).find(f=>f.id===fid); if(!fl)return;
      if(!nb[t.id])nb[t.id]={flights:[],hotel:null};
      nb[t.id].flights=[{...fl,date:"Jul 13, 2026",event:"Regional Final — Monterrey",usePoints:usePoints[fid]||false}];
    });
    setBookings(nb); setDoneF(true); setMode("home");
  }
  function confirmHotel(){
    const nb={...bookings};
    const h=HOTELS_LIST.find(h=>h.id===selHotel);
    TRAVELERS.forEach(t=>{
      if(!nb[t.id])nb[t.id]={flights:[],hotel:null};
      nb[t.id].hotel={...h,checkIn:"Jul 13, 2026",checkOut:"Jul 15, 2026",event:"Regional Final",usePoints:useHotelPts};
    });
    setBookings(nb); setDoneH(true); setMode("home");
  }

  if(mode==="home") return(
    <div style={{padding:28,overflowY:"auto",flex:1}}>
      <div style={{marginBottom:22}}>
        <div style={{fontFamily:"Sora,sans-serif",fontSize:22,fontWeight:800}}>Booking 🗺️</div>
        <div style={{fontSize:14,color:B.textMid,marginTop:4}}>Manage travel for your group — flights, hotels, and cars.</div>
      </div>

      {/* Event card */}
      <Card style={{padding:"18px 22px",marginBottom:22,background:`linear-gradient(135deg,${B.navy},${B.navyMid})`,border:"none"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.6)",fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",marginBottom:4}}>Next Event</div>
            <div style={{fontFamily:"Sora,sans-serif",fontSize:18,fontWeight:800,color:"#fff"}}>Regional Final — Monterrey</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.65)",marginTop:4}}>Jul 14, 2026 · vs Rayados Sub-20 · Estadio BBVA</div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"flex-end"}}>
            <Badge color={doneFlights?B.green:B.amber}>{doneFlights?`✈ ${Object.keys(selTravelers).length}/10 flights`:"✈ Flights pending"}</Badge>
            <Badge color={doneHotel?B.green:B.amber}>{doneHotel?"🏨 Hotel confirmed":"🏨 Hotel pending"}</Badge>
          </div>
        </div>
      </Card>

      {/* Tiles */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:24}}>
        {[
          {icon:"✈️",label:"Flights",    sub:doneFlights?`${Object.keys(selTravelers).length}/10 booked`:"Not booked",     color:B.navyMid, done:doneFlights, action:()=>setMode("flight")},
          {icon:"🏨",label:"Hotel",      sub:doneHotel?(HOTELS_LIST.find(h=>h.id===selHotel)?.name||"Confirmed"):"Not booked",color:B.amber, done:doneHotel,   action:()=>setMode("hotel")},
          {icon:"🚗",label:"Cars",       sub:"Book rental cars for the group",color:B.green,   done:false,        action:()=>setMode("car")},
        ].map((t,i)=>(
          <button key={i} onClick={t.action}
            style={{padding:"22px 20px",background:t.done?t.color+"12":B.surface,border:`1.5px solid ${t.done?t.color:B.border}`,borderRadius:14,cursor:"pointer",textAlign:"left"}}>
            <div style={{fontSize:30,marginBottom:10}}>{t.icon}</div>
            <div style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:15,color:t.done?t.color:B.text}}>{t.label}</div>
            <div style={{fontSize:12,color:B.textMid,marginTop:3}}>{t.sub}</div>
            {t.done&&<div style={{fontSize:11,color:t.color,marginTop:8,fontWeight:700}}>✓ Confirmed</div>}
          </button>
        ))}
      </div>

      {/* Travelers status */}
      <div style={{fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:13,color:B.textMid,textTransform:"uppercase",letterSpacing:0.8,marginBottom:12}}>Traveler Status</div>
      <div style={{display:"grid",gap:8}}>
        {TRAVELERS.map(t=>{
          const b=bookings[t.id];
          const hf=b?.flights?.length>0, hh=!!b?.hotel;
          return(
            <div key={t.id} style={{display:"flex",gap:12,alignItems:"center",padding:"11px 16px",background:B.surface,border:`1px solid ${B.border}`,borderRadius:10}}>
              <Avatar initials={t.avatar} color={t.status==="confirmed"?B.green:B.amber} size={32}/>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:13}}>{t.name}</div>
                <div style={{fontSize:11,color:B.textMid,marginTop:1}}>{t.role} · {t.city}</div>
              </div>
              <span style={{fontSize:14,opacity:hf?1:0.2}}>✈️</span>
              <span style={{fontSize:14,opacity:hh?1:0.2}}>🏨</span>
              {hf?<Badge color={B.green} small>{b.flights[0].code}</Badge>:<Badge color={B.textDim} small>No flight</Badge>}
            </div>
          );
        })}
      </div>
    </div>
  );

  // FLIGHTS
  if(mode==="flight"){
    const groups=Object.entries(groupByCity(TRAVELERS));
    return(
      <div style={{flex:1,overflowY:"auto",padding:28}}>
        <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:20}}>
          <button onClick={()=>setMode("home")} style={{background:"transparent",border:`1px solid ${B.border}`,borderRadius:8,padding:"6px 12px",color:B.textMid,fontSize:13,cursor:"pointer"}}>← Back</button>
          <div>
            <div style={{fontFamily:"Sora,sans-serif",fontSize:18,fontWeight:800}}>Book Flights ✈️</div>
            <div style={{fontSize:12,color:B.textMid,marginTop:2}}>Each traveler flies from their own city. Assign per person or by group.</div>
          </div>
          <div style={{marginLeft:"auto",display:"flex",gap:8}}>
            <Badge color={B.green}>✦ AI optimized</Badge>
            <Badge color={B.purple}>💎 Points available</Badge>
          </div>
        </div>

        {groups.map(([city,travelers])=>{
          const fp=travelers[0];
          const rk=`${fp.code}-${DEST}`;
          const flights=ROUTES[rk]||[];
          const isLocal=fp.code===DEST;
          return(
            <div key={city} style={{marginBottom:28}}>
              {/* City divider */}
              <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:14}}>
                <div style={{height:1,flex:1,background:B.border}}/>
                <div style={{display:"flex",gap:8,alignItems:"center",background:B.surface,border:`1px solid ${B.border}`,borderRadius:20,padding:"5px 14px"}}>
                  <span style={{fontSize:13}}>📍</span>
                  <span style={{fontFamily:"Sora,sans-serif",fontSize:13,fontWeight:700}}>{city}</span>
                  <span style={{fontSize:12,color:B.textMid}}>→ MTY</span>
                  <Badge color={isLocal?B.green:B.navyMid} small>{isLocal?"Local — no flight":`${flights.length} flights`}</Badge>
                </div>
                <div style={{height:1,flex:1,background:B.border}}/>
              </div>

              {/* Travelers */}
              <div style={{display:"grid",gap:8,marginBottom:isLocal?0:14}}>
                {travelers.map(t=>{
                  const aid=selTravelers[t.id];
                  const af=flights.find(f=>f.id===aid);
                  return(
                    <div key={t.id} style={{display:"flex",gap:12,alignItems:"center",padding:"12px 16px",background:aid?B.green+"10":B.surfaceHi,border:`1px solid ${aid?B.green:B.border}`,borderRadius:10}}>
                      <Avatar initials={t.avatar} color={t.status==="confirmed"?B.green:B.amber} size={34}/>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700,fontSize:13}}>{t.name}</div>
                        <div style={{fontSize:11,color:B.textMid}}>{t.role} · #{t.number}</div>
                      </div>
                      {isLocal?<Badge color={B.green}>🏠 Local — no flight needed</Badge>
                        :af?(
                          <div style={{display:"flex",gap:8,alignItems:"center"}}>
                            <div style={{textAlign:"right"}}>
                              <div style={{fontSize:12,fontWeight:700,color:B.green}}>{af.airline} {af.code}</div>
                              <div style={{fontSize:11,color:B.textMid}}>{af.dep}→{af.arr} · {fmt(af.price)}</div>
                            </div>
                            <button onClick={()=>setSelT(prev=>{const n={...prev};delete n[t.id];return n;})}
                              style={{background:B.redDim,border:`1px solid ${B.red}33`,borderRadius:6,padding:"4px 8px",color:B.red,fontSize:11,cursor:"pointer",fontWeight:700}}>✕</button>
                          </div>
                        ):<Badge color={B.amber}>Unassigned</Badge>}
                    </div>
                  );
                })}
              </div>

              {/* Flights for route */}
              {!isLocal&&flights.map(f=>{
                const cnt=travelers.filter(t=>selTravelers[t.id]===f.id).length;
                const mem=MEMBERSHIPS.find(m=>m.id===f.memId);
                const ups=usePoints[f.id]||false;
                return(
                  <div key={f.id} style={{marginBottom:10,background:B.surface,border:`1px solid ${cnt>0?B.green:B.border}`,borderRadius:12,padding:"14px 18px",marginLeft:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{display:"flex",gap:12,alignItems:"center"}}>
                        <span style={{fontSize:20}}>✈️</span>
                        <div>
                          <div style={{fontWeight:700,fontSize:13}}>{f.airline} <span style={{color:B.textLight,fontWeight:400}}>{f.code}</span>
                            {f.rec&&<span style={{marginLeft:6}}><Badge color={B.green} small>✦ AI rec.</Badge></span>}
                          </div>
                          <div style={{fontSize:12,color:B.textMid,marginTop:1}}>{f.dep} → {f.arr} · {f.dur} · {f.stops}</div>
                        </div>
                      </div>
                      <div style={{display:"flex",gap:10,alignItems:"center"}}>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontFamily:"Sora,sans-serif",fontSize:16,fontWeight:800}}>{fmt(f.price)}</div>
                          <div style={{fontSize:10,color:B.textLight}}>per person</div>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",gap:4}}>
                          <Btn small primary onClick={()=>{
                            const un=travelers.filter(t=>!selTravelers[t.id]&&t.code!==DEST);
                            setSelT(prev=>{const n={...prev};un.forEach(t=>n[t.id]=f.id);return n;});
                          }}>Assign group</Btn>
                          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                            {travelers.filter(t=>t.code!==DEST).map(t=>(
                              <button key={t.id} onClick={()=>setSelT(prev=>({...prev,[t.id]:f.id}))}
                                style={{background:selTravelers[t.id]===f.id?B.green+"18":B.surfaceHi,border:`1px solid ${selTravelers[t.id]===f.id?B.green:B.border}`,borderRadius:6,padding:"3px 8px",fontSize:11,color:selTravelers[t.id]===f.id?B.green:B.textMid,cursor:"pointer",fontWeight:600}}>
                                {t.name.split(" ")[0]}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Points chip */}
                    {mem&&f.earn>0&&(
                      <div style={{marginTop:8,display:"flex",gap:8,flexWrap:"wrap"}}>
                        <div style={{display:"flex",gap:6,alignItems:"center",background:B.purple+"15",border:`1px solid ${B.purple}33`,borderRadius:8,padding:"5px 10px"}}>
                          <span style={{fontSize:11}}>💎</span>
                          <span style={{fontSize:11,color:B.purple,fontWeight:600}}>+{fpts(f.earn)} — {mem.name}</span>
                        </div>
                        {mem.points>=f.redeem&&f.redeem>0&&(
                          <button onClick={()=>setUsePoints(prev=>({...prev,[f.id]:!prev[f.id]}))}
                            style={{display:"flex",gap:6,alignItems:"center",background:ups?B.purple+"25":B.purple+"15",border:`1.5px solid ${ups?B.purple:B.purple+"33"}`,borderRadius:8,padding:"5px 10px",cursor:"pointer"}}>
                            <span style={{fontSize:11}}>{ups?"✓":"○"}</span>
                            <span style={{fontSize:11,color:B.purple,fontWeight:700}}>Use {fpts(f.redeem)} → save {fmt(f.saving)}</span>
                          </button>
                        )}
                      </div>
                    )}
                    {cnt>0&&<div style={{marginTop:8,fontSize:11,color:B.green,fontWeight:600}}>✓ Assigned to {cnt} traveler{cnt>1?"s":""}</div>}
                  </div>
                );
              })}
            </div>
          );
        })}

        <div style={{position:"sticky",bottom:0,background:B.bg,borderTop:`1px solid ${B.border}`,padding:"14px 0",display:"flex",gap:12,alignItems:"center"}}>
          <div style={{fontSize:13,color:B.textMid,flex:1}}>
            <strong style={{color:B.text}}>{Object.keys(selTravelers).length}</strong> / 9 flights assigned
          </div>
          <Btn ghost onClick={()=>setMode("home")}>Cancel</Btn>
          <Btn primary disabled={Object.keys(selTravelers).length===0} onClick={confirmFlights}>
            Confirm {Object.keys(selTravelers).length} flights →
          </Btn>
        </div>
      </div>
    );
  }

  // HOTEL
  if(mode==="hotel") return(
    <div style={{flex:1,overflowY:"auto",padding:28}}>
      <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:20}}>
        <button onClick={()=>setMode("home")} style={{background:"transparent",border:`1px solid ${B.border}`,borderRadius:8,padding:"6px 12px",color:B.textMid,fontSize:13,cursor:"pointer"}}>← Back</button>
        <div>
          <div style={{fontFamily:"Sora,sans-serif",fontSize:18,fontWeight:800}}>Reserve Hotel 🏨</div>
          <div style={{fontSize:12,color:B.textMid,marginTop:2}}>Monterrey · Jul 13–15 · 5 rooms</div>
        </div>
        <Badge color={B.purple} style={{marginLeft:"auto"}}>💎 Marriott Bonvoy: 156,000 pts</Badge>
      </div>
      {HOTELS_LIST.map(h=>(
        <div key={h.id} onClick={()=>{setSelHotel(h.id);setUHPts(false);}}
          style={{marginBottom:12,background:selHotel===h.id?B.green+"10":B.surface,border:`1.5px solid ${selHotel===h.id?B.green:B.border}`,borderRadius:14,padding:"18px 22px",cursor:"pointer"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
              <div style={{width:40,height:40,borderRadius:10,background:B.surfaceHi,border:`1px solid ${B.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>🏨</div>
              <div>
                <div style={{fontWeight:700,fontSize:14}}>{h.name}</div>
                <div style={{fontSize:12,color:B.textMid,marginTop:2}}>{"⭐".repeat(h.stars)} · {h.dist}</div>
                <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>{h.amenities.map(a=><Badge key={a} color={B.navyMid} small>{a}</Badge>)}</div>
                {h.rec&&<div style={{marginTop:8,display:"flex",gap:6,alignItems:"center",background:B.green+"12",border:`1px solid ${B.green}33`,borderRadius:8,padding:"6px 10px"}}>
                  <span style={{fontSize:12}}>✦</span><span style={{fontSize:12,color:B.green}}>{h.note}</span>
                </div>}
              </div>
            </div>
            <div style={{textAlign:"right",flexShrink:0,marginLeft:14}}>
              <div style={{fontFamily:"Sora,sans-serif",fontSize:22,fontWeight:800}}>{fmt(h.price)}</div>
              <div style={{fontSize:11,color:B.textLight}}>2 nights · {h.rooms} rooms</div>
              {h.rec&&<div style={{marginTop:6}}><Badge color={B.green} small>✦ Recommended</Badge></div>}
            </div>
          </div>
          {/* Points */}
          {h.memId&&(()=>{
            const mem=MEMBERSHIPS.find(m=>m.id===h.memId);
            const ups=selHotel===h.id&&useHotelPts;
            return mem?(
              <div style={{marginTop:10,display:"flex",gap:8,flexWrap:"wrap"}}>
                <div style={{display:"flex",gap:6,alignItems:"center",background:B.purple+"15",border:`1px solid ${B.purple}33`,borderRadius:8,padding:"5px 10px"}}>
                  <span style={{fontSize:11}}>💎</span>
                  <span style={{fontSize:11,color:B.purple,fontWeight:600}}>+{fpts(h.earn)} — {mem.name}</span>
                </div>
                {mem.points>=h.redeem&&<button onClick={e=>{e.stopPropagation();setUHPts(p=>!p);}}
                  style={{display:"flex",gap:6,alignItems:"center",background:ups?B.purple+"25":B.purple+"15",border:`1.5px solid ${ups?B.purple:B.purple+"33"}`,borderRadius:8,padding:"5px 10px",cursor:"pointer"}}>
                  <span style={{fontSize:11}}>{ups?"✓":"○"}</span>
                  <span style={{fontSize:11,color:B.purple,fontWeight:700}}>Use {fpts(h.redeem)} → save {fmt(h.saving)}</span>
                </button>}
              </div>
            ):null;
          })()}
        </div>
      ))}
      <div style={{position:"sticky",bottom:0,background:B.bg,borderTop:`1px solid ${B.border}`,padding:"14px 0",display:"flex",gap:12,alignItems:"center"}}>
        <div style={{flex:1,fontSize:13,color:B.textMid}}>
          {selHotel&&<><strong style={{color:B.text}}>{HOTELS_LIST.find(h=>h.id===selHotel)?.name}</strong>{useHotelPts&&<span style={{color:B.purple}}> · Using Bonvoy points</span>}</>}
        </div>
        <Btn ghost onClick={()=>setMode("home")}>Cancel</Btn>
        <Btn primary disabled={!selHotel} onClick={confirmHotel}>Confirm hotel →</Btn>
      </div>
    </div>
  );

  // CAR BOOKING
  if(mode==="car"){
    const CAR_OPTIONS = [
      {id:"c1",type:"SUV",      seats:7, company:"Hertz",      model:"Chevrolet Tahoe",   price:85,  features:["AC","GPS","Bluetooth"],       avail:true},
      {id:"c2",type:"Minivan",  seats:8, company:"Enterprise", model:"Chrysler Pacifica", price:72,  features:["AC","GPS","USB Ports"],        avail:true},
      {id:"c3",type:"Van",      seats:12,company:"Avis",       model:"Ford Transit",      price:110, features:["AC","GPS","Cargo space"],      avail:true},
      {id:"c4",type:"Sedan",    seats:5, company:"Hertz",      model:"Toyota Camry",      price:45,  features:["AC","GPS"],                    avail:false},
      {id:"c5",type:"Minibus",  seats:20,company:"National",   model:"Mercedes Sprinter", price:180, features:["AC","GPS","PA System","Luggage rack"],avail:true},
    ];
    const rentalNights=Math.max(1,Math.round((new Date(dropDate)-new Date(pickupDate))/(1000*60*60*24)));
    return(
      <div style={{flex:1,overflowY:"auto",padding:28}}>
        <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:20}}>
          <button onClick={()=>setMode("home")} style={{background:"transparent",border:`1px solid ${B.border}`,borderRadius:8,padding:"6px 12px",color:B.textMid,fontSize:13,cursor:"pointer"}}>← Back</button>
          <div>
            <div style={{fontFamily:"Sora,sans-serif",fontSize:18,fontWeight:800}}>Rent Cars 🚗</div>
            <div style={{fontSize:12,color:B.textMid,marginTop:2}}>Select vehicles for the group — airport pickup available.</div>
          </div>
        </div>
        {/* Search bar */}
        <Card style={{padding:"16px 20px",marginBottom:18,display:"flex",gap:14,alignItems:"flex-end",flexWrap:"wrap"}}>
          <div style={{flex:2,minWidth:160}}>
            <div style={{fontSize:11,fontWeight:600,color:B.textMid,marginBottom:5,textTransform:"uppercase",letterSpacing:0.5}}>📍 Pick-up location</div>
            <input value={pickupLoc} onChange={e=>setPickupLoc(e.target.value)}
              style={{width:"100%",border:`1.5px solid ${B.border}`,borderRadius:9,padding:"9px 12px",fontSize:13,color:B.text,outline:"none"}}/>
          </div>
          <div style={{flex:1,minWidth:120}}>
            <div style={{fontSize:11,fontWeight:600,color:B.textMid,marginBottom:5,textTransform:"uppercase",letterSpacing:0.5}}>📅 Pick-up date</div>
            <input type="date" value={pickupDate} onChange={e=>setPickupDate(e.target.value)}
              style={{width:"100%",border:`1.5px solid ${B.border}`,borderRadius:9,padding:"9px 12px",fontSize:13,color:B.text,outline:"none"}}/>
          </div>
          <div style={{flex:1,minWidth:120}}>
            <div style={{fontSize:11,fontWeight:600,color:B.textMid,marginBottom:5,textTransform:"uppercase",letterSpacing:0.5}}>📅 Drop-off date</div>
            <input type="date" value={dropDate} onChange={e=>setDropDate(e.target.value)}
              style={{width:"100%",border:`1.5px solid ${B.border}`,borderRadius:9,padding:"9px 12px",fontSize:13,color:B.text,outline:"none"}}/>
          </div>
          <Badge color={B.green}>{rentalNights} day{rentalNights>1?"s":""} rental</Badge>
        </Card>
        {/* AI tip */}
        <Card style={{padding:"12px 18px",marginBottom:18,background:B.green+"10",border:`1px solid ${B.green}33`}}>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <span style={{fontSize:16}}>✦</span>
            <div style={{fontSize:12,color:B.text,lineHeight:1.5}}>
              <strong>AI Suggestion:</strong> For 10 travelers, a Ford Transit van + 1 SUV covers everyone and is 23% cheaper than 3 separate SUVs.
            </div>
          </div>
        </Card>
        {/* Cars */}
        <div style={{display:"grid",gap:12}}>
          {CAR_OPTIONS.map(c=>(
            <div key={c.id} onClick={()=>c.avail&&setSelCar(c.id)}
              style={{background:selCar===c.id?B.green+"10":B.surface,border:`1.5px solid ${selCar===c.id?B.green:B.border}`,borderRadius:14,padding:"16px 20px",cursor:c.avail?"pointer":"not-allowed",opacity:c.avail?1:0.5}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",gap:14,alignItems:"center"}}>
                  <div style={{width:52,height:52,borderRadius:12,background:B.green+"12",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0}}>🚗</div>
                  <div>
                    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                      <div style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:14}}>{c.model}</div>
                      <Badge color={B.navyMid} small>{c.type}</Badge>
                      {!c.avail&&<Badge color={B.red} small>Unavailable</Badge>}
                    </div>
                    <div style={{fontSize:12,color:B.textMid,marginBottom:6}}>{c.company} · 👥 Up to {c.seats} passengers</div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{c.features.map(f=><Badge key={f} color={B.navyLight} small>{f}</Badge>)}</div>
                  </div>
                </div>
                <div style={{textAlign:"right",flexShrink:0,marginLeft:14}}>
                  <div style={{fontFamily:"Sora,sans-serif",fontSize:22,fontWeight:800}}>{fmt(c.price)}<span style={{fontSize:12,fontWeight:400,color:B.textLight}}>/day</span></div>
                  <div style={{fontSize:13,fontWeight:700,color:B.green,marginTop:2}}>{fmt(c.price*rentalNights)} total</div>
                  <div style={{fontSize:11,color:B.textLight}}>{rentalNights} day{rentalNights>1?"s":""}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{position:"sticky",bottom:0,background:B.bg,borderTop:`1px solid ${B.border}`,padding:"14px 0",display:"flex",gap:12,alignItems:"center"}}>
          <div style={{flex:1,fontSize:13,color:B.textMid}}>
            {selCar&&<><strong style={{color:B.text}}>{CAR_OPTIONS.find(c=>c.id===selCar)?.model}</strong> · {fmt((CAR_OPTIONS.find(c=>c.id===selCar)?.price||0)*rentalNights)} for {rentalNights} day{rentalNights>1?"s":""}</>}
          </div>
          <Btn ghost onClick={()=>setMode("home")}>Cancel</Btn>
          <Btn primary disabled={!selCar} onClick={()=>setMode("home")}>Confirm Car Rental →</Btn>
        </div>
      </div>
    );
  }
}
// ── REPORTS ──────────────────────────────────────────────────
function ReportsScreen(){
  const [filterBy,setFilterBy]=useState("month");
  const [filterType,setFilterType]=useState("all");
  const [selEvent,setSelEvent]=useState("All Events");
  const [selTraveler,setSelTraveler]=useState("All Travelers");
  const [dateFrom,setDateFrom]=useState("2026-06-01");
  const [dateTo,setDateTo]=useState("2026-06-30");

  const DATA={
    summary:{total:18400,flights:10200,hotels:5800,cars:2400},
    byMonth:[
      {month:"Jan",total:4200,flights:2400,hotels:1200,cars:600},
      {month:"Feb",total:3800,flights:2100,hotels:1100,cars:600},
      {month:"Mar",total:5600,flights:3200,hotels:1600,cars:800},
      {month:"Apr",total:4900,flights:2800,hotels:1400,cars:700},
      {month:"May",total:7200,flights:4100,hotels:2100,cars:1000},
      {month:"Jun",total:18400,flights:10200,hotels:5800,cars:2400},
    ],
    byEvent:[
      {name:"Regional Final — MTY",date:"Jun 13–15",travelers:10,flights:8200,hotels:3200,cars:1400,total:12800},
      {name:"Training Camp GDL",   date:"May 20–22",travelers:8, flights:2000,hotels:2600,cars:1000,total:5600},
    ],
    byTraveler:[
      {name:"Carlos Mendoza", avatar:"CM",city:"Mexico City", flights:3200,hotels:840,cars:280,total:4320},
      {name:"Javier Ríos",    avatar:"JR",city:"Tijuana",     flights:4100,hotels:840,cars:280,total:5220},
      {name:"Diego Ramírez",  avatar:"DR",city:"Guadalajara", flights:2800,hotels:840,cars:280,total:3920},
      {name:"Felipe Castro",  avatar:"FC",city:"Puebla",      flights:2900,hotels:840,cars:280,total:4020},
      {name:"Marcos Vega",    avatar:"MV",city:"Mexico City", flights:3200,hotels:840,cars:280,total:4320},
      {name:"Santiago López", avatar:"SL",city:"Guadalajara", flights:2800,hotels:840,cars:280,total:3920},
    ],
  };

  const maxBar=Math.max(...DATA.byMonth.map(m=>m.total));
  const tColors={all:B.purple,flights:B.navyMid,hotels:B.amber,cars:B.green};
  const tVal=row=>filterType==="flights"?row.flights:filterType==="hotels"?row.hotels:filterType==="cars"?row.cars:row.total;

  const filterTabs=[{id:"month",icon:"📅",label:"By Month"},{id:"event",icon:"⚽",label:"By Event"},{id:"traveler",icon:"👥",label:"By Traveler"},{id:"date",icon:"🗓️",label:"Date Range"}];
  const typeTabs=[{id:"all",label:"All",color:B.purple},{id:"flights",label:"✈ Flights",color:B.navyMid},{id:"hotels",label:"🏨 Hotels",color:B.amber},{id:"cars",label:"🚗 Cars",color:B.green}];

  return(
    <div style={{padding:28,overflowY:"auto",flex:1}}>
      <div style={{marginBottom:22}}>
        <div style={{fontFamily:"Sora,sans-serif",fontSize:22,fontWeight:800}}>Reports 📊</div>
        <div style={{fontSize:14,color:B.textMid,marginTop:4}}>Analyze group travel spending — filter by month, event, traveler, or date.</div>
      </div>

      {/* Summary */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}}>
        {[
          {label:"Total Spent",val:fmt(DATA.summary.total),  color:B.purple, tid:"all"},
          {label:"Flights",    val:fmt(DATA.summary.flights),color:B.navyMid,tid:"flights"},
          {label:"Hotels",     val:fmt(DATA.summary.hotels), color:B.amber,  tid:"hotels"},
          {label:"Cars",       val:fmt(DATA.summary.cars),   color:B.green,  tid:"cars"},
        ].map((s,i)=>(
          <Card key={i} onClick={()=>setFilterType(s.tid)}
            style={{padding:"16px 18px",cursor:"pointer",border:`1.5px solid ${filterType===s.tid?s.color:B.border}`,background:filterType===s.tid?s.color+"10":B.surface}}>
            <div style={{fontSize:10,color:B.textLight,textTransform:"uppercase",letterSpacing:0.6,fontWeight:600,marginBottom:6}}>{s.label}</div>
            <div style={{fontFamily:"Sora,sans-serif",fontSize:24,fontWeight:800,color:s.color}}>{s.val}</div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",gap:0,background:B.surfaceHi,borderRadius:10,padding:3}}>
          {filterTabs.map(t=>(
            <button key={t.id} onClick={()=>setFilterBy(t.id)}
              style={{padding:"7px 13px",borderRadius:7,border:"none",cursor:"pointer",fontSize:12,fontWeight:filterBy===t.id?700:500,
                background:filterBy===t.id?B.surface:"transparent",color:filterBy===t.id?B.purple:B.textMid,display:"flex",alignItems:"center",gap:5}}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          {typeTabs.map(t=>(
            <button key={t.id} onClick={()=>setFilterType(t.id)}
              style={{padding:"6px 12px",borderRadius:20,border:`1.5px solid ${filterType===t.id?t.color:B.border}`,cursor:"pointer",fontSize:11,fontWeight:700,
                background:filterType===t.id?t.color+"18":"transparent",color:filterType===t.id?t.color:B.textMid}}>
              {t.label}
            </button>
          ))}
          <button onClick={()=>{}} style={{background:B.navy,border:"none",borderRadius:9,padding:"7px 14px",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",marginLeft:4}}>
            ↓ CSV
          </button>
        </div>
      </div>

      {/* BY MONTH */}
      {filterBy==="month"&&(
        <Card style={{padding:"22px 24px"}}>
          <div style={{fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:14,marginBottom:20}}>Monthly Spending — 2026</div>
          {/* Bar chart */}
          <div style={{display:"flex",gap:8,alignItems:"flex-end",height:160,marginBottom:20,paddingBottom:4}}>
            {DATA.byMonth.map((m,i)=>{
              const val=tVal(m);
              const h=Math.max(4,Math.round((val/maxBar)*140));
              const color=tColors[filterType];
              return(
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                  <div style={{fontSize:9,fontWeight:700,color,textAlign:"center"}}>{fmt(val)}</div>
                  <div style={{width:"100%",height:h,background:`linear-gradient(180deg,${color},${color}88)`,borderRadius:"6px 6px 0 0",transition:"height 0.3s"}}/>
                  <div style={{fontSize:11,color:B.textMid}}>{m.month}</div>
                </div>
              );
            })}
          </div>
          {/* Table */}
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead>
                <tr>{["Month","Flights","Hotels","Cars","Total"].map(h=>(
                  <th key={h} style={{padding:"8px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:B.textLight,textTransform:"uppercase",letterSpacing:0.5,background:B.surfaceHi,borderBottom:`1px solid ${B.border}`}}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {DATA.byMonth.map((m,i)=>(
                  <tr key={i} style={{background:i%2===0?B.surface:B.surfaceHi}}>
                    <td style={{padding:"10px 12px",borderBottom:`1px solid ${B.border}`,fontWeight:600}}>{m.month} 2026</td>
                    <td style={{padding:"10px 12px",borderBottom:`1px solid ${B.border}`,color:B.navyMid,fontWeight:600}}>{fmt(m.flights)}</td>
                    <td style={{padding:"10px 12px",borderBottom:`1px solid ${B.border}`,color:B.amber,fontWeight:600}}>{fmt(m.hotels)}</td>
                    <td style={{padding:"10px 12px",borderBottom:`1px solid ${B.border}`,color:B.green,fontWeight:600}}>{fmt(m.cars)}</td>
                    <td style={{padding:"10px 12px",borderBottom:`1px solid ${B.border}`,fontFamily:"Sora,sans-serif",fontWeight:800,color:B.navy}}>{fmt(m.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* BY EVENT */}
      {filterBy==="event"&&(
        <Card style={{padding:"22px 24px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div style={{fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:14}}>Spending by Event</div>
            <select value={selEvent} onChange={e=>setSelEvent(e.target.value)}
              style={{border:`1px solid ${B.border}`,borderRadius:8,padding:"6px 12px",fontSize:12,color:B.text,background:B.surface}}>
              <option>All Events</option>
              {DATA.byEvent.map(e=><option key={e.name}>{e.name}</option>)}
            </select>
          </div>
          {DATA.byEvent.map((ev,i)=>(
            <div key={i} style={{background:B.surfaceHi,borderRadius:12,padding:"18px 20px",marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div>
                  <div style={{fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:14}}>{ev.name}</div>
                  <div style={{fontSize:12,color:B.textMid,marginTop:2}}>📅 {ev.date} · 👥 {ev.travelers} travelers</div>
                </div>
                <div style={{fontFamily:"Sora,sans-serif",fontSize:22,fontWeight:800,color:B.navy}}>{fmt(ev.total)}</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                {[{l:"Flights",v:ev.flights,c:B.navyMid},{l:"Hotels",v:ev.hotels,c:B.amber},{l:"Cars",v:ev.cars,c:B.green}].map((s,j)=>(
                  <div key={j} style={{background:B.surface,borderRadius:9,padding:"10px 14px"}}>
                    <div style={{fontSize:10,color:B.textLight,textTransform:"uppercase",letterSpacing:0.5}}>{s.l}</div>
                    <div style={{fontFamily:"Sora,sans-serif",fontSize:18,fontWeight:800,color:s.c,marginTop:2}}>{fmt(s.v)}</div>
                    <div style={{fontSize:10,color:B.textLight,marginTop:2}}>{Math.round(s.v/ev.total*100)}% of total</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* BY TRAVELER */}
      {filterBy==="traveler"&&(
        <Card style={{padding:"22px 24px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div style={{fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:14}}>Spending by Traveler</div>
            <select value={selTraveler} onChange={e=>setSelTraveler(e.target.value)}
              style={{border:`1px solid ${B.border}`,borderRadius:8,padding:"6px 12px",fontSize:12,color:B.text,background:B.surface}}>
              <option>All Travelers</option>
              {DATA.byTraveler.map(t=><option key={t.name}>{t.name}</option>)}
            </select>
          </div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead>
              <tr>{["Traveler","Flights","Hotels","Cars","Total"].map(h=>(
                <th key={h} style={{padding:"8px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:B.textLight,textTransform:"uppercase",letterSpacing:0.5,background:B.surfaceHi,borderBottom:`1px solid ${B.border}`}}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {DATA.byTraveler.map((t,i)=>(
                <tr key={i} style={{background:i%2===0?B.surface:B.surfaceHi}}>
                  <td style={{padding:"11px 12px",borderBottom:`1px solid ${B.border}`}}>
                    <div style={{display:"flex",gap:10,alignItems:"center"}}>
                      <Avatar initials={t.avatar} color={B.purple} size={28}/>
                      <div>
                        <div style={{fontWeight:700,fontSize:13}}>{t.name}</div>
                        <div style={{fontSize:10,color:B.textLight}}>📍 {t.city}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{padding:"11px 12px",borderBottom:`1px solid ${B.border}`,color:B.navyMid,fontWeight:600}}>{fmt(t.flights)}</td>
                  <td style={{padding:"11px 12px",borderBottom:`1px solid ${B.border}`,color:B.amber,fontWeight:600}}>{fmt(t.hotels)}</td>
                  <td style={{padding:"11px 12px",borderBottom:`1px solid ${B.border}`,color:B.green,fontWeight:600}}>{fmt(t.cars)}</td>
                  <td style={{padding:"11px 12px",borderBottom:`1px solid ${B.border}`,fontFamily:"Sora,sans-serif",fontWeight:800,color:B.navy}}>{fmt(t.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* DATE RANGE */}
      {filterBy==="date"&&(
        <Card style={{padding:"22px 24px"}}>
          <div style={{display:"flex",gap:14,alignItems:"flex-end",marginBottom:22,flexWrap:"wrap"}}>
            <div style={{flex:1,minWidth:140}}>
              <div style={{fontSize:11,fontWeight:600,color:B.textMid,marginBottom:5,textTransform:"uppercase",letterSpacing:0.5}}>From</div>
              <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)}
                style={{width:"100%",border:`1.5px solid ${B.border}`,borderRadius:9,padding:"9px 12px",fontSize:13,color:B.text,outline:"none"}}/>
            </div>
            <div style={{flex:1,minWidth:140}}>
              <div style={{fontSize:11,fontWeight:600,color:B.textMid,marginBottom:5,textTransform:"uppercase",letterSpacing:0.5}}>To</div>
              <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)}
                style={{width:"100%",border:`1.5px solid ${B.border}`,borderRadius:9,padding:"9px 12px",fontSize:13,color:B.text,outline:"none"}}/>
            </div>
            <Btn primary onClick={()=>{}}>Run Report</Btn>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
            {[{l:"Total",v:fmt(18400),c:B.purple},{l:"Flights",v:fmt(10200),c:B.navyMid},{l:"Hotels",v:fmt(5800),c:B.amber},{l:"Cars",v:fmt(2400),c:B.green}].map((s,i)=>(
              <div key={i} style={{background:B.surfaceHi,borderRadius:10,padding:"14px 16px"}}>
                <div style={{fontSize:10,color:B.textLight,textTransform:"uppercase",letterSpacing:0.5,marginBottom:4}}>{s.l}</div>
                <div style={{fontFamily:"Sora,sans-serif",fontSize:22,fontWeight:800,color:s.c}}>{s.v}</div>
              </div>
            ))}
          </div>
          <div style={{fontSize:13,color:B.textMid,textAlign:"center",padding:"16px 0",borderTop:`1px solid ${B.border}`}}>
            Showing results for <strong style={{color:B.text}}>{dateFrom}</strong> → <strong style={{color:B.text}}>{dateTo}</strong> · 2 events · 6 travelers
          </div>
        </Card>
      )}
    </div>
  );
}

function EventsScreen(){
  return(
    <div style={{padding:28,overflowY:"auto",flex:1}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div>
          <div style={{fontFamily:"Sora,sans-serif",fontSize:22,fontWeight:800}}>Events 📅</div>
          <div style={{fontSize:14,color:B.textMid,marginTop:4}}>Manage all your group travel events.</div>
        </div>
        <Btn primary onClick={()=>{}}>+ New Event</Btn>
      </div>
      {EVENTS.map(ev=>(
        <Card key={ev.id} style={{padding:"20px 24px",marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
            <div style={{display:"flex",gap:14,alignItems:"center"}}>
              <div style={{width:46,height:46,borderRadius:12,background:ev.status==="confirmed"?B.purple+"18":B.amberDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>⚽</div>
              <div>
                <div style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:15}}>{ev.name}</div>
                <div style={{fontSize:13,color:B.textMid,marginTop:3}}>{ev.date} · vs {ev.rival}</div>
                <div style={{fontSize:12,color:B.textLight,marginTop:2}}>📍 {ev.venue}</div>
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <Badge color={ev.status==="confirmed"?B.green:B.amber}>{ev.status==="confirmed"?"Confirmed":"Planning"}</Badge>
              <div style={{fontFamily:"Sora,sans-serif",fontSize:20,fontWeight:800,marginTop:8}}>{fmt(ev.cost)}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:10,paddingTop:14,borderTop:`1px solid ${B.border}`}}>
            <Badge color={ev.flights>0?B.green:B.amber}>✈ {ev.flights}/10 flights</Badge>
            <Badge color={ev.hotel?B.green:B.amber}>🏨 Hotel {ev.hotel?"confirmed":"pending"}</Badge>
            <div style={{marginLeft:"auto",display:"flex",gap:8}}>
              <Btn small ghost onClick={()=>{}}>View itinerary</Btn>
              <Btn small primary onClick={()=>{}}>Manage →</Btn>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ── TRAVELERS ────────────────────────────────────────────────
function TravelersScreen(){
  const [showAdd,setShowAdd]=useState(false);
  const [search,setSearch]=useState("");
  const filtered=TRAVELERS.filter(t=>t.name.toLowerCase().includes(search.toLowerCase())||t.city.toLowerCase().includes(search.toLowerCase()));
  return(
    <div style={{padding:28,overflowY:"auto",flex:1}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div>
          <div style={{fontFamily:"Sora,sans-serif",fontSize:22,fontWeight:800}}>Travelers 👥</div>
          <div style={{fontSize:14,color:B.textMid,marginTop:4}}>{TRAVELERS.filter(t=>t.status==="confirmed").length} confirmed · {TRAVELERS.filter(t=>t.status==="pending").length} pending</div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search travelers…"
            style={{border:`1px solid ${B.border}`,borderRadius:9,padding:"8px 14px",fontSize:13,color:B.text,width:200,outline:"none"}}/>
          <Btn primary onClick={()=>setShowAdd(true)}>+ Add Traveler</Btn>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
        {filtered.map(t=>(
          <Card key={t.id} style={{padding:"16px 18px",display:"flex",gap:14,alignItems:"center"}}>
            <Avatar initials={t.avatar} color={t.status==="confirmed"?B.green:B.amber} size={42}/>
            <div style={{flex:1}}>
              <div style={{fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:14}}>{t.name}</div>
              <div style={{fontSize:12,color:B.textMid,marginTop:2}}>#{t.number} · {t.role}</div>
              <div style={{fontSize:11,color:B.navyMid,marginTop:3}}>📍 {t.city}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
              <Badge color={t.status==="confirmed"?B.green:B.amber} small>{t.status==="confirmed"?"Active":"Pending"}</Badge>
              <Btn small ghost onClick={()=>{}}>View →</Btn>
            </div>
          </Card>
        ))}
      </div>
      {showAdd&&(
        <div style={{position:"fixed",inset:0,background:"rgba(10,12,28,0.5)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowAdd(false)}>
          <div style={{background:B.surface,borderRadius:20,padding:28,width:420,boxShadow:"0 24px 80px rgba(0,0,0,0.2)"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:18,marginBottom:20}}>Add Traveler</div>
            <div style={{display:"grid",gap:14,marginBottom:20}}>
              {[{l:"Full name",p:"Carlos Mendoza"},{l:"Email",p:"carlos@team.com"},{l:"City",p:"Mexico City"},{l:"Role / Position",p:"Forward"}].map(f=>(
                <Input key={f.l} label={f.l} value="" onChange={()=>{}} placeholder={f.p}/>
              ))}
            </div>
            <div style={{display:"flex",gap:10}}>
              <Btn ghost onClick={()=>setShowAdd(false)}>Cancel</Btn>
              <Btn primary onClick={()=>setShowAdd(false)}>Send Invite →</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MEMBERSHIPS ──────────────────────────────────────────────
function MembershipsScreen(){
  const [sel,setSel]=useState(MEMBERSHIPS[0].id);
  const [tab,setTab]=useState("overview");
  const [showAdd,setShowAdd]=useState(false);
  const mem=MEMBERSHIPS.find(m=>m.id===sel);
  const totalVal=MEMBERSHIPS.reduce((s,m)=>s+m.points*m.value,0);
  return(
    <div style={{display:"flex",flex:1,overflow:"hidden"}}>
      {/* Left */}
      <div style={{width:260,borderRight:`1px solid ${B.border}`,display:"flex",flexDirection:"column",background:B.surface}}>
        <div style={{padding:"20px 16px",borderBottom:`1px solid ${B.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:15}}>Memberships</div>
            <button onClick={()=>setShowAdd(true)} style={{background:B.purple+"18",border:`1px solid ${B.purple}33`,borderRadius:7,padding:"4px 10px",color:B.purple,fontSize:11,fontWeight:700,cursor:"pointer"}}>+ Add</button>
          </div>
          <div style={{background:`linear-gradient(135deg,${B.navy},${B.navyMid})`,borderRadius:12,padding:"14px 16px"}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.6)",textTransform:"uppercase",letterSpacing:0.8,marginBottom:4}}>Total value</div>
            <div style={{fontFamily:"Sora,sans-serif",fontSize:26,fontWeight:800,color:"#fff"}}>{fmt(Math.round(totalVal))}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginTop:2}}>{MEMBERSHIPS.length} programs</div>
          </div>
        </div>
        <div style={{flex:1,padding:10,overflowY:"auto"}}>
          {MEMBERSHIPS.map(m=>(
            <button key={m.id} onClick={()=>setSel(m.id)}
              style={{width:"100%",display:"flex",gap:10,alignItems:"center",padding:"11px 10px",borderRadius:10,border:`1.5px solid ${sel===m.id?m.color:"transparent"}`,background:sel===m.id?m.color+"12":"transparent",cursor:"pointer",marginBottom:4,textAlign:"left"}}>
              <div style={{width:32,height:32,borderRadius:8,background:m.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{m.logo}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:12,color:B.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.name}</div>
                <div style={{fontSize:11,color:m.color,fontWeight:700,marginTop:1}}>{m.points.toLocaleString()} pts</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Right */}
      {mem&&!showAdd&&(
        <div style={{flex:1,overflowY:"auto",padding:24}}>
          <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:20}}>
            <div style={{width:52,height:52,borderRadius:14,background:mem.color+"18",border:`1.5px solid ${mem.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>{mem.logo}</div>
            <div>
              <div style={{fontFamily:"Sora,sans-serif",fontSize:20,fontWeight:800}}>{mem.name}</div>
              <div style={{display:"flex",gap:8,marginTop:4,alignItems:"center"}}>
                <Badge color={mem.color}>{mem.tier}</Badge>
                <span style={{fontSize:11,color:B.textLight}}>Expires {mem.expiry}</span>
              </div>
            </div>
          </div>
          <Card style={{padding:"20px",marginBottom:18,background:`linear-gradient(135deg,${mem.color}15,${mem.color}05)`,border:`1.5px solid ${mem.color}33`}}>
            <div style={{fontSize:10,color:mem.color,fontWeight:700,textTransform:"uppercase",letterSpacing:0.8,marginBottom:4}}>Available Points</div>
            <div style={{fontFamily:"Sora,sans-serif",fontSize:44,fontWeight:900,color:B.text,lineHeight:1}}>{mem.points.toLocaleString()}</div>
            <div style={{fontSize:13,color:B.textMid,marginTop:6}}>≈ <strong style={{color:B.text}}>{fmt(Math.round(mem.points*mem.value))}</strong> in value</div>
          </Card>
          <div style={{display:"flex",gap:0,marginBottom:18,background:B.surfaceHi,borderRadius:8,padding:3,width:"fit-content"}}>
            {[["overview","Overview"],["history","History"]].map(([id,l])=>(
              <button key={id} onClick={()=>setTab(id)} style={{padding:"7px 16px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,background:tab===id?B.surface:"transparent",color:tab===id?B.text:B.textLight}}>
                {l}
              </button>
            ))}
          </div>
          {tab==="overview"&&(
            <div>
              <div style={{fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:13,color:B.textMid,textTransform:"uppercase",letterSpacing:0.8,marginBottom:12}}>Redemption Options</div>
              {[{icon:"✈️",l:"Group flight (×10)",pts:22000,save:264},{icon:"🏨",l:"Hotel 2 nights (×5 rooms)",pts:25000,save:200},{icon:"⬆️",l:"Cabin upgrade",pts:18000,save:320},{icon:"🎫",l:"Free baggage (×10)",pts:8000,save:80}].map((o,i)=>{
                const av=mem.points>=o.pts;
                return(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 16px",background:av?B.purple+"12":B.surfaceHi,border:`1px solid ${av?B.purple+"33":B.border}`,borderRadius:10,marginBottom:8}}>
                    <div style={{display:"flex",gap:10,alignItems:"center"}}>
                      <span style={{fontSize:20}}>{o.icon}</span>
                      <div>
                        <div style={{fontSize:13,fontWeight:600,color:av?B.text:B.textLight}}>{o.l}</div>
                        <div style={{fontSize:11,color:av?B.purple:B.textLight,marginTop:1}}>{fpts(o.pts)} needed</div>
                      </div>
                    </div>
                    {av?<div style={{textAlign:"right"}}>
                      <div style={{fontSize:13,fontWeight:800,color:B.green}}>Save {fmt(o.save)}</div>
                      <Btn small primary onClick={()=>{}}>Redeem</Btn>
                    </div>:<span style={{fontSize:11,color:B.textLight}}>Need {fpts(o.pts-mem.points)} more</span>}
                  </div>
                );
              })}
            </div>
          )}
          {tab==="history"&&(
            <div style={{fontSize:13,color:B.textMid,textAlign:"center",padding:"40px 0"}}>History coming soon — connect AwardWallet API to sync transactions automatically.</div>
          )}
        </div>
      )}
      {showAdd&&(
        <div style={{flex:1,padding:24}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:22}}>
            <div style={{fontFamily:"Sora,sans-serif",fontSize:18,fontWeight:800}}>Add Membership</div>
            <Btn ghost small onClick={()=>setShowAdd(false)}>Cancel</Btn>
          </div>
          <div style={{display:"flex",gap:10,marginBottom:20}}>
            {[{id:"airline",icon:"✈️",l:"Airline"},{id:"hotel",icon:"🏨",l:"Hotel"},{id:"car",icon:"🚗",l:"Car rental"}].map(t=>(
              <button key={t.id} style={{flex:1,padding:"14px",background:B.surfaceHi,border:`1px solid ${B.border}`,borderRadius:10,cursor:"pointer",textAlign:"center"}}>
                <div style={{fontSize:22,marginBottom:4}}>{t.icon}</div>
                <div style={{fontSize:12,fontWeight:700,color:B.textMid}}>{t.l}</div>
              </button>
            ))}
          </div>
          <div style={{display:"grid",gap:14,marginBottom:20}}>
            {[{l:"Program name",p:"Aeroméxico Club Premier"},{l:"Membership number",p:"AM-123456"},{l:"Current points",p:"50000"},{l:"Expiry date",p:"Dec 2027"}].map(f=>(
              <Input key={f.l} label={f.l} value="" onChange={()=>{}} placeholder={f.p}/>
            ))}
          </div>
          <Btn primary onClick={()=>setShowAdd(false)}>Save membership</Btn>
        </div>
      )}
    </div>
  );
}

// ── EXPENSES ─────────────────────────────────────────────────
function ExpensesScreen(){
  const [exps,setExps]=useState(EXPENSES);
  const approve=id=>setExps(prev=>prev.map(e=>e.id===id?{...e,status:"approved"}:e));
  const pending=exps.filter(e=>e.status==="pending");
  const approved=exps.filter(e=>e.status==="approved");
  return(
    <div style={{padding:28,overflowY:"auto",flex:1}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div>
          <div style={{fontFamily:"Sora,sans-serif",fontSize:22,fontWeight:800}}>Expenses 💳</div>
          <div style={{fontSize:14,color:B.textMid,marginTop:4}}>{pending.length} pending approval</div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <Badge color={B.amber}>{pending.length} pending</Badge>
          <Badge color={B.green}>{approved.length} approved</Badge>
        </div>
      </div>
      {pending.length>0&&(
        <Section title="Needs Approval">
          {pending.map(e=>(
            <Card key={e.id} style={{padding:"14px 18px",marginBottom:10,border:`1.5px solid ${B.amber}33`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",gap:12,alignItems:"center"}}>
                  <div style={{width:38,height:38,borderRadius:10,background:B.amberDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🧾</div>
                  <div>
                    <div style={{fontWeight:700,fontSize:13}}>{e.what}</div>
                    <div style={{fontSize:11,color:B.textMid,marginTop:2}}>{e.who} · {e.event} · {e.date}</div>
                  </div>
                </div>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <div style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:16}}>{fmt(e.amount)}</div>
                  <Btn small primary onClick={()=>approve(e.id)}>✓ Approve</Btn>
                  <Btn small danger onClick={()=>{}}>Decline</Btn>
                </div>
              </div>
            </Card>
          ))}
        </Section>
      )}
      <Section title="Approved">
        {approved.map(e=>(
          <div key={e.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:B.surface,border:`1px solid ${B.border}`,borderRadius:10,marginBottom:8}}>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <div style={{width:34,height:34,borderRadius:9,background:B.greenDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🧾</div>
              <div>
                <div style={{fontWeight:700,fontSize:13}}>{e.what}</div>
                <div style={{fontSize:11,color:B.textMid,marginTop:1}}>{e.who} · {e.date}</div>
              </div>
            </div>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <span style={{fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:14}}>{fmt(e.amount)}</span>
              <Badge color={B.green} small>Approved</Badge>
            </div>
          </div>
        ))}
      </Section>
    </div>
  );
}

// ── SETTINGS ─────────────────────────────────────────────────
function SettingsScreen(){
  const [tab,setTab]=useState("general");
  const [airlines,setAirlines]=useState(CORP_AIRLINES);
  const [hotels,setHotels]=useState(CORP_HOTELS);
  const [modal,setModal]=useState(null); // {type, item}
  const [corpId,setCorpId]=useState("");
  const [loading,setLoading]=useState(false);

  function connect(type,id){
    if(!corpId)return;
    setLoading(true);
    setTimeout(()=>{
      if(type==="airline") setAirlines(prev=>prev.map(a=>a.id===id?{...a,status:"connected",corpId}:a));
      else setHotels(prev=>prev.map(h=>h.id===id?{...h,status:"connected",corpId}:h));
      setLoading(false); setModal(null); setCorpId("");
    },1000);
  }
  function disconnect(type,id){
    if(type==="airline") setAirlines(prev=>prev.map(a=>a.id===id?{...a,status:"available",corpId:""}:a));
    else setHotels(prev=>prev.map(h=>h.id===id?{...h,status:"available",corpId:""}:h));
  }

  const settingsTabs=[
    {id:"general",    icon:"⊞",  label:"General"},
    {id:"corporate",  icon:"🏢",  label:"Corporate Connections"},
    {id:"team",       icon:"👥",  label:"Team & Roles"},
    {id:"billing",    icon:"💳",  label:"Billing & Plan"},
    {id:"notifications",icon:"🔔",label:"Notifications"},
  ];

  return(
    <div style={{display:"flex",flex:1,overflow:"hidden"}}>
      {/* Settings sidebar */}
      <div style={{width:220,borderRight:`1px solid ${B.border}`,background:B.surface,padding:"20px 10px"}}>
        <div style={{fontSize:10,color:B.textLight,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:12,paddingLeft:10}}>Settings</div>
        {settingsTabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:9,border:"none",cursor:"pointer",marginBottom:2,textAlign:"left",
              background:tab===t.id?B.purple+"15":"transparent",
              color:tab===t.id?B.purple:B.textMid,fontWeight:tab===t.id?700:500,fontSize:13}}>
            <span style={{fontSize:16}}>{t.icon}</span>{t.label}
          </button>
        ))}
        <div style={{marginTop:20,paddingTop:16,borderTop:`1px solid ${B.border}`,paddingLeft:10}}>
          <div style={{fontSize:11,color:B.textLight,lineHeight:1.5}}>Need integrations or API access? Contact your <strong style={{color:B.purple}}>Oriz Travel admin</strong>.</div>
        </div>
      </div>

      {/* Settings content */}
      <div style={{flex:1,overflowY:"auto",padding:28}}>

        {/* GENERAL */}
        {tab==="general"&&(
          <div>
            <div style={{fontFamily:"Sora,sans-serif",fontSize:20,fontWeight:800,marginBottom:6}}>General Settings</div>
            <div style={{fontSize:14,color:B.textMid,marginBottom:24}}>Manage your group profile and preferences.</div>
            <Card style={{padding:24,marginBottom:16}}>
              <div style={{fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:14,marginBottom:16}}>Group Profile</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                <Input label="Group name" value={GROUP.name} onChange={()=>{}} placeholder="Tigres FC"/>
                <Input label="Group type" value={GROUP.type} onChange={()=>{}} placeholder="Soccer Team"/>
                <Input label="Manager name" value={GROUP.manager} onChange={()=>{}} placeholder="Coach Rivera"/>
                <Input label="Email" value={GROUP.email} onChange={()=>{}} placeholder="manager@team.com"/>
              </div>
              <Btn primary onClick={()=>{}}>Save Changes</Btn>
            </Card>
            <Card style={{padding:24}}>
              <div style={{fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:14,marginBottom:16}}>Preferences</div>
              {[
                {label:"Default currency",   val:"USD — US Dollar"},
                {label:"Default language",   val:"English"},
                {label:"Time zone",          val:"America/Mexico_City (CST)"},
                {label:"Distance unit",      val:"Kilometers"},
              ].map((p,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:i<3?`1px solid ${B.border}`:"none"}}>
                  <span style={{fontSize:13,color:B.textMid}}>{p.label}</span>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{fontSize:13,fontWeight:600}}>{p.val}</span>
                    <Btn small ghost onClick={()=>{}}>Edit</Btn>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* CORPORATE CONNECTIONS */}
        {tab==="corporate"&&(
          <div>
            <div style={{fontFamily:"Sora,sans-serif",fontSize:20,fontWeight:800,marginBottom:6}}>Corporate Connections</div>
            <div style={{fontSize:14,color:B.textMid,marginBottom:6}}>Link your organization's corporate accounts to unlock negotiated rates and earn group points.</div>
            <Card style={{padding:"14px 18px",marginBottom:24,background:B.purple+"10",border:`1px solid ${B.purple}33`}}>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <span style={{fontSize:18}}>✦</span>
                <div style={{fontSize:13,color:B.text,lineHeight:1.5}}>
                  Connected accounts give your group access to <strong>corporate rates (12–22% off)</strong>, group loyalty points, and priority booking. Your travelers also earn their personal points on every booking.
                </div>
              </div>
            </Card>

            {/* Airlines */}
            <Section title="✈️ Airline Corporate Programs">
              <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
                {airlines.map(a=>(
                  <Card key={a.id} style={{padding:"16px 18px",border:`1.5px solid ${a.status==="connected"?B.green:B.border}`}}>
                    <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
                      <div style={{width:38,height:38,borderRadius:10,background:a.color+"18",border:`1px solid ${a.color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{a.logo}</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700,fontSize:13}}>{a.name}</div>
                        <div style={{fontSize:11,color:B.textLight,marginTop:1}}>{a.program}</div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                        {a.status==="connected"&&<Badge color={B.green} small>● Connected</Badge>}
                        {a.status==="pending"&&<Badge color={B.amber} small>◐ Pending</Badge>}
                        {a.status==="available"&&<Badge color={B.textLight} small>○ Available</Badge>}
                        <span style={{fontSize:12,fontWeight:700,color:B.green}}>{a.saving} off</span>
                      </div>
                    </div>
                    {a.status==="connected"&&(
                      <div style={{marginBottom:10,background:B.surfaceHi,borderRadius:8,padding:"8px 12px",fontSize:11,color:B.textMid}}>
                        ID: <strong style={{color:B.text,fontFamily:"monospace"}}>{a.corpId}</strong>
                      </div>
                    )}
                    <div style={{display:"flex",gap:8}}>
                      {a.status==="connected"&&<><Btn small ghost onClick={()=>{}}>View details</Btn><Btn small danger onClick={()=>disconnect("airline",a.id)}>Disconnect</Btn></>}
                      {a.status==="pending"&&<div style={{fontSize:12,color:B.amber,fontWeight:600}}>⏳ Awaiting approval from {a.name}</div>}
                      {a.status==="available"&&<Btn small primary onClick={()=>{setModal({type:"airline",item:a});setCorpId("");}}>Connect →</Btn>}
                    </div>
                  </Card>
                ))}
              </div>
            </Section>

            {/* Hotels */}
            <Section title="🏨 Hotel Corporate Programs">
              <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
                {hotels.map(h=>(
                  <Card key={h.id} style={{padding:"16px 18px",border:`1.5px solid ${h.status==="connected"?B.green:B.border}`}}>
                    <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
                      <div style={{width:38,height:38,borderRadius:10,background:h.color+"18",border:`1px solid ${h.color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{h.logo}</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700,fontSize:13}}>{h.name}</div>
                        <div style={{fontSize:11,color:B.textLight,marginTop:1}}>{h.program}</div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                        {h.status==="connected"&&<Badge color={B.green} small>● Connected</Badge>}
                        {h.status==="available"&&<Badge color={B.textLight} small>○ Available</Badge>}
                        <span style={{fontSize:12,fontWeight:700,color:B.green}}>{h.saving} off</span>
                      </div>
                    </div>
                    {h.status==="connected"&&(
                      <div style={{marginBottom:10,background:B.surfaceHi,borderRadius:8,padding:"8px 12px",fontSize:11,color:B.textMid}}>
                        Code: <strong style={{color:B.text,fontFamily:"monospace"}}>{h.corpId}</strong>
                      </div>
                    )}
                    <div style={{display:"flex",gap:8}}>
                      {h.status==="connected"&&<><Btn small ghost onClick={()=>{}}>View details</Btn><Btn small danger onClick={()=>disconnect("hotel",h.id)}>Disconnect</Btn></>}
                      {h.status==="available"&&<Btn small primary onClick={()=>{setModal({type:"hotel",item:h});setCorpId("");}}>Connect →</Btn>}
                    </div>
                  </Card>
                ))}
              </div>
            </Section>

            {/* AwardWallet */}
            <Section title="💎 Loyalty Tracking — AwardWallet">
              <Card style={{padding:"18px 22px"}}>
                <div style={{display:"flex",gap:16,alignItems:"center",marginBottom:14}}>
                  <div style={{width:46,height:46,borderRadius:12,background:B.purple+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>💎</div>
                  <div>
                    <div style={{fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:15}}>AwardWallet API</div>
                    <div style={{fontSize:13,color:B.textMid,marginTop:2}}>Real-time sync of all loyalty points across 700+ programs</div>
                  </div>
                  <Badge color={B.green} style={{marginLeft:"auto"}}>● Connected</Badge>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
                  {[{l:"Programs tracked",v:"3"},{l:"Total points",v:"488,700"},{l:"Total value",v:"$5,254"}].map((s,i)=>(
                    <div key={i} style={{background:B.surfaceHi,borderRadius:10,padding:"10px 14px"}}>
                      <div style={{fontSize:10,color:B.textLight,textTransform:"uppercase",letterSpacing:0.5}}>{s.l}</div>
                      <div style={{fontFamily:"Sora,sans-serif",fontSize:18,fontWeight:800,color:B.purple,marginTop:2}}>{s.v}</div>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:8}}>
                  <Btn small ghost onClick={()=>{}}>Sync now</Btn>
                  <Btn small ghost onClick={()=>{}}>Manage programs</Btn>
                  <Btn small danger onClick={()=>{}}>Disconnect</Btn>
                </div>
              </Card>
            </Section>
          </div>
        )}

        {/* TEAM & ROLES */}
        {tab==="team"&&(
          <div>
            <div style={{fontFamily:"Sora,sans-serif",fontSize:20,fontWeight:800,marginBottom:6}}>Team & Roles</div>
            <div style={{fontSize:14,color:B.textMid,marginBottom:24}}>Manage who has access to the manager dashboard.</div>
            <Card style={{padding:24}}>
              {[
                {name:"Coach Rivera",email:"rivera@tigresfc.mx",role:"Owner",color:B.purple},
                {name:"Ana García",  email:"ana@tigresfc.mx",  role:"Co-Manager",color:B.navyMid},
              ].map((u,i)=>(
                <div key={i} style={{display:"flex",gap:14,alignItems:"center",padding:"12px 0",borderBottom:i<1?`1px solid ${B.border}`:"none"}}>
                  <div style={{width:38,height:38,borderRadius:10,background:u.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:14,color:u.color}}>{u.name[0]}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:13}}>{u.name}</div>
                    <div style={{fontSize:11,color:B.textLight,marginTop:1}}>{u.email}</div>
                  </div>
                  <Badge color={u.color}>{u.role}</Badge>
                  {u.role!=="Owner"&&<Btn small ghost onClick={()=>{}}>Edit</Btn>}
                </div>
              ))}
              <div style={{marginTop:14}}>
                <Btn primary onClick={()=>{}}>+ Invite Co-Manager</Btn>
              </div>
            </Card>
          </div>
        )}

        {/* BILLING */}
        {tab==="billing"&&(
          <div>
            <div style={{fontFamily:"Sora,sans-serif",fontSize:20,fontWeight:800,marginBottom:6}}>Billing & Plan</div>
            <div style={{fontSize:14,color:B.textMid,marginBottom:24}}>Manage your subscription and payment methods.</div>
            <Card style={{padding:24,marginBottom:16,background:`linear-gradient(135deg,${B.navy},${B.navyMid})`,border:"none"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",textTransform:"uppercase",letterSpacing:0.8,marginBottom:4}}>Current Plan</div>
                  <div style={{fontFamily:"Sora,sans-serif",fontSize:28,fontWeight:900,color:"#fff"}}>Pro</div>
                  <div style={{fontSize:13,color:"rgba(255,255,255,0.65)",marginTop:4}}>Up to 5 groups · Unlimited travelers · All features</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"Sora,sans-serif",fontSize:32,fontWeight:800,color:"#fff"}}>$249<span style={{fontSize:14,fontWeight:400,color:"rgba(255,255,255,0.6)"}}>/mo</span></div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:4}}>Next billing: Aug 1, 2026</div>
                </div>
              </div>
            </Card>
            <Card style={{padding:24}}>
              <div style={{fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:14,marginBottom:16}}>Payment Method</div>
              <div style={{display:"flex",gap:14,alignItems:"center",padding:"12px",background:B.surfaceHi,borderRadius:10,marginBottom:14}}>
                <span style={{fontSize:24}}>💳</span>
                <div>
                  <div style={{fontWeight:600,fontSize:13}}>Visa ending in 4242</div>
                  <div style={{fontSize:11,color:B.textLight,marginTop:1}}>Expires 12/28</div>
                </div>
                <Btn small ghost style={{marginLeft:"auto"}} onClick={()=>{}}>Update</Btn>
              </div>
              <Btn ghost onClick={()=>{}}>View invoices</Btn>
            </Card>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {tab==="notifications"&&(
          <div>
            <div style={{fontFamily:"Sora,sans-serif",fontSize:20,fontWeight:800,marginBottom:6}}>Notifications</div>
            <div style={{fontSize:14,color:B.textMid,marginBottom:24}}>Control when and how you receive alerts.</div>
            <Card style={{padding:24}}>
              {[
                {label:"New expense submitted",    sub:"When a traveler submits a receipt",          on:true},
                {label:"Flight price drop",        sub:"When a booked flight drops in price",        on:true},
                {label:"Points expiring soon",     sub:"30 days before loyalty points expire",       on:true},
                {label:"Booking confirmations",    sub:"When a flight or hotel is confirmed",        on:true},
                {label:"Traveler check-in",        sub:"When a traveler checks in to their flight",  on:false},
                {label:"Monthly spend report",     sub:"Summary of group travel spending",           on:false},
              ].map((n,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:i<5?`1px solid ${B.border}`:"none"}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:13}}>{n.label}</div>
                    <div style={{fontSize:11,color:B.textLight,marginTop:2}}>{n.sub}</div>
                  </div>
                  <div style={{width:42,height:24,borderRadius:12,background:n.on?B.purple:B.border,cursor:"pointer",position:"relative",flexShrink:0}}>
                    <div style={{width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:n.on?21:3,transition:"left 0.2s"}}/>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}
      </div>

      {/* Connect Modal */}
      {modal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(10,12,28,0.55)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setModal(null)}>
          <div style={{background:B.surface,borderRadius:20,padding:28,width:420,boxShadow:"0 24px 80px rgba(0,0,0,0.2)"}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:20}}>
              <div style={{width:48,height:48,borderRadius:14,background:modal.item.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>{modal.item.logo}</div>
              <div>
                <div style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:16}}>Connect {modal.item.name}</div>
                <div style={{fontSize:12,color:B.textLight,marginTop:2}}>{modal.item.program}</div>
              </div>
            </div>
            <div style={{fontSize:13,color:B.textMid,lineHeight:1.6,marginBottom:18}}>
              Enter your corporate account ID. Your group will get <strong style={{color:B.green}}>{modal.item.saving} off</strong> on all bookings and start earning group reward points automatically.
            </div>
            <Input label={modal.type==="airline"?"Corporate Account ID / PCC":"Corporate Rate Code"}
              value={corpId} onChange={setCorpId}
              placeholder={modal.type==="airline"?"e.g. ABC1234":"e.g. CORP2026"}/>
            <div style={{display:"flex",gap:10,marginTop:18}}>
              <Btn ghost onClick={()=>setModal(null)}>Cancel</Btn>
              <Btn primary disabled={!corpId||loading} onClick={()=>connect(modal.type,modal.item.id)}>
                {loading?"Connecting…":"Connect →"}
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── ROOT ─────────────────────────────────────────────────────
export default function ManagerDashboard(){
  const router = useRouter();
  const [screen,setScreen]=useState("dashboard");
  const [bookings,setBookings]=useState({});

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.replace("/login");
    });
  }, [router]);

  return(
    <div style={{display:"flex",height:"100vh",background:B.bg,color:B.text,fontFamily:"Poppins,sans-serif",overflow:"hidden"}}>
      <style>{font}</style>
      <Sidebar screen={screen} setScreen={setScreen}/>
      <main style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
        {screen==="dashboard"   &&<DashboardScreen setScreen={setScreen}/>}
        {screen==="booking"     &&<BookingScreen bookings={bookings} setBookings={setBookings}/>}
        {screen==="events"      &&<EventsScreen/>}
        {screen==="travelers"   &&<TravelersScreen/>}
        {screen==="memberships" &&<MembershipsScreen/>}
        {screen==="expenses"    &&<ExpensesScreen/>}
        {screen==="reports"     &&<ReportsScreen/>}
        {screen==="settings"    &&<SettingsScreen/>}
      </main>
    </div>
  );
}

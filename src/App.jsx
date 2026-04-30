import { useState, useRef, useCallback, useEffect } from "react";

const LOGO_SRC="data:image/jpeg;base64,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";
function useDarkMode() {
    const [dark, setDark] = useState(() => window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false);
    useEffect(() => {
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = (e) => setDark(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);
    return dark;
}

// ─── Mobile hook ───
function useMobile(breakpoint = 640) {
    const [mobile, setMobile] = useState(() => window.innerWidth < breakpoint);
    useEffect(() => {
        const handler = () => setMobile(window.innerWidth < breakpoint);
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, [breakpoint]);
    return mobile;
}

// ─── Theme tokens ───
function useTheme() {
    const dark = useDarkMode();
    return dark ? {
        bg: "#0f172a", bgCard: "#1e293b", bgCardAlt: "#172032", bgInput: "#1e293b", bgHover: "#334155",
        border: "#334155", borderLight: "#475569", borderFocus: "#60a5fa",
        text: "#e2e8f0", textMuted: "#94a3b8", textDim: "#64748b",
        accent: "#3b82f6", accentGreen: "#10b981", accentRed: "#ef4444",
        yBg: "#064e3b", yBorder: "#059669", yText: "#6ee7b7",
        nBg: "#450a0a", nBorder: "#dc2626", nText: "#fca5a5",
        naBg: "#1e293b", naText: "#94a3b8",
        badgeBg: "#064e3b", badgeBorder: "#059669", badgeText: "#a7f3d0",
        presetBg: "#1e293b", presetHover: "#334155", presetActiveBg: "#064e3b",
        topBar: "linear-gradient(135deg,#0c1322,#162032)", topBarText: "#f1f5f9",
        sectionOpen: "#172032",
        statusY: "#059669", statusN: "#dc2626", statusNA: "#6b7280",
        btnBg: "#334155", btnText: "#e2e8f0", btnBorder: "#475569",
        selectBg: "#1e293b",
        progressBg: "#334155", progressTrack: "#475569",
    } : {
        bg: "#f8fafc", bgCard: "#ffffff", bgCardAlt: "#fafbfc", bgInput: "#ffffff", bgHover: "#f8fafc",
        border: "#e2e8f0", borderLight: "#f1f5f9", borderFocus: "#3b82f6",
        text: "#1e293b", textMuted: "#64748b", textDim: "#94a3b8",
        accent: "#2563eb", accentGreen: "#059669", accentRed: "#dc2626",
        yBg: "#f0fdf4", yBorder: "#86efac", yText: "#166534",
        nBg: "#fff5f5", nBorder: "#fca5a5", nText: "#991b1b",
        naBg: "#f9fafb", naText: "#6b7280",
        badgeBg: "#f0fdf4", badgeBorder: "#bbf7d0", badgeText: "#166534",
        presetBg: "#ffffff", presetHover: "#f8fafc", presetActiveBg: "#f0fdf4",
        topBar: "linear-gradient(135deg,#0f172a,#1e293b)", topBarText: "#f1f5f9",
        sectionOpen: "#f8fafc",
        statusY: "#059669", statusN: "#dc2626", statusNA: "#6b7280",
        btnBg: "#ffffff", btnText: "#374151", btnBorder: "#d1d5db",
        selectBg: "#ffffff",
        progressBg: "#334155", progressTrack: "#475569",
    };
}

const HEADER_OPTIONS = {
    project: [
        "T2A Security Programme - Phase 6",
        "T2A CSA",
        "T2 Baggage Project",
        "T5 Refurbishment Works"
    ],
    activity: [
        "Installation of CCTV assets including testing",
        "Running in Cat6 cabling to service trench and terminations within SCR",
        "Installation of Access Control equipment",
        "Cable containment installation",
        "Equipment decommissioning and removal",
        "Testing and commissioning",
        "General site inspection"
    ],
    location: [
        "T2A ",
        "T2A CSA",
        "T2A Fast Track",
        "T2A Departures",
        "T2A Arrivals",
        "T2A Back of House",
        "T2A SCR (Security Control Room)",
        "T5 Main Terminal"
    ],
    client: ["HAL / Mace","HAL","Mace","AtkinsRéalis"],
    representative: [
        "Benny Bance",
        "Sean O'Connor",
        "Dan Sandu",
        "Mirel Caba",
        "Sandel Dumitrascu",
        "Catalin Popa"
    ],
    inspectionBy: [
        "Peter Murphy",
        "Fred Tebebenham",
        "Godwin Mat",
        "Jacob McBalla",
        "Marius Matei",
        "Tim Finch"],
    contractor: [
        "Computacenter",
        "Maber",
        "Contour",
        "Sword Services",
        "Projective Consulting"
    ]
};

const YES_COMMENTS = {
    "0.01":["None advised.","All previous actions closed out.","Previous actions reviewed and addressed."],
    "1.01":["PPE was being worn with HAL Airside Passes. CSCS Cards were all checked and valid.","All ID and competence cards checked and in date.","Airside passes and CSCS cards verified."],
    "1.02":["Updated revision of Method Statement held by supervisor on site and signed on by all engineers. Checked.","Method statement available on site and briefed to team.","Latest revision of RAMS held by Supervisor. Checked."],
    "1.03":["Works being carried out detailed within latest revision of RAMS. Checked.","Risk assessments cover all activities. Controls suitable and sufficient.","RAMS reviewed - all controls implemented."],
    "1.04":["Site team signed on to latest revision of RAMS, held by Supervisor. Checked.","Briefing records available and up to date.","All operatives signed onto RAMS. NABs briefing record checked."],
    "1.05":["Provided by Mace. WAN activation confirmed nightly to CC Supervisor and AR CM.","All permits in place and valid.","Permits checked and verified with Mace."],
    "2.01":["Pop-Up in use at time of inspection.","Scaffold / podium in use and inspected.","Access equipment in use, tagged and in date.","Ladders in use - inspected and suitable."],
    "2.02":["Barriers in place around access equipment.","Exclusion zones established below work at height.","Netting / barriers in place to protect from falling materials."],
    "2.03":["No Lifting Operations being undertaken.","Lifting plan in place. Equipment inspected and in date."],
    "2.04":["Awareness of 'Live' services in site footprint with protection placed over and signage displayed.","Services identified and marked. Protection in place.","CAT scan completed. Services identified and protected."],
    "2.05":["None currently.","Manual handling being undertaken with correct technique.","Mechanical aids in use where required."],
    "2.06":["Not applicable to these works.","COSHH assessments in place. Materials stored correctly.","All containers secured and labelled."],
    "2.07":["Not in use. Hand tools only being used.","Electrical equipment PAT tested and in date.","RCD protection in use."],
    "2.08":["Not in use. Hand tools only being used.","All portable appliances tested and in date.","PAT test labels checked and valid."],
    "2.09":["All in good working order. Suitable & checked.","Tools inspected and in good condition.","Hand tools suitable for task and well maintained."],
    "2.10":["Not applicable to these works.","Vibration risk assessment in place. Exposure monitored.","HAV assessment completed."],
    "2.11":["Works within the main Terminal and site is fully hoarded off and secure.","Boundary fencing intact. Access gates secure.","Site perimeter checked and secure."],
    "2.12":["Site Safety Notice Boards are on site displaying all relevant information.","Safety signage displayed throughout worksite.","All required signs and notices in place."],
    "2.13":["Provided by Mace. LSS permit activations confirmed nightly to CC Supervisor and AR CM.","LSS isolations in place and confirmed.","Sprinkler system isolations in place with Target Fire. Confirmed."],
    "3.01":["Toilets available within Terminal Building. Contractors facilities also available. Sufficient and clean.","Welfare facilities adequate and maintained.","Toilets and welfare suitable. Facilities clean."],
    "3.02":["Site team all inducted by Mace and aware of emergency arrangements. Also detailed within RAMS.","Emergency procedures briefed to all operatives.","Emergency arrangements defined in RAMS and site induction."],
    "3.03":["First Aider amongst site team. First aid kits available within Mace sites.","First aid provision suitable and sufficient.","Trained first aider on site. Kits checked and stocked."],
    "3.04":["All operatives were observed wearing 5 Points PPE at time of site inspection.","Full PPE being worn by all operatives.","PPE compliance observed - zero tolerance enforced."],
    "3.04a":["Hard hats worn by all operatives.","Checked and compliant."],
    "3.04b":["Hi-vis vests/jackets worn by all operatives.","Checked and compliant."],
    "3.04c":["Safety glasses worn by all operatives.","Checked and compliant."],
    "3.04d":["Correct gloves for task being worn.","Checked and compliant."],
    "3.04e":["Safety footwear worn by all operatives.","Checked and compliant."],
    "3.04f":["No task-specific PPE required.","Task-specific PPE in use where required."],
    "4.01":["Site team all inducted and aware of emergency procedures.","All staff aware of evacuation procedure and assembly point.","Covered in Mace induction and RAMS."],
    "4.02":["Site team all inducted and aware of emergency phone numbers.","Emergency contact details displayed and briefed.","Detailed within RAMS and Mace Site Induction."],
    "4.03":["Fire points available within Mace sites and throughout Terminal facilities.","Fire points accessible in vicinity of worksite.","Fire extinguishers available and accessible."],
    
    "4.04":["Good access and egress with clear routes available.","Escape routes clear and unobstructed.","All routes checked and clear."],
    "4.05":["Emergency Exits clearly signed throughout site and Terminal building.","Escape route signage clear and visible.","Exit signs posted and illuminated."],
    "5.01":["Housekeeping within the site remains to a good standard.","Site free of excessive dust.","Good housekeeping maintained."],
    "5.02":["Lighting levels are good throughout. Temporary lighting installed within Mace sites.","Lighting adequate for all work areas.","Good lighting levels throughout."],
    "5.03":["Housekeeping across sites remains to a good standard. Stores well maintained.","Site tidy and well organised.","Storage areas maintained and tidy."],
    "6.01":["Working in line with AtkinsRéalis and HAL standards. Reports & photos provided nightly.","Equipment installed to agreed standards.","Installation quality checked and acceptable."],
    "6.02":["Ongoing as part of works. Reports sent to AR Project Team nightly.","Checklists available and correctly completed.","Documentation up to date and complete."],
    "7.01":["None currently.","No additional recommendations at this time."]
};

const NA_COMMENTS = {"0.01":"None advised.","2.03":"No Lifting Operations being undertaken.","2.05":"None currently.","2.06":"Not applicable to these works.","2.07":"Not in use. Hand tools only being used.","2.08":"Not in use. Hand tools only being used.","2.10":"Not applicable to these works.","3.04f":"Not applicable."};

const SECTIONS = [
    {id:"0",title:"Previous Actions",items:[{id:"0.01",label:"Are previous actions reported appropriately addressed?"}]},
    {id:"1",title:"Site Documentation",items:[{id:"1.01",label:"Company identification & competence certification in order?"},{id:"1.02",label:"Is method statement available & suitable?"},{id:"1.03",label:"Do risk assessments cover activities, and are controls implemented suitable and sufficient?"},{id:"1.04",label:"Are records of method statement briefing available?"},{id:"1.05",label:"Permits (hot work, confined space, HV working)?"}]},
    {id:"2",title:"Construction Safety",items:[{id:"2.01",label:"Is scaffold, access equipment, ladders podiums being used?"},{id:"2.02",label:"Are people protected from falling materials?"},{id:"2.03",label:"Are lifting operations being undertaken and is suitable equipment being used?"},{id:"2.04",label:"Have services been identified and protected?"},{id:"2.05",label:"Is manual and/or mechanised handling taking place?"},{id:"2.06",label:"COSHH information and materials (including containers secure, hoses/triggers locked and stored within a bund)?"},{id:"2.07",label:"Is electrical plant in good condition (Earthing/RCD)?"},{id:"2.08",label:"Have portable electrical appliances been tested?"},{id:"2.09",label:"Are small tools suitable and in good condition?"},{id:"2.10",label:"Is there use of equipment associated with vibration risk?"},{id:"2.11",label:"Is the infrastructure protected? Is security at access gates and boundary fencing adequate?"},{id:"2.12",label:"Are safety signs and notices displayed?"},{id:"2.13",label:"Are Life Safety System Isolations in place (if applicable)?"}]},
    {id:"3",title:"General Site Issues",items:[{id:"3.01",label:"Are toilets & welfare suitable and sufficient?"},{id:"3.02",label:"Are emergency arrangements defined and briefed?"},{id:"3.03",label:"Is first aid suitable & sufficient?"},{id:"3.04",label:"Is suitable & sufficient PPE being worn:"}],subItems:[{id:"3.04a",label:"Hard Hat?"},{id:"3.04b",label:"HV Vest/Jacket?"},{id:"3.04c",label:"Safety Glasses?"},{id:"3.04d",label:"Correct Gloves for task?"},{id:"3.04e",label:"Safety footwear? (mandatory in all areas)"},{id:"3.04f",label:"Is any task specific PPE being used?"}]},
    {id:"4",title:"Evacuation",items:[{id:"4.01",label:"Are staff aware of evacuation procedure and assembly point in case of emergency?"},{id:"4.02",label:"Are staff aware of how to raise the alarm? Emergency contact details?"},{id:"4.03",label:"Are fire points available in the vicinity of the worksite?"},{id:"4.04",label:"Are escape routes free from obstructions?"},{id:"4.05",label:"Are there clear signs posted on escape routes leading to the final exit?"}]},
    {id:"5",title:"Environment",items:[{id:"5.01",label:"Is the site free of dust?"},{id:"5.02",label:"Is lighting adequate? Is it turned off when not required?"},{id:"5.03",label:"Is the site tidy and are storage areas maintained?"}]},
    {id:"6",title:"Quality",items:[{id:"6.01",label:"Is equipment being installed to the agreed and accepted standards?"},{id:"6.02",label:"Are checklist documents available and correctly filled out?"}]},
    {id:"7",title:"Representative Recommendation",items:[{id:"7.01",label:"Does the representative have any recommendations that would make the planned activities safer?"}]}
];

const defaultHeader={project:"",activity:"",location:"",client:"",representative:"",inspectionBy:"",contractor:"",inspectionNo:"",date:new Date().toISOString().split("T")[0],time:""};
const defaultAction=()=>({id:Date.now(),itemNo:"",description:"",category:"",proposedAction:"",actionOwner:"",closureDate:""});
const defaultSignoff={issuedByName:"",issuedByDate:"",issuedBySig:"",acceptedByName:"",acceptedByDate:"",acceptedBySig:"",additionalNotes:""};

function initItems(){const r={};SECTIONS.forEach(s=>{s.items.forEach(i=>{r[i.id]={status:"",comment:""};});if(s.subItems)s.subItems.forEach(i=>{r[i.id]={status:"",comment:""};});});return r;}

// ─── Header Select ───
function HeaderSelect({value,onChange,options,placeholder,t}){
    const [mode,setMode]=useState("select");
    const showCustom=mode==="custom"||(value&&!options.includes(value));
    const wrapStyle={display:"flex",width:"100%",minWidth:0,overflow:"hidden"};
    const fieldBase={flex:"1 1 0%",minWidth:0,padding:"8px 12px",borderRadius:"8px 0 0 8px",border:`1.5px solid ${t.border}`,borderRight:"none",fontSize:13,outline:"none",boxSizing:"border-box",backgroundColor:t.bgInput,color:t.text,fontFamily:"inherit"};
    const btnStyle={padding:"8px 12px",borderRadius:"0 8px 8px 0",border:`1.5px solid ${t.border}`,borderLeft:"none",backgroundColor:t.bgCardAlt,cursor:"pointer",fontSize:11,color:t.textMuted,fontFamily:"inherit",flexShrink:0};
    if(showCustom) return (
        <div style={wrapStyle}>
            <input type="text" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
                   style={{...fieldBase,overflow:"hidden",textOverflow:"ellipsis"}} />
            <button onClick={()=>{setMode("select");onChange("");}} style={btnStyle}>▼</button>
        </div>
    );
    return (
        <div style={wrapStyle}>
            <select value={value} onChange={e=>onChange(e.target.value)}
                    style={{...fieldBase,appearance:"auto",overflow:"hidden",textOverflow:"ellipsis"}}>
                <option value="">— Select —</option>
                {options.map((o,i)=><option key={i} value={o}>{o}</option>)}
            </select>
            <button onClick={()=>setMode("custom")} style={btnStyle}>✎</button>
        </div>
    );
}

// ─── Status Toggle ───
function StatusToggle({value,onChange,t}){
    return (
        <div style={{display:"flex",gap:3,flexShrink:0}}>
            {["Y","N","N/A"].map(opt=>(
                <button key={opt} onClick={()=>onChange(value===opt?"":opt)}
                        style={{padding:"4px 9px",borderRadius:6,fontSize:11,cursor:"pointer",transition:"all 0.15s",fontFamily:"inherit",
                            border:value===opt?"2px solid transparent":`1px solid ${t.border}`,fontWeight:value===opt?700:400,
                            backgroundColor:value===opt?(opt==="Y"?t.statusY:opt==="N"?t.statusN:t.statusNA):t.bgInput,
                            color:value===opt?"#fff":t.text}}>{opt}</button>
            ))}
        </div>
    );
}

// ─── Comment Field ───
function CommentField({itemId,status,comment,onChangeComment,t}){
    const [showPresets,setShowPresets]=useState(false);
    const presets=(status==="Y"&&YES_COMMENTS[itemId])||[];
    if(!status) return null;

    if(status==="N/A") return (
        <div style={{fontSize:12,color:t.naText,fontStyle:"italic",padding:"8px 12px",backgroundColor:t.naBg,borderRadius:8,border:`1px solid ${t.border}`}}>
            {comment||NA_COMMENTS[itemId]||"Not applicable."}
        </div>
    );

    if(status==="N") return (
        <textarea value={comment} onChange={e=>onChangeComment(e.target.value)} placeholder="Describe the issue..."
                  rows={2} style={{width:"100%",padding:"8px 12px",borderRadius:8,border:`1.5px solid ${t.nBorder}`,backgroundColor:t.nBg,color:t.nText,fontSize:13,outline:"none",boxSizing:"border-box",resize:"vertical",minHeight:40,fontFamily:"inherit"}} />
    );

    return (
        <div>
            {comment&&(
                <div style={{marginBottom:6,padding:"8px 12px",backgroundColor:t.badgeBg,border:`1px solid ${t.badgeBorder}`,borderRadius:8,fontSize:12,color:t.badgeText,display:"flex",alignItems:"flex-start",gap:8}}>
                    <span style={{flex:1}}>{comment}</span>
                    <button onClick={()=>onChangeComment("")} style={{background:"none",border:"none",cursor:"pointer",color:t.textMuted,fontSize:14,flexShrink:0,padding:0,lineHeight:1}}>✕</button>
                </div>
            )}
            <div style={{display:"flex",gap:6,alignItems:"stretch"}}>
        <textarea value={comment} onChange={e=>onChangeComment(e.target.value)}
                  placeholder={presets.length>0?"Select a preset below or type here...":"Type comment..."}
                  rows={2} style={{flex:1,padding:"8px 12px",borderRadius:8,border:`1.5px solid ${t.yBorder}`,backgroundColor:comment?t.yBg:t.bgInput,color:t.text,fontSize:13,outline:"none",boxSizing:"border-box",resize:"vertical",minHeight:40,fontFamily:"inherit"}} />
                {presets.length>0&&(
                    <button onClick={()=>setShowPresets(!showPresets)}
                            style={{padding:"8px 10px",borderRadius:8,border:`1px solid ${t.border}`,backgroundColor:showPresets?t.bgHover:t.bgInput,cursor:"pointer",fontSize:16,color:t.textMuted,flexShrink:0,fontFamily:"inherit",lineHeight:1,alignSelf:"flex-start"}}>
                        {showPresets?"▲":"▼"}
                    </button>
                )}
            </div>
            {showPresets&&presets.length>0&&(
                <div style={{marginTop:6,border:`1px solid ${t.border}`,borderRadius:8,backgroundColor:t.presetBg,overflow:"hidden",boxShadow:"0 4px 12px rgba(0,0,0,0.15)"}}>
                    {presets.map((p,i)=>(
                        <button key={i} onClick={()=>{onChangeComment(p);setShowPresets(false);}}
                                style={{width:"100%",padding:"10px 14px",border:"none",borderBottom:i<presets.length-1?`1px solid ${t.borderLight}`:"none",
                                    backgroundColor:comment===p?t.presetActiveBg:t.presetBg,cursor:"pointer",fontSize:12,color:t.text,textAlign:"left",fontFamily:"inherit"}}
                                onMouseEnter={e=>{if(comment!==p)e.target.style.backgroundColor=t.presetHover}}
                                onMouseLeave={e=>{e.target.style.backgroundColor=comment===p?t.presetActiveBg:t.presetBg}}>
                            <span style={{marginRight:8,color:t.accentGreen}}>●</span>{p}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Signature Pad ───
function SignaturePad({value,onChange,t}){
    const canvasRef=useRef(null);
    const [drawing,setDrawing]=useState(false);
    const [mode,setMode]=useState(value?"preview":"idle"); // idle | draw | preview
    const lastPos=useRef(null);

    const getPos=(e)=>{
        const canvas=canvasRef.current;
        const rect=canvas.getBoundingClientRect();
        const clientX=e.touches?e.touches[0].clientX:e.clientX;
        const clientY=e.touches?e.touches[0].clientY:e.clientY;
        return {x:(clientX-rect.left)*(canvas.width/rect.width),y:(clientY-rect.top)*(canvas.height/rect.height)};
    };

    const startDraw=(e)=>{
        e.preventDefault();
        setDrawing(true);
        lastPos.current=getPos(e);
    };

    const doDraw=(e)=>{
        if(!drawing)return;
        e.preventDefault();
        const canvas=canvasRef.current;
        const ctx=canvas.getContext("2d");
        const pos=getPos(e);
        ctx.beginPath();
        ctx.moveTo(lastPos.current.x,lastPos.current.y);
        ctx.lineTo(pos.x,pos.y);
        ctx.strokeStyle="#1a1a1a";
        ctx.lineWidth=2;
        ctx.lineCap="round";
        ctx.lineJoin="round";
        ctx.stroke();
        lastPos.current=pos;
    };

    const endDraw=()=>{
        if(!drawing)return;
        setDrawing(false);
        lastPos.current=null;
    };

    const clearCanvas=()=>{
        const canvas=canvasRef.current;
        if(canvas){const ctx=canvas.getContext("2d");ctx.clearRect(0,0,canvas.width,canvas.height);}
    };

    const saveCanvas=()=>{
        const canvas=canvasRef.current;
        if(canvas){onChange(canvas.toDataURL("image/png"));setMode("preview");}
    };

    const handleUpload=(e)=>{
        const file=e.target.files[0];
        if(!file)return;
        const reader=new FileReader();
        reader.onload=(ev)=>{onChange(ev.target.result);setMode("preview");};
        reader.readAsDataURL(file);
        e.target.value="";
    };

    const handleClear=()=>{onChange("");setMode("idle");};

    // Preview mode (signature exists)
    if(mode==="preview"&&value) return (
        <div style={{border:`1.5px solid ${t.border}`,borderRadius:8,padding:4,backgroundColor:t.bgInput,position:"relative",display:"inline-block"}}>
            <img src={value} alt="Signature" style={{height:60,maxWidth:200,objectFit:"contain",display:"block"}} />
            <button onClick={handleClear}
                    style={{position:"absolute",top:4,right:4,width:20,height:20,borderRadius:4,border:"none",backgroundColor:"rgba(220,38,38,0.85)",color:"#fff",cursor:"pointer",fontSize:10,lineHeight:1}}>✕</button>
        </div>
    );

    // Draw mode
    if(mode==="draw") return (
        <div>
            <div style={{border:`2px solid ${t.accent}`,borderRadius:8,overflow:"hidden",backgroundColor:"#fff",position:"relative",touchAction:"none"}}>
                <canvas ref={canvasRef} width={400} height={120}
                        style={{width:"100%",height:120,display:"block",cursor:"crosshair"}}
                        onMouseDown={startDraw} onMouseMove={doDraw} onMouseUp={endDraw} onMouseLeave={endDraw}
                        onTouchStart={startDraw} onTouchMove={doDraw} onTouchEnd={endDraw} />
                <div style={{position:"absolute",bottom:8,left:0,right:0,borderBottom:`1px dashed #ccc`,marginLeft:16,marginRight:16}} />
            </div>
            <div style={{display:"flex",gap:6,marginTop:6}}>
                <button onClick={saveCanvas} style={{padding:"6px 14px",borderRadius:6,border:"none",backgroundColor:t.accentGreen,color:"#fff",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"inherit"}}>Done</button>
                <button onClick={clearCanvas} style={{padding:"6px 14px",borderRadius:6,border:`1px solid ${t.border}`,backgroundColor:t.bgInput,color:t.text,cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"inherit"}}>Clear</button>
                <button onClick={()=>setMode("idle")} style={{padding:"6px 14px",borderRadius:6,border:`1px solid ${t.border}`,backgroundColor:t.bgInput,color:t.textMuted,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>Cancel</button>
            </div>
        </div>
    );

    // Idle mode (no signature)
    return (
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            <button onClick={()=>setMode("draw")}
                    style={{padding:"8px 16px",borderRadius:8,border:`1.5px dashed ${t.border}`,backgroundColor:t.bgInput,color:t.textMuted,cursor:"pointer",fontSize:12,fontFamily:"inherit",display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:16}}>✍</span> Draw Signature
            </button>
            <label style={{padding:"8px 16px",borderRadius:8,border:`1.5px dashed ${t.border}`,backgroundColor:t.bgInput,color:t.textMuted,cursor:"pointer",fontSize:12,fontFamily:"inherit",display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:14}}>📷</span> Upload Image
                <input type="file" accept="image/*" onChange={handleUpload} style={{display:"none"}} />
            </label>
        </div>
    );
}

// ─── Print Document (always light for printing) ───
function PrintDocument({header,items,actions,signoff,distributions,images}){
    const c={border:"1px solid #333",padding:"4px 6px",fontSize:"9px",verticalAlign:"top"};
    const h={...c,backgroundColor:"#1a3a5c",color:"#fff",fontWeight:700};
    const imagePages=[];for(let i=0;i<images.length;i+=4)imagePages.push(images.slice(i,i+4));
    return (
        <div style={{fontFamily:"'Segoe UI',Arial,sans-serif",color:"#1a1a1a",backgroundColor:"#fff",maxWidth:"210mm",margin:"0 auto",padding:"10mm",fontSize:"9px",lineHeight:1.4}}>
            <div style={{borderBottom:"3px solid #1a3a5c",paddingBottom:8,marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                    <div style={{fontSize:"14px",fontWeight:800,color:"#1a3a5c"}}>FORM: FO-057 Planned General Inspection</div>
                    <div style={{fontSize:"11px",fontWeight:600,color:"#555"}}>Heathrow Minor Works/Project Teams</div>
                </div>
                <img src={LOGO_SRC} alt="Logo" style={{height:36,objectFit:"contain"}} />
            </div>
            <table style={{width:"100%",borderCollapse:"collapse",marginBottom:12}}><tbody>
            {[["Project:",header.project,"Activity:",header.activity],["Location:",header.location,"Client:",header.client],["Representative (Auditee):",header.representative,"Inspection By:",header.inspectionBy],["Contractor:",header.contractor,"Inspection No:",header.inspectionNo],["Date:",header.date,"Time:",header.time]].map((r,i)=>(
                <tr key={i}><td style={{...h,width:"14%"}}>{r[0]}</td><td style={{...c,width:"36%"}}>{r[1]}</td><td style={{...h,width:"14%"}}>{r[2]}</td><td style={{...c,width:"36%"}}>{r[3]}</td></tr>
            ))}
            </tbody></table>
            <table style={{width:"100%",borderCollapse:"collapse",marginBottom:12}}>
                <thead><tr><th style={{...h,width:"7%"}}>Item No.</th><th style={{...h,width:"38%"}}>Requirement</th><th style={{...h,width:"10%",textAlign:"center"}}>Safe (Y) / Unsafe (N) / N/A</th><th style={{...h,width:"45%"}}>Comments</th></tr></thead>
                <tbody>
                {SECTIONS.map(section=>(
                    <>
                        <tr key={`s${section.id}`}><td colSpan={4} style={{...c,backgroundColor:"#e8eef4",fontWeight:700,fontSize:"10px",color:"#1a3a5c"}}>{section.id}.0 {section.title}</td></tr>
                        {section.items.map(item=>{const it=items[item.id];const cmt=it?.status==="N/A"?(it?.comment||NA_COMMENTS[item.id]||"Not applicable."):(it?.comment||"");
                            return <tr key={item.id}><td style={{...c,textAlign:"center",fontWeight:600}}>{item.id}</td><td style={c}>{item.label}</td><td style={{...c,textAlign:"center",fontWeight:700,color:it?.status==="N"?"#c0392b":it?.status==="Y"?"#27ae60":"#7f8c8d"}}>{it?.status||"—"}</td><td style={c}>{cmt}</td></tr>;})}
                        {section.subItems?.map(item=>{const it=items[item.id];const cmt=it?.status==="N/A"?(it?.comment||NA_COMMENTS[item.id]||"Not applicable."):(it?.comment||"");
                            return <tr key={item.id}><td style={{...c,textAlign:"center"}}></td><td style={{...c,paddingLeft:20,fontStyle:"italic"}}>{item.label}</td><td style={{...c,textAlign:"center",fontWeight:700,color:it?.status==="N"?"#c0392b":it?.status==="Y"?"#27ae60":"#7f8c8d"}}>{it?.status||"—"}</td><td style={c}>{cmt}</td></tr>;})}
                    </>
                ))}
                <tr><td colSpan={4} style={{...c,backgroundColor:"#e8eef4",fontWeight:700,fontSize:"10px",color:"#1a3a5c"}}>8.0 Additional Site-Specific Questions</td></tr>
                <tr><td colSpan={4} style={{...c,minHeight:40,height:40}}>{signoff.additionalNotes}</td></tr>
                </tbody>
            </table>
            <div style={{fontSize:"8px",color:"#555",marginBottom:6}}><strong>Action Categories:</strong> <span style={{color:"#c0392b"}}>H = High</span> (Immediate risk – Stop work) | <span style={{color:"#e67e22"}}>M = Medium</span> (Rectify 24hrs–7 days) | <span style={{color:"#2980b9"}}>L = Low</span> (Minor / process improvement)</div>
            <table style={{width:"100%",borderCollapse:"collapse",marginBottom:12}}>
                <thead><tr><th style={{...h,width:"7%"}}>Item No.</th><th style={{...h,width:"25%"}}>Good Practice / Areas for Improvement</th><th style={{...h,width:"8%",textAlign:"center"}}>H/M/L</th><th style={{...h,width:"25%"}}>Proposed Action</th><th style={{...h,width:"15%"}}>Action Owner</th><th style={{...h,width:"12%"}}>Closure Date</th></tr></thead>
                <tbody>{actions.length===0?<tr><td colSpan={6} style={{...c,textAlign:"center",color:"#888",fontStyle:"italic"}}>No actions recorded</td></tr>:actions.map((a,i)=>(<tr key={i}><td style={{...c,textAlign:"center"}}>{a.itemNo}</td><td style={c}>{a.description}</td><td style={{...c,textAlign:"center",fontWeight:700,color:a.category==="H"?"#c0392b":a.category==="M"?"#e67e22":"#2980b9"}}>{a.category}</td><td style={c}>{a.proposedAction}</td><td style={c}>{a.actionOwner}</td><td style={c}>{a.closureDate}</td></tr>))}</tbody>
            </table>
            <table style={{width:"100%",borderCollapse:"collapse",marginBottom:12}}><tbody>
            <tr><td style={{...h,width:"20%"}}></td><td style={{...h,width:"28%"}}>Name</td><td style={{...h,width:"28%"}}>Signature</td><td style={{...h,width:"24%"}}>Date</td></tr>
            <tr>
                <td style={{...c,fontWeight:700}}>Report Issued by:</td>
                <td style={c}>{signoff.issuedByName}</td>
                <td style={{...c,padding:2}}>{signoff.issuedBySig&&<img src={signoff.issuedBySig} alt="" style={{height:36,maxWidth:"90%",objectFit:"contain"}} />}</td>
                <td style={c}>{signoff.issuedByDate}</td>
            </tr>
            <tr>
                <td style={{...c,fontWeight:700}}>Report Accepted by:</td>
                <td style={c}>{signoff.acceptedByName}</td>
                <td style={{...c,padding:2}}>{signoff.acceptedBySig&&<img src={signoff.acceptedBySig} alt="" style={{height:36,maxWidth:"90%",objectFit:"contain"}} />}</td>
                <td style={c}>{signoff.acceptedByDate}</td>
            </tr>
            </tbody></table>
            <div style={{fontSize:"8px",color:"#555",borderTop:"1px solid #ccc",paddingTop:6}}><strong>Distribution:</strong> {distributions||"Person accepting inspection on site • Project Manager/PIM • Minor Works Project HSE Manager • Senior HSE Manager for Transportation"}</div>
            {imagePages.map((page,pi)=>(
                <div key={pi} style={{pageBreakBefore:"always",paddingTop:12}}>
                    <div style={{borderBottom:"3px solid #1a3a5c",paddingBottom:8,marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div>
                            <div style={{fontSize:"14px",fontWeight:800,color:"#1a3a5c"}}>FORM: FO-057 Planned General Inspection</div>
                            <div style={{fontSize:"11px",fontWeight:600,color:"#555"}}>Heathrow Minor Works/Project Teams — Photo Evidence (Page {pi+1})</div>
                        </div>
                        <img src={LOGO_SRC} alt="Logo" style={{height:36,objectFit:"contain"}} />
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridTemplateRows:"1fr 1fr",gap:8,height:"calc(297mm - 60mm)"}}>
                        {page.map((img,i)=>(
                            <div key={i} style={{border:"1px solid #ddd",borderRadius:4,overflow:"hidden",display:"flex",flexDirection:"column"}}>
                                <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",backgroundColor:"#f8f8f8",overflow:"hidden"}}>
                                    <img src={img.dataUrl} alt="" style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}} />
                                </div>
                                {img.caption&&<div style={{padding:"4px 6px",fontSize:"8px",color:"#333",backgroundColor:"#f1f5f9",borderTop:"1px solid #ddd",textAlign:"center"}}>{img.caption}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Main App ───
export default function PGIFormGenerator(){
    const t=useTheme();
    const mobile=useMobile();
    const [view,setView]=useState("form");
    const [header,setHeader]=useState(defaultHeader);
    const [items,setItems]=useState(initItems);
    const [actions,setActions]=useState([]);
    const [signoff,setSignoff]=useState(defaultSignoff);
    const [activeSection,setActiveSection]=useState(null);
    const [distributions,setDistributions]=useState("");
    const [images,setImages]=useState([]);
    const printRef=useRef();

    const updateHeader=(k,v)=>setHeader(p=>({...p,[k]:v}));
    const updateSignoff=(k,v)=>setSignoff(p=>({...p,[k]:v}));
    const setItemStatus=useCallback((id,status)=>{setItems(p=>{const cur=p[id]||{status:"",comment:""};let comment=cur.comment;if(status==="N/A")comment=NA_COMMENTS[id]||"Not applicable.";else if(cur.status==="N/A")comment="";return{...p,[id]:{status,comment}};});},[]);
    const setItemComment=useCallback((id,comment)=>{setItems(p=>({...p,[id]:{...p[id],comment}}));},[]);
    const addAction=()=>setActions(p=>[...p,defaultAction()]);
    const removeAction=id=>setActions(p=>p.filter(a=>a.id!==id));
    const updateAction=(id,k,v)=>setActions(p=>p.map(a=>a.id===id?{...a,[k]:v}:a));

    const handleImageUpload=e=>{Array.from(e.target.files).forEach(file=>{const reader=new FileReader();reader.onload=ev=>setImages(prev=>[...prev,{id:Date.now()+Math.random(),dataUrl:ev.target.result,caption:"",fileName:file.name}]);reader.readAsDataURL(file);});e.target.value="";};
    const removeImage=id=>setImages(p=>p.filter(img=>img.id!==id));
    const updateImageCaption=(id,caption)=>setImages(p=>p.map(img=>img.id===id?{...img,caption}:img));
    const moveImage=(idx,dir)=>setImages(p=>{const a=[...p];const n=idx+dir;if(n<0||n>=a.length)return a;[a[idx],a[n]]=[a[n],a[idx]];return a;});

    const handlePrint=()=>{const win=window.open("","_blank");win.document.write(`<!DOCTYPE html><html><head><title>PGI FO-057 - ${header.project||"Report"}</title><style>@media print{body{margin:0}@page{size:A4;margin:8mm}}body{font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:0;background:#fff;color:#1a1a1a;-webkit-print-color-adjust:exact;print-color-adjust:exact}</style></head><body>${printRef.current.innerHTML}</body></html>`);win.document.close();setTimeout(()=>win.print(),400);};
    const handleSaveJSON=()=>{const data={header,items,actions,signoff,distributions,images,exportedAt:new Date().toISOString()};const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`PGI_${header.inspectionNo||"draft"}_${header.date||"nodate"}.json`;a.click();URL.revokeObjectURL(url);};
    const handleLoadJSON=()=>{const input=document.createElement("input");input.type="file";input.accept=".json";input.onchange=e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{try{const d=JSON.parse(ev.target.result);if(d.header)setHeader(d.header);if(d.items)setItems(d.items);if(d.actions)setActions(d.actions);if(d.signoff)setSignoff(d.signoff);if(d.distributions)setDistributions(d.distributions);if(d.images)setImages(d.images);}catch{alert("Invalid JSON file");}};reader.readAsText(file);};input.click();};

    const completionCount=Object.values(items).filter(i=>i.status).length;
    const totalItems=Object.keys(items).length;
    const pct=Math.round((completionCount/totalItems)*100);

    const inp={width:"100%",padding:"8px 12px",borderRadius:8,border:`1.5px solid ${t.border}`,fontSize:13,outline:"none",boxSizing:"border-box",backgroundColor:t.bgInput,color:t.text,fontFamily:"inherit"};

    if(view==="preview") return (
        <div style={{minHeight:"100vh",backgroundColor:t.bg}}>
            <div style={{position:"sticky",top:0,zIndex:10,backgroundColor:"#1e293b",padding:"10px 20px",display:"flex",alignItems:"center",gap:12,boxShadow:"0 2px 8px rgba(0,0,0,0.2)"}}>
                <button onClick={()=>setView("form")} style={{padding:"8px 16px",borderRadius:8,border:"1px solid #475569",backgroundColor:"transparent",color:"#e2e8f0",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit"}}>← Back</button>
                <button onClick={handlePrint} style={{padding:"8px 20px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#059669,#10b981)",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit"}}>Print / Save PDF</button>
                <span style={{color:"#94a3b8",fontSize:12}}>Preview{images.length>0?` — ${Math.ceil(images.length/4)} photo page(s)`:""}</span>
            </div>
            <div ref={printRef} style={{margin:"20px auto",maxWidth:900,backgroundColor:"#fff",boxShadow:"0 4px 24px rgba(0,0,0,0.12)",borderRadius:4,overflow:"hidden"}}>
                <PrintDocument header={header} items={items} actions={actions} signoff={signoff} distributions={distributions} images={images} />
            </div>
        </div>
    );

    return (
        <div style={{minHeight:"100vh",backgroundColor:t.bg,fontFamily:"'Inter','Segoe UI',-apple-system,sans-serif",color:t.text}}>
            <div style={{background:t.topBar,padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10,boxShadow:"0 4px 16px rgba(0,0,0,0.15)",flexWrap:"wrap",gap:10}}>
                <div>
                    <div style={{fontSize:15,fontWeight:800,color:t.topBarText}}>FO-057 PGI Generator</div>
                    <div style={{fontSize:10,color:"#64748b",marginTop:2}}>Planned General Inspection — Heathrow Minor Works</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <div style={{backgroundColor:t.progressBg,borderRadius:20,padding:"4px 12px",display:"flex",alignItems:"center",gap:6}}>
                        <div style={{width:60,height:5,backgroundColor:t.progressTrack,borderRadius:3,overflow:"hidden"}}>
                            <div style={{width:`${pct}%`,height:"100%",backgroundColor:pct===100?"#10b981":"#3b82f6",borderRadius:3,transition:"width 0.3s"}} />
                        </div>
                        <span style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>{pct}%</span>
                    </div>
                    <button onClick={handleLoadJSON} style={{padding:"7px 14px",borderRadius:8,border:"1px solid #475569",backgroundColor:"transparent",color:"#cbd5e1",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>Load</button>
                    <button onClick={handleSaveJSON} style={{padding:"7px 14px",borderRadius:8,border:"1px solid #475569",backgroundColor:"transparent",color:"#cbd5e1",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>Save</button>
                    <button onClick={()=>setView("preview")} style={{padding:"7px 18px",borderRadius:8,border:"none",backgroundColor:"#2563eb",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit"}}>Preview</button>
                </div>
            </div>

            <div style={{maxWidth:860,margin:"0 auto",padding:"20px 16px"}}>
                {/* Header */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`,overflow:"hidden"}}>
                    <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Inspection Details</div>
                    <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"minmax(0,1fr) minmax(0,1fr)",gap:12}}>
                        {[["project","Project"],["activity","Activity"],["location","Location"],["client","Client"],["representative","Representative (Auditee)"],["inspectionBy","Inspection By"],["contractor","Contractor"]].map(([key,label])=>(
                            <div key={key} style={{minWidth:0,overflow:"hidden"}}>
                                <label style={{fontSize:11,fontWeight:600,color:t.textMuted,marginBottom:4,display:"block",textTransform:"uppercase",letterSpacing:"0.5px"}}>{label}</label>
                                <HeaderSelect value={header[key]} onChange={v=>updateHeader(key,v)} options={HEADER_OPTIONS[key]} placeholder={label} t={t} />
                            </div>
                        ))}
                        <div><label style={{fontSize:11,fontWeight:600,color:t.textMuted,marginBottom:4,display:"block",textTransform:"uppercase",letterSpacing:"0.5px"}}>Inspection No.</label><input type="text" value={header.inspectionNo} onChange={e=>updateHeader("inspectionNo",e.target.value)} style={inp} placeholder="e.g. 040" /></div>
                        <div><label style={{fontSize:11,fontWeight:600,color:t.textMuted,marginBottom:4,display:"block",textTransform:"uppercase",letterSpacing:"0.5px"}}>Date</label><input type="date" value={header.date} onChange={e=>updateHeader("date",e.target.value)} style={inp} /></div>
                        <div><label style={{fontSize:11,fontWeight:600,color:t.textMuted,marginBottom:4,display:"block",textTransform:"uppercase",letterSpacing:"0.5px"}}>Time</label><input type="time" value={header.time} onChange={e=>updateHeader("time",e.target.value)} style={inp} /></div>
                    </div>
                </div>

                {/* Sections */}
                {SECTIONS.map(section=>{
                    const isOpen=activeSection===section.id;
                    const all=[...section.items,...(section.subItems||[])];
                    const filled=all.filter(i=>items[i.id]?.status).length;
                    const allDone=filled===all.length;
                    return (
                        <div key={section.id} style={{backgroundColor:t.bgCard,borderRadius:12,marginBottom:8,border:`1px solid ${t.border}`,overflow:"hidden"}}>
                            <button onClick={()=>setActiveSection(isOpen?null:section.id)}
                                    style={{width:"100%",padding:"12px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",border:"none",backgroundColor:isOpen?t.sectionOpen:t.bgCard,cursor:"pointer",fontFamily:"inherit",color:t.text}}>
                                <div style={{display:"flex",alignItems:"center",gap:10}}>
                                    <span style={{width:26,height:26,borderRadius:7,backgroundColor:allDone?"#064e3b":t.bgCardAlt,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:allDone?"#10b981":t.textMuted,fontWeight:600}}>{allDone?"✓":section.id}</span>
                                    <span style={{fontSize:13,fontWeight:600}}>{section.title}</span>
                                </div>
                                <div style={{display:"flex",alignItems:"center",gap:8}}>
                                    <span style={{fontSize:11,color:t.textDim}}>{filled}/{all.length}</span>
                                    <span style={{fontSize:11,color:t.textDim,transform:isOpen?"rotate(180deg)":"rotate(0)",transition:"transform 0.2s"}}>▼</span>
                                </div>
                            </button>
                            {isOpen&&(
                                <div style={{padding:"0 18px 14px"}}>
                                    {section.items.map(item=>(
                                        <div key={item.id} style={{padding:"10px 0",borderBottom:`1px solid ${t.borderLight}`}}>
                                            <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:6}}>
                                                <span style={{fontSize:11,fontWeight:700,color:t.textMuted,minWidth:34,flexShrink:0}}>{item.id}</span>
                                                <span style={{fontSize:13,flex:1,minWidth:0}}>{item.label}</span>
                                                <StatusToggle value={items[item.id]?.status} onChange={v=>setItemStatus(item.id,v)} t={t} />
                                            </div>
                                            <div style={{marginLeft:44}}>
                                                <CommentField itemId={item.id} status={items[item.id]?.status} comment={items[item.id]?.comment||""} onChangeComment={v=>setItemComment(item.id,v)} t={t} />
                                            </div>
                                        </div>
                                    ))}
                                    {section.subItems?.map(item=>(
                                        <div key={item.id} style={{padding:"8px 0 8px 44px",borderBottom:`1px solid ${t.borderLight}`}}>
                                            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
                                                <span style={{fontSize:13,flex:1,fontStyle:"italic",minWidth:0,color:t.textMuted}}>{item.label}</span>
                                                <StatusToggle value={items[item.id]?.status} onChange={v=>setItemStatus(item.id,v)} t={t} />
                                            </div>
                                            <CommentField itemId={item.id} status={items[item.id]?.status} comment={items[item.id]?.comment||""} onChangeComment={v=>setItemComment(item.id,v)} t={t} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Actions */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,marginTop:14,border:`1px solid ${t.border}`}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                        <div style={{fontSize:14,fontWeight:700}}>Actions / Good Practice</div>
                        <button onClick={addAction} style={{padding:"7px 16px",borderRadius:8,border:"none",backgroundColor:t.accent,color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>+ Add Action</button>
                    </div>
                    {actions.length===0&&<div style={{textAlign:"center",padding:20,color:t.textDim,fontSize:13}}>No actions added yet.</div>}
                    {actions.map((action,idx)=>(
                        <div key={action.id} style={{padding:14,borderRadius:10,border:`1px solid ${t.border}`,marginBottom:8,backgroundColor:t.bgCardAlt}}>
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                                <span style={{fontSize:12,fontWeight:700,color:t.textMuted}}>Action #{idx+1}</span>
                                <button onClick={()=>removeAction(action.id)} style={{fontSize:11,color:t.accentRed,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>✕ Remove</button>
                            </div>
                            <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"70px 1fr 90px",gap:8,marginBottom:8}}>
                                <div><label style={{fontSize:10,fontWeight:600,color:t.textMuted,display:"block",marginBottom:3}}>Item No.</label><input value={action.itemNo} onChange={e=>updateAction(action.id,"itemNo",e.target.value)} style={inp} placeholder="2.01" /></div>
                                <div><label style={{fontSize:10,fontWeight:600,color:t.textMuted,display:"block",marginBottom:3}}>Description</label><input value={action.description} onChange={e=>updateAction(action.id,"description",e.target.value)} style={inp} /></div>
                                <div><label style={{fontSize:10,fontWeight:600,color:t.textMuted,display:"block",marginBottom:3}}>Cat.</label><select value={action.category} onChange={e=>updateAction(action.id,"category",e.target.value)} style={{...inp,appearance:"auto"}}><option value="">—</option><option value="H">H</option><option value="M">M</option><option value="L">L</option></select></div>
                            </div>
                            <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr 130px",gap:8}}>
                                <div><label style={{fontSize:10,fontWeight:600,color:t.textMuted,display:"block",marginBottom:3}}>Proposed Action</label><input value={action.proposedAction} onChange={e=>updateAction(action.id,"proposedAction",e.target.value)} style={inp} /></div>
                                <div><label style={{fontSize:10,fontWeight:600,color:t.textMuted,display:"block",marginBottom:3}}>Action Owner</label><input value={action.actionOwner} onChange={e=>updateAction(action.id,"actionOwner",e.target.value)} style={inp} /></div>
                                <div><label style={{fontSize:10,fontWeight:600,color:t.textMuted,display:"block",marginBottom:3}}>Closure Date</label><input type="date" value={action.closureDate} onChange={e=>updateAction(action.id,"closureDate",e.target.value)} style={inp} /></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Photos */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                        <div style={{fontSize:14,fontWeight:700}}>Photo Evidence</div>
                        <label style={{padding:"7px 16px",borderRadius:8,border:"none",backgroundColor:t.accent,color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600,display:"inline-flex",alignItems:"center",gap:4,fontFamily:"inherit"}}>
                            + Upload Photos<input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{display:"none"}} />
                        </label>
                    </div>
                    {images.length===0&&<div style={{textAlign:"center",padding:20,color:t.textDim,fontSize:13}}>No photos uploaded. Images appear 4 per page in the report.</div>}
                    {images.length>0&&<div style={{fontSize:11,color:t.textMuted,marginBottom:10}}>{images.length} photo(s) — {Math.ceil(images.length/4)} page(s) in report</div>}
                    <div style={{display:"grid",gridTemplateColumns:mobile?"repeat(2,1fr)":"repeat(4,1fr)",gap:8}}>
                        {images.map((img,idx)=>(
                            <div key={img.id} style={{border:`1px solid ${t.border}`,borderRadius:8,overflow:"hidden",backgroundColor:t.bgCardAlt}}>
                                <div style={{position:"relative",aspectRatio:"4/3",backgroundColor:t.bg,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                                    <img src={img.dataUrl} alt="" style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}} />
                                    <div style={{position:"absolute",top:3,right:3,display:"flex",gap:2}}>
                                        {idx>0&&<button onClick={()=>moveImage(idx,-1)} style={{width:20,height:20,borderRadius:4,border:"none",backgroundColor:"rgba(0,0,0,0.6)",color:"#fff",cursor:"pointer",fontSize:9}}>←</button>}
                                        {idx<images.length-1&&<button onClick={()=>moveImage(idx,1)} style={{width:20,height:20,borderRadius:4,border:"none",backgroundColor:"rgba(0,0,0,0.6)",color:"#fff",cursor:"pointer",fontSize:9}}>→</button>}
                                        <button onClick={()=>removeImage(img.id)} style={{width:20,height:20,borderRadius:4,border:"none",backgroundColor:"rgba(220,38,38,0.85)",color:"#fff",cursor:"pointer",fontSize:9}}>✕</button>
                                    </div>
                                    {idx%4===0&&<div style={{position:"absolute",bottom:3,left:3,fontSize:8,backgroundColor:"rgba(0,0,0,0.6)",color:"#fff",padding:"1px 5px",borderRadius:3}}>Pg {Math.floor(idx/4)+1}</div>}
                                </div>
                                <input value={img.caption} onChange={e=>updateImageCaption(img.id,e.target.value)} placeholder="Caption..." style={{width:"100%",padding:"5px 8px",border:"none",borderTop:`1px solid ${t.border}`,fontSize:10,outline:"none",boxSizing:"border-box",fontFamily:"inherit",backgroundColor:t.bgCardAlt,color:t.text}} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sign-off */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`,overflow:"hidden"}}>
                    <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Sign-off & Distribution</div>

                    {/* Report Issued By */}
                    <div style={{padding:14,borderRadius:10,border:`1px solid ${t.border}`,backgroundColor:t.bgCardAlt,marginBottom:10}}>
                        <div style={{fontSize:12,fontWeight:700,color:t.textMuted,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.5px"}}>Report Issued By</div>
                        <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:12,marginBottom:12}}>
                            <div style={{minWidth:0,overflow:"hidden"}}>
                                <label style={{fontSize:11,fontWeight:600,color:t.textMuted,marginBottom:4,display:"block"}}>Name</label>
                                <HeaderSelect value={signoff.issuedByName} onChange={v=>updateSignoff("issuedByName",v)} options={HEADER_OPTIONS.inspectionBy} placeholder="Name" t={t} />
                            </div>
                            <div>
                                <label style={{fontSize:11,fontWeight:600,color:t.textMuted,marginBottom:4,display:"block"}}>Date</label>
                                <input type="date" value={signoff.issuedByDate} onChange={e=>updateSignoff("issuedByDate",e.target.value)} style={inp} />
                            </div>
                        </div>
                        <div>
                            <label style={{fontSize:11,fontWeight:600,color:t.textMuted,marginBottom:6,display:"block"}}>Signature</label>
                            <SignaturePad value={signoff.issuedBySig} onChange={v=>updateSignoff("issuedBySig",v)} t={t} />
                        </div>
                    </div>

                    {/* Report Accepted By */}
                    <div style={{padding:14,borderRadius:10,border:`1px solid ${t.border}`,backgroundColor:t.bgCardAlt,marginBottom:12}}>
                        <div style={{fontSize:12,fontWeight:700,color:t.textMuted,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.5px"}}>Report Accepted By</div>
                        <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:12,marginBottom:12}}>
                            <div style={{minWidth:0,overflow:"hidden"}}>
                                <label style={{fontSize:11,fontWeight:600,color:t.textMuted,marginBottom:4,display:"block"}}>Name</label>
                                <HeaderSelect value={signoff.acceptedByName} onChange={v=>updateSignoff("acceptedByName",v)} options={HEADER_OPTIONS.representative} placeholder="Name" t={t} />
                            </div>
                            <div>
                                <label style={{fontSize:11,fontWeight:600,color:t.textMuted,marginBottom:4,display:"block"}}>Date</label>
                                <input type="date" value={signoff.acceptedByDate} onChange={e=>updateSignoff("acceptedByDate",e.target.value)} style={inp} />
                            </div>
                        </div>
                        <div>
                            <label style={{fontSize:11,fontWeight:600,color:t.textMuted,marginBottom:6,display:"block"}}>Signature</label>
                            <SignaturePad value={signoff.acceptedBySig} onChange={v=>updateSignoff("acceptedBySig",v)} t={t} />
                        </div>
                    </div>

                    <div style={{marginTop:12}}><label style={{fontSize:11,fontWeight:600,color:t.textMuted,marginBottom:4,display:"block",textTransform:"uppercase",letterSpacing:"0.5px"}}>Additional Notes (Section 8.0)</label><textarea value={signoff.additionalNotes} onChange={e=>updateSignoff("additionalNotes",e.target.value)} rows={3} style={{...inp,resize:"vertical"}} placeholder="Additional site-specific notes..." /></div>
                    <div style={{marginTop:12}}><label style={{fontSize:11,fontWeight:600,color:t.textMuted,marginBottom:4,display:"block",textTransform:"uppercase",letterSpacing:"0.5px"}}>Distribution List</label><textarea value={distributions} onChange={e=>setDistributions(e.target.value)} rows={2} style={{...inp,resize:"vertical"}} placeholder="Names / emails for report distribution..." /></div>
                </div>

                <div style={{display:"flex",gap:10,justifyContent:"center",padding:"14px 0 36px"}}>
                    <button onClick={handleSaveJSON} style={{padding:"12px 24px",borderRadius:10,border:`2px solid ${t.border}`,backgroundColor:t.bgCard,color:t.text,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit"}}>Save Draft (JSON)</button>
                    <button onClick={()=>setView("preview")} style={{padding:"12px 24px",borderRadius:10,border:"none",backgroundColor:t.accent,color:"#fff",cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit",boxShadow:"0 4px 16px rgba(0,0,0,0.2)"}}>Preview & Print</button>
                </div>
            </div>
        </div>
    );
}

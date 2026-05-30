import { useState, useRef, useEffect } from "react";

function useDarkMode(){const [d,setD]=useState(()=>window.matchMedia?.("(prefers-color-scheme: dark)").matches??false);useEffect(()=>{const mq=window.matchMedia("(prefers-color-scheme: dark)");const h=e=>setD(e.matches);mq.addEventListener("change",h);return()=>mq.removeEventListener("change",h);},[]);return d;}
function useMobile(bp=640){const [m,setM]=useState(()=>window.innerWidth<bp);useEffect(()=>{const h=()=>setM(window.innerWidth<bp);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[bp]);return m;}
function useTheme(){const dark=useDarkMode();return dark?{bg:"#0f172a",bgCard:"#1e293b",bgCardAlt:"#172032",bgInput:"#1e293b",bgHover:"#334155",border:"#334155",borderLight:"#475569",text:"#e2e8f0",textMuted:"#94a3b8",textDim:"#64748b",accent:"#3b82f6",accentGreen:"#10b981",accentRed:"#ef4444",topBar:"linear-gradient(135deg,#0c1322,#162032)",topBarText:"#f1f5f9",statusY:"#059669",statusN:"#dc2626",btnBorder:"#475569",selectBg:"#1e293b"}:{bg:"#f8fafc",bgCard:"#ffffff",bgCardAlt:"#fafbfc",bgInput:"#ffffff",bgHover:"#f8fafc",border:"#e2e8f0",borderLight:"#f1f5f9",text:"#1e293b",textMuted:"#64748b",textDim:"#94a3b8",accent:"#2563eb",accentGreen:"#059669",accentRed:"#dc2626",topBar:"linear-gradient(135deg,#0f172a,#1e293b)",topBarText:"#f1f5f9",statusY:"#059669",statusN:"#dc2626",btnBorder:"#d1d5db",selectBg:"#ffffff"};}

function HeaderSelect({value,onChange,options,placeholder,t,multiline}){
    const [mode,setMode]=useState("select");
    const show=mode==="custom"||(value&&!options.includes(value));
    const w={display:"flex",width:"100%",minWidth:0,overflow:"hidden"};
    const f={flex:"1 1 0%",minWidth:0,padding:"8px 12px",borderRadius:"8px 0 0 8px",border:`1.5px solid ${t.border}`,borderRight:"none",fontSize:13,outline:"none",boxSizing:"border-box",backgroundColor:t.bgInput,color:t.text,fontFamily:"inherit"};
    const b={padding:"8px 12px",borderRadius:"0 8px 8px 0",border:`1.5px solid ${t.border}`,borderLeft:"none",backgroundColor:t.bgCardAlt,cursor:"pointer",fontSize:11,color:t.textMuted,fontFamily:"inherit",flexShrink:0,alignSelf:multiline?"flex-start":"auto"};
    if(show) return (<div style={w}>{multiline?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={2} style={{...f,resize:"vertical",minHeight:38}} />:<input type="text" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{...f,overflow:"hidden",textOverflow:"ellipsis"}} />}<button onClick={()=>{setMode("select");onChange("");}} style={b}>▼</button></div>);
    return (<div style={w}><select value={value} onChange={e=>onChange(e.target.value)} style={{...f,appearance:"auto"}}><option value="">— Select —</option>{options.map((o,i)=><option key={i} value={o}>{o}</option>)}</select><button onClick={()=>setMode("custom")} style={b}>✎</button></div>);
}
function YNToggle({value,onChange,t}){
    return (<div style={{display:"flex",gap:4}}>{["Yes","No"].map(opt=>(<button key={opt} onClick={()=>onChange(value===opt?"":opt)} style={{padding:"4px 12px",borderRadius:6,fontSize:11,cursor:"pointer",fontFamily:"inherit",border:value===opt?"2px solid transparent":`1px solid ${t.border}`,fontWeight:value===opt?700:400,backgroundColor:value===opt?(opt==="Yes"?t.statusY:t.statusN):t.bgInput,color:value===opt?"#fff":t.text}}>{opt}</button>))}</div>);
}

const COMPANY_LIST=["AtkinsRéalis","Computacenter","Sword Services","Maber Construction Ltd","Contour","STS","Mitie","Costain"];
const AUTHOR_LIST=["Fred Tebbenham","Peter Murphy","Mat Godwin","Marius Matei","Jacob McCalla"];
const POSITION_LIST=["CM","Supervisor","Engineer","Operative"];
const TEAM_LIST=["TEAM 1","TEAM 2","TEAM 3","TEAM 4","TEAM 5","TEAM 6"];

const defaultReport={
    projectName:"",description:"",site:"",author:"",date:new Date().toISOString().split("T")[0],
    engineers:[{id:1,name:"",position:"CM",company:"AtkinsRéalis",date:"",team:""},{id:2,name:"",position:"Supervisor",company:"Computacenter",date:"",team:"TEAM 1"},{id:3,name:"",position:"Engineer",company:"Computacenter",date:"",team:"TEAM 1"}],
    equipment:[{id:1,type:"",checked:"Yes",company:"",team:""}],
    teamActivities:[{id:1,team:"TEAM 1",description:""}],
    otherInfo:[
        {id:1,label:"LSS Used",value:"",team:""},{id:2,label:"Road Closure",value:"",team:""},{id:3,label:"Safe Start, Safe Finish completed",value:"",team:""},
        {id:4,label:"Step Back carried out",value:"",team:""},{id:5,label:"Leaving IT cable in a safe manner",value:"",team:""},{id:6,label:"Signed off Permits",value:"",team:""},
        {id:7,label:"ATP (Baggage) Permit",value:"",team:""},{id:8,label:"Confined Space Permit",value:"",team:""},{id:9,label:"Street Works Permit",value:"",team:""},{id:10,label:"AWA Permit",value:"",team:""}
    ],
    issues:[],
    costainRecipient:""
};

// ─── Client Print ───
function ClientReport({data,logoSrc,images}){
    const c={border:"1px solid #c0c0c0",padding:"6px 10px",fontSize:"10px",verticalAlign:"top"};
    const h={...c,backgroundColor:"#1a3a5c",color:"#fff",fontWeight:700};
    const lh={...c,fontWeight:700,backgroundColor:"#e8eef4",color:"#1a3a5c",width:"18%"};
    const teams=[...new Set(data.engineers.map(e=>e.team).filter(Boolean))].sort();
    const teamPhotos={};images.forEach(img=>{const g=img.group||"General";if(!teamPhotos[g])teamPhotos[g]=[];teamPhotos[g].push(img);});

    return (
        <div style={{fontFamily:"'Segoe UI',Arial,sans-serif",color:"#1a1a1a",backgroundColor:"#fff",maxWidth:"210mm",margin:"0 auto",padding:"10mm",fontSize:"10px",lineHeight:1.5}}>
            {logoSrc&&<div style={{textAlign:"center",marginBottom:16}}><img src={logoSrc} alt="Logo" style={{height:50,objectFit:"contain"}} /></div>}

            {/* Header */}
            <table style={{width:"100%",borderCollapse:"collapse",marginBottom:14}}>
                <tbody>
                <tr><td style={lh}>Project Name</td><td style={c}>{data.projectName}</td><td style={lh}>Author</td><td style={c}>{data.author}</td></tr>
                <tr><td style={lh}>Description</td><td style={c}>{data.description}</td><td style={lh}>Date</td><td style={c}>{data.date}</td></tr>
                <tr><td style={lh}>Site</td><td style={c} colSpan={3}>{data.site}</td></tr>
                </tbody>
            </table>

            {/* Engineers without team (CM etc) */}
            {(()=>{const noTeam=data.engineers.filter(e=>e.name&&!e.team);return noTeam.length>0?<table style={{width:"100%",borderCollapse:"collapse",marginBottom:14}}>
                <thead><tr><th style={h}>Name</th><th style={h}>Position</th><th style={h}>Company</th><th style={h}>Date</th></tr></thead>
                <tbody>{noTeam.map((e,i)=>(<tr key={i}><td style={c}>{e.name}</td><td style={c}>{e.position}</td><td style={c}>{e.company}</td><td style={c}>{e.date||data.date}</td></tr>))}</tbody>
            </table>:null;})()}

            {/* Per-team sections */}
            {teams.map(team=>{
                const members=data.engineers.filter(e=>e.team===team&&e.name);
                const activity=(data.teamActivities||[]).find(a=>a.team===team);
                const equip=data.equipment.filter(e=>e.type&&(e.team===team||!e.team));
                const permits=(data.otherInfo||[]).filter(x=>x.label&&(x.team===team||!x.team));
                const photos=teamPhotos[team]||[];
                const photoPages=[];for(let i=0;i<photos.length;i+=4)photoPages.push(photos.slice(i,i+4));

                return (
                    <div key={team} style={{marginBottom:16}}>
                        <div style={{fontSize:"12px",fontWeight:700,color:"#fff",backgroundColor:"#1a3a5c",padding:"6px 10px",marginBottom:0,borderRadius:"4px 4px 0 0"}}>{team}</div>

                        {/* Members */}
                        <table style={{width:"100%",borderCollapse:"collapse",marginBottom:10}}>
                            <thead><tr><th style={h}>Name</th><th style={h}>Position</th><th style={h}>Company</th><th style={h}>Date</th></tr></thead>
                            <tbody>{members.map((e,i)=>(<tr key={i}><td style={c}>{e.name}</td><td style={c}>{e.position}</td><td style={c}>{e.company}</td><td style={c}>{e.date||data.date}</td></tr>))}</tbody>
                        </table>

                        {/* Equipment */}
                        {equip.length>0&&<table style={{width:"100%",borderCollapse:"collapse",marginBottom:10}}>
                            <thead><tr><th style={h}>Plant / Equipment</th><th style={h}>Checked</th><th style={h}>Company</th></tr></thead>
                            <tbody>{equip.map((e,i)=>(<tr key={i}><td style={c}>{e.type}</td><td style={{...c,fontWeight:600,color:e.checked==="Yes"?"#059669":"#dc2626"}}>{e.checked}</td><td style={c}>{e.company}</td></tr>))}</tbody>
                        </table>}

                        {/* Activity */}
                        {activity?.description&&<table style={{width:"100%",borderCollapse:"collapse",marginBottom:10}}>
                            <thead><tr><th style={{...h,fontSize:"11px"}}>Activity Description</th></tr></thead>
                            <tbody><tr><td style={{...c,whiteSpace:"pre-wrap",lineHeight:1.6}}>{activity.description}</td></tr></tbody>
                        </table>}

                        {/* Permits */}
                        {permits.length>0&&<table style={{width:"100%",borderCollapse:"collapse",marginBottom:10}}>
                            <thead><tr><th style={h}>Other Info</th><th style={{...h,width:40,textAlign:"center"}}>Yes</th><th style={{...h,width:40,textAlign:"center"}}>No</th></tr></thead>
                            <tbody>{permits.map((x,i)=>(<tr key={i}><td style={c}>{x.label}</td><td style={{...c,textAlign:"center"}}>{x.value==="Yes"?"☒":"☐"}</td><td style={{...c,textAlign:"center"}}>{x.value==="No"?"☒":"☐"}</td></tr>))}</tbody>
                        </table>}

                        {/* Photos */}
                        {photoPages.map((page,pi)=>(
                            <div key={pi} style={{...(pi>0?{pageBreakBefore:"always",paddingTop:12}:{}),marginBottom:10}}>
                                {pi>0&&logoSrc&&<div style={{textAlign:"center",marginBottom:12}}><img src={logoSrc} alt="Logo" style={{height:50,objectFit:"contain"}} /></div>}
                                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                                    {page.map((img,i)=>(<div key={i} style={{border:"1px solid #ddd",borderRadius:4,overflow:"hidden"}}><div style={{aspectRatio:"4/3",display:"flex",alignItems:"center",justifyContent:"center",backgroundColor:"#f8f8f8",overflow:"hidden"}}><img src={img.dataUrl} alt="" style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}} /></div>{img.caption&&<div style={{padding:"3px 6px",fontSize:"8px",color:"#333",backgroundColor:"#f1f5f9",borderTop:"1px solid #ddd",textAlign:"center"}}>{img.caption}</div>}</div>))}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            })}

            {/* Issues */}
            <table style={{width:"100%",borderCollapse:"collapse",marginBottom:14}}>
                <thead><tr><th style={h}>Issues / Requests / Delays</th><th style={h}>Owner</th><th style={h}>Actioned by</th></tr></thead>
                <tbody>{data.issues.filter(x=>x.description).length===0?<tr><td style={c} colSpan={3}>No issues.</td></tr>:data.issues.map((x,i)=>(<tr key={i}><td style={{...c,whiteSpace:"pre-wrap"}}>{x.description}</td><td style={c}>{x.owner}</td><td style={c}>{x.actionedBy}</td></tr>))}</tbody>
            </table>

            <div style={{fontSize:"8px",color:"#888",textAlign:"center",paddingTop:8,borderTop:"1px solid #ccc"}}>AtkinsRéalis - Baseline / Référence</div>

            {/* General photos */}
            {(teamPhotos["General"]||[]).length>0&&(()=>{
                const pages=[];const gen=teamPhotos["General"];for(let i=0;i<gen.length;i+=4)pages.push(gen.slice(i,i+4));
                return pages.map((page,pi)=>(
                    <div key={`g${pi}`} style={{pageBreakBefore:"always",paddingTop:12}}>
                        {logoSrc&&<div style={{textAlign:"center",marginBottom:12}}><img src={logoSrc} alt="Logo" style={{height:50,objectFit:"contain"}} /></div>}
                        <div style={{fontSize:"12px",fontWeight:700,color:"#1a3a5c",marginBottom:8,borderBottom:"2px solid #1a3a5c",paddingBottom:4}}>Photos — General</div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridTemplateRows:"1fr 1fr",gap:8,height:"calc(297mm - 80mm)"}}>
                            {page.map((img,i)=>(<div key={i} style={{border:"1px solid #ddd",borderRadius:4,overflow:"hidden",display:"flex",flexDirection:"column"}}><div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",backgroundColor:"#f8f8f8",overflow:"hidden"}}><img src={img.dataUrl} alt="" style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}} /></div>{img.caption&&<div style={{padding:"4px 6px",fontSize:"8px",color:"#333",backgroundColor:"#f1f5f9",borderTop:"1px solid #ddd",textAlign:"center"}}>{img.caption}</div>}</div>))}
                        </div>
                    </div>
                ));
            })()}
        </div>
    );
}

// ─── Costain Print (simplified) ───
function CostainReport({data,logoSrc,images}){
    const c={border:"1px solid #c0c0c0",padding:"6px 10px",fontSize:"11px",verticalAlign:"top"};
    const h={...c,backgroundColor:"#1a3a5c",color:"#fff",fontWeight:700};
    const teams=[...new Set(data.engineers.map(e=>e.team).filter(Boolean))].sort();
    // Group photos by team
    const teamPhotos={};images.forEach(img=>{const g=img.group||"General";if(!teamPhotos[g])teamPhotos[g]=[];teamPhotos[g].push(img);});

    return (
        <div style={{fontFamily:"'Segoe UI',Arial,sans-serif",color:"#1a1a1a",backgroundColor:"#fff",maxWidth:"210mm",margin:"0 auto",padding:"10mm",fontSize:"11px",lineHeight:1.6}}>
            {logoSrc&&<div style={{textAlign:"center",marginBottom:16}}><img src={logoSrc} alt="Logo" style={{height:50,objectFit:"contain"}} /></div>}

            <div style={{fontSize:"14px",fontWeight:700,color:"#1a3a5c",marginBottom:4}}>{data.projectName}</div>
            <div style={{fontSize:"11px",color:"#555",marginBottom:16}}>Shift Report — {data.date}</div>

            {data.costainRecipient&&<div style={{marginBottom:16}}>Hi {data.costainRecipient},<br/>Please see the shift report from this evening. Photos from the team have been attached for reference.</div>}

            {/* Per-team sections */}
            {teams.map(team=>{
                const members=data.engineers.filter(e=>e.team===team&&e.name);
                const activity=(data.teamActivities||[]).find(a=>a.team===team);
                const permits=(data.otherInfo||[]).filter(x=>(x.team===team||!x.team)&&x.label&&x.value);
                const photos=teamPhotos[team]||[];
                const photoPages=[];for(let i=0;i<photos.length;i+=4)photoPages.push(photos.slice(i,i+4));

                return (
                    <div key={team} style={{marginBottom:20}}>
                        <div style={{fontSize:"13px",fontWeight:700,color:"#1a3a5c",borderBottom:"2px solid #1a3a5c",paddingBottom:4,marginBottom:10}}>{team}</div>

                        {/* Team members */}
                        {members.length>0&&<table style={{width:"100%",borderCollapse:"collapse",marginBottom:10}}>
                            <thead><tr><th style={h}>Name</th><th style={h}>Position</th></tr></thead>
                            <tbody>{members.map((e,i)=>(<tr key={i}><td style={c}>{e.name}</td><td style={c}>{e.position}</td></tr>))}</tbody>
                        </table>}

                        {/* Activity */}
                        {activity?.description&&<div style={{whiteSpace:"pre-wrap",fontSize:"11px",lineHeight:1.7,marginBottom:10,padding:"8px 10px",border:"1px solid #e0e0e0",borderRadius:4}}>{activity.description}</div>}

                        {/* Permits for this team */}
                        {permits.length>0&&<table style={{width:"100%",borderCollapse:"collapse",marginBottom:10}}>
                            <tbody>{permits.map((x,i)=>(<tr key={i}><td style={{...c,width:"60%"}}>{x.label}</td><td style={{...c,textAlign:"center",fontWeight:600,color:x.value==="Yes"?"#059669":"#dc2626"}}>{x.value}</td></tr>))}</tbody>
                        </table>}

                        {/* Team photos inline */}
                        {photoPages.map((page,pi)=>(
                            <div key={pi} style={{...(pi>0?{pageBreakBefore:"always",paddingTop:12}:{})}}>
                                {pi>0&&logoSrc&&<div style={{textAlign:"center",marginBottom:12}}><img src={logoSrc} alt="Logo" style={{height:50,objectFit:"contain"}} /></div>}
                                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                                    {page.map((img,i)=>(<div key={i} style={{border:"1px solid #ddd",borderRadius:4,overflow:"hidden"}}><div style={{aspectRatio:"4/3",display:"flex",alignItems:"center",justifyContent:"center",backgroundColor:"#f8f8f8",overflow:"hidden"}}><img src={img.dataUrl} alt="" style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}} /></div>{img.caption&&<div style={{padding:"3px 6px",fontSize:"8px",color:"#333",backgroundColor:"#f1f5f9",borderTop:"1px solid #ddd",textAlign:"center"}}>{img.caption}</div>}</div>))}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            })}

            {/* General (unassigned) photos */}
            {(teamPhotos["General"]||[]).length>0&&(()=>{
                const pages=[];const gen=teamPhotos["General"];for(let i=0;i<gen.length;i+=4)pages.push(gen.slice(i,i+4));
                return pages.map((page,pi)=>(
                    <div key={`g${pi}`} style={{pageBreakBefore:"always",paddingTop:12}}>
                        {logoSrc&&<div style={{textAlign:"center",marginBottom:12}}><img src={logoSrc} alt="Logo" style={{height:50,objectFit:"contain"}} /></div>}
                        <div style={{fontSize:"12px",fontWeight:700,color:"#1a3a5c",marginBottom:8,borderBottom:"2px solid #1a3a5c",paddingBottom:4}}>Photos — General</div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridTemplateRows:"1fr 1fr",gap:8,height:"calc(297mm - 80mm)"}}>
                            {page.map((img,i)=>(<div key={i} style={{border:"1px solid #ddd",borderRadius:4,overflow:"hidden",display:"flex",flexDirection:"column"}}><div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",backgroundColor:"#f8f8f8",overflow:"hidden"}}><img src={img.dataUrl} alt="" style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}} /></div>{img.caption&&<div style={{padding:"4px 6px",fontSize:"8px",color:"#333",backgroundColor:"#f1f5f9",borderTop:"1px solid #ddd",textAlign:"center"}}>{img.caption}</div>}</div>))}
                        </div>
                    </div>
                ));
            })()}

            {data.costainRecipient&&<div style={{fontSize:"11px",color:"#555",marginTop:20}}>Thank you and have a great evening.</div>}
        </div>
    );
}

// ─── Main Component ───
export default function DailyUpdateReport({onBack,logoSrc}){
    const t=useTheme();const mobile=useMobile();
    const [view,setView]=useState("form"); // form | client | costain
    const [data,setData]=useState(defaultReport);
    const [images,setImages]=useState([]);
    const [showWarnings,setShowWarnings]=useState(false);
    const [pendingView,setPendingView]=useState(null);
    const printRef=useRef();

    const upd=(k,v)=>setData(p=>({...p,[k]:v}));
    const updEng=(id,k,v)=>setData(p=>({...p,engineers:p.engineers.map(e=>e.id===id?{...e,[k]:v}:e)}));
    const addEng=()=>setData(p=>({...p,engineers:[...p.engineers,{id:Date.now(),name:"",position:"Engineer",company:"",date:"",team:""}]}));
    const removeEng=id=>setData(p=>({...p,engineers:p.engineers.filter(e=>e.id!==id)}));
    const updEquip=(id,k,v)=>setData(p=>({...p,equipment:p.equipment.map(e=>e.id===id?{...e,[k]:v}:e)}));
    const addEquip=()=>setData(p=>({...p,equipment:[...p.equipment,{id:Date.now(),type:"",checked:"Yes",company:"",team:""}]}));
    const removeEquip=id=>setData(p=>({...p,equipment:p.equipment.filter(e=>e.id!==id)}));
    const updActivity=(id,k,v)=>setData(p=>({...p,teamActivities:p.teamActivities.map(a=>a.id===id?{...a,[k]:v}:a)}));
    const addActivity=()=>setData(p=>({...p,teamActivities:[...p.teamActivities,{id:Date.now(),team:"",description:""}]}));
    const removeActivity=id=>setData(p=>({...p,teamActivities:p.teamActivities.filter(a=>a.id!==id)}));
    const updInfo=(id,v)=>setData(p=>({...p,otherInfo:p.otherInfo.map(x=>x.id===id?{...x,value:v}:x)}));
    const updInfoLabel=(id,label)=>setData(p=>({...p,otherInfo:p.otherInfo.map(x=>x.id===id?{...x,label}:x)}));
    const addInfo=()=>setData(p=>({...p,otherInfo:[...p.otherInfo,{id:Date.now(),label:"",value:""}]}));
    const removeInfo=id=>setData(p=>({...p,otherInfo:p.otherInfo.filter(x=>x.id!==id)}));
    const updIssue=(id,k,v)=>setData(p=>({...p,issues:p.issues.map(x=>x.id===id?{...x,[k]:v}:x)}));
    const addIssue=()=>setData(p=>({...p,issues:[...p.issues,{id:Date.now(),description:"",owner:"",actionedBy:""}]}));
    const removeIssue=id=>setData(p=>({...p,issues:p.issues.filter(x=>x.id!==id)}));

    const handleImageUpload=e=>{Array.from(e.target.files).forEach(file=>{const url=URL.createObjectURL(file);const img=new Image();img.onload=()=>{const MAX=1200;let w=img.width,h=img.height;if(w>MAX||h>MAX){if(w>h){h=Math.round(h*MAX/w);w=MAX}else{w=Math.round(w*MAX/h);h=MAX}}const canvas=document.createElement("canvas");canvas.width=w;canvas.height=h;canvas.getContext("2d").drawImage(img,0,0,w,h);const compressed=canvas.toDataURL("image/jpeg",0.7);URL.revokeObjectURL(url);setImages(prev=>[...prev,{id:Date.now()+Math.random(),dataUrl:compressed,caption:"",fileName:file.name,group:""}]);};img.onerror=()=>{URL.revokeObjectURL(url);const reader=new FileReader();reader.onload=ev=>setImages(prev=>[...prev,{id:Date.now()+Math.random(),dataUrl:ev.target.result,caption:"",fileName:file.name,group:""}]);reader.readAsDataURL(file);};img.src=url;});e.target.value="";};
    const removeImage=id=>setImages(p=>p.filter(x=>x.id!==id));
    const updateImageCaption=(id,v)=>setImages(p=>p.map(x=>x.id===id?{...x,caption:v}:x));
    const updateImageGroup=(id,v)=>setImages(p=>p.map(x=>x.id===id?{...x,group:v}:x));
    const moveImage=(idx,dir)=>setImages(p=>{const a=[...p];const n=idx+dir;if(n<0||n>=a.length)return a;[a[idx],a[n]]=[a[n],a[idx]];return a;});

    const getWarnings=()=>{
        const w=[];
        if(!data.projectName) w.push({type:"warn",msg:"Project Name is empty."});
        if(!data.author) w.push({type:"info",msg:"Author is empty."});
        if(!data.description) w.push({type:"info",msg:"Description is empty."});
        if((data.teamActivities||[]).filter(a=>a.description).length===0) w.push({type:"info",msg:"No activity descriptions entered."});
        if(data.engineers.filter(e=>e.name).length===0) w.push({type:"warn",msg:"No engineers listed."});
        (data.otherInfo||[]).filter(x=>x.label&&!x.value).forEach(x=>w.push({type:"info",msg:`"${x.label}" — not selected.`}));
        if(images.length===0) w.push({type:"info",msg:"No photos uploaded."});
        return w;
    };
    const tryPreview=(target)=>{setPendingView(target);setShowWarnings(true);};

    const handlePrint=()=>{const win=window.open("","_blank");win.document.write(`<!DOCTYPE html><html><head><title>Daily Update - ${data.date}</title><style>@media print{body{margin:0}@page{size:A4;margin:8mm}thead{display:table-header-group}}body{font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:0;background:#fff;color:#1a1a1a;-webkit-print-color-adjust:exact;print-color-adjust:exact}</style></head><body>${printRef.current.innerHTML}</body></html>`);win.document.close();setTimeout(()=>win.print(),400);};
    const handleSave=()=>{const blob=new Blob([JSON.stringify({...data,images},null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`DailyUpdate_${data.date}.json`;a.click();URL.revokeObjectURL(url);};
    const handleLoad=()=>{const input=document.createElement("input");input.type="file";input.accept=".json";input.onchange=e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{try{const d=JSON.parse(ev.target.result);if(d.images){setImages(d.images);delete d.images;}setData(d);}catch{alert("Invalid JSON");}};reader.readAsText(file);};input.click();};

    const inp={width:"100%",padding:"8px 12px",borderRadius:8,border:`1.5px solid ${t.border}`,fontSize:13,outline:"none",boxSizing:"border-box",backgroundColor:t.bgInput,color:t.text,fontFamily:"inherit"};
    const lbl={fontSize:11,fontWeight:600,color:t.textMuted,marginBottom:4,display:"block",textTransform:"uppercase",letterSpacing:"0.5px"};

    // ─── Preview ───
    if(view==="client"||view==="costain") return (
        <div style={{minHeight:"100vh",backgroundColor:t.bg}}>
            <div style={{position:"sticky",top:0,zIndex:10,backgroundColor:"#1e293b",padding:"10px 20px",display:"flex",alignItems:"center",gap:12,boxShadow:"0 2px 8px rgba(0,0,0,0.2)",flexWrap:"wrap"}}>
                <button onClick={()=>setView("form")} style={{padding:"8px 16px",borderRadius:8,border:"1px solid #475569",backgroundColor:"transparent",color:"#e2e8f0",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit"}}>← Back</button>
                <button onClick={handlePrint} style={{padding:"8px 20px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#059669,#10b981)",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit"}}>Print / Save PDF</button>
                <span style={{padding:"4px 12px",borderRadius:6,fontSize:12,fontWeight:700,backgroundColor:view==="client"?"#2563eb":"#7c3aed",color:"#fff"}}>{view==="client"?"Client Report":"Costain Report"}</span>
                <button onClick={()=>setView(view==="client"?"costain":"client")} style={{padding:"6px 14px",borderRadius:8,border:"1px solid #475569",backgroundColor:"transparent",color:"#94a3b8",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>Switch to {view==="client"?"Costain":"Client"}</button>
            </div>
            <div ref={printRef} style={{margin:"20px auto",maxWidth:900,backgroundColor:"#fff",boxShadow:"0 4px 24px rgba(0,0,0,0.12)",borderRadius:4,overflow:"hidden"}}>
                {view==="client"?<ClientReport data={data} logoSrc={logoSrc} images={images} />:<CostainReport data={data} logoSrc={logoSrc} images={images} />}
            </div>
        </div>
    );

    // ─── Form ───
    return (
        <div style={{minHeight:"100vh",backgroundColor:t.bg,fontFamily:"'Inter','Segoe UI',-apple-system,sans-serif",color:t.text}}>
            <div style={{background:t.topBar,padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10,boxShadow:"0 4px 16px rgba(0,0,0,0.15)",flexWrap:"wrap",gap:10}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                    {onBack&&<button onClick={onBack} style={{padding:"6px 12px",borderRadius:8,border:"1px solid #475569",backgroundColor:"transparent",color:"#cbd5e1",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>← Menu</button>}
                    <div><div style={{fontSize:15,fontWeight:800,color:t.topBarText}}>Daily Update Report</div><div style={{fontSize:10,color:"#64748b",marginTop:2}}>Client + Costain — AtkinsRéalis</div></div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <button onClick={handleLoad} style={{padding:"7px 14px",borderRadius:8,border:"1px solid #475569",backgroundColor:"transparent",color:"#cbd5e1",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>Load</button>
                    <button onClick={handleSave} style={{padding:"7px 14px",borderRadius:8,border:"1px solid #475569",backgroundColor:"transparent",color:"#cbd5e1",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>Save</button>
                    <button onClick={()=>tryPreview("client")} style={{padding:"7px 14px",borderRadius:8,border:"none",backgroundColor:"#2563eb",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit"}}>Client</button>
                    <button onClick={()=>tryPreview("costain")} style={{padding:"7px 14px",borderRadius:8,border:"none",backgroundColor:"#7c3aed",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit"}}>Costain</button>
                </div>
            </div>

            <div style={{maxWidth:860,margin:"0 auto",padding:"20px 16px"}}>
                {/* Project Details */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`}}>
                    <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Project Details</div>
                    <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:12}}>
                        <div><label style={lbl}>Project Name</label><HeaderSelect value={data.projectName} onChange={v=>upd("projectName",v)} options={["T2 Baggage Programme Trance 3 Backbone Phase 2","T2A Security Phase 6 Works","T4 Security Project"]} placeholder="Project name" t={t} /></div>
                        <div><label style={lbl}>Author</label><HeaderSelect value={data.author} onChange={v=>upd("author",v)} options={AUTHOR_LIST} placeholder="Author" t={t} /></div>
                        <div><label style={lbl}>Description</label><HeaderSelect value={data.description} onChange={v=>upd("description",v)} options={[]} placeholder="e.g. Fibre migrations – T4, T5" t={t} multiline /></div>
                        <div><label style={lbl}>Date</label><input type="date" value={data.date} onChange={e=>upd("date",e.target.value)} style={inp} /></div>
                        <div style={{gridColumn:mobile?"1":"1 / -1"}}><label style={lbl}>Site</label><HeaderSelect value={data.site} onChange={v=>upd("site",v)} options={["T2 Network Backbone","T2A CSA","T4 Airside","T5 Main Terminal"]} placeholder="Site" t={t} /></div>
                    </div>
                </div>

                {/* Engineers */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                        <div style={{fontSize:14,fontWeight:700}}>Engineers on Site</div>
                        <button onClick={addEng} style={{padding:"7px 16px",borderRadius:8,border:"none",backgroundColor:t.accent,color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>+ Add</button>
                    </div>
                    {data.engineers.map((eng,idx)=>(
                        <div key={eng.id} style={{display:"flex",gap:6,marginBottom:6,alignItems:"flex-end",flexWrap:mobile?"wrap":"nowrap"}}>
                            <div style={{width:100,flexShrink:0}}>{idx===0&&<label style={{...lbl,fontSize:9}}>Team</label>}<select value={eng.team} onChange={e=>updEng(eng.id,"team",e.target.value)} style={{...inp,appearance:"auto",fontSize:11}}><option value="">—</option>{TEAM_LIST.map(tm=><option key={tm} value={tm}>{tm}</option>)}</select></div>
                            <div style={{flex:2,minWidth:0}}>{idx===0&&<label style={{...lbl,fontSize:9}}>Name</label>}<input value={eng.name} onChange={e=>updEng(eng.id,"name",e.target.value)} style={inp} placeholder="Full name" /></div>
                            <div style={{width:100,flexShrink:0}}>{idx===0&&<label style={{...lbl,fontSize:9}}>Position</label>}<select value={eng.position} onChange={e=>updEng(eng.id,"position",e.target.value)} style={{...inp,appearance:"auto"}}>{POSITION_LIST.map(p=><option key={p}>{p}</option>)}</select></div>
                            <div style={{flex:1,minWidth:0}}>{idx===0&&<label style={{...lbl,fontSize:9}}>Company</label>}<HeaderSelect value={eng.company} onChange={v=>updEng(eng.id,"company",v)} options={COMPANY_LIST} placeholder="Company" t={t} /></div>
                            <button onClick={()=>removeEng(eng.id)} style={{padding:"8px",border:"none",backgroundColor:"transparent",color:t.accentRed,cursor:"pointer",fontSize:14,flexShrink:0}}>✕</button>
                        </div>
                    ))}
                </div>

                {/* Plant/Equipment */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                        <div style={{fontSize:14,fontWeight:700}}>Plant / Equipment</div>
                        <button onClick={addEquip} style={{padding:"7px 16px",borderRadius:8,border:"none",backgroundColor:t.accent,color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>+ Add</button>
                    </div>
                    {data.equipment.map((eq,idx)=>(
                        <div key={eq.id} style={{display:"flex",gap:8,marginBottom:6,alignItems:"flex-end"}}>
                            <div style={{flex:2,minWidth:0}}>{idx===0&&<label style={{...lbl,fontSize:9}}>Type</label>}<input value={eq.type} onChange={e=>updEquip(eq.id,"type",e.target.value)} style={inp} placeholder="e.g. Barriers, Hand Tools" /></div>
                            <div style={{width:90,flexShrink:0}}>{idx===0&&<label style={{...lbl,fontSize:9}}>Checked</label>}<YNToggle value={eq.checked} onChange={v=>updEquip(eq.id,"checked",v)} t={t} /></div>
                            <div style={{flex:1,minWidth:0}}>{idx===0&&<label style={{...lbl,fontSize:9}}>Company</label>}<HeaderSelect value={eq.company} onChange={v=>updEquip(eq.id,"company",v)} options={COMPANY_LIST} placeholder="Company" t={t} /></div>
                            <div style={{width:100,flexShrink:0}}>{idx===0&&<label style={{...lbl,fontSize:9}}>Team</label>}<select value={eq.team||""} onChange={e=>updEquip(eq.id,"team",e.target.value)} style={{...inp,appearance:"auto",fontSize:11}}><option value="">All</option>{TEAM_LIST.map(tm=><option key={tm}>{tm}</option>)}</select></div>
                            <button onClick={()=>removeEquip(eq.id)} style={{padding:"8px",border:"none",backgroundColor:"transparent",color:t.accentRed,cursor:"pointer",fontSize:14,flexShrink:0}}>✕</button>
                        </div>
                    ))}
                </div>

                {/* Activity Description per Team */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                        <div style={{fontSize:14,fontWeight:700}}>Activity Description</div>
                        <button onClick={addActivity} style={{padding:"7px 16px",borderRadius:8,border:"none",backgroundColor:t.accent,color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>+ Add Team Activity</button>
                    </div>
                    {(data.teamActivities||[]).map((act,idx)=>(
                        <div key={act.id} style={{padding:14,borderRadius:10,border:`1px solid ${t.border}`,marginBottom:10,backgroundColor:t.bgCardAlt}}>
                            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                                <div style={{display:"flex",alignItems:"center",gap:8}}>
                                    <select value={act.team} onChange={e=>updActivity(act.id,"team",e.target.value)} style={{...inp,width:"auto",minWidth:120,appearance:"auto",fontWeight:700}}>
                                        <option value="">— Team —</option>
                                        {TEAM_LIST.map(tm=><option key={tm} value={tm}>{tm}</option>)}
                                    </select>
                                </div>
                                <button onClick={()=>removeActivity(act.id)} style={{fontSize:11,color:t.accentRed,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>✕ Remove</button>
                            </div>
                            <textarea value={act.description} onChange={e=>updActivity(act.id,"description",e.target.value)} rows={5} style={{...inp,resize:"vertical",minHeight:80}} placeholder={"• 21.30 Attended NABs Briefing\n• 22.00 Commenced cable pulling\n• 02.00 Permits deactivated"} />
                        </div>
                    ))}
                    {(data.teamActivities||[]).length===0&&<div style={{textAlign:"center",padding:16,color:t.textDim,fontSize:13}}>No activity entries. Add one per team.</div>}
                </div>

                {/* Other Info */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                        <div style={{fontSize:14,fontWeight:700}}>Other Info</div>
                        <button onClick={addInfo} style={{padding:"7px 16px",borderRadius:8,border:"none",backgroundColor:t.accent,color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>+ Add</button>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:8}}>
                        {(data.otherInfo||[]).map(item=>(
                            <div key={item.id} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 10px",borderRadius:8,border:`1px solid ${t.borderLight}`,backgroundColor:t.bgCardAlt}}>
                                <input type="text" value={item.label} onChange={e=>updInfoLabel(item.id,e.target.value)} style={{flex:1,minWidth:0,padding:"4px 8px",borderRadius:6,border:`1px solid ${t.border}`,fontSize:12,fontWeight:600,outline:"none",boxSizing:"border-box",backgroundColor:t.bgInput,color:t.text,fontFamily:"inherit"}} placeholder="Label..." />
                                <select value={item.team||""} onChange={e=>setData(p=>({...p,otherInfo:p.otherInfo.map(x=>x.id===item.id?{...x,team:e.target.value}:x)}))} style={{width:100,padding:"4px 6px",borderRadius:6,border:`1px solid ${t.border}`,fontSize:10,backgroundColor:t.bgInput,color:t.textMuted,fontFamily:"inherit",appearance:"auto",flexShrink:0}}>
                                    <option value="">All</option>
                                    {TEAM_LIST.map(tm=><option key={tm} value={tm}>{tm}</option>)}
                                </select>
                                <YNToggle value={item.value} onChange={v=>updInfo(item.id,v)} t={t} />
                                <button onClick={()=>removeInfo(item.id)} style={{padding:"2px 6px",border:"none",backgroundColor:"transparent",color:t.accentRed,cursor:"pointer",fontSize:14,flexShrink:0}}>✕</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Issues */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                        <div style={{fontSize:14,fontWeight:700}}>Issues / Requests / Delays</div>
                        <button onClick={addIssue} style={{padding:"7px 16px",borderRadius:8,border:"none",backgroundColor:t.accent,color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>+ Add</button>
                    </div>
                    {data.issues.length===0&&<div style={{textAlign:"center",padding:16,color:t.textDim,fontSize:13}}>No issues recorded.</div>}
                    {data.issues.map((iss,idx)=>(
                        <div key={iss.id} style={{padding:12,borderRadius:10,border:`1px solid ${t.border}`,marginBottom:8,backgroundColor:t.bgCardAlt}}>
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:12,fontWeight:700,color:t.textMuted}}>Issue #{idx+1}</span><button onClick={()=>removeIssue(iss.id)} style={{fontSize:11,color:t.accentRed,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>✕</button></div>
                            <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"2fr 1fr 1fr",gap:8}}>
                                <div><label style={{...lbl,fontSize:9}}>Description</label><textarea value={iss.description} onChange={e=>updIssue(iss.id,"description",e.target.value)} rows={2} style={{...inp,resize:"vertical"}} /></div>
                                <div><label style={{...lbl,fontSize:9}}>Owner</label><input value={iss.owner} onChange={e=>updIssue(iss.id,"owner",e.target.value)} style={inp} /></div>
                                <div><label style={{...lbl,fontSize:9}}>Actioned by</label><input value={iss.actionedBy} onChange={e=>updIssue(iss.id,"actionedBy",e.target.value)} style={inp} /></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Costain extras */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`}}>
                    <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Costain Report Extras</div>
                    <div style={{fontSize:11,color:t.textDim,marginBottom:10}}>Recipient name for the Costain version greeting.</div>
                    <div><label style={lbl}>Recipient Name</label><input value={data.costainRecipient} onChange={e=>upd("costainRecipient",e.target.value)} style={inp} placeholder="e.g. Andrei" /></div>
                </div>

                {/* Photos */}
                <div style={{backgroundColor:t.bgCard,borderRadius:12,padding:20,marginBottom:14,border:`1px solid ${t.border}`}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                        <div style={{fontSize:14,fontWeight:700}}>Photos</div>
                        <label style={{padding:"7px 16px",borderRadius:8,border:"none",backgroundColor:t.accent,color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600,display:"inline-flex",alignItems:"center",gap:4,fontFamily:"inherit"}}>+ Upload<input type="file" accept="image/*,.heic,.heif" multiple onChange={handleImageUpload} style={{display:"none"}} /></label>
                    </div>
                    {images.length===0&&<div style={{textAlign:"center",padding:16,color:t.textDim,fontSize:13}}>No photos.</div>}
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
                                    {img.group&&<div style={{position:"absolute",bottom:3,left:3,fontSize:8,backgroundColor:"rgba(0,0,0,0.6)",color:"#fff",padding:"1px 5px",borderRadius:3}}>{img.group}</div>}
                                </div>
                                <input value={img.caption} onChange={e=>updateImageCaption(img.id,e.target.value)} placeholder="Caption..." style={{width:"100%",padding:"5px 8px",border:"none",borderTop:`1px solid ${t.border}`,fontSize:10,outline:"none",boxSizing:"border-box",fontFamily:"inherit",backgroundColor:t.bgCardAlt,color:t.text}} />
                                <select value={img.group||""} onChange={e=>updateImageGroup(img.id,e.target.value)} style={{width:"100%",padding:"4px 8px",border:"none",borderTop:`1px solid ${t.border}`,fontSize:9,outline:"none",boxSizing:"border-box",fontFamily:"inherit",backgroundColor:t.bgCardAlt,color:t.textMuted,appearance:"auto"}}>
                                    <option value="">General</option>
                                    {TEAM_LIST.map(tm=><option key={tm} value={tm}>{tm}</option>)}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Validation Modal */}
                {showWarnings&&(()=>{
                    const w=getWarnings();const warns=w.filter(x=>x.type==="warn");const infos=w.filter(x=>x.type==="info");const has=w.length>0;
                    return (
                        <div style={{position:"fixed",inset:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
                            <div onClick={()=>setShowWarnings(false)} style={{position:"absolute",inset:0,backgroundColor:"rgba(0,0,0,0.6)"}} />
                            <div style={{position:"relative",maxWidth:520,width:"100%",maxHeight:"80vh",overflow:"auto",backgroundColor:t.bgCard,borderRadius:16,border:`2px solid ${has?(warns.length>0?"#dc2626":"#fbbf24"):"#10b981"}`,boxShadow:"0 20px 60px rgba(0,0,0,0.3)",padding:24}}>
                                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                                    <span style={{fontSize:20}}>{has?(warns.length>0?"⚠️":"ℹ️"):"✅"}</span>
                                    <div><div style={{fontSize:15,fontWeight:700,color:t.text}}>{has?"Review before generating":"No issues found"}</div><div style={{fontSize:12,color:t.textMuted}}>{has?`${w.length} notice${w.length!==1?"s":""}`:"Ready to generate."}</div></div>
                                </div>
                                {has&&<div style={{marginBottom:20}}>{warns.map((x,i)=><div key={`w${i}`} style={{padding:"8px 12px",margin:"4px 0",fontSize:12,color:"#fff",backgroundColor:"#dc2626",borderRadius:6,fontWeight:600}}>⚠ {x.msg}</div>)}{infos.map((x,i)=><div key={`i${i}`} style={{padding:"8px 12px",margin:"4px 0",fontSize:12,color:"#1e293b",backgroundColor:"#fbbf24",borderRadius:6}}>• {x.msg}</div>)}</div>}
                                <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                                    <button onClick={()=>setShowWarnings(false)} style={{padding:"10px 20px",borderRadius:8,border:`1px solid ${t.border}`,backgroundColor:t.bgInput,color:t.text,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"inherit"}}>Go Back</button>
                                    <button onClick={()=>{setShowWarnings(false);setView(pendingView);}} style={{padding:"10px 20px",borderRadius:8,border:"none",backgroundColor:has?(warns.length>0?"#dc2626":"#f59e0b"):"#10b981",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit"}}>{has?"Continue Anyway":"Continue"}</button>
                                </div>
                            </div>
                        </div>
                    );
                })()}

                {/* Bottom */}
                <div style={{display:"flex",gap:10,justifyContent:"center",padding:"14px 0 36px",flexWrap:"wrap"}}>
                    <button onClick={handleSave} style={{padding:"12px 24px",borderRadius:10,border:`2px solid ${t.border}`,backgroundColor:t.bgCard,color:t.text,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit"}}>Save Draft</button>
                    <button onClick={()=>tryPreview("client")} style={{padding:"12px 24px",borderRadius:10,border:"none",backgroundColor:"#2563eb",color:"#fff",cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit",boxShadow:"0 4px 16px rgba(0,0,0,0.2)"}}>Client Report</button>
                    <button onClick={()=>tryPreview("costain")} style={{padding:"12px 24px",borderRadius:10,border:"none",backgroundColor:"#7c3aed",color:"#fff",cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit",boxShadow:"0 4px 16px rgba(0,0,0,0.2)"}}>Costain Report</button>
                </div>
            </div>
        </div>
    );
}
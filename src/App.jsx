import { useState, useRef } from "react";

const SECTIONS = [
  {
    id: "0",
    title: "Previous Actions",
    items: [
      { id: "0.01", label: "Are previous actions reported appropriately addressed?" }
    ]
  },
  {
    id: "1",
    title: "Site Documentation",
    items: [
      { id: "1.01", label: "Company identification & competence certification in order?" },
      { id: "1.02", label: "Is method statement available & suitable?" },
      { id: "1.03", label: "Do risk assessments cover activities, and are controls implemented suitable and sufficient?" },
      { id: "1.04", label: "Are records of method statement briefing available?" },
      { id: "1.05", label: "Permits (hot work, confined space, HV working)?" }
    ]
  },
  {
    id: "2",
    title: "Construction Safety",
    items: [
      { id: "2.01", label: "Is scaffold, access equipment, ladders podiums being used?" },
      { id: "2.02", label: "Are people protected from falling materials?" },
      { id: "2.03", label: "Are lifting operations being undertaken and is suitable equipment being used?" },
      { id: "2.04", label: "Have services been identified and protected?" },
      { id: "2.05", label: "Is manual and/or mechanised handling taking place?" },
      { id: "2.06", label: "COSHH information and materials (including containers secure, hoses/triggers locked and stored within a bund)?" },
      { id: "2.07", label: "Is electrical plant in good condition (Earthing/RCD)?" },
      { id: "2.08", label: "Have portable electrical appliances been tested?" },
      { id: "2.09", label: "Are small tools suitable and in good condition?" },
      { id: "2.10", label: "Is there use of equipment associated with vibration risk?" },
      { id: "2.11", label: "Is the infrastructure protected? Is security at access gates and boundary fencing adequate?" },
      { id: "2.12", label: "Are safety signs and notices displayed?" },
      { id: "2.13", label: "Are Life Saving System Isolations in place (if applicable)?" }
    ]
  },
  {
    id: "3",
    title: "General Site Issues",
    items: [
      { id: "3.01", label: "Are toilets & welfare suitable and sufficient?" },
      { id: "3.02", label: "Are emergency arrangements defined and briefed?" },
      { id: "3.03", label: "Is first aid suitable & sufficient?" },
      { id: "3.04", label: "Is suitable & sufficient PPE being worn:" }
    ],
    subItems: [
      { id: "3.04a", label: "Hard Hat?" },
      { id: "3.04b", label: "HV Vest/Jacket?" },
      { id: "3.04c", label: "Safety Glasses?" },
      { id: "3.04d", label: "Correct Gloves for task?" },
      { id: "3.04e", label: "Safety footwear? (mandatory in all areas)" },
      { id: "3.04f", label: "Is any task specific PPE being used?" }
    ]
  },
  {
    id: "4",
    title: "Evacuation",
    items: [
      { id: "4.01", label: "Are staff aware of evacuation procedure and assembly point in case of emergency?" },
      { id: "4.02", label: "Are staff aware of how to raise the alarm? Emergency contact details?" },
      { id: "4.03", label: "Are fire points available in the vicinity of the worksite?" },
      { id: "4.04", label: "Is firefighting equipment inspected and in date?" },
      { id: "4.04b", label: "Are escape routes free from obstructions?" },
      { id: "4.05", label: "Are there clear signs posted on escape routes leading to the final exit?" }
    ]
  },
  {
    id: "5",
    title: "Environment",
    items: [
      { id: "5.01", label: "Is the site free of dust?" },
      { id: "5.02", label: "Is lighting adequate? Is it turned off when not required?" },
      { id: "5.03", label: "Is the site tidy and are storage areas maintained?" }
    ]
  },
  {
    id: "6",
    title: "Quality",
    items: [
      { id: "6.01", label: "Is equipment being installed to the agreed and accepted standards?" },
      { id: "6.02", label: "Are checklist documents available and correctly filled out?" }
    ]
  },
  {
    id: "7",
    title: "Representative Recommendation",
    items: [
      { id: "7.01", label: "Does the representative have any recommendations that would make the planned activities safer?" }
    ]
  }
];

const defaultHeader = {
  project: "",
  activity: "",
  location: "",
  client: "",
  representative: "",
  inspectionBy: "",
  contractor: "",
  inspectionNo: "",
  date: new Date().toISOString().split("T")[0],
  time: ""
};

const defaultAction = () => ({
  id: Date.now(),
  itemNo: "",
  description: "",
  category: "",
  proposedAction: "",
  actionOwner: "",
  closureDate: ""
});

const defaultSignoff = {
  issuedByName: "",
  issuedByDate: "",
  acceptedByName: "",
  acceptedByDate: "",
  additionalNotes: ""
};

function initItems() {
  const items = {};
  SECTIONS.forEach(s => {
    s.items.forEach(i => { items[i.id] = { status: "", comment: "" }; });
    if (s.subItems) s.subItems.forEach(i => { items[i.id] = { status: "", comment: "" }; });
  });
  return items;
}

function PrintDocument({ header, items, actions, signoff, distributions }) {
  const c = { border: "1px solid #333", padding: "4px 6px", fontSize: "9px", verticalAlign: "top", color: "#1a1a1a" };
  const h = { ...c, backgroundColor: "#1a3a5c", color: "#fff", fontWeight: 700 };

  return (
      <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", color: "#1a1a1a", maxWidth: "210mm", margin: "0 auto", padding: "10mm", fontSize: "9px", lineHeight: 1.4 }}>
        <div style={{ borderBottom: "3px solid #1a3a5c", paddingBottom: 8, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#1a3a5c" }}>FORM: FO-057 Planned General Inspection</div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "#555" }}>Heathrow Minor Works/Project Teams</div>
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}>
          <tbody>
          {[["Project:", header.project, "Activity:", header.activity],
            ["Location:", header.location, "Client:", header.client],
            ["Representative (Auditee):", header.representative, "Inspection By:", header.inspectionBy],
            ["Contractor:", header.contractor, "Inspection No:", header.inspectionNo],
            ["Date:", header.date, "Time:", header.time]
          ].map((row, i) => (
              <tr key={i}>
                <td style={{ ...h, width: "14%" }}>{row[0]}</td>
                <td style={{ ...c, width: "36%" }}>{row[1]}</td>
                <td style={{ ...h, width: "14%" }}>{row[2]}</td>
                <td style={{ ...c, width: "36%" }}>{row[3]}</td>
              </tr>
          ))}
          </tbody>
        </table>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}>
          <thead>
          <tr>
            <th style={{ ...h, width: "7%" }}>Item No.</th>
            <th style={{ ...h, width: "38%" }}>Requirement</th>
            <th style={{ ...h, width: "10%", textAlign: "center" }}>Safe (Y) / Unsafe (N) / N/A</th>
            <th style={{ ...h, width: "45%" }}>Comments</th>
          </tr>
          </thead>
          <tbody>
          {SECTIONS.map(section => (
              <>
                <tr key={`sh-${section.id}`}>
                  <td colSpan={4} style={{ ...c, backgroundColor: "#e8eef4", fontWeight: 700, fontSize: "10px", color: "#1a3a5c" }}>{section.id}.0 {section.title}</td>
                </tr>
                {section.items.map(item => (
                    <tr key={item.id}>
                      <td style={{ ...c, textAlign: "center", fontWeight: 600 }}>{item.id}</td>
                      <td style={c}>{item.label}</td>
                      <td style={{ ...c, textAlign: "center", fontWeight: 700, color: items[item.id]?.status === "N" ? "#c0392b" : items[item.id]?.status === "Y" ? "#27ae60" : "#7f8c8d" }}>{items[item.id]?.status || "—"}</td>
                      <td style={c}>{items[item.id]?.comment || ""}</td>
                    </tr>
                ))}
                {section.subItems?.map(item => (
                    <tr key={item.id}>
                      <td style={{ ...c, textAlign: "center" }}></td>
                      <td style={{ ...c, paddingLeft: 20, fontStyle: "italic" }}>{item.label}</td>
                      <td style={{ ...c, textAlign: "center", fontWeight: 700, color: items[item.id]?.status === "N" ? "#c0392b" : items[item.id]?.status === "Y" ? "#27ae60" : "#7f8c8d" }}>{items[item.id]?.status || "—"}</td>
                      <td style={c}>{items[item.id]?.comment || ""}</td>
                    </tr>
                ))}
              </>
          ))}
          <tr><td colSpan={4} style={{ ...c, backgroundColor: "#e8eef4", fontWeight: 700, fontSize: "10px", color: "#1a3a5c" }}>8.0 Additional Site-Specific Questions</td></tr>
          <tr><td colSpan={4} style={{ ...c, minHeight: 40, height: 40 }}>{signoff.additionalNotes}</td></tr>
          </tbody>
        </table>
        <div style={{ fontSize: "8px", color: "#555", marginBottom: 6 }}>
          <strong>Action Categories:</strong> <span style={{ color: "#c0392b" }}>H = High</span> (Immediate risk – Stop work) | <span style={{ color: "#e67e22" }}>M = Medium</span> (Rectify 24hrs–7 days) | <span style={{ color: "#2980b9" }}>L = Low</span> (Minor / process improvement)
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}>
          <thead>
          <tr>
            <th style={{ ...h, width: "7%" }}>Item No.</th>
            <th style={{ ...h, width: "25%" }}>Good Practice / Areas for Improvement</th>
            <th style={{ ...h, width: "8%", textAlign: "center" }}>H/M/L</th>
            <th style={{ ...h, width: "25%" }}>Proposed Action</th>
            <th style={{ ...h, width: "15%" }}>Action Owner</th>
            <th style={{ ...h, width: "12%" }}>Closure Date</th>
          </tr>
          </thead>
          <tbody>
          {actions.length === 0 ? (
              <tr><td colSpan={6} style={{ ...c, textAlign: "center", color: "#888", fontStyle: "italic" }}>No actions recorded</td></tr>
          ) : actions.map((a, i) => (
              <tr key={i}>
                <td style={{ ...c, textAlign: "center" }}>{a.itemNo}</td>
                <td style={c}>{a.description}</td>
                <td style={{ ...c, textAlign: "center", fontWeight: 700, color: a.category === "H" ? "#c0392b" : a.category === "M" ? "#e67e22" : "#2980b9" }}>{a.category}</td>
                <td style={c}>{a.proposedAction}</td>
                <td style={c}>{a.actionOwner}</td>
                <td style={c}>{a.closureDate}</td>
              </tr>
          ))}
          </tbody>
        </table>
        <table style={{ width: "60%", borderCollapse: "collapse", marginBottom: 12 }}>
          <tbody>
          <tr><td style={{ ...c, width: "30%" }}></td><td style={{ ...h, width: "35%" }}>Name</td><td style={{ ...h, width: "35%" }}>Date</td></tr>
          <tr><td style={{ ...c, fontWeight: 700 }}>Report Issued by:</td><td style={c}>{signoff.issuedByName}</td><td style={c}>{signoff.issuedByDate}</td></tr>
          <tr><td style={{ ...c, fontWeight: 700 }}>Report Accepted by:</td><td style={c}>{signoff.acceptedByName}</td><td style={c}>{signoff.acceptedByDate}</td></tr>
          </tbody>
        </table>
        <div style={{ fontSize: "8px", color: "#555", borderTop: "1px solid #ccc", paddingTop: 6 }}>
          <strong>Distribution:</strong> {distributions || "Person accepting inspection on site • Project Manager/PIM • Minor Works Project HSE Manager • Senior HSE Manager for Transportation"}
        </div>
      </div>
  );
}

function StatusToggle({ value, onChange }) {
  return (
      <div style={{ display: "flex", gap: 4 }}>
        {["Y", "N", "N/A"].map(opt => (
            <button key={opt} onClick={() => onChange(value === opt ? "" : opt)}
                    style={{
                      padding: "4px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer", transition: "all 0.15s",
                      border: value === opt ? "2px solid transparent" : "1px solid #d1d5db",
                      fontWeight: value === opt ? 700 : 400,
                      backgroundColor: value === opt ? (opt === "Y" ? "#059669" : opt === "N" ? "#dc2626" : "#6b7280") : "#fff",
                      color: value === opt ? "#fff" : "#374151"
                    }}>{opt}</button>
        ))}
      </div>
  );
}

export default function PGIFormGenerator() {
  const [view, setView] = useState("form");
  const [header, setHeader] = useState(defaultHeader);
  const [items, setItems] = useState(initItems);
  const [actions, setActions] = useState([]);
  const [signoff, setSignoff] = useState(defaultSignoff);
  const [activeSection, setActiveSection] = useState(null);
  const [distributions, setDistributions] = useState("");
  const printRef = useRef();

  const updateHeader = (k, v) => setHeader(p => ({ ...p, [k]: v }));
  const updateItem = (id, k, v) => setItems(p => ({ ...p, [id]: { ...p[id], [k]: v } }));
  const updateSignoff = (k, v) => setSignoff(p => ({ ...p, [k]: v }));
  const addAction = () => setActions(p => [...p, defaultAction()]);
  const removeAction = (id) => setActions(p => p.filter(a => a.id !== id));
  const updateAction = (id, k, v) => setActions(p => p.map(a => a.id === id ? { ...a, [k]: v } : a));

  const handlePrint = () => {
    const content = printRef.current;
    const win = window.open("", "_blank");
    win.document.write(`<!DOCTYPE html><html><head><title>PGI FO-057 - ${header.project || "Report"}</title><style>@media print{body{margin:0}@page{size:A4;margin:8mm}}body{font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:0;color:#1a1a1a;}</style></head><body>${content.innerHTML}</body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 400);
  };

  const handleSaveJSON = () => {
    const data = { header, items, actions, signoff, distributions, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `PGI_${header.inspectionNo || "draft"}_${header.date || "nodate"}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadJSON = () => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = ".json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          if (data.header) setHeader(data.header);
          if (data.items) setItems(data.items);
          if (data.actions) setActions(data.actions);
          if (data.signoff) setSignoff(data.signoff);
          if (data.distributions) setDistributions(data.distributions);
        } catch { alert("Invalid JSON file"); }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const completionCount = Object.values(items).filter(i => i.status).length;
  const totalItems = Object.keys(items).length;
  const pct = Math.round((completionCount / totalItems) * 100);

  // MODIFICARE AICI: Am adăugat color: "#1e293b" pentru a forța textul închis la culoare
  const inp = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: 8,
    border: "1.5px solid #e2e8f0",
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#fff",
    color: "#1e293b"
  };

  const lbl = { fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 4, display: "block", textTransform: "uppercase", letterSpacing: "0.5px" };

  if (view === "preview") {
    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f1f5f9" }}>
          <div style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "#1e293b", padding: "10px 20px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
            <button onClick={() => setView("form")} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #475569", backgroundColor: "transparent", color: "#e2e8f0", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>← Back to Form</button>
            <button onClick={handlePrint} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #059669, #10b981)", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Print / Save as PDF</button>
            <span style={{ color: "#94a3b8", fontSize: 12 }}>Document Preview</span>
          </div>
          <div ref={printRef} style={{ margin: "20px auto", maxWidth: 900, backgroundColor: "#fff", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", borderRadius: 4, overflow: "hidden" }}>
            <PrintDocument header={header} items={items} actions={actions} signoff={signoff} distributions={distributions} />
          </div>
        </div>
    );
  }

  return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "'Inter','Segoe UI',-apple-system,sans-serif" }}>
        <div style={{ background: "linear-gradient(135deg,#0f172a,#1e293b)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9" }}>FO-057 PGI Generator</div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Planned General Inspection — Heathrow Minor Works</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ backgroundColor: "#334155", borderRadius: 20, padding: "4px 14px", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 80, height: 6, backgroundColor: "#475569", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", backgroundColor: pct === 100 ? "#10b981" : "#3b82f6", borderRadius: 3, transition: "width 0.3s" }} />
              </div>
              <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{pct}%</span>
            </div>
            <button onClick={handleLoadJSON} style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid #475569", backgroundColor: "transparent", color: "#cbd5e1", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Load</button>
            <button onClick={handleSaveJSON} style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid #475569", backgroundColor: "transparent", color: "#cbd5e1", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Save</button>
            <button onClick={() => setView("preview")} style={{ padding: "7px 18px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#2563eb,#3b82f6)", color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>Preview</button>
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px" }}>
          {/* Form sections follow with the same structure but updated 'inp' styling */}
          <div style={{ backgroundColor: "#fff", borderRadius: 12, padding: 24, marginBottom: 16, border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Inspection Details</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[["project","Project"],["activity","Activity"],["location","Location"],["client","Client"],["representative","Representative (Auditee)"],["inspectionBy","Inspection By"],["contractor","Contractor"],["inspectionNo","Inspection No."],["date","Date","date"],["time","Time","time"]].map(([key, label, type]) => (
                  <div key={key}>
                    <label style={lbl}>{label}</label>
                    <input type={type||"text"} value={header[key]} onChange={e => updateHeader(key, e.target.value)} style={inp} placeholder={label} />
                  </div>
              ))}
            </div>
          </div>

          {SECTIONS.map(section => {
            const isOpen = activeSection === section.id;
            const all = [...section.items, ...(section.subItems || [])];
            const filled = all.filter(i => items[i.id]?.status).length;
            const allDone = filled === all.length;
            return (
                <div key={section.id} style={{ backgroundColor: "#fff", borderRadius: 12, marginBottom: 10, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                  <button onClick={() => setActiveSection(isOpen ? null : section.id)}
                          style={{ width: "100%", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", border: "none", backgroundColor: isOpen ? "#f8fafc" : "#fff", cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: allDone ? "#d1fae5" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: allDone ? "#059669" : "#64748b" }}>{allDone ? "✓" : section.id}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{section.title}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>{filled}/{all.length}</span>
                      <span style={{ fontSize: 12, color: "#94a3b8", transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>▼</span>
                    </div>
                  </button>
                  {isOpen && (
                      <div style={{ padding: "0 20px 16px" }}>
                        {section.items.map(item => (
                            <div key={item.id} style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
                              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", minWidth: 36 }}>{item.id}</span>
                                <span style={{ fontSize: 13, color: "#1e293b", flex: 1 }}>{item.label}</span>
                                <StatusToggle value={items[item.id]?.status} onChange={v => updateItem(item.id, "status", v)} />
                              </div>
                              <div style={{ marginLeft: 48 }}>
                                <textarea value={items[item.id]?.comment||""} onChange={e => updateItem(item.id,"comment",e.target.value)} placeholder="Comments..." rows={2} style={{ ...inp, resize: "vertical", minHeight: 36 }} />
                              </div>
                            </div>
                        ))}
                        {section.subItems?.map(item => (
                            <div key={item.id} style={{ padding: "10px 0 10px 48px", borderBottom: "1px solid #f1f5f9" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                                <span style={{ fontSize: 13, color: "#475569", flex: 1, fontStyle: "italic" }}>{item.label}</span>
                                <StatusToggle value={items[item.id]?.status} onChange={v => updateItem(item.id, "status", v)} />
                              </div>
                              <textarea value={items[item.id]?.comment||""} onChange={e => updateItem(item.id,"comment",e.target.value)} placeholder="Comments..." rows={1} style={{ ...inp, resize: "vertical", minHeight: 32 }} />
                            </div>
                        ))}
                      </div>
                  )}
                </div>
            );
          })}

          <div style={{ backgroundColor: "#fff", borderRadius: 12, padding: 24, marginBottom: 16, marginTop: 16, border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Actions / Good Practice</div>
              <button onClick={addAction} style={{ padding: "7px 16px", borderRadius: 8, border: "none", backgroundColor: "#1e293b", color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>+ Add Action</button>
            </div>
            {actions.length === 0 && <div style={{ textAlign: "center", padding: 24, color: "#94a3b8", fontSize: 13 }}>No actions added yet. Click above to add one.</div>}
            {actions.map((action, idx) => (
                <div key={action.id} style={{ padding: 16, borderRadius: 10, border: "1px solid #e2e8f0", marginBottom: 10, backgroundColor: "#fafbfc" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>Action #{idx + 1}</span>
                    <button onClick={() => removeAction(action.id)} style={{ fontSize: 11, color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>✕ Remove</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 100px", gap: 10, marginBottom: 10 }}>
                    <div><label style={lbl}>Item No.</label><input value={action.itemNo} onChange={e => updateAction(action.id,"itemNo",e.target.value)} style={inp} placeholder="e.g. 2.01" /></div>
                    <div><label style={lbl}>Description</label><input value={action.description} onChange={e => updateAction(action.id,"description",e.target.value)} style={inp} placeholder="Good practice / Area for improvement" /></div>
                    <div><label style={lbl}>Category</label>
                      <select value={action.category} onChange={e => updateAction(action.id,"category",e.target.value)} style={{ ...inp, appearance: "auto" }}>
                        <option value="">—</option><option value="H">H - High</option><option value="M">M - Medium</option><option value="L">L - Low</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 140px", gap: 10 }}>
                    <div><label style={lbl}>Proposed Action</label><input value={action.proposedAction} onChange={e => updateAction(action.id,"proposedAction",e.target.value)} style={inp} /></div>
                    <div><label style={lbl}>Action Owner</label><input value={action.actionOwner} onChange={e => updateAction(action.id,"actionOwner",e.target.value)} style={inp} /></div>
                    <div><label style={lbl}>Closure Date</label><input type="date" value={action.closureDate} onChange={e => updateAction(action.id,"closureDate",e.target.value)} style={inp} /></div>
                  </div>
                </div>
            ))}
          </div>

          <div style={{ backgroundColor: "#fff", borderRadius: 12, padding: 24, marginBottom: 16, border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Sign-off & Distribution</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div><label style={lbl}>Report Issued By (Name)</label><input value={signoff.issuedByName} onChange={e => updateSignoff("issuedByName",e.target.value)} style={inp} /></div>
              <div><label style={lbl}>Issue Date</label><input type="date" value={signoff.issuedByDate} onChange={e => updateSignoff("issuedByDate",e.target.value)} style={inp} /></div>
              <div><label style={lbl}>Report Accepted By (Name)</label><input value={signoff.acceptedByName} onChange={e => updateSignoff("acceptedByName",e.target.value)} style={inp} /></div>
              <div><label style={lbl}>Acceptance Date</label><input type="date" value={signoff.acceptedByDate} onChange={e => updateSignoff("acceptedByDate",e.target.value)} style={inp} /></div>
            </div>
            <div style={{ marginTop: 14 }}><label style={lbl}>Additional Notes (Section 8.0)</label><textarea value={signoff.additionalNotes} onChange={e => updateSignoff("additionalNotes",e.target.value)} rows={3} style={{ ...inp, resize: "vertical" }} placeholder="Additional site-specific notes..." /></div>
            <div style={{ marginTop: 14 }}><label style={lbl}>Distribution List</label><textarea value={distributions} onChange={e => setDistributions(e.target.value)} rows={2} style={{ ...inp, resize: "vertical" }} placeholder="Names / emails for report distribution..." /></div>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", padding: "16px 0 40px" }}>
            <button onClick={handleSaveJSON} style={{ padding: "12px 28px", borderRadius: 10, border: "2px solid #1e293b", backgroundColor: "#fff", color: "#1e293b", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>Save Draft (JSON)</button>
            <button onClick={() => setView("preview")} style={{ padding: "12px 28px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#1e293b,#334155)", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700, boxShadow: "0 4px 16px rgba(30,41,59,0.25)" }}>Preview & Print</button>
          </div>
        </div>
      </div>
  );
}
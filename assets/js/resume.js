"use strict";

/* ===== Basic HTML escaping (defense-in-depth) ===== */
function escapeHTML(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const $ = (s) => document.querySelector(s);

/* ===== Inline data model (local-only) ===== */
const resume = {
  person: {
    name: "Mike Cao",
    title: "TBD",
    location: "USA",
    email: "mikecao@gmail.com",
    website: "",
    links: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/mike-c-8414b020/" },
      { label: "GitHub", url: "https://recseclabs.github.io" }
    ],
    summary: "20+ years across IT operations and cybersecurity. Red + Blue. Compliance-driven."
  },
  certs: [
    "CompTIA Security+ (IAT II)",
    "EC-Council CEH",
    "EC-Council CND"
  ],
  roles: [
    {
      id: "cyber-ops",
      title: "Cyber Operations Supervisor",
      org: "Bron Tapes, LLC",
      industries: ["Aerospace", "Industrial"],
      start: "2024",
      end: "Present",
      highlights: [
        "Own incident response and vendor coordination",
        "Mapped controls to NIST 800-171 and CMMC L2",
        "Drove awareness, training, and metrics"
      ],
      skills: ["CMMC", "NIST 800-171", "Incident Response", "KnowBe4", "Microsoft 365 Security", "Intune", "CrowdStrike", "Sophos"]
    },
    {
      id: "systems-admin",
      title: "Systems Administrator",
      org: "Multi-site hybrid Entra ID + on-prem AD",
      industries: ["Manufacturing", "Enterprise IT"],
      start: "2020",
      end: "2024",
      highlights: [
        "AD, DNS, GPO, imaging and AVD pilots",
        "Fortinet firewalls/switching with MSP",
        "SharePoint & Power Platform automation"
      ],
      skills: ["Windows Server", "Active Directory", "PowerShell", "Intune", "SharePoint", "Power Automate", "Fortinet"]
    },
    {
      id: "pentest",
      title: "Security Labs (Independent)",
      org: "TryHackMe • HackTheBox • Labs",
      industries: ["Cybersecurity", "Continuous Education"],
      start: "Ongoing",
      end: "",
      highlights: [
        "170+ labs completed (offensive + defensive)",
        "Produced several Microsoft Sway writeups documenting methodology and lessons learned",
        "Continuous practice across tooling, analysis, and reporting"
      ],
      skills: ["Linux", "Kali", "Metasploit", "Burp Suite", "Python", "OSINT", "Forensics", "Wireshark", "Social Engineering"]
    },
    {
      id: "navy-it",
      title: "Information Systems Technician",
      org: "U.S. Navy",
      industries: ["Defense", "Military"],
      start: "2004",
      end: "2009",
      highlights: [
        "Mission-critical systems and secure communications",
        "Enterprise operations under high tempo"
      ],
      skills: ["Networking", "Windows", "Linux", "Operational Discipline", "Radio Communications"]
    }
  ],
  skills: [
    { name: "CMMC", tags: ["Compliance"] },
    { name: "NIST 800-171", tags: ["Compliance"] },
    { name: "Incident Response", tags: ["Blue Team"] },
    { name: "KnowBe4", tags: ["Awareness"] },
    { name: "Microsoft 365 Security", tags: ["M365"] },
    { name: "Intune", tags: ["M365"] },
    { name: "CrowdStrike", tags: ["EDR"] },
    { name: "Sophos", tags: ["EDR"] },
    { name: "Windows Server", tags: ["Systems"] },
    { name: "Active Directory", tags: ["Systems"] },
    { name: "PowerShell", tags: ["Scripting"] },
    { name: "SharePoint", tags: ["M365"] },
    { name: "Power Automate", tags: ["M365"] },
    { name: "Fortinet", tags: ["Network"] },
    { name: "Linux", tags: ["OS"] },
    { name: "Kali", tags: ["OS"] },
    { name: "Metasploit", tags: ["OffSec"] },
    { name: "Burp Suite", tags: ["OffSec"] },
    { name: "Python", tags: ["Scripting"] },
    { name: "OSINT", tags: ["Intel"] },
    { name: "Forensics", tags: ["Blue Team"] },
    { name: "Wireshark", tags: ["Network"] },
    { name: "Networking", tags: ["Network"] },
    { name: "Windows", tags: ["OS"] },
    { name: "Operational Discipline", tags: ["Ops"] },
    { name: "Social Engineering", tags: ["OffSec"] }
  ]
};

/* ===== Index helpers ===== */
let mode = "skills";
let selected = new Set();

function buildIndex() {
  const roleById = Object.fromEntries(resume.roles.map((r) => [r.id, r]));
  const skillsToRoles = {};
  const rolesToSkills = {};

  resume.roles.forEach((r) => {
    r.skills.forEach((s) => {
      (skillsToRoles[s] = skillsToRoles[s] || new Set()).add(r.id);
    });
    rolesToSkills[r.id] = new Set(r.skills);
  });

  return { roleById, skillsToRoles, rolesToSkills };
}

const IDX = buildIndex();

/* ===== Profile render ===== */
function renderProfile() {
  const p = resume.person || {};
  const certs = resume.certs || [];
  const el = document.getElementById("profile");
  if (!el) return;

  const contact = [];
  if (p.email) {
    const em = escapeHTML(p.email);
    contact.push(`<span class="resume-badge"><a href="mailto:${em}">${em}</a></span>`);
  }
  if (p.website) {
    const url = escapeHTML(p.website);
    contact.push(`<span class="resume-badge"><a href="${url}" target="_blank" rel="noopener">${url}</a></span>`);
  }
  if (Array.isArray(p.links)) {
    p.links.forEach((l) => {
      const label = escapeHTML(l.label);
      const url = escapeHTML(l.url);
      contact.push(`<span class="resume-badge"><a href="${url}" target="_blank" rel="noopener">${label}</a></span>`);
    });
  }

  el.innerHTML = `
    <div class="resume-profile-head">
      <div class="resume-profile-name">${escapeHTML(p.name)}</div>
      <div class="resume-profile-meta">• ${escapeHTML(p.title)}</div>
      <div class="resume-profile-meta">• ${escapeHTML(p.location)}</div>
    </div>
    <div class="resume-contact">${contact.join(" ")}</div>
    ${p.summary ? `<div class="resume-muted" style="margin:6px 0 10px">${escapeHTML(p.summary)}</div>` : ""}
    ${certs.length ? `<div>${certs.map((c) => `<span class="resume-badge">${escapeHTML(c)}</span>`).join(" ")}</div>` : ""}
  `;
}

/* ===== Cards ===== */
function roleCard(r) {
  const el = document.createElement("button");
  el.type = "button";
  el.className = "resume-item";
  el.setAttribute("aria-label", `${r.title} at ${r.org}`);

  el.innerHTML = `
    <div class="resume-item-title">${escapeHTML(r.title)}</div>
    <div class="resume-item-sub">${escapeHTML(r.org)} • ${escapeHTML(r.start)}${r.end ? " - " + escapeHTML(r.end) : ""}</div>
    <div class="resume-muted" style="font-size:12px;margin-bottom:6px">${escapeHTML((r.industries || []).join(", "))}</div>
    <div class="resume-row" style="margin-top:6px">
      ${(r.skills || []).slice(0, 8).map((s) => `<span class="resume-pill">${escapeHTML(s)}</span>`).join(" ")}
    </div>
  `;
  el.onclick = () => showDetail(r);
  return el;
}

function showDetail(r) {
  const box = document.getElementById("detail");
  if (!box) return;

  box.style.display = "block";
  box.innerHTML = `
    <div style="font-weight:800;font-size:16px">${escapeHTML(r.title)}</div>
    <div class="resume-muted" style="margin-bottom:4px">${escapeHTML(r.org)} • ${escapeHTML(r.start)}${r.end ? " - " + escapeHTML(r.end) : ""}</div>
    <div class="resume-muted" style="font-size:12px;margin-bottom:6px">${escapeHTML((r.industries || []).join(", "))}</div>
    <div class="resume-row" id="detailChips" style="margin-bottom:8px">
      ${(r.skills || []).map((s) => `<span class="resume-chip" data-skill="${escapeHTML(s)}">${escapeHTML(s)} <small>+</small></span>`).join(" ")}
    </div>
    <ul style="margin:0 0 6px 18px">
      ${(r.highlights || []).map((h) => `<li>${escapeHTML(h)}</li>`).join("")}
    </ul>
  `;

  box.querySelectorAll("[data-skill]").forEach((ch) => {
    ch.onclick = () => {
      selected.add(ch.getAttribute("data-skill"));
      document.getElementById("mode").value = "skills";
      render();
    };
  });

  box.setAttribute("tabindex", "-1");
  box.focus();
}

/* ===== Main render ===== */
function render() {
  const modeSel = $("#mode");
  const qEl = $("#q");
  if (!modeSel || !qEl) return;

  mode = modeSel.value;
  const q = qEl.value.trim().toLowerCase();

  $("#leftTitle").textContent = mode === "skills" ? "Skills" : "Roles";
  $("#rightTitle").textContent = mode === "skills" ? "Matching roles" : "Matching skills";

  const chips = $("#chips");
  chips.innerHTML = "";
  if (selected.size) {
    selected.forEach((v) => {
      const el = document.createElement("span");
      el.className = "resume-chip";
      el.innerHTML = `${escapeHTML(v)} <small>×</small>`;
      el.onclick = () => {
        selected.delete(v);
        render();
      };
      chips.appendChild(el);
    });
  } else {
    const h = document.createElement("span");
    h.className = "resume-muted";
    h.textContent = "No filters active";
    chips.appendChild(h);
  }

  const L = $("#leftList");
  L.innerHTML = "";

  if (mode === "skills") {
    resume.skills
      .filter((s) => !q || s.name.toLowerCase().includes(q) || (s.tags || []).join(" ").toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((s) => {
        const el = document.createElement("button");
        el.type = "button";
        el.className = "resume-item";
        el.innerHTML = `
          <div class="resume-item-title">${escapeHTML(s.name)}</div>
          <div class="resume-item-sub">
            ${(s.tags || []).map((t) => `<span class="resume-pill">${escapeHTML(t)}</span>`).join(" ")}
          </div>`;
        el.onclick = () => {
          selected.add(s.name);
          render();
        };
        L.appendChild(el);
      });
  } else {
    resume.roles
      .filter((r) => !q || `${r.title} ${r.org}`.toLowerCase().includes(q))
      .forEach((r) => L.appendChild(roleCard(r)));
  }

  const R = $("#rightList");
  R.innerHTML = "";

  if (mode === "skills") {
    let roleIds = new Set(resume.roles.map((r) => r.id));
    selected.forEach((skill) => {
      const set = IDX.skillsToRoles[skill] || new Set();
      roleIds = new Set([...roleIds].filter((id) => set.has(id)));
    });

    [...roleIds]
      .map((id) => IDX.roleById[id])
      .filter(Boolean)
      .forEach((r) => R.appendChild(roleCard(r)));
  } else {
    let pool = null;
    if (selected.size === 0) {
      pool = new Set(resume.skills.map((s) => s.name));
    } else {
      selected.forEach((id) => {
        const s = IDX.rolesToSkills[id] || new Set();
        pool = pool ? new Set([...pool].filter((x) => s.has(x))) : new Set(s);
      });
    }

    [...pool].sort((a, b) => a.localeCompare(b)).forEach((name) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "resume-item";
      el.innerHTML = `<div class="resume-item-title">${escapeHTML(name)}</div>`;
      el.onclick = () => {
        selected.add(name);
        $("#mode").value = "skills";
        render();
      };
      R.appendChild(el);
    });
  }

  $("#stats").textContent = `${resume.person.name} • ${resume.person.title}`;
}

/* ===== Init + events ===== */
document.addEventListener("DOMContentLoaded", () => {
  const printBtn = document.getElementById("printBtn");
  if (printBtn) printBtn.addEventListener("click", () => window.print());

  ["q", "mode"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", render);
  });

  renderProfile();
  render();
});
/** zauber-script.js
 * Logik für den Zauberkarten-Generator (zauber.html):
 * lädt spells.json, verwaltet eigene Zauber (localStorage), filtert/sortiert
 * und rendert die druckbaren Zauberkarten.
*/

// --- 1. Globaler Zustand ---
let CORE_SPELLS = [];   // kommt aus spells.json (SRD-Zauber)
let CUSTOM_SPELLS = JSON.parse(localStorage.getItem("customSpells") || "[]");
let ALL_SPELLS = [];    // CUSTOM_SPELLS + CORE_SPELLS zusammen, das render() benutzt
let currentEditId = null;

const modal = document.getElementById("spellModal");
const pageContainer = document.getElementById('pages');

// --- 2. Initialisierung ---
async function init() {
  console.log("Starte Zauberkarten-Generator …");
  try {
    const response = await fetch('spells.json');
    if (response.ok) {
      CORE_SPELLS = await response.json();
      console.log("SRD-Zauber geladen:", CORE_SPELLS.length);
    } else {
      console.warn("spells.json nicht gefunden — es gibt also erstmal nur eigene Zauber.");
    }
  } catch (err) {
    console.error("Fehler beim Laden von spells.json:", err);
  }

  // Ältere eigene Zauber (vor der ID-Einführung) bekommen hier nachträglich eine ID
  let mussNeuGespeichertWerden = false;
  CUSTOM_SPELLS.forEach(s => {
    if (!s.id) {
      s.id = crypto.randomUUID();
      mussNeuGespeichertWerden = true;
    }
  });
  if (mussNeuGespeichertWerden) localStorage.setItem("customSpells", JSON.stringify(CUSTOM_SPELLS));

  refreshMasterList();
}

// --- 3. Gesamtliste aufbauen & Zauber-HTML erzeugen ---

function refreshMasterList() {
  // Eigene Zauber zuerst, damit sie auf den ersten Seiten auftauchen —
  // ist einfach praktisch, wenn man gerade an ihnen bastelt.
  ALL_SPELLS = [];

  CUSTOM_SPELLS.forEach(s => {
    const vollstaendig = { ...s };
    vollstaendig.custom = true;
    vollstaendig.source = vollstaendig.source || "Eigene";
    // HTML wird hier immer neu erzeugt, damit Bearbeiten-/Löschen-Knöpfe
    // garantiert mit drin sind (auch wenn s.html noch veraltet wäre).
    vollstaendig.html = createSpellHTML(vollstaendig);
    ALL_SPELLS.push(vollstaendig);
  });

  CORE_SPELLS.forEach(s => {
    const quelle = s.source || "SRD";
    // Core-Zauber bekommen (wie eigene) eine kleine Quellen-Marke oben rechts
    // auf der Karte, damit man z.B. "SRD 2014" und "SRD 2024" auseinanderhalten
    // kann, wenn derselbe Zauber in beiden Ausgaben auf der Seite liegt.
    const htmlMitQuelle = `<div class="card-topright"><div class="source-tag">${quelle}</div></div>` + s.html;
    ALL_SPELLS.push({ ...s, custom: false, source: quelle, html: htmlMitQuelle });
  });

  console.log("Gesamtliste aktualisiert, insgesamt", ALL_SPELLS.length, "Zauber");
  buildSourcePanel();
  render();
}

function buildSourcePanel() {
  const panel = document.getElementById('srcPanel');
  const actions = panel.querySelector('.panel-actions');
  const vorherAngehakt = new Set(Array.from(panel.querySelectorAll('.src-cb')).map(cb => cb.value));
  const warLeer = vorherAngehakt.size === 0;

  const quellen = Array.from(new Set(ALL_SPELLS.map(s => s.source || "SRD"))).sort();

  panel.querySelectorAll('.src-cb-label').forEach(el => el.remove());

  quellen.forEach(quelle => {
    const label = document.createElement('label');
    label.className = 'src-cb-label';
    // Beim allerersten Aufbau ist noch nichts angehakt -> alles anzeigen.
    // Danach merken wir uns, was der Nutzer selbst ausgewählt hatte.
    const angehakt = warLeer ? true : vorherAngehakt.has(quelle);
    label.innerHTML = `<input type="checkbox" class="src-cb" value="${quelle}" ${angehakt ? 'checked' : ''}> ${quelle}`;
    panel.insertBefore(label, actions);
  });

  panel.querySelectorAll('.src-cb').forEach(cb => cb.addEventListener('change', render));
}

function createSpellHTML(spell) {
  const ritual = spell.ritual ? '<span class="badge">Ritual</span>' : '';
  const material = spell.material ? `<div class="material"><b>Material:</b> ${spell.material}</div>` : '';
  const englischerName = spell.nameEn ? `<div class="spell-name-en">${spell.nameEn}</div>` : '';

  const absaetze = (spell.description || "")
    .split(/\n+/)
    .filter(x => x.trim())
    .map(p => `<p>${p}</p>`)
    .join("");

  // Bearbeiten/Duplizieren/Löschen gibt's nur bei eigenen Zaubern mit einer
  // ID — in der Live-Vorschau des Modals ist die ID absichtlich null,
  // sonst hätte man mitten in der Vorschau auf einmal Lösch-Knöpfe.
  const werkzeugeZeigen = spell.custom && spell.id;
  const werkzeuge = werkzeugeZeigen ? `
    <button onclick="editSpell('${spell.id}')" class="card-tool-btn">✏️</button>
    <button onclick="duplicateSpell('${spell.id}')" class="card-tool-btn">📋</button>
    <button onclick="deleteSpell('${spell.id}')" class="card-tool-btn card-tool-btn-danger">🗑️</button>` : '';

  const quellenTag = spell.source ? `<div class="source-tag">${spell.source}</div>` : '';

  const obenRechts = `
<div class="card-topright">
    ${quellenTag}
    ${werkzeugeZeigen ? `<div class="card-tools">${werkzeuge}</div>` : ''}
</div>`;

  return `
    ${obenRechts}
    <div class="card-head">
        <div class="spell-name">${spell.name || 'Unbenannt'}</div>
        ${englischerName}
    </div>
    <div class="level-school">${spell.level == "0" ? "Zaubertrick" : spell.level + ". Grad"} · ${spell.school || 'Schule'} ${ritual}</div>
    <table class="meta">
        <tr><td class="k">Wirkzeit</td><td>${spell.castTime || '-'}</td><td class="k">Reichweite</td><td>${spell.range || '-'}</td></tr>
        <tr><td class="k">Komponenten</td><td>${spell.components || '-'}</td><td class="k">Dauer</td><td>${spell.duration || '-'}</td></tr>
    </table>
    <div class="desc">${absaetze}</div>
    ${material}
    <div class="classes"><b>Klassen:</b> ${(spell.classes && spell.classes.length) ? spell.classes.join(", ") : "Alle"}</div>
`;
}

// --- 4. Aktionen für eigene Zauber ---

window.editSpell = function (id) {
  const spell = CUSTOM_SPELLS.find(s => s.id === id);
  if (!spell) return;

  currentEditId = id;
  document.querySelector("#spellModal h2").textContent = "Zauber bearbeiten";

  document.getElementById("spellName").value = spell.name;
  document.getElementById("spellNameEn").value = spell.nameEn || "";
  document.getElementById("spellLevel").value = spell.level;
  document.getElementById("spellSchool").value = spell.school;
  document.getElementById("spellCast").value = spell.castTime;
  document.getElementById("spellRange").value = spell.range;
  document.getElementById("spellComponents").value = spell.components;
  document.getElementById("spellDuration").value = spell.duration;
  document.getElementById("spellMaterial").value = spell.material || "";
  document.getElementById("spellDescription").value = spell.description;
  document.getElementById("spellClasses").value = spell.classes.join(", ");
  document.getElementById("spellRitual").checked = spell.ritual;

  updatePreview();
  modal.classList.add("show");
};

window.deleteSpell = function (id) {
  if (!confirm("Diesen Zauber wirklich löschen?")) return;
  CUSTOM_SPELLS = CUSTOM_SPELLS.filter(s => s.id !== id);
  localStorage.setItem("customSpells", JSON.stringify(CUSTOM_SPELLS));
  refreshMasterList();
};

window.duplicateSpell = function (id) {
  const spell = CUSTOM_SPELLS.find(s => s.id === id);
  if (!spell) return;

  const kopie = JSON.parse(JSON.stringify(spell));
  kopie.id = crypto.randomUUID();
  kopie.name += " (Kopie)";

  CUSTOM_SPELLS.push(kopie);
  localStorage.setItem("customSpells", JSON.stringify(CUSTOM_SPELLS));
  refreshMasterList();
};

// --- 5. Filtern, Sortieren & Zeichnen ---

function render() {
  const aktiveGrade = new Set(Array.from(document.querySelectorAll('.lvl-cb:checked')).map(cb => cb.value));
  const aktiveKlassen = new Set(Array.from(document.querySelectorAll('.cls-cb:checked')).map(cb => cb.value));
  const aktiveQuellen = new Set(Array.from(document.querySelectorAll('.src-cb:checked')).map(cb => cb.value));
  const sortierung = (document.querySelector('.sort-rb:checked') || {}).value || 'name';

  const gefiltert = ALL_SPELLS.filter(s => {
    // Grad
    if (!aktiveGrade.has(s.level.toString())) return false;

    // Klasse — ein Zauber ohne Klassenliste gilt als "für alle" und wird
    // gezeigt, sobald irgendeine Klasse ausgewählt ist.
    if (!s.classes || s.classes.length === 0) {
      if (aktiveKlassen.size === 0) return false;
    } else if (!s.classes.some(c => aktiveKlassen.has(c))) {
      return false;
    }

    // Quelle
    if (!aktiveQuellen.has(s.source || "SRD")) return false;

    return true;
  });

  gefiltert.sort((a, b) => {
    if (sortierung === 'level') {
      const diff = Number(a.level) - Number(b.level);
      return diff !== 0 ? diff : (a.name || '').localeCompare(b.name || '', 'de');
    }
    if (sortierung === 'source') {
      const diff = (a.source || 'SRD').localeCompare(b.source || 'SRD', 'de');
      return diff !== 0 ? diff : (a.name || '').localeCompare(b.name || '', 'de');
    }
    return (a.name || '').localeCompare(b.name || '', 'de');
  });

  pageContainer.innerHTML = '';
  document.getElementById('count').textContent = `${gefiltert.length} Zauber`;

  if (gefiltert.length === 0) {
    pageContainer.innerHTML = '<div class="empty-msg" style="grid-column: span 3; padding: 50px;">Keine Zauber gefunden. Überprüfe die Filter (Klasse/Grad/Quelle).</div>';
    return;
  }

  // 9 Karten pro Druckseite (3×3-Raster, siehe .page in style.css)
  for (let i = 0; i < gefiltert.length; i += 9) {
    const seite = document.createElement('div');
    seite.className = 'page';
    gefiltert.slice(i, i + 9).forEach(s => {
      const karte = document.createElement('div');
      karte.className = `card ${s.tier || 'tier-medium'}`;
      karte.innerHTML = s.html;
      seite.appendChild(karte);
    });
    pageContainer.appendChild(seite);
  }
}

// --- 6. Event-Listener ---

document.getElementById("saveSpell").onclick = () => {
  const name = document.getElementById("spellName").value.trim();
  if (!name) return alert("Der Zauber braucht einen Namen!");

  // "Magier, Barde " -> ["Magier", "Barde"]
  const klassenListe = document.getElementById("spellClasses").value
    .split(",")
    .map(x => x.trim())
    .filter(Boolean);

  const spellData = {
    custom: true,
    id: currentEditId || crypto.randomUUID(),
    name,
    nameEn: document.getElementById("spellNameEn").value.trim(),
    level: document.getElementById("spellLevel").value,
    school: document.getElementById("spellSchool").value.trim(),
    castTime: document.getElementById("spellCast").value.trim(),
    range: document.getElementById("spellRange").value.trim(),
    components: document.getElementById("spellComponents").value.trim(),
    duration: document.getElementById("spellDuration").value.trim(),
    material: document.getElementById("spellMaterial").value.trim(),
    description: document.getElementById("spellDescription").value.trim(),
    classes: klassenListe,
    ritual: document.getElementById("spellRitual").checked,
    tier: "tier-medium"
  };

  if (currentEditId) {
    const idx = CUSTOM_SPELLS.findIndex(s => s.id === currentEditId);
    if (idx !== -1) CUSTOM_SPELLS[idx] = spellData;
  } else {
    CUSTOM_SPELLS.push(spellData);
  }

  localStorage.setItem("customSpells", JSON.stringify(CUSTOM_SPELLS));
  currentEditId = null;
  refreshMasterList();
  modal.classList.remove("show");
};

function updatePreview() {
  const klassenListe = document.getElementById("spellClasses").value.split(",").map(x => x.trim()).filter(Boolean);
  const vorschauDaten = {
    name: document.getElementById("spellName").value || "Zaubername",
    nameEn: document.getElementById("spellNameEn").value,
    level: document.getElementById("spellLevel").value,
    school: document.getElementById("spellSchool").value || "Schule",
    castTime: document.getElementById("spellCast").value || "-",
    range: document.getElementById("spellRange").value || "-",
    components: document.getElementById("spellComponents").value || "-",
    duration: document.getElementById("spellDuration").value || "-",
    material: document.getElementById("spellMaterial").value,
    description: document.getElementById("spellDescription").value || "Beschreibung...",
    classes: klassenListe,
    ritual: document.getElementById("spellRitual").checked,
    custom: true,
    id: null // keine Knöpfe in der Vorschau
  };
  document.getElementById("previewCard").innerHTML = createSpellHTML(vorschauDaten);
}

// Live-Vorschau: bei jeder Eingabe im Formular neu zeichnen
document.querySelectorAll('.modal-box input, .modal-box textarea, .modal-box select').forEach(el => {
  el.addEventListener('input', updatePreview);
});

document.getElementById("newSpellBtn").onclick = () => {
  currentEditId = null;
  document.querySelector("#spellModal h2").textContent = "Neuen Zauber erstellen";
  document.querySelectorAll(".modal-box input:not([type=checkbox]), .modal-box textarea").forEach(i => i.value = "");
  document.getElementById("spellLevel").value = "0";
  document.getElementById("spellRitual").checked = false;
  updatePreview();
  modal.classList.add("show");
};

document.getElementById("cancelSpell").onclick = () => modal.classList.remove("show");

// Alle Filter-/Sortier-Dropdowns in der Werkzeugleiste funktionieren gleich
// (Knopf klicken -> Panel auf-/zuklappen), deshalb reicht eine Schleife
// über alle .dropdown-Elemente statt vier fast identischer Zeilen.
document.querySelectorAll('.dropdown').forEach(dropdown => {
  dropdown.querySelector('.dropdown-btn')?.addEventListener('click', () => dropdown.classList.toggle('open'));
});

document.querySelectorAll('.lvl-cb, .cls-cb').forEach(cb => cb.addEventListener('change', render));
document.querySelectorAll('.sort-rb').forEach(rb => rb.addEventListener('change', render));

document.querySelectorAll('.panel-all, .panel-none').forEach(btn => {
  btn.addEventListener('click', () => {
    const ziel = btn.dataset.target; // 'lvl', 'cls' oder 'src'
    const angehakt = btn.classList.contains('panel-all');
    document.querySelectorAll(`.${ziel}-cb`).forEach(cb => cb.checked = angehakt);
    render();
  });
});

document.getElementById('printBtn').onclick = () => window.print();

// Klick außerhalb eines offenen Dropdowns schließt es wieder
document.addEventListener('click', (e) => {
  if (!e.target.closest('.dropdown')) {
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
  }
});

init();
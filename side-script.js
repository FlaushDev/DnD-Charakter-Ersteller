/** side-script.js
 *  Kernlogik für den 2024 Charakter-Ersteller.
 *  Struktur identisch zu main-script.js, importiert jedoch data2024.js.
 */
import { CLASS_DATA, SKILLS, POINT_COSTS, PROFICIENCY_BONUS, ATTRIBUTES_MAP, HINTERGRÜNDE, RACES, RACE_GROUPS, ALIGNMENT } from './data2024.js';
import { fillFormFull, fillFormEssential } from './pdf.js';

export const state = {
    scores: { STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 },
    selectedSkills: []
};

/* ── Hilfsfunktionen ───────────────────────────────────────────── */

export function calculateModifier(score) { return Math.floor((score - 10) / 2); }

function getTotalPoints() {
    return Object.values(state.scores).reduce((sum, val) => sum + POINT_COSTS[val], 0);
}

export function getPB() {
    const lvl = parseInt(document.getElementById('levelSelect')?.value) || 1;
    return PROFICIENCY_BONUS[lvl] ?? 2;
}

export function getAttributeTotal(attr) { return state.scores[attr] + getRacialBonus(attr); }
export function getModifierTotal(attr)  { return calculateModifier(getAttributeTotal(attr)); }

function getRacialBonus(attr) {
    const main = document.getElementById('mainRaceSelect').value;
    const subs = RACE_GROUPS[main] || [];
    const raceKey = subs.length > 1 ? document.getElementById('subRaceSelect').value : main;
    const race = RACES[raceKey];
    if (!race) return 0;
    if (race.custom) {
        let b = (raceKey === 'Halbelf' && attr === 'CHA') ? 2 : 0;
        if (document.getElementById('customAttr1').value === attr) b += 1;
        if (document.getElementById('customAttr2').value === attr) b += 1;
        return b;
    }
    return race[attr] || 0;
}

/* ── Dropdown ──────────────────────────────────────────────────── */

function dropdownMenuOpenClose() {
    document.getElementById('dropdownContent').classList.toggle('show-dropdown');
}

/* ── E-Mail ────────────────────────────────────────────────────── */

function copyEmail() {
    navigator.clipboard.writeText('owner@tools-n-trinkets.at').then(() => {});
}

/* ── HP / PB ───────────────────────────────────────────────────── */

function calculateTotalHP() {
    const level = parseInt(document.getElementById('levelSelect').value) || 1;
    const classData = CLASS_DATA[document.getElementById('classSelect').value];
    if (!classData) return 0;
    const conMod = calculateModifier(getAttributeTotal('CON'));
    const level1HP = classData.hd + conMod;
    if (level === 1) return Math.max(1, level1HP);
    return level1HP + (level - 1) * (Math.floor(classData.hd / 2) + 1 + conMod);
}

/* ── Klasse / Rasse ────────────────────────────────────────────── */

function handleClassChange() {
    const cls = document.getElementById('classSelect').value;
    const lvl = parseInt(document.getElementById('levelSelect').value) || 1;
    const data = CLASS_DATA[cls];
    const subDiv = document.getElementById('subClassSelection');

    if (data && data.subclasses.length > 0 && lvl >= data.subLevel) {
        subDiv.style.display = 'block';
        document.getElementById('subClassSelect').innerHTML =
            data.subclasses.map(s => `<option value="${s}">${s}</option>`).join('');
        const isWarlock = cls === 'Hexenmeister';
        document.getElementById('subClassSelectLabel').textContent = isWarlock ? 'Patron wählen:' : 'Subklasse wählen:';
        document.getElementById('warlockInfoLabel').style.display = isWarlock ? 'block' : 'none';
    } else {
        subDiv.style.display = 'none';
        document.getElementById('warlockInfoLabel').style.display = 'none';
    }
    updateDisplay();
}

function handleMainRaceChange() {
    const main = document.getElementById('mainRaceSelect').value;
    const subs = RACE_GROUPS[main] || [];
    const subDiv = document.getElementById('subRaceSelection');
    subDiv.style.display = subs.length > 1 ? 'block' : 'none';
    if (subs.length > 1) {
        document.getElementById('subRaceSelect').innerHTML =
            subs.map(s => `<option value="${s}">${s}</option>`).join('');
    }
    updateCustomRaceLogic();
}

function updateCustomRaceLogic() {
    const main = document.getElementById('mainRaceSelect').value;
    const subs = RACE_GROUPS[main] || [];
    const raceKey = subs.length > 1 ? document.getElementById('subRaceSelect').value : main;
    const customDiv = document.getElementById('customBonuses');
    if (customDiv) customDiv.style.display = RACES[raceKey]?.custom ? 'block' : 'none';
    updateDisplay();
}

/* ── Attribut-Tabelle ──────────────────────────────────────────── */

function updateAttributeTable() {
    const table = document.getElementById('attributesTable');
    if (!table) return;
    table.innerHTML = Object.entries(ATTRIBUTES_MAP).map(([attr, name]) => {
        const base   = state.scores[attr];
        const racial = getRacialBonus(attr);
        const total  = getAttributeTotal(attr);
        const mod    = calculateModifier(total);
        return `
        <tr>
            <td>${name}</td>
            <td class="text-center">
                <button class="attr-btn-minus" onclick="adjustScore('${attr}', -1)">−</button>
                <span style="min-width:20px;display:inline-block">${base}</span>
                <button class="attr-btn-plus"  onclick="adjustScore('${attr}',  1)">+</button>
            </td>
            <td class="text-center">+${racial}</td>
            <td class="text-center"><strong class="total-score">${total}</strong></td>
            <td class="text-center"><span class="mod-badge">${mod >= 0 ? '+' + mod : mod}</span></td>
            <td class="text-center" style="color:#888">${POINT_COSTS[base]} Pkt</td>
        </tr>`;
    }).join('');
}

function adjustScore(attr, delta) {
    const newValue = state.scores[attr] + delta;
    if (newValue < 8 || newValue > 15) return;
    const costDiff = POINT_COSTS[newValue] - POINT_COSTS[state.scores[attr]];
    if (delta > 0 && getTotalPoints() + costDiff > 27) return;
    state.scores[attr] = newValue;
    updateDisplay();
}

/* ── Fertigkeiten / Rettungswürfe ──────────────────────────────── */

function updateSkillLimit() {
    const raceData  = RACES[document.getElementById('mainRaceSelect').value];
    const classData = CLASS_DATA[document.getElementById('classSelect').value];
    // FIX: Klammern nötig wegen Operatoren-Präzedenz
    const limit = (classData?.skillChoices ?? 0) + (raceData?.skillChoices ?? 0);
    document.getElementById('skillLimit').textContent = limit;
}

function updateSavesAndSkills() {
    const savesList  = document.getElementById('savesList');
    const skillsList = document.getElementById('skillsList');
    if (!savesList || !skillsList) return;

    const cls       = document.getElementById('classSelect').value;
    const classData = CLASS_DATA[cls] || { saves: [], skillChoices: 0 };
    const bgKey     = document.getElementById('backgroundSelect').value;
    const bgSkills  = HINTERGRÜNDE[bgKey]?.skills || [];
    const pb        = getPB();

    savesList.innerHTML = Object.entries(ATTRIBUTES_MAP).map(([attr, name]) => {
        const isProf = classData.saves.includes(attr);
        const val    = calculateModifier(getAttributeTotal(attr)) + (isProf ? pb : 0);
        return `<li>${isProf ? '❤' : '◯'} ${name}: ${val >= 0 ? '+' + val : val}</li>`;
    }).join('');

    skillsList.innerHTML = Object.entries(SKILLS).map(([skill, attr]) => {
        const isBgProf   = bgSkills.includes(skill);
        const isSelected = state.selectedSkills.includes(skill);
        const isProf     = isBgProf || isSelected;
        const val        = calculateModifier(getAttributeTotal(attr)) + (isProf ? pb : 0);
        return `<li>
            <input type="checkbox" onchange="handleSkillChange('${skill}')"
                ${isProf ? 'checked' : ''} ${isBgProf ? 'disabled' : ''}>
            ${skill}: ${val >= 0 ? '+' + val : val}
        </li>`;
    }).join('');
}

function handleSkillChange(skill) {
    const bgSkills = HINTERGRÜNDE[document.getElementById('backgroundSelect').value]?.skills || [];
    if (bgSkills.includes(skill)) return;

    const limit = CLASS_DATA[document.getElementById('classSelect').value]?.skillChoices ?? 0;
    const classSkills = state.selectedSkills.filter(s => !bgSkills.includes(s));

    if (state.selectedSkills.includes(skill)) {
        state.selectedSkills = state.selectedSkills.filter(s => s !== skill);
    } else if (classSkills.length < limit) {
        state.selectedSkills.push(skill);
    }
    updateSavesAndSkills();
}

/* ── Haupt-Update ──────────────────────────────────────────────── */

function updateDisplay() {
    updateAttributeTable();
    updateSavesAndSkills();
    updateSkillLimit();
    document.getElementById('pointsDisplay').textContent = `${getTotalPoints()} / 27`;
    document.getElementById('pbDisplay').textContent     = `+${getPB()}`;
    document.getElementById('hpDisplay').textContent     = calculateTotalHP();
    const cls = document.getElementById('classSelect').value;
    document.getElementById('hdDisplay').textContent     = CLASS_DATA[cls] ? `1d${CLASS_DATA[cls].hd}` : 'k.A.';
}

/* ── Zufallsgenerator ──────────────────────────────────────────── */

function random(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function randomScore() {
    const presets = [
        { STR: 15, DEX: 14, CON: 13, INT: 12, WIS: 10, CHA:  8 },
        { STR:  8, DEX: 15, CON: 14, INT: 13, WIS: 12, CHA: 10 },
        { STR: 10, DEX:  8, CON: 15, INT: 14, WIS: 13, CHA: 12 },
        { STR: 12, DEX: 10, CON:  8, INT: 15, WIS: 14, CHA: 13 },
        { STR: 13, DEX: 12, CON: 10, INT:  8, WIS: 15, CHA: 14 },
        { STR: 14, DEX: 13, CON: 12, INT: 10, WIS:  8, CHA: 15 },
    ];
    Object.assign(state.scores, random(presets));
    handleMainRaceChange();
    handleClassChange();
    updateDisplay();
}

function randomizeEverything() {
    document.getElementById('mainRaceSelect').value = random(Object.keys(RACE_GROUPS));
    handleMainRaceChange();

    const subRaceSel = document.getElementById('subRaceSelect');
    if (subRaceSel?.options.length > 0)
        subRaceSel.selectedIndex = Math.floor(Math.random() * subRaceSel.options.length);

    document.getElementById('classSelect').value = random(Object.keys(CLASS_DATA));
    document.getElementById('backgroundSelect').value = random(Object.keys(HINTERGRÜNDE));
    document.getElementById('alignmentSelect').value = random(Object.keys(ALIGNMENT));

    const limit = CLASS_DATA[document.getElementById('classSelect').value]?.skillChoices ?? 2;
    const skillKeys = Object.keys(SKILLS);
    state.selectedSkills = Array.from({ length: limit }, () => random(skillKeys));

    randomScore();
}

/* ── Globale Funktionen ────────────────────────────────────────── */
window.adjustScore          = adjustScore;
window.handleSkillChange    = handleSkillChange;
window.randomScore          = randomScore;
window.randomizeEverything  = randomizeEverything;
window.copyEmail            = copyEmail;
window.fillFormFull         = fillFormFull;
window.fillFormEssential    = fillFormEssential;
window.dropdownMenuOpenClose = dropdownMenuOpenClose;

/* ── Event-Listener ────────────────────────────────────────────── */
document.getElementById('classSelect')?.addEventListener('change', handleClassChange);
document.getElementById('classSelect')?.addEventListener('change', updateSkillLimit);
document.getElementById('mainRaceSelect')?.addEventListener('change', handleMainRaceChange);
document.getElementById('subRaceSelect')?.addEventListener('change', updateCustomRaceLogic);
document.getElementById('levelSelect')?.addEventListener('change', updateDisplay);
document.getElementById('backgroundSelect')?.addEventListener('change', updateDisplay);
document.getElementById('alignmentSelect')?.addEventListener('change', updateDisplay);
document.getElementById('customAttr1')?.addEventListener('change', updateDisplay);
document.getElementById('customAttr2')?.addEventListener('change', updateDisplay);
document.getElementById('resetBtn')?.addEventListener('click', () => {
    document.getElementById('mainRaceSelect').value  = 'Mensch';
    document.getElementById('subRaceSelect').selectedIndex = 0;
    document.getElementById('classSelect').value     = 'Kämpfer';
    document.getElementById('levelSelect').value     = '1';
    document.getElementById('backgroundSelect').value = 'Scharlatan (Täuschen (CHA), Fingerfertigkeit (DEX))';
    document.getElementById('alignmentSelect').value = 'WahrhaftNeutral';
    state.selectedSkills = [];
    Object.assign(state.scores, { STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 });
    handleMainRaceChange();
    handleClassChange();
    updateDisplay();
});

document.addEventListener('DOMContentLoaded', () => {
    const lvl = document.getElementById('levelSelect');
    if (!lvl) return;

    lvl.innerHTML = Array.from({ length: 20 }, (_, i) =>
        `<option value="${i + 1}">Level ${i + 1}</option>`).join('');

    handleMainRaceChange();
    handleClassChange();
    updateDisplay();

    const sel1 = document.getElementById('customAttr1');
    const sel2 = document.getElementById('customAttr2');
    if (!sel1 || !sel2) return;

    function syncCustomSelectors() {
        [...sel1.options].forEach(o => o.disabled = false);
        [...sel2.options].forEach(o => o.disabled = false);
        const inSel2 = [...sel2.options].find(o => o.value === sel1.value);
        const inSel1 = [...sel1.options].find(o => o.value === sel2.value);
        if (inSel2) inSel2.disabled = true;
        if (inSel1) inSel1.disabled = true;
    }

    sel1.addEventListener('change', () => { syncCustomSelectors(); updateDisplay(); });
    sel2.addEventListener('change', () => { syncCustomSelectors(); updateDisplay(); });
});

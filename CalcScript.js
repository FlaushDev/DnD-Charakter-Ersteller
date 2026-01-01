const POINT_COSTS = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
const PROFICIENCY_BONUS = { 1: 2, 2: 2, 3: 2, 4: 2, 5: 3, 6: 3, 7: 3, 8: 3, 9: 4, 10: 4, 11: 4, 12: 4, 13: 5, 14: 5, 15: 5, 16: 5, 17: 6, 18: 6, 19: 6, 20: 6 };
const ATTRIBUTES_MAP = {
    STR: 'Stärke (STR)',
    DEX: 'Geschicklichkeit (DEX)',
    CON: 'Konstitution (CON)',
    INT: 'Intelligenz (INT)',
    WIS: 'Weisheit (WIS)',
    CHA: 'Charisma (CHA)'
};

const SKILLS = {
    'Akrobatik': 'DEX',
    'Arkane Kunde': 'INT',
    'Geschichte': 'INT',
    'Athletik': 'STR',
    'Auftreten': 'CHA',
    'Einschüchtern': 'CHA',
    'Heilkunde': 'WIS',
    'Heimlichkeit': 'DEX',
    'Täuschen': 'CHA',
    'Motiv erkennen': 'WIS',
    'Nachforschung': 'INT',
    'Naturkunde': 'INT',
    'Religion': 'INT',
    'Fingerfertigkeit': 'DEX',
    'Mit Tieren umgehen': 'WIS',
    'Überlebenskunst': 'WIS',
    'Überzeugen': 'CHA',
    'Wahrnehmung': 'WIS'
};

const HINTERGRÜNDE = {
    'Scharlatan': { skills: ['Täuschen', 'Fingerfertigkeit'] },
    'Handwerker': { skills: ['Motiv erkennen', 'Überzeugen'] },
    'Krimineller': { skills: ['Heimlichkeit', 'Täuschen'] },
    'Unterhaltungskünstler': { skills: ['Auftreten', 'Akrobatik'] },
    'Volksheld': { skills: ['Mit Tieren umgehen', 'Überlebenskunst'] },
    'Weiser': { skills: ['Arkane Kunde', 'Geschichte'] },
    'Einsiedler': { skills: ['Heilkunde', 'Religion'] },
    'Adliger': { skills: ['Überzeugen', 'Geschichte'] },
    'Seeman': { skills: ['Athletik', 'Wahrnehmung'] },
    'Soldat': { skills: ['Athletik', 'Einschüchtern'] },
    'Sonderling': { skills: ['Athletik', 'Überlebenskunst'] },
    'Strassenkind': { skills: ['Fingerfertigkeit', 'Heimlichkeit'] },
    'Tempeldiener': { skills: ['Motiv erkennen', 'Religion'] },
    'Händler': { skills: ['Motiv erkennen', 'Überzeugen'] }
};

const CLASS_DATA = {
    'Barde': { level: 3, hd: 8, saves: ['DEX', 'CHA'], skillChoices: 3, subclasses: ['College des Ruhms', 'College der Weisheit', 'College der Tapferkeit', 'College des Tanzes'] },
    'Barbar': { level: 3, hd: 12, saves: ['STR', 'CON'], skillChoices: 2, subclasses: ['Pfad des Berserkers', 'Pfad des Totemkriegers'] },
    'Druide': { level: 2, hd: 8, saves: ['INT', 'WIS'], skillChoices: 2, subclasses: ['Zirkel des Mondes', 'Zirkel des Landes'] },
    'Hexenmeister': { level: 1, hd: 8, saves: ['WIS', 'CHA'], skillChoices: 2, subclasses: ['Erzfeen', 'Der Unhold', 'Der Große Alte'] },
    'Kämpfer': { level: 3, hd: 10, saves: ['STR', 'CON'], skillChoices: 2, subclasses: ['Kampfmeister', 'Meister des Schwertes', 'Mystischer Ritter'] },
    'Kleriker': { level: 1, hd: 8, saves: ['WIS', 'CHA'], skillChoices: 2, subclasses: ['Lebensdomäne', 'Lichtdomäne', 'Betrugsdomäne'] },
    'Magier': { level: 2, hd: 6, saves: ['INT', 'WIS'], skillChoices: 2, subclasses: ['Schule der Bannmagie', 'Schule der Hervorrufung', 'Schule der Nekromantie'] },
    'Mönch': { level: 3, hd: 8, saves: ['STR', 'DEX'], skillChoices: 2, subclasses: ['Weg der offenen Hand', 'Weg des Schattens', 'Weg der Vier Elemente'] },
    'Paladin': { level: 3, hd: 10, saves: ['WIS', 'CHA'], skillChoices: 2, subclasses: ['Schwur der Hingabe', 'Schwur der Alten', 'Schwur der Rache'] },
    'Schurke': { level: 3, hd: 8, saves: ['DEX', 'INT'], skillChoices: 4, subclasses: ['Dieb', 'Meuchelmörder', 'Arkaner Betrüger'] },
    'Waldläufer': { level: 3, hd: 10, saves: ['STR', 'DEX'], skillChoices: 3, subclasses: ['Jäger', 'Tierherr'] },
    'Zauberer': { level: 1, hd: 6, saves: ['CON', 'CHA'], skillChoices: 2, subclasses: ['Drachenblut', 'Wildmagie', 'Abartige Gedanken'] },
    'Keine': { level: 1, hd: 6, saves: [], skillChoices: 0, subclasses: [] }
};

const RACE_GROUPS = {
    'Mensch': ['Mensch', 'Mensch (Variante)'],
    'Elf': ['Hochelf', 'Waldelf', 'Dunkelelfen (Drow)'],
    'Zwerg': ['Zwerg (Hügel)', 'Zwerg (Gebirge)'],
    'Halbling': ['Halbling (Leichtfuß)', 'Halbling (Stämmig)'],
    'Gnom': ['Berggnom', 'Waldgnom', 'Tiefengnom'],
    'Halbelf': ['Halbelf'],
    'Halbork': ['Halbork'],
    'Drachenblütiger': ['Drachenblütiger'],
    'Tiefling': ['Tiefling']
};

const RACES = {
    'Mensch': { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },
    'Mensch (Variante)': { custom: 2 },
    'Halbelf': { CHA: 2, custom: 2 },
    'Hochelf': { DEX: 2, INT: 1 },
    'Waldelf': { DEX: 2, WIS: 1 },
    'Dunkelelfen (Drow)': { DEX: 2, CHA: 1 },
    'Berggnom': { INT: 2, CON: 2 },
    'Waldgnom': { INT: 2, DEX: 1 },
    'Tiefengnom': { INT: 2, DEX: 1 },
    'Halbork': { STR: 2, CON: 1 },
    'Drachenblütiger': { STR: 2, CHA: 1 },
    'Zwerg (Hügel)': { CON: 2, WIS: 1 },
    'Zwerg (Gebirge)': { CON: 2, STR: 2 },
    'Tiefling': { INT: 1, CHA: 2 },
    'Halbling (Leichtfuß)': { DEX: 2, CHA: 1 },
    'Halbling (Stämmig)': { DEX: 2, CON: 1 }
};

let scores = { STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 };
let selectedSkills = [];

function calculateModifier(score) { return Math.floor((score - 10) / 2); }
function getTotalPoints() { return Object.values(scores).reduce((sum, val) => sum + POINT_COSTS[val], 0); }

function getPB() { 
    const lvlEl = document.getElementById('levelSelect');
    const lvl = lvlEl ? parseInt(lvlEl.value) : 1;
    return PROFICIENCY_BONUS[lvl] || 2; 
}

function getBackgroundBonus(attr) { 
    const bgKey = document.getElementById('backgroundSelect').value; 
    return HINTERGRÜNDE[bgKey] ? (HINTERGRÜNDE[bgKey][attr] || 0) : 0; 
}

function getAttributeTotal(attr) { return scores[attr] + getRacialBonus(attr) + getBackgroundBonus(attr); }

function updateAttributeTable() {
    const table = document.getElementById('attributesTable');
    if (!table) return;
    table.innerHTML = '';
    for (const [attr, name] of Object.entries(ATTRIBUTES_MAP)) {
        const base = scores[attr];
        const racial = getRacialBonus(attr);
        const bg = getBackgroundBonus(attr);
        const total = getAttributeTotal(attr);
        const mod = calculateModifier(total);

        table.innerHTML += `
            <tr>
                <td>${name}</td>
                <td class="text-center">
                    <button class="attr-btn-minus" onclick="adjustScore('${attr}', -1)">−</button>
                    <span style="min-width: 20px; display: inline-block;">${base}</span>
                    <button class="attr-btn-plus" onclick="adjustScore('${attr}', 1)">+</button>
                </td>
                <td class="text-center">+${racial + bg}</td>
                <td class="text-center"><strong class="total-score">${total}</strong></td>
                <td class="text-center"><span class="mod-badge">${mod >= 0 ? '+' + mod : mod}</span></td>
                <td class="text-center" style="color: #888;">${POINT_COSTS[base]} Pkt</td>
            </tr>`;
    }
}

function adjustScore(attr, delta) {
    const newValue = scores[attr] + delta;
    if (newValue >= 8 && newValue <= 15) {
        const costDiff = POINT_COSTS[newValue] - POINT_COSTS[scores[attr]];
        if (delta > 0 && (getTotalPoints() + costDiff) > 27) return;
        scores[attr] = newValue;
        updateDisplay();
    }
}

function calculateTotalHP() {
    const levelVal = document.getElementById('levelSelect').value;
    const level = parseInt(levelVal) || 1;
    const classKey = document.getElementById('classSelect').value;
    const classData = CLASS_DATA[classKey];

    if (!classData || classKey === 'Keine') return 0;

    const conMod = calculateModifier(getAttributeTotal('CON'));
    const level1HP = classData.hd + conMod;
    
    if (level === 1) return Math.max(1, level1HP);

    const avgHPPerLevel = Math.floor(classData.hd / 2) + 1 + conMod;
    return level1HP + (level - 1) * avgHPPerLevel;
}

function updateSavesAndSkills() {
    const savesList = document.getElementById('savesList');
    const skillsList = document.getElementById('skillsList');
    if (!savesList || !skillsList) return;

    savesList.innerHTML = ''; skillsList.innerHTML = '';
    const cls = document.getElementById('classSelect').value;
    const classData = CLASS_DATA[cls] || { saves: [], skillChoices: 0 };
    const bgKey = document.getElementById('backgroundSelect').value;
    const bgSkills = HINTERGRÜNDE[bgKey]?.skills || [];
    const pb = getPB();

    for (const [attr, name] of Object.entries(ATTRIBUTES_MAP)) {
        const isProf = classData.saves.includes(attr);
        const val = calculateModifier(getAttributeTotal(attr)) + (isProf ? pb : 0);
        savesList.innerHTML += `<li>${isProf ? '❤' : '◯'} ${name}: ${val >= 0 ? '+' + val : val}</li>`;
    }

    for (const [skill, attr] of Object.entries(SKILLS)) {
        const isBgProf = bgSkills.includes(skill);
        const isSelected = selectedSkills.includes(skill);
        const isProf = isBgProf || isSelected;
        const val = calculateModifier(getAttributeTotal(attr)) + (isProf ? pb : 0);
        skillsList.innerHTML += `<li><input type="checkbox" onchange="handleSkillChange('${skill}')" ${isProf ? 'checked' : ''} ${isBgProf ? 'disabled' : ''}> ${skill}: ${val >= 0 ? '+' + val : val}</li>`;
    }
}

function handleSkillChange(skill) {
    const bgKey = document.getElementById('backgroundSelect').value;
    const bgSkills = HINTERGRÜNDE[bgKey]?.skills || [];
    if (bgSkills.includes(skill)) return;
    const classData = CLASS_DATA[document.getElementById('classSelect').value];
    const limit = classData ? classData.skillChoices : 0;
    const currentClassSkills = selectedSkills.filter(s => !bgSkills.includes(s));
    
    if (selectedSkills.includes(skill)) {
        selectedSkills = selectedSkills.filter(s => s !== skill);
    } else if (currentClassSkills.length < limit) {
        selectedSkills.push(skill);
    }
    updateSavesAndSkills();
}

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

function handleMainRaceChange() {
    const main = document.getElementById('mainRaceSelect').value;
    const subDiv = document.getElementById('subRaceSelection');
    const subs = RACE_GROUPS[main] || [];
    subDiv.style.display = subs.length > 1 ? 'block' : 'none';
    if (subs.length > 1) {
        const sel = document.getElementById('subRaceSelect');
        sel.innerHTML = '';
        subs.forEach(s => sel.innerHTML += `<option value="${s}">${s}</option>`);
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

function handleClassChange() {
    const cls = document.getElementById('classSelect').value;
    const lvlVal = document.getElementById('levelSelect').value;
    const lvl = parseInt(lvlVal) || 1;
    const data = CLASS_DATA[cls];
    const subDiv = document.getElementById('subClassSelection');
    if (data && data.subclasses.length > 0 && lvl >= data.level) {
        subDiv.style.display = 'block';
        const sel = document.getElementById('subClassSelect');
        sel.innerHTML = '';
        data.subclasses.forEach(s => sel.innerHTML += `<option value="${s}">${s}</option>`);
    } else {
        subDiv.style.display = 'none';
    }
    updateDisplay();
}

function updateDisplay() {
    updateAttributeTable();
    updateSavesAndSkills();
    document.getElementById('pointsDisplay').textContent = `${getTotalPoints()} / 27`;
    document.getElementById('pbDisplay').textContent = `+${getPB()}`;
    document.getElementById('hpDisplay').textContent = calculateTotalHP();
    const cls = document.getElementById('classSelect').value;
    document.getElementById('hdDisplay').textContent = CLASS_DATA[cls] ? `1d${CLASS_DATA[cls].hd}` : 'k.A.';
}

document.getElementById('mainRaceSelect').addEventListener('change', handleMainRaceChange);
document.getElementById('subRaceSelect').addEventListener('change', updateCustomRaceLogic);
document.getElementById('classSelect').addEventListener('change', handleClassChange);
document.getElementById('levelSelect').addEventListener('change', updateDisplay);
document.getElementById('backgroundSelect').addEventListener('change', updateDisplay);
document.getElementById('customAttr1').addEventListener('change', updateDisplay);
document.getElementById('customAttr2').addEventListener('change', updateDisplay);
document.getElementById('resetBtn').addEventListener('click', () => { window.location.reload(); });

document.addEventListener('DOMContentLoaded', () => {
    const lvl = document.getElementById('levelSelect');
    lvl.innerHTML = '';
    for (let i = 1; i <= 20; i++) {
        let opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `Level ${i}`;
        lvl.appendChild(opt);
    }
    handleMainRaceChange();
    handleClassChange();
    updateDisplay();
});
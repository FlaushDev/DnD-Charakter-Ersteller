/*Consts using SCREAMING_SNAKE are fixed Lists of Data; NEVER change these with code*/
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
    'Akrobatik (DEX)': 'DEX',
    'Arkane Kunde (INT)': 'INT',
    'Geschichte (INT)': 'INT',
    'Athletik (STR)': 'STR',
    'Auftreten (CHA)': 'CHA',
    'Einschüchtern (CHA)': 'CHA',
    'Heilkunde (WIS)': 'WIS',
    'Heimlichkeit (DEX)': 'DEX',
    'Täuschen (CHA)': 'CHA',
    'Motiv erkennen (WIS)': 'WIS',
    'Nachforschung (INT)': 'INT',
    'Naturkunde (INT)': 'INT',
    'Religion (INT)': 'INT',
    'Fingerfertigkeit (DEX)': 'DEX',
    'Tierumgang (WIS)': 'WIS',
    'Überleben (WIS)': 'WIS',
    'Überzeugen (CHA)': 'CHA',
    'Wahrnehmung (WIS)': 'WIS'
};

const HINTERGRÜNDE = {
    'Scharlatan (Täuschen (CHA), Fingerfertigkeit (DEX))': { skills: ['Täuschen (CHA)', 'Fingerfertigkeit (DEX)'] },
    'Handwerker (Motiv erkennen(WIS), Überzeugen (CHA))': { skills: ['Motiv erkennen (WIS)', 'Überzeugen (CHA)'] },
    'Krimineller (Heimlichkeit (DEX), Täuschen (CHA))': { skills: ['Heimlichkeit (DEX)', 'Täuschen (CHA)'] },
    'Unterhaltungskünstler (Auftreten (CHA), Akrobatik (STR))': { skills: ['Auftreten (CHA)', 'Akrobatik (STR)'] },
    'Volksheld (Tierumgang (WIS), Überleben (WIS))': { skills: ['Tierumgang (WIS)', 'Überleben (WIS)'] },
    'Weiser (Arkane Kunde (INT), Geschichte (INT))': { skills: ['Arkane Kunde (INT)', 'Geschichte (INT)'] },
    'Einsiedler (Heilkunde (WIS), Religion (INT))': { skills: ['Heilkunde (WIS)', 'Religion (INT)'] },
    'Adliger (Überzeugen (CHA), Geschichte (INT))': { skills: ['Überzeugen (CHA)', 'Geschichte (INT)'] },
    'Seeman (Athletik (STR), Wahrnehmung (WIS))': { skills: ['Athletik (STR)', 'Wahrnehmung (WIS)'] },
    'Soldat (Athletik (STR), Wahrnehmung (WIS))': { skills: ['Athletik (STR)', 'Wahrnehmung (WIS)'] },
    'Sonderling (Athletik (STR), Überleben (WIS))': { skills: ['Athletik (STR)', 'Überleben (WIS)'] },
    'Strassenkind (Fingerfertigkeit (DEX), Heimlichkeit (DEX))': { skills: ['Fingerfertigkeit (DEX)', 'Heimlichkeit (DEX)'] },
    'Tempeldiener (Motiv erkennen (WIS), Religion (INT))': { skills: ['Motiv erkennen (WIS)', 'Religion (INT)'] },
    'Händler (Motiv erkennen (WIS), Überzeugen (CHA))': { skills: ['Motiv erkennen (WIS)', 'Überzeugen (CHA)'] }
};

const CLASS_DATA = {
    'Barde': { subLevel: 3, hd: 8, saves: ['DEX', 'CHA'], skillChoices: 3, subclasses: ['College des Ruhms', 'College der Weisheit', 'College der Tapferkeit', 'College des Tanzes'] },
    'Barbar': { subLevel: 3, hd: 12, saves: ['STR', 'CON'], skillChoices: 2, subclasses: ['Pfad des Berserkers', 'Pfad des Totemkriegers'] },
    'Druide': { subLevel: 2, hd: 8, saves: ['INT', 'WIS'], skillChoices: 2, subclasses: ['Zirkel des Mondes', 'Zirkel des Landes'] },
    'Hexenmeister': { subLevel: 1, hd: 8, saves: ['WIS', 'CHA'], skillChoices: 2, subclasses: ['Eine Erzfee', 'Ein Unhold', 'Ein Großer Alter'] },
    'Kämpfer': { subLevel: 3, hd: 10, saves: ['STR', 'CON'], skillChoices: 2, subclasses: ['Kampfmeister', 'Meister des Schwertes', 'Mystischer Ritter'] },
    'Kleriker': { subLevel: 1, hd: 8, saves: ['WIS', 'CHA'], skillChoices: 2, subclasses: ['Lebensdomäne', 'Lichtdomäne', 'Betrugsdomäne'] },
    'Magier': { subLevel: 2, hd: 6, saves: ['INT', 'WIS'], skillChoices: 2, subclasses: ['Schule der Bannmagie', 'Schule der Hervorrufung', 'Schule der Nekromantie'] },
    'Mönch': { subLevel: 3, hd: 8, saves: ['STR', 'DEX'], skillChoices: 2, subclasses: ['Weg der offenen Hand', 'Weg des Schattens', 'Weg der Vier Elemente'] },
    'Paladin': { subLevel: 3, hd: 10, saves: ['WIS', 'CHA'], skillChoices: 2, subclasses: ['Schwur der Hingabe', 'Schwur der Alten', 'Schwur der Rache'] },
    'Schurke': { subLevel: 3, hd: 8, saves: ['DEX', 'INT'], skillChoices: 4, subclasses: ['Dieb', 'Meuchelmörder', 'Arkaner Betrüger'] },
    'Waldläufer': { subLevel: 3, hd: 10, saves: ['STR', 'DEX'], skillChoices: 3, subclasses: ['Jäger', 'Tierherr'] },
    'Zauberer': { subLevel: 1, hd: 6, saves: ['CON', 'CHA'], skillChoices: 2, subclasses: ['Drachenblut', 'Wildmagie', 'Abartige Gedanken'] },
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

const ALIGNMENT = {
    'RechtschaffenGut': {},
    'RechtschaffenNeutral': {},
    'RechtschaffenBöse': {},
    'NeutralGut': {},
    'WahrhaftNeutral': {},
    'NeutralBöse': {},
    'ChaotischNeutral': {},
    'ChaotischBöse': {}
}

/*let score and let selectedSkills are lets which are changed by code while creating a character*/

let scores = { STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 };
let selectedSkills = [];

/*Functions*/

/*Core Update Display*/

function updateDisplay() {
    updateAttributeTable();
    updateSavesAndSkills();
    updateSkillLimit();
    document.getElementById('pointsDisplay').textContent = `${getTotalPoints()} / 27`;
    document.getElementById('pbDisplay').textContent = `+${getPB()}`;
    document.getElementById('hpDisplay').textContent = calculateTotalHP();
    const cls = document.getElementById('classSelect').value;
    document.getElementById('hdDisplay').textContent = CLASS_DATA[cls] ? `1d${CLASS_DATA[cls].hd}` : 'k.A.';
}

/*Functions for HitDice, HitPoints and ProficencyBonus*/

function calculateTotalHP() {
    const levelVal = document.getElementById('levelSelect').value;
    const level = parseInt(levelVal) || 1;
    const classKey = document.getElementById('classSelect').value;
    const classData = CLASS_DATA[classKey];
    const conMod = calculateModifier(getAttributeTotal('CON'));
    const level1HP = classData.hd + conMod;

    if (level === 1) return Math.max(1, level1HP);

    const avgHPPerLevel = Math.floor(classData.hd / 2) + 1 + conMod;
    return level1HP + (level - 1) * avgHPPerLevel;
}

function getPB() {
    const lvlEl = document.getElementById('levelSelect');
    const lvl = lvlEl ? parseInt(lvlEl.value) : 1;
    return PROFICIENCY_BONUS[lvl] || 2;
}

/*Functions for Level, Class(Subclass), Race (Subrace), Background and Alignment*/
function getBackgroundBonus(attr) {
    const bgKey = document.getElementById('backgroundSelect').value;
    return HINTERGRÜNDE[bgKey] ? (HINTERGRÜNDE[bgKey][attr] || 0) : 0;
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

function handleClassChange() {
    const cls = document.getElementById('classSelect').value;
    const lvlVal = document.getElementById('levelSelect').value;
    const lvl = parseInt(lvlVal) || 1;
    const data = CLASS_DATA[cls];
    const subDiv = document.getElementById('subClassSelection');
    if (data && data.subclasses.length > 0 && lvl >= data.subLevel) {
        subDiv.style.display = 'block';
        const sel = document.getElementById('subClassSelect');
        sel.innerHTML = '';
        data.subclasses.forEach(s => sel.innerHTML += `<option value="${s}">${s}</option>`);
        if (cls === "Hexenmeister") {
            document.getElementById("subClassSelectLabel").textContent = "Patron wählen:"
            document.getElementById("warlockInfoLabel").style.display = "block"
        }
        else {
            document.getElementById("warlockInfoLabel").style.display = "none"
            document.getElementById("subClassSelectLabel").textContent = "Subklasse wählen:"
        };
    } else {
        subDiv.style.display = 'none';
        document.getElementById("warlockInfoLabel").style.display = "none"
    }
    updateDisplay();
}

function updateCustomRaceLogic() {
    const main = document.getElementById('mainRaceSelect').value;
    const subs = RACE_GROUPS[main] || [];
    const raceKey = subs.length > 1 ? document.getElementById('subRaceSelect').value : main;
    const customDiv = document.getElementById('customBonuses');
    if (customDiv) customDiv.style.display = RACES[raceKey]?.custom ? 'block' : 'none';
    updateDisplay();
}

/*Functions for the Attribute Table */

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
                    <span style="min-width: 20px; display: inline-block; font-size: 15">${base}</span>
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

function calculateModifier(score) { return Math.floor((score - 10) / 2); }
function getTotalPoints() { return Object.values(scores).reduce((sum, val) => sum + POINT_COSTS[val], 0); }

/*Functions for Saves and Skills */

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
    const limit = classData?.skillChoices ?? 0;
    document.getElementById('skillLimit').textContent = limit;

    const currentClassSkills = selectedSkills.filter(s => !bgSkills.includes(s));

    if (selectedSkills.includes(skill)) {
        selectedSkills = selectedSkills.filter(s => s !== skill);
    } else if (currentClassSkills.length < limit) {
        selectedSkills.push(skill);
    }

    updateSavesAndSkills();
}

function updateSkillLimit() {
    const classData = CLASS_DATA[document.getElementById('classSelect').value];
    const limit = classData?.skillChoices ?? 0;
    document.getElementById('skillLimit').textContent = limit;
}

/*Functions for the dice-roll page */

function getDiceRoll() {
    var amount = parseInt(document.getElementById('wuerfelAnzahl').value);
    var dice = parseInt(document.getElementById('wuerfelAuswahl').value);
    if (document.getElementById('wuerfelAuswahl').value === 1000000) {
        if (isNaN(amount) === true) {
            alert('Bitte geben sie KEINE Buchstaben ein')
            document.getElementById('wuerfelAnzahl').value = 1
            return;
        }
        if (amount === 0) {
            alert('Bitte geben Sie eine Nummer über 0 ein')
            console.log('Error: Anzahl an Würfeln darf nicht Null sein');
            return;
        }
    }
    if (document.getElementById('wuerfelAuswahl').value < 1000000) {
        if (document.getElementById('wuerfelAnzahl').value >= 1000 ) {
            alert('Bitte geben Sie eine Nummer unter 1.000 ein')
            document.getElementById('wuerfelAnzahl').value = 1
            return;
        }
        if (isNaN(amount) === true) {
            alert('Bitte geben sie KEINE Buchstaben ein')
            document.getElementById('wuerfelAnzahl').value = 1
            return;
        }
        if (amount === 0) {
            alert('Bitte geben Sie eine Nummer zwischen 1 und 999 ein')
            return;
        }
    }

    var result = 0;
    for (var i = 0; i < amount; i++) {
        result += Math.floor(Math.random() * dice) + 1;
    }
    if (result === 20) {
        document.getElementById('wuerfelOutput').value += result + '! (' + amount + 'w' + dice + '), ';
    } else if (result === 1) {
        document.getElementById('wuerfelOutput').value += result + ' :( (' + amount + 'w' + dice + '), ';
    } else {
        document.getElementById('wuerfelOutput').value += result + ' (' + amount + 'w' + dice + '), ';
    }
}

function resetDicePage() {
    document.getElementById('wuerfelAuswahl').value = 20;
    document.getElementById('wuerfelAnzahl').value = 1;
    document.getElementById('wuerfelOutput').value = ''
}

/*Random Scores, Classes, etc. */

function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomScore() {
    var scoreArray1 = { STR: 15, DEX: 14, CON: 13, INT: 12, WIS: 10, CHA: 8 };
    var scoreArray2 = { STR: 8, DEX: 15, CON: 14, INT: 13, WIS: 12, CHA: 10 };
    var scoreArray3 = { STR: 10, DEX: 8, CON: 15, INT: 14, WIS: 13, CHA: 12 };
    var scoreArray4 = { STR: 12, DEX: 10, CON: 8, INT: 15, WIS: 14, CHA: 13 };
    var scoreArray5 = { STR: 13, DEX: 12, CON: 10, INT: 8, WIS: 15, CHA: 14 };
    var scoreArray6 = { STR: 14, DEX: 13, CON: 12, INT: 10, WIS: 8, CHA: 15 };

    let number = Math.floor(Math.random() * 7)
    if (number === 1) {
        scores = scoreArray1
    } else if (number === 2){
        scores = scoreArray2
    } else if (number === 3){
        scores = scoreArray3
    } else if (number === 4){
        scores = scoreArray4
    } else if (number === 5){
        scores = scoreArray5
    } else if (number === 6){
        scores = scoreArray6
    }

    handleMainRaceChange();
    handleClassChange();
    updateDisplay();
}

function randomizeEverything() {
    const mainRaceSel = document.getElementById('mainRaceSelect');
    mainRaceSel.value = random(Object.keys(RACE_GROUPS));
    handleMainRaceChange();
    const subRaceSel = document.getElementById('subRaceSelect');
    if (subRaceSel && subRaceSel.options.length > 0) {
        subRaceSel.selectedIndex = Math.floor(Math.random() * subRaceSel.options.length);
    }
    const classSel = document.getElementById('classSelect');
    classSel.value = random(Object.keys(CLASS_DATA));
    const bgSel = document.getElementById('backgroundSelect');
    bgSel.value = random(Object.keys(HINTERGRÜNDE));
    const alSel = document.getElementById('alignmentSelect');
    alSel.value = random(Object.keys(ALIGNMENT));
    selectedSkills = [random(Object.keys(SKILLS)), random(Object.keys(SKILLS))];
    if (skillChoices.value === 3)
        selectedSkills = [random(Object.keys(SKILLS)), random(Object.keys(SKILLS)), random(Object.keys(SKILLS))]
    randomScore();
    handleMainRaceChange();
    handleClassChange();
    updateDisplay();
}

/*Change Event-Listeners to update Display*/
document.getElementById('classSelect').addEventListener('change', updateSkillLimit);
document.getElementById('mainRaceSelect').addEventListener('change', handleMainRaceChange);
document.getElementById('subRaceSelect').addEventListener('change', updateCustomRaceLogic);
document.getElementById('classSelect').addEventListener('change', handleClassChange);
document.getElementById('levelSelect').addEventListener('change', updateDisplay);
document.getElementById('backgroundSelect').addEventListener('change', updateDisplay);
document.getElementById('alignmentSelect').addEventListener('change', updateDisplay);
document.getElementById('customAttr1').addEventListener('change', updateDisplay);
document.getElementById('customAttr2').addEventListener('change', updateDisplay);
document.getElementById('resetBtn').addEventListener('click', () => {
    const mainRaceSel = document.getElementById('mainRaceSelect');
    if (!mainRaceSel) return;
    mainRaceSel.value = 'Mensch';
    const subRaceSel = document.getElementById('subRaceSelect');
    if (subRaceSel) subRaceSel.selectedIndex = 0;
    const classSel = document.getElementById('classSelect');
    if (classSel) classSel.value = 'Kämpfer';
    const levelSel = document.getElementById('levelSelect');
    if (levelSel) levelSel.value = '1';
    const bgSel = document.getElementById('backgroundSelect');
    if (bgSel) bgSel.value = 'Scharlatan (Täuschen (CHA), Fingerfertigkeit (DEX))';
    const alSel = document.getElementById('alignmentSelect');
    if (alSel) alSel.value = 'WahrhaftNeutral'
    selectedSkills = [];
    scores = { STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 };
    handleMainRaceChange();
    handleClassChange();
    updateDisplay();
});

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
    const sel1 = document.getElementById('customAttr1');
    const sel2 = document.getElementById('customAttr2');

    function syncCustomSelectors() {
        const val1 = sel1.value;
        const val2 = sel2.value;

        Array.from(sel1.options).forEach(opt => opt.disabled = false);
        Array.from(sel2.options).forEach(opt => opt.disabled = false);

        if (val1) {
            const optIn2 = Array.from(sel2.options).find(o => o.value === val1);
            if (optIn2) optIn2.disabled = true;
        }
        if (val2) {
            const optIn1 = Array.from(sel1.options).find(o => o.value === val2);
            if (optIn1) optIn1.disabled = true;
        }
    }

    sel1.addEventListener('change', () => {
        syncCustomSelectors();
        updateDisplay();
    });

    sel2.addEventListener('change', () => {
        syncCustomSelectors();
        updateDisplay();
    });
});
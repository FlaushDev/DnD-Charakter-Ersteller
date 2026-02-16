import { CLASS_DATA, SKILLS, POINT_COSTS, PROFICIENCY_BONUS, ATTRIBUTES_MAP, HINTERGRÜNDE, RACES, RACE_GROUPS, ALIGNMENT } from './data.js';
import { fillFormFull, fillFormEssential } from './pdf.js';

/*State — als Objekt damit pdf.js darauf zugreifen kann*/
export const state = {
    scores: { STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 },
    selectedSkills: []
};

/*Functions*/

/*Core Update Display*/
function updateDisplay() {
    updateAttributeTable();
    updateSavesAndSkills();
    updateSkillLimit();
    getBackgroundBonus();
    document.getElementById('pointsDisplay').textContent = `${getTotalPoints()} / 27`;
    document.getElementById('pbDisplay').textContent = `+${getPB()}`;
    document.getElementById('hpDisplay').textContent = calculateTotalHP();
    const cls = document.getElementById('classSelect').value;
    document.getElementById('hdDisplay').textContent = CLASS_DATA[cls] ? `1d${CLASS_DATA[cls].hd}` : 'k.A.';
}

/*Misc*/
function copyEmail() {
    const text = document.getElementById("E-mail").innerText;
    navigator.clipboard.writeText(text).then(() => {});
}

function dropdownMenuOpenClose() {
    if (document.getElementById('dropdownContent').classList.contains("show-dropdown") === false) {
        document.getElementById('dropdownContent').classList.add("show-dropdown");
    }
    else {
        document.getElementById('dropdownContent').classList.remove("show-dropdown");
    }
}


/*HitDice, HitPoints, ProficiencyBonus*/
function calculateTotalHP() {
    const levelVal = document.getElementById('levelSelect').value;
    const level = parseInt(levelVal) || 1;
    const classKey = document.getElementById('classSelect').value;
    const classData = CLASS_DATA[classKey];
    if (!classData) return 0;
    const conMod = calculateModifier(getAttributeTotal('CON'));
    const level1HP = classData.hd + conMod;

    if (level === 1) return Math.max(1, level1HP);

    const avgHPPerLevel = Math.floor(classData.hd / 2) + 1 + conMod;
    return level1HP + (level - 1) * avgHPPerLevel;
}

export function getPB() {
    const lvlEl = document.getElementById('levelSelect');
    const lvl = lvlEl ? parseInt(lvlEl.value) : 1;
    return PROFICIENCY_BONUS[lvl] || 2;
}

/*Background, Race, Class*/
function getBackgroundBonus(attr) {
    const bgKey = document.getElementById('backgroundSelect').value;
    return HINTERGRÜNDE[bgKey] ? (HINTERGRÜNDE[bgKey][attr] || 0) : 1;
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
        } else {
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

/*Attribute Table*/
export function getAttributeTotal(attr) { return state.scores[attr] + getRacialBonus(attr); }
export function getModifierTotal(attr) { return Math.floor((getAttributeTotal(attr) - 10) / 2); }

function updateAttributeTable() {
    const table = document.getElementById('attributesTable');
    if (!table) return;
    table.innerHTML = '';
    for (const [attr, name] of Object.entries(ATTRIBUTES_MAP)) {
        const base = state.scores[attr];
        const racial = getRacialBonus(attr);
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
                <td class="text-center">+${racial}</td>
                <td class="text-center"><strong class="total-score">${total}</strong></td>
                <td class="text-center"><span class="mod-badge">${mod >= 0 ? '+' + mod : mod}</span></td>
                <td class="text-center" style="color: #888;">${POINT_COSTS[base]} Pkt</td>
            </tr>`;
    }
}

function adjustScore(attr, delta) {
    const newValue = state.scores[attr] + delta;
    if (newValue >= 8 && newValue <= 15) {
        const costDiff = POINT_COSTS[newValue] - POINT_COSTS[state.scores[attr]];
        if (delta > 0 && (getTotalPoints() + costDiff) > 27) return;
        state.scores[attr] = newValue;
        updateDisplay();
    }
}

export function calculateModifier(score) { return Math.floor((score - 10) / 2); }
function getTotalPoints() { return Object.values(state.scores).reduce((sum, val) => sum + POINT_COSTS[val], 0); }

/*Saves and Skills*/
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
        const isSelected = state.selectedSkills.includes(skill);
        const isProf = isBgProf || isSelected;
        const val = calculateModifier(getAttributeTotal(attr)) + (isProf ? pb : 0);
        skillsList.innerHTML += `<li><input type="checkbox" onchange="handleSkillChange('${skill}')" ${isProf ? 'checked' : ''} ${isBgProf ? 'disabled' : ''}> ${skill}: ${val >= 0 ? '+' + val : val}</li>`;
    }
    getBackgroundBonus();
}

function handleSkillChange(skill) {
    const bgKey = document.getElementById('backgroundSelect').value;
    const bgSkills = HINTERGRÜNDE[bgKey]?.skills || [];

    if (bgSkills.includes(skill)) return;

    const classData = CLASS_DATA[document.getElementById('classSelect').value];
    const limit = classData?.skillChoices ?? 0;
    document.getElementById('skillLimit').textContent = limit;

    const currentClassSkills = state.selectedSkills.filter(s => !bgSkills.includes(s));

    if (state.selectedSkills.includes(skill)) {
        state.selectedSkills = state.selectedSkills.filter(s => s !== skill);
    } else if (currentClassSkills.length < limit) {
        state.selectedSkills.push(skill);
    }
    getBackgroundBonus();
    updateSavesAndSkills();
}

function updateSkillLimit() {
    const raceData = RACES[document.getElementById('mainRaceSelect').value];
    const classData = CLASS_DATA[document.getElementById('classSelect').value];
    const limit = classData?.skillChoices + raceData?.skillChoices ?? 0;
    document.getElementById('skillLimit').textContent = limit;
    getBackgroundBonus();
}

/*Dice Roll*/
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
            return;
        }
    }
    if (document.getElementById('wuerfelAuswahl').value < 1000000) {
        if (document.getElementById('wuerfelAnzahl').value >= 1000) {
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
    return;
}

function resetDicePage() {
    document.getElementById('wuerfelAuswahl').value = 20;
    document.getElementById('wuerfelAnzahl').value = 1;
    document.getElementById('wuerfelOutput').value = ''
}

/*Random*/
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
    if (number === 1) { Object.assign(state.scores, scoreArray1); }
    else if (number === 2) { Object.assign(state.scores, scoreArray2); }
    else if (number === 3) { Object.assign(state.scores, scoreArray3); }
    else if (number === 4) { Object.assign(state.scores, scoreArray4); }
    else if (number === 5) { Object.assign(state.scores, scoreArray5); }
    else if (number === 6) { Object.assign(state.scores, scoreArray6); }

    updateAttributeTable();
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
    if (bgSel.value === "") {
        bgSel.value = random(Object.keys(HINTERGRÜNDE));
        return;
    }
    const alSel = document.getElementById('alignmentSelect');
    alSel.value = random(Object.keys(ALIGNMENT));
    state.selectedSkills = [random(Object.keys(SKILLS)), random(Object.keys(SKILLS))];
    const classData = CLASS_DATA[classSel.value];
    if (classData?.skillChoices === 3)
        state.selectedSkills = [random(Object.keys(SKILLS)), random(Object.keys(SKILLS)), random(Object.keys(SKILLS))];
    randomScore();
    handleMainRaceChange();
    handleClassChange();
    updateDisplay();
}

/*Event Listeners — müssen global sein für onclick= im HTML*/
window.adjustScore = adjustScore;
window.handleSkillChange = handleSkillChange;
window.randomScore = randomScore;
window.randomizeEverything = randomizeEverything;
window.getDiceRoll = getDiceRoll;
window.resetDicePage = resetDicePage;
window.copyEmail = copyEmail;
window.fillFormFull = fillFormFull;
window.fillFormEssential = fillFormEssential;
window.dropdownMenuOpenClose = dropdownMenuOpenClose;

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
    document.getElementById('mainRaceSelect').value = 'Mensch';
    const subRaceSel = document.getElementById('subRaceSelect');
    if (subRaceSel) subRaceSel.selectedIndex = 0;
    document.getElementById('classSelect').value = 'Kämpfer';
    document.getElementById('levelSelect').value = '1';
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

    sel1.addEventListener('change', () => { syncCustomSelectors(); updateDisplay(); });
    sel2.addEventListener('change', () => { syncCustomSelectors(); updateDisplay(); });
});
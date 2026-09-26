/** charakter-logik.js
 *
 * Herzstück beider Charakter-Ersteller (2014 & 2024).
 * erstelleCharakterErsteller() ist eine kleine "Fabrik": man gibt ihr die
 * Spieldaten (aus data.js oder data2024.js) und bekommt einen fertigen
 * Ersteller zurück, der weiß, wie man Attribute berechnet, Skills verwaltet
 * und alles zufällig auswürfelt.
 */

export function erstelleCharakterErsteller(DATEN) {
    const {
        CLASS_DATA, SKILLS, POINT_COSTS, PROFICIENCY_BONUS,
        ATTRIBUTES_MAP, HINTERGRÜNDE, RACES, RACE_GROUPS, ALIGNMENT
    } = DATEN;

    // Aktueller Stand des Charakters
    const state = {
        scores: { STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 },
        selectedSkills: []
    };

    // --- Kleine Helfer ---

    function calculateModifier(score) {
        return Math.floor((score - 10) / 2);
    }

    function getTotalPoints() {
        return Object.values(state.scores).reduce((summe, wert) => summe + POINT_COSTS[wert], 0);
    }

    function getPB() {
        const lvlEl = document.getElementById('levelSelect');
        const lvl = lvlEl ? parseInt(lvlEl.value) : 1;
        return PROFICIENCY_BONUS[lvl] || 2;
    }

    function random(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // --- Volk, Klasse & Boni ---

    function getRacialBonus(attr) {
        const main = document.getElementById('mainRaceSelect').value;
        const subs = RACE_GROUPS[main] || [];
        const raceKey = subs.length > 1 ? document.getElementById('subRaceSelect').value : main;
        const race = RACES[raceKey];
        if (!race) return 0;

        if (race.custom) {
            // Menschen (Variante) & Halbelfen dürfen sich zwei Attribute selbst aussuchen
            let bonus = (raceKey === 'Halbelf' && attr === 'CHA') ? 2 : 0;
            if (document.getElementById('customAttr1').value === attr) bonus += 1;
            if (document.getElementById('customAttr2').value === attr) bonus += 1;
            return bonus;
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
        const lvl = parseInt(document.getElementById('levelSelect').value) || 1;
        const data = CLASS_DATA[cls];
        const subDiv = document.getElementById('subClassSelection');

        if (data && data.subclasses.length > 0 && lvl >= data.subLevel) {
            subDiv.style.display = 'block';
            const sel = document.getElementById('subClassSelect');
            sel.innerHTML = '';
            data.subclasses.forEach(s => sel.innerHTML += `<option value="${s}">${s}</option>`);

            // Der Hexenmeister nennt seine Subklasse "Patron" — kleine Extrawurst
            if (cls === 'Hexenmeister') {
                document.getElementById('subClassSelectLabel').textContent = 'Patron wählen:';
                document.getElementById('warlockInfoLabel').style.display = 'block';
            } else {
                document.getElementById('warlockInfoLabel').style.display = 'none';
                document.getElementById('subClassSelectLabel').textContent = 'Subklasse wählen:';
            }
        } else {
            subDiv.style.display = 'none';
            document.getElementById('warlockInfoLabel').style.display = 'none';
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

    // --- Attribute ---

    function getAttributeTotal(attr) {
        return state.scores[attr] + getRacialBonus(attr);
    }

    function getModifierTotal(attr) {
        return calculateModifier(getAttributeTotal(attr));
    }

    function updateAttributeTable() {
        const table = document.getElementById('attributesTable');
        if (!table) return;
        table.innerHTML = '';

        for (const [attr, name] of Object.entries(ATTRIBUTES_MAP)) {
            const grundwert = state.scores[attr];
            const voelkerbonus = getRacialBonus(attr);
            const gesamt = getAttributeTotal(attr);
            const mod = calculateModifier(gesamt);

            table.innerHTML += `
                <tr>
                    <td>${name}</td>
                    <td class="text-center">
                        <button class="attr-btn-minus" onclick="adjustScore('${attr}', -1)">−</button>
                        <span style="min-width: 20px; display: inline-block; font-size: 15px">${grundwert}</span>
                        <button class="attr-btn-plus" onclick="adjustScore('${attr}', 1)">+</button>
                    </td>
                    <td class="text-center">+${voelkerbonus}</td>
                    <td class="text-center"><strong class="total-score">${gesamt}</strong></td>
                    <td class="text-center"><span class="mod-badge">${mod >= 0 ? '+' + mod : mod}</span></td>
                    <td class="text-center" style="color: #888;">${POINT_COSTS[grundwert]} Pkt</td>
                </tr>`;
        }
    }

    function adjustScore(attr, delta) {
        const neuerWert = state.scores[attr] + delta;
        if (neuerWert < 8 || neuerWert > 15) return;

        const kostenDiff = POINT_COSTS[neuerWert] - POINT_COSTS[state.scores[attr]];
        if (delta > 0 && (getTotalPoints() + kostenDiff) > 27) return; // nicht mehr Punkte ausgeben als vorhanden

        state.scores[attr] = neuerWert;
        updateDisplay();
    }

    // --- Rettungswürfe & Fertigkeiten ---

    function updateSavesAndSkills() {
        const savesList = document.getElementById('savesList');
        const skillsList = document.getElementById('skillsList');
        if (!savesList || !skillsList) return;

        savesList.innerHTML = '';
        skillsList.innerHTML = '';

        const classData = CLASS_DATA[document.getElementById('classSelect').value] || { saves: [], skillChoices: 0 };
        const bgSkills = HINTERGRÜNDE[document.getElementById('backgroundSelect').value]?.skills || [];
        const pb = getPB();

        for (const [attr, name] of Object.entries(ATTRIBUTES_MAP)) {
            const isProf = classData.saves.includes(attr);
            const val = calculateModifier(getAttributeTotal(attr)) + (isProf ? pb : 0);
            savesList.innerHTML += `<li>${isProf ? '❤' : '◯'} ${name}: ${val >= 0 ? '+' + val : val}</li>`;
        }

        for (const [skill, attr] of Object.entries(SKILLS)) {
            const isBgProf = bgSkills.includes(skill);
            const isProf = isBgProf || state.selectedSkills.includes(skill);
            const val = calculateModifier(getAttributeTotal(attr)) + (isProf ? pb : 0);
            skillsList.innerHTML += `<li><input type="checkbox" onchange="handleSkillChange('${skill}')" ${isProf ? 'checked' : ''} ${isBgProf ? 'disabled' : ''}> ${skill}: ${val >= 0 ? '+' + val : val}</li>`;
        }
    }

    function handleSkillChange(skill) {
        const bgSkills = HINTERGRÜNDE[document.getElementById('backgroundSelect').value]?.skills || [];
        if (bgSkills.includes(skill)) return; // Hintergrund-Skills sind fix, die darf man nicht abwählen

        const limit = getSkillLimit();
        document.getElementById('skillLimit').textContent = limit;

        const eigeneKlassenSkills = state.selectedSkills.filter(s => !bgSkills.includes(s));

        if (state.selectedSkills.includes(skill)) {
            state.selectedSkills = state.selectedSkills.filter(s => s !== skill);
        } else if (eigeneKlassenSkills.length < limit) {
            state.selectedSkills.push(skill);
        }
        updateSavesAndSkills();
    }

    function getSkillLimit() {
        const classData = CLASS_DATA[document.getElementById('classSelect').value];
        const raceData = RACES[document.getElementById('mainRaceSelect').value];
        return (classData?.skillChoices ?? 0) + (raceData?.skillChoices ?? 0);
    }

    function updateSkillLimit() {
        document.getElementById('skillLimit').textContent = getSkillLimit();
    }

    // --- Trefferpunkte ---

    function calculateTotalHP() {
        const level = parseInt(document.getElementById('levelSelect').value) || 1;
        const classData = CLASS_DATA[document.getElementById('classSelect').value];
        if (!classData) return 0;

        const conMod = calculateModifier(getAttributeTotal('CON'));
        const hpBeiStufe1 = classData.hd + conMod;
        if (level === 1) return Math.max(1, hpBeiStufe1);

        const hpProStufeDanach = Math.floor(classData.hd / 2) + 1 + conMod;
        return hpBeiStufe1 + (level - 1) * hpProStufeDanach;
    }

    // --- Alles neu zeichnen ---

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

    // --- Zufall ---

    // Die sechs klassischen "Standard-Arrays" für den Punktekauf, nur eben
    // schon in Attribute übersetzt statt als rohe Zahlenliste.
    const ZUFALLS_ATTRIBUTSSAETZE = [
        { STR: 15, DEX: 14, CON: 13, INT: 12, WIS: 10, CHA: 8 },
        { STR: 8, DEX: 15, CON: 14, INT: 13, WIS: 12, CHA: 10 },
        { STR: 10, DEX: 8, CON: 15, INT: 14, WIS: 13, CHA: 12 },
        { STR: 12, DEX: 10, CON: 8, INT: 15, WIS: 14, CHA: 13 },
        { STR: 13, DEX: 12, CON: 10, INT: 8, WIS: 15, CHA: 14 },
        { STR: 14, DEX: 13, CON: 12, INT: 10, WIS: 8, CHA: 15 }
    ];

    function randomScore() {
        Object.assign(state.scores, random(ZUFALLS_ATTRIBUTSSAETZE));

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

        document.getElementById('backgroundSelect').value = random(Object.keys(HINTERGRÜNDE));
        document.getElementById('alignmentSelect').value = random(Object.keys(ALIGNMENT));

        const classData = CLASS_DATA[classSel.value];
        const anzahlSkills = classData?.skillChoices === 3 ? 3 : 2;
        state.selectedSkills = Array.from({ length: anzahlSkills }, () => random(Object.keys(SKILLS)));

        randomScore();
        handleMainRaceChange();
        handleClassChange();
        updateDisplay();
    }

    function alleZuruecksetzen() {
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
    }

    // --- Aufbau: Event-Listener anhängen & ersten Render anstoßen ---

    function init() {
        const lvlSelect = document.getElementById('levelSelect');
        if (!lvlSelect) return; // diese Seite hat gar keinen Charakter-Ersteller

        lvlSelect.innerHTML = '';
        for (let i = 1; i <= 20; i++) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = `Level ${i}`;
            lvlSelect.appendChild(opt);
        }

        document.getElementById('classSelect')?.addEventListener('change', updateSkillLimit);
        document.getElementById('classSelect')?.addEventListener('change', handleClassChange);
        document.getElementById('mainRaceSelect')?.addEventListener('change', handleMainRaceChange);
        document.getElementById('subRaceSelect')?.addEventListener('change', updateCustomRaceLogic);
        document.getElementById('levelSelect')?.addEventListener('change', updateDisplay);
        document.getElementById('backgroundSelect')?.addEventListener('change', updateDisplay);
        document.getElementById('alignmentSelect')?.addEventListener('change', updateDisplay);
        document.getElementById('customAttr1')?.addEventListener('change', updateDisplay);
        document.getElementById('customAttr2')?.addEventListener('change', updateDisplay);

        document.getElementById('resetBtn')?.addEventListener('click', alleZuruecksetzen);

        // Die beiden Attribut-Dropdowns bei "Custom"-Völkern (z. B. Halbelf)
        // dürfen sich nicht gegenseitig dasselbe Attribut klauen.
        const sel1 = document.getElementById('customAttr1');
        const sel2 = document.getElementById('customAttr2');
        if (sel1 && sel2) {
            const syncDropdowns = () => {
                Array.from(sel1.options).forEach(opt => opt.disabled = false);
                Array.from(sel2.options).forEach(opt => opt.disabled = false);
                const in2 = Array.from(sel2.options).find(o => o.value === sel1.value);
                if (in2) in2.disabled = true;
                const in1 = Array.from(sel1.options).find(o => o.value === sel2.value);
                if (in1) in1.disabled = true;
            };
            sel1.addEventListener('change', () => { syncDropdowns(); updateDisplay(); });
            sel2.addEventListener('change', () => { syncDropdowns(); updateDisplay(); });
        }

        handleMainRaceChange();
        handleClassChange();
        updateDisplay();
    }

    return {
        state,
        init,
        getPB,
        getAttributeTotal,
        getModifierTotal,
        calculateModifier,
        adjustScore,
        handleSkillChange,
        randomScore,
        randomizeEverything
    };
}

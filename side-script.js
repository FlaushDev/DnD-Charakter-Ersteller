/** side-script.js
 * Skript für charakter-ersteller-2024.html.
 */
import { CLASS_DATA, SKILLS, POINT_COSTS, PROFICIENCY_BONUS, ATTRIBUTES_MAP, HINTERGRÜNDE, RACES, RACE_GROUPS, ALIGNMENT } from './data2024.js';
import { erstelleCharakterErsteller } from './charakter-logik.js';
import { erstellePdfExport } from './pdf.js';

const DATEN_2024 = { CLASS_DATA, SKILLS, POINT_COSTS, PROFICIENCY_BONUS, ATTRIBUTES_MAP, HINTERGRÜNDE, RACES, RACE_GROUPS, ALIGNMENT };

const ctx = erstelleCharakterErsteller(DATEN_2024);
const { fillFormFull, fillFormEssential } = erstellePdfExport(ctx, DATEN_2024);
ctx.init();

/* --- E-Mail kopieren --- */
function copyEmail() {
    const text = document.getElementById('E-mail').innerText;
    navigator.clipboard.writeText(text).then(() => { });
}

/* --- PDF-Dropdown der 2024-Seite (eigenes Markup: #dropdownContent) --- */
function dropdownMenuOpenClose() {
    document.getElementById('dropdownContent')?.classList.toggle('show-dropdown');
}

/* --- Alles, was per onclick="..." aus dem HTML heraus aufgerufen wird --- */
window.adjustScore = ctx.adjustScore;
window.handleSkillChange = ctx.handleSkillChange;
window.randomScore = ctx.randomScore;
window.randomizeEverything = ctx.randomizeEverything;
window.copyEmail = copyEmail;
window.fillFormFull = fillFormFull;
window.fillFormEssential = fillFormEssential;
window.dropdownMenuOpenClose = dropdownMenuOpenClose;

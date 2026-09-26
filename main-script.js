/** main-script.js
 * Skript für: homepage.html, charakter-ersteller.html, wuerfel.html, impressum.html.
 */
import { CLASS_DATA, SKILLS, POINT_COSTS, PROFICIENCY_BONUS, ATTRIBUTES_MAP, HINTERGRÜNDE, RACES, RACE_GROUPS, ALIGNMENT } from './data.js';
import { erstelleCharakterErsteller } from './charakter-logik.js';
import { erstellePdfExport } from './pdf.js';

const DATEN_2014 = { CLASS_DATA, SKILLS, POINT_COSTS, PROFICIENCY_BONUS, ATTRIBUTES_MAP, HINTERGRÜNDE, RACES, RACE_GROUPS, ALIGNMENT };

const ctx = erstelleCharakterErsteller(DATEN_2014);
const { fillFormFull, fillFormEssential } = erstellePdfExport(ctx, DATEN_2014);
ctx.init();

/* --- Kleine Toast-Meldungen (Toastify) --- */
function zeigeToast(text, variante = 'teal') {
    const farben = variante === 'danger'
        ? { background: '#c24641', border: 'solid #70140f' }
        : { background: '#1a3e47', border: 'solid #0f2529' };

    Toastify({
        text,
        duration: 2500,
        gravity: 'bottom',
        position: 'right',
        close: true,
        stopOnFocus: true,
        style: { ...farben, borderRadius: '6px' }
    }).showToast();
}

/* --- E-Mail kopieren --- */
function copyEmail() {
    const text = document.getElementById('E-mail').innerText;
    navigator.clipboard.writeText(text).then(() => zeigeToast('E-Mail kopiert'));
}

/* --- PDF-Dropdown (Split-Button "PDF drucken ▾") --- */
function toggleDropdown(event) {
    event.stopPropagation();
    document.getElementById('dropdown')?.classList.toggle('show');
}

function closeDropdown() {
    document.getElementById('dropdown')?.classList.remove('show');
}

window.onclick = closeDropdown;

/* --- Würfel (wuerfel.html) --- */
function getDiceRoll() {
    const anzahlEl = document.getElementById('wuerfelAnzahl');
    const seiten = parseInt(document.getElementById('wuerfelAuswahl').value);
    const anzahl = parseInt(anzahlEl.value);

    if (isNaN(anzahl) || anzahl < 1) {
        alert('Bitte eine Zahl zwischen 1 und 999 eingeben.');
        anzahlEl.value = 1;
        return;
    }

    if (seiten !== 1000000 && anzahl > 999) {
        alert('Bitte eine Zahl zwischen 1 und 999 eingeben.');
        anzahlEl.value = 1;
        return;
    }

    let ergebnis = 0;
    for (let i = 0; i < anzahl; i++) {
        ergebnis += Math.floor(Math.random() * seiten) + 1;
    }

    // Easter Egg: nur bei einem einzelnen d20-Wurf
    let zusatz = '';
    if (anzahl === 1 && seiten === 20) {
        if (ergebnis === 20) zusatz = '!';
        if (ergebnis === 1) zusatz = ' :(';
    }

    document.getElementById('wuerfelOutput').value += `${ergebnis}${zusatz} (${anzahl}w${seiten}), `;
}

function resetDicePage() {
    document.getElementById('wuerfelAuswahl').value = 20;
    document.getElementById('wuerfelAnzahl').value = 1;
    document.getElementById('wuerfelOutput').value = '';
}

function randomizeEverything() {
    ctx.randomizeEverything();
    zeigeToast('Alles zufällig ausgewählt!');
}

document.getElementById('resetBtn')?.addEventListener('click', () => zeigeToast('Alles zurückgesetzt', 'danger'));

/* --- Alles, was per onclick="..." aus dem HTML heraus aufgerufen wird --- */
window.adjustScore = ctx.adjustScore;
window.handleSkillChange = ctx.handleSkillChange;
window.randomScore = ctx.randomScore;
window.randomizeEverything = randomizeEverything;
window.getDiceRoll = getDiceRoll;
window.resetDicePage = resetDicePage;
window.copyEmail = copyEmail;
window.fillFormFull = fillFormFull;
window.fillFormEssential = fillFormEssential;
window.toggleDropdown = toggleDropdown;
window.closeDropdown = closeDropdown;

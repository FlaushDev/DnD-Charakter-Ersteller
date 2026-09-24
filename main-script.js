/** main-script.js
 * Skript für: homepage.html, charakter-ersteller.html, wuerfel.html, impressum.html.
 *
 * Die eigentliche Charakter-Logik steckt jetzt in charakter-logik.js und wird
 * von hier nur noch mit den 2014er-Spieldaten (data.js) gefüttert. Was hier
 * übrig bleibt, sind die Sachen, die nur auf DIESEN Seiten vorkommen: der
 * Würfel, das E-Mail-kopieren mit kleiner Erfolgs-Meldung, und das Dropdown
 * beim "PDF drucken"-Button.
 */
import { CLASS_DATA, SKILLS, POINT_COSTS, PROFICIENCY_BONUS, ATTRIBUTES_MAP, HINTERGRÜNDE, RACES, RACE_GROUPS, ALIGNMENT } from './data.js';
import { erstelleCharakterErsteller } from './charakter-logik.js';
import { erstellePdfExport } from './pdf.js';

const DATEN_2014 = { CLASS_DATA, SKILLS, POINT_COSTS, PROFICIENCY_BONUS, ATTRIBUTES_MAP, HINTERGRÜNDE, RACES, RACE_GROUPS, ALIGNMENT };

const ctx = erstelleCharakterErsteller(DATEN_2014);
const { fillFormFull, fillFormEssential } = erstellePdfExport(ctx, DATEN_2014);
ctx.init();

/* --- Kleine Toast-Meldungen (Toastify) ---
 * Vorher stand derselbe Toastify-Aufruf (mit Farben, Positionierung, …)
 * drei separate Male im Code. Jetzt gibt es einen Helfer, der nur noch
 * Text + Farbvariante braucht. */
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

    // Bugfix: hier wurde vorher ".value === 1000000" verglichen — .value ist
    // bei einem <select> aber immer ein String, "1000000" === 1000000 ist
    // also NIE wahr. Der Riesenwürfel (der laut Label "die Webseite crashen"
    // könnte) bekam dadurch nie seine Sonderbehandlung und die 999er-Grenze
    // griff überall gleich. Jetzt wird "seiten" (schon als Zahl geparst)
    // verglichen, und nur der Riesenwürfel darf die Grenze sprengen.
    if (seiten !== 1000000 && anzahl > 999) {
        alert('Bitte eine Zahl zwischen 1 und 999 eingeben.');
        anzahlEl.value = 1;
        return;
    }

    let ergebnis = 0;
    for (let i = 0; i < anzahl; i++) {
        ergebnis += Math.floor(Math.random() * seiten) + 1;
    }

    // Kleines Easter Egg — aber nur bei einem einzelnen d20-Wurf, nicht wenn
    // zufällig die SUMME mehrerer Würfel auf 20 oder 1 landet.
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

/* --- Kleine Erfolgs-Meldungen für Zufall & Zurücksetzen ---
 * (nutzen die Funktionen aus charakter-logik.js, hängen aber nur hier
 * dran, weil nur diese Seite Toastify geladen hat) */
function randomizeEverything() {
    ctx.randomizeEverything();
    zeigeToast('Alles zufällig ausgewählt!');
}

document.getElementById('resetBtn')?.addEventListener('click', () => zeigeToast('Alles zurückgesetzt', 'danger'));

/* --- Alles, was per onclick="..." aus dem HTML heraus aufgerufen wird,
 * muss am window-Objekt hängen. --- */
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

/** pdf.js
 * Füllt den leeren 'charakterbogen.pdf' mit den Werten aus dem
 * Charakter-Ersteller und bietet ihn zum Download an.
 *
 * Bugfix: Diese Datei hat früher fest "import { state, getPB, ... } from
 * './main-script.js'" gemacht — auch wenn side-script.js (2024-Seite) sie
 * eingebunden hat! ES-Module laden alles, was importiert wird, das heißt
 * main-script.js (samt seiner ganzen 2014er-Logik und Event-Listenern)
 * wurde auf der 2024-Seite heimlich MIT geladen. Beide Skripte haben dann
 * auf dieselben Formularfelder gehört und doppelt reagiert — mit den
 * falschen Spieldaten im Hintergrund. Jetzt bekommt erstellePdfExport()
 * einfach übergeben, was es braucht, statt sich eine bestimmte Datei zu
 * schnappen. Sauberer und ohne versteckte Nebenwirkungen.
 */

const PDF_URL = 'charakterbogen.pdf';

export function erstellePdfExport(ctx, DATEN) {
    const { state, getPB, getAttributeTotal, getModifierTotal, calculateModifier } = ctx;
    const { CLASS_DATA, HINTERGRÜNDE, SKILLS, ATTRIBUTES_MAP } = DATEN;

    const getSelectValue = (id) => document.getElementById(id)?.value ?? '';

    function getSavesBonus(attr) {
        const classData = CLASS_DATA[getSelectValue('classSelect')] || { saves: [] };
        const istGeuebt = classData.saves.includes(attr);
        return calculateModifier(getAttributeTotal(attr)) + (istGeuebt ? getPB() : 0);
    }

    function istRettungswurfGeuebt(attr) {
        const classData = CLASS_DATA[getSelectValue('classSelect')] || { saves: [] };
        return classData.saves.includes(attr);
    }

    function istFertigkeitGeuebt(skillName) {
        const bgSkills = HINTERGRÜNDE[getSelectValue('backgroundSelect')]?.skills || [];
        return bgSkills.includes(skillName) || state.selectedSkills.includes(skillName);
    }

    async function ladePdf() {
        const { PDFDocument } = PDFLib;
        const bytes = await fetch(PDF_URL).then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(bytes);
        return { pdfDoc, form: pdfDoc.getForm() };
    }

    function fuelleGrundfelder(fields) {
        fields.level.setText(getSelectValue('levelSelect'));
        fields.class.setText(getSelectValue('classSelect'));
        fields.background.setText(getSelectValue('backgroundSelect').split('(')[0]);

        if (document.getElementById('subClassSelect').style.display !== 'none') {
            fields.subclass.setText(getSelectValue('subClassSelect'));
        }
        if (document.getElementById('subRaceSelect').style.display !== 'none') {
            fields.race.setText(getSelectValue('mainRaceSelect'));
        } else {
            fields.race.setText(getSelectValue('subRaceSelect'));
        }
    }

    function holeAlleFelder(form) {
        return {
            level: form.getTextField('Level'),
            class: form.getTextField('Class'),
            subclass: form.getTextField('Subclass'),
            race: form.getTextField('Species'),
            background: form.getTextField('Background'),
            pb: form.getTextField('PROF BONUS'),
            intMod: form.getTextField('INT MOD'),
            intScore: form.getTextField('INT SCORE'),
            intSave: form.getTextField('INT SAVE'),
            intSaveCheckbox: form.getCheckBox('Check Box25'),
            wisMod: form.getTextField('WIS MOD'),
            wisScore: form.getTextField('WIS SCORE'),
            wisSave: form.getTextField('Text Field71'),
            wisSaveCheckbox: form.getCheckBox('Check Box17'),
            conMod: form.getTextField('CON MOD'),
            conScore: form.getTextField('CON SCORE'),
            conSave: form.getTextField('CON SAVE'),
            conSaveCheckbox: form.getCheckBox('Check Box7'),
            strMod: form.getTextField('STR MOD'),
            strScore: form.getTextField('STR SCORE'),
            strSave: form.getTextField('STR SAVE'),
            strSaveCheckbox: form.getCheckBox('Check Box18'),
            chaMod: form.getTextField('CHA MOD'),
            chaScore: form.getTextField('CHA SCORE'),
            chaSave: form.getTextField('CHA SAVE'),
            chaSaveCheckbox: form.getCheckBox('Check Box6'),
            dexMod: form.getTextField('DEX MOD'),
            dexScore: form.getTextField('DEX SCORE'),
            dexSave: form.getTextField('DEX SAVE'),
            dexSaveCheckbox: form.getCheckBox('Check Box11'),
            ÜberzeugenModifier: form.getTextField('PERSUASION'),
            TäuschenModifier: form.getTextField('PERFORMANCE'),
            EinschüchternModifier: form.getTextField('INTIMIDATE'),
            AuftretenModifier: form.getTextField('DECEPTION'),
            WahrnehmungModifier: form.getTextField('SURVIVAL'),
            ÜberlebenModifier: form.getTextField('PERCEPTION'),
            MotivModifier: form.getTextField('MEDICINE'),
            TierumgangModifier: form.getTextField('INSIGHT'),
            HeilkundeModifier: form.getTextField('ANIMAL HANDLING'),
            ReligionModifier: form.getTextField('RELIGION'),
            NaturkundeModifier: form.getTextField('NATURE'),
            NachforschungModifier: form.getTextField('INVESTIGATION'),
            GeschichteModifier: form.getTextField('HISTORY'),
            ArkaneModifier: form.getTextField('ARCANA'),
            AthletikModifier: form.getTextField('ATHLETICS'),
            AkrobatikModifier: form.getTextField('ACROBATICS'),
            FingerfertigkeitModifier: form.getTextField('SLEIGHT OF HAND'),
            HeimlichkeitModifier: form.getTextField('STEALTH')
        };
    }

    function holeCheckboxen(form) {
        return {
            ÜberzeugenCheckbox: form.getCheckBox('Check Box2'),
            TäuschenCheckbox: form.getCheckBox('Check Box3'),
            EinschüchternCheckbox: form.getCheckBox('Check Box4'),
            AuftretenCheckbox: form.getCheckBox('Check Box5'),
            WahrnehmungCheckbox: form.getCheckBox('Check Box16'),
            ÜberlebenCheckbox: form.getCheckBox('Check Box14'),
            MotivCheckbox: form.getCheckBox('Check Box12'),
            TierumgangCheckbox: form.getCheckBox('Check Box13'),
            HeilkundeCheckbox: form.getCheckBox('Check Box15'),
            ReligionCheckbox: form.getCheckBox('Check Box23'),
            NaturkundeCheckbox: form.getCheckBox('Check Box22'),
            NachforschungCheckbox: form.getCheckBox('Check Box21'),
            GeschichteCheckbox: form.getCheckBox('Check Box20'),
            ArkaneCheckbox: form.getCheckBox('Check Box25'),
            AthletikCheckbox: form.getCheckBox('Check Box19'),
            AkrobatikCheckbox: form.getCheckBox('Check Box8'),
            FingerfertigkeitCheckbox: form.getCheckBox('Check Box9'),
            HeimlichkeitCheckbox: form.getCheckBox('Check Box10')
        };
    }

    function fuelleFertigkeitenUndCheckboxen(fields, checkboxen) {
        const pb = getPB();
        for (const [key, attr] of Object.entries(SKILLS)) {
            const geuebt = istFertigkeitGeuebt(key);
            const wert = calculateModifier(getAttributeTotal(attr)) + (geuebt ? pb : 0);
            const skillName = key.split(' ')[0];

            fields[`${skillName}Modifier`]?.setText(wert.toString());
            if (geuebt) checkboxen[`${skillName}Checkbox`]?.check();
        }
    }

    function zeigeDownloadHinweis() {
        Toastify({
            text: 'Download gestartet (kann kurz dauern)',
            duration: 5500,
            gravity: 'bottom',
            position: 'right',
            close: true,
            stopOnFocus: true,
            style: { background: '#1a3e47', border: 'solid #0f2529', borderRadius: '6px' }
        }).showToast();
    }

    async function fillFormFull() {
        zeigeDownloadHinweis();
        const { pdfDoc, form } = await ladePdf();
        const fields = holeAlleFelder(form);
        const checkboxen = holeCheckboxen(form);

        fuelleGrundfelder(fields);
        fields.pb.setText(getPB().toString());

        for (const attr of ['int', 'wis', 'con', 'str', 'cha', 'dex']) {
            const gross = attr.toUpperCase();
            fields[`${attr}Score`].setText(getAttributeTotal(gross).toString());
            fields[`${attr}Mod`].setText(getModifierTotal(gross).toString());
            fields[`${attr}Save`].setText(getSavesBonus(gross).toString());
        }

        for (const attr of Object.keys(ATTRIBUTES_MAP)) {
            if (istRettungswurfGeuebt(attr)) fields[`${attr.toLowerCase()}SaveCheckbox`]?.check();
        }

        fuelleFertigkeitenUndCheckboxen(fields, checkboxen);

        const pdfBytes = await pdfDoc.save();
        download(pdfBytes, 'charakterbogen.pdf', 'application/pdf');
    }

    async function fillFormEssential() {
        zeigeDownloadHinweis();
        const { pdfDoc, form } = await ladePdf();
        const fields = {
            level: form.getTextField('Level'),
            class: form.getTextField('Class'),
            subclass: form.getTextField('Subclass'),
            race: form.getTextField('Species'),
            background: form.getTextField('Background')
        };

        fuelleGrundfelder(fields);

        const pdfBytes = await pdfDoc.save();
        download(pdfBytes, 'charakterbogen.pdf', 'application/pdf');
    }

    return { fillFormFull, fillFormEssential };
}

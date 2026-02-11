// pdf.js
import { CLASS_DATA, HINTERGRÜNDE, SKILLS, ATTRIBUTES_MAP } from './data.js';
import { state, getPB, getAttributeTotal, getModifierTotal, calculateModifier } from './main-script.js';

const PDF_URL = 'https://files.catbox.moe/piedns.pdf';

const getSelectValue = (id) => document.getElementById(id)?.value ?? '';
const getConvertedString = (value) => value.toString();

function getSavesBonus(attr) {
    const cls = getSelectValue('classSelect');
    const classData = CLASS_DATA[cls] || { saves: [] };
    const isSave = classData.saves.includes(attr);
    return calculateModifier(getAttributeTotal(attr)) + (isSave ? getPB() : 0);
}

function getSavesCheckbox(attr) {
    const cls = getSelectValue('classSelect');
    return (CLASS_DATA[cls] || { saves: [] }).saves.includes(attr);
}

function getSkillProf(skillName) {
    const bgKey = getSelectValue('backgroundSelect');
    const bgSkills = HINTERGRÜNDE[bgKey]?.skills || [];
    return bgSkills.includes(skillName) || state.selectedSkills.includes(skillName);
}

async function loadPdf() {
    const { PDFDocument } = PDFLib;
    const bytes = await fetch(PDF_URL).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(bytes);
    return { pdfDoc, form: pdfDoc.getForm() };
}

function fillBasicFields(fields) {
    fields.level.setText(getSelectValue('levelSelect'));
    fields.class.setText(getSelectValue('classSelect'));
    fields.background.setText(getSelectValue('backgroundSelect').split('(')[0]);

    if (document.getElementById('subClassSelect').style.display !== 'none')
        fields.subclass.setText(getSelectValue('subClassSelect'));

    if (document.getElementById('subRaceSelect').style.display !== 'none')
        fields.race.setText(getSelectValue('mainRaceSelect'));
    else
        fields.race.setText(getSelectValue('subRaceSelect'));
}

function getFullFields(form) {
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

function getCheckboxes(form) {
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

function fillSkillsAndCheckboxes(fields, checkboxes) {
    const pb = getPB();
    for (const [key, attr] of Object.entries(SKILLS)) {
        const isProf = getSkillProf(key);
        const val = calculateModifier(getAttributeTotal(attr)) + (isProf ? pb : 0);
        const skillName = key.split(' ')[0];

        const textElement = fields[`${skillName}Modifier`];
        if (textElement) textElement.setText(getConvertedString(val));

        if (isProf) {
            const checkboxElement = checkboxes[`${skillName}Checkbox`];
            if (checkboxElement) checkboxElement.check();
        }
    }
}

export async function fillFormFull() {
    const { pdfDoc, form } = await loadPdf();
    const fields = getFullFields(form);
    const checkboxes = getCheckboxes(form);

    fillBasicFields(fields);
    fields.pb.setText(getConvertedString(getPB()));

    const ATTRIBUTE_FIELDS = ['int', 'wis', 'con', 'str', 'cha', 'dex'];
    for (const attr of ATTRIBUTE_FIELDS) {
        const up = attr.toUpperCase();
        fields[`${attr}Score`].setText(getConvertedString(getAttributeTotal(up)));
        fields[`${attr}Mod`].setText(getConvertedString(getModifierTotal(up)));
        fields[`${attr}Save`].setText(getConvertedString(getSavesBonus(up)));
    }

    for (const [attr] of Object.entries(ATTRIBUTES_MAP)) {
        if (getSavesCheckbox(attr)) fields[`${attr.toLowerCase()}SaveCheckbox`]?.check();
    }

    fillSkillsAndCheckboxes(fields, checkboxes);

    const pdfBytes = await pdfDoc.save();
    download(pdfBytes, 'piedns.pdf', 'application/pdf');
}

export async function fillFormEssential() {
    const { pdfDoc, form } = await loadPdf();
    const fields = {
        level: form.getTextField('Level'),
        class: form.getTextField('Class'),
        subclass: form.getTextField('Subclass'),
        race: form.getTextField('Species'),
        background: form.getTextField('Background')
    };
    const checkboxes = getCheckboxes(form);

    fillBasicFields(fields);
    fillSkillsAndCheckboxes(fields, checkboxes);

    const pdfBytes = await pdfDoc.save();
    download(pdfBytes, 'piedns.pdf', 'application/pdf');
}
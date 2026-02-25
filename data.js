/*Fixed Data for Class, Subclass, etc.*/
export const POINT_COSTS = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
export const PROFICIENCY_BONUS = { 1: 2, 2: 2, 3: 2, 4: 2, 5: 3, 6: 3, 7: 3, 8: 3, 9: 4, 10: 4, 11: 4, 12: 4, 13: 5, 14: 5, 15: 5, 16: 5, 17: 6, 18: 6, 19: 6, 20: 6 };
export const ATTRIBUTES_MAP = {
    STR: 'Stärke (STR)',
    DEX: 'Geschicklichkeit (DEX)',
    CON: 'Konstitution (CON)',
    INT: 'Intelligenz (INT)',
    WIS: 'Weisheit (WIS)',
    CHA: 'Charisma (CHA)'
};

export const SKILLS = {
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

export const HINTERGRÜNDE = {
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

export const CLASS_DATA = {
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

export const RACE_GROUPS = {
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

export const RACES = {
    'Mensch': { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },
    'Mensch (Variante)': { custom: 2, skillChoices: 1 },
    'Halbelf': { CHA: 2, custom: 2, skillChoices: 2 },
    'Hochelf': { DEX: 2, INT: 1, skills: ['Wahrnehmung (WIS)'] },
    'Waldelf': { DEX: 2, WIS: 1, skills: ['Wahrnehmung (WIS)'] },
    'Dunkelelfen (Drow)': { DEX: 2, CHA: 1, skills: ['Wahrnehmung (WIS)'] },
    'Berggnom': { INT: 2, CON: 2 },
    'Waldgnom': { INT: 2, DEX: 1 },
    'Tiefengnom': { INT: 2, DEX: 1 },
    'Halbork': { STR: 2, CON: 1, skills: ['Einschüchtern (CHA)'] },
    'Drachenblütiger': { STR: 2, CHA: 1 },
    'Zwerg (Hügel)': { CON: 2, WIS: 1 },
    'Zwerg (Gebirge)': { CON: 2, STR: 2 },
    'Tiefling': { INT: 1, CHA: 2 },
    'Halbling (Leichtfuß)': { DEX: 2, CHA: 1 },
    'Halbling (Stämmig)': { DEX: 2, CON: 1 }
};

export const ALIGNMENT = {
    'RechtschaffenGut': {},
    'RechtschaffenNeutral': {},
    'RechtschaffenBöse': {},
    'NeutralGut': {},
    'WahrhaftNeutral': {},
    'NeutralBöse': {},
    'ChaotischGut': {},
    'ChaotischNeutral': {},
    'ChaotischBöse': {}
}
import fs from 'fs';

const content = fs.readFileSync('./content_extracted.txt', 'utf8');
const lines = content.split('\n');

const personalityTypes = [];
const dichotomies = [];
const groupInfo = [];
const faq = [];
const glossary = [];
let aboutContent = { mission: "", history: "", determination: "", scientific: "" };

let currentType = null;
let currentSection = null;
let currentDichotomy = null;
let currentGroup = null;

const typeNames = [
    "INTJ", "INTP", "ENTJ", "ENTP",
    "INFJ", "INFP", "ENFJ", "ENFP",
    "ISTJ", "ISFJ", "ESTJ", "ESFJ",
    "ISTP", "ISFP", "ESTP", "ESFP"
];

lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // About Page Section
    if (trimmed === "Our Mission") { currentSection = "mission"; return; }
    if (trimmed === "The History of the 16 Personalities") { currentSection = "history"; return; }
    if (trimmed === "How Personality Type is Determined") { currentSection = "determination"; return; }
    if (trimmed === "Scientific Validity and Criticism") { currentSection = "scientific"; return; }
    if (trimmed === "THE FOUR DICHOTOMIES — DETAILED EXPLANATION") { currentSection = "dichotomies"; return; }
    if (trimmed === "COGNITIVE FUNCTIONS — COMPLETE GUIDE") { currentSection = "functions_guide"; return; }
    if (trimmed === "FREQUENTLY ASKED QUESTIONS (FAQ)") { currentSection = "faq"; return; }
    if (trimmed === "GLOSSARY OF KEY TERMS") { currentSection = "glossary"; return; }

    // Type Detection
    const typeMatch = typeNames.find(t => trimmed.startsWith(`${t} —`));
    if (typeMatch) {
        if (currentType) personalityTypes.push(currentType);
        currentType = {
            id: typeMatch.toLowerCase(),
            code: typeMatch,
            nickname: trimmed.split('—')[1].trim(),
            strengths: [],
            weaknesses: [],
            careers: [],
            famousPeople: [],
            tips: []
        };
        currentSection = "type_detail";
        return;
    }

    if (currentSection === "mission") aboutContent.mission += trimmed + " ";
    if (currentSection === "history") aboutContent.history += trimmed + " ";
    if (currentSection === "determination") aboutContent.determination += trimmed + " ";
    if (currentSection === "scientific") aboutContent.scientific += trimmed + " ";

    if (currentSection === "dichotomies") {
        if (trimmed.startsWith("DIMENSION")) {
            if (currentDichotomy) dichotomies.push(currentDichotomy);
            currentDichotomy = { title: trimmed, content: "", traits: [] };
            return;
        }
        if (currentDichotomy) currentDichotomy.content += trimmed + " ";
    }

    if (currentSection === "faq") {
        if (trimmed.endsWith("?")) {
            faq.push({ question: trimmed, answer: "" });
            return;
        }
        if (faq.length > 0) faq[faq.length - 1].answer += trimmed + " ";
    }

    if (currentSection === "type_detail" && currentType) {
        if (trimmed === "Overview") { currentType.currentSub = "overview"; return; }
        if (trimmed === "Core Strengths") { currentType.currentSub = "strengths"; return; }
        if (trimmed === "Common Weaknesses") { currentType.currentSub = "weaknesses"; return; }
        if (trimmed === "Relationships & Compatibility") { currentType.currentSub = "relationships"; return; }
        if (trimmed === "Career Paths") { currentType.currentSub = "careers"; return; }
        if (trimmed === "Work Style") { currentType.currentSub = "workStyle"; return; }
        if (trimmed.startsWith("Famous ${person.code}s")) { currentType.currentSub = "famousPeople"; return; }
        if (trimmed === "Growth & Development") { currentType.currentSub = "growth"; return; }
        if (trimmed.startsWith("Quick Tips for Relating to")) { currentType.currentSub = "tips"; return; }
        if (trimmed === "Group") { currentType.currentSub = "group"; return; }
        if (trimmed === "Rarity") { currentType.currentSub = "rarity"; return; }
        if (trimmed === "Cognitive Functions") { currentType.currentSub = "functions"; return; }

        if (currentType.currentSub === "overview") currentType.overview = (currentType.overview || "") + trimmed + " ";
        if (currentType.currentSub === "relationships") currentType.relationships = (currentType.relationships || "") + trimmed + " ";
        if (currentType.currentSub === "workStyle") currentType.workStyle = (currentType.workStyle || "") + trimmed + " ";
        if (currentType.currentSub === "growth") currentType.growth = (currentType.growth || "") + trimmed + " ";
        if (currentType.currentSub === "strengths") currentType.strengths.push(trimmed);
        if (currentType.currentSub === "weaknesses") currentType.weaknesses.push(trimmed);
        if (currentType.currentSub === "tips") currentType.tips.push(trimmed);
        
        if (currentType.currentSub === "careers") {
            if (trimmed.includes("career choices include:")) {
                const parts = trimmed.split("choices include:");
                if (parts[1]) currentType.careers = parts[1].split(",").map(s => s.trim().replace(".", ""));
            }
        }
        if (currentType.currentSub === "famousPeople" && trimmed.includes("believed to be")) {
            const parts = trimmed.split("types:");
            if (parts[1]) currentType.famousPeople = parts[1].split(",").map(s => s.trim().replace(".", ""));
        }
        if (currentType.currentSub === "group") currentType.group = trimmed;
        if (currentType.currentSub === "rarity") currentType.rarity = trimmed;
        if (currentType.currentSub === "functions") currentType.functions = trimmed;
    }
});

if (currentType) personalityTypes.push(currentType);
if (currentDichotomy) dichotomies.push(currentDichotomy);

const groupMap = {
    "Analysts": ["INTJ", "INTP", "ENTJ", "ENTP"],
    "Diplomats": ["INFJ", "INFP", "ENFJ", "ENFP"],
    "Sentinels": ["ISTJ", "ISFJ", "ESTJ", "ESFJ"],
    "Explorers": ["ISTP", "ISFP", "ESTP", "ESFP"]
};

const data = "export const aboutContent = " + JSON.stringify(aboutContent, null, 2) + ";\n" +
             "export const dichotomies = " + JSON.stringify(dichotomies, null, 2) + ";\n" +
             "export const faq = " + JSON.stringify(faq, null, 2) + ";\n" +
             "export const personalityTypes = " + JSON.stringify(personalityTypes, null, 2) + ";\n" +
             "export const groupMap = " + JSON.stringify(groupMap, null, 2) + ";\n";

fs.writeFileSync('./src/data/personalityData.js', data);
console.log("personalityData.js updated with full content.");

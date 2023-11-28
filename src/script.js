import { parse } from "./markdown.js";

const content = document.getElementById("content");

const optionHome = document.getElementById("btn-option-home");
const optionNotes = document.getElementById("btn-option-notes");
const optionAuthor = document.getElementById("btn-option-author");

async function fetchContent(path) {
    try {
        const response = await fetch(path);
        const html = parse(await response.text());
        return html;
    } catch (error) {
        console.error("Error fetching:", error);
        throw error;
    }
}

window.loadContent = async function (name) {
    content.innerHTML = await fetchContent(`../content/${name}.md`);

    if (name == "home")
        selectOption(optionHome);
    else if (name == "notes")
        selectOption(optionNotes);
    else if (name == "author")
        selectOption(optionAuthor);
    else
        selectOption(undefined);
};

function selectOption(option) {
    optionHome.className = "";
    optionNotes.className = "";
    optionAuthor.className = "";

    if (option != undefined)
        option.className = "selected";
}

optionHome.addEventListener("click", async () => {
    await loadContent("home");
});

optionNotes.addEventListener("click", async () => {
    await loadContent("notes");
});

optionAuthor.addEventListener("click", async () => {
    await loadContent("author");
})

document.addEventListener("DOMContentLoaded", async () => {
    await loadContent("home");
});
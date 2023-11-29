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

async function listdir(directory) {
    const parser = new DOMParser();

    const response = await fetch(directory);
    const html = await response.text();
    const doc = parser.parseFromString(html, "text/html");
    
    const files = [];
    
    doc.querySelectorAll("body>div>ul>li>a").forEach((element) => {
        files.push(element.title);
    });

    files.shift();

    return files;
}

async function loadNotes() {
    try {
        const contentElement = document.getElementById("content");
        contentElement.innerHTML = "<h1>Notes</h1>";

        async function link(directory, parent) {
            const dirName = directory.split("/").filter(Boolean).pop();

            const ulElement = document.createElement("ul");
            ulElement.style.paddingLeft = "20px";
            ulElement.style.marginBottom = "15px";

            const h2Element = document.createElement("h2");
            h2Element.textContent = dirName;
            h2Element.style.marginTop = "15px";
            h2Element.style.marginBottom = "15px";
        
            parent.appendChild(h2Element);
            parent.appendChild(ulElement);
        
            const files = await listdir(directory);
        
            for (const file of files) {
                if (file.endsWith(".md")) {
                    const liElement = document.createElement("li");
                    const aElement = document.createElement("a");
                    aElement.textContent = file.slice(0, -3);
                    aElement.onclick = () => loadContent(`${directory.slice(10)}/${file.slice(0, -3)}`);
                    liElement.appendChild(aElement);
                    ulElement.appendChild(liElement);
                } 
                else if (file.split(".").length <= 1) {
                    await link(`${directory}/${file}`, ulElement);
                }
            }
        }

        await link("./content", content);
    } catch (error) {
        console.error("Error loading notes:", error);
        document.getElementById("content").innerHTML = "<h1>Error Loading Notes</h1>";
    }
}

window.loadContent = async function (name) {
    if (name == "notes")
        await loadNotes()
    else
        content.innerHTML = await fetchContent(`./content/${name}.md`);

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
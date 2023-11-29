let BLOCK = "block";
let INLINE = "inline";

let parseMap = [
    {
        pattern: /(#{1,6})([^\n]+)/g,
        replace: "<h$L1>$2</h$L1>",
        type: BLOCK,
    },
    {
        pattern: /\n(?!<\/?\w+>|\s?\*|\s?[0-9]+|>|\&gt;|-{5,})([^\n]+)/g,
        replace: "<p>$1</p>",
        type: BLOCK,
    },
    {
        pattern: /\n(?:&gt;|\>)\W*(.*)/g,
        replace: "<blockquote><p>$1</p></blockquote>",
        type: BLOCK,
    },
    {
        pattern: /\n\s?\*\s*(.*)/g,
        replace: "<ul>\n\t<li>$1</li>\n</ul>",
        type: BLOCK,
    },
    {
        pattern: /\n\s?[0-9]+\.\s*(.*)/g,
        replace: "<ol>\n\t<li>$1</li>\n</ol>",
        type: BLOCK,
    },
    {
        pattern: /(\*\*|__)(.*?)\1/g,
        replace: "<strong>$2</strong>",
        type: INLINE,
    },
    {
        pattern: /(\*|_)(.*?)\1/g,
        replace: "<em>$2</em>",
        type: INLINE,
    },
    {
        pattern: /([^!])\[([^\[]+)\]\(([^\)]+)\)/g,
        replace: "$1<a href=\"$3\">$2</a>",
        type: INLINE,
    },
    {
        pattern: /!\[([^\[]+)\]\(([^\)]+)\)/g,
        replace: "<img src=\"$2\" alt=\"$1\" />",
        type: INLINE,
    },
    {
        pattern: /\~\~(.*?)\~\~/g,
        replace: "<del>$1</del>",
        type: INLINE,
    },
    {
        pattern: /`(.*?)`/g,
        replace: "<code>$1</code>",
        type: INLINE,
    },
    {
        pattern: /\n-{5,}\n/g,
        replace: "<hr />",
        type: BLOCK,
    },
];

function parse(string) {
    let output = "\n" + string + "\n";

    output = output.replace(/\[([^\[]+)\]\(([^)]+)\.md\)/g, '<a onclick="loadContent(\'$2\')">$1</a>');

    parseMap.forEach(function (p) {
        output = output.replace(p.pattern, function () {
            return replace.call(this, arguments, p.replace, p.type);
        });
    });

    output = clean(output);
    output = output.trim();
    output = output.replace(/[\n]{1,}/g, "\n");
    return output;
}

function replace(matchList, replacement, type) {
    for (let i in matchList) {
        if (!matchList.hasOwnProperty(i)) {
            continue;
        }

        replacement = replacement.split("$" + i).join(matchList[i]);
        replacement = replacement.split("$L" + i).join(matchList[i].length);
    }

    if (type === BLOCK) {
        replacement = replacement.trim() + "\n";
    }

    return replacement;
}

function clean(string) {
    let cleaningRuleArray = [
        {
            match: /<\/([uo]l)>\s*<\1>/g,
            replacement: "",
        },
        {
            match: /(<\/\w+>)<\/(blockquote)>\s*<\2>/g,
            replacement: "$1",
        },
    ];

    cleaningRuleArray.forEach(function (rule) {
        string = string.replace(rule.match, rule.replacement);
    });

    return string;
}

export { parse };
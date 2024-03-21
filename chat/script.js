
const socket = new WebSocket('ws://localhost:3001/ws');
const main = document.querySelector('main');
const footer = document.querySelector('footer');
const channel = location.hash.slice(1);

let name = null;
while (!name) {
    name = prompt('이름을 입력해주세요');
}

document.querySelector('input').addEventListener('input', e => {
    EMOJIS = fetch('/emojis/emojis.json');
    input = e.target.value;
    e.target.value = e.target.value.replaceAll(" ", " ");

    input = input.replaceAll("<", "&lt;");
    input = input.replaceAll(">", "&gt;");
    input = input.replaceAll("\\(", "&#40;")
    input = input.replaceAll("\\)", "&#41;");
    input = input.replaceAll("'", "&#x27;");

    const emojiRegex = /:[a-zA-Z0-9_]+:/g;

    const matchedEmojis = input.match(emojiRegex);

    if (matchedEmojis) {
        EMOJIS.then(async emojis => {
            emojis = await emojis.json();
            matchedEmojis.forEach((emoji) => {
                const emojiName = emoji.slice(1, -1);
                const emojiUrl = emojis[emojiName];

                    
                res = e.target.value.replace(/:([a-zA-Z0-9_]+):/g, (match, emojiName) => {
                    const emojiUrl = emojis[emojiName];
                    if (emojiUrl) {
                        return `<p>:${emojiName}:</p>`;
                    } else {
                        return match;
                    }
                });
                footer.innerHTML = res;
            });
        });
    } else {
        footer.innerHTML = input;
    }
});

function getEmoji() {
}

socket.addEventListener('open', function (event) {
    socket.send(JSON.stringify({ type: "join", name: name, channel: channel }));
});

socket.addEventListener('message', function (event) {
    msg = event.data;

    msg = msg.replaceAll("<", "&lt;");
    msg = msg.replaceAll(">", "&gt;");
    msg = msg.replaceAll("\\(", "&#40;")
    msg = msg.replaceAll("\\)", "&#41;");
    msg = msg.replaceAll("'", "&#x27;");
    let date = JSON.parse(msg);
    if (date.type == "messageSend") {

        EMOJIS = fetch('/emojis/emojis.json');
        input = date.content;

        input = input.replaceAll("<", "&lt;");
        input = input.replaceAll(">", "&gt;");
        input = input.replaceAll("\\(", "&#40;")
        input = input.replaceAll("\\)", "&#41;");
        input = input.replaceAll("'", "&#x27;");
        const emojiRegex = /:[a-zA-Z0-9_]+:/g;

        const matchedEmojis = input.match(emojiRegex);
        let res = date.content;


        if (matchedEmojis) {

            EMOJIS.then(async emojis => {
                var emojis = await emojis.json();
                matchedEmojis.forEach(emoji => {
                    const emojiName = emoji.slice(1, -1);
                    const emojiUrl = emojis[emojiName];

                    res = res.replace(/:([a-zA-Z0-9_]+):/g, (match, emojiName) => {
                        const emojiUrl = emojis[emojiName];
                        if (emojiUrl) {
                            return `<img src="/emojis/${emojiUrl}" alt="${emojiName}" class="emoji"/>`;
                        } else {
                            return match;
                        }
                    });
                });

                main.innerHTML = `
                <article>
                    <section>${date.name}</section>
                    <section>${res}</section>
                </article>
                ${main.innerHTML}
                `;
            });
        } else {

            main.innerHTML = `
        <article>
            <section>${date.name}</section>
            <section>${input}</section>
        </article>
        ${main.innerHTML}
        `;
        }
    }

    if (date.type == "join") {

        main.innerHTML = `
        <article class="join">
            <b>${date.name}</b> 이(가) 들어옴 
        </article>
        ${main.innerHTML}

        `;
    }

    if (date.type == "exit" && channel == date.channel) {
        main.innerHTML = `
        <article class="exit">
            <b>${date.name}</b> 이(가) 나감
        </article>
        ${main.innerHTML}
        `;
    }
});
document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();
    if (e.target[0].value == "/emojis") {
        EMOJIS = fetch('/emojis/emojis.json');
        EMOJIS.then(async emojis => {
            emojis = await emojis.json();
            res = '<section>:stone:과 같은 식으로 사용하시면 됩니다.</section>';
            for (emoji in emojis) {
                res += `<section><img src="/emojis/${emojis[emoji]}" alt="${emoji}" class="emoji"/>${emoji} </section>`;
            }

            main.innerHTML = `
            <article class="cmd">
                ${res}
            </article>
            ${main.innerHTML}
            `;
        });
    }else {
        socket.send(JSON.stringify({
            type: "messageSend",
            id: Date.now(),
            name: name,
            content: e.target[0].value,
            channel: channel
        }));
    }
    e.target[0].value = '';
    footer.innerHTML = '';
})
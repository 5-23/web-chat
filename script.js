
const socket = new WebSocket('ws://localhost:3001/ws');
const main = document.querySelector('main');
const footer = document.querySelector('footer');

let name = null;
// while (!name) {
//     name = prompt('name')
// }

document.querySelector('input').addEventListener('input', e => {
    EMOJIS = fetch('emojis/emojis.json');
    const input = e.target.value;
    const emojiRegex = /:[a-zA-Z0-9_]+:/g;

    const matchedEmojis = input.match(emojiRegex);

    if (matchedEmojis) {
        matchedEmojis.forEach((emoji) => {
            const emojiName = emoji.slice(1, -1);
            EMOJIS.then(async emojis => {
                emojis = await emojis.json();
                const emojiUrl = emojis[emojiName];
                if (emojiUrl) {
                    const imgTag = `<p>:${emojiName}:</p>`;
                    res = e.target.value.replace(emoji, imgTag);
                    footer.innerHTML = res;
                }
            });
        });
    }else {
        footer.innerHTML = input;
    }
});

function getEmoji() {
}

socket.addEventListener('open', function (event) {
    socket.send(JSON.stringify({type: "join", name: name}));
});

socket.addEventListener('message', function (event) {
    let date = JSON.parse(event.data);
    if (date.type == "messageSend") {

        EMOJIS = fetch('emojis/emojis.json');
        const input = date.content;
        const emojiRegex = /:[a-zA-Z0-9_]+:/g;

        const matchedEmojis = input.match(emojiRegex);
        let res = "";


        if (matchedEmojis) {
            matchedEmojis.forEach((emoji) => {
                const emojiName = emoji.slice(1, -1);
                EMOJIS.then(async emojis => {
                    emojis = await emojis.json();
                    const emojiUrl = emojis[emojiName];
                    if (emojiUrl) {
                        const imgTag = `<img src="./emojis/${emojiUrl}" alt=":${emojiName}:" class="emoji"/>`;
                        res = date.content.replace(emoji, imgTag);
                        
                        main.innerHTML = `
                        <article>
                            <section>${date.name}</section>
                            <section>${res}</section>
                        </article>
                        ${main.innerHTML}
                        `;
                    }
                });
            });
        }else {
            
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

    if (date.type == "exit") {
        main.innerHTML = `
        <article class="exit">
            <b>${date.name}</b> 이(가) 나감
        </article>
        ${main.innerHTML}

        `;
    }
});
document.querySelector('form').addEventListener('submit', function(e){
    e.preventDefault();
    socket.send(JSON.stringify({
        type: "messageSend",
        id: Date.now(),
        name: name,
        content: e.target[0].value
    }));
    e.target[0].value = '';
    footer.innerHTML = '';
})
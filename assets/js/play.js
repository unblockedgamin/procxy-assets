const typeToCore = {
    "n64": ["parallel_n64", ".n64"] //core, file extnesion
}

function sendHeightToParent() {
    const height = document.body.scrollHeight;
    window.parent.postMessage({type: 'setHeight', height: height}, '*'); // Replace '*' with the specific origin if possible
}

window.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver(() => {
        console.log("mutation")
        sendHeightToParent()
    });
    observer.observe(document.body, { 
        childList: true,      // Observe direct children added/removed
        subtree: true,        // Observe all descendants
        attributes: true,     // Observe attribute changes
        characterData: true,  // Observe changes to text content
    });
})

window.addEventListener('load', async function () {
    sendHeightToParent()

    const observer = new MutationObserver(() => {
        sendHeightToParent()
    });
    observer.observe(document.body, { childList: true, subtree: true });

    let params = (new URL(document.location)).searchParams;
    const g = params.get('g')
    const type = params.get('type') || 'html5'
    //this.document.querySelector('#help').href = `reportissue.html/?type=gamebroken?game=${params.get('game')}`
    let jsonURL = "./glist.json"
    if (type === "emulator") {
        jsonURL = "./roms.json"
    }
    let data = await fetch(jsonURL)
        .then((res) => {
        return res.json();
    })
    let game = data[g];

    if (game.note) {
        this.document.querySelector('#note').innerText = game.note
    } else {
        this.document.querySelector('#note').remove()
    }

    gameframe = document.querySelector('#game-frame')

    this.document.querySelector('#play').innerText = `play ${g}`
    if (game.desc) {
        this.document.querySelector('#desc p').innerText = game.desc
    } else if (game.credit) {
        this.document.querySelector('#desc p').innerText = `All credit goes to ${game.credit} for ${g}. We do not intend to copy or claim ${g} as our own. We are just rehosting the game so more people could play!`
        if (game.website) {
            this.document.querySelector('#desc p').innerText += ` You can play ${g} on the original website: ${game.website}`
        }
    } else {
        //this.document.querySelector('#desc').remove();
        this.document.querySelector('#desc p').innerText = game["card-desc"]
    }
    gameText = g.replaceAll(' ', '-')
    if (type == 'emulator') {
        const coreData = typeToCore[game.type]
        const rom = `${g.replaceAll(' ', '-')}${coreData[1]}`
        
        this.document.querySelector('#back').href = "emulator.html"
        gameframe.src = `./emulator/index.html?rom=${rom}&core=${coreData[0]}`
    } else {
        gameframe.src = `./g/${game.url || gameText}/index.html`
    }

    fullscreenBtn = this.document.querySelector('#fullscreen')
    popoutBtn = this.document.querySelector('#popout')
    document.body.addEventListener('click', function(e) {
        if (fullscreenBtn.matches(':hover')) {
            gameframe.requestFullscreen();
            gameframe.contentWindow.focus();
        }
        else if (popoutBtn.matches(':hover')) {
            window.open(gameframe.src).focus();
        }
    }, true); 

    window.addEventListener('resize', function(e) {
        if(screen.width === window.innerWidth && screen.height === window.innerHeight) {
            e.preventDefault()
            gameframe.requestFullscreen();
        }
    })

    this.document.addEventListener('keydown', function (e) {
        if (e.key == "F2") {
            console.log('test')
        }
    });

    sendHeightToParent()
})
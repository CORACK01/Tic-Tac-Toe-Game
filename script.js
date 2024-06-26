let cpu
let player
let winner
let counter = 0
let volume = 0
let winState = [
    [1, 2, 3],
    [1, 4, 7],
    [1, 5, 9],
    [2, 5, 8],
    [3, 5, 7],
    [3, 6, 9],
    [4, 5, 6],
    [7, 8, 9]
]
let cross = { name: 'cross', list: [] },
    circle = { name: 'circle', list: [] }

function toggleVolume(element) {
    if (element.value == "true") {
        element.querySelector('img').src = "assets/volumeOFF.svg"
        element.value = "false"
        volume = 0
    } else {
        element.value = "true"
        element.querySelector('img').src = "assets/volumeON.svg"
        volume = .08
        music = new Audio("music/keydown.wav")
        music.volume = volume*5
        music.play()
    }
}

function turnCounter(counter, element, tag) {
    if (counter % 2 == 0) {
        element.querySelector("img").src = `assets/cross${tag}.svg`
        if (!!element.dataset.index) { cross.list = [parseInt(element.dataset.index)] + cross.list }
    } else {
        element.querySelector("img").src = `assets/circle${tag}.svg`
        if (!!element.dataset.index) { circle.list = [parseInt(element.dataset.index)] + circle.list }
    }
}

function playTurn(element) {
    if (element.dataset.attempt == "false" && !winner) {
        stroke = new Audio("music/keydown.wav")
        stroke.volume = volume*5
        stroke.play()
        turnCounter(counter, element, '')
        counter++
        turnCounter(counter, document.querySelector('.turnDisplay'), "Tag")
        element.dataset.attempt = "true"
        gameState(cross)
        gameState(circle)

        if (Array.from(document.querySelectorAll('.action')).filter(item => item.dataset.attempt == "false").length == 0 && !winner) {
            document.querySelector('.resultScreen').querySelector('p').innerText = ''
            document.querySelector('.resultScreen').querySelector('img').src = "assets/logo.svg"
            document.querySelector('.resultScreen').querySelector('span').innerText = `TIE`
            music = new Audio("music/tie.wav")
            music.volume = volume
            music.play()
            document.querySelector('.resultScreen').showModal()
            document.querySelector('.resultScreen').animate([{ transform: 'translateY(200%)' }, { transform: 'translateY(0%)' }], { duration: 500, fill: "forwards" })

        }

        try {
            if (cpu) {
                element.animate([{ transform: 'translateY(6px)' }, { transform: 'translateY(0px)' }], { duration: 300 })
                setTimeout(() => { cpuScript(cpu) }, 300)
            }
        } catch (error) { }

    }
}

function gameState(object) {
    try {
        (winState.filter(element => element.filter(value => object.list.includes(value)).length == 3))[0].forEach(element => {
            document.querySelector(`[data-index="${element}"]`)
            document.querySelector(`[data-index="${element}"]`).querySelector('img').src = `assets/${object.name}Win.svg`
            document.querySelector(`[data-index="${element}"]`).classList.remove('basicDark')
            document.querySelector(`[data-index="${element}"]`).classList.add(object.name)
        })
        document.querySelectorAll('.action').forEach(item => item.disabled = true)
        counter++
        turnCounter(counter, document.querySelector('.turnDisplay'), "Tag")
        turnCounter(counter, document.querySelector('.resultScreen'), "Tag")


        if (!cpu) {
            winner = object.name
            music = new Audio("music/win.wav")
            music.volume = volume
            music.play()
        } else {
            if (player == object.name) {
                winner = "YOU"
                music = new Audio("music/win.wav")
                music.volume = volume
                music.play()
            } else {
                winner = "CPU"
                music = new Audio("music/lose.wav")
                music.volume = volume
                music.play()
            }
        }
        document.querySelector('.resultScreen').querySelector('p').innerText = `${(winner).toUpperCase()} WIN`
        document.querySelector('.turnDisplay').querySelector('span').innerText = "WIN"
        document.querySelector('.resultScreen').showModal()
        document.querySelector('.resultScreen').animate([{ transform: 'translateY(200%)' }, { transform: 'translateY(0%)' }], { duration: 500, fill: "forwards" })
    } catch (error) { }
}

function restart(params) {
    switch (params) {
        case "forwards":
            music = new Audio("music/restart.wav")
            music.volume = volume
            music.play()
            document.querySelector('.restartScreen').showModal()
            document.querySelector('.restartScreen').animate([{ transform: 'translateY(200%)' }, { transform: 'translateY(0%)' }], { duration: 500, fill: "forwards" })
            break;

        case "backwards":
            document.querySelector('.restartScreen').animate([{ transform: 'translateY(0%)' }, { transform: 'translateY(200%)' }], { duration: 500 })
            setTimeout(() => { document.querySelector('.restartScreen').close(); cpuScript(cpu) }, 400)
            cleanPlayGround()

            break;

        case "cancel":
            document.querySelector('.restartScreen').animate([{ transform: 'translateY(0%)' }, { transform: 'translateY(200%)' }], { duration: 500 })
            setTimeout(() => { document.querySelector('.restartScreen').close() }, 400)
            break;

        default:
            break;
    }
}

function select(params) {
    document.querySelectorAll('.option').forEach(item => {
        item.dataset.select = "false"
        if (!item.querySelector('img').src.includes('Tag')) {
            item.querySelector('img').src = item.querySelector('img').src.replace('.svg', 'Tag.svg')
        }
    })
    params.dataset.select = "true"
    params.querySelector('img').src = params.querySelector('img').src.replace('Tag', '')
}

function selectOPP(params) {
    if (params.dataset.choice == "cpu") {
        document.querySelectorAll('.option').forEach(item => {
            if (item.dataset.select == "true") {
                player = item.dataset.type
            } else {
                cpu = item.dataset.type
            }
        })

    } else {
        cpu = null
    }
    document.querySelector('.homeScreen').animate([{ transform: 'translateY(0%)', opacity: 1 }, { transform: 'translateY(200%)', opacity: 0 }], { duration: 600 })
    setTimeout(() => { document.querySelector('.homeScreen').style.display = "none"; cpuScript(cpu) }, 500)

}

function winAction(params) {
    switch (params.innerText) {
        case "QUIT":
            cpu = null
            document.querySelector('.homeScreen').style.display = "grid"
            document.querySelector('.resultScreen').animate([{ transform: 'translateY(0%)' }, { transform: 'translateY(200%)' }], { duration: 500 })
            setTimeout(() => { document.querySelector('.resultScreen').close() }, 400)
            cleanPlayGround()
            break;
        case "NEXT ROUND":
            document.querySelector('.resultScreen').animate([{ transform: 'translateY(0%)' }, { transform: 'translateY(200%)' }], { duration: 500 })
            cleanPlayGround()
            setTimeout(() => { document.querySelector('.resultScreen').close(); cpuScript(cpu) }, 400)

            break;

        default:
            break;
    }
}

function home() {
    cpu = null
    cleanPlayGround()
    document.querySelector('.homeScreen').style.display = "grid"
    document.querySelector('.homeScreen').animate([{ transform: 'translateY(200%)', opacity: 0 }, { transform: 'translateY(0%)', opacity: 1 }], { duration: 600 })
}

function cleanPlayGround() {
    document.querySelectorAll('.action').forEach(item => {
        item.setAttribute("class", "action basicDark")
        item.disabled = false
        item.dataset.attempt = "false"
        item.querySelector("img").src = "assets/empty.svg"
        cross.list = []
        circle.list = []
    })
    document.querySelector('.resultScreen').querySelector('img').style.display = "block"
    document.querySelector('.resultScreen').querySelector('span').innerText = `TAKES THE ROUND`
    counter = 0
    turnCounter(counter, document.querySelector('.turnDisplay'), "Tag")
    document.querySelector('.turnDisplay').querySelector('span').innerText = "TURN"
    winner = null
}

function cpuScript(mark) {
    let leftSpaces = Array.from(document.querySelectorAll('.action')).filter(item => item.dataset.attempt == "false")
    if (mark == cross.name && counter % 2 == 0) {
        try {
            playTurn(selectRandom(
                leftSpaces.filter(item => Array.from(new Set((winState.filter(element => element.filter(value => circle.list.includes(value)).length == 2)).reduce((first, second) => first.concat(second)))).includes(parseInt(item.dataset.index)) && item.dataset.attempt == "false")
            ))
        } catch (error) {
            playTurn(selectRandom(leftSpaces))
        }
    } else if (mark == circle.name && counter % 2 != 0) {
        try {
            playTurn(selectRandom(
                leftSpaces.filter(item => Array.from(new Set((winState.filter(element => element.filter(value => cross.list.includes(value)).length == 2)).reduce((first, second) => first.concat(second)))).includes(parseInt(item.dataset.index)) && item.dataset.attempt == "false")
            ))
        } catch (error) {
            playTurn(selectRandom(leftSpaces))
        }
    }
}

function selectRandom(array) {
    return array[Math.floor(Math.random() * array.length)]
}
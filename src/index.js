const container = document.querySelector("#main-container")
const gameMenu = document.querySelector("#game-menu")
const gameList = document.querySelector("#game-list")
const gameDesc = document.querySelector("#game-desc")

const gameScores = document.querySelector("#game-scores")

const paragraphEle = document.querySelector("#paragraph")
const spanEle = document.querySelector("#current-letter")
const typeButton = document.querySelector("#type-btn")
const newGameButton = document.querySelector("#new-game-button")
const myBar = document.querySelector("#my-bar")
const scoreLi = document.querySelector("#score")
const wpmLi = document.querySelector("#wpm")

const scoreCard = document.querySelector("#score-card")
const scoreForm = document.querySelector("#score-form")

let score = 0
let wpm
let paragraph
let game
let timer



initialLoad()

function initialLoad() {
    gameList.innerHTML = ""
    gameMenu.className = "show-me"
    fetch("http://localhost:3000/games")
        .then(res => res.json())
        .then(gameArray => {
            gameArray.forEach(game => {
                createGameButton(game)
            })
        })
}

function countDown() {
    document.querySelector("#my-progress").className = "show-me"
    let width = 100;
    timer = setInterval( () =>{
        if (width === 0) {
            // clearInterval(timer) is put inside gameFinish now
            // which will also clear if the game ends before timer is up
            gameFinish()
        } else {
            width--
            myBar.style.width = width + '%'
        }
    }, 599)
    //599 is 60 seconds is 1 minute

}

function createGameButton(game) {
    let li = document.createElement("li")
    li.className = "game"
    li.innerText = game.name
    li.dataset.description = game.description
    li.dataset.id = game.id
    gameList.append(li)
}

function loadGame(game) {
    switch (game) {
        case 1:
            setUp(); break;
        case 2:
            //nothing yet
        default:
            setUp(); break;
    }
}

function setUp() {
    addScore(0, true)
    container.className = "show-me"
    typeButton.classList.add("type-off")
    typeButton.classList.remove("hide-me")
    setParagraph()
}

function addScore(num, reset) {
    if (reset) { score = 0 }
    score += num
    scoreLi.innerText = `Score: ${score}`
    wpm = (score / 5) / 1
    wpmLi.innerText = `Words per minute: ${wpm}`
}

function checkKey(keyEvent) {
    let key
    if (keyEvent.key === " ") {
        keyEvent.preventDefault()
        key = "_"
    } else {
        key = keyEvent.key
    }
    let currentLetter = spanEle.innerText
    if (key === currentLetter) {
        correctKey()
        addScore(1)
    } else {
        addScore(-1)
    }
}

function correctKey() {
    if (!paragraph[0]) { gameFinish(); return }
    paragraph[0] === " " ? spanEle.innerText = "_" : spanEle.innerText = paragraph[0]
    paragraph = paragraph.substr(1)
    paragraphEle.innerText = paragraph
}

function setParagraph() {
    fetch("https://baconipsum.com/api/?type=meat-and-filler")
        .then(res => res.json())
        .then(paragraphArray => {
            //Let's join the paragraphs
            paragraph = paragraphArray.join(" ")

            spanEle.innerText = paragraph[0]
            paragraph = paragraph.substr(1)

            paragraphEle.innerText = paragraph
        })
}

function gameFinish() {
    clearInterval(timer)
    container.className = "hide-me"
    scoreCard.className = "show-me"
    document.querySelector("#my-progress").className = "hide-me"
    scoreCard.querySelector("#score-text").innerText = `Final score is..\n correct keys: ${score}\nwords per minute: ${wpm}`
}

function submitScore(username) {
    scoreCard.className = "hide-me"
    let scoreData = {
        game_id: game,
        player_name: username,
        wpm: wpm
    }
    let fetchData = {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(scoreData)
    }
    fetch("http://localhost:3000/scores", fetchData)
        .then(res => res.json())
        .then(scoreObj => {
            //need to do something with the score
        })
    initialLoad()
}

function slapScores(scores) {
    scores.forEach(score => {
        let li = document.createElement("li")
        let button = document.createElement("button")
        button.className = "delete-score-button"
        button.innerText = "🧨"
        button.dataset.id = score.id
        li.innerText = `${score.player_name} | ${score.wpm}`
        li.append(button)
        gameScores.append(li)
    })
}

// event listerns
typeButton.addEventListener("click", () => {
    countDown()
    typeButton.classList.remove("type-off")
    typeButton.classList.add("hide-me")
})

scoreForm.addEventListener("submit", (evt) => {
    evt.preventDefault()
    let usernameField = evt.target.username
    let username = usernameField.value
    if (!username) { 
        scoreCard.querySelector("#score-text").innerText += "\n\n You must put in a name to submit a score."
        return;
    }
    submitScore(username)
})

newGameButton.addEventListener("click", (evt) => {
    scoreCard.className = "hide-me"
    initialLoad()
})

document.addEventListener("keypress", (evt) => {
    if (typeButton.classList.contains("type-off")) { return }
    checkKey(evt)
})

gameScores.addEventListener("click", (evt) => {
    let scoreId = evt.target.dataset.id
    if (evt.target.className === "delete-score-button") {
        fetch(`http://localhost:3000/scores/${scoreId}`, {
            method: "DELETE"
        })
            .then( () => {
                evt.target.parentElement.remove()
            })
    }
})

gameList.addEventListener("mouseover", (evt) => {
    let gameChosen = evt.target
    let gameId = parseInt(gameChosen.dataset.id)
    gameScores.innerHTML = ""
    if (gameChosen.className === "game") {
        gameDesc.innerHTML = gameChosen.dataset.description
    }
    fetch("http://localhost:3000/scores")
        .then( res => res.json())
        .then( scoreArray => {
            let unsortedScores = scoreArray.filter( score=> {
                score.game_id === gameId
                return score
            })
            let sortedScores = unsortedScores.sort((a, b) => b.wpm - a.wpm)
            sortedScores = sortedScores.slice(0, 5)
            slapScores(sortedScores)
        })

})



gameList.addEventListener("click", (evt) => {
    let gameChosen = evt.target
    if (gameChosen.className === "game") {
        gameMenu.className = "hide-me"
        game = parseInt(gameChosen.dataset.id)
        loadGame(game)
    }
})



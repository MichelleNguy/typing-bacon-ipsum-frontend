const container = document.querySelector("#main-container")
const gameMenu = document.querySelector("#game-menu")
const gameList = document.querySelector("#game-list")
// const gameDesc = document.querySelector("#game-desc")
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
    timer = setInterval(() => {
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
    let scoresBtn = addDisplayScores(game.id)
    let description = document.createElement("h2")
    description.id = "game-desc"
    li.className = "game"
    li.innerText = game.name
    li.dataset.description = game.description
    li.dataset.id = game.id
    li.append(scoresBtn)
    li.append(description)
    gameList.append(li)
}

function addDisplayScores(gameId) {
    const displayScores = document.createElement("button")
    displayScores.dataset.id = gameId
    displayScores.id = `scoresBtn${gameId}`
    displayScores.classList = "scoresBtn"
    displayScores.classList.add("hide-me")
    displayScores.innerText = "Top Scores"
    return displayScores
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
    console.log(keyEvent.key)
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

gameList.addEventListener("mouseover", (evt) => {
    let gameChoosen = evt.target
    console.log(gameChoosen)
    if (gameChoosen.className === "game") {
        gameChoosen.childNodes[2].innerHTML = gameChoosen.dataset.description
        document.querySelector("#scoresBtn" + gameChoosen.dataset.id).classList.remove("hide-me")
    }
})

gameList.addEventListener("click", (evt) => {
    let gameChosen = evt.target
    let tableExist = document.querySelector("#scoreTable")
    console.log(gameChosen.className)
    if (gameChosen.className === "game") {
        gameMenu.className = "hide-me"
        game = gameChosen.dataset.id
        loadGame(game)
    } else if (gameChosen.className === "scoresBtn" && tableExist === null) {
        gameId = gameChosen.dataset.id
        let newName = "ScoreTable"
        fetchScore(gameId, gameChosen.parentNode, newName)
    } else if (gameChosen.className === "deleteBtn" && tableExist !== null) {
        let sId = gameChosen.dataset.sid
        let gId = gameChosen.dataset.gid
        deleteScore(sId)
    }
})



const fetchScore = (gameId, li) => {
    return fetch("http://localhost:3000/scores")
        .then(res => res.json())
        .then(scoreArray => sortScore(scoreArray, gameId, li))
}

function deleteScore(sId) {
    fetch(`http://localhost:3000/scores/${sId}`, {
        method: "DELETE"
    })
}

const sortScore = (scoreArr, gameId, li) => {
    let gameScores = scoreArr.filter(score => score.game_id)
    let sortedScores = gameScores.sort((a, b) => b.wpm - a.wpm)
    displayTopScore(sortedScores, li)
}

function displayTopScore(scores, li) {
    let scoreHolder = document.createElement("table")
    scoreHolder.id = "scoreTable"
    let cap = document.createElement("caption")
    cap.innerText = "Top 5 Player"
    let thTr = document.createElement("tr")
    let thNum = document.createElement("th")
    let thBtn = document.createElement("th")
    let thName = document.createElement("th")
    thName.innerText = "Name"
    let thWpm = document.createElement("th")
    thWpm.innerText = "WPM"
    thTr.append(thNum, thName, thWpm, thBtn)
    scoreHolder.append(cap, thTr)

    scores.forEach((score, i) => {
        if (i <= 4) {
            let deleteBtn = addDeleteBtn(score.id, score.game_id, i)
            let row = document.createElement("tr")
            row.dataset.id = score.id
            let td1 = document.createElement("td")
            td1.innerText = i + 1
            let td2 = document.createElement("td")
            td2.innerText = score.player_name
            let td3 = document.createElement("td")
            td3.innerText = score.wpm
            row.append(td1, td2, td3, deleteBtn)
            scoreHolder.append(row)
        }
    })
    li.append(scoreHolder)
}

function addDeleteBtn(sId, gId, row) {
    let btn = document.createElement("button")
    btn.dataset.sid = sId
    btn.dataset.gid = gId
    btn.dataset.row = row
    btn.classList.add("deleteBtn")
    btn.innerText = "🧨"
    return btn
}



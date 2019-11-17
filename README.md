## Typing Bacon Ipsum

Typing Bacon Ipsum is a typing game that test a player's speed and accuracy. A player's final scored is calculated in WPM. 

The name is insprired by the API where randomly selected text is seeded.

This repo will work independently without the backend as JSON server is used for testing and follows REST conventions.

The backend can be found in the following link:

https://github.com/Jmendoza173/TypingBaconIpsum-Backend

### Demo

![gif of typing backon ipsum game](./src/public/bacon-gif.gif)

#### video below:
[![Demo video of typing bacon ipsum](https://img.youtube.com/vi/SXFo7Kj8nB8/0.jpg)](https://www.youtube.com/watch?v=SXFo7Kj8nB8 "typing bacon ipsum demo")

### Screenshots

![screenshot of Typing Bacon Ipsum web app, showcasing home page where a player can select a game and see high scores](./src/public/screenshot_1.png?raw=true "Home")

![screenshot of Typing Bacon Ipsum web app, showcasing the game page in action](./src/public/screenshot_2.png?raw=true "game")

![screenshot of Typing Bacon Ipsum web app, showcasing the score card](./src/public/screenshot_3.png?raw=true "score card")

## Installation

1. Clone the repo and CD inside the directory
2. Once there, start up JSON server with this command in your terminal

    ```json-server --watch db.json```

3. Copy the path of ```index.html``` and open your favorite web browser, then paste into the navigation bar

4. Tada!

## Tutorial

1. Select a typing game you'd like to play from the list on the homepage

    note: there is currently only one game
2. Once a game has loaded, click the 'start typing' button and begin typing!
3. A countdown/timer bar will start counting down.

You have 1 minute to type as many words as possible. Some things to note:

1. Make sure to type the letter exactly as you see it, i.e if it is capitalized, make sure you input it as a capital letter!
2. An underscore or _ is kept in place of a space
3. The current letter that should be typed will be in red.
4. Once the letter is typed, it will disappear from the paragraph

### Tech

1. Vanilla JavaScript
2. Vanilla CSS

### API

The Bacon Ipsum JSON API is a REST interface for generating meaty lorem ipsum text and can be used by any application. Pass in the following parameters using an HTTPS GET and we’ll return a JSON string array of paragraphs.

https://baconipsum.com/json-api/
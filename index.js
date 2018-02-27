// Configs
require("dotenv").config();
const keys = require("./keys.js");
const word = require("./Word.js");
const inquirer = require('inquirer');
const ui = new inquirer.ui.BottomBar();
const chalkPipe = require('chalk-pipe');
// ChalkPipe Settings
const main = chalkPipe('blue.bold');
const error = chalkPipe('bgRed.#cccccc');
const warning = chalkPipe('red.bold');
const success = chalkPipe('green.bold');
// Global Variables
var lettersGuessed = [];
var letterGuessed;
var lives = 10;
var newWord;
// Exit Game
function exitGame(){
    inquirer.prompt([
        {
            type: "input",
            message: "Play Again? (Y/N):",
            name: "playAgain"
        }
    ]).then(function(inquirerResponse){
        if(inquirerResponse.playAgain.toUpperCase() === "Y"){
            setWord();
        }
    })
}
// Prompt User
function prompt(){
    inquirer.prompt([
        {
            type: "input",
            message: "Guess a Letter:",
            name: "guessLetter"
        }
    ]).then(function(inquirerResponse){
        letterGuessed = inquirerResponse.guessLetter
        var duplicateLetter = false;
        var invalidCharacter = false;
        var regex = /^[a-zA-Z]+$/;
        if(!letterGuessed.match(regex) || letterGuessed.length > 1){
            invalidCharacter = true;
        }
        for(var i = 0; i < lettersGuessed.length; i++){
            if(letterGuessed === lettersGuessed[i]){
                duplicateLetter = true;
            }
        }
        if(duplicateLetter === true){
            ui.log.write(main("You entered a duplicate letter! Please try again."));
            letterGuessed = undefined;
            play();
        }
        else if(invalidCharacter === true){
            ui.log.write(main("You entered an invalid character! Please try again."));
            letterGuessed = undefined;
            play();
        }
        else{
            lettersGuessed.push(letterGuessed);
            newWord.getWord(letterGuessed.toUpperCase());
            if(lives > 1){
                var winner = true;
                for(var i = 0; i < newWord.letters.length; i++){
                    if(newWord.letters[i] === "_ "){
                        winner = false;
                    }
                }
                if(winner === true){
                    ui.log.write(main("Word: " + newWord.word));
                    ui.log.write(success("You Win!"));
                    exitGame();
                }
                else{
                    play();
                }                
            }
            else{
                ui.log.write(error("The correct answer was " + newWord.word));
                exitGame();
            }
        }
    })
}
// Start Game
function play(){
    var displayWord = newWord.letters.join();
    displayWord = "Word: " + displayWord.replace(/,/g, "");
    if(letterGuessed !== undefined){
        if(newWord.correctAnswer === false){
            lives--;
            ui.log.write(error("INCORRECT!"));
            ui.log.write(warning("Remaining Guesses: " + lives));
        }
        else{
            ui.log.write(success("CORRECT!"));
        }
    }
    ui.log.write(main(displayWord));
    prompt();
}
// Set Word
function setWord(){
    var request = require('request');
    var apiKey = keys.randomWord.api_key;
    var url = "http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=" + apiKey;
    request(url,function(error,response,body){
        var pullWord = JSON.parse(body);
        pullWord = pullWord.word.trim().toUpperCase();
        //console.log(pullWord);
        newWord = new word(pullWord);
        newWord.getWord("");
        lives = 10;
        letterGuessed = undefined;
        lettersGuessed = [];
        play();
    });
}
// Begin
setWord();
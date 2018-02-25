// Global
var letter = require("./Letter.js");
var word = function(word){
    this.word = word,
    this.letters = [],
    this.correctAnswer = false;
    this.getWord = function(guess){
        this.correctAnswer = false;
        for(var i = 0; i < this.word.length; i++){
            var newLetter = new letter(guess,this.word[i]);
            var letterDisplay = newLetter.getCharacter(guess,this.word[i]);
            var isCorrect = newLetter.isCorrectAnswer(guess);
            if(isCorrect){
                this.correctAnswer = true;
            }
            if(guess !== ""){
                if(letterDisplay !== undefined){
                    this.letters.splice(i,1,letterDisplay);
                }  
            }
            else{
                this.letters.push(letterDisplay);
            }
        }      
    }
};
module.exports = word;
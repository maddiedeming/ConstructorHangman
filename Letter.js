// Global
var letter = function letter(guess,letter){
    this.guess = guess,
    this.letter = letter,
    this.correct = false,
    this.getCharacter = function(guess){
        if(guess != ""){
            if(guess === this.letter){
                this.correct = true;
                return this.letter;
            }      
        }
        else{
            return "_ ";
        }
    },
    this.isCorrectAnswer = function(guess){
        if(guess != ""){
            return this.correct;
        }
    }
};
module.exports = letter;
//The comments above these blocks of code will inform you of what will happen if they're commented out or delete them

//document.addEventListener("DOMContentLoaded", function () { ... });: (Code Starts at line 3)
//This event listener ensures that the JavaScript code inside it only runs when the HTML document has been fully loaded and parsed. It waits for the
//DOMContentLoaded event to trigger before executing the code.
document.addEventListener("DOMContentLoaded", function () {

    //let cards = document.querySelectorAll(".game-card");: (Code Starts at line 8)
    //It selects all elements with the class "game-card" and stores them in the cards variable as a NodeList.
    let cards = document.querySelectorAll(".game-card");

    //Variable Declarations: (Code Starts at line 12)
    //let numCards = cards.length; stores the number of cards on the game board.
    //let card1 = null; and let card2 = null; keeps track of the two cards that are currently being compared.
    //let cardsFlipped = 0; tracks the number of cards that have been successfully matched.
    //let currentScore = 0; holds the player's current score.
    //let lowScore = localStorage.getItem("low-score"); retrieves the player's lowest score from local storage (if available).
    //let start = document.getElementById("start"); selects the "start" ID (start button for the game).
    let numCards = cards.length;
    let card1 = null;
    let card2 = null;
    let cardsFlipped = 0;
    let currentScore = 0;
    let lowScore = localStorage.getItem("low-score");
    let start = document.getElementById("start");

    //Setting the Best Score: (Code Starts at line 27)
    //Here is an if statement such as "if (lowScore) {document.getElementById("best-score").innerText = lowScore;}"
    //If there is a lowest score stored in lowScore, it updates the HTML element with the ID "best-score" to display this value.
    if (lowScore) {
        document.getElementById("best-score").innerText = lowScore;
    }

    //Adding Event Listeners: (Code Starts at line 34)
    //A for of loop is created for a click event listener that is added to each card element (each card under the let cards variable) in the cards
    //NodeList. When a card is clicked, it calls the event handler handleCardClick function. Then a variable is made for the start button and it is
    //selected with the getElementById. An event listener is added to the "start-button" ID. When this button is clicked, it triggers the startGame
    //function.
    for (let card of cards) {
        card.addEventListener("click", handleCardClick);
    }
    let startBtn = document.getElementById("start-button");
    startBtn.addEventListener("click", startGame);

    //function handleCardClick(e) { ... }: (Code Starts at line 45)
    //This function handles the logic when a card is clicked. Then an This is done with an if statement such as 
    //"if (!e.target.classList.contains("front")) return;." is used and it first checks if the clicked element has the class "front." If not, it 
    //returns early because the click is not on a card front. Another if statement in regards to If card1 or(||) card2 is null(meaning no cards are
    //currently being compared), it increments the score, adds the "flipped" class to the clicked card, and assigns it to card1 or card2. If both 
    //card1 and card2 are assigned, it compares the GIFs on the front of these cards. If they match, then the cards are removed from further clicks
    //and set back to null. If they don't match, a timeout is used to flip the cards back face-down. If all cards are flipped(cardsFlipped equals 
    //numCards), it triggers the endGame function.

    function handleCardClick(e) {
        if (!e.target.classList.contains("front")) return;

        let currentCard = e.target.parentElement;

        if (!card1 || !card2) {
            if (!currentCard.classList.contains("flipped")) {
                setScore(currentScore + 1);
            }
            currentCard.classList.add("flipped");
            card1 = card1 || currentCard;
            card2 = currentCard === card1 ? null : currentCard;
        }

        if (card1 && card2) {
            let gif1 = card1.children[1].children[0].src;
            let gif2 = card2.children[1].children[0].src;

            if (gif1 === gif2) {
                cardsFlipped += 2;
                card1.removeEventListener("click", handleCardClick);
                card2.removeEventListener("click", handleCardClick);
                card1 = null;
                card2 = null;
            } else {
                setTimeout(function () {
                    card1.classList.remove("flipped");
                    card2.classList.remove("flipped");
                    card1 = null;
                    card2 = null;
                }, 1000);
            }
        }

        if (cardsFlipped === numCards) endGame();
    }

    //function startGame() { ... }: (Code Starts at line 94)
    //This function resets the game to its initial state. It sets the current score to 0, adds the "playing" class to the "start" element, and 
    //shuffles then assigns GIFs to the cards.
    function startGame() {
        setScore(0);
        start.classList.add("playing");
        let indices = [];
        for (let i of Array(Math.floor(numCards / 2)).keys()) {
            indices.push((i + 1).toString());
        }

        let pairs = shuffle(indices.concat(indices));
        let cardIndex = 0;
        for (let card of cards) {
            let path = "gifs/" + pairs[cardIndex] + ".gif";
            card.children[1].children[0].src = path;
            cardIndex++;
        }
    }

    // function shuffle(array) { ... }: (Code Starts at line 113)
    //This function shuffles an array by creating a copy of it and swapping elements randomly. It returns the shuffled array.
    function shuffle(array) {
        let arrayCopy = array.slice();
        for (let idx1 of array(arrayCopy.length - 1).keys()) {
            // generate a random index between 0 and idx1 (inclusive)
            let idx2 = Math.floor(Math.random() * (idx1 + 1));
            // swap elements at idx1 and idx2
            let temp = arrayCopy[idx1];
            arrayCopy[idx1] = arrayCopy[idx2];
            arrayCopy[idx2] = temp;
        }
        return arrayCopy;
    }

    //function setScore(newScore) { ... }: (Code Starts at line 128)
    //This function updates the current score displayed in the HTML.
    function setScore(newScore) {
        currentScore = newScore;
        document.getElementById("current-score").innerText = currentScore;
    }

    //function endGame() { ... }: (Code Starts at line 136)
    //This function handles the end of the game. It updates the end alert screen with the player's score and checks if it's a new best score, which
    //updates the localStorage accordingly.
    function endGame() {
        let end = document.getElementById("end");
        let scoreHeader = end.children[1];
        scoreHeader.innerText = "Your score: " + currentScore;
        let lowScore = +localStorage.getItem("low-score") || Infinity;
        if (currentScore < lowScore) {
            scoreHeader.innerText += " - NEW BEST SCORE!!";
            localStorage.setItem("low-score", currentScore);
        }
        document.getElementById("end").classList.add("game-over");
    }
});

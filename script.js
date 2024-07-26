// Utils
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// Global state
var active_answer = ""
var score = 0;
var total_answers = 0;
var active_database = {};

// Start application
async function startApplication() {
    fetch("./japanese.json")
        .then((response) => response.json())
        .then((json) => active_database = json)
        .then(() => {
            // Update UI
            showRandomQuestion();
            updateScore();
        });
}

var submit_button = document.getElementById("submit_button");
submit_button.addEventListener("click", function (event) {
    var text_submit = document.getElementById("text_submit");
    const obj = JSON.parse(text_submit.value);

    event.preventDefault();
});

var next_button = document.getElementById("next_button");
next_button.addEventListener("click", function (event) {
    showRandomQuestion();
});

// Reset button
var reset_streak_button = document.getElementById("reset_streak_button");
reset_streak_button.addEventListener("click", function (event) {
    score = 0;
    total_answers = 0;

    updateScore();
});

// Get hint button
var get_hint_button = document.getElementById("get_hint_button");
get_hint_button.addEventListener("click", function (event) {
    console.log("Todo !");
});

function showRandomQuestion() {
    let words = active_database["collections"]["numbers"]["words"];
    var random_word = words[getRandomInt(words.length)]

    var card_variants = document.getElementsByClassName("card_variant");
    let variant_count = card_variants.length;

    var card_question = document.getElementById("card_question");
    card_question.innerHTML = "What is right word for '" + random_word["word"] + "' ?";

    let variants = []

    variants.push(random_word["variants"][0]);
    active_answer = random_word["variants"][0];

    for(let i = 0; i < variant_count - 1; ++i) {
        var thing = words[getRandomInt(words.length)]["variants"][0];
        variants.push(thing);
    }

    shuffleArray(variants);

    for(let i = 0; i < variants.length; ++i)
        card_variants[i].innerHTML = variants[i]; 
}

function updateScore() {
    var card_streak = document.getElementById("card_streak");
    card_streak.innerHTML = "Streak " + score + "/" + total_answers + " " + (100 * score / (total_answers + 1)).toFixed(1) + "%";
}

// Card variants
var card_variants = document.getElementsByClassName("card_variant");
for(var variant of card_variants) {
    variant.addEventListener("click", function (event) {
        let variant_text = event.target.innerHTML;

        // Right answer
        if(active_answer === variant_text) {

            showRandomQuestion();
            ++score;
        } else { // Wrong answer

        }

        ++total_answers;
        
        updateScore();
    });
}

startApplication()

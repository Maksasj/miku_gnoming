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
var active_database = {
    "collections": {
        "animals": {
            "description": "This is a animal collection",
            "appearance": "yellow",
            "words" : [
                { "frog": "カエル" },
                { "lion": "ライオン" },
                { "panda": "パンダ"},
                { "octopus": "タコ"}
            ]
        },
        "numbers": {
            "description": "This is a numbers collection",
            "appearance": "blue",
            "words" : [
                { 
                    "word": "one",
                    "variants": [ "いち" ] 
                },
                { 
                    "word": "two",
                    "variants": [ "に" ] 
                },
                { 
                    "word": "three",
                    "variants": [ "さん" ] 
                },
                { 
                    "word": "four",
                    "variants": [ "し" ] 
                },
                { 
                    "word": "five",
                    "variants": [ "ご" ] 
                },
                { 
                    "word": "six",
                    "variants": [ "ろく" ] 
                },
                { 
                    "word": "seven",
                    "variants": [ "しち" ] 
                },
                { 
                    "word": "eight",
                    "variants": [ "はち" ] 
                },
                {   
                    "word": "nine",
                    "variants": [ "きゅう" ] 
                },
                { 
                    "word": "ten",
                    "variants": [ "じゅう" ] 
                },
                {   
                    "word": "eleven",
                    "variants": [ "じゅういち" ] 
                },
                { 
                    "word": "twelve",
                    "variants": [ "じゅうに" ] 
                },
                { 
                    "word": "twenty",
                    "variants": [ "にじゅう" ] 
                },
                { 
                    "word": "twenty one",
                    "variants": [ "にじゅうに" ]
                },
                { 
                    "word": "thirty",
                    "variants": [ "さんじゅう" ] 
                },
                { 
                    "word": "forty",
                    "variants": [ "しじゅう" ] 
                },
                { 
                    "word": "one hundred",
                    "variants": [ "ひゃく" ] 
                }
            ]
        }
    }
};

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

showRandomQuestion();

function updateScore() {
    var card_streak = document.getElementById("card_streak");
    card_streak.innerHTML = "Streak " + score + "/" + total_answers + " " + (100 * score / (total_answers + 1)).toFixed(1) + "%";
}

updateScore();

// Card variants
var card_variants = document.getElementsByClassName("card_variant");
console.log(card_variants);
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
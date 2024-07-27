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
var active_collection = 0;
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
            updateCollectionSelect();
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

// Next button
var next_button = document.getElementById("next_button");
next_button.addEventListener("click", function (event) {
    showRandomQuestion();
});

var apply_collection_button = document.getElementById("apply_collection_button");
apply_collection_button.addEventListener("click", function (event) {
    var element = document.getElementById("collection_select");

    // Lets set active collection
    active_collection = element.value;

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

function resetQuestions() {
    var elements = document.getElementsByClassName("card_variant");

    for(var element of elements) {
        element.setAttribute('id', '');
    }
}

function updateCollectionSelect() {
    var element = document.getElementById("collection_select");
    let collections = active_database["collections"];

    for(let i = 0; i < collections.length; ++i) {
        let collection = collections[i];
        let collection_name = collection["name"];

        element.innerHTML += "<option value='" + i + "'>" + collection_name + "</option>";
    }
}

function showRandomQuestion() {
    // Before showing random question, lets reset old
    resetQuestions();

    // First we get selected collection
    let collection = active_database["collections"][active_collection];

    // Next we extract random study case
    let cases =  collection["cases"];
    let study_case = cases[getRandomInt(cases.length)];
    let study_case_value_length = study_case["value"].length;

    // Third we get questioned word and answer word
    let question = study_case["value"][0][0];
    active_answer = study_case["value"][1][0];
    let answers = [ active_answer ];

    // We get max variant count
    var html_variants = document.getElementsByClassName("card_variant");
    let variant_count = html_variants.length;

    // Next lets get other random variants
    for(let i = 0; i < variant_count - 1; ++i) {
        let wrong_study_case = cases[getRandomInt(cases.length)];
        let wrong_answer = wrong_study_case["value"][1];
        answers.push(wrong_answer);
    }

    // Shuffle array
    shuffleArray(answers);

    // There we save everything into html
    var html_question = document.getElementById("card_question");
    html_question.innerHTML = "What is right word for '" + question + "' ?";

    for(let i = 0; i < answers.length; ++i)
        html_variants[i].innerHTML = answers[i]; 
}

function updateScore() {
    var card_streak = document.getElementById("card_streak");

    var numenator = 100 * score;
    var denominator = total_answers;
    var percent = 0;

    if(denominator !== 0)
        percent = numenator / denominator;

    card_streak.innerHTML = "Streak " + score + "/" + total_answers + " " + percent.toFixed(1) + "%";
}

// Card match
var card_match = document.getElementsByClassName("card_variant");
for(var variant of card_match) {
    variant.addEventListener("click", function (event) {
        let element = event.target;
        let variant_text = element.innerHTML;

        // Right answer
        if(active_answer === variant_text) {

            showRandomQuestion();
            ++score;
        } else { // Wrong answer
            element.setAttribute('id', 'wrong_card_variant');
        }

        ++total_answers;
        
        updateScore();
    });
}

startApplication()

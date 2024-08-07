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
            
            // Update quiz game
            showRandomQuestion();
            updateScore();

            // Typing game
            startStopwatch();
            showRandomTyping();

            // Update card game
            showRandomCard();
        });
}

var html_database_load = document.getElementById("database_load");
html_database_load.addEventListener("click", function (event) {
    var text_submit = document.getElementById("text_submit");
    const obj = JSON.parse(text_submit.value);

    event.preventDefault();
});

// Next button
var quiz_next_button = document.getElementById("quiz_next_button");
quiz_next_button.addEventListener("click", function (event) {
    showRandomQuestion();
});

var html_collection_select = document.getElementById("collection_select");
html_collection_select.addEventListener("change", function (event) {
    // Lets set active collection
    active_collection = html_collection_select.value;

    showRandomQuestion();
    showRandomCard();
    showRandomTyping();
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
    var elements = document.getElementsByClassName("quiz_variant");

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

function getCollectionByName(collection_name) {
    var collections = active_database["collections"]; 
    var count = collections.length;

    for(let i = 0; i < count; ++i) {
        var collecion = collections[i];

        if(collecion["name"] == collection_name)
            return collecion;
    }

    return null;
}

function pullStudyCases(collection) {
    let cases = [];

    if(collection["cases"] !== undefined && collection["cases"] !== null)
        cases = collection["cases"];

    if(collection["include"] !== undefined && collection["include"] !== null) {
        var includes = collection["include"];
        var include_count = includes.length;

        for(let i = 0; i < include_count; ++i) {
            var included_collection = includes[i];

            cases.push(...pullStudyCases(getCollectionByName(included_collection)));
        }
    }

    return cases;
}

function showRandomQuestion() {
    // Before showing random question, lets reset old
    resetQuestions();

    // First we get selected collection
    let collection = active_database["collections"][active_collection];

    // Lets pull all study cases
    let cases = pullStudyCases(collection); 

    // Next we extract random study case
    let study_case = cases[getRandomInt(cases.length)];

    // Third we get questioned word and answer word
    let question = study_case["value"][0][0];
    active_answer = study_case["value"][1][0];
    let answers = [ active_answer ];

    // We get max variant count
    var html_variants = document.getElementsByClassName("quiz_variant");
    let variant_count = html_variants.length;

    // Next lets get other random variants
    for(let i = 0; i < variant_count - 1; ++i) {
        let wrong_study_case = cases[getRandomInt(cases.length)];
        let possible_wrong_answers = wrong_study_case["value"][1];

        let wrong_answer = possible_wrong_answers[getRandomInt(possible_wrong_answers.length)];
        answers.push(wrong_answer);
    }

    // Shuffle array
    shuffleArray(answers);

    // There we save everything into html
    var html_question = document.getElementById("quiz_question");
    html_question.innerHTML = "What is right word for '" + question + "' ?";

    for(let i = 0; i < answers.length; ++i)
        html_variants[i].innerHTML = answers[i]; 
}

function updateScore() {
    var quiz_streak = document.getElementById("quiz_streak");

    var numenator = 100 * score;
    var denominator = total_answers;
    var percent = 0;

    if(denominator !== 0)
        percent = numenator / denominator;

    quiz_streak.innerHTML = "Streak " + score + "/" + total_answers + " " + percent.toFixed(1) + "%";
}

// Quiz match
var quiz_match = document.getElementsByClassName("quiz_variant");
for(var variant of quiz_match) {
    variant.addEventListener("click", function (event) {
        let element = event.target;
        let variant_text = element.innerHTML;

        // Right answer
        if(active_answer === variant_text) {

            showRandomQuestion();
            ++score;
        } else { // Wrong answer
            element.setAttribute('id', 'wrong_quiz_variant');
        }

        ++total_answers;
        
        updateScore();
    });
}

// Card game
var card = document.querySelector('.card');
card.addEventListener('click', function() {
    if(!card.classList.contains('flipped')) {
        card.classList.add('flipped');
    } else {
        card.classList.remove('flipped');
        setTimeout(showRandomCard, 350); // 350 is a timeout in milisecods (animation takes 700ms)
    }
});

var card_skip_button = document.getElementById("card_skip_button");
card_skip_button.addEventListener('click', function() {
    showRandomCard();
});

function showRandomCard() {
    var card_face_front = document.getElementById("card_face_front");
    var card_face_back = document.getElementById("card_face_back");

    let collection = active_database["collections"][active_collection];

    let cases = pullStudyCases(collection); 

    let study_case = cases[getRandomInt(cases.length)];

    let question = study_case["value"][0][0];
    let answer = study_case["value"][1][0];

    card_face_front.innerHTML = question;
    card_face_back.innerHTML = answer;
}

// Typing game
var startTime;
var stopwatchInterval;
var elapsedPausedTime = 0;

function pad(number) {
    if(number < 10) {
        return "0" + number;
    }

    return number;
}

function padMili(number) {
    if(number < 10) {
        return "0" + number;
    }

    if(number < 100) {
        return "00" + number;
    }

    return number;
}

var html_typing_game_score = document.getElementById("typing_game_score");

function updateStopwatch() {
    var currentTime = new Date().getTime(); // get current time in milliseconds
    var elapsedTime = currentTime - startTime; // calculate elapsed time in milliseconds

    var miliseconds =  Math.min(Math.max(elapsedTime % 1000, 0), 1000);
    var seconds = Math.floor(elapsedTime / 1000) % 60;
    var minutes = Math.floor(elapsedTime / 1000 / 60) % 60;
    var hours = Math.floor(elapsedTime / 1000 / 60 / 60);

    var displayTime = pad(hours) + ":" + pad(minutes) + ":" + pad(seconds) + ":" + padMili(miliseconds) + " " + typing_game_score + " streak";
    html_typing_game_score.innerHTML = displayTime;
}

function startStopwatch() {
    if (!stopwatchInterval) {
        startTime = new Date().getTime() - elapsedPausedTime;
        stopwatchInterval = setInterval(updateStopwatch, 10);
    }
}

function stopStopwatch() {
    clearInterval(stopwatchInterval);
    elapsedPausedTime = new Date().getTime() - startTime;
    stopwatchInterval = null;
}

function resetStopwatch() {
    stopStopwatch();
    elapsedPausedTime = 0;

    html_typing_game_score.innerHTML = "00:00:00:000 0 streak";

    startStopwatch();
}

var typing_reset_button = document.getElementById('typing_reset_button');
typing_reset_button.addEventListener('click', function() {
    typing_game_score = 0;
    resetStopwatch();
});

let typing_game_question = "";
let typing_game_answer = "";
let typing_game_score = 0;

function showRandomTyping() {
    var html_typing_game_question = document.getElementById('typing_game_question');

    let collection = active_database["collections"][active_collection];

    let cases = pullStudyCases(collection); 

    let study_case = cases[getRandomInt(cases.length)];

    typing_game_question = study_case["value"][0][0];
    typing_game_answer = study_case["value"][1][0];

    html_typing_game_question.innerHTML = typing_game_question;
}

var typing_game_field = document.getElementById('typing_game_field');
typing_game_field.onkeydown = function(e){
    if(e.keyCode == 13){
        var answer = typing_game_field.value; 

        if(answer == typing_game_answer) {
            ++typing_game_score;
            typing_game_field.value = "";

            showRandomTyping();
        }
    }
}

var typing_skip_button = document.getElementById('typing_skip_button');
typing_skip_button.addEventListener('click', function() {
    showRandomTyping();
});

startApplication()
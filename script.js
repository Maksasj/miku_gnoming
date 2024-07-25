console.log("Poggers !");

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

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

var form = document.getElementById("form-id");

var text_submit = document.getElementById("text_submit");
var submit_button = document.getElementById("submit_button");

submit_button.addEventListener("click", function (event) {
    const obj = JSON.parse(text_submit.value);

    console.log(obj);

    event.preventDefault();
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

var next_button = document.getElementById("next_button");

var card_question = document.getElementById("card_question");
var card_result = document.getElementById("card_result");

next_button.addEventListener("click", function (event) {
    let words = active_database["collections"]["numbers"]["words"];
    var random_word = words[getRandomInt(words.length)]

    card_question.innerHTML = "What word matches '" + random_word["word"] + "' ?";

    let variants = []

    variants.push(random_word["variants"][0]);

    for(let i = 0; i < 3; ++i) {
        var thing = words[getRandomInt(words.length)]["variants"][0];
        variants.push(thing);
    }

    card_result.innerHTML = "";

    shuffleArray(variants);

    for(let i = 0; i < 4; ++i) {
        card_result.innerHTML += "<hr id='card_separator'></hr><button class='click'>" + variants[i] + "</button>" + ""
    }
});
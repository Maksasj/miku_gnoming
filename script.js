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
                { "one": "いち" },
                { "two": "に" },
                { "three": "さん" },
                { "four": "し" },
                { "five": "ご" },
                { "six": "ろく" },
                { "seven": "しち" },
                { "eight": "はち" },
                { "nine": "きゅう" },
                { "ten": "じゅう" },
                { "eleven": "じゅういち" },
                { "twelve": "じゅうに" },
                { "twenty": "にじゅう" },
                { "twenty one": "にじゅうに" },
                { "thirty": "さんじゅう" },
                { "forty": "しじゅう" },
                { "one hundred": "ひゃく" }
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
var fortuneCookies = [
    "Conquer your fears or they will conquer you",
    "Do not fear what you don't know",
    "Whenever possible, keep it simple"
];

// node modularize ability
// global variable exports - so that the function is visible outside the module

exports.getFortune = function () {
    var idx = Math.floor(Math.random()*fortuneCookies.length);
    return fortuneCookies[idx];
};
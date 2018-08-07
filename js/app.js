/*
 * Create a list that holds all of your cards
 */
const cardsDeck = $(".deck");
const restartGame = $('.restart');
const deck = [
    'fa-diamond',
    'fa-paper-plane-o',
    'fa-anchor',
    'fa-bolt',
    'fa-cube',
    'fa-leaf',
    'fa-bicycle',
    'fa-bomb'
];

const cards = deck.concat(deck);
let opened = [];
let matched = 0;
let moves = 0;
let rating = 5;
let seconds = 0;
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

$(document).ready(() => {
    initialGameStart();
    $('li').click(cardClicked);
    $('.deck').one('click', timer)
    countMoves();
});

function initialGameStart() {
    shuffle(cards);
    populateCards();
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function populateCards() {
    for (const card of cards) {
        let li = $('<li/>');
        li.addClass('card');
        li.append(`<i class='fa ${card}'></i>`)
        cardsDeck.append(li);
    }
};

restartGame.click(() => location.reload());

function cardClicked(event) {
    if ($(this).hasClass('open') || $(this).hasClass('match')) {
        return
    }
    if (opened.length < 2) {
        $(this).toggleClass("open show");
        opened.push($(this))
    }
    if (opened.length === 2) {
        setTimeout(checkIfCardsMatch, 400);
        moves++;
        countMoves();
        starRating();
    }

}

function checkIfCardsMatch() {
    if (cardName((opened[0])[0]) === cardName((opened[1])[0])) {
        matched++;
        opened.forEach((card) => {
            card.animateCss('tada', () => card.toggleClass("show open match"));
        })
    } else {
        opened.forEach((card) => {
            card.toggleClass('no-match');
            card.animateCss('shake', () => {
                card.toggleClass('show open no-match')
            })
        })
    }
    opened = [];
    (matched === 8) ? endGame() : '';
}

function timer() {
    let time = setInterval(() => {
        ++seconds;
        if (matched === 8) clearInterval(time);
        $('.time').text(`${seconds} seconds`)
    }, 1000);

}

function countMoves() {
    $('.moves').text(moves);
}

function starRating() {
    if (rating > 1 && moves % 5 === 0) {
        $('.stars').find('li:first').remove()
        rating--;
        
    }

}

function endGame() {
    if (matched === 8) {
        let time = seconds;
        setTimeout(function(){
            $('.star-rating').text(rating);
            $('.timer').text(time);
            $('.moves-made').text(moves);
            $('.congrats').css('visibility', 'visible');
            $('.winner').css('visibility', 'visible');
        },2000)
    }
}

$('button').click(() => location.reload());

function cardName(card) {
    return card.firstChild.className
}

// loaded animateCss from https://github.com/daneden/animate.css/#usage
$.fn.extend({
    animateCss: function (animationName, callback) {
        var animationEnd = (function (el) {
            var animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd',
            };

            for (var t in animations) {
                if (el.style[t] !== undefined) {
                    return animations[t];
                }
            }
        })(document.createElement('div'));

        this.addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);

            if (typeof callback === 'function') callback();
        });

        return this;
    },
});

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


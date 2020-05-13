const elements = require('../views/base');

//Inserting value in boxes when slider changes
const sliderFunction = function(element) {
    const value = parseInt(element.value);
    const payoutValue = elements.rollText.innerHTML === 'under' ? (100/value).toFixed(4) : (100/(100-value)).toFixed(4);
    const chanceValue = elements.rollText.innerHTML === 'under' ? value : 100 - value;
    const profitValue = (elements.betBox.value*payoutValue - elements.betBox.value).toFixed(8);

    elements.rollBox.value = value;
    elements.chanceBox.value = chanceValue;
    elements.payoutBox.value = payoutValue;
    elements.profitBox.value = profitValue;
}

//Inserting value in boxes when either 'payout' or 'win chance changes'
const inputFunction = function(element) {
    const value = element.value;

    if (element === elements.payoutBox) {
        var rollValue = elements.rollText.innerHTML === 'under' ? (100/value).toFixed(4) : (100 - (100/value)).toFixed(4);
    } else {
        var rollValue = elements.rollText.innerHTML === 'under' ? value : 100 - value;
    }

    elements.rollBox.value = rollValue;
    rollFunction(element);
}

const rollFunction = function(element) {
    const value = elements.rollBox.value;
    const payoutValue = elements.rollText.innerHTML === 'under' ? (100/value).toFixed(4) : (100/(100-value)).toFixed(4);
    const chanceValue = elements.rollText.innerHTML === 'under' ? value : 100 - value;
    const profitValue = (elements.betBox.value*payoutValue - elements.betBox.value).toFixed(8);

    elements.slider.value = value;
    elements.profitBox.value = profitValue;

    if (element === elements.payoutBox) {
        elements.chanceBox.value = chanceValue;
    } else if (element === elements.chanceBox) {
        elements.payoutBox.value = payoutValue;
    } else {
        elements.payoutBox.value = payoutValue;
        elements.chanceBox.value = chanceValue;
    }
}

module.exports = {
    sliderFunction,
    inputFunction,
    rollFunction
}
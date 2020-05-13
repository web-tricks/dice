const elements = require('../views/base');
const userControls = require('./user');
const userView = require('../views/user');
const betControl = require('./bet');
const betView = require('../views/bet');
const valueControl = require('./values');
const messageControl = require('./message');
const clientSeedGenerator = require('../../utils/clientSeed');

//utility for chat
require('./chat');

const myBetsHolder = [];

/*-------------Event Listeners ----------------*/

//Event Listener on Page Load
window.addEventListener('DOMContentLoaded', async() => {
    if (localStorage.getItem('user')) {
        //showing user details if logged in
        userView.loggedDetails(elements.tools,elements.serverBox);

        //loading last five bets of user
        const myBets = await betControl.retrieveBets(myBetsHolder.length);
        if (myBets) myBets.forEach(bet => myBetsHolder.push(bet));
        myBetsHolder.forEach(bet => betView.displayBet(elements.myBetBox,bet,'beforeend'));
    } 

    //showing random client seed
    clientSeedGenerator(elements.clientBox);

    //load messages
    await messageControl();

    //Hash Change Event Needed to reload page to load cookie
    if (location.hash === '#reload') location.href = '/';
});

//Event Listeners for register, login, logout on tools div
elements.tools.addEventListener('click', e => {
    if (e.target === elements.registerButton) {
        userView.registerFormDisplay(elements.overlayBox);
    } else if (e.target === elements.loginButton) {
        userView.loginFormDisplay(elements.overlayBox);
    } else if (e.target.matches('.logout__user')) userControls.logoutUser();
});

//Event Listener on elements of game body - INPUT
elements.gameBody.addEventListener('input', (e) => {
    if (e.target === elements.slider) {
        //Changing values of inputs when slider is moved
        valueControl.sliderFunction(elements.slider);
    } else if (e.target === elements.betBox) {
        elements.profitBox.value = (elements.betBox.value*elements.payoutBox.value - elements.betBox.value).toFixed(8);
    } else if (e.target === elements.payoutBox) {
        //changing values when payout field is changed
        if (e.target.value > 50) e.target.value = 50;
        valueControl.inputFunction(e.target);
    } else if (e.target === elements.chanceBox) {
        if (e.target.value > 98) e.target.value = 98;
        valueControl.inputFunction(e.target);
    }
});

//Event Listener on elements of game body - CLICK
elements.gameBody.addEventListener('click', async(e) => {
    if (e.target === elements.shift || e.target === elements.rollBox) {
        //Toggle between 'roll under' and 'roll over'
        elements.slider.value = 100 - elements.slider.value;
        elements.rollBox.value = elements.slider.value;
        elements.rollText.innerHTML = elements.rollText.innerHTML === 'under' ? 'over' : 'under';
    } else if (e.target === elements.rollButton) {
        e.target.setAttribute('disabled', 'disabled');
        //Checking if user is logged in
        if (!localStorage.getItem('user')) return userView.loginFormDisplay(elements.overlayBox);
        //Creating Bet
        const betObject = await betControl.createBet();
        if (betObject) {
            const {user,bet} = betObject;
            //Displaying Bet Result
            betView.displayResult(elements.resultBox,bet.display.won,bet.display.result);
            betView.displayBet(elements.myBetBox,bet,'afterbegin');
            //Updating front-end user's details
            localStorage.setItem('user', JSON.stringify(user));
            userView.loggedDetails(elements.tools,elements.serverBox)
        }
        e.target.removeAttribute('disabled');
    } else if (e.target === elements.loadBets) {
        //Load next 10 bets
        const myNewBets = await betControl.retrieveBets(myBetsHolder.length);
        myNewBets.forEach(bet => myBetsHolder.push(bet));
        myNewBets.forEach(bet => betView.displayBet(elements.myBetBox,bet,'beforeend'));
    } else if (e.target.matches('.bet__verify')) {
        //Bet Verification Data Display - Hash and Seeds
        const _id = e.target.closest('.bet').dataset.id;
        let selectedBet = myBetsHolder.find(bet => bet._id === _id);
        if (!selectedBet) selectedBet = await betControl.retrieveBet(_id);
        betView.displayVerify(elements.overlayBox,selectedBet);
        
        //Close Provably Fair Window
        document.querySelector('.close__verify').onclick = () => {
            document.querySelector('.verify__data').remove();
            document.querySelector('.black__back').remove();
        }
    }
});

//Event Listener on Login and Register Button
elements.overlayBox.addEventListener('click', e => {
    if (e.target.matches('.login__form-button')) {
        e.preventDefault();
        document.querySelector('.login__form-button').setAttribute('disabled', 'disabled');
        userControls.loginUser();
    } else if (e.target.matches('.register__form-button')) {
        e.preventDefault();
        document.querySelector('.register__form-button').setAttribute('disabled', 'disabled');
        userControls.registerUser();
    } else if (e.target.matches('.register__instead')) {
        //Showing Register Form if someone clicked 'Or Register' on login form
        userView.registerFormDisplay(elements.overlayBox);
    }
});

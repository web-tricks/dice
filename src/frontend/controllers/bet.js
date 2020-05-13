const axios = require('axios');
const elements = require('../views/base');

const createBet = async() => {
    //making HTTP request
    try {
        const response = await axios.post('/bet/create', {
            amount: elements.betBox.value,
            rolltype: elements.rollText.innerHTML,
            rollvalue: elements.rollBox.value,
            client: elements.clientBox.value
        });
        return response.data;
    } catch(e) {
        elements.resultBox.innerHTML = e.response.data;
    }
}

//Retrieving Multiple Bets
const retrieveBets = async(index) => {
    try {
        const response = await axios.get(`/user/bets?limit=5&skip=${index}`);
        return response.data;
    } catch(e) {
        elements.myBetBox.innerHTML = e.response.data;
    }
} 

//Retrieving Single Bet
const retrieveBet = async(id) => {
    try {
        const response = await axios.get(`/user/bet/${id}`);
        return response.data;
    } catch(e) {
        alert(e.response.data);
    }
}

module.exports = {
    createBet,
    retrieveBets,
    retrieveBet
}
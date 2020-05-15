const displayResult = (element,isWon,result) => {
    const markup = `
        Roll Result: ${result}. You ${isWon}!!
    `;
    element.innerHTML = markup;
}

const displayBet = (element,bet,where) => {
    const markup = `
        <span class="bet" data-id="${bet._id}">
            <span class="bet__choice">${bet.display.choice}</span> | 
            <span class="bet__result">${bet.display.result}</span> |
            <span class="bet__won">${bet.display.won}</span> |
            <span class="bet__payout">${(bet.display.payout).toFixed(8)}</span>
            <span class="bet__verify">Verify</span><br>
        </span>
    `;

    element.insertAdjacentHTML(where,markup);
}

const displayVerify = (element,bet) => {
    const markup = `
        <div class="verify__data">
            <h3>Provably Fair Data</h3>
            <div>Roll Result: ${bet.display.result}</div>
            <div>Client Seed: ${bet.client}</div>
            <div>Server Seed: ${bet.seed}</div>
            <div>Server Seed Hash: ${bet.seedHash}</div>
            <div>Hmac-512 Hash: ${bet.hash}</div>
            <button class="close__verify">Close</button>
        </div>
        <div class="black__back"> </div>
    `;
    element.innerHTML = markup;
}

module.exports = {
    displayBet,
    displayVerify,
    displayResult
}
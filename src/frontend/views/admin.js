//Display each user in separate line
const displayUser = (element,user,i) => {
    const markup = `
        <span data-id="${user._id}" class="user__span">
            <span>${i}. ${user.username} </span>
            <button class="edit__member btn-style">Edit Member</button>
        </span><br>
    `;
    element.insertAdjacentHTML('beforeend',markup);
}

//Display details of single user in form
const displayUserForm = (element,user) => {
    const markup = `
        <form class="user__edit-form" data-id="${user._id}">
            Username: <input value="${user.username}" readonly><br>
            Email: <input  type="email" value="${user.email}" class="edit__email"> 
            Password: <input  type="text" value="" class="edit__password"><br>
            Role: <input  type="text" value="${user.role}" class="edit__role"> 
            Balance: <input  type="text" value="${user.balance}" class="edit__balance"><br>
            <input class="submit-style" type="submit" value="Save Changes">
        </form>
    `;
    element.innerHTML = markup;
}

//Display each bet in separate line
const displayBet = (element,bet) => {
    const markup = `
        <span>
            <span class="bet__choice">${bet.choice}</span> | 
            <span class="bet__result">${bet.result}</span> |
            <span class="bet__result">${bet.won}</span> |
            <span class="bet__result">${(bet.payout).toFixed(8)}</span>
        </span><br>
    `;
    element.insertAdjacentHTML('beforeend',markup);
}

const loadMoreButton = (element,type) => {
    const markup = `
        <button class="load__more-${type}">Load More ${type}</button>
    `;
    element.insertAdjacentHTML('beforeend', markup);
}

module.exports = {
    displayUser,
    displayUserForm,
    displayBet,
    loadMoreButton
}
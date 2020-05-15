const axios = require('axios');
const elements = require('../views/base');
const adminView = require('../views/admin');

/*----------------------- Variables (Holder) -----------------------*/
const allUsernames = [];
const allBets = [];

/*-------------------------- Functions -----------------------------*/

//Function to retrieve number of users
const membersCount = async(element) => {
    try {
        const response = await axios.get('/users/all');
        element.insertAdjacentHTML('beforeend', response.data);
    } catch(e) {
        alert(e.response.data);
    }
}

//Function to retrieve usernames of all members 
const membersUsername = async(length) => {
    try {
        const response = await axios.get(`/users/details?skip=${length}`);
        return response.data;
    } catch(e) {
        alert(e.response.data);
    }
}

//Function to retrieve details of single user through id or username
const getMemberDetails = async(id,type) => {
    try {
        const response = await axios.get(`/user/getinfo/${type}/${id}`);
        return response.data;
    } catch(e) {
        alert(e.response.data);
    }
}

//Function to retrieve bets of single user
const getMemberBets = async(length,username) => {
    try {
        const response = await axios.get(`/user/allbets/${username}?skip=${length}`);
        return response.data;
    } catch(e) {
        alert(e.response.data);
    }
}

//Function to update user
const updateUser = async(id) => {
    const passwordValue = document.querySelector('.edit__password').value;
    if (passwordValue.length > 0 && passwordValue.length < 8) return alert('Password Length must be greater than 7 characters.');
    const password = passwordValue.length !== 0 ? passwordValue : undefined;

    const balance = document.querySelector('.edit__balance').value;
    if (isNaN(balance)) return alert('Wrong Value for Balance');

    const updateObject = {
        email: document.querySelector('.edit__email').value,
        role: document.querySelector('.edit__role').value,
        balance: parseFloat(balance)
    }

    const updatedObject = password ? Object.assign(updateObject, {password}) : updateObject;

    try {
        const response = await axios.post(`/user/edit/${id}`, updatedObject);
        return response.data;
    } catch(e) {
        alert(e.response.data);
    }
}

/*------------------------ Event Listeners------------------------- */

//Show the number of users on page load
window.addEventListener('DOMContentLoaded', () => {
    membersCount(elements.membersCount);
});

//Adding event listeners on the `admin top buttons` - CLICK
elements.adminTopBody.addEventListener('click', async(e) => {
    //Display members when `show all members` is clicked
    if (e.target === elements.showMembersButton) {
        //Empty username array before search
        allUsernames.splice(0,allUsernames.length);
        //Empty any content from display
        elements.adminOutputDisplay.innerHTML = ``;
        elements.holdButtonDiv.innerHTML = ``;
        //Get usernames
        const members = await membersUsername(allUsernames.length);
        //Show username if found
        if (members) {
            adminView.loadMoreButton(elements.holdButtonDiv,'Users');
            members.forEach((member,i) => {
                allUsernames.push(member);
                adminView.displayUser(elements.adminOutputDisplay,member,i+1);
            })
        }
    }
});

//Adding event listeners on the `admin top buttons` - SUBMIT
elements.adminTopBody.addEventListener('submit', async(e) => {
    if (e.target === elements.adminUserForm) {
    //Displaying user details when `edit member by username` form is submitted

        //0. Preventing Default Behavior
        e.preventDefault();
        //1. Empty display area
        elements.adminOutputDisplay.innerHTML = ``;
        elements.holdButtonDiv.innerHTML = ``;
        //2.Get User Data
        const details = await getMemberDetails(elements.adminUserInput.value,'username');
        //3. Displaying User Details if found
        if (details) {
            adminView.displayUserForm(elements.adminOutputDisplay,details);
        }

    } else if (e.target === elements.adminBetsForm) {
    //Display user bets when `show bets` form is submitted

        //0. Preventing Default Behavior
        e.preventDefault();
        //0.1 Empty allBets array
        allBets.splice(0,allBets.length);
        //1. Empty display area
        elements.adminOutputDisplay.innerHTML = ``;
        elements.holdButtonDiv.innerHTML = ``;
        //2. Get User's Bet
        const bets = await getMemberBets(allBets.length,elements.adminBetsInput.value);
        //3. Displaying Bets if found
        if (bets) {
            adminView.loadMoreButton(elements.holdButtonDiv,'Bets');
            bets.forEach(bet => {
                allBets.push(bet);
                adminView.displayBet(elements.adminOutputDisplay,bet);
            });
        }
    }
});

//Adding Event Listener on `admin bottom buttons` - CLICK
elements.adminDisplayResult.addEventListener('click', async(e) => {
    //When `edit member` is clicked
    if (e.target.matches('.edit__member')) {
        //1. getting the id of member from data
        const id = e.target.closest('.user__span').dataset.id;
        //2. Get user profile with `id`
        const details = await getMemberDetails(id,'id');
        //3. Display user profile if found
        if (details) {
            elements.adminOutputDisplay.innerHTML = ``;
            elements.holdButtonDiv.innerHTML = ``;
            adminView.displayUserForm(elements.adminOutputDisplay,details);
        }
    }
    //When `load more bets` is clicked
    else if (e.target.matches('.load__more-Bets')) {
        // Load More Bets
        const bets = await getMemberBets(allBets.length,elements.adminBetsInput.value);
        //If More Bets Found, Display them
        if (bets) {
            bets.forEach(bet => {
                allBets.push(bet);
                adminView.displayBet(elements.adminOutputDisplay,bet);
            });
        }
    }
    //When `load more users` is clicked
    else if (e.target.matches('.load__more-Users')) {
        //Get more usernames
        const members = await membersUsername(allUsernames.length);
        //Show usernames if found
        if (members) {
            members.forEach((member,i) => {
                allUsernames.push(member);
                adminView.displayUser(elements.adminOutputDisplay,member,i+1);
            })
        }
    }
})

//Adding Event Listener on `admin bottom buttons` - SUBMIT
elements.adminDisplayResult.addEventListener('submit', async(e) => {
    // Saving details of the user when `Save Changes` have been clicked
    if (e.target.matches('.user__edit-form')) {
        //0. Preventing Default Behavior
        e.preventDefault();
        //1. Retrieving User ID
        const id = e.target.dataset.id;
        //2. Sending data to save
        const updatedDetails = await updateUser(id);
        //3. If details are updated, show new details
        if (updatedDetails) {
            elements.adminOutputDisplay.innerHTML = ``;
            elements.holdButtonDiv.innerHTML = ``;
            updatedDetails.forEach(update => elements.adminOutputDisplay.insertAdjacentHTML('beforeend', `${update}<br>`));
        }
    }
});
const axios = require("axios");
const displayMessage = require('./chat');

//Displaying Messages to user on load;
module.exports = async() => {
    try {
        const messages = await axios.get('/chat/messages');
        messages.data.forEach(message => displayMessage(message));
    } catch(e) {
        alert(e.response.data);
    }
}
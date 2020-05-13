const socket = io();
const moment = require('moment');
const axios = require('axios');
const elements = require('../views/base');
const userView = require('../views/user');
const username = (localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')).username : undefined;

//Message Received Emit when message is typed
elements.sendMessage.addEventListener('submit', e => {
    e.preventDefault();
    //If user isn't logged in then show login form
    if (!localStorage.getItem('user')) {
        e.preventDefault();
        return userView.loginFormDisplay(elements.overlayBox);
    }

    const message = elements.messageInput.value;
    elements.chatButton.setAttribute('disabled', 'disabled');

    socket.emit('messageReceived', {message, username}, error => {
        elements.chatButton.removeAttribute('disabled');
        elements.messageInput.value = '';
        elements.messageInput.focus();

        if (error) {
            return console.log(error);
        }
    });
});

//Socket on receiving that server validated message
socket.on('message', async(message) => {
    try {
        const save = await axios.post('/chat/create', message);
        if (username) {
           displayMessage(message);
        }
    } catch(e) {
        if (e === 'authentication') return userView.loginFormDisplay(elements.overlayBox);
        alert(e);
    }
    
});

//Displaying Message
const displayMessage = (message) => {
    const markup = `
        <div class="message">
            <p><span class="message__name">${message.username} says..</span>
            <span class="message__meta">${moment(message.created).format('MMMM Do YYYY, h:mm:ss a')}</span></p>
            <p class="message__main">${message.text}</p>
        </div>    
    `;

    elements.chatArea.insertAdjacentHTML('beforeend', markup);
    elements.chatArea.scrollTop = elements.chatArea.scrollHeight - elements.chatArea.clientHeight;
}

module.exports = displayMessage;
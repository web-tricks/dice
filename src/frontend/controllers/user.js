const axios = require('axios');

//trying to login function
const loginUser = async() => {
    let response;
    try {
      response = await axios.post('/user/login', {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
      });
      
    localStorage.setItem('user', JSON.stringify(response.data));
    window.location.hash = 'reload';
    location.reload();
    
    } catch(e) {
      document.querySelector('.login__error').innerHTML = e.response.data;
      document.querySelector('.login__form-button').removeAttribute('disabled');
    }
}

//trying to Logout function
const logoutUser = async() => {
    let response;
    try {
        response = await axios.post('/user/logout');
  
        localStorage.clear();
        location.reload();
    } catch {
      alert('Something Went Wrong. Please refresh the page.');
      document.querySelector('.logout__user').removeAttribute('disabled');
    }
  }
  
//try to Register function
const registerUser = async () => {
    let response;
    try {
        response = await axios.post('/user/signup', {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        email: document.getElementById('email').value
        });

        localStorage.setItem('user', JSON.stringify(response.data));
        window.location.hash = 'reload';
        location.reload();

    } catch(e) {
        document.querySelector('.register__error').innerHTML = e.response.data.join('<br>');
        document.querySelector('.register__form-button').removeAttribute('disabled');
    }
}

module.exports = {
    loginUser,
    logoutUser,
    registerUser
}
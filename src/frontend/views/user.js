//Display Login Form
const loginFormDisplay = (element) => {
    const markup = `
        <div class="login__form">
            <form class="login__form-main">
                <label for="username">Username</label>
                <input type="text" name="username" id="username" /><br>
                <label for="password">Password</label>
                <input type="password" name="password" id="password" /><br>
                <button class="login__form-button">Login</button>
            </form>
            <span class="register__instead"> Or Register</span>
            <div class="login__error"></div>
        </div>
        <div class="black__back"> </div>
    `;
    element.innerHTML = markup;
}

//Display Register Form
const registerFormDisplay = (element) => {
    const markup = `
        <div class="register__form">
            <form class="register__form-main">
                <label for="username">Username</label>
                <input type="text" name="username" id="username" /><br>
                <label for="email">Email</label>
                <input type="text" name="email" id="email" /><br>
                <label for="password">Password</label>
                <input type="password" name="password" id="password" /><br>
                <button class="register__form-button">Register</button>
            </form>
            <div class="register__error"></div>
        </div>
        <div class="black__back"> </div>
    `;
    element.innerHTML = markup;
}

//Display Buttons when user is logged in
const loggedDetails = (element,element2) => {
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : undefined;
    if (user) {
        var {username,balance,seedHash} = user;
    }

    const markup = `
        <button class="balance btn__style">${(balance).toFixed(8)} BTC</button>
        <button class="logged__user btn__style">${username}</button>
        <button class="logout__user btn__style">Logout</button>
    `;

    element.innerHTML = markup;
    element2.value = seedHash;
}

module.exports = {
    loginFormDisplay,
    registerFormDisplay,
    loggedDetails
}
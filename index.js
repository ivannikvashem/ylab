function loginBtnClicked() {
    var loader = document.getElementById('progress-bar');
    var login = document.getElementById('email-field').value;
    var password = document.getElementById('password-field').value;

    !login.trim() ? errorHandler('email-field-error', 'Введите логин', 'visible') : errorHandler('email-field-error', 'template', 'hidden') 
    !password.trim() ? errorHandler('password-field-error', 'Введите пароль', 'visible') : errorHandler('password-field-error', 'template', 'hidden') 

    if ( !login.trim() || !password.trim()) {
        return;
    }

    loader.style.display = 'block';
    this.authorizationRequset(login, password).then(() => {
        loader.style.display = 'none';
    })
}


function errorHandler(node, text, visibility) {
    var error = document.getElementById(node);
    error.innerHTML = text;
    error.style.visibility = visibility;
}

function showHidePassword() {
    var passwordField = document.getElementById('password-field');
    var showHideBtn = document.getElementById('show-hide-password');
    if (passwordField.type === "password") {
        passwordField.type = "text";
        showHideBtn.style.backgroundColor = 'rgb(30, 32, 30)'
    } else {
        passwordField.type = "password";
        showHideBtn.style.backgroundColor = 'transparent'
    }
}

function splashScreenActive() {
    var splash = document.getElementById('splash-screen');
    splash.style.animation = 'swingViewport 2s ease-in-out forwards';
    splash.style.display = 'flex'

    setTimeout(() => {
        splash.style.animation = 'swingViewportReverse 2s ease-in-out forwards';
    }, 5000);
}

function fillUserProfile(data) {
    document.getElementById('profile-image').src = data.image;
    document.getElementById('profile-name').innerHTML = ('Добро пожаловать, ' + data.firstName + ' ' + data.lastName + '<br/> <small style="font-size: 20px">' + data.email + '</small>');
}


async function authorizationRequset(login, password) {
    return fetch('https://dummyjson.com/auth/login', {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: login,
          password: password,
        }),
      })
        .then((response) => {
            if (response.ok) {
               return response.json()
            } else if (response.status == '400') {
                throw new Error('Неверный логин или пароль');
            } else if (response.status == '500') {
                throw new Error('Сервер не отвечает, попробуйте позже');
            }
        })
        .then((data) => {
          if (data.error) {
            errorHandler('password-field-error', 'Неверный логин или пароль', 'visible')
          } else {
            console.log(data)
            // do stuff after auth
            fillUserProfile(data);
            splashScreenActive();
          }
        })
        .catch((err) => {
          errorHandler('password-field-error', err.toString().split(":")[1], 'visible')
        });
}
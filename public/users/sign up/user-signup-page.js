let $ = document;

let modal = $.querySelector('.modal');
let modalBar = $.querySelector('.modal-bar');
let modalMessage = $.querySelector('.modal-message');
let btn = $.querySelector('.signup-btn');
let emailInput = $.querySelector('.email-input');
let usernameInput = $.querySelector('.username-input');
let passwordInput = $.querySelector('.password-input');

btn.addEventListener('click', (e) => {
    e.preventDefault();
    addNewUser(emailInput.value, usernameInput.value, passwordInput.value);
});

let addNewUser = async (email, username, password) => {
    if (!isValidEmail(email)) {
        showError('لطفا یک ایمیل صحیح وارد کنید.');
    } else if (!isValidUsername(username)) {
        showError('لطفا یک نام کاربری صحیح وارد کنید.');
    } else if (!isValidPassword(password)) {
        showError('لطفا یک رمز عبور صحیح وارد کنید.');
    } else {
        let newUser = { email, username, password };
        if (!await checkSimilarity(newUser)) {
            try {
                let res = await fetch('https://restaurant-ea95e-default-rtdb.firebaseio.com/users.json', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newUser)
                });
                if (res.status !== 200) {
                    showError('خطا. دسترسی خود به اینترنت را بررسی کنید.');
                } else {
                    showSuccess('ثبت نام با موفقیت انجام شد. درحال ورود به پنل کاربری...');
                    let mainUser = await returnMainUser();
                    if (mainUser) {
                        let panelURL = 'http://127.0.0.1:5500/public/user-panel/user-panel.html';
                        let url = new URL(panelURL);
                        url.searchParams.set('id', mainUser.id);
                        window.location.href = url;
                    } else {
                        showError('کاربر یافت نشد. لطفا دوباره تلاش کنید.');
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                showError('خطا. دسترسی خود به اینترنت را بررسی کنید.');
            }
        } else {
            showError('کاربری با این مشخصات در سیستم وجود دارد. وارد شوید.');
        }
    }
};

function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

function showPopUpModal(modal, bar) {
    modal.classList.remove('hidden');
    modal.classList.add('flex', 'animate-come-in');
    bar.classList.add('animate-modal-bar');

    setTimeout(() => {
        modal.classList.remove('animate-come-in');
        modal.classList.add('animate-go-out');

        setTimeout(() => {
            modal.classList.remove('animate-go-out', 'flex');
            modal.classList.add('hidden');
            bar.classList.remove('animate-modal-bar');
        }, 500); // Duration of the go-out animation
    }, 2000); // Time before starting go-out animation
}

function showError(message) {
    modal.classList.add('bg-red-500');
    modalMessage.innerHTML = message;
    showPopUpModal(modal, modalBar);
}

function showSuccess(message) {
    modal.classList.add('bg-emerald-500');
    modalMessage.innerHTML = message;
    showPopUpModal(modal, modalBar);
}

function isValidUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    return usernameRegex.test(username);
}

function isValidPassword(password) {
    const passwordRegex = /^.{8,}$/;
    return passwordRegex.test(password);
}

async function checkSimilarity(user) {
    let users = await fetch('https://restaurant-ea95e-default-rtdb.firebaseio.com/users.json')
        .then(res => res.json())
        .then(res => getUsersArray(res));
    
    return users.some(databaseUser => databaseUser.username === user.username || databaseUser.email === user.email);
}

function getUsersArray(obj) {
    return Object.entries(obj).map(([id, user]) => ({
        id,
        email: user.email,
        password: user.password,
        username: user.username
    }));
}

async function returnMainUser() {
    let users = await fetch('https://restaurant-ea95e-default-rtdb.firebaseio.com/users.json')
        .then(res => res.json())
        .then(res => getUsersArray(res));
    
    return users.find(user => user.username === usernameInput.value);
}


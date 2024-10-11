let $ = document
let modal = $.querySelector('.modal')
let modalBar = $.querySelector('.modalBar')
let modalMessage = $.querySelector('.modal-message')
let usernameInp = $.querySelector('.username-input')
let passwordInp = $.querySelector('.password-input')
let btn = $.querySelector('.login-btn')

btn.addEventListener('click', async (e) => {
    e.preventDefault()
    let users = []
    await fetch('https://restaurant-ea95e-default-rtdb.firebaseio.com/users.json')
        .then(res => res.json())
        .then(res => users = getUsersArray(res))
        let mainUser = users.find(user => {
            return user.username === usernameInp.value
        })

        if(mainUser){
            if(mainUser.password === passwordInp.value){
                modal.classList.remove('bg-red-500')
                modal.classList.add('bg-emerald-500')
                modalMessage.innerHTML = 'خوش آمدید!'
                showPopUpModal(modal, modalBar)
                setTimeout(() => {
                    let panelURL = 'http://127.0.0.1:5500/public/user-panel/user-panel.html'
                    let url = new URL(panelURL)
                    url.searchParams.set('id', mainUser.id)
                    window.location.href = url
                } , 1000)
            }else{
                modal.classList.add('bg-red-500')
                modalMessage.innerHTML = 'رمز عبور اشتباه است.'
                showPopUpModal(modal, modalBar)
            }
        }else{
            modal.classList.remove('bg-emerald-500')
            modal.classList.add('bg-red-500')
            modalMessage.innerHTML = 'کاربری با این مشخصات در سیستم یافت نشد.'
            showPopUpModal(modal, modalBar)
        }
})







let showPopUpModal = (modal, bar) => {
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
        }, 500); 
    }, 2000); 
};

function getUsersArray(obj) {
    let array = Object.entries(obj);
    let finalArray = [];

    array.forEach(user => {
        let newUser = {
            id: user[0],
            email: user[1].email,
            password: user[1].password,
            username: user[1].username
        };
        finalArray.push(newUser);
    });

    return finalArray;
}





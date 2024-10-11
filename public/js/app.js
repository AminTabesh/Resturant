let $ = document

let navHome = $.querySelector('#navbar-home')
let navOrder = $.querySelector('#navbar-order')
let navAdress = $.querySelector('#navbar-adress')
let menuItems = $.querySelector('#menu-items')
let statusContainer = $.querySelector('.status-holder')
let paginatedProducts = null



let products = null;

window.addEventListener('load', async () => {

    //getting food data

    await fetch('https://restaurant-ea95e-default-rtdb.firebaseio.com/menu.json')
        .then(res => res.json())
        .then(res => {
            products = []
            Object.entries(res).forEach(item => {
                products.push(item[1])
            })
        })
        .catch(err => console.log(err))

        
    menuItems.innerHTML = ''

    paginatedProducts = paginateItems(products, 8)
    showProducts(paginatedProducts[0], menuItems)
    paginateBtnGenerator(paginatedProducts, $.querySelector('#pagination-wrapper'))


    //getting restaurant status

    fetch('https://restaurant-ea95e-default-rtdb.firebaseio.com/status.json')
        .then(res => res.json())
        .then(res => {
            statusContainer.innerHTML = ''
            if(res.value === 'closed') {
                statusContainer.insertAdjacentHTML('beforeend', `
                    <div id="status-circle" class="z-20 w-2 h-2 rounded-full bg-red-500 shadow-red"></div>
                    <p class="z-20 text-nowrap text-white">الان سفارش نمی گیریم :(</p>
                    `)
            }else{
                statusContainer.insertAdjacentHTML('beforeend', `
                    <div id="status-circle" class="z-20 w-2 h-2 rounded-full bg-green-500 shadow-green animate-ping"></div>
                    <p class="z-20 text-nowrap text-white">همین الان میتونی سفارش بدی!</p>
                    `)
            }
        })
})

navHome.addEventListener('click', (e) => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })

})
navOrder.addEventListener('click', (e) => {
    window.scrollTo({
        top: $.querySelector('#menu-title').getBoundingClientRect().top + window.scrollY - 150,
        behavior: 'smooth',
    })
})
navAdress.addEventListener('click', (e) => {
    window.scrollTo({
        top: $.querySelector('#address-title').getBoundingClientRect().top + window.scrollY - 100,
        behavior: 'smooth',
    })
})

function paginateItems(itemsArray, itemsPerPage) {
    let paginatedResult = [];
    let totalPages = Math.ceil(itemsArray.length / itemsPerPage);

    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
        let startIndex = pageIndex * itemsPerPage;
        let endIndex = startIndex + itemsPerPage;
        let page = itemsArray.slice(startIndex, endIndex);
        paginatedResult.push(page);
    }

    return paginatedResult;
}
function showProducts (productsArray, container){
    container.innerHTML = ''
    productsArray.forEach(item => {
        container.insertAdjacentHTML('beforeend', `
            <div class="border rounded-2xl shadow-small h-96 w-72 mobile:w-full flex-shrink-0">
                <img src="${item.img}" alt="${item.class}" class="mx-auto py-4 mt-4 h-1/2">
                <h3 class="mt-4 font-medium text-2xl">${item.name}</h3>
                <h3 class="font-semibold text-2xl mt-3">${item.price + ' تومان'}</h3>
                <button class="add-to-cart bg-red-500 text-white px-4 py-2 rounded-xl mt-3 transition-colors hover:bg-red-600">افزودن به سبد خرید</button>
            `)
    });
    let buybtns = $.querySelectorAll('.add-to-cart')
    buybtns.forEach(btn => {
        btn.addEventListener('click', directToLogin)
    })
}
function paginateBtnGenerator(paginatedArray, btnContainer) {
    btnContainer.innerHTML = '';

    paginatedArray.forEach((item, index) => {
        btnContainer.insertAdjacentHTML('beforeend', 
            `<button class="pagination-btn rounded-lg border-red-500 border bg-white flex justify-center items-center w-8 h-8 text-red-500 transition-colors cursor-pointer hover:bg-red-500 hover:text-white">${index + 1}</button>`
        );
    });

    // Select the first button by default
    let buttons = btnContainer.querySelectorAll('.pagination-btn');
    if (buttons.length > 0) {
        buttons[0].style.backgroundColor = '#EF4444'
        buttons[0].classList.add('text-white');
    }

    // Add event listener for button click to handle selection
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {

            showProducts(paginatedProducts[+e.target.innerHTML - 1], menuItems)

            // Remove active class from all buttons
            buttons.forEach(btn => {
                btn.style.backgroundColor = 'white'
                btn.style.color = '#EF4444'
        });

            // Add active class to the clicked button
            button.style.backgroundColor = '#EF4444'
            button.style.color = 'white'
        });
    });
}


//Handling ticket section


let senderNameInput = $.querySelector('#ticket-sender')
let messageInput = $.querySelector('#ticket-message')
let sendBtn = $.querySelector('#ticket-send-btn')

sendBtn.addEventListener('click', () => {
    let newMesssage = {
        sender: senderNameInput.value,
        content: messageInput.value
    }
    fetch('https://restaurant-ea95e-default-rtdb.firebaseio.com/tickets.json', {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body:
            JSON.stringify(newMesssage)
    })
        .then(res => {
            console.log(res)
            senderNameInput.value = ''
            messageInput.value = ''
        })
        .catch(err => console.log(err))
})

let loginBtn = $.querySelector('#login')
let orderNowBtn = $.querySelector('.order-now')

loginBtn.addEventListener('click', directToLogin)
orderNowBtn.addEventListener('click', directToLogin)

function directToLogin(){
    location.href = 'http://127.0.0.1:5500/public/users/login/user-login-page.html?'
}
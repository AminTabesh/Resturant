let $ = document

let navHome = $.querySelector('#navbar-home')
let navOrder = $.querySelector('#navbar-order')
let navAdress = $.querySelector('#navbar-adress')
let menuItems = $.querySelector('#menu-items')
let statusContainer = $.querySelector('.status-holder')
let userNameContainer = $.querySelector('.user-name')
let userMenu = $.querySelector('.user-menu')
let arrowSvg = $.querySelector('.arrow')
let paginatedProducts = null
let products = null;
let cartImg = $.querySelector('.cart-dropdown')
let cartmenu = $.querySelector('.cart-dropdown-content')
let logOutBtn = $.querySelector('.log-out')
let cartContainer = $.querySelector('.cart-tbody')
let itemsArray = []
let username = null
let userid = (new URLSearchParams(location.search)).get('id')
let itemCount = $.querySelector('.cart-count')
let payBtn = $.querySelector('.pay-btn')
let clearAllBtn = $.querySelector('.clear-all-btn')
let cartBtnWrapper = $.querySelector('.cart-btns')
let totalPriceContainer = $.querySelector('.price-container')
let totalPriceElem = $.querySelector('.total-price')
let orderNowBtn = $.querySelector('.order-now')
let modal = $.querySelector('.modal')
let modalMessage = $.querySelector('.modal-message')
let modalBar = $.querySelector('.modalBar')




dropdownToggle(cartmenu, cartImg)
dropdownToggle(userMenu, arrowSvg)
dropdownToggle(userMenu, userNameContainer)

window.addEventListener('load', async () => {

    //geting user cart

    let cartArray = await cartArrayLoader()
    updateCart(cartArray)
    sessionStorage.setItem('cart', JSON.stringify(cartArrayLoader()))

    //getting user data
    if(userid){
        await fetch(`https://restaurant-ea95e-default-rtdb.firebaseio.com/users/${userid}.json`)
                .then(res => res.json())
                .then(res => {
                    username = res.username
                    userNameContainer.innerHTML = username
                })
    }

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

orderNowBtn.addEventListener('click', () => {
    window.scrollTo({
        top: $.querySelector('#menu-title').getBoundingClientRect().top + window.scrollY - 150,
        behavior: 'smooth',
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
        let encodedItem = encodeURIComponent(JSON.stringify(item))
        container.insertAdjacentHTML('beforeend', `
            <div class="border rounded-2xl shadow-small h-96 w-72 mobile:w-full flex-shrink-0">
                <img src="${item.img}" alt="${item.class}" class="mx-auto py-4 mt-4 h-1/2">
                <h3 class="mt-4 font-medium text-2xl">${item.name}</h3>
                <h3 class="font-semibold text-2xl mt-3">${item.price + ' تومان'}</h3>
                <button class="add-to-cart bg-red-500 text-white px-4 py-2 rounded-xl mt-3 transition-colors hover:bg-red-600" onclick="addToCartHandler('${encodedItem}')">افزودن به سبد خرید</button>
            `)
        
    });
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
            modalMessage.innerHTML = 'پیام شما با موفقیت ارسال شد.'
            modal.classList.add('bg-teal-500')
            modal.classList.remove('bg-red-500')
            showPopUpModal(modal,modalBar)
        })
        .catch(() => {
            modalMessage.innerHTML = 'ارسال پیام با خطا مواجه شد.'
            modal.classList.add('bg-red-500')
            modal.classList.remove('bg-teal-500')
            showPopUpModal(modal,modalBar)
        })
})

payBtn.addEventListener('click', () => {
    let url = new URL('/public/user-panel/successful payment/successful-payment.html', window.location.origin)
    let searchParams = new URLSearchParams(url.search)
    url.searchParams.append('id', userid)
    location.href = url.toString()
})

function dropdownToggle(dropdown, button) {
    button.addEventListener('click', () => {
        dropdown.classList.toggle('hidden')
        dropdown.classList.toggle('flex')
        
    })
}

logOutBtn.addEventListener('click', () => {
    location.href = '/public/index.html'
})

async function addToUserCart(item){

    await fetch(`https://restaurant-ea95e-default-rtdb.firebaseio.com/users/${userid}/cart.json`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body:
        JSON.stringify(item)
    })
        .then(() => {
            modal.classList.remove('bg-red-500')
            modal.classList.add('bg-teal-500')
            modalMessage.innerHTML = 'با موفقیت به سبد خرید افزوده شد.'
            showPopUpModal(modal, modalBar)
        })
        .catch(() => {
            modal.classList.remove('bg-teal-500')
            modal.classList.add('bg-red-500')
            modalMessage.innerHTML = 'عملیات با خطا مواجه شد.'
            showPopUpModal(modal, modalBar)
        })
}



async function addToCartHandler(encodedItem){
    let item = JSON.parse(decodeURIComponent(encodedItem))

    await addToUserCart(item)
    let cartSortedArray = await cartArrayLoader()

    updateCart(cartSortedArray)
}

function groupItemsByName(array) {
    let map = new Map();

    if (array){
        array.forEach(item => {
            if (!map.has(item.name)) {
                map.set(item.name, []);
            }
            map.get(item.name).push(item);
        });
    
        return Array.from(map.values());
    }
}


async function getUserCart() {
    let userCart = null
    await fetch(`https://restaurant-ea95e-default-rtdb.firebaseio.com/users/${userid}/cart.json`)
        .then(res => res.json())
        .then(res => {
            userCart =  res
        })
        return userCart
}
function getCartArray(obj) {
    if(obj){
        let array = Object.entries(obj);
        let finalArray = [];

        array.forEach(item => {
            let newItem = {
                id: item[0],
                class: item[1].class,
                img: item[1].img,
                name: item[1].name,
                price: item[1].price,
                count: item[1].count
            };
            finalArray.push(newItem);
        });

        return finalArray;
    }
}

function getFoodsCount(array, item){
    let foodsArray = array.filter(food => {
        return item.name === food.name
    })
    return foodsArray.length
}

async function cartArrayLoader(){
    let userCart = await getUserCart()
    let userCartArray = getCartArray(userCart)
    let cartSortedArray = groupItemsByName(userCartArray)
    return cartSortedArray
}

async function updateCart(array){

    if (array){

        
        totalPriceContainer.classList.remove('hidden')
        totalPriceContainer.classList.add('block')
        cartBtnWrapper.classList.remove('hidden')
        cartBtnWrapper.classList.add('flex')
        cartContainer.innerHTML = ''
        let count = 0
        array.forEach(group => {
            let itemCount = group.length;
            count += itemCount
            let item = group[0]; 
            cartContainer.insertAdjacentHTML('beforeend', `
                <tr class="text-center ">
                    <td class="border py-6 text-wrap">${item.name}</td>
                    <td class="border py-6 text-wrap">x${itemCount}</td>
                    <td class="border py-6 text-wrap">${item.price * itemCount} تومان</td>
                    <td class="border py-6 text-wrap">
                        <button class="mx-5 bg-red-500 text-white p-2 rounded-lg transition-colors hover:bg-red-600" onclick="removeHandler('${encodeURIComponent(JSON.stringify(item))}', '${encodeURIComponent(JSON.stringify(array))}')"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            </button>
                    </td>
                </tr>
                `)
                sessionStorage.setItem('cart', JSON.stringify(array))
        })
        itemCount.innerHTML = count
        
        totalPriceElem.innerHTML = totalPriceCalc(array)
    }else{
        totalPriceContainer.classList.remove('block')
        totalPriceContainer.classList.add('hidden')
        cartBtnWrapper.classList.remove('flex')
        cartBtnWrapper.classList.add('hidden')
        itemCount.innerHTML = 0
        cartContainer.innerHTML = '<td class="w-full text-center"> سبد خرید خالی است!</td>'
    }
}

clearAllBtn.addEventListener('click', () => {
    fetch(`https://restaurant-ea95e-default-rtdb.firebaseio.com/users/${userid}/cart.json`, {
        method: 'DELETE',
    })
        .then(() => {
            cartContainer.innerHTML = '<td class="w-full text-center"> سبد خرید خالی است!</td>'
            cartBtnWrapper.classList.remove('flex')
            cartBtnWrapper.classList.add('hidden')
            totalPriceContainer.classList.remove('block')
            totalPriceContainer.classList.add('hidden')
            itemCount.innerHTML = '0'
        })
        .catch(err => console.log(err))
})

async function removeHandler(encodedItem, cartArray){
    let item = JSON.parse(decodeURIComponent(encodedItem));
    let cart = JSON.parse(decodeURIComponent(cartArray));

    // Find target item array
    let targetArray = cart.filter(food => food[0].id === item.id);

    // Filter out the target item from the cart
    let filteredCart = cart.filter(food => food[0].id !== item.id);

    console.log('cart', cart);
    console.log('item', item);
    console.log('target', targetArray[0]);

    // Remove the last item from targetArray
    targetArray[0].pop();

    // Add targetArray back to filteredCart if it is not empty
    if (targetArray[0].length !== 0) {
        filteredCart.push(targetArray[0]);
    }

    // Delete existing cart
    await fetch(`https://restaurant-ea95e-default-rtdb.firebaseio.com/users/${userid}/cart.json`, {
        method: 'DELETE',
    });

    // Add updated items to the cart
    for (let array of filteredCart) {
        for (let item of array) {
            await fetch(`https://restaurant-ea95e-default-rtdb.firebaseio.com/users/${userid}/cart.json`, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(item)
            })
            .then(res => res.json())
            .then(res => console.log(res))
            .catch(err => console.error(err));
        }
    }

    // Fetch the final cart data
    let finalArray = await cartArrayLoader()
    updateCart(finalArray)
}

function clearCart(){
    fetch(`https://restaurant-ea95e-default-rtdb.firebaseio.com/users/${userid}/cart.json`, {
        method: 'DELETE',
    })
        .then(() => {
            cartContainer.innerHTML = '<td class="w-full text-center"> سبد خرید خالی است!</td>'
        })
}

function totalPriceCalc(array){
    let totalPrice = null

    array.forEach(itemGropu => {
        itemGropu.forEach(item => {
            totalPrice += +item.price
        })
    })

    return `${totalPrice} تومان`
}

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

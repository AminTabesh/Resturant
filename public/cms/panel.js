let $ = document

let Menu = null

let statusBtn = $.querySelector('#status-btn')
let statusSelect = $.querySelector('#status-select')
let btnsArray = $.querySelectorAll('.cms-menu-item')
let mainArea = $.querySelector('#main-area')
let generalBtn = $.querySelector('#general')
let completedOrdersBtn = $.querySelector('#compeleted-orders')
let menuBtn = $.querySelector('#menu-change')
let mainContainer = $.querySelector('.body')
let ordersContainer = $.querySelector('.orders')
let orderModal = $.querySelector('.full-order-modal')
let orderSender = $.querySelector('.order-sender')
let orderFull = $.querySelector('.order-full')
let orderModalClose = $.querySelector('.full-order-close')
let usersBtn = $.querySelector('#users')


window.addEventListener('load', () => {
    selectUpdater()
    ordersUpdater(ordersContainer)
})

statusBtn.addEventListener('click', updateStatus)


btnsArray.forEach(btn => {
    btn.addEventListener('click', (e) => {
        btnsArray.forEach(button => {
            button.classList.remove('bg-teal-500')
            button.classList.remove('text-white')
        })
        e.target.classList.add('bg-teal-500', 'text-white')
    })
})

// Configuring 'General' button
generalBtn.addEventListener('click', () => {
    

    mainArea.innerHTML = `
    <div class="status-wrapper flex gap-5 items-center">
            <label for="status">وضعیت رستوران:</label>
            <select name="status" id="status-select" class="focus:outline-none border p-2 rounded-2xl">
              <option value="open">در حال سفارش گیری</option>
              <option value="closed">بسته</option>
            </select>
            <button id="status-btn" class="bg-teal-500 text-white py-2 px-4 rounded-2xl transition-colors hover:bg-teal-600">اعمال</button>
          </div>
          
          <p class="text-4xl font-semibold text-center mt-5">سفارشات</p>
          
          <div class="orders  h-3/4 rounded-2xl overflow-y-auto mt-5 border">
            
          </div>
    `

    statusBtn = $.querySelector('#status-btn')
    statusSelect = $.querySelector('#status-select')
    selectUpdater()
    ordersUpdater($.querySelector('.orders'))
    statusBtn.addEventListener('click', updateStatus)
})
completedOrdersBtn.addEventListener('click', () => {
    
    mainArea.innerHTML = `
          
          <p class="text-3xl font-semibold text-center mt-5">سفارشات تکمیل شده</p>
          
          <div class="compeleted-orders  h-3/4 rounded-2xl overflow-y-auto mt-5 border">
            
          </div>
    `

    let container = $.querySelector('.compeleted-orders')

    compeletdOrdersUpdater(container)
})

usersBtn.addEventListener('click', () => {
    mainArea.innerHTML = `
          
          <p class="text-3xl font-semibold text-center mt-5">لیست کاربران</p>
          
          <div class="users-list  h-3/4 rounded-2xl overflow-y-auto mt-5 border">
            
          </div>
    `

    let container = $.querySelector('.users-list')
    showUsers(container)
})

function showUsers(container){
    container.innerHTML = ''
    fetch('https://restaurant-ea95e-default-rtdb.firebaseio.com/users.json')
        .then(res => res.json())
        .then(res => {
            let array = Object.entries(res)
            array.forEach(user => {
                container.insertAdjacentHTML('beforeend', `
                    <div class="menu-item odd:bg-gray-200 even:bg-white w-full min-h-20 flex px-5 items-center justify-between relative pl-48" dir="ltr">
                    <p class="item-title text-lg font-semibold">Username: ${user[1].username}</p>
                    <p class="item-title text-lg font-semibold">Email: ${user[1].email}</p>
                    <p class="item-price text-lg font-semibold">password: ${user[1].password}</p>
                    <div class="item-btns flex flex-col h-full w-40 absolute left-0">
                        
                        <button class="w-full h-full text-xl font-semibold bg-red-500 transition-colors hover:bg-red-600 text-white" onclick="userDel('${encodeURIComponent(JSON.stringify(user))}')">حذف</button>
                    </div>
                    `)
            })
        })
}

async function userDel(encodedUser){
    let user = JSON.parse(decodeURIComponent(encodedUser))
    await fetch(`https://restaurant-ea95e-default-rtdb.firebaseio.com/users/${user[0]}.json`, { method: 'DELETE' })
        .then(res => console.log(res))

    showUsers($.querySelector('.users-list'))
}

function updateStatus(){
    let value = statusSelect.value
        let status = { value }
        fetch('https://restaurant-ea95e-default-rtdb.firebaseio.com/status.json', {
            method: 'PUT',
            headers: {
                "Content-type": "application/json"
            },
            body:
                JSON.stringify(status)
        }).then(res => console.log(res))
            .catch(err => console.log(err))
}

function selectUpdater(){
    fetch('https://restaurant-ea95e-default-rtdb.firebaseio.com/status.json')
    .then(res => res.json())
    .then(res => {
        statusSelect.value = res.value
    })
}


// Configuring 'Menu Change' button
menuBtn.addEventListener('click', () => {

    //Showing all foods
    mainArea.innerHTML = `
    <div class="menu-conteiner flex flex-col w-full h-[420px] overflow-y-auto rounded-2xl gap-2">
                
            </div>
            <button id="add-btn" class='py-2 px-4 bg-teal-500 text-white transition-colors hover:bg-teal-600 text-xl font-semibold rounded-2xl mt-8'>اضافه کردن آیتم جدید</button>
    `

    let menuItemsContainer = $.querySelector('.menu-conteiner')
    updateFoods(menuItemsContainer)
    let addBtn = $.querySelector('#add-btn')
    let addModal = $.querySelector('.add-modal')

        addBtn.addEventListener('click', () => {
            showModal(addModal)
            $.querySelector('.add-cancel').addEventListener('click', () => {
                hideModal(addModal)
                $.querySelector('.modal-message').classList.add('hidden')
            })
            $.querySelector('.add-verify').addEventListener('click', () => {
                let name = $.querySelector('#modal-name-input').value
                let price = $.querySelector('#modal-price-input').value
                let img = $.querySelector('#modal-image-input').value
                let className = $.querySelector('#modal-class-input').value

                if(name && price && img){

                    let newFood = {
                        name,
                        price,
                        img,
                        class: className
                    }


                    fetch('https://restaurant-ea95e-default-rtdb.firebaseio.com/menu.json', {
                        method: 'POST',
                        headers: {
                            "Content-type": "application/json"
                        },
                        body:
                            JSON.stringify(newFood)
                    })
                        .then(() => {
                            menuItemsContainer.innerHTML = ''
                            updateFoods(menuItemsContainer)
                            $.querySelector('.modal-message').classList.add('hidden')
                            hideModal(addModal) 
                            
                            
                        })

                }else{
                    $.querySelector('.modal-message').classList.remove('hidden')
                    $.querySelector('.modal-message').classList.add('block')
                }

                
                
            })

        })
})

function showModal(modal){
    mainContainer.classList.add('blur-sm', 'brightness-50')
    modal.classList.remove('hidden')
    modal.classList.add('flex')
    modal.classList.add('opacity-100')
}

function hideModal(modal){
    modal.classList.add('hidden')
    modal.classList.remove('opacity-100')
    mainContainer.classList.remove('blur-sm', 'brightness-50')
}

function updateFoods(container){
    container.innerHTML = ''
    let array = null
    fetch('https://restaurant-ea95e-default-rtdb.firebaseio.com/menu.json')
        .then(res => res.json())
        .then(res => {
            array = Object.entries(res)
            array.forEach(item => {
                let itemJson = encodeURIComponent(JSON.stringify(item))
                container.insertAdjacentHTML('beforeend', `
                    <div class="menu-item odd:bg-gray-200 even:bg-white w-full min-h-20 flex px-5 items-center justify-between relative pl-48">
                    <p class="item-title text-2xl font-semibold">${item[1].name}</p>
                    <p class="item-price text-2xl font-semibold">${item[1].price} تومان</p>
                    <div class="item-btns flex flex-col h-full w-40 absolute left-0">
                        <button class="w-full h-full text-xl font-semibold bg-orange-500 transition-colors hover:bg-orange-600 text-white" onclick="foodEditHandler('${itemJson}')">ویرایش</button>
                        <button class="w-full h-full text-xl font-semibold bg-red-500 transition-colors hover:bg-red-600 text-white" onclick="foodRemoveHandler('${itemJson}')">حذف</button>
                    </div>
                    `)
            })
        })
        .catch(() => {
            container.innerHTML = "خطا در دریافت اطلاعات!"
        })
}

function foodRemoveHandler(itemJson){
    let item = JSON.parse(decodeURIComponent(itemJson))
    let menuItemsContainer = $.querySelector('.menu-conteiner')
    console.log(item);
    showModal($.querySelector('.remove-modal'))
    let removeMessage = $.querySelector('.remove-message')
    removeMessage.innerHTML = `آیا از حذف ${item[1].name} اطمینان دارید؟`

    let removeAccept = $.querySelector('.remove-verify')
    let removeDecline = $.querySelector('.remove-cancel')

    removeAccept.addEventListener('click', () => {
        fetch(`https://restaurant-ea95e-default-rtdb.firebaseio.com/menu/${item[0]}.json`, {
            method: 'DELETE'
        })
            .then(res => {
                console.log(res)
                updateFoods(menuItemsContainer)
                hideModal($.querySelector('.remove-modal'))
            })
            .then(() => {

            })
    })
    removeDecline.addEventListener('click', () => {
        hideModal($.querySelector('.remove-modal'))
    })
}


function foodEditHandler(itemJson){
    let item = JSON.parse(decodeURIComponent(itemJson))[1]
    let itemID = JSON.parse(decodeURIComponent(itemJson))[0]
    let nameInput = $.querySelector('#edit-modal-name-input')
    let priceInput = $.querySelector('#edit-modal-price-input')
    let imageInput = $.querySelector('#edit-modal-image-input')
    let classNameInput = $.querySelector('#edit-modal-class-input')
    let acceptBtn = $.querySelector('.edit-verify')
    let declineBtn = $.querySelector('.edit-cancel')
    let menuItemsContainer = $.querySelector('.menu-conteiner')

    nameInput.value = item.name
    priceInput.value = item.price
    imageInput.value = item.img
    classNameInput.value = item.class
    showModal($.querySelector('.edit-modal'))

    acceptBtn.addEventListener('click', () => {
        let newFood = {
            class: classNameInput.value,
            name: nameInput.value,
            img: imageInput.value,
            price: priceInput.value,
        }
        fetch(`https://restaurant-ea95e-default-rtdb.firebaseio.com/menu/${itemID}.json`, {
            method: 'PUT',
            headers:{
                "Content-type": "application/json"
            },
            body:
                JSON.stringify(newFood)
        })
            .then(res => console.log(res))
            .then(() => {
                updateFoods(menuItemsContainer)
                hideModal($.querySelector('.edit-modal'))
            })
            .catch(err => console.log(err))
    })

    declineBtn.addEventListener('click', () => { 
        hideModal($.querySelector('.edit-modal'))
    })
    
}


//Configuring 'Tickets' button

let messagesBtn = $.querySelector('#messages')
let messageModal = $.querySelector('.full-modal')
let messageModalClose = $.querySelector('.message-close')
let messageModalSender = $.querySelector('.message-sender')
let messageModalContent = $.querySelector('.message-full')

messagesBtn.addEventListener('click', messageClickHandler);

function getMessages() {
    return fetch('https://restaurant-ea95e-default-rtdb.firebaseio.com/tickets.json')
        .then(res => res.json())
        .then(res => {
            if(res){
               return Object.entries(res)
            }
        })
}

function showMessages(array, container){
    let ticketsArray = []
    console.log(array);
    array.forEach(item => {
        let newObj = {
            sender: item[1].sender,
            content: item[1].content,
            id: item[0],
        }
        ticketsArray.push(newObj)
    })
    container.innerHTML = ''

    if(ticketsArray){
        ticketsArray.forEach(item => {
            let messagePreview = null
            if(item.content.length > 45){
               messagePreview = item.content.substring(0, 45)
            }else{
                messagePreview = item.content
            }
            let encyptedItem = encodeURIComponent(JSON.stringify(item))
            container.insertAdjacentHTML('beforeend', `
                <div class="message-prev overflow-hidden bg-gray-200 rounded-2xl flex flex-col w-72 h-80 justify-evenly p-5 gap-3">
                        <p class="justify-self-start font-semibold">نام فرستنده: <span class="sender-name">${item.sender}</span></p>
                        <p class="justify-self-start w-64 text-wrap">متن پیام: <span class="message-content w-64 text-wrap">${messagePreview} ...</span></p>
                        <div class="btn-wrapper flex w-full items-center justify-center gap-2">
                            <button class="bg-teal-500 text-white rounded-2xl py-2 px-3 w-11/12 self-center transition-colors hover:bg-teal-600" onclick="messageShowBtnHandler('${encyptedItem}')">مشاهده کامل</button>
                            <button class="bg-red-500 text-white rounded-2xl py-2 px-3 w-11/12 self-center transition-colors hover:bg-red-600" onclick="messageDeleteBtnHandler('${encyptedItem}')">حذف پیام</button>
                        </div>
    
            </div>
                `)
        })
        
    }else{
        container.innerHTML = 'خطا در دریافت اطلاعات!'
    }
}

function messageShowBtnHandler(content){
    let messageobj = JSON.parse(decodeURIComponent(content))
    messageModalSender.innerHTML = `نام فرستنده: ${messageobj.sender}`
    messageModalContent.innerHTML = `متن پیام: ${messageobj.content}`
    showModal(messageModal)
    messageModalClose.addEventListener('click', () => {
        hideModal(messageModal)
    })
}

async function messageDeleteBtnHandler(content, container){
    let messageobj = JSON.parse(decodeURIComponent(content))

    await fetch(`https://restaurant-ea95e-default-rtdb.firebaseio.com/tickets/${messageobj.id}.json`,{
        method: 'DELETE',
    })
        .then(res => console.log(res))
    
        messageClickHandler()
}

async function messageClickHandler(){
    mainArea.innerHTML = `
    <div class="message-container flex-row flex overflow-y-auto gap-5 flex-wrap justify-center">
    </div>
    `;
    let container = document.querySelector('.message-container');
    let messagesArray = await getMessages();
    if(messagesArray){
        
        showMessages(messagesArray, container)
    }else{
        container.innerHTML = 'پیامی جهت نمایش وجود ندارد!'
    }
}

function ordersUpdater(container) {
    fetch('https://restaurant-ea95e-default-rtdb.firebaseio.com/orders.json')
        .then(res => res.json())
        .then(res => {

            container.innerHTML = ''
            for (let item in res) {
                if (res[item].status === false) {
                    container.insertAdjacentHTML('beforeend', `
                        <div class="cms-order w-full h-40 flex even:bg-white odd:bg-gray-200">
                            <div class="h-200-full w-5/6 flex flex-col p-5 gap-2 justify-center">
                                <div class="flex gap-2 text-lg font-medium">
                                    <p>آیدی کاربر:</p>
                                    <p>${res[item].username}</p>
                                </div>
                                <div class="flex gap-4 text-2xl max-h-[50%]">
                                   <p>سفارشات: <span class="order-str">${orderToString(JSON.parse(res[item].order))}</span></p>
                                   <button onclick="showAllHandler('${encodeURIComponent(JSON.stringify(res[item]))}')" class="all-order text-sm bg-yellow-500 py-2 px-3 rounded-2xl hover:bg-yellow-600 transition-colors text-white">مشاهده همه</button>
                                </div>
                            </div>
                            <button class="bg-teal-500 w-1/6 h-full text-white font-semibold text-xl transition-colors hover:bg-teal-600" onclick="statusHandler('${encodeURIComponent(JSON.stringify(res[item]))}', '${item}')">برای تکمیل کلیک کنید</button>
                        </div>
                    `);
                }
            }
        });
}
function compeletdOrdersUpdater(container) {
    fetch('https://restaurant-ea95e-default-rtdb.firebaseio.com/orders.json')
        .then(res => res.json())
        .then(res => {

            container.innerHTML = ''
            for (let item in res) {
                if (res[item].status === true) {
                    container.insertAdjacentHTML('beforeend', `
                        <div class="cms-order w-full h-40 flex even:bg-white odd:bg-gray-200">
                            <div class="h-200-full w-5/6 flex flex-col p-5 gap-2 justify-center">
                                <div class="flex gap-2 text-lg font-medium">
                                    <p>آیدی کاربر:</p>
                                    <p>${res[item].username}</p>
                                </div>
                                <div class="flex gap-4 text-2xl max-h-[50%]">
                                   <p>سفارشات: <span class="order-str">${orderToString(JSON.parse(res[item].order))}</span></p>
                                   <button onclick="showAllHandler('${encodeURIComponent(JSON.stringify(res[item]))}')" class="all-order text-sm bg-yellow-500 py-2 px-3 rounded-2xl hover:bg-yellow-600 transition-colors text-white">مشاهده همه</button>
                                </div>
                            </div>
                            <button class="bg-red-500 w-1/6 h-full text-white font-semibold text-xl transition-colors hover:bg-red-600" onclick="orderDeleter('${item}')">برای حذف کلیک کنید</button>
                        </div>
                    `);
                }
            }
        });
}

async function orderDeleter(orderID){
    await fetch(`https://restaurant-ea95e-default-rtdb.firebaseio.com/orders/${orderID}.json`, { method: 'DELETE' })
        .then(res => console.log(res))
    compeletdOrdersUpdater($.querySelector('.compeleted-orders'))
}
        
function showAllHandler(encodedOrderObj){
    let orderObj = JSON.parse(decodeURIComponent(encodedOrderObj))
    orderSender.innerHTML = `نام کاربر: ${orderObj.username}`
    orderFull.innerHTML = orderToStringFull(JSON.parse(orderObj.order))
    showModal(orderModal)
    
}
function orderToString(array){
    let string = ''
    array.forEach((item, index) => {
        if(array.length - 1 !== index){
            string += `${item[0].name} (${item.length})، `

        }else{
            string += `${item[0].name} (${item.length})`
        }
    })
    if(string.length > 48){
        return string.substring(0, 48) + ' ...'
    }else{
        return string
    }
}
function orderToStringFull(array){
    let string = ''
    array.forEach((item, index) => {
        if(array.length - 1 !== index){
            string += `${item[0].name} (${item.length})، `

        }else{
            string += `${item[0].name} (${item.length})`
        }
    })
    
    return string
}

orderModalClose.addEventListener('click', () => {
    hideModal(orderModal)
})

async function statusHandler(encodeditem, orderID){
    let order = JSON.parse(decodeURIComponent(encodeditem))
    console.log(orderID);
    order.status = true
    console.log(order);

    await fetch(`https://restaurant-ea95e-default-rtdb.firebaseio.com/orders/${orderID}.json`, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body:
            JSON.stringify(order)
    })
        .then(res => console.log(res))
    
    ordersUpdater($.querySelector('.orders'))
}
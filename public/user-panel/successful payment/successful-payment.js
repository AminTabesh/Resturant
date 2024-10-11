let continueBtn = document.querySelector('.continue-btn')
let counter = document.querySelector('.counter')

let searchParams = new URLSearchParams(location.search)
let userid = searchParams.get('id')


addOrder()

async function addOrder() {
    let username = await getUsername()
    let orderObj = {
        userid,
        username,
        status: false,
        order: sessionStorage.getItem('cart')
    }
    
    console.log(orderObj);

    await deleteUserCart()
    await postNewOrder(orderObj)
    await HandlePage()
}

async function getUsername() {
    let username = await fetch(`https://restaurant-ea95e-default-rtdb.firebaseio.com/users/${userid}.json`)
    .then(res => res.json())
    .then(res => res.username)

    return username
}

async function deleteUserCart(){
    fetch(`https://restaurant-ea95e-default-rtdb.firebaseio.com/users/${userid}/cart.json`, {
            method: 'DELETE',
        }).then(res => console.log(res))
}

async function postNewOrder(obj){
    fetch('https://restaurant-ea95e-default-rtdb.firebaseio.com/orders.json', {
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json"
                    },
                    body:
                        JSON.stringify(obj)
                })
                    .then(res => console.log(res))
}

async function HandlePage(){
    continueBtn.addEventListener('click', () => {
                        location.href = `/public/user-panel/user-panel.html?id=${userid}`
                    })
                    
                    
                    setInterval(() => {
                        if ( +counter.innerHTML > 0 ) {
                            counter.innerHTML = +counter.innerHTML - 1
                        }else{
                            counter.innerHTML = 0
                            clearInterval()
                            location.href = `/public/user-panel/user-panel.html?id=${userid}`
                        }
                    }, 1000)
}
const backendUrl = `https://api.accbuddy.com/public`
let cart = getShoppingCart()
let product
let customer
const token = getAccessToken()
if (cart) {
    product = fetchProductById(cart.itemID)
}
let qty = 1
let total = 0
let checked;
function getShoppingCart() {
    let cart = localStorage.getItem('cart')
    if (cart) {
        return JSON.parse(cart)
    }
    return undefined
}
function removeShoppingCart() {
    localStorage.removeItem('cart')

}
function getAccessToken() {
    let authenticationResult = localStorage.getItem('AuthenticationResult')
    if (authenticationResult) {
        return JSON.parse(authenticationResult).AccessToken
    }
    return undefined
}
async function fetchProductById(productID) {
    const payload = {
        fetchProductByID: {
            productID
        }

    }
    return fetch(backendUrl, {
        method: 'POST',
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(data => data.result)

}
async function fetchCustomerByAccessToken(accessToken) {
    const payload = {
        fetchCustomer: true

    }
    let headers = new Headers();
    headers.set('Authorization', accessToken);
    return fetch(backendUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(data => data.result)

}

function generateUUID() {
    let d = new Date().getTime();
    let d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16;
        if (d > 0) {
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}


if (token) {
    customer = fetchCustomerByAccessToken(token)
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function openPopup() {
    disableppButon()
    removeShoppingCart()
    disableInputs()
    product = await product;
    customer = await customer
    let payload = {
        ppCreateOrder: {
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: (total).toString()
                    }
                }
            ]
        },
        shoppingCartData: {
            quantity: qty.toString(),
            itemID: cart.itemID.replace('productID-', ''),
            discount: customer?.customerDiscount?.toString() || "0",
            customerID: customer?.PK || `guest-${generateUUID()}`
        }
    }
    let headers = new Headers();
    headers.set('Authorization', token);
    const url = await fetch(backendUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(data => data.response)

    
    window.location.href = url;
    /*
    const popup = window.open(url, 'newwindow', 'width=600,height=600')
    while (!popup?.closed) {
        console.log('not closed')
        await sleep(1000)
    }

    

    const paypalId = url.split('?token=')[1]

    console.log(paypalId)
    payload = {
        createShopOrderId: paypalId
    }
    try {
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => data.response)
        window.location.href = `./payment-receved.html?email=${response.email}&orderId=${response.shopId}`;
    }
    catch (e) {
        window.location.href = "./payment-failed.html";
    }
    */

}
function disableppButon() {
    const ppButton = document.getElementById('pp-button');

    // Disable the button and change the text to "Processing"
    ppButton.classList.add('inactive');
    const originalButtonText = ppButton.innerHTML;
    ppButton.innerHTML = 'Processing...';
    return originalButtonText
}
function enableppButon(originalButtonText) {
    const ppButton = document.getElementById('pp-button');

    ppButton.classList.remove('inactive');
    ppButton.innerHTML = originalButtonText;
}
function showButton(selectedId) {
    console.log('clicked')
    //uncheck other inputs
    let checkboxes = document.getElementsByName('checkbox');

    checkboxes.forEach(function (checkbox) {
        if (checkbox.id !== selectedId) {
            checkbox.checked = false;
        }
        else {
            checked = checkbox.checked
            checked && undoHighlight()
        }
    });



    let ppButton = document.getElementById('pp-button')
    let buyButton = document.getElementById('buy-button')
    if (selectedId === 'abPayment1' && checked) {
        buyButton.style.display = "none";
        ppButton.style.display = "flex";
    }

    else {
        ppButton.style.display = "none";
        buyButton.style.display = "flex";
    }


}
document.addEventListener("DOMContentLoaded", async function () {

    if (!cart) {
        document.getElementById('loading-screen-message').innerText = "shopping cart is empty"
        let marchantDetails = document.querySelector(".ab-order-title.ab-violate-color");
        marchantDetails.innerHTML = "Shopping card is empty";
    }
    // Modify logo
    const { productDescr, productImageUrl, productName, productImageText, productQty, productWarning } = await product

    token && showAccountLinkSidebarAndAuthButton()

    let logo = document.querySelector('.ab-order-account-icons');

    if (logo) {
        logo.src = productImageUrl;
        logo.alt = productImageText;
    }
    // Modify "Gmail.com PVA"
    let title = document.querySelector('.ab-order-info-title.ab-violate-color');
    if (title) {
        title.innerHTML = productName;
    }

    // Modify the content of the <p> element
    let description = document.querySelector('.ab-order-info-desc');
    if (description) {
        description.innerHTML = productDescr;
    }
    let availableSpan = document.querySelector('.ab-available-quantity span');
    if (availableSpan) {
        availableSpan.innerHTML = productQty;
    }


    let noteDesc = document.querySelector('.ab-note-desc');
    if (noteDesc) {
        noteDesc.innerHTML = productWarning;
    }
    await calculateTotal()

    let preloaderScreen = document.querySelector('.ab-preloader-screen');

    // Check if the div element exists
    if (preloaderScreen) {
        // Remove the div element from its parent
        preloaderScreen.parentNode.removeChild(preloaderScreen);
    }


})

async function calculateTotal() {

    let quantitySpan = document.getElementById('quantity-input');

    const { productPrice } = await product



    // Change price
    let priceSpan = document.querySelector('.ab-order-price');
    if (priceSpan) {
        priceSpan.innerHTML = `$${productPrice}`;
    }
    const discount = (await customer)?.customerDiscount || 0
    // Change your discount
    let discountSpan = document.querySelector('.ab-discount-title + .ab-order-price');
    if (discountSpan) {
        discountSpan.innerHTML = `-$${productPrice * parseInt(quantitySpan.value) * discount / 100}`;
    }
    qty = parseInt(quantitySpan.value)
    total = productPrice * parseInt(quantitySpan.value) * (1 - discount / 100)

    // Change amount due
    let amountDueSpan = document.querySelector('.ab-due-title + .ab-order-price');
    if (amountDueSpan) {
        amountDueSpan.innerHTML = `$${total}`;
    }

    //warning total amount
    if (total > 20) {
        document.getElementById('checkbox-container').classList.add('warning-payment');
    }
    else {
        document.getElementById('checkbox-container').classList.remove('warning-payment');
    }
    const availableQty = (await product).productQty
    //warning quantity
    if (qty > availableQty) {

        document.getElementById('quantity-container').classList.add('warning-qty')
        document.getElementById('quantity-warning').innerHTML = `only ${availableQty} are available`
        document.getElementById('quantity-input').classList.add('ab-quantity-warning')

    }
    else {
        document.getElementById('quantity-container').classList.remove('warning-qty')
        document.getElementById('quantity-input').classList.remove('ab-quantity-warning')
    }
}
function showAccountLinkSidebarAndAuthButton() {
    const elements = document.querySelectorAll(".ab-main--sidebar-content ul.account-info-items");
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = "block";
    }
    document.getElementById('auth-button').style.display = 'flex'
}
function highlightInputs() {
    const checkboxContainer = document.getElementById("all-checkbox-container");
    document.getElementById("no-merchant-selected").classList.remove('hidden')
    checkboxContainer.classList.add("highlight");
}

function undoHighlight() {
    const checkboxContainer = document.getElementById("all-checkbox-container");
    document.getElementById("no-merchant-selected").classList.add('hidden')
    checkboxContainer.classList.remove("highlight");
}
function buy() {
    console.log(checked)
    if (!checked) {
        console.log('not checked')
        highlightInputs()
    }
}
function disableInputs() {
    const checkbox1 = document.getElementById("abPayment1");
    checkbox1.disabled = true;
    const checkbox2 = document.getElementById("abPayment2");
    checkbox2.disabled = true;
}
// Get the query parameters from the URL
const urlParams = new URLSearchParams(window.location.search);
const backendUrl = `https://api.accbuddy.com/public`
// Retrieve the email and order ID from the query parameters
const email = urlParams.get('email');
const orderID = `orderID-${urlParams.get('orderId')}`;
const accessToken = getAccessToken()
let order = fetchOrderById()

let product = order.then((order) => fetchProductById(`productID-${order.orderProductID}`))
const link = generateOrderLink().catch((e)=> undefined)
document.addEventListener("DOMContentLoaded", async function () {

    order = await order;
    product = await product
    accessToken && showSideBar()
    
    // Replace values in the HTML code
    const productNameElement = document.getElementById('productName');
    const productImageElement = document.getElementById('productImage');
    await new Promise(r => setTimeout(r, 100));
    const productDescriptionElement = document.getElementById('productDescription');

    productNameElement.textContent = product.productName;
    productImageElement.src = product.productImageUrl;
    productDescriptionElement.textContent = product.productDescr;

    // Replace order details
    const quantityElement = document.querySelector('.ab-quantity-number');
    const priceElement = document.querySelector('.ab-order-price');
    const warningElement = document.querySelector('.ab-note-desc');
    const discountElement = document.getElementById('discount');
    const totalElement = document.getElementById('total');

    totalElement.textContent = `$${order.totalPaid}`;
    discountElement.textContent = `-$${order.orderDiscount}`;
    warningElement.textContent = product.productWarning;
    quantityElement.textContent = order.productsOrdered;
    priceElement.textContent = "$" + product.productPrice;
    // Replace order info list
    let orderNumberElement = document.querySelector('.ab-order-info-desc');
    let orderDateElement = orderNumberElement.parentElement.nextElementSibling.querySelector('.ab-order-info-desc');
    let orderStatusElement = orderDateElement.parentElement.nextElementSibling.querySelector('.ab-order-info-desc');

    orderNumberElement.textContent = "№ " + order.PK.replace('orderID-', '');
    orderDateElement.textContent = formatDate(order.orderTimestamp);
    orderStatusElement.textContent = order.orderPublicStatus;
    
    const text = (await link)?.text;
    console.log('text:'+ text)
    if(text){
        let accountInfoElement = document.querySelector('.ab-account-info-list');
        accountInfoElement.innerHTML = text
        document.getElementById('accounts-box').style.display = 'block'
    }
    let preloaderScreen = document.querySelector('.ab-preloader-screen');
    
    // Check if the div element exists
    if (preloaderScreen) {
        // Remove the div element from its parent
        preloaderScreen.parentNode.removeChild(preloaderScreen);
    }

})
function formatDate(timestamp) {
    let date = new Date(timestamp * 1000);
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}
function getAccessToken() {
    let authenticationResult = localStorage.getItem('AuthenticationResult')
    if (authenticationResult) {
        return JSON.parse(authenticationResult).AccessToken
    }
    return undefined
}
async function fetchOrderById() {
    const payload = {
        getOrder: {
            orderID,
            email
        }

    }
    let headers = new Headers();
    accessToken && headers.set('Authorization', accessToken);
    return fetch(backendUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(data => data.result)

}
async function generateOrderLink() {
    const payload = {
        generateOrderLink: {
            orderID,
            email
        }

    }
    let headers = new Headers();
    accessToken && headers.set('Authorization', accessToken);
    return fetch(backendUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
    })
        .then(response => {
            if (!response.ok) {
                // create error object and reject if not a 2xx response code
                let err = new Error("HTTP status code: " + response.status)
                err.response = response
                err.status = response.status
                throw err
            }
            return response.json()
       })
        .then(data => data.result)

}
async function fetchProductById(productID) {
    console.log(productID)
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
function showSideBar() {
    const elements = document.querySelectorAll(".ab-main--sidebar-content ul.account-info-items");
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = "block";
    }
    document.getElementById('auth-button').style.display = 'flex'
}
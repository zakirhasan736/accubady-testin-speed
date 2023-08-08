document.addEventListener('DOMContentLoaded', function () {
    setProductsAvailability()
    addClickListenerAttr1();
    addClickListenerAttr2()
});

function addClickListenerAttr1() {
    const buttonsContainer = document.getElementById('att1-buttons');
    if (buttonsContainer) {
        const buttons = buttonsContainer.getElementsByClassName('account-tabs-btn');
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', function () {
                const buttonText = this.textContent;
                if (buttonText.includes('All')) {
                    filterByName('')
                    showPromoTable()
                    makeTheadInvisible()
                    return
                }
                makeTheadVisible()
                hidePromo()
                filterByButton(buttonText);
            });
        }
    }
}

function addClickListenerAttr2() {
    const buttons = document.querySelectorAll('.ab-account-category-tabs button');

    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            /*hideAllTable()*/
            buttons.forEach(function (btn) {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            const buttonText = this.textContent.replaceAll(' ', '');
            
            filterByButtonPromoTable(buttonText)
            //hideAttr1Buttons()
        });
    });
}




function search() {
    const searchTerm = document.getElementById('search').value;
    console.log(searchTerm)
    if (searchTerm.length > 0) {
        makeTheadVisible()
        hidePromo()
        hideAttr1Buttons()
    } else {
        makeTheadInvisible()
        showPromoTable()
        showAttr1Buttons()
    }

    filterByName(searchTerm)
}
function filterByButtonPromoTable(buttonText) {
    const table = document.getElementById('promo-table');
    const rows = table.querySelectorAll('tbody tr');
    let activeRows = 0;
    rows.forEach(row => {
        const classList = row.classList
        if (classList.value.toLowerCase().includes(buttonText.toLowerCase())) {
            activeRows++;
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    });
    const noSearchResultRow = table.querySelector('.no-search-result');
    const searchKeywords = noSearchResultRow.querySelector('.search-keywords');
    const notFoundText = noSearchResultRow.querySelector('.not-fount-text');

    if (activeRows === 0) {
        searchKeywords.textContent = buttonText;
        notFoundText.style.display = 'block';
        noSearchResultRow.style.display = 'table-row';
    } else {
        notFoundText.style.display = 'none';
        noSearchResultRow.style.display = 'none';
    }
}
function filterByButton(buttonText) {
    const table = document.getElementById('all-acounts-table');
    const rows = table.querySelectorAll('tbody tr');
    let activeRows = 0;
    rows.forEach(row => {
        const classList = row.classList
        console.log(classList)
        if (classList.contains(buttonText.split(' ')[0].toLowerCase().replace(/ /g, '.'))) {
            row.style.display = 'table-row';
            activeRows++;
        } else {
            row.style.display = 'none';
        }
    });
    const noSearchResultRow = table.querySelector('.no-search-result');
    const searchKeywords = noSearchResultRow.querySelector('.search-keywords');
    const notFoundText = noSearchResultRow.querySelector('.not-fount-text');

    if (activeRows === 0) {
        searchKeywords.textContent = buttonText;
        notFoundText.style.display = 'block';
        noSearchResultRow.style.display = 'table-row';
    } else {
        notFoundText.style.display = 'none';
        noSearchResultRow.style.display = 'none';
    }
}
function filterByName(name) {
    const table = document.getElementById('all-acounts-table');
    const rows = table.querySelectorAll('tbody tr');
    let activeRows = 0;

    rows.forEach(row => {
        const productName = row.querySelector('td:nth-child(1)').textContent;
        const rowClass = row.getAttribute('class');

        if (productName.toLowerCase().includes(name.toLowerCase()) && rowClass !== 'no-search-result') {
            row.style.display = 'table-row';
            activeRows++;
        } else {
            row.style.display = 'none';
        }
    });

    const noSearchResultRow = table.querySelector('.no-search-result');
    const searchKeywords = noSearchResultRow.querySelector('.search-keywords');
    const notFoundText = noSearchResultRow.querySelector('.not-fount-text');

    if (activeRows === 0) {
        searchKeywords.textContent = name;
        notFoundText.style.display = 'block';
        noSearchResultRow.style.display = 'table-row';
    } else {
        notFoundText.style.display = 'none';
        noSearchResultRow.style.display = 'none';
    }
}




function makeTheadVisible() {
    var theadElement = document.getElementById('filter-head');

    if (theadElement) {
        theadElement.style.display = 'table-header-group';
    }
}

function makeTheadInvisible() {
    var theadElement = document.getElementById('filter-head');

    if (theadElement) {
        theadElement.style.display = 'none';
    }
}








function showPromoTable() {
    var promoContainer = document.getElementById('promo-container');

    if (promoContainer) {
        promoContainer.style.display = 'block';
    }
}
function hideAllTable() {
    var allContainer = document.getElementById('all-table-container');

    if (allContainer) {
        allContainer.style.display = 'none';
    }
}
function hidePromo() {
    var promoContainer = document.getElementById('promo-container');

    if (promoContainer) {
        promoContainer.style.display = 'none';
    }
}
function hideAttr1Buttons() {
    var promoContainer = document.getElementById('att1-buttons');

    if (promoContainer) {
        promoContainer.style.display = 'none';
    }
}
function showAttr1Buttons() {
    var promoContainer = document.getElementById('att1-buttons');

    if (promoContainer) {
        promoContainer.style.display = 'flex';
    }
}

// sorting 
// Global variables to keep track of the sorting order
function sortTableByProvider(promo) {
    const id = (promo === 'promo') ? 'promo-table' : "all-acounts-table"
    var table = document.getElementById(id);
    var rows = table.getElementsByTagName("tr");
    var switching = true;
    var i, x, y, shouldSwitch;
    
    while (switching) {
        switching = false;
        for (i = 2; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("td")[0];
            console.log(rows[i])
            y = rows[i + 1].getElementsByTagName("td")[0];
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}

function sortTableByProviderDes(promo) {
    const id = (promo === 'promo') ? 'promo-table' : "all-acounts-table"
    var table = document.getElementById(id);
    var rows = table.getElementsByTagName("tr");
    var switching = true;
    var i, x, y, shouldSwitch;
    
    while (switching) {
        switching = false;
        for (i = 2; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("td")[0];
            y = rows[i + 1].getElementsByTagName("td")[0];
            if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}
function sortTableByQuantity(promo) {
    const id = (promo === 'promo') ? 'promo-table' : "all-acounts-table"
    var table = document.getElementById(id);
    var rows = table.getElementsByTagName("tr");
    var switching = true;
    var i, x, y, shouldSwitch;
    
    while (switching) {
        switching = false;
        for (i = 3; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            console.log(rows[i])
            x = parseInt(rows[i].getElementsByTagName("td")[1].innerHTML);
            y = parseInt(rows[i + 1].getElementsByTagName("td")[1].innerHTML);
            if (x > y) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}
function sortTableByQuantityDes(promo) {
    const id = (promo === 'promo') ? 'promo-table' : "all-acounts-table"
    var table = document.getElementById(id);
    var rows = table.getElementsByTagName("tr");
    var switching = true;
    var i, x, y, shouldSwitch;
    
    while (switching) {
        switching = false;
        for (i = 3; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = parseInt(rows[i].getElementsByTagName("td")[1].innerHTML);
            y = parseInt(rows[i + 1].getElementsByTagName("td")[1].innerHTML);
            if (x < y) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}
function sortTableByPrice(promo) {
    const id = (promo === 'promo') ? 'promo-table' : "all-acounts-table"
    var table = document.getElementById(id);
    var rows = table.getElementsByTagName("tr");
    var switching = true;
    var i, x, y, shouldSwitch;
    
    while (switching) {
        switching = false;
        for (i = 3; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = parseFloat(rows[i].getElementsByTagName("td")[2].querySelector("span").innerHTML.replace("$", ""));
            y = parseFloat(rows[i + 1].getElementsByTagName("td")[2].querySelector("span").innerHTML.replace("$", ""));
            if (x > y) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}
function sortTableByPriceDes(promo) {
    const id = (promo === 'promo') ? 'promo-table' : "all-acounts-table"
    var table = document.getElementById(id);
    var rows = table.getElementsByTagName("tr");
    var switching = true;
    var i, x, y, shouldSwitch;
    
    while (switching) {
        switching = false;
        for (i = 3; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = parseFloat(rows[i].getElementsByTagName("td")[2].querySelector("span").innerHTML.replace("$", ""));
            y = parseFloat(rows[i + 1].getElementsByTagName("td")[2].querySelector("span").innerHTML.replace("$", ""));
            if (x < y) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}
function setProductsAvailability(){
    const rows = document.querySelectorAll(".ab-account-table tbody tr");
    
    for(const row of rows){
        // Get the product quantity cell
        const productQtyCell = row.querySelector("td:nth-child(2)");
        
        if(!productQtyCell)continue
    
        // Check the product quantity value
        const productQty = parseInt(productQtyCell.innerHTML);
        if (productQty === 0) {
            row.classList.add('not-available')
            row.classList.remove('active')
        } else {
            row.classList.remove('not-available')
            row.classList.add('active')
        }
    }
}
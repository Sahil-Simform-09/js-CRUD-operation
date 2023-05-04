// array of all products
const productsArray = [];
const fillArray = function() {
    if(productsArray.length === 0) {
        let keys = Object.keys(localStorage);
        keys.forEach( key => {
            productsArray.push(JSON.parse(localStorage.getItem(key)));
        });
    }
}
fillArray();
// validation function
const showError = function(error) { 
    console.log(error);
}
const valid = function(product) {
    return new Proxy(product, {
        get: function(obj, prop) {
            if(!obj[prop]) {
               showError(`${prop} dosen't exist on the target object.`); 
            }
        },
        set: function(obj, prop, value) {
            if(prop === "productPrice" && typeof value !== "number") {
                showError(`please provide numeric value for ${prop} property`);
            }
            else {
                obj[prop] = value;
            }
        }
    });
}

// genrate umique Id
const genrateId = function() {
    const now = new Date(); // create a new Date object with the current date and time

    const year = now.getFullYear();
    const month = now.getMonth(); 
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds(); 

    // format the date and time as a string (e.g. "2023-05-03 12:34:56")
    const dateTimeString = `${year}${month.toString()}${day.toString()}${hours.toString()}${minutes.toString()}${seconds.toString()}`;

    return dateTimeString;
}
// convert byte to megabyte
const bytesToMegabytes = function(bytes) {
    const megabytes = bytes / (1024 * 1024);
    return megabytes;
}


const addOrEditProduct = function(crearteOrEdit, editProductId) {
    // get all details for a product
    const productForm = document.querySelector(".create-product");
    productForm.addEventListener("submit", event => {

        event.preventDefault();

        const productName = document.getElementById("product-name").value;
        const productDescription = document.getElementById("product-description").value;
        const productPrice = Number(document.getElementById("product-price").value);
        const productImage = document.getElementById("product-image").files[0];
        const messageDiv = document.querySelector(".message");
        const productId = genrateId();
        const product = {};
        const productProxy = valid(product);

        //set properties to object
        productProxy.productName = productName;
        productProxy.productDescription = productDescription;
        productProxy.productId = productId;
        productProxy.productPrice = productPrice;

        const reader = new FileReader();
        reader.readAsDataURL(productImage);

        reader.addEventListener('load', () => {
            // Get the data URL of the image file
            const imageURL = reader.result;
            productProxy.productImageUrl = imageURL;  
            
            localStorage.setItem(productId.toString(), JSON.stringify(product));
            productsArray.push(product);

            const message = document.querySelector(".message");
            message.innerHTML = "Product added successfully";
            message.style.display = "block";
            setTimeout(() => {
                message.style.display = "none";
            }, 1500);
        });

    });
}
const createCard = function(oneProduct) {

    // add product into productsArray
    return `<div class="product-card">
            <div class="item">
                <p class="name">Id: ${oneProduct.productId}</p>
                <p class="name"> ${oneProduct.productName}</p>
                <img src="${oneProduct.productImageUrl}" alt="${oneProduct.productName}-image">
                <p class="price">${oneProduct.productPrice}</p>
                <p class="desc">${oneProduct.productDescription}</p>
            </div>
            <div class="buttons">
                <div class="delete" id="d${oneProduct.productId}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path fill="#000" d="M15 3a1 1 0 0 1 1 1h2a1 1 0 1 1 0 2H6a1 1 0 0 1 0-2h2a1 1 0 0 1 1-1h6Z"></path><path fill="#000" fill-rule="evenodd" d="M6 7h12v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7Zm3.5 2a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 1 0v-9a.5.5 0 0 0-.5-.5Zm5 0a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 1 0v-9a.5.5 0 0 0-.5-.5Z" clip-rule="evenodd"></path></svg></button>
                </div>
                <div class="edit" id="e${oneProduct.productId}">
                   
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5,18H9.24a1,1,0,0,0,.71-.29l6.92-6.93h0L19.71,8a1,1,0,0,0,0-1.42L15.47,2.29a1,1,0,0,0-1.42,0L11.23,5.12h0L4.29,12.05a1,1,0,0,0-.29.71V17A1,1,0,0,0,5,18ZM14.76,4.41l2.83,2.83L16.17,8.66,13.34,5.83ZM6,13.17l5.93-5.93,2.83,2.83L8.83,16H6ZM21,20H3a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2Z"></path></svg>
                  
                </div>
            </div>
        </div>`;
}
const viewProduct = function(isSort) {

    let productContainer = document.querySelector(".product-container");
    if(isSort) {
        productContainer.innerHTML = "";
    }
    // get all keys
    productsArray.forEach( product => {
        const productCardOne = createCard(product);
        productContainer.innerHTML += productCardOne;
    });
}
const visisbleButton = function() {
    const viewProductButton = document.querySelector(".view");
    viewProductButton.style.display = "block";
}
const filterProduct = function() {
    let productContainer = document.querySelector(".product-container");
    let idFromInput = document.querySelector(".filter input").value;
    
    const index = productsArray.findIndex(object => {
        return object.productId === idFromInput;
    });
    productContainer.innerHTML = createCard(productsArray.splice(index, 1)[0]);

    visisbleButton();
}
const getclickedButton = function(event) {
    const clickedButton = event.target;
    if(clickedButton.id === "sort") {
        return  document.getElementById("sort").value;
    }
    return clickedButton.id;
}
const sortProducts = function(byWhich) {
    productsArray.sort((a,b) => (a[byWhich] > b[byWhich]) ? 1 : ((b[byWhich] > a[byWhich]) ? -1 : 0));
}
const functionality = function() {
    let viewProductContainer = document.querySelector(".view-product");
    viewProductContainer.addEventListener("click", event => {;
        const clickedButton =  getclickedButton(event);
        if(clickedButton.toString() !== "null") {
            switch (clickedButton) {
                case "filter-product":
                    filterProduct();
                    break;
                case "id":
                    sortProducts("productId");
                    viewProduct(true);
                    break;
                case "price":
                    sortProducts("productPrice");
                    viewProduct(true);
                    break;
                case "name":
                    sortProducts("productName");
                    viewProduct(true);
                    break;
                case clickedButton:
                    if(clickedButton.length > 0) {
                        let getDiv = document.getElementById(clickedButton).parentNode.parentNode;
                        if(clickedButton.charAt(0) === "d") {
                            deleteProduct(clickedButton.substring(1, clickedButton.length), getDiv);
                        } else if(clickedButton.charAt(0) === "e") {
                            // const formName = document.querySelector("form p");
                            // formName.innerHTML = "Edit Product Here";
                            // addOrEditProduct("edit", clickedButton.substring(1, clickedButton.length));
                            // window.location.href = "/create.html";
                        }
                    }
                    break;
                default:   
                    break;
            }
        }
    });
}
const deleteProduct = function(clickedButtonId, productCard) {
    if(localStorage.length > 0) {
        const productToDelete = JSON.parse(localStorage.getItem(clickedButtonId));
        const index = productsArray.findIndex(object => {
            return object.productId === clickedButtonId;
        });
        productsArray.splice(index, 1);
        localStorage.removeItem(clickedButtonId);
        productCard.remove();
    } else {
        showError("localstorage is empty");
    }
}

const url = window.location.pathname;
if(url === "/index.html") {
    viewProduct(false);
    functionality();
} else if(url === "/create.html") {
    visisbleButton();
    addOrEditProduct("create");
}

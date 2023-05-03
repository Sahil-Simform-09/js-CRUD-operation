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

// get main content
let mainContainer = document.querySelector(".main-content");

//get buttons
const createNewProductBtn = document.querySelector(".create");
const viewProductsBtn = document.querySelector(".view");

createNewProductBtn.addEventListener("click", event => {
    mainContainer.innerHTML = `<form class="create-product">
                                <div class="form-feild">
                                    <label for="product-name">Product Name:</label>
                                    <input type="text" id="product-name" name="product-name" required>
                                </div>
                                
                                <div class="form-feild">
                                    <label for="product-description">Product Description:</label>
                                    <textarea id="product-description" name="product-description" required></textarea>
                                </div>

                                <div class="form-feild">
                                    <label for="product-price">Product Price:</label>
                                    <input type="number" id="product-price" name="product-price" required>
                                </div>
                                
                                <div class="form-feild">
                                    <label for="product-image">Product Image:</label>
                                    <input type="file" id="product-image" name="product-image" accept="image/*" required>
                                </div>
                                
                                <div class="form-feild">
                                    <button type="submit" class="submit">Add Product</button>
                                </div>
                            </form>   
                            `;
    addOrEditProduct();
});

viewProductsBtn.addEventListener("click", () => {
    createNewProductBtn.style.display = "block";
    viewProductsBtn.style.display = "none";
    viewProduct();
})

const addOrEditProduct = function() {
    // get all details for a product
    const productForm = document.querySelector(".create-product");
    productForm.addEventListener("submit", event => {

        event.preventDefault();

        const productName = document.getElementById("product-name").value;
        const productDescription = document.getElementById("product-description").value;
        const productPrice = Number(document.getElementById("product-price").value);
        const productImage = document.getElementById("product-image").files[0];
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
        });
    });

    createNewProductBtn.style.display = "none";
    viewProductsBtn.style.display = "block";
}
const viewProduct = function() {

    mainContainer.innerHTML = `<div class="view-product">
                                <div class="product-container">
                                </div>
                                <div class="sort-filter">
                                    <div class="filter">
                                        <input type="number" placeholder="Search Product By Id">
                                        <button>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="search"><g data-name="Layer 2"><path d="m20.71 19.29-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8 7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zM5 11a6 6 0 1 1 6 6 6 6 0 0 1-6-6z" data-name="search"></path></g></svg>
                                        </button>
                                    </div>
                                    <div class="sort">
                                    <label for="">Sort</label>
                                        <select name="sorting" id="">
                                            <option value="id">By Id</option>
                                            <option value="name">By Name</option>
                                            <option value="price">By Price</option>
                                        </select>
                                    </div>
                            </div>
                            </div>`

    let productContainer = document.querySelector(".product-container");
    // get all keys
    const keys = Object.keys(localStorage);
    keys.forEach(key => {

        const productString = localStorage.getItem(key);
        const oneProduct = JSON.parse(productString);
    
        const productName = oneProduct.productName;
        const productDescription = oneProduct.productDescription;
        const productPrice = oneProduct.productPrice;
        const productImageUrl = oneProduct.productImageUrl;

        productContainer.innerHTML += `<div class="product-card">
                                            <div class="item">
                                                <p class="name">${productName}</p>
                                                <img src="${productImageUrl}" alt="${productName}-image">
                                                <p class="price">${productPrice}</p>
                                                <p class="desc">${productDescription}</p>
                                            </div>
                                            <div class="buttons">
                                                <div class="delete">
                                                    <button><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" id="delete"><path fill="#000" d="M15 3a1 1 0 0 1 1 1h2a1 1 0 1 1 0 2H6a1 1 0 0 1 0-2h2a1 1 0 0 1 1-1h6Z"></path><path fill="#000" fill-rule="evenodd" d="M6 7h12v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7Zm3.5 2a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 1 0v-9a.5.5 0 0 0-.5-.5Zm5 0a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 1 0v-9a.5.5 0 0 0-.5-.5Z" clip-rule="evenodd"></path></svg></button>
                                                </div>
                                                <div class="edit">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="edit"><path d="M5,18H9.24a1,1,0,0,0,.71-.29l6.92-6.93h0L19.71,8a1,1,0,0,0,0-1.42L15.47,2.29a1,1,0,0,0-1.42,0L11.23,5.12h0L4.29,12.05a1,1,0,0,0-.29.71V17A1,1,0,0,0,5,18ZM14.76,4.41l2.83,2.83L16.17,8.66,13.34,5.83ZM6,13.17l5.93-5.93,2.83,2.83L8.83,16H6ZM21,20H3a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2Z"></path></svg>
                                                </div>
                                            </div>
                                      </div>`
    });
}
viewProduct();

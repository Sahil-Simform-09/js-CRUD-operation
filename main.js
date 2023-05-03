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

const addProduct = function() {
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
}
const viewProduct = function() {

    // get productContainer
    let productContainer = document.querySelector(".all-product");


    // get all keys
    const keys = Object.keys(localStorage);
    keys.forEach( async key => {

        const productString = await localStorage.getItem(key);
        const oneProduct = JSON.parse(productString);
    
        const productName = oneProduct.productName;
        const productDescription = oneProduct.productDescription;
        const productPrice = oneProduct.productPrice;
        const productImageUrl = oneProduct.productImageUrl;

        productContainer.innerHTML += `<div class="product-card">
                                        <p class="name">${productName}</p>
                                        <img src="${productImageUrl}" alt="${productName}-image">
                                        <p class="price">${productPrice}</p>
                                        <p class="desc">${productDescription}</p>
                                     </div>`
    });
}

// route functionality
const urlPageTitle = "Prodcut";
const navBar = document.querySelector("nav");
navBar.addEventListener("click", event => {
    event.preventDefault();
    urlRoute(event);
});

// create an object that maps the url to the template, title, and description
const urlRoutes = {
	"/": {
		template: "/templates/index.html",
		title: "create | " + urlPageTitle,
	},
	"/edit": {
		template: "/templates/edit.html",
		title: "Edit | " + urlPageTitle,
	},
	"/view": {
		template: "/templates/view.html",
		title: "View | " + urlPageTitle,
	},
}

// create a function that watches the url and calls the urlLocationHandler
const urlRoute = (event) => {
	event.preventDefault();

	// window.history.pushState(state, unused, target link);
	window.history.pushState({}, "", event.target.href);
    console.log(event.target.href);
	urlLocationHandler();
};

// create a function that handles the url location
const urlLocationHandler = async () => {

	const location = window.location.pathname; // get the url path
	// if the path length is 0, set it to primary page route

    console.log(location);
	// if (location.length == 0) {
	// 	location = "/";
	// }

	// get the route object from the urlRoutes object
	const route = urlRoutes[location];

	// get the html from the template
	const html = await fetch(route.template).then((response) => response.text());

	// set the content of the content div to the html
	document.querySelector(".content").innerHTML = html;
	// set the title of the document to the title of the route
	document.title = route.title;

    switch (location) {
        case "/":
            addProduct();
            break;

        case "/view":
            viewProduct();
            break;  

        default:
            break;
    }
};

// call the urlLocationHandler function to handle the initial url
urlLocationHandler();
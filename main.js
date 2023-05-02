// validation function
const valid = function(product) {
    return new Proxy(product, {
        get: function(obj, prop) {
            if(!obj[prop]) {
               return `${prop} dosen't exist on the target object.`; 
            } else {
                console.log(`The ${prop} is ${obj[prop]}.`);
            }
        },
        set: function(obj, prop, value) {
            if((prop === "productPrice" || prop === "productId") && typeof value !== "number") {
                return `please provide numeric value for ${prop} property`;
            }
            else {
                obj[prop] = value;
            }
        }
    });
}
const addProduct = function() {
    // get all details for a product
    const productForm = document.querySelector(".create-product");
    productForm.addEventListener("submit", event => {

        event.preventDefault();

        const productName = document.getElementById("product-name").value;
        const productDescription = document.getElementById("product-description").value;
        const productPrice = document.getElementById("product-price").value;
        const productImage = document.getElementById("product-image").files[0];
        const productId = localStorage.length + 1;

        console.log(document.getElementById("product-image").size);
        
        const product = {};
        const productProxy = valid(product);

        //set properties to object
        productProxy.productName = productName;
        productProxy.productDescription = productDescription;
        console.log(productProxy.productPrice = productPrice);
        productProxy.productId = productId;

        const reader = new FileReader();
        reader.readAsDataURL(productImage);

        reader.addEventListener('load', () => {
            // Get the data URL of the image file
            const imageURL = reader.result;
            productProxy.productImageUrl = imageURL;  
            
            console.log(productProxy.productPrice);
        });
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
	404: {
		template: "/templates/404.html",
		title: "404 | " + urlPageTitle,
	},
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
	urlLocationHandler();
};

// create a function that handles the url location
const urlLocationHandler = async () => {
	const location = window.location.pathname; // get the url path
	// if the path length is 0, set it to primary page route

    console.log(location);
	if (location.length == 0) {
		location = "/";
	}

	// get the route object from the urlRoutes object
	const route = urlRoutes[location] || urlRoutes["404"];

	// get the html from the template
	const html = await fetch(route.template).then((response) => response.text());

	// set the content of the content div to the html
	document.querySelector(".content").innerHTML = html;
	// set the title of the document to the title of the route
	document.title = route.title;

    if(location === "/") {
        addProduct();
    }
};

// call the urlLocationHandler function to handle the initial url
urlLocationHandler();
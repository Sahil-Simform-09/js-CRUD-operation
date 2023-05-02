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

    if(location === "/images") {
        carousel();
    }
};

// call the urlLocationHandler function to handle the initial url
urlLocationHandler();
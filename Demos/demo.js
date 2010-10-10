(function(){

// This is our main handler that loads content from any URL
var myURLHandler = function(url){
	// Load URL via XHR
	
	new Request.HTML({
		url: url,
		onSuccess: function(tree, elements, html){
			document.body.set('html', html); // Change all content of the body with the newly loaded content
			update(); // Add the listeners again
		}
	}).get();
};

// Add the handler to the History change event
History.addEvent('change', myURLHandler);

// The listener that manages all clicks
var listener = function(event){
	event.preventDefault(); // Prevent following the URL
	
	var href = this.get('href'); // Get the URL
	History.push(href); // Push the new URL
};

// Listener for the "Back" link
var back = function(event){
	event.preventDefault();

	History.back(); // Go back
};

// We use this method to update all links on the page and to attach the listener
var update = function(){
	// Even if we execute this method more than once, the listeners only get added once per element
	
	// Add the click listener to all anchor elements, ignore outbound links and links with the data-noxhr property
	document.getElements('a:not([href=#]):not([href^=http://]):not([data-noxhr])').addEvent('click', listener);
	
	// The back link
	document.getElement('a[href=#]').addEvent('click', back);
};

// Call update initially to add the listener to all elements present on the initial page load
window.addEvent('domready', update);

// Handle the initial load of the page if the browser does not support pushState, check if the hash is set
if (!History.hasPushState()) window.addEvent('domready', function(){
	// Check if there is a hash
	var hash = document.location.hash.substr(1);
	if (!hash) return;
	
	// If the hash equals the current page, don't do anything
	var path = document.location.pathname.split('/');
	path = path[path.length - 1];
	if (hash == path) return;
	
	// Load the page specified in the hash
	myURLHandler(hash);
});

})();
History
=======

History Management via popstate or hashchange. Replaces the URL of the page without a reload and falls back to Hashchange on older
browsers.

![Screenshot](http://cpojer.net/Logo/history.png)

This Plugin is part of MooTools [PowerTools!](http://cpojer.net/PowerTools).

* [Build PowerTools!](http://cpojer.net/PowerTools)
* [Fork PowerTools!](https://github.com/cpojer/PowerTools)

Build
-----

Build via [Packager](http://github.com/kamicane/packager), requires [MooTools Core](http://github.com/mootools/mootools-core) and [MooTools Class-Extras](http://github.com/cpojer/mootools-class-extras) to be registered to Packager already

	packager register /path/to/history
	packager build History/* > history.js

To build this plugin without external dependencies use

	packager build History/* +use-only History > history.js

Demo
----

See Demos/index.html

How To Use
----------

This plugin provides a History object.

Add a new URL

	History.push('/some/url');

Handle URL Change (via back button etc.)

	History.addEvent('change', function(url){
		// The URL has changed!
		
		// Let's reload the content
		new Request(url).get();
	});
	
Shortcuts (more or less useful)	
	
	History.hasPushState(); // true if the Browser is modern and supports window.history.pushState
 
	History.back(); // Goes back
	
	History.forward(); // Goes forward

Plugins
-------

In addition there is also an optional module that can handle the initial state of your application. It redirects the browser to the URL a user would expect, based on browser features.

Use it to wrap your whole page code or put it on top of your scripts (right after loading History)

	if (!History.handleInitialState()) (function(){
		// Execute normal page load activities such as add something to domready etc.
	})();

Or standalone:

	History.handleInitialState();

This method will always return false if the user has pushState and only will return true if the page redirects the browser to another page in case the hashchange event is being used (ie. in older browsers).

If you use this plugin this is what happens in your application:

	// If the user has pushState and goes to index.html
	nothing happens, returns false
	// If the user has pushState and goes to index.html#other.html
	the history change event is being fired and changes to 'other.html', returns false

	// If the user doesn't have pushState and goes to index.html
	nothing happens, returns false
	// If the user doesn't have pushState and goes to some/path/page.html
	the page redirects and reloads the page to example.com/#some/path/page.html, returns true
	// If the user doesn't have pushState and goes to some/path/page.html#another/page.html
	the page redirects and reloads the page to example.com/#another/page.html, returns true

In addition the method takes the argument of the baseURL of your application. In an application that acts on the root of your web server you can omit this argument. If your page lives in a subfolder of your application you can specify it as a base parameter:

	History.handleInitialState('/blog/');

For more information on this plugin please see the demo.

Notes
-----

The `onChange` event does not fire for the initial page load. The HTML5 specification for the native `popstate` event suggests that `popstate` should be fired when the page initially loads. However, as of February 2011, browser implementations diverge in this aspect. The `onChange` event of History is designed to never fire for the initial page load. Handling this state should be done manually on a per-app basis as the use cases greatly vary. A pointer on how to handle the initial state can be the optional History.handleInitialState plugin as explained above.

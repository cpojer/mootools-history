History
=======

History Management via popstate or hashchange. Replaces the URL of the page without a reload and falls back to Hashchange on older
browsers.

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

Note that the Demo is quite rudimentary but you should get the idea!

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

Notes
-----

The `onChange` event does not fire for the initial page load. The HTML5 specification for the native `popstate` event suggests that `popstate` should be fired when the page initially loads. However, as of February 2011, browser implementations diverge in this aspect. The `onChange` event of History is designed to never fire for the initial page load. Handling this state should be done manually on a per-app basis as the use cases greatly vary.

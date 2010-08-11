/*
---

name: History

description: History Management via popstate or hashchange.

authors: Christoph Pojer (@cpojer)

license: MIT-style license.

requires: [Core/Events, Core/Element.Event, Class-Extras/Class.Binds]

provides: History

...
*/

(function(){

var events = Element.NativeEvents,
	location = window.location,
	history = window.history,
	hasPushState = ('pushState' in history),
	event = hasPushState ? 'popstate' : 'hashchange';

this.History = new new Class({

	Implements: [Class.Binds, Events],

	initialize: hasPushState ? function(){
		events[event] = 2;
		window.addEvent(event, this.bound('pop'));
	} : function(){
		events[event] = 1;
		window.addEvent(event, this.bound('pop'));

		this.hash = location.hash;

		if ('onhashchange' in window) return;
		this.timer = this.periodical.periodical(200, this);
	},

	push: hasPushState ? function(url, title, state){
		if (this.previous == url) return;

		history.pushState(state || null, title || null, url);
		this.previous = url;
		
		this.pop({event: {state: state || {}}});
	} : function(url){
		location.hash = url;
	},

	replace: hasPushState ? function(url, title, state){
		history.replaceState(state || null, title || null, url);
	} : function(url){
		this.hash = '#' + url;
		this.push(url);
	},

	pop: hasPushState ? function(event){
		var url = location.pathname;
		if (url != this.previous) this.previous = null;
		
		this.onChange(url, event.event.state);
	} : function(){
		var hash = location.hash;
		if (this.hash == hash) return;

		this.hash = hash;
		this.onChange(hash.substr(1));
	},

	onChange: function(url, state){
		this.fireEvent('change', [url, state]);
	},

	back: function(){
		history.back();
	},

	forward: function(){
		history.forward();
	},

	hasPushState: function(){
		return hasPushState;
	},

	periodical: function(){
		if (this.hash != location.hash) this.pop();
	}

});

})();
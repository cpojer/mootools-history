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
	getUrlPart = function(url){
		if(url.substr(0,8) == 'https://' || url.substr(0,7) == 'http://'){
			url = '/'+url.split('/').slice(3).join('/');
		}
		return url.split('#')[0];
	},
	base = getUrlPart(location.href),
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
		var hashchange = ('onhashchange' in window);
		if (!(hashchange && (document.documentMode === undefined || document.documentMode > 7)))
			this.timer = this.check.periodical(200, this);
	},

	getUrlPart: getUrlPart,

	push: hasPushState ? function(url, title, state){
		url = getUrlPart(url);
		if (base && base != url) base = null;
		
		history.pushState(state || null, title || null, url);
		this.onChange(url, state);
	} : function(url){
		location.hash = getUrlPart(url);
	},

	replace: hasPushState ? function(url, title, state){
		history.replaceState(state || null, title || null, getUrlPart(url));
	} : function(url){
		url = getUrlPart(url);
		this.hash = '#' + url;
		this.push(url);
	},

	pop: hasPushState ? function(event){
		var url = getUrlPart(location.href);
		if (url == base){
			base = null;
			return;
		}
		this.onChange(url, event.event.state);
	} : function(){
		var hash = location.hash;
		if (this.hash == hash) return;

		this.hash = hash;
		this.onChange(getUrlPart(hash.substr(1)));
	},

	onChange: function(url, state){
		this.fireEvent('change', [url, state || {}]);
	},

	back: function(){
		history.back();
	},

	forward: function(){
		history.forward();
	},
	
	getPath: function(){
		return hasPushState ? getUrlPart(location.href) : getUrlPart(location.hash.substr(1));
	},

	hasPushState: function(){
		return hasPushState;
	},

	check: function(){
		if (this.hash != location.hash) this.pop();
	}

});

}).call(this);

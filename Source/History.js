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

var Core = require('Core');
var Class = Core.Class;
var Events = Core.Events;
var Element = Core.Element;

var events = Element.NativeEvents,
	location = window.location,
	cleanURL = function(url){
		if (url.match(/^https?:\/\//)) url = '/' + url.split('/').slice(3).join('/');
		return url;
	},
	base = cleanURL(location.href),
	history = window.history,
	hasPushState = ('pushState' in history),
	event = hasPushState ? 'popstate' : 'hashchange';

events[event] = hasPushState ? 2 : 1;

var History = module.exports = new new Class({

	Implements: [Class.Binds, Events],

	initialize: function(){
		this.attach();

		if (hasPushState) return;

		this.hash = location.hash;
		var hashchange = ('onhashchange' in window);
		if (!(hashchange && (document.documentMode === undefined || document.documentMode > 7)))
			this.timer = this.check.periodical(200, this);
	},

	attach: function() {
		window.addEvent(event, this.bound('pop'));
	},

	detach: function() {
		window.removeEvent(event, this.bound('pop'));
	},

	cleanURL: cleanURL,

	push: hasPushState ? function(url, title, state){
		url = cleanURL(url);
		if (base && base != url) base = null;

		history.pushState(state || null, title || null, url);
		this.onChange(url, state);
	} : function(url){
		location.hash = cleanURL(url);
	},

	replace: hasPushState ? function(url, title, state){
		history.replaceState(state || null, title || null, cleanURL(url));
	} : function(url){
		url = cleanURL(url);
		this.hash = '#' + url;
		this.push(url);
	},

	pop: hasPushState ? function(event){
		var url = cleanURL(location.href);
		if (url == base){
			base = null;
			return;
		}
		this.onChange(url, event.event.state);
	} : function(){
		var hash = location.hash;
		if (this.hash == hash) return;

		this.hash = hash;
		this.onChange(cleanURL(hash.substr(1)));
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
		return cleanURL(hasPushState ? location.href : location.hash.substr(1));
	},

	hasPushState: function(){
		return hasPushState;
	},

	check: function(){
		if (this.hash != location.hash) this.pop();
	}

});

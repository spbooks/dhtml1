/*	EventCache Version 1.0
	Copyright 2005 Mark Wubben

	Provides a way for automagically removing events from nodes and thus preventing memory leakage.
	See <http://novemberborn.net/javascript/event-cache> for more information.
	
	This software is licensed under the CC-GNU LGPL <http://creativecommons.org/licenses/LGPL/2.1/>
*/

/*	Implement array.push for browsers which don't support it natively.
	Please remove this if it's already in other code */
if(Array.prototype.push == null){
	Array.prototype.push = function(){
		for(var i = 0; i < arguments.length; i++){
			this[this.length] = arguments[i];
		};
		return this.length;
	};
};

/*	Event Cache uses an anonymous function to create a hidden scope chain.
	This is to prevent scoping issues. */
var EventCache = function(){
	var listEvents = [];
	
	return {
		listEvents : listEvents,
	
		add : function(node, sEventName, fHandler, bCapture){
			listEvents.push(arguments);
		},
	
		flush : function(){
			var i, item;
			for(i = listEvents.length - 1; i >= 0; i = i - 1){
				item = listEvents[i];
				
				if(item[0].removeEventListener){
					item[0].removeEventListener(item[1], item[2], item[3]);
				};
				
				/* From this point on we need the event names to be prefixed with 'on" */
				if(item[1].substring(0, 2) != "on"){
					item[1] = "on" + item[1];
				};
				
				if(item[0].detachEvent){
					item[0].detachEvent(item[1], item[2]);
				};
				
				item[0][item[1]] = null;
			};
		}
	};
}();

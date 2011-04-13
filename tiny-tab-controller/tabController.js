if(!TINY) var TINY = {};

/* takes object

this is a factory object. it needs to be instantiated via the function call:

var myNav = TINY.tabController(config);

This will create a new object of type TINY.tabController and store it on the myNav variable. (myNav could be any variable name or object property; I just did it this way for the example.

The HTML structure has to have: 

VIEWS: the views held together by a container that has display: none and height: 0 set by default. The views MUST be direct descendants. All views must have display: none set by default.
TABS: the tabs held together by a container. They do not have to be direct descendents. The items that receive the event binding must have their href set to the ID of the corresponding view to show when it is clicked.

--- OR! ---

You can replace the decoupled animation methods with your own logic. Then your layout can be completely in yer own hands, control freak! <3

Event handlers must be bound manually, by you, and must pass the tab item (usually $(this) inside the function you bind to the element) so that the href attribute can be extracted in order to know which view to show.

Ex:

var myNav = TINY.tabController(config);

$("#tabs").find("li.tabs").click(function() {
	myNav.controller($tab);
	
});

{
	tabsContainer: $() - jQuery object with selector pointing to tabs parent
	viewsContainer: $() - jQuery object with selector pointing to views parent

}

*/
TINY.tabController = function(config) {
	var self = this;
	return {
		//takes a jquery object pertaining to the selected tab
		controller: function($tab){ 
			
			//get the view
			$view = $($tab.attr("href"));
			
			//check if it is already active, if so, close.
			if($tab.hasClass("active")) { 
				//close
				this.tabs._deactivate($tab);
				this.views._close($view);
				
			} else {
			//else, open.
				var $activeTab = config.tabsContainer.find(".active");
				
				//but do we have to close something first?
				if($activeTab.length>0) { 
					//special closeOpen method to preserve animation timing with callbacks
					this.tabs._deactivate($activeTab);
					this.tabs._activate($tab);
					this.views._closeOpen($view);
				} else { 
					//ok, regular open.
					this.tabs._activate($tab);
					this.views._open($view);
				}
			}	
		},
	
		tabs: {
			_deactivate: function($tab) {
				//remove highlight
				$tab.removeClass("active");
				
				//for good measure
				return $tab;
			},
			_activate: function($tab) { 
				//remove highlight
				$tab.addClass("active");
				
				//for good measure
				return $tab;
			}
		},
			
		views: {
			_open: function($view) {
				//get the view and height
				$view.addClass("active");
				var height = $view.outerHeight();
				
				//open the drawer
				$view.parent().animate({ height: height },700);
				
				//for good measure
				return $view;
			},
			_close: function($view) {
				//close the drawer
				$view.parent().animate({ height: 0 },500,function() {
					//remove display class as callback to preserve timing
					$view.removeClass("active");
				});
				
				//for good measure
				return $view;
			},
			//since the opening in this instance MUST be done as a callback, we need a special method to preserve timing.
			_closeOpen: function($view) { 
				var self = this;
				//close the drawer
				$view.parent().animate({ height: 0 },500,function() {
					//remove display class as callback to preserve timing
					config.viewsContainer.find(".active").removeClass("active");
					//open the drawer
					self._open($view);
				});
			}
		}
	};
};

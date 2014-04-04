
/* Add debounce

var chointReak = function(timeout, breakpointClasses) {
	function init() {
		createBreacons(breakpointClasses);
		bindResize();
		fireOnBreakpointChange();
	}

	init();
}
	
 */

var chointReak = function(timeout, breakpointClasses) {

	var viewport,
		oldViewport,
		breakpoints,
		resizeTimeout;

	var VIEWPORT_SNIFFER = 'viewport-sniffer';

	function init() {
		breakPoints = createBreacons(breakpointClasses);
		viewport = updateViewportState(breakPoints);
		oldViewport = viewport;

		bindResize(breakPoints);

		console.log(viewport);
		
	}

	function createBreacons(breakpointClasses) {
		var breakPointObject = {};

		var sniffer = document.createElement('section'),
			breakpoint;

		sniffer.setAttribute('id', VIEWPORT_SNIFFER);
		document.body.insertBefore(sniffer, document.body.firstChild);

		for (var breakpointKey in breakpointClasses) {
			breakpoint = document.createElement('div');
			breakpoint.setAttribute('class', breakpointClasses[breakpointKey]);
			sniffer.appendChild(breakpoint);

			breakPointObject[breakpointClasses[breakpointKey]] = breakpoint;
		}

		return breakPointObject;
	}

	function bindResize(breakPoints) {
		window.addEventListener('resize', function() {
			clearTimeout(resizeTimeout);

			resizeTimeout = setTimeout(function() {
				updateViewportState(breakPoints);
				console.log('boop');
			}, timeout);
		});
	}

	function updateViewportState(breakPoints) {
		for (var breakpoint in breakPoints) {
			var thisBreakpoint = breakPoints[breakpoint],
				event;

			// TODO: getComputedStyle doesn't work in ie8, need currentstyle maybe? http://snipplr.com/view/13523/
			if (getComputedStyle(thisBreakpoint)['display'] === 'block') {
				viewport = thisBreakpoint.getAttribute('class');

				if (oldViewport !== viewport) {
					// TODO: custom event doesn't work in ie8 as is
					if (window.CustomEvent) {
						var event = new CustomEvent('viewport.change');
					} else {
						var event = document.createEvent('CustomEvent');
						event.initCustomEvent('viewport.change', true, true);
					}

					document.dispatchEvent(event);

					console.log('viewport.change');

					oldViewport = viewport;
				}

				console.log(viewport);
				return viewport;
			}
		}
	}

	init();
};

var breakpointClasses = {};
breakpointClasses.small = 'small-screen';
breakpointClasses.medium = 'medium-screen';
breakpointClasses.large = 'large-screen';

var timeout = 400;

document.addEventListener('viewport.change', function() {
	console.log('boom shaka rob laplaca');
});

var mimsIsCool = new chointReak(timeout, breakpointClasses);
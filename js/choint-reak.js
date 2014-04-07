var chointReak = function(breakpointClasses, globalObject, timeout) {

	var oldViewport, resizeTimeout,
		VIEWPORT_SNIFFER = 'viewport-sniffer',
		VIEWPORT_EVENT = 'viewport.change';

	function init() {
		var breakPoints = createBeacons(breakpointClasses),
			viewport = updateViewportState(breakPoints),
			oldViewport = viewport;

		bindResize(breakPoints);
	}

	function createBeacons(breakpointClasses) {
		var sniffer = document.createElement('section'),
			breakPointObject = {},
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

	function updateViewportState(breakPoints) {
		for (var breakpoint in breakPoints) {
			var thisBreakpoint = breakPoints[breakpoint];

			if (getComputedStyle(thisBreakpoint)['display'] === 'block') {
				var viewport = thisBreakpoint.getAttribute('class');
				globalObject.viewport = viewport;

				if (oldViewport !== viewport) {
					var breakpointEvent = eventPolyfill(VIEWPORT_EVENT);
					document.dispatchEvent(breakpointEvent);
					oldViewport = viewport;
				}

				return viewport;
			}
		}
	}

	function eventPolyfill(customEvent, event) {
		if (window.CustomEvent) {
			event = new CustomEvent(customEvent);
		} else {
			event = document.createEvent('CustomEvent');
			event.initCustomEvent(customEvent, true, true);
		}

		return event;
	}

	function bindResize(breakPoints) {
		window.addEventListener('resize', function() {
			clearTimeout(resizeTimeout);

			resizeTimeout = setTimeout(function() {
				updateViewportState(breakPoints);
			}, timeout);
		});
	}

	init();
};

// global object to make viewport state a part of
var TEST = {};

var breakpointClasses = {};
breakpointClasses.small = 'small-screen';
breakpointClasses.medium = 'medium-screen';
breakpointClasses.large = 'large-screen';

var timeout = 400;

var mimsIsCool = new chointReak(breakpointClasses, TEST, timeout);

console.log(TEST.viewport);

document.addEventListener('viewport.change', function() {
	console.log(TEST.viewport);
});


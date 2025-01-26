/**
 * BusyLoad - A lightweight loading overlay library
 *
 * Creates loading overlays with customizable spinners and text.
 * Can be applied to specific elements or full screen.
 * No dependencies required.
 *
 * Usage examples:
 *
 * 1. Basic spinner on element:
 *	busyLoad.show('#my-element');
 *
 * 2. Customized spinner:
 *	busyLoad.show('#my-element', {
 *	  spinner: 'cube-grid',
 *	  text: 'Loading...',
 *	  color: '#fff',
 *	  background: 'rgba(0,0,0,0.5)'
 *	});
 *
 * 3. Full screen overlay:
 *	busyLoad.showFullScreen({text: 'Processing...'});
 *
 * 4. Hide spinners:
 *	busyLoad.hide(); // Hides any active spinner
 *	busyLoad.hide('#my-element'); // Hides specific spinner
 *	busyLoad.hideFullScreen(); // Hides full screen spinner
 */

const busyLoad = (function() {
	// Available spinner types from CSS
	const spinnerTypes = [
		'cube-grid', 'circle-line', 'circles', 'cube',
		'cubes', 'pump', 'pulsar', 'accordion'
	];

	// Default configuration options
	const defaults = {
		spinner: spinnerTypes[Math.floor(Math.random() * spinnerTypes.length)], // Random spinner if not specified
		color: "#fff",
		background: "rgba(0, 0, 0, 0.21)",
		maxSize: "50px",
		minSize: "20px",
		text: false,
		textColor: false,
		textMargin: ".5rem",
		textPosition: "right", // Position of text relative to spinner
		fontSize: "1rem",
		fullScreen: false,
		animation: false,
		animationDuration: 300,
		containerClass: "busy-load-container",
		containerItemClass: "busy-load-container-item",
		spinnerClass: "busy-load-spinner",
		textClass: "busy-load-text"
	};

	// Tracks active full screen loader for management
	let activeFullScreenLoader = null;

	/**
	 * Core BusyLoad class handling spinner creation and management
	 */
	class BusyLoad {
		constructor(element, options = {}) {
			this.element = typeof element === 'string' ? document.querySelector(element) : element;
			this.options = { ...defaults, ...options };
			this.containerId = null;
		}

		/**
		 * Displays the loading overlay
		 */
		show() {
			// Ensure proper positioning
			if (this.element.style.position === 'static') {
				this.element.style.position = 'relative';
			}

			const container = this._createContainer();
			const containerItem = this._createContainerItem();

			if (this.options.text) {
				containerItem.appendChild(this._createText());
			}

			containerItem.appendChild(this._createSpinner());
			container.appendChild(containerItem);

			this.element.appendChild(container);
			this._handleAnimation(container, 'show');

			this.element.classList.add('busy-load-active');
			this.containerId = container.id;
		}

		/**
		 * Removes the loading overlay
		 */
		hide() {
			const container = document.getElementById(this.containerId);
			if (!container) return;

			this._handleAnimation(container, 'hide');
			this.element.classList.remove('busy-load-active');
			this.containerId = null;
		}

		/**
		 * Handles show/hide animations if enabled
		 */
		_handleAnimation(container, action) {
			if (action === 'show') {
				if (this.options.animation) {
					container.style.opacity = '0';
					container.style.transition = `opacity ${this.options.animationDuration}ms`;
					requestAnimationFrame(() => container.style.opacity = '1');
				}
			} else {
				if (this.options.animation) {
					container.style.opacity = '0';
					setTimeout(() => container.remove(), this.options.animationDuration);
				} else {
					container.remove();
				}
			}
		}

		/**
		 * Creates the main container for the overlay
		 */
		_createContainer() {
			const container = document.createElement('div');
			container.className = this.options.containerClass;
			container.id = 'busy-load-' + Math.random().toString(36).substr(2, 9);

			// Get element dimensions and position
			const rect = this.element.getBoundingClientRect();
			const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
			const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

			Object.assign(container.style, {
				position: this.options.fullScreen ? 'fixed' : 'absolute',
				top: this.options.fullScreen ? '0' : rect.top + scrollTop + 'px',
				left: this.options.fullScreen ? '0' : rect.left + scrollLeft + 'px',
				background: this.options.background,
				color: this.options.color,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				width: this.options.fullScreen ? '100%' : rect.width + 'px',
				height: this.options.fullScreen ? '100%' : rect.height + 'px',
				zIndex: '9999'
			});

			return container;
		}

		/**
		 * Creates the container for spinner and text alignment
		 */
		_createContainerItem() {
			const containerItem = document.createElement('div');
			containerItem.className = this.options.containerItemClass;

			// Handle text positioning relative to spinner
			let flexDirection = 'row-reverse';
			switch (this.options.textPosition) {
				case "top": flexDirection = "column"; break;
				case "bottom": flexDirection = "column-reverse"; break;
				case "left": flexDirection = "row"; break;
			}

			Object.assign(containerItem.style, {
				background: 'none',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: flexDirection
			});

			return containerItem;
		}

		/**
		 * Creates the loading text element if enabled
		 */
		_createText() {
			const text = document.createElement('span');
			text.className = this.options.textClass;
			text.textContent = this.options.text;

			Object.assign(text.style, {
				color: this.options.textColor || this.options.color,
				fontSize: this.options.fontSize,
				margin: this.options.textMargin
			});

			return text;
		}

		/**
		 * Creates the spinner element based on selected type
		 */
		_createSpinner() {
			const spinner = document.createElement('div');
			spinner.className = `spinner-${this.options.spinner}`;

			// Create specific spinner type structure
			if (this.options.spinner === 'cube-grid') {
				for (let i = 1; i <= 9; i++) {
					const cube = document.createElement('div');
					cube.className = `sk-cube sk-cube${i}`;
					cube.style.backgroundColor = this.options.color;
					spinner.appendChild(cube);
				}
			} else if (this.options.spinner === 'circle-line') {
				for (let i = 1; i <= 3; i++) {
					const bounce = document.createElement('div');
					bounce.className = `bounce${i}`;
					bounce.style.backgroundColor = this.options.color;
					spinner.appendChild(bounce);
				}
			} else if (['circles', 'cubes'].includes(this.options.spinner)) {
				['dot1', 'dot2'].forEach(className => {
					const dot = document.createElement('div');
					dot.className = className;
					dot.style.backgroundColor = this.options.color;
					spinner.appendChild(dot);
				});
			} else if (this.options.spinner === 'pump') {
				['double-bounce1', 'double-bounce2'].forEach(className => {
					const bounce = document.createElement('div');
					bounce.className = className;
					bounce.style.backgroundColor = this.options.color;
					spinner.appendChild(bounce);
				});
			} else {
				spinner.style.backgroundColor = this.options.color;
			}

			Object.assign(spinner.style, {
				maxHeight: this.options.maxSize,
				maxWidth: this.options.maxSize,
				minHeight: this.options.minSize,
				minWidth: this.options.minSize
			});

			return spinner;
		}
	}

	/**
	 * Creates a new BusyLoad instance
	 */
	function create(element, options = {}) {
		const defaultsWithRandomSpinner = {
			...defaults,
			spinner: options.spinner || spinnerTypes[Math.floor(Math.random() * spinnerTypes.length)]
		};
		return new BusyLoad(element, { ...defaultsWithRandomSpinner, ...options });
	}

	/**
	 * Creates a full screen loading overlay
	 */
	function showFullScreen(options = {}) {
		if (activeFullScreenLoader) {
			activeFullScreenLoader.hide();
		}
		const loader = create(document.body, { ...options, fullScreen: true });
		document.body.style.overflow = 'hidden';
		loader.show();
		activeFullScreenLoader = loader;
		return loader;
	}

	// Public API
	return {
		show: (element, options) => {
			const loader = create(element, options);
			loader.show();
			return loader;
		},
		hide: (element) => {
			if (!element) {
				// Hide any active spinner if no element specified
				const activeSpinner = document.querySelector('.busy-load-container');
				if (activeSpinner) {
					const parentElement = activeSpinner.parentElement;
					activeSpinner.remove();
					parentElement.classList.remove('busy-load-active');
				}
				return;
			}

			const loaderElement = typeof element === 'string' ?
				document.querySelector(element) : element;
			const loaderId = loaderElement.querySelector('.' + defaults.containerClass)?.id;
			if (loaderId) {
				const container = document.getElementById(loaderId);
				container?.remove();
				loaderElement.classList.remove('busy-load-active');
			}
		},
		showFullScreen,
		hideFullScreen: () => {
			if (activeFullScreenLoader) {
				activeFullScreenLoader.hide();
				document.body.style.overflow = '';
				activeFullScreenLoader = null;
			}
		}
	};
})();

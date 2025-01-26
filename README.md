# BusyLoad

A lightweight, dependency-free JavaScript loading overlay library. Create loading spinners and overlays for specific elements or full screen.

## Features

- No dependencies
- Multiple animated spinner types
- Full screen or element-specific overlays
- Customizable colors, text, and animations
- Random spinner selection
- Responsive positioning

## Installation

```html
<link rel="stylesheet" href="busy-load.css">
<script src="busy-load.js"></script>
```

## Basic Usage

```javascript
// Show loading overlay on element
busyLoad.show('#my-element');

// Hide loading overlay
busyLoad.hide('#my-element');

// Show full screen overlay
busyLoad.showFullScreen();

// Hide full screen overlay
busyLoad.hideFullScreen();

// Hide any active overlay
busyLoad.hide();
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| spinner | string | random | Spinner type: 'cube-grid', 'circle-line', 'circles', 'cube', 'cubes', 'pump', 'pulsar', 'accordion' |
| color | string | '#fff' | Color of spinner and text |
| background | string | 'rgba(0,0,0,0.21)' | Background color of overlay |
| maxSize | string | '50px' | Maximum size of spinner |
| minSize | string | '20px' | Minimum size of spinner |
| text | string/false | false | Loading text (false for no text) |
| textColor | string/false | false | Text color (defaults to spinner color) |
| textMargin | string | '.5rem' | Margin between spinner and text |
| textPosition | string | 'right' | Text position: 'top', 'bottom', 'left', 'right' |
| fontSize | string | '1rem' | Text font size |
| animation | boolean/string | false | Fade animation: false, 'fade' |
| animationDuration | number | 300 | Animation duration in ms |

## Examples

### Custom Spinner
```javascript
busyLoad.show('#my-element', {
    spinner: 'cube-grid',
    color: '#3498db',
    background: 'rgba(255, 255, 255, 0.8)'
});
```

### Loading Text
```javascript
busyLoad.show('#my-element', {
    text: 'Loading...',
    textPosition: 'bottom',
    textColor: '#fff',
    fontSize: '1.2rem'
});
```

### Full Screen with Animation
```javascript
busyLoad.showFullScreen({
    spinner: 'circles',
    text: 'Processing...',
    animation: 'fade',
    animationDuration: 500,
    background: 'rgba(0, 0, 0, 0.75)'
});
```

### Random Spinner with Custom Size
```javascript
busyLoad.show('#my-element', {
    maxSize: '80px',
    minSize: '40px',
    background: 'rgba(52, 152, 219, 0.4)'
});
```

### Multiple Text Positions
```javascript
// Text on top
busyLoad.show('#element1', {
    text: 'Loading...',
    textPosition: 'top'
});

// Text on left
busyLoad.show('#element2', {
    text: 'Processing...',
    textPosition: 'left'
});
```

### Programmatic Hide
```javascript
// Hide after 3 seconds
const loader = busyLoad.show('#my-element');
setTimeout(() => {
    busyLoad.hide('#my-element');
}, 3000);
```

## Event Integration

```javascript
// Show loading during fetch
async function fetchData() {
    busyLoad.show('#data-container');
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        // Process data
    } catch (error) {
        console.error('Error:', error);
    } finally {
        busyLoad.hide('#data-container');
    }
}
```

## Notes

- The target element should have position other than 'static' (automatically handled by the library)
- For element-specific overlays, the element must have dimensions
- Spinner types use CSS animations for smooth performance
- Full screen overlay prevents page scrolling

## Browser Support

Works in all modern browsers that support:
- CSS Flexbox
- CSS Animations
- ES6 features

## License

MIT License

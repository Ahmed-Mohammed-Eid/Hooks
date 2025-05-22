# useSwipe Hook

The `useSwipe` hook is a custom React hook designed to detect swipe gestures (left, right, up, down) on a specified DOM element. It can differentiate between short and long swipes and trigger corresponding callback functions asynchronously.

## Installation / Import

First, ensure you have React installed in your project. Then, import the hook into your component:

```javascript
import useSwipe from './path/to/Export (PDF-EXCEL) Hooks/hooks/useSwipe'; // Adjust the path as per your project structure
```

## Usage

To use the hook, pass a React ref of the element you want to track swipes on, along with any callback functions for the swipe events you want to handle.

```javascript
import React, { useRef } from 'react';
import useSwipe from './useSwipe'; // Assuming useSwipe.js is in the same directory

function MySwipeableComponent() {
  const swipeRef = useRef(null);

  const handleSwipeLeft = () => console.log('Swiped left');
  const handleShortSwipeLeft = () => console.log('Short swipe left');
  const handleLongSwipeLeft = () => console.log('Long swipe left');

  // Define other handlers as needed (onSwipeRight, onSwipeUp, onSwipeDown, etc.)

  useSwipe({
    ref: swipeRef,
    onSwipeLeft: handleSwipeLeft,
    onShortSwipeLeft: handleShortSwipeLeft,
    onLongSwipeLeft: handleLongSwipeLeft,
    // Add other swipe handlers here
    // onSwipeRight: () => console.log('Swiped right'),
    // onShortSwipeRight: () => console.log('Short swipe right'),
    // onLongSwipeRight: () => console.log('Long swipe right'),
    // onSwipeUp: () => console.log('Swiped up'),
    // onShortSwipeUp: () => console.log('Short swipe up'),
    // onLongSwipeUp: () => console.log('Long swipe up'),
    // onSwipeDown: () => console.log('Swiped down'),
    // onShortSwipeDown: () => console.log('Short swipe down'),
    // onLongSwipeDown: () => console.log('Long swipe down'),
  });

  return (
    <div
      ref={swipeRef}
      style={{
        width: '200px',
        height: '200px',
        backgroundColor: 'lightblue',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        userSelect: 'none', // Recommended to prevent text selection during swipe
      }}
    >
      Swipe here
    </div>
  );
}

export default MySwipeableComponent;
```

## Parameters

The `useSwipe` hook accepts a single object with the following properties:

*   `ref` (required): A React ref object pointing to the DOM element on which swipe detection should be enabled.
*   `onSwipeLeft`: Function_ (optional): Callback triggered on any swipe to the left that meets the minimum swipe threshold.
*   `onShortSwipeLeft`: Function (optional): Callback triggered on a short swipe to the left.
*   `onLongSwipeLeft`: Function (optional): Callback triggered on a long swipe to the left.
*   `onSwipeRight`: Function (optional): Callback triggered on any swipe to the right.
*   `onShortSwipeRight`: Function (optional): Callback triggered on a short swipe to the right.
*   `onLongSwipeRight`: Function (optional): Callback triggered on a long swipe to the right.
*   `onSwipeUp`: Function (optional): Callback triggered on any swipe upwards.
*   `onShortSwipeUp`: Function (optional): Callback triggered on a short swipe upwards.
*   `onLongSwipeUp`: Function (optional): Callback triggered on a long swipe upwards.
*   `onSwipeDown`: Function (optional): Callback triggered on any swipe downwards.
*   `onShortSwipeDown`: Function (optional): Callback triggered on a short swipe downwards.
*   `onLongSwipeDown`: Function (optional): Callback triggered on a long swipe downwards.

All callback functions are executed asynchronously (wrapped in `setTimeout(callback, 0)`) to prevent blocking the main thread and ensure smooth UI performance.

## Thresholds

The hook uses internal thresholds to differentiate between swipe types:

*   **Swipe Threshold**: The minimum pixel distance a touch must travel to be considered a swipe. Default: `20px`.
*   **Short Swipe Duration**: The maximum duration (in milliseconds) for a swipe to be considered "short", provided it doesn't exceed the long swipe distance. Default: `500ms`.
*   **Long Swipe Minimum Distance**: The minimum pixel distance a swipe must travel to be considered "long". Default: `100px`.

These thresholds are currently defined within the hook but could be exposed as parameters in a future update if more customization is needed.

## Event Handling Details

*   The hook attaches `touchstart`, `touchmove`, and `touchend` event listeners to the provided element.
*   It calculates swipe direction based on the largest change in X or Y coordinates.
*   It measures swipe duration to help distinguish between short and long swipes.
*   Event listeners are automatically cleaned up when the component unmounts or when the `ref` or callback dependencies change.

## Best Practices

*   Apply `user-select: none;` CSS property to the swipeable element to prevent text selection during swipe gestures, especially on mobile devices.
*   Ensure the `ref` is correctly attached to a tangible DOM element.
*   Test swipe interactions on various devices or emulators to ensure consistent behavior.

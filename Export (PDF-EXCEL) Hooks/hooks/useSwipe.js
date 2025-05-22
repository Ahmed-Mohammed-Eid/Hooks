import { useState, useEffect } from 'react';

const useSwipe = ({
  ref,
  onSwipeLeft = () => {},
  onLongSwipeLeft = () => {},
  onShortSwipeLeft = () => {},
  onSwipeRight = () => {},
  onLongSwipeRight = () => {},
  onShortSwipeRight = () => {},
  onSwipeUp = () => {},
  onLongSwipeUp = () => {},
  onShortSwipeUp = () => {},
  onSwipeDown = () => {},
  onLongSwipeDown = () => {},
  onShortSwipeDown = () => {},
  shortSwipeDuration = 500,
  longSwipeMinDistance = 100,
  swipeThreshold = 20,
}) => {
  const [touchStart, setTouchStart] = useState(null);

  const handleTouchStart = (event) => {
    // Prevent default for elements like canvas where touch pans the browser
    // if (event.target.tagName === 'CANVAS') { // Example: Only preventDefault for canvas
    //   event.preventDefault();
    // }
    const { clientX, clientY } = event.touches[0];
    setTouchStart({ x: clientX, y: clientY, time: Date.now() });
  };

  const handleTouchMove = (event) => {
    // This function is primarily for continuous tracking if needed in the future
    // or for more complex gesture recognition. For basic swipes, its main role
    // is to be attached, but it doesn't need to set state or call callbacks.
    // if (event.target.tagName === 'CANVAS') { // Example: Only preventDefault for canvas
    //   event.preventDefault();
    // }
  };

  const handleTouchEnd = (event) => {
    if (!touchStart) {
      return;
    }

    const { clientX: endX, clientY: endY } = event.changedTouches[0];
    const deltaX = endX - touchStart.x;
    const deltaY = endY - touchStart.y;
    const duration = Date.now() - touchStart.time;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > swipeThreshold) {
        setTimeout(() => onSwipeRight(), 0);
        if (duration < shortSwipeDuration && Math.abs(deltaX) < longSwipeMinDistance) {
          setTimeout(() => onShortSwipeRight(), 0);
        }
        if (Math.abs(deltaX) >= longSwipeMinDistance) {
          setTimeout(() => onLongSwipeRight(), 0);
        }
      } else if (deltaX < -swipeThreshold) {
        setTimeout(() => onSwipeLeft(), 0);
        if (duration < shortSwipeDuration && Math.abs(deltaX) < longSwipeMinDistance) {
          setTimeout(() => onShortSwipeLeft(), 0);
        }
        if (Math.abs(deltaX) >= longSwipeMinDistance) {
          setTimeout(() => onLongSwipeLeft(), 0);
        }
      }
    } else {
      // Vertical swipe
      if (deltaY > swipeThreshold) {
        setTimeout(() => onSwipeDown(), 0);
        if (duration < shortSwipeDuration && Math.abs(deltaY) < longSwipeMinDistance) {
          setTimeout(() => onShortSwipeDown(), 0);
        }
        if (Math.abs(deltaY) >= longSwipeMinDistance) {
          setTimeout(() => onLongSwipeDown(), 0);
        }
      } else if (deltaY < -swipeThreshold) {
        setTimeout(() => onSwipeUp(), 0);
        if (duration < shortSwipeDuration && Math.abs(deltaY) < longSwipeMinDistance) {
          setTimeout(() => onShortSwipeUp(), 0);
        }
        if (Math.abs(deltaY) >= longSwipeMinDistance) {
          setTimeout(() => onLongSwipeUp(), 0);
        }
      }
    }

    setTouchStart(null);
  };

  useEffect(() => {
    const element = ref.current;
    if (element) {
      // It's good practice to ensure event listeners are passive if they don't need to preventDefault
      // to improve scrolling performance.
      const options = { passive: true };
      element.addEventListener('touchstart', handleTouchStart, options);
      element.addEventListener('touchmove', handleTouchMove, options);
      element.addEventListener('touchend', handleTouchEnd, options);

      return () => {
        element.removeEventListener('touchstart', handleTouchStart, options);
        element.removeEventListener('touchmove', handleTouchMove, options);
        element.removeEventListener('touchend', handleTouchEnd, options);
      };
    }
  }, [
    ref,
    onSwipeLeft,
    onLongSwipeLeft,
    onShortSwipeLeft,
    onSwipeRight,
    onLongSwipeRight,
    onShortSwipeRight,
    onSwipeUp,
    onLongSwipeUp,
    onShortSwipeUp,
    onSwipeDown,
    onLongSwipeDown,
    onShortSwipeDown,
    // Constants like shortSwipeDuration, longSwipeMinDistance, swipeThreshold
    // are part of the hook's closure and don't need to be in the dependency array
    // unless they are props that can change, which they are in this case.
    shortSwipeDuration,
    longSwipeMinDistance,
    swipeThreshold
  ]);

  // The hook itself doesn't render anything; it just provides logic.
  // Thus, it doesn't return any JSX.
};

export default useSwipe;

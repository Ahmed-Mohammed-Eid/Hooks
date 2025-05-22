import React from 'react';
import { render, fireEvent } from '@testing-library/react'; // Or your preferred testing library
import useSwipe from './useSwipe';

// Helper component to use the hook
const TestComponent = ({ swipeHandlers, children }) => {
  const swipeRef = React.useRef(null);
  useSwipe({ ref: swipeRef, ...swipeHandlers });
  return <div ref={swipeRef} data-testid="swipe-area">{children}</div>;
};

// Mock for setTimeout to make callbacks synchronous for testing
jest.useFakeTimers();

const advanceTimers = () => {
  jest.runAllTimers(); // Runs all pending setTimeouts
};

describe('useSwipe Hook', () => {
  let swipeHandlers;
  const shortSwipeDuration = 500; // As defined in useSwipe
  const longSwipeMinDistance = 100; // As defined in useSwipe
  const swipeThreshold = 20; // As defined in useSwipe

  beforeEach(() => {
    // Reset mocks for each test
    swipeHandlers = {
      onSwipeLeft: jest.fn(),
      onShortSwipeLeft: jest.fn(),
      onLongSwipeLeft: jest.fn(),
      onSwipeRight: jest.fn(),
      onShortSwipeRight: jest.fn(),
      onLongSwipeRight: jest.fn(),
      onSwipeUp: jest.fn(),
      onShortSwipeUp: jest.fn(),
      onLongSwipeUp: jest.fn(),
      onSwipeDown: jest.fn(),
      onShortSwipeDown: jest.fn(),
      onLongSwipeDown: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  
  afterAll(() => {
    jest.useRealTimers(); // Restore real timers
  });

  const simulateSwipe = (getByTestId, startX, startY, endX, endY, duration) => {
    const swipeArea = getByTestId('swipe-area');
    const touchStartArgs = { touches: [{ clientX: startX, clientY: startY }] };
    const touchEndArgs = { changedTouches: [{ clientX: endX, clientY: endY }] };

    fireEvent.touchStart(swipeArea, touchStartArgs);
    
    // Simulate time passing for duration calculation
    if (duration) {
      jest.advanceTimersByTime(duration);
    }
    
    fireEvent.touchEnd(swipeArea, touchEndArgs);
    advanceTimers(); // Ensure async callbacks within useSwipe are fired
  };

  // --- Basic Swipe Tests (direction only) ---
  test('should call onSwipeLeft for a basic left swipe', () => {
    const { getByTestId } = render(<TestComponent swipeHandlers={swipeHandlers} />);
    simulateSwipe(getByTestId, 150, 50, 50, 50, 100); // 100px left
    expect(swipeHandlers.onSwipeLeft).toHaveBeenCalledTimes(1);
    expect(swipeHandlers.onShortSwipeLeft).toHaveBeenCalledTimes(1); // Default is short if not long
  });

  test('should call onSwipeRight for a basic right swipe', () => {
    const { getByTestId } = render(<TestComponent swipeHandlers={swipeHandlers} />);
    simulateSwipe(getByTestId, 50, 50, 150, 50, 100); // 100px right
    expect(swipeHandlers.onSwipeRight).toHaveBeenCalledTimes(1);
    expect(swipeHandlers.onShortSwipeRight).toHaveBeenCalledTimes(1);
  });

  test('should call onSwipeUp for a basic up swipe', () => {
    const { getByTestId } = render(<TestComponent swipeHandlers={swipeHandlers} />);
    simulateSwipe(getByTestId, 50, 150, 50, 50, 100); // 100px up
    expect(swipeHandlers.onSwipeUp).toHaveBeenCalledTimes(1);
    expect(swipeHandlers.onShortSwipeUp).toHaveBeenCalledTimes(1);
  });

  test('should call onSwipeDown for a basic down swipe', () => {
    const { getByTestId } = render(<TestComponent swipeHandlers={swipeHandlers} />);
    simulateSwipe(getByTestId, 50, 50, 50, 150, 100); // 100px down
    expect(swipeHandlers.onSwipeDown).toHaveBeenCalledTimes(1);
    expect(swipeHandlers.onShortSwipeDown).toHaveBeenCalledTimes(1);
  });

  // --- Short Swipe Tests ---
  test('should call onShortSwipeLeft for a short left swipe', () => {
    const { getByTestId } = render(<TestComponent swipeHandlers={swipeHandlers} />);
    // Distance less than longSwipeMinDistance, duration less than shortSwipeDuration
    simulateSwipe(getByTestId, longSwipeMinDistance - 1, 50, swipeThreshold + 1, 50, shortSwipeDuration - 1);
    expect(swipeHandlers.onSwipeLeft).toHaveBeenCalledTimes(1);
    expect(swipeHandlers.onShortSwipeLeft).toHaveBeenCalledTimes(1);
    expect(swipeHandlers.onLongSwipeLeft).not.toHaveBeenCalled();
  });
  
  test('should call onShortSwipeRight for a short right swipe', () => {
    const { getByTestId } = render(<TestComponent swipeHandlers={swipeHandlers} />);
    simulateSwipe(getByTestId, swipeThreshold + 1, 50, longSwipeMinDistance - 1, 50, shortSwipeDuration - 1);
    expect(swipeHandlers.onSwipeRight).toHaveBeenCalledTimes(1);
    expect(swipeHandlers.onShortSwipeRight).toHaveBeenCalledTimes(1);
    expect(swipeHandlers.onLongSwipeRight).not.toHaveBeenCalled();
  });

  // --- Long Swipe Tests ---
  test('should call onLongSwipeLeft for a long left swipe by distance', () => {
    const { getByTestId } = render(<TestComponent swipeHandlers={swipeHandlers} />);
    simulateSwipe(getByTestId, longSwipeMinDistance + 50, 50, 0, 50, shortSwipeDuration -1); // Distance > longSwipeMinDistance
    expect(swipeHandlers.onSwipeLeft).toHaveBeenCalledTimes(1);
    expect(swipeHandlers.onLongSwipeLeft).toHaveBeenCalledTimes(1);
    expect(swipeHandlers.onShortSwipeLeft).not.toHaveBeenCalled();
  });
  
  test('should call onLongSwipeRight for a long right swipe by distance', () => {
    const { getByTestId } = render(<TestComponent swipeHandlers={swipeHandlers} />);
    simulateSwipe(getByTestId, 0, 50, longSwipeMinDistance + 50, 50, shortSwipeDuration -1);
    expect(swipeHandlers.onSwipeRight).toHaveBeenCalledTimes(1);
    expect(swipeHandlers.onLongSwipeRight).toHaveBeenCalledTimes(1);
    expect(swipeHandlers.onShortSwipeRight).not.toHaveBeenCalled();
  });

  // --- No Swipe Tests ---
  test('should not call any swipe handlers if swipe distance is below threshold', () => {
    const { getByTestId } = render(<TestComponent swipeHandlers={swipeHandlers} />);
    simulateSwipe(getByTestId, 50, 50, 50 + swipeThreshold - 1, 50, 100); // Swipe less than threshold
    Object.values(swipeHandlers).forEach(handler => {
      expect(handler).not.toHaveBeenCalled();
    });
  });
  
  test('should not call swipe handlers if no touchstart occurred (e.g., ref is null initially)', () => {
    const { getByTestId } = render(<TestComponent swipeHandlers={swipeHandlers} />);
    const swipeArea = getByTestId('swipe-area');
    // Simulate only touchend without touchstart (useSwipe internal state touchStartRef.current would be null)
    fireEvent.touchEnd(swipeArea, { changedTouches: [{ clientX: 100, clientY: 50 }] });
    advanceTimers();
    Object.values(swipeHandlers).forEach(handler => {
      expect(handler).not.toHaveBeenCalled();
    });
  });
  
  // --- Vertical Long Swipes ---
  test('should call onLongSwipeUp for a long up swipe by distance', () => {
    const { getByTestId } = render(<TestComponent swipeHandlers={swipeHandlers} />);
    simulateSwipe(getByTestId, 50, longSwipeMinDistance + 50, 50, 0, shortSwipeDuration - 1);
    expect(swipeHandlers.onSwipeUp).toHaveBeenCalledTimes(1);
    expect(swipeHandlers.onLongSwipeUp).toHaveBeenCalledTimes(1);
    expect(swipeHandlers.onShortSwipeUp).not.toHaveBeenCalled();
  });

  test('should call onLongSwipeDown for a long down swipe by distance', () => {
    const { getByTestId } = render(<TestComponent swipeHandlers={swipeHandlers} />);
    simulateSwipe(getByTestId, 50, 0, 50, longSwipeMinDistance + 50, shortSwipeDuration - 1);
    expect(swipeHandlers.onSwipeDown).toHaveBeenCalledTimes(1);
    expect(swipeHandlers.onLongSwipeDown).toHaveBeenCalledTimes(1);
    expect(swipeHandlers.onShortSwipeDown).not.toHaveBeenCalled();
  });

  // Test cleanup of event listeners
  test('should clean up event listeners on unmount', () => {
    const mockRemoveEventListener = jest.fn();
    const mockAddEventListener = jest.fn();

    // Mock ref to spy on add/remove
    const mockRef = {
      current: {
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
      },
    };

    const TestCompWithMockRef = ({ handlers }) => {
      useSwipe({ ref: mockRef, ...handlers });
      return null; // Component doesn't need to render anything for this test
    };

    const { unmount } = render(<TestCompWithMockRef handlers={swipeHandlers} />);
    
    expect(mockAddEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function), undefined);
    expect(mockAddEventListener).toHaveBeenCalledWith('touchmove', expect.any(Function), undefined);
    expect(mockAddEventListener).toHaveBeenCalledWith('touchend', expect.any(Function), undefined);
    
    unmount();
    
    expect(mockRemoveEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function), undefined);
    expect(mockRemoveEventListener).toHaveBeenCalledWith('touchmove', expect.any(Function), undefined);
    expect(mockRemoveEventListener).toHaveBeenCalledWith('touchend', expect.any(Function), undefined);
  });

});

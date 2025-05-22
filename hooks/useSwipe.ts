import { useState, useEffect, useCallback } from "react"; // Added useCallback
import type { RefObject } from "react";

export interface SwipeCoordinates {
    top: number;
    right: number;
    bottom: number;
    left: number;
    x: number; // clientX
    y: number; // clientY
}

interface SwipeInput {
    ref: RefObject<HTMLElement | null>; // Changed HTMLElement to HTMLElement | null
    onSwipeLeft?: (startCoordinates?: SwipeCoordinates, endCoordinates?: SwipeCoordinates) => void;
    onLongSwipeLeft?: (startCoordinates?: SwipeCoordinates, endCoordinates?: SwipeCoordinates) => void;
    onShortSwipeLeft?: (startCoordinates?: SwipeCoordinates, endCoordinates?: SwipeCoordinates) => void;
    onSwipeRight?: (startCoordinates?: SwipeCoordinates, endCoordinates?: SwipeCoordinates) => void;
    onLongSwipeRight?: (startCoordinates?: SwipeCoordinates, endCoordinates?: SwipeCoordinates) => void;
    onShortSwipeRight?: (startCoordinates?: SwipeCoordinates, endCoordinates?: SwipeCoordinates) => void;
    onSwipeUp?: (startCoordinates?: SwipeCoordinates, endCoordinates?: SwipeCoordinates) => void;
    onLongSwipeUp?: (startCoordinates?: SwipeCoordinates, endCoordinates?: SwipeCoordinates) => void;
    onShortSwipeUp?: (startCoordinates?: SwipeCoordinates, endCoordinates?: SwipeCoordinates) => void;
    onSwipeDown?: (startCoordinates?: SwipeCoordinates, endCoordinates?: SwipeCoordinates) => void;
    onLongSwipeDown?: (startCoordinates?: SwipeCoordinates, endCoordinates?: SwipeCoordinates) => void;
    onShortSwipeDown?: (startCoordinates?: SwipeCoordinates, endCoordinates?: SwipeCoordinates) => void;
    onWhileSwipeLeft?: (startCoordinates: SwipeCoordinates, currentCoordinates: SwipeCoordinates, deltaX: number) => void;
    onWhileSwipeRight?: (startCoordinates: SwipeCoordinates, currentCoordinates: SwipeCoordinates, deltaX: number) => void;
    onWhileSwipeUp?: (startCoordinates: SwipeCoordinates, currentCoordinates: SwipeCoordinates, deltaY: number) => void;
    onWhileSwipeDown?: (startCoordinates: SwipeCoordinates, currentCoordinates: SwipeCoordinates, deltaY: number) => void;
    onClickOutsideRef?: (event: MouseEvent | TouchEvent) => void; // Added onClickOutsideRef
    shortSwipeDuration?: number;
    longSwipeMinDistance?: number;
    swipeThreshold?: number;
}

interface TouchStartData {
    x: number;
    y: number;
    time: number;
    rect: DOMRect;
}

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
    onWhileSwipeLeft = () => {},
    onWhileSwipeRight = () => {},
    onWhileSwipeUp = () => {},
    onWhileSwipeDown = () => {},
    onClickOutsideRef = () => {}, // Added onClickOutsideRef
    shortSwipeDuration = 500,
    longSwipeMinDistance = 100,
    swipeThreshold = 20,
}: SwipeInput) => {
    const [touchStart, setTouchStart] = useState<TouchStartData | null>(null);

    const handleTouchStart = useCallback((event: TouchEvent) => {
        const { clientX, clientY } = event.touches[0];
        const targetElement = event.target as HTMLElement;
        if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            setTouchStart({ x: clientX, y: clientY, time: Date.now(), rect });
        }
    }, []);

    const handleTouchMove = useCallback((event: TouchEvent) => {
        if (!touchStart || !ref.current) {
            return;
        }

        const elementBounds = ref.current.getBoundingClientRect();
        const { clientX: currentX, clientY: currentY } = event.touches[0];

        // Check if the current touch point is outside the element bounds
        if (
            currentX < elementBounds.left ||
            currentX > elementBounds.right ||
            currentY < elementBounds.top ||
            currentY > elementBounds.bottom
        ) {
            // Optionally, you could reset touchStart here to cancel the swipe if it goes out of bounds
            // setTouchStart(null);
            return; // Do not process swipe if outside bounds
        }

        const deltaX = currentX - touchStart.x;
        const deltaY = currentY - touchStart.y;

        const startCoordinates: SwipeCoordinates = {
            top: touchStart.rect.top,
            right: touchStart.rect.right,
            bottom: touchStart.rect.bottom,
            left: touchStart.rect.left,
            x: touchStart.x,
            y: touchStart.y,
        };

        const currentCoordinates: SwipeCoordinates = {
            top: elementBounds.top,
            right: elementBounds.right,
            bottom: elementBounds.bottom,
            left: elementBounds.left,
            x: currentX,
            y: currentY,
        };

        if (Math.abs(deltaX) > Math.abs(deltaY)) { // Horizontal movement is dominant
            if (deltaX > 0) { // Moving right
                onWhileSwipeRight(startCoordinates, currentCoordinates, deltaX);
            } else { // Moving left
                onWhileSwipeLeft(startCoordinates, currentCoordinates, deltaX);
            }
        } else { // Vertical movement is dominant
            if (deltaY > 0) { // Moving down
                onWhileSwipeDown(startCoordinates, currentCoordinates, deltaY);
            } else { // Moving up
                onWhileSwipeUp(startCoordinates, currentCoordinates, deltaY);
            }
        }
    }, [touchStart, ref, onWhileSwipeLeft, onWhileSwipeRight, onWhileSwipeUp, onWhileSwipeDown]);

    const handleTouchEnd = useCallback((event: TouchEvent) => {
        if (!touchStart || !ref.current) {
            return;
        }

        const elementBounds = ref.current.getBoundingClientRect();
        const { clientX: endX, clientY: endY } = event.changedTouches[0];

        // Check if the touch ended outside the element bounds
        if (
            endX < elementBounds.left ||
            endX > elementBounds.right ||
            endY < elementBounds.top ||
            endY > elementBounds.bottom
        ) {
            setTouchStart(null); // Cancel swipe if it ends outside bounds
            return;
        }

        const deltaX = endX - touchStart.x;
        const deltaY = endY - touchStart.y;
        const duration = Date.now() - touchStart.time;

        const startCoordinates: SwipeCoordinates = {
            top: touchStart.rect.top,
            right: touchStart.rect.right,
            bottom: touchStart.rect.bottom,
            left: touchStart.rect.left,
            x: touchStart.x,
            y: touchStart.y,
        };

        const endCoordinates: SwipeCoordinates = {
            top: elementBounds.top, // Use elementBounds for T,R,B,L
            right: elementBounds.right,
            bottom: elementBounds.bottom,
            left: elementBounds.left,
            x: endX,
            y: endY,
        };

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (deltaX > swipeThreshold) {
                setTimeout(() => onSwipeRight(startCoordinates, endCoordinates), 0);
                if (
                    duration < shortSwipeDuration &&
                    Math.abs(deltaX) < longSwipeMinDistance
                ) {
                    setTimeout(() => onShortSwipeRight(startCoordinates, endCoordinates), 0);
                }
                if (Math.abs(deltaX) >= longSwipeMinDistance) {
                    setTimeout(() => onLongSwipeRight(startCoordinates, endCoordinates), 0);
                }
            } else if (deltaX < -swipeThreshold) {
                setTimeout(() => onSwipeLeft(startCoordinates, endCoordinates), 0);
                if (
                    duration < shortSwipeDuration &&
                    Math.abs(deltaX) < longSwipeMinDistance
                ) {
                    setTimeout(() => onShortSwipeLeft(startCoordinates, endCoordinates), 0);
                }
                if (Math.abs(deltaX) >= longSwipeMinDistance) {
                    setTimeout(() => onLongSwipeLeft(startCoordinates, endCoordinates), 0);
                }
            }
        } else {
            // Vertical swipe
            if (deltaY > swipeThreshold) {
                setTimeout(() => onSwipeDown(startCoordinates, endCoordinates), 0);
                if (
                    duration < shortSwipeDuration &&
                    Math.abs(deltaY) < longSwipeMinDistance
                ) {
                    setTimeout(() => onShortSwipeDown(startCoordinates, endCoordinates), 0);
                }
                if (Math.abs(deltaY) >= longSwipeMinDistance) {
                    setTimeout(() => onLongSwipeDown(startCoordinates, endCoordinates), 0);
                }
            } else if (deltaY < -swipeThreshold) {
                setTimeout(() => onSwipeUp(startCoordinates, endCoordinates), 0);
                if (
                    duration < shortSwipeDuration &&
                    Math.abs(deltaY) < longSwipeMinDistance
                ) {
                    setTimeout(() => onShortSwipeUp(startCoordinates, endCoordinates), 0);
                }
                if (Math.abs(deltaY) >= longSwipeMinDistance) {
                    setTimeout(() => onLongSwipeUp(startCoordinates, endCoordinates), 0);
                }
            }
        }

        setTouchStart(null);
    }, [
        touchStart,
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
        shortSwipeDuration,
        longSwipeMinDistance,
        swipeThreshold,
    ]);

    useEffect(() => {
        const element = ref.current;
        if (element) {
            // It's good practice to ensure event listeners are passive if they don't need to preventDefault
            // to improve scrolling performance.
            const options = { passive: true } as EventListenerOptions;
            element.addEventListener("touchstart", handleTouchStart as EventListener, options);
            element.addEventListener("touchmove", handleTouchMove as EventListener, options);
            element.addEventListener("touchend", handleTouchEnd as EventListener, options);

            return () => {
                element.removeEventListener(
                    "touchstart",
                    handleTouchStart as EventListener,
                    options
                );
                element.removeEventListener(
                    "touchmove",
                    handleTouchMove as EventListener,
                    options
                );
                element.removeEventListener(
                    "touchend",
                    handleTouchEnd as EventListener,
                    options
                );
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
        shortSwipeDuration,
        longSwipeMinDistance,
        swipeThreshold,
        handleTouchStart, // Added
        handleTouchMove,  // Added
        handleTouchEnd,    // Added
        // Add new "while" swipe handlers to useEffect dependencies
        onWhileSwipeLeft,
        onWhileSwipeRight,
        onWhileSwipeUp,
        onWhileSwipeDown
    ]);

    // Effect for handling clicks outside the ref element
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClickOutsideRef(event);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [ref, onClickOutsideRef]);

    // The hook itself doesn't render anything; it just provides logic.
    // Thus, it doesn't return any JSX.
};

export default useSwipe;


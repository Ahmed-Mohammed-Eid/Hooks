import { useEffect } from 'react';
import type { RefObject } from 'react';

interface ClickOutsideInput {
    refs: RefObject<HTMLElement | null>[];
    onClickOutside: (event: MouseEvent | TouchEvent) => void;
}

const useClickOutside = ({ refs, onClickOutside }: ClickOutsideInput): void => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            const clickedInsideAnyRef = refs.some(ref => {
                return ref.current && ref.current.contains(event.target as Node);
            });

            if (!clickedInsideAnyRef) {
                onClickOutside(event);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [refs, onClickOutside]);
};

export default useClickOutside;

/*
    This file contains the useKeydown function, which can be used via composition API
*/

import { onBeforeUnmount } from 'vue';

const useKeydown = (
    keyCombos: { 
        key: string,
        fn: any
     }[],
) => {

    const onKeyDown = ( event: { key: string } ): void => {

        const targetKeyCombo = keyCombos.find(
            keyCombo => keyCombo?.key === event?.key
        );

        targetKeyCombo?.fn();

    };

    window.addEventListener(
        'keydown',
        onKeyDown
    );

    onBeforeUnmount(
        () => window.removeEventListener(
            'keydown',
            onKeyDown
        )
    );

};

export default useKeydown;
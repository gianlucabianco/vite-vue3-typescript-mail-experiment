/*
    This file contains the useKeydown function, which can be used via composition API
*/

import { onBeforeUnmount } from 'vue';

const useKeydown = (
    keyCombos,
) => {

    const onKeyDown = event => {

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
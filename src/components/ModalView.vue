<template>
  <div
    class="modal"
  >
    <!--
        Quick note: without setup the old vue2 syntax still works
        @click="$emit('closeModal')"
    -->
    <div
        class="overlay"
        @click="emit('closeModal')"
    />
    <div
        class="modal-card"
    >
        <slot />
    </div>
  </div>
</template>

<script>
import useKeydown from '../composables/user-keydown';

export default {
    name: 'modal-view',
    setup(
        props,
        { emit }
    ) {

        /* New Vue 3 composition API */
        const allowedKeyCombos = [
            {
                key: 'Escape',
                fn: () => emit('closeModal')
            },
        ];

        useKeydown(
            allowedKeyCombos
        );

        /* Vue 2 Option API style code (start)
        const onKeyDown = event => event?.key === 'Escape' && emit('closeModal');

        window.addEventListener(
            'keydown',
            onKeyDown
        );
        */
        
        /*
            The setup() function runs every time the modal view component is opened.
            This will cause multiple window.addEventListener adding.
            To prevent this behaviour the listener could be removed using the onBeforeUnmount hook (previously imported).
        */

        /*
        onBeforeUnmount(
            () => window.removeEventListener(
                'keydown',
                onKeyDown
            )
        );
        Vue 2 Option API style code (end)
        */

        return {
            emit,
        };

    },
}
</script>
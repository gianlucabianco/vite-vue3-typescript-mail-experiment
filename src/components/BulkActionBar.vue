<template>
  <div
    class="bulk-action-bar"
  >
    <span
        class="checkbox"
    >
      <input
        type="checkbox"
        :checked="allEmailsSelected"
        :class="{
            'partial-check': someEmailsSelected,
        }"
        @click="bulkSelect"
      />
    </span>
    <span
        class="buttons"
    >
        <button
            @click="emailSelection.markRead()"
            :disabled="[ ...emailSelection.emails ].every( email => email.read )"
        >
            Mark read
        </button>
        <button
            @click="emailSelection.markUnread()"
            :disabled="[ ...emailSelection.emails ].every( email => ! email.read )"
        >
            Mark unread
        </button>
        <button
            @click="emailSelection.archive()"
            :disabled="! numberSelected"
        >
            Archive
        </button>
    </span>
  </div>
</template>

<script>
import { computed } from 'vue';
import useEmailSelection from '../composables/use-email-selection';

export default {
  name: 'bulk-action-bar',
  setup( props ) {

    const emailSelection = useEmailSelection()
    , numberEmails = computed(
        () => props.emails.length
    )
    , numberSelected = computed(
        () => emailSelection.emails.size
    )
    , allEmailsSelected = computed(
        () => numberSelected.value === numberEmails.value
    )
    , someEmailsSelected = computed(
        () => numberSelected.value > 0 && numberSelected.value < numberEmails.value
    )
    , bulkSelect = () => {
        
        if( allEmailsSelected?.value )
            emailSelection.clear();
        else
            emailSelection.addMultiple( props.emails );

    };

    return {
        allEmailsSelected,
        someEmailsSelected,
        bulkSelect,
        emailSelection,
        numberSelected,
    }
  },
  props: {
      emails: {
          type: Array,
          required: true,
      },
  },

};
</script>
<template>
    <button
        @click="screeenSelection( 'inbox' )"
        :disabled="selectedScreen === 'inbox'"
    >
        Inbox
    </button>
    <button
        @click="screeenSelection( 'archive' )"
        :disabled="selectedScreen === 'archive'"
    >
        Archived
    </button>
    <BulkActionBar
        :emails="filteredEmails"
    />
    <table
        class="mail-table"
    >
        <tbody
            v-if="emails?.length"
        >
            <tr
                v-for="email in filteredEmails"
                :key="email.id"
                :class="{
                    'clickable': true,
                    'read': email?.read,
                }"
            >
                <td>
                    <input
                        type="checkbox"
                        :checked="emailSelection.emails.has( email )"
                        @click="emailSelection.toggle( email)"
                    />
                </td>
                <td
                    @click="openEmail( email )"
                >
                    {{ email.from }}
                </td>
                <td
                    @click="openEmail( email )"
                >
                    <p>
                        <strong>{{ email.subject }}</strong> - {{ email.body }}
                    </p>
                </td>
                <td
                    class="date"
                    @click="openEmail( email )"
                >
                    {{ format(new Date( email.sentAt ), 'MM do yyyy') }}
                </td>
                <td>
                    <button @click="archiveEmail( email )">Archive</button>
                </td>
            </tr>
        </tbody>
    </table>
    <!-- TODO: MOVE EMPTY INBOX MESSAGE && THE MAIL VIEW IN THE PARENT COMPONENT -->
    <p v-if="isInboxEmpty">🎉🎉🎉 Horaaayyy, you've read all emails! 🎉🎉🎉</p>
    
    <ModalView
        v-if="openedEmail && ! isInboxEmpty"
        @closeModal="openedEmail = null"
    >
        <MailView
            :email="openedEmail"
            @changeEmail="changeEmail"
        />
    </ModalView>
</template>

<script>

// utils
import { format } from 'date-fns';
import axios from 'axios';

// ref is required to make data reactive (vue 3 breaking change)
import { ref } from 'vue';
import useEmailSelection from '../composables/use-email-selection';

import MailView from './MailView.vue';
import ModalView from './ModalView.vue';
import BulkActionBar from './BulkActionBar.vue';

export default {
    name: 'main-table',
    components: {
        MailView,
        ModalView,
        BulkActionBar,
    },
    async setup() {

        const response = await axios.get(
            'http://localhost:8000/emails'
        )
        , emails = response?.data || []
        , openedEmail = null;

        return {
            format,
            emails: ref( emails ),
            openedEmail: ref( openedEmail ),
            emailSelection: ref( useEmailSelection() ),
            selectedScreen: ref( 'inbox' ),
        };

    },
    computed: {
        sortedEmails() {

            return this.emails.sort(
                (
                    firstEmail,
                    secondEmail
                ) => {

                return firstEmail.sentAt < secondEmail.sentAt
                    ? 1
                    : - 1;

                }
            );

        },
        filteredEmails() {

            return this.selectedScreen === 'inbox'
            ? this.sortedEmails.filter(
                email => ! email?.archived
            )
            : this.sortedEmails.filter(
                email => email?.archived
            );

        },
        unreadEmails() {

            return this.sortedEmails.filter(
                email => ! email?.read
            );

        },
        isInboxEmpty() {

            return ! this.filteredEmails?.length && ! this.unreadEmails.length;

        },
    },
    methods: {
        openEmail(
            email
        ) {
            
            if( ! email )
                return;

            this.openedEmail = email;

            if( ! email.read )
                email.read = true;
            
            if( email )
                this.updateEmail( email );

        },
        archiveEmail(
            email
        ) {
            
            if( ! email || email?.archived )
                return;
            
            email.archived = true;

            this.updateEmail( email );

        },
        changeEmail(
            {
                toggleRead,
                toggleArchive,
                save,
                closeModal,
                changeIndex
            }
        ) {

            const email = this.openedEmail;

            if( ! email )
                return;

            if ( toggleRead )
                email.read = ! email.read;
            
            if ( toggleArchive )
                email.archived = ! email.archived;
            
            if ( save )
                this.updateEmail( email );

            if( closeModal )
                this.openedEmail = null;

            if( changeIndex ) {

                const emails = this.filteredEmails
                , currentIndex = emails.indexOf( this.openedEmail )
                , newEmail = emails[ currentIndex + changeIndex ];

                this.openEmail( newEmail );

            };

        },
        async updateEmail(
            email
        ) {

            try {
                
                await axios.put(
                    `http://localhost:8000/emails/${ email.id }`,
                    email
                );

            } catch ( error ) {

                console.error(
                    {
                        error
                    }
                );
                
            }

        },
        screeenSelection( newScreen ) {

            this.selectedScreen = newScreen;

            this.emailSelection.clear();

        },
    },
}
</script>
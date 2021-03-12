import { reactive } from 'vue';
import axios from 'axios';


const emails = reactive( new Set() );

export const useEmailSelection = () => {

    const toggle = email => {
        if ( emails.has( email ) )
            emails.delete( email );
        else
            emails.add( email );
    }
    , clear = () => emails.clear()
    , addMultiple = newEmails => newEmails.map(
        email => emails.add( email )
    )
    , forSelected = fn => emails.forEach(
        email => {

            fn( email );

            axios.put(
                `http://localhost:8000/emails/${ email.id }`,
                email
            );
            
        }
    )
    , markRead = () => forSelected( email => email.read = true )
    , markUnread = () => forSelected( email => email.read = false )
    , archive = () => {
        
        forSelected( email => email.archived = true );
        
        clear();

    };

    return {
        emails,
        toggle,
        clear,
        addMultiple,
        markRead,
        markUnread,
        archive,
    }
};

export default useEmailSelection;
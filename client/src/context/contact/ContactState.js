import React, { useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ContactContext from './contactContext';
import contactReducer from './contactReducer';
import {
    ADD_CONTACT,
    DELETE_CONTACT,
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_CONTACT,
    FILTER_CONTACT,
    CLEAR_FILTER
} from '../types';

const ContactState = (props) => {
    const initialState = {
        contacts: [
            {
                id: 1,
                name: 'Arthur Morgan',
                email: 'arthur@mail.com',
                phone: '111-111-111',
                type: 'professional'
            },
            {
                id: 2,
                name: 'John Marston',
                email: 'johnmarston@mail.com',
                phone: '222-222-222',
                type: 'personal'
            },
            {
                id: 3,
                name: 'Winter Richard',
                email: 'winrichard@mail.com',
                phone: '333-333-333',
                type: 'personal'
            },

            {
                id: 4,
                name: 'Liebgott Andrew',
                email: 'lib.andrew@mail.com',
                phone: '444-44-444',
                type: 'personal'
            },
        ],
    };

    const [state, dispatch] = useReducer(contactReducer, initialState);

    // Add Contact
    const addContact = (contact) => {
        contact.id = uuidv4();
        dispatch({
            type: 'ADD_CONTACT',
            payload: contact
        })
    }

    // Delete Contact

    // Update Contact

    // Filter Contacts

    // Clear Filter

    // Set Current Contact

    // Clear Current Contact

    return (
        <ContactContext.Provider
            value={{
                contacts: state.contacts,
                addContact
            }}>
            {props.children}
        </ContactContext.Provider>
    );
}

export default ContactState;
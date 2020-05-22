import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import ContactContext from '../../context/contact/contactContext'


const ContactItem = ({ contact }) => {
    const contactContext = useContext(ContactContext);
    const { deleteContact, setCurrentContact, clearCurrentContact } = contactContext;
    const { id, name, email, phone, type } = contact;

    const onDelete = () => {
        deleteContact(id);
        clearCurrentContact();
    }
    
    return (
        <div className='card bg-light'>
            <h3 className="text-primary text-left">
                {name}{' '}
                <span 
                    style={{float: 'right'}}
                    className={
                        'badge ' + 
                        (type === 'professional' ? 'badge-professional' : 'badge-primary')}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
            </h3>
            <ul className='list'>
                { email && (
                    <li>
                        <i className="fas fa-envelope"></i>{' '}{email}
                    </li>
                )}
                { phone && (
                    <li>
                        <i className="fas fa-phone"></i>{' '}{phone}
                    </li>
                )}
            </ul>
            <p>
                <button className='btn-warning btn-sm' style={{borderRadius: '5px', border: 'none', cursor: 'pointer'}} onClick={() => setCurrentContact(contact)}>Edit</button>
                <button style={{borderRadius: '5px', border: 'none', cursor: 'pointer'}} className='btn-danger btn-sm' onClick={onDelete}>Delete</button>
            </p>
        </div>
    )
}

ContactItem.propTypes = {
    contact: PropTypes.object.isRequired,
}

export default ContactItem

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Contact = require('../models/Contact');
const authMiddleware = require('../middleware/authMiddleware');
const { check, validationResult } = require('express-validator');

// @route     GET api/contacts
// @desc      Get all users contact
// @access    Private
router.get('/', authMiddleware, async (req, res) => {
    try {
        const contacts = await Contact
            .find({ user: req.user.id })
            .sort({ date: -1 });
        res.json(contacts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error getting contacts');
    }
});

// @route     POST api/contacts
// @desc      Add a contact
// @access    Private
router.post('/', [authMiddleware, [check('name', 'Name is required').not().isEmpty()]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
    }

    const { name, email, phone, type } = req.body;
    try {
        const newContact = new Contact({
            name,
            email,
            phone, 
            type,
            user: req.user.id
        });
        const contact = await newContact.save();
        res.json(contact)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error saving new contact');
    }
});

// @route     PUT api/contacts/:id
// @desc      Update a contact
// @access    Private
router.put('/:id', authMiddleware, async (req, res) => {
    const { name, email, phone, type } = req.body;
    // Build contact object
    const contactFields = {};
    if(name) contactFields.name = name;
    if(email) contactFields.email = email;
    if(phone) contactFields.phone = phone;
    if(type) contactFields.type = type;

    try {
        let contact = await Contact.findById(req.params.id);
        if(!contact) {
            return res.status(404).json({msg: 'Contact not found'});
        }
        // Make sure user owns contact
        if(contact.user.toString() !== req.user.id) {
            return res.status(401).json({msg: 'Not Authorized'});
        }
        contact = await Contact.findByIdAndUpdate(
            req.params.id, 
            {$set:contactFields},
            {$new: true});

            res.json(contact);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error updating contact');
    }
});

// @route     DELETE api/contacts/:id
// @desc      Delete contact
// @access    Private
router.delete('/:id', authMiddleware, async (req, res) => {

    try {
        let contact = await Contact.findById(req.params.id);
        if(!contact) {
            return res.status(404).json({msg: 'Contact not found'});
        }
        // Make sure user owns contact
        if(contact.user.toString() !== req.user.id) {
            return res.status(401).json({msg: 'Not Authorized'});
        }
        await Contact.findByIdAndRemove(req.params.id);
        res.json({msg: 'Contact Removed'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error updating contact');
    }

});

module.exports = router;
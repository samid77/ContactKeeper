const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const authMiddleware = require('../middleware/authMiddleware');
const { check, validationResult } = require('express-validator');

// @route     GET api/auth
// @desc      Get logged in user
// @access    Private
router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error in getting logged in user');
    }
});

// @route     POST api/auth
// @desc      Auth user & get token
// @access    Public
router.post('/', [
    check('email', 'Please include a valid email')
        .isEmail(),
    check('password', 'Password is required')
        .exists()
], async (req, res) => {

    //Validate input body
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
    }
    const { email, password } = req.body;

    try {
        //Checking in email and password
        let user = await User.findOne({email: email});
        if(!user) {
            return res.status(400).json({ msg: 'Invalid email' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ msg: 'Invalid password' });
        }

        //Get the user ID
        const payload = {
             user: {
                 id: user.id
             }
         }
         jwt.sign(
             payload, 
             config.get('jwtSecret'), 
             {expiresIn: 360000},
             (err, token) => {
                 if(err) throw err;
                 res.json({ token });
             }
         )
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error logging in');
    }
});

module.exports = router;
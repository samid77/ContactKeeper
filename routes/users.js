const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

// @route     POST api/users
// @desc      Register a user
// @access    Public
router.post(
    '/', 
    [
        check('name', 'Name is required')
            .not()
            .isEmpty(),
        check('email', 'Insert a valid email')
            .isEmail(),
        check('password', 'Please enter a password with 6 or more characters')
            .isLength({min: 6}),
    ], 
    async (req, res) => {
        
        //Validate input body
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }
        const { name, email, password } = req.body;
 
        try {
         //Check if the user alrerady exists
         let user = await User.findOne({email: email});
         if(user) {
             return res.status(400).json({ msg: 'User already exists'});
         }

         //Proceed to bind the input data into object
         user = new User({
             name: name,
             email: email,
             password: password
         })

         //Hash the inputted password
         const salt = await bcrypt.genSalt(10);
         user.password = await bcrypt.hash(password, salt);

         //Save to database
         await user.save();
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
            res.status(500).send('Error in saving user data');
        }
    }
);

module.exports = router;
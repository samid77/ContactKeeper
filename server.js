const express = require('express');
const connnectDB = require('./config/db');


const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.json({
        msg: 'Welcome to the contact keeper API'
    });
});

//Connect to Database
connnectDB();

//Init Middleware
app.use(express.json({extended: false}))

// Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));

app.listen(PORT, () => console.log(`Server started at port ${PORT} ...`));

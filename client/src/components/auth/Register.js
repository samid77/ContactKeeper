import React, { useState, useContext, useEffect }from 'react'
import AlertContext from '../../context/alert/alertContext'
import AuthContext from '../../context/auth/authContext'

const Register = (props) => {
    const alertContext = useContext(AlertContext)
    const { setAlert } = alertContext

    const authContext = useContext(AuthContext)
    const { register, error, clearErrors, isAuthenticated } = authContext;

    useEffect(() => {
        if(isAuthenticated) {
            props.history.push('/')
        }
        if(error === 'User already exists') {
            setAlert(error, 'danger')
            clearErrors();
        }
        // eslint-disable-next-line
    }, [error, isAuthenticated, props.history]);
    
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        passwordconfirm: '',
    });

    const { name, email, password, passwordconfirm } = user;

    const onChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if(name === '' || email === '' || password === '') {
            setAlert('Please enter all fields', 'danger')
        } else if(password !== passwordconfirm) {
            setAlert('Password didnt match', 'warning')
        } else {
            register({
                name, email, password
            });
        }
    }

    return (
        <div className='form-container'>
            <h1>
                Account <span className="text-primary">Register</span>
            </h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={name} 
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={email} 
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={password} 
                        onChange={onChange}
                        required
                        minLength='6'
                    />
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input 
                        type="password" 
                        name="passwordconfirm" 
                        value={passwordconfirm} 
                        onChange={onChange}
                        required 
                        minLength='6'
                    />
                </div>
                <input 
                    type="submit" 
                    value="Register" 
                    className='btn btn-primary btn-block'
                />
            </form>
        </div>
    )
}

export default Register

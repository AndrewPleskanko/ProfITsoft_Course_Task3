import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit} from '@fortawesome/free-solid-svg-icons';
import styles from './UserDetails.module.css';
import {validate} from './userValidation';
import {
    API_BASE_URL,
    SUCCESS_MESSAGE_CREATE,
    SUCCESS_MESSAGE_UPDATE,
    ERROR_MESSAGE,
    ROLES
} from '../constants/userConstants';

const UserDetails = () => {
        const [user, setUser] = useState(null);
        const [editMode, setEditMode] = useState(false);
        const [error, setError] = useState(null);
        const [errors, setErrors] = useState({});
        const navigate = useNavigate();
        const {id} = useParams();
        const [formData, setFormData] = useState({username: '', email: '', role: ''});
        const [success, setSuccess] = useState(null);

        useEffect(() => {
            if (id !== 'new') {
                axios.get(`${API_BASE_URL}/${id}`)
                    .then(response => {
                        setUser(response);
                        setFormData({
                            username: response.username,
                            email: response.email,
                            role: response.role.name,
                            age: response.age,
                            phone: response.phone
                        });
                    })
            } else {
                setEditMode(true);
            }
        }, [id]);

        const handleInputChange = (event) => {
            const {name, value} = event.target;
            if (name === 'role') {
                setFormData({...formData, [name]: value});
            } else {
                setFormData({...formData, [name]: value});
            }

            const newError = validate(name, value);
            if (newError[name]) {
                setErrors({...errors, [name]: newError[name]});
            } else {
                const {[name]: value, ...remainingErrors} = errors;
                setErrors(remainingErrors);
            }
        };

        const handleEdit = () => {
            setEditMode(true);
        };

        const handleSave = () => {
            if (!formData.role || !formData.username || !formData.email || !formData.password) {
                setErrors({
                    ...errors,
                    role: !formData.role ? 'Role is required' : '',
                    username: !formData.username ? 'Username is required' : '',
                    email: !formData.email ? 'Email is required' : '',
                    password: !formData.password ? 'Password is required' : ''
                });
                return;
            }

            if (id === 'new') {
                axios.post(API_BASE_URL, formData)
                    .then(() => {
                        setSuccess(SUCCESS_MESSAGE_CREATE);
                        setTimeout(() => setSuccess(null), 5000);
                        navigate('/user-list');
                    })
                    .catch(error => {
                        // eslint-disable-next-line no-unused-vars
                        setError(ERROR_MESSAGE);
                    });
            } else {
                axios.put(`${API_BASE_URL}/${id}`, formData)
                    .then(response => {
                        setUser(response);
                        setSuccess(SUCCESS_MESSAGE_UPDATE);
                        setTimeout(() => setSuccess(null), 5000);

                        setEditMode(false);
                    }).catch((error) => {
                    setError(ERROR_MESSAGE);
                });
            }
        };

        const handleCancel = () => {
            if (id === 'new') {
                navigate('/user-list');
            } else {
                setEditMode(false);
                setFormData({
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    role: user.role,
                    age: user.age,
                    phone: user.phone
                });
            }
        };

        const handleBack = () => {
            navigate('/user-list');
        };

        return (
            <div className={styles.container}>
                <h1>User Details</h1>
                {error && <p>{error}</p>}
                {success && <p>{success}</p>}
                {editMode ? (
                    <div>
                        <label>
                            Username:
                            <input type="text" name="username" value={formData.username} onChange={handleInputChange}
                                   required className={styles.inputField}/>
                            {errors.username && <p className={styles.error}>{errors.username}</p>}
                        </label>
                        <label>
                            Email:
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                                   required className={styles.inputField}/>
                            {errors.email && <p className={styles.error}>{errors.email}</p>}
                        </label>
                        <label>
                            Role:
                            <select name="role" value={formData.role} onChange={handleInputChange} required
                                    className={styles.inputField}>
                                <option value="" disabled={formData.role !== ''}>Select a role</option>
                                {ROLES.map((role) => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                            {errors.role && <p className={styles.error}>{errors.role}</p>}
                        </label>
                        <label>
                            Password:
                            <input type="password" name="password" value={formData.password}
                                   onChange={handleInputChange}
                                   required className={styles.inputField}/>
                        </label>
                        {errors.password && <p className={styles.error}>{errors.password}</p>}
                        <label>
                            Age:
                            <input type="text" name="age" value={formData.age} onChange={handleInputChange}
                                   required className={styles.inputField}/>
                        </label>
                        {errors.age && <p className={styles.error}>{errors.age}</p>}
                        <label>
                            Phone:
                            <input type="text" name="phone" value={formData.phone} onChange={handleInputChange}
                                   required className={styles.inputField}/>
                        </label>
                        {errors.phone && <p className={styles.error}>{errors.phone}</p>}
                        <button
                            className={`${styles.button} ${Object.values(errors).some(error => error !== '') ? styles.buttonInvalid : ''}`}
                            onClick={handleSave}
                            disabled={Object.values(errors).some(error => error !== '')}
                        > Save
                        </button>
                        <button className={styles.button} onClick={handleCancel}>Cancel</button>
                    </div>
                ) : (
                    user && <div>
                        <p>Username: {user.username}</p>
                        <p>Email: {user.email}</p>
                        <p>Password: {user.password}</p>
                        <p>Role: {user.role.name}</p>
                        <p>Age: {user.age}</p>
                        <p>Phone: {user.phone}</p>
                        <button className={styles.editButton} onClick={handleEdit}><FontAwesomeIcon icon={faEdit}/>
                        </button>
                    </div>
                )}
                <button className={`${styles.button} ${styles.buttonBack}`} onClick={handleBack}>Back</button>
            </div>
        );
    }
;

export default UserDetails;
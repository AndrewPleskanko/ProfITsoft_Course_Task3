import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import styles from './UserList.module.css';
import {GET_USER_LIST, GET_USER, USER_DETAIL_PAGE, USER_DETAIL_NEW_PAGE} from '../constants/apiConstants';
import {
    ADD_USER_BUTTON_TEXT,
    CONFIRM_DELETE_MESSAGE,
    EMAIL_FILTER_PLACEHOLDER,
    ERROR_MESSAGE_DELETE,
    NEXT_BUTTON_TEXT,
    PREVIOUS_BUTTON_TEXT,
    SUCCESS_MESSAGE_DELETE,
    USERNAME_FILTER_PLACEHOLDER,
    USERS_HEADING,
} from '../constants/messageConstants';
import {getFromStorage, saveToStorage} from "../utils/storage";

const UserList = () => {
    const [hoveredUserId, setHoveredUserId] = useState(null);
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const [pageRange, setPageRange] = useState([1, 10]);

    const [filter, setFilter] = useState(() => {
        return getFromStorage('filter', {username: '', email: ''});
    });
    const [page, setPage] = useState(() => {
        return getFromStorage('page', 1);
    });

    const [usernameFilter, setUsernameFilter] = useState(() => {
        return getFromStorage('usernameFilter', '');
    });
    const [emailFilter, setEmailFilter] = useState(() => {
        return getFromStorage('emailFilter', '');
    });

    const fetchUsers = () => {
        setLoading(true);
        axios.post(GET_USER_LIST, {page: page - 1, ...filter})
            .then(response => {
                if (response) {
                    setUsers(response.content);
                    setTotalPages(response.totalPages);
                    setLoading(false);
                } else {
                    throw new Error('No response data from the server');
                }
            })
    };

    const deleteUser = (userId) => {
        return axios.delete(`${GET_USER}${userId}`)
            .then(() => {
                setMessage({type: 'success', text: SUCCESS_MESSAGE_DELETE});
                setTimeout(() => setMessage(null), 20000);
            }).catch(error => {
                setMessage({type: 'error', text: ERROR_MESSAGE_DELETE});
            });
    };

    useEffect(() => {
        fetchUsers();
    }, [filter, page]);

    const confirmDelete = (userId) => {
        if (window.confirm(CONFIRM_DELETE_MESSAGE)) {
            deleteUser(userId).then(fetchUsers);
        }
    };

    const navigateToUserDetail = (userId) => {
        navigate(`${USER_DETAIL_PAGE}${userId}`);
    };

    const navigateToUserCreation = () => {
        navigate(USER_DETAIL_NEW_PAGE);
    };

    const handleFilterChange = (event) => {
        if (event.target.name === 'username') {
            setUsernameFilter(event.target.value);
            saveToStorage('usernameFilter', event.target.value);
        } else if (event.target.name === 'email') {
            setEmailFilter(event.target.value);
            saveToStorage('emailFilter', event.target.value);
        }
        const newFilter = {...filter, [event.target.name]: event.target.value};
        setFilter(newFilter);
        saveToStorage('filter', newFilter);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        if (newPage > pageRange[1]) {
            setPageRange([pageRange[0] + 10, pageRange[1] + 10]);
        } else if (newPage < pageRange[0]) {
            setPageRange([pageRange[0] - 10, pageRange[1] - 10]);
        }
        saveToStorage('page', newPage);
    };


    return (
        <div className={styles.container}>
            <h1>{USERS_HEADING}</h1>
            {message &&
                <p className={message.type === 'error' ? styles.errorMessage : styles.successMessage}>{message.text}</p>}
            <div className={styles.filterContainer}>
                <input type="text" name="username" value={usernameFilter} onChange={handleFilterChange}
                       placeholder={USERNAME_FILTER_PLACEHOLDER} className={styles.inputField}/>
                <input type="text" name="email" value={emailFilter} onChange={handleFilterChange}
                       placeholder={EMAIL_FILTER_PLACEHOLDER} className={styles.inputField}/>
            </div>
            <button onClick={navigateToUserCreation} className={styles.addButton}>{ADD_USER_BUTTON_TEXT}</button>
            {users.map((user) => (
                <div key={user.id} onMouseEnter={() => setHoveredUserId(user.id)}
                     onMouseLeave={() => setHoveredUserId(null)}>
                    <h2 onClick={() => navigateToUserDetail(user.id)}>{user.username}</h2>
                    <p>Email: {user.email}</p>
                    {hoveredUserId === user.id &&
                        <button onClick={() => confirmDelete(user.id)}><FontAwesomeIcon icon={faTrash}/></button>}
                </div>
            ))}
            <div className={styles.buttonContainer}>
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}
                        className={styles.pageButton}>{PREVIOUS_BUTTON_TEXT}
                </button>
                {[...Array(totalPages).keys()].slice(pageRange[0] - 1, pageRange[1]).map((value) =>
                    <button key={value} onClick={() => handlePageChange(value + 1)} className={styles.pageButton}>
                        {value + 1}
                    </button>
                )}
                <button onClick={() => handlePageChange(page + 1)} className={styles.pageButton}
                        disabled={page === totalPages}>{NEXT_BUTTON_TEXT}
                </button>
            </div>
        </div>
    );
};

export default UserList;
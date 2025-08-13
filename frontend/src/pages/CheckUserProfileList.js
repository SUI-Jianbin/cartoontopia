import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UserList.css';
import HeadBar from '../components/Header';
import Footer from '../components/Footer';
import userAvataricon from '../mockup/userdefaultavatar.png';

export default function UserList(){

    const navigate = useNavigate();
    const [currentUserRole, setCurrentUserRole] = useState(localStorage.getItem('role'));
    const [currentUserEmail, setCurrentUserEmail] = useState(JSON.parse(localStorage.getItem('currentLoginUser')).email);
    const [searchTerm, setSearchTerm] = useState('');
    const [userList, setUserList] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [noUserFoundAlert, setNoUserFoundAlert] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentSelectedUser, setCurrentSelectedUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async() => {
            try{
                const response = await fetch('http://localhost:3000/userlist/getallusers')
                if(!response.ok){
                    throw new Error('Loading user list failed!');
                }else{
                    const result = await response.json();
                    setUserList(result);
                }
            }
            catch (error) {
                setError(error.message);
            }finally {
                setLoading(false);
            }
        };
        fetchUsers();
    },[]);

    const updateUsersList = async() => {
        try{
            const response = await fetch('http://localhost:3000/users/getallusers')
            if(!response.ok){
                throw new Error('Loading user list failed!');
            }else{
                const result = await response.json();
                setUserList(result);
            }
        }
        catch (error) {
            setError(error.message);
        }finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let newFilteredUsers = userList;

        if (searchTerm) {
            newFilteredUsers = newFilteredUsers.filter(user =>
                user.firstname.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredUsers(newFilteredUsers);
        setNoUserFoundAlert(newFilteredUsers.length === 0);
    }, [searchTerm, userList]);

    const searchFilter = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

    };

    const handleRowClick = (user) => {
        setCurrentSelectedUser(user);
        navigate('../pages/userProfile', { state: { selectedUser: user } });
    };

    return(
        <>
            <HeadBar userRole={currentUserRole}></HeadBar>
            <div className="cartoonopia-header">
                <div className="web-intro">
                    <h1 className="cartoonopia-title">Cartoonopia</h1>
                    <p className="cartoonopia-intro">
                        The home of characters and cartoons!
                    </p>
                </div>
            </div>
            <div className="background-image-blur-whitewash"></div>
            <div className="user-list">
                <div className="user-search">
                    <div className="search-input">
                        <input
                            type="text"
                            className="search-input-text"
                            placeholder="Search user to be managed..."
                            value={searchTerm}
                            onChange={searchFilter}
                        />
                        <p className="user-nofound-text" style={{ display: noUserFoundAlert ? 'block' : 'none' }}>
                            No User found
                        </p>
                    </div>
                    <div className="user-search-result-table-container">
                        <table className="user-search-result-table">
                            <thead>
                            <tr>
                                <th>UserAvatar</th>
                                <th>FirstName</th>
                                <th>LastName</th>
                                <th>Email</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.username} onClick={() => handleRowClick(user)}>
                                    <td><img className="userAvatarImg" src={userAvataricon} alt="<UserName>"></img></td>
                                    <td>{user.firstname}</td>
                                    <td>{user.lastname}</td>
                                    <td>{user.email}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

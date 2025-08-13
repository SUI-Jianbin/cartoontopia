import React, { useState, useEffect } from 'react';
import '../styles/UserList.css';
import HeadBar from '../components/Header';
import Footer from '../components/Footer';
import userAvataricon from '../mockup/userdefaultavatar.png';

export default function UserList(){

    const [currentUserRole, setCurrentUserRole] = useState(localStorage.getItem('role'));
    const [currentUserEmail, setCurrentUserEmail] = useState(JSON.parse(localStorage.getItem('currentLoginUser')).email);
    const [searchTerm, setSearchTerm] = useState('');
    const [userList, setUserList] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [noUserFoundAlert, setNoUserFoundAlert] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSelectedUser, setCurrentSelectedUser] = useState(null);
    const [currentAdminList, setCurrentAdminList] = useState([]);

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

    useEffect(() => {
        const fetchAdmins = async() => {
            try{
                const response = await fetch('http://localhost:3000/userlist/getalladmins')
                if(!response.ok){
                    throw new Error('Loading user list failed!');
                }else{
                    const result = await response.json();
                    setCurrentAdminList(result);
                }
            }
            catch (error) {
                setError(error.message);
            }finally {
                setLoading(false);
            }
        };
        fetchAdmins();
    },[]);

    const updateUsersList = async() => {
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

    const updateAdminList = async() => {
        try{
            const response = await fetch('http://localhost:3000/userlist/getalladmins')
            if(!response.ok){
                throw new Error('Loading user list failed!');
            }else{
                const result = await response.json();
                setCurrentAdminList(result);
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

        if(user.email !== currentUserEmail){
            setIsModalOpen(true);
        }else{
            alert(`Cannot modify user that currently login!`);
        }
    };

    const CheckIfSelectedUserIsAdmin = (user) => {
        const userId = user._id;
        return currentAdminList.some(adminId => adminId._id === userId);
    }

    const ChangeRolePopUpWindow = ({ isOpen, user, onClose}) => {
        if (!isOpen) return null;

        const isAdmin = CheckIfSelectedUserIsAdmin(user);

        const updateUserRole = async (user, isAdmin) => {

            try {
                const userId = user._id;
                const response = await fetch(`http://localhost:3000/userlist/updateRole/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({isAdmin})
                });

                if (response.ok) {
                    const updateRole = await response.json();
                    onClose();
                    alert(`${user.firstname + " " + user.lastname} has now become an ${updateRole}`)
                    updateAdminList();

                } else {
                    throw new Error('Failed to update user role.');
                }
            } catch (error) {
                console.error('Error updating user role:', error);
            }
        }

        return (
            <>
                <div className="ChangeRolePopUpWindowBg">
                    <div className="ChangeRolePopUpWindow">
                        <p className="change-role-title">Do you want to make {user.firstname + " " + user.firstname} an {isAdmin ==true ? "member" : "admin"}?</p>
                        <button className="user-confirm" onClick={() => updateUserRole(user, isAdmin ==true ? "member" : "admin")}>Confirm</button>
                        <button className="user-cancel" onClick={onClose}>Cancel</button>
                    </div>
                </div>
            </>
        );
    };
    return(
        <>
            <HeadBar userRole={currentUserRole}></HeadBar>
            <ChangeRolePopUpWindow
                isOpen={isModalOpen}
                user={currentSelectedUser}
                onClose={() => setIsModalOpen(false)}
            />
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

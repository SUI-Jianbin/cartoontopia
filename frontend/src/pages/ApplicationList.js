import React, { useState, useEffect } from 'react';
import '../styles/ApplicationList.css';
import HeadBar from '../components/Header';
import Footer from '../components/Footer';
import Applicationicon from '../mockup/form.png';

// list of application form
export default function ApplicationList(){
    const [currentUserRole] = useState(localStorage.getItem('role'));
    const [searchTerm, setSearchTerm] = useState('');
    const [changeList, setchangeList] = useState([]);
    const [filteredChangeCases, setFilteredChangeCases] = useState([]);
    const [noChangeCaseFoundAlert, setNoChangeCaseFoundAlert] = useState(false);
    const [setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSelectedChangeCase, setCurrentSelectedChangeCase] = useState(null);
    const currentUser = localStorage.getItem('currentLoginUser') ? JSON.parse(localStorage.getItem('currentLoginUser')) : null;
    const [olddata, setOlddata] = useState({});
    const operatorId = currentUser._id;

    useEffect(() => {
        const fetchChangeCase = async() => {
            try{
                const response = await fetch('http://localhost:3000/contribution/getAllContributions')
                if(!response.ok){
                    throw new Error('Loading contribution list failed!');
                }else{
                    const result = await response.json();
                    setchangeList(result);
                }
            }
            catch (error) {
                setError(error.message);
            }finally {
                setLoading(false);
            }
        };
        fetchChangeCase();

    },[]);

    const updateChangeCasesList = async() => {
        try{
            const response = await fetch('http://localhost:3000/contribution/getAllContributions')
            if(!response.ok){
                throw new Error('Loading contribution list failed!');
            }else{
                const result = await response.json();
                setchangeList(result);
            }
        }
        catch (error) {
            setError(error.message);
        }finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let newFilteredChangeCases = changeList;
        if (searchTerm) {
            newFilteredChangeCases = newFilteredChangeCases.filter(currentCase =>
                currentCase.user_id._id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredChangeCases(newFilteredChangeCases);
        setNoChangeCaseFoundAlert(newFilteredChangeCases.length === 0);
    }, [searchTerm, changeList]);

    const searchFilter = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
    };

    const handleRowClick = (currentCase) => {
        setCurrentSelectedChangeCase(currentCase);
        if(currentCase != null){
            setIsModalOpen(true);
        }
    };

    function ChangeCaseDetailModule({ currentCase, onClose }) {

        const currentContributionDetail = currentCase.data;
        console.log("current contribution details is:", currentContributionDetail);
        return (
            <div className="whole-change-case-containers">
                <div className="change-case-detail-containers">
                    <div className="character-state-module">
                        {Object.entries(currentContributionDetail).map(([key, value]) => (
                            <p key={key}><strong>{key}: </strong> {value.toString()}</p>
                        ))}
                    </div>
                </div>
                {currentCase.status.toLowerCase() === "pending" ? (
                    <>
                        <button className="approval-btn" onClick={() => updateCaseStatus(currentCase._id.toString(), "Approved", onClose)}>Approve</button>
                        <button className="reject-btn" onClick={() => updateCaseStatus(currentCase._id.toString(), "Rejected", onClose)}>Reject</button>
                        <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    </>
                ):(<><button className="cancel-btn" onClick={onClose}>Back</button></>)}
            </div>
        );
    }

    const updateCaseStatus = async (caseId, newStatus, onClose) => {
        const operatorId = currentUser._id;
        try {
            const response = await fetch(`http://localhost:3000/contribution/updateContribution/${caseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({newStatus, operatorId })
            });

            if (response.ok) {
                const updateCase = await response.json();
                onClose();
                alert(`This case is now be ${updateCase.status} !`)
                updateChangeCasesList();

                if (updateCase.action == 'AddCharacter'){
                    let character = updateCase.data
                    let adminData = {
                        ...character,
                        active: true
                    }
                    try {
                        const response = await fetch('http://localhost:3000/characters/addcharacters', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(adminData)
                        });

                        if (!response.ok ) {
                            response.json().then(data => {
                                alert(data.message);
                            }).catch(error => {
                                console.error('Error parsing JSON:', error);
                                alert('An error occurred. Please try again.');
                            });
                        }
                    } catch (error) {
                        console.error('Submission Error:', error);
                        alert('An error occurred during submission. Please try again.');
                    }
                }
                if (updateCase.action === 'EditCharacter'){
                    let characterId = updateCase.data.id
                    try {
                        const response = await fetch(`http://localhost:3000/characters/editcharacters/${characterId}`);
                        const data = await response.json();
                        if (response.ok) {
                            setOlddata(data)
                        } else {
                            throw new Error(data.message);
                        }
                    } catch (err) {
                        setError(err.message);
                    } finally {
                        setLoading(false);
                    }

                }
                try {
                    let newcharacter = {...olddata,...updateCase.data}

                    const response = await fetch(`http://localhost:3000/characters/editcharacters/${newcharacter.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newcharacter)
                    });
                    const data = await response.json();
                    if (!response.ok) throw new Error(data.message);
                } catch (err) {
                    setError(err.message);
                }
            } else {
                throw new Error('Failed to update user role.');
            }
        } catch (error) {
            console.error('Error updating user role:', error);
        }
    }

    const AddNewCharacter = async (newCharacter) => {
        try {
            const response = await fetch('http://localhost:3000/characters/addcharacters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCharacter)
            });

            if (response.ok && response.text()) {
                setTimeout(() => {
                    console.log("Successfully add new character!")
                }, 666);
            } else {
                response.json().then(data => {
                    alert(data.message);
                }).catch(error => {
                    console.error('Problem Occur when parsing json:', error);
                    alert('An error occurred. Please try again.');
                });
            }
        } catch (error) {
            console.error('Submission Error:', error);
            alert('An error occurred during submission. Please try again.');
        }
    }

    const ChangeCurrentCharacter = async (originCharacterName, newCharacter) => {
        try {
            const response = await fetch(`http://localhost:3000/characters/editcharacters/${originCharacterName}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCharacter)
            });

            if (response.ok && response.text()) {
                setTimeout(() => {
                    console.log("Successfully change old character!")
                }, 666);
            } else {
                response.json().then(data => {
                    alert(data.message);
                }).catch(error => {
                    console.error('Problem Occur when parsing json:', error);
                    alert('An error occurred. Please try again.');
                });
            }
        } catch (error) {
            console.error('Submission Error:', error);
            alert('An error occurred during submission. Please try again.');
        }
    }


    const ChangeCasePopUpWindow = ({ isOpen, currentCase, onClose}) => {
        console.log("current contribution is: ", currentCase);
        if (!isOpen) return null;
        return (
            <>
                <div className="ChangeRolePopUpWindowBg">
                    <div className="ChangeRolePopUpWindow">
                        <ChangeCaseDetailModule currentCase={currentCase} onClose={onClose}/>
                    </div>
                </div>
            </>
        );
    };

    return(
        <>
            <HeadBar userRole={currentUserRole}></HeadBar>
            <ChangeCasePopUpWindow
                isOpen={isModalOpen}
                currentCase={currentSelectedChangeCase}
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
                            placeholder="Search change by status..."
                            value={searchTerm}
                            onChange={searchFilter}
                        />
                        <p className="user-nofound-text" style={{ display: noChangeCaseFoundAlert ? 'block' : 'none' }}>
                            No Application found
                        </p>
                    </div>
                    <div className="user-search-result-table-container">
                        <table className="user-search-result-table">
                            <thead>
                            <tr>
                                <th>ChangeAvatar</th>
                                <th>Contributor</th>
                                <th>Application Type</th>
                                <th>Reviewer</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredChangeCases.map(singleCase => (
                                <tr key={singleCase.contribution_id} onClick={() => handleRowClick(singleCase)}>
                                    <td><img className="userAvatarImg" src={Applicationicon} alt="<UserName>"></img></td>
                                    <td>{singleCase.user_id._id}</td>
                                    <td>{singleCase.action}</td>
                                    <td>{singleCase.reviewed_by == null ?  "UNKNOWN" : singleCase.reviewed_by._id}</td>
                                    <td>{singleCase.date}</td>
                                    <td>{singleCase.status}</td>
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
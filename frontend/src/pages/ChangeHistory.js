import React, { useState, useEffect } from 'react';
import '../styles/ChangeHistory.css';
import HeadBar from '../components/Header';
import Footer from '../components/Footer';
import ApplicationIcon from '../mockup/form.png';

export default function ChangeHistory() {
    const [currentUserRole, setCurrentUserRole] = useState(localStorage.getItem('role'));
    const [applications, setApplications] = useState([]);
    const [changeList, setchangeList] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSelectedChangeCase, setCurrentSelectedChangeCase] = useState(null);
    const currentUser = localStorage.getItem('currentLoginUser') ? JSON.parse(localStorage.getItem('currentLoginUser')) : null;

    useEffect(() => {
        async function fetchApplications() {
            try {
                const response = await fetch('http://localhost:3000/contribution/getNonPendingContribution');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setApplications(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchApplications();
    }, []);

    const handleRowClick = (currentCase) => {
        setCurrentSelectedChangeCase(currentCase);
        if(currentCase != null){
            setIsModalOpen(true);
        }
    };

    const updateChangeCasesList = async () => {
        try {
            const response = await fetch('http://localhost:3000/contribution/getAllContributions');
            if (!response.ok) {
                throw new Error('Loading contribution list failed!');
            } else {
                const result = await response.json();
                setchangeList(result);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    function ChangeCaseDetailModule({ currentCase, onClose }) {
        const currentContributionDetail = currentCase.data;
        return (
            <div className="whole-change-case-containers">
                <div className="change-case-detail-containers">
                    <div className="character-state-module">
                        {Object.entries(currentContributionDetail).map(([key, value]) => (
                            <p key={key}><strong>{key}: </strong> {value.toString()}</p>
                        ))}
                    </div>
                </div>
                <button className="cancel-btn" onClick={onClose}>Back</button>
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
                body: JSON.stringify({ newStatus, operatorId })
            });

            if (response.ok) {
                const updateCase = await response.json();
                onClose();
                alert(`This case is now be ${updateCase.status}!`);
                updateChangeCasesList();
            } else {
                throw new Error('Failed to update user role.');
            }
        } catch (error) {
            console.error('Error updating user role:', error);
        }
    };

    const ChangeCasePopUpWindow = ({ isOpen, currentCase, onClose }) => {
        if (!isOpen) return null;

        return (
            <div className="ChangeRolePopUpWindowBg">
                <div className="ChangeRolePopUpWindow">
                    <ChangeCaseDetailModule currentCase={currentCase} onClose={onClose} />
                </div>
            </div>
        );
    };

    return (
        <>
            <HeadBar userRole={currentUserRole} />
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
            <div className="container">
                <table className="historyTable">
                    <thead>
                    <tr>
                        <th>ChangeAvatar</th>
                        <th>CharacterName</th>
                        <th>Application Type</th>
                        <th>Creator</th>
                        <th>Create time</th>
                        <th>Operator</th>
                    </tr>
                    </thead>
                    <tbody>
                    {applications.map(app => (
                        <tr key={app._id} onClick={() => handleRowClick(app)}>
                            <td><img className="userAvatarImg" src={ApplicationIcon} alt="Avatar" /></td>
                            <td>{app.data.id}</td>
                            <td>{app.action}</td>
                            <td>{app.user_id._id}</td>
                            <td>{app.date}</td>
                            <td>{app.reviewed_by == null ? "UNKNOWN" : app.reviewed_by._id}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <Footer />
        </>
    );
}
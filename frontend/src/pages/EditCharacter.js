import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/EditCharacter.css';
import successImage from '../mockup/submiticon.png';
import HeadBar from '../components/Header';
import Footer from '../components/Footer';

// edit character page
const EditCharacter = () => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('currentLoginUser')));
    const [currentUserRole, setCurrentUserRole] = useState(localStorage.getItem('role'));
    const [message, setMessage] = useState('');
    const {id} = useParams();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();
    const [allRecords, setAllRecords] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [isEditable, setIsEditable] = useState(true);
    const [character, setCharacter] = useState({});
    const [editCharacter, setEditCharacter] = useState({});
    const [contribution, setContribution] = useState({
        contribution_id: '',
        user_id: {_id: currentUser._id},
        action: 'EditCharacter',
        status: 'Pending',
        reviewed_by: null,
        date: Date.now(),
        data: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCharacter = async () => {
            try {
                const response = await fetch(`http://localhost:3000/characters/editcharacters/${id}`);
                const data = await response.json();
                if (response.ok) {
                    setCharacter(data);
                    setEditCharacter(data)
                } else {
                    throw new Error(data.message);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCharacter();
    }, [id]);

    const handleChange = async (e) => {
        const { name, value } = e.target;
        const parsedValue = name === 'name' || name === 'subtitle' || name === 'description' ? value : Number(value);
        setEditCharacter(prevCharacter => ({
            ...prevCharacter,
            [name]: parsedValue
        }));
    };

    function findDifferences(original, modified) {
        const changes = {id:original.id};
        Object.keys(modified).forEach(key => {
            if (original.hasOwnProperty(key) && original[key] !== modified[key]) {
                changes[key] = modified[key];
            }
        });
        return changes;
    }

    useEffect(() => {
        const fetchPeningRequest = async () => {
            try {
                const response = await fetch('http://localhost:3000/contribution/getAllPeningRecords');
                if (!response.ok) {
                    throw new Error('Loading pending list failed...');
                }
                const data = await response.json();
                const originCharacters = data.map(item => item.data);
                const isCharacterEditable = !originCharacters.some(character => character.id === id);
                if (!isCharacterEditable) {
                    setIsEditable(false);
                    setShowAlert(true);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPeningRequest();
    }, [id]);

    useEffect(() => {
        if ( showAlert ) {
            setTimeout(() => {
                alert('The current character cannot be edited because another user has already submitted the changes request');
            }, 666);
        }
    }, [showAlert]);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!isEditable ) return
        const differences = findDifferences(character, editCharacter);
        if (Object.keys(differences).length === 1) {
            alert('There is no change on current character')
            return;
        }
        if (currentUserRole === "admin") {
            try {
                const response = await fetch(`http://localhost:3000/characters/editcharacters/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(editCharacter)
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message);
            } catch (err) {
                setError(err.message);
            }
        }

        try {
            let dataToSend = {
                ...contribution,
                date: Date.now(),
                user_id: { _id: currentUser._id},
                status: currentUserRole === "admin" ? 'Approved' : 'Pending',
                reviewed_by: currentUserRole === "admin" ? {_id: currentUser._id} : null,
                data: differences
            };
            const response = await fetch(`http://localhost:3000/contribution/editcharacters`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(dataToSend)
            });

            const responseData = await response;
            if (!response.ok) throw new Error(responseData.message);
            setTimeout(() => {
                setIsSubmitted(true);
            }, 666);

        } catch (err) {
            setError(err.message);
            console.error("Error saving data:", err);
        }
    };

    const handleCancel = () => {
        setTimeout(() => {
            navigate('/list_character');
        }, 666);
    };

    const handleReturn = ()=> {
        setTimeout(() => {
            navigate('/main')
        }, 666);
    }
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    function SetAttribute () {
        return ['strength', 'speed', 'skill', 'fear_factor', 'power', 'intelligence', 'wealth'].map(attr => {
            const label = attr.replace(/_/g, ' ')
                .replace(/(^\w|\s\w)/g, m => m.toUpperCase());
            return (
                <div key={attr} className="attribute">
                    <div className="attribute-label">{label}:</div>
                    <div className="attribute-slider">
                        <input
                            type="range"
                            name={attr}
                            value={editCharacter[attr]}
                            onChange={handleChange}
                            className="range-input"
                        />
                        <span className="slider-value">{editCharacter[attr]}</span>
                    </div>
                </div>
            );
        });
    }

    if (isSubmitted) {
        return (
            <>
                <HeadBar userRole={currentUserRole}></HeadBar>
                <div className="background-image-blur-whitewash"></div>
                <div className="character-board-edit">
                    <img src={successImage} alt="Success" className="sucessful_img"/>
                    <p>Character successfully edited and submitted for approval!</p>
                    <button className= "edit-list-btn" onClick={handleCancel}>Return to Character List</button>
                    <button className= "return-btn" onClick={handleReturn}>Return to Main Page</button>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <HeadBar userRole={currentUserRole}></HeadBar>
            <div className="background-image-blur-whitewash"></div>
            <div className="character-board">
                <form onSubmit={handleSave} className="form-container">
                    <div className="character-info">
                        <img src={editCharacter.image_url} alt="Character" className="edit-character-image"/>
                        <div className="input-group">
                            <input
                                type="text"
                                name="name"
                                value={editCharacter.name}
                                onChange={handleChange}
                                placeholder="Name"
                                className="text-input"
                                required
                            />
                            <input
                                type="text"
                                name="subtitle"
                                value={editCharacter.subtitle}
                                onChange={handleChange}
                                placeholder="Subtitle"
                                className="text-input"
                                required
                            />
                        </div>
                    </div>
                    <textarea
                        name="description"
                        value={editCharacter.description}
                        onChange={handleChange}
                        placeholder="Description"
                        className="textarea-input"
                        required
                    />
                    <div>
                        {SetAttribute(editCharacter, handleChange)}
                    </div>
                    <div className="button-container">
                        <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
                        {isEditable && <button type="submit" className="submit-button">Submit</button>}
                    </div>
                    {message && <span className="confirmation-message">{message}</span>}
                </form>
            </div>
            <Footer />
        </>
    );
};

export default EditCharacter;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CharacterList.css';
import HeadBar from '../components/Header';
import Footer from '../components/Footer';

// a list of characters page, delete character from here
function DeleteCharacter() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('currentLoginUser')));
    const [currentUserRole, setCurrentUserRole] = useState(localStorage.getItem('role'));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [characterList, setCharacterList] = useState([]);
    const [filteredCharacters, setFilteredCharacters] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [noCharacterFoundAlert, setNoCharacterFoundAlert] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCharacter, setCurrentCharacter] = useState('')
    const [contribution, setContribution] = useState({
        contribution_id: '',
        user_id: { _id: currentUser._id},
        action: 'DeleteCharacter',
        status: 'Approved',
        reviewed_by: null,
        date: Date.now,
        data: null
    });

    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                const response = await fetch('http://localhost:3000/characters/getallcharacters');
                if (!response.ok) {
                    throw new Error('Loading character list failed...');
                }
                const data = await response.json();
                setCharacterList(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCharacters();
    }, []);

    const updateCharacters = async () => {
        try {
            const response = await fetch('http://localhost:3000/characters/getallcharacters');
            if (!response.ok) {
                throw new Error('Loading character list failed...');
            }
            const data = await response.json();
            setCharacterList(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let newFilteredCharacters = characterList;

        if (searchTerm) {
            newFilteredCharacters = newFilteredCharacters.filter(character =>
                character.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredCharacters(newFilteredCharacters);
        setNoCharacterFoundAlert(newFilteredCharacters.length === 0);
    }, [searchTerm, characterList]);

    const searchFilter = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
    };

    const handleRowClick = (id) => {
        setCurrentCharacter(id)
        setIsModalOpen(true);
    };

    const DeleteCharacterPopUpWindow = ({isOpen, onClose}) => {
        if (!isOpen) return null;
        const deleteCharacter = async ( ) => {
            try {
                const response = await fetch(`http://localhost:3000/characters/deactivatecharacter/${currentCharacter}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    onClose();
                    alert(`${currentCharacter} has been deleted`)
                    updateCharacters();
                } else {

                    throw new Error('Failed to delete character.');
                }
            } catch (error) {
                console.error('Error deleting character: ', error);
                alert('Error deleting character: ' + error.message);
            }

            let dataToSend = {
                ...contribution,
                date: Date.now(),
                user_id: { _id: currentUser._id},
                reviewed_by: { _id: currentUser._id},
                data: {
                    id: currentCharacter
                }
            };

            try {
                const response = await fetch(`http://localhost:3000/contribution/deletecharacters`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify(dataToSend)
                });
                if (!response.ok) {
                    console.log("Fail to create new character");
                    alert('An error occurred. Please try again.');
                }
            } catch (err) {
                setError(err.message);
                alert('An error occurred during submission. Please try again.');
            }
        }

        return (
            <>
                <div className="delete-character-pop">
                    <div className="delete-character-pop-window">
                        <p className="delete-title">Do you want to remove the character: {currentCharacter}?</p>
                        <button className="delete-list-btn" onClick={deleteCharacter}>Confirm</button>
                        <button className="delete-cancel-button" onClick={onClose}>Cancel</button>
                    </div>
                </div>
            </>
        );
    };

    return (
        <>
            <HeadBar userRole={currentUserRole}></HeadBar>
            <DeleteCharacterPopUpWindow
                isOpen={isModalOpen}
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
            <div className="character-list">
                <span className="promotion">Please choose one of the character to delete from below list</span>
                <div className="character-search">
                    <div className="search-input">
                        <input
                            type="text"
                            className="search-input-text"
                            placeholder="Search character to be deleted..."
                            value={searchTerm}
                            onChange={searchFilter}
                        />
                        <p className="haracter-nofound-text" style={{ display: noCharacterFoundAlert ? 'block' : 'none' }}>
                            No characters found
                        </p>
                    </div>
                    <div className="search-result-table-container">
                        <table className="search-result-table">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Strength</th>
                                <th>Speed</th>
                                <th>Skill</th>
                                <th>Fear Factor</th>
                                <th>Power</th>
                                <th>Intelligence</th>
                                <th>Wealth</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredCharacters.map(character => (
                                <tr key={character.name} onClick={() => handleRowClick(character.id)}>
                                    <td>{character.name}</td>
                                    <td>{character.strength}</td>
                                    <td>{character.speed}</td>
                                    <td>{character.skill}</td>
                                    <td>{character.fear_factor}</td>
                                    <td>{character.power}</td>
                                    <td>{character.intelligence}</td>
                                    <td>{character.wealth}</td>
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

export default DeleteCharacter;
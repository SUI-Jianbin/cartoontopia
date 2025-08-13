import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CharacterList.css';
import HeadBar from '../components/Header';
import Footer from '../components/Footer';

// a list of characters page, edit character from here
function CharacterList() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [characterList, setCharacterList] = useState([]);
    const [filteredCharacters, setFilteredCharacters] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [noCharacterFoundAlert, setNoCharacterFoundAlert] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState(localStorage.getItem('role'));

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
        setTimeout(() => {
            navigate(`/edit_character/${id}`);
        }, 666);
    };

    return (
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
            <div className="character-list">
                <span className="promotion">Please choose one of the character to edit from below list</span>
                <div className="character-search">
                    <div className="search-input">
                        <input
                            type="text"
                            className="search-input-text"
                            placeholder="Search character to be edited..."
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

export default CharacterList;
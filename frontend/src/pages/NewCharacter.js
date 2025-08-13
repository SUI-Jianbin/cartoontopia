import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NewCharacter.css';
import HeadBar from '../components/Header';
import successImage from '../mockup/submiticon.png';
import Footer from '../components/Footer';

const AddCharacter = () => {

    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('currentLoginUser')));
    const [currentUserRole, setCurrentUserRole] = useState(localStorage.getItem('role'));
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();
    const [character, setCharacter] = useState({
        id: '',
        name: '',
        subtitle: '',
        description: '',
        image_url: 'images/default_character.png',
        strength: 0,
        speed: 0,
        skill: 0,
        fear_factor: 0,
        power: 0,
        intelligence: 0,
        wealth: 0,
        active: false,
    });

    const [contribution, setContribution] = useState({
        contribution_id: '',
        user_id: {_id: currentUser._id},
        action: 'AddCharacter',
        status: 'Pending',
        reviewed_by: null,
        date: Date.now,
        data: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const handleChange = async (e) => {
        const { name, value } = e.target;
        const parsedValue = name === 'name' || name === 'subtitle' || name === 'description' ? value : Number(value);
        setCharacter(character => ({
            ...character,
            [name]: parsedValue,
            id: name === 'name' ? value.toLowerCase() : character.id
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let adminData = {
            ...character,
            active: true
        }

        if (currentUserRole === "admin") {
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

        let dataToSend = {
            ...contribution,
            date: Date.now(),
            user_id: {_id: currentUser._id},
            status: currentUserRole === "admin" ? 'Approved' : 'Pending',
            reviewed_by: currentUserRole === "admin" ? {_id: currentUser._id} : null,
            data: {
                id: character.id,
                name: character.name,
                subtitle: character.subtitle,
                description: character.description,
                image_url: character.image_url,
                strength: character.strength,
                speed: character.speed,
                skill: character.skill,
                fear_factor: character.fear_factor,
                power: character.power,
                intelligence: character.intelligence,
                wealth: character.wealth
            }
        };

        try {
            const response = await fetch(`http://localhost:3000/contribution/editcharacters`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(dataToSend)
            });
            if (response.ok) {
                setTimeout(() => {
                    setIsSubmitted(true);
                }, 666);
            } else {
                console.log("Fail to create new character");
                alert('An error occurred. Please try again.');
            }
        } catch (err) {
            setError(err.message);
            alert('An error occurred during submission. Please try again.');
        }
    }

    const handleAddNewCharacter = () => {
        setIsSubmitted(false);
        setCharacter({
            id: '',
            name: '',
            subtitle: '',
            description: '',
            image_url: 'images/default_character.png',
            strength: 0,
            speed: 0,
            skill: 0,
            fear_factor: 0,
            power: 0,
            intelligence: 0,
            wealth: 0,
            active: false,
        });
    };

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
                            value={character[attr]}
                            onChange={handleChange}
                            className="range-input"
                        />
                        <span className="slider-value">{character[attr]}</span>
                    </div>
                </div>
            );
        });
    }

    const handleCancel = () => {
        navigate('/main');
    };

    if (isSubmitted) {
        return (
            <>
                <HeadBar userRole={currentUserRole}></HeadBar>
                <div className="background-image-blur-whitewash"></div>
                <div className="character-board">
                    <img src={successImage} alt="Success" className="sucessful_img"/>
                    <p>{currentUser.role === "admin" ?
                        "Character successfully added and published!" :
                        "Character successfully added and submitted for approval!"}</p>
                    <button className= "add-new-btn" onClick={handleAddNewCharacter}>Add New Character</button>
                    <button className= "return-btn" onClick={() => navigate('/main')}>Return to Main Page</button>
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
                <form onSubmit={handleSubmit} className="new-form-container">
                    <div className="character-info">
                        <img src={character.image_url} alt="Character" className="character-image"/>
                        <div className="input-group">
                            <input
                                type="text"
                                name="name"
                                value={character.name}
                                onChange={handleChange}
                                placeholder="Name"
                                className="text-input"
                                required
                            />
                            <input
                                type="text"
                                name="subtitle"
                                value={character.subtitle}
                                onChange={handleChange}
                                placeholder="Subtitle"
                                className="text-input"
                                required
                            />
                        </div>
                    </div>
                    <textarea
                        name="description"
                        value={character.description}
                        onChange={handleChange}
                        placeholder="Description"
                        className="new-textarea-input"
                        required
                    />
                    <div>
                        {SetAttribute(character, handleChange)}
                    </div>
                    <div className="button-container">
                        <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
                        <button type="submit" className="submit-button">Submit</button>
                    </div>
                    {message && <span className="confirmation-message">{message}</span>}
                </form>
            </div>
            <Footer />
        </>
    );
};

export default AddCharacter;
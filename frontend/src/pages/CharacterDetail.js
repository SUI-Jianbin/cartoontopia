import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import HeadBar from '../components/Header';
import Footer from '../components/Footer';
import '../styles/CharacterDetail.css';
import heartIcon from '../mockup/heart.png';

const CharacterDetail = () => {
    const userRole = localStorage.getItem('role');
    const [characterData, setCharacterData] = useState(null);
    const [ addBy, setAddBy] = useState({});
    const [ userDetail, setUserDetail] = useState({});
    const {id} = useParams();
    const [contribution, setContributionData] = useState('');
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('currentLoginUser')));
    const userId = user ? user._id : null;
    const [isActive, setIsActive] = useState(false);

    let isFetched = false;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const characterResponse = await fetch(`http://localhost:3000/characters/characterdetail/${id}`);
                if (!characterResponse.ok) {
                    throw new Error('Failed to fetch character data');
                }
                const characterData = await characterResponse.json();
                setCharacterData(characterData);

                if (user && !isFetched) {
                    const favouritesResponse = await fetch(`http://localhost:3000/favourites/getFavouritesByUser/${userId}`);

                    if (!favouritesResponse.ok) {
                        throw new Error('Failed to fetch favourites');
                    }

                    const favouritesData = await favouritesResponse.json();
                    setIsActive(favouritesData.includes(characterData.name));
                    isFetched = true;
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    });

    useEffect(() => {
        const fetchCreatedby = async () => {
            try {
                const contributionResponse = await fetch('http://localhost:3000/contribution/getAddingContributionList');
                if (!contributionResponse.ok) {
                    throw new Error('Failed to fetch character data');
                }
                const characterData = await contributionResponse.json();
                setContributionData(characterData);
                const matchingRecord = characterData.find(item => item.data.id === id);
                if (matchingRecord) {
                    setAddBy(matchingRecord.user_id);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }

            try {
                const findUser = await fetch(`http://localhost:3000/userlist/getuserName/${addBy._id}`);
                const userDetail = await findUser.json();
                setUserDetail(userDetail);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchCreatedby();
    }, [addBy._id]);

    const updateFavorites = async (characterName, add) => {
        if (!user) {
            console.error("No user logged in.");
            return;
        }
        try {
            const action = add ? 'add' : 'remove';
            const response = await fetch(`http://localhost:3000/favourites/updateFavourite/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ character: characterName, action: action })
            });

            if (!response.ok) {
                throw new Error('Failed to update favourites on server');
            }
            setIsActive(add);  // Update isActive based on the action taken
        } catch (error) {
            console.error('Error updating favourites:', error);
        }
    };

    const toggleHeart = () => {
        setIsActive(current => {
            updateFavorites(characterData.name, !current);
            return !current;
        });
    };

    return (
        <>
            <div className="character-detail-container">
                <HeadBar userRole={userRole}></HeadBar>
                {characterData && (
                    <div className="character-detail-content">

                        <div className="character-detail-top-row">
                            <div className="character-detail-image">
                                <img src={characterData.image_url} alt={characterData.name} />
                            </div>
                            <div className="character-detail-info">
                                <h2>{characterData.name}</h2>
                                <p>Added by { userDetail.firstname + ' ' + userDetail.lastname || 'Anno'}</p>
                            </div>
                            <img
                                src={heartIcon}
                                alt="Love"
                                className={`heart-icon ${isActive ? 'active' : ''}`}
                                onClick={toggleHeart}
                            />
                        </div>

                        <div className="character-detail-stats">
                            <div className="stats-left">
                                <p>Strength: {characterData.strength}</p>
                                <p>Speed: {characterData.speed}</p>
                                <p>Skill: {characterData.skill}</p>
                                <p>Fear factor: {characterData.fear_factor}</p>
                                <p>Power: {characterData.power}</p>
                                <p>Intelligence: {characterData.intelligence}</p>
                                <p>Wealth: {characterData.wealth}</p>
                            </div>
                            <div className="stats-right">
                                <p>Subtitle: {characterData.subtitle}</p>
                                <p>Description: {characterData.description}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default CharacterDetail;
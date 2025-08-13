import React, {  useEffect, useState } from 'react';
import {  useLocation } from 'react-router-dom';
import '../styles/UserProfile.css';
import HeadBar from '../components/Header';
import markicon from '../mockup/markicon.png';
import battlelisticon from '../mockup/battlelisticon.png';
import contributionicon from '../mockup/contributionicon.png';
import userAvataricon from '../mockup/userdefaultavatar.png';
import favourCharacterImg from '../mockup/favourcharactericon.png';
import Applicationicon from '../mockup/form.png';
import Vsicon from '../mockup/vs.png';

export default function UserProfile() {
    const location = useLocation();
    const selectedUser = location.state ? location.state.selectedUser : null;
    const [currentUserRole, setCurrentUserRole] = useState(localStorage.getItem('role'));
    const user = localStorage.getItem('currentLoginUser') ? JSON.parse(localStorage.getItem('currentLoginUser')) : null;
    let characterBattleList = localStorage.getItem('battleHistory')
    if (typeof characterBattleList === 'string') {
        characterBattleList = JSON.parse(characterBattleList);
    }
    const [userRole, setUserRole] = useState(user ? user.role : 'member');
    const [favourCharacterList, setFavourCharacterList] = useState([]);
    const [currentUserContributionList, setContributionList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSelectedChangeCase, setCurrentSelectedChangeCase] = useState(null);
    const [loading, setLoading] = useState(true);

    let isFetch = false;

    useEffect(() => {
        const currentUserId = selectedUser ? selectedUser._id : user?._id;
        if (!currentUserId) {
            console.error('No ID provided for the user');
            return;
        }
        const fetchCharacterList = async () => {
            try {
                if(!isFetch){
                    const url = `http://localhost:3000/favourites/getFavouritesByUserId/${currentUserId}`;
                    const response = await fetch(url);
                    if (response.ok) {
                        isFetch = true;
                        const favouriteCharacterList = await response.json();
                        setFavourCharacterList(favouriteCharacterList);
                    } else {
                        isFetch = true;
                        console.error('Fetch Favour Characters Failed!', response.status)
                    }
                }
            }
            catch (error) {
                console.error('Fetch Favour Characters Error:', error);
            }
        };
        fetchCharacterList();
    }, [selectedUser])

    useEffect(() => {
        const currentCheckUserId = selectedUser ? selectedUser._id : user._id;
        if (!currentCheckUserId) {
            console.error('No id provided for the user');
            return;
        }
        const fetchContributionList = async () => {
            try {
                console.log(currentCheckUserId);
                const url = `http://localhost:3000/contribution/getContributionListById/${currentCheckUserId}`;
                const response = await fetch(url);

                if (response.ok) {
                    const data = await response.json();
                    setContributionList(data);

                } else {
                    console.error('Fetch Change Case Failed!', response.status)
                }
            }
            catch (error) {
                console.error('Fetch Change Case Error:', error);
            }finally {
                setLoading(false);
            }
        };
        fetchContributionList();
    }, [selectedUser, user?.username])

    const handleContributionClick = (currentCase) => {
        setCurrentSelectedChangeCase(currentCase);

        if(currentCase != null){
            setIsModalOpen(true);
        }else{
            alert(`Cannot modify user that currently login!`);
        }
    };

    const ChangeCasePopUpWindow = ({ isOpen, currentCase, onClose}) => {
        if (!isOpen) return null;

        return (
            <>
                <div className="ChangeRolePopUpWindowBg">
                    <div className="ChangeRolePopUpWindow">
                        <ChangeCaseDetailModule currentCase={currentCase} selectedUser={selectedUser} user = {user} onClose={onClose}/>
                    </div>
                </div>
            </>
        );
    };

    function ContributionModule( contributionList ) {
        return (
            <>
                <div className="user-profile-info-container">
                    <div className="user-profile-title-container">
                        < img className='contribution-icon-img' src={contributionicon}></img>
                        <p className='user-profile-title-text'>Change & Contribution</p >
                    </div>
                    <div className="separate-line"></div>
                    <div className='favour-characters-list-module'>
                        {contributionList.contributionList.map(contribution => (
                            <ContributionItem key={contribution.contribution_id} contribution={contribution} />
                        ))}
                    </div>
                </div>
            </>
        );
    }

    function ContributionItem ({contribution}) {
        return(
            <div className='contribution-item' onClick={() => handleContributionClick(contribution)}>
                < img className='favour-character-default-img' src={Applicationicon}/>
                <div className='contribution-detail'>
                    <p className='contribution-text'>{(contribution.reviewed_by == user._id && contribution.user_id != user._id) ? "Reviewed" : contribution.action }</p >
                    <p className='contribution-text'>{contribution ? contribution.date : "Unknown"}</p >
                    <p className='contribution-text'>{contribution ? contribution.status : "Unknown"}</p >
                </div>
            </div>
        );
    }

    return (
        <>
            <HeadBar userRole={currentUserRole} ></HeadBar>
            <ChangeCasePopUpWindow
                isOpen={isModalOpen}
                currentCase={currentSelectedChangeCase}
                onClose={() => setIsModalOpen(false)}
            />
            <div className="body-background">
                <div className="overall-user-profile-container">
                    <UserNameModule userName={selectedUser ? selectedUser.firstname+ " " + selectedUser.lastname : user.firstname + " " + user.lastname}/>
                    <FavourCharacterModule favourCharacterList={favourCharacterList}/>
                    <BattleListModule characterBattleList={selectedUser ? [] : characterBattleList} />
                    <ContributionModule contributionList={ currentUserContributionList }/>
                </div>
            </div>
        </>
    );
}

function UserNameModule({ userName }) {
    return (
        <div className="user-profile-name-container">
            < img className='user-avatar-img' src={userAvataricon}></img>
            <p className='user-name-text'>{userName}</p >

        </div>
    );
}

function FavourCharacterModule({ favourCharacterList }) {
    return (
        <>
            <div className="user-profile-info-container">
                <div className="user-profile-title-container">
                    < img className='mark-icon-img' src={markicon}></img>
                    <p className='user-profile-title-text'>Favourite Characters</p >
                </div>
                <div className="separate-line"></div>
                <div className='favour-characters-list-module'>
                    {favourCharacterList.map((characterName, index) => (
                        <CharacterItem key={index} characterName={characterName} />
                    ))}
                </div>
            </div>
        </>
    );
}

function CharacterItem ({characterName}) {
    return(
        <div className='character-item'>
            < img className='favour-character-default-img' src={favourCharacterImg}/>
            <p className='favourite-character-name-text'>{characterName ? characterName : "Unknown"}</p >
        </div>
    );
}

function BattleItem ({battleInfo}) {
    return(
        <div className='character-item'>
            <p className='battle-name-text'>{battleInfo.left ? battleInfo.left  : "Unknown"}</p >
            < img className='battle-default-img' src={Vsicon}/>
            <p className='battle-name-text'>{battleInfo.right ? battleInfo.right : "Unknown"}</p >
        </div>
    );
}

function BattleListModule( characterBattleList ) {
    return (
        <>
            <div className="user-profile-info-container">
                <div className="user-profile-title-container">
                    < img className='battle-list-icon-img' src={battlelisticon} alt="Battle List Icon"></img>
                    <p className='user-profile-title-text'>Battle List</p >
                </div>
                <div className="separate-line"></div>
                <div className='favour-characters-list-module'>
                    {(characterBattleList?.characterBattleList || []).map((battle, index) => (
                        <BattleItem key={index} battleInfo={battle} />
                    ))}
                </div>
            </div>
        </>
    );
}

const RevokeCurrentApplication = async( currentCase, selectedUser, currentUser ) => {
    try {
        if(selectedUser != null){
            alert("Cannot modify other user application forms!");
            return
        }
        let caseId = currentCase._id?.toString();
        let newStatus = "Revoke";

        if(selectedUser != null && selectedUser.email != currentUser.email){
            alert("Cannot modify other user application forms!");
            return
        }

        const operatorId = currentUser._id;
        const response = await fetch(`http://localhost:3000/contribution/updateContribution/${caseId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({newStatus, operatorId })
        });

        if (response.ok) {
            const updateCase = await response.json();
            alert(`This case is now be ${updateCase.status} !`)
        } else {
            throw new Error('Failed to revoke the contribution.');
        }
    } catch (error) {
        console.error('Error to update application status');
    }
}

function ChangeCaseDetailModule({ currentCase, selectedUser, user, onClose }) {
    const currentContributionDetail = currentCase.data;
    return (
        <div className="whole-change-case-containers">
            <div className="change-case-detail-containers">
                <div className="character-state-module">
                    {Object.entries(currentContributionDetail).map(([key, value]) => (
                        <p key={key}><strong>{key}: </strong> {value.toString()}</p >
                    ))}
                </div>
            </div>

            {currentCase.status.toLowerCase() === "pending" && (
                <button className="reject-btn" onClick={() => RevokeCurrentApplication(currentCase, selectedUser, user)}>Revoke</button>
            )}
            <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
    );
}
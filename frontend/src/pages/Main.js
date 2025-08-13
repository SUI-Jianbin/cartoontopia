import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Main.css';
import questionImg from '../mockup/questionicon.png';
import clickImg from '../mockup/click.png';
import HeadBar from '../components/Header';
import Footer from '../components/Footer';

// main page for all web visitors, only registered user can interactive with this page.
function Main() {
    const [userRole, setUserRole] = useState(localStorage.getItem('role'));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [characterList, setCharacterList] = useState([]);
    const [filteredCharacters, setFilteredCharacters] = useState([]);
    const [battleField, setBattleField] = useState({
        left: null,
        right: null,
        isLeftOccupied: false,
        isRightOccupied: false,
    });
    const [battleHistory, setBattleHistory] = useState([]);
    const [battleResult, setBattleResult] = useState(null);
    const [sliderValues, setSliderValues] = useState({
        strength: [0, 100],
        speed: [0, 100],
        skill: [0, 100],
        fear_factor: [0, 100],
        power: [0, 100],
        intelligence: [0, 100],
        wealth: [0, 100],
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [noCharacterFoundAlert, setNoCharacterFoundAlert] = useState(false);
    const [overallWinner, setOverallWinner] = useState(null)
    const navigate = useNavigate();

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
        newFilteredCharacters = newFilteredCharacters.filter(character => {
            return Object.keys(sliderValues).every(attribute => {
                const range = sliderValues[attribute];
                const value = attribute === 'fear' ? character['fear_factor'] : character[attribute];     // format character attribute
                return value >= range[0] && value <= range[1];
            });
        });

        if (searchTerm) {
            newFilteredCharacters = newFilteredCharacters.filter(character =>
                character.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredCharacters(newFilteredCharacters);
        setNoCharacterFoundAlert(newFilteredCharacters.length === 0);
    }, [searchTerm, sliderValues, characterList]);

    const checkLoginAndWarn = () => {
        if (!userRole) {
            alert("Please login first to interact with this page:)");
            return false;
        }
        return true;
    };

    const handleCheckboxChange = (character, isChecked) => {
        if (!checkLoginAndWarn()) return;
        setBattleField((prev) => {
            let updatedBattleField = { ...prev };
            if (isChecked) {
                if (!prev.isLeftOccupied) {
                    updatedBattleField.left = character;
                    updatedBattleField.isLeftOccupied = true;
                } else if (!prev.isRightOccupied) {
                    updatedBattleField.right = character;
                    updatedBattleField.isRightOccupied = true;
                } else {
                    alert('You can only compare two characters at a time.');
                    return prev
                }
            } else {
                if (prev.left === character) {
                    updatedBattleField.left = null;
                    updatedBattleField.isLeftOccupied = false;
                } else if (prev.right === character) {
                    updatedBattleField.right = null;
                    updatedBattleField.isRightOccupied = false;
                }
            }

            if (updatedBattleField.isLeftOccupied && updatedBattleField.isRightOccupied && (!prev.isLeftOccupied || !prev.isRightOccupied)) {
                const battleResults = startBattle(updatedBattleField.left, updatedBattleField.right);
                addToBattleHistory(updatedBattleField.left, updatedBattleField.right);
                resetBattleField();
            }
            return updatedBattleField;
        });
    };

    const startBattle = (leftCharacter, rightCharacter) => {
        const result = {};
        const attributes = ['strength', 'speed', 'skill', 'fear', 'power', 'intelligence', 'wealth'];

        let leftWinCount = 0;
        let rightWinCount = 0;

        attributes.forEach(attr => {
            if (leftCharacter[attr] > rightCharacter[attr]) {
                result[attr] = 'left';
                leftWinCount++;
            } else if (leftCharacter[attr] < rightCharacter[attr]) {
                result[attr] = 'right';
                rightWinCount++;
            } else {
                result[attr] = Math.random() < 0.5 ? 'left' : 'right';
                if (result[attr]  === 'left') {
                    leftWinCount++;
                } else {
                    rightWinCount++;
                }
            }
        });
        const Winner = leftWinCount > rightWinCount ? 'left' : 'right';
        setBattleResult(result);
        setOverallWinner(Winner)
        return { result, overallWinner };
    }

    const resetBattleField = () => {
        setBattleField({
            left: null,
            right: null,
            isLeftOccupied: false,
            isRightOccupied: false
        });
    };

    const searchFilter = (e) => {
        if (!checkLoginAndWarn()) return;
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
    };

    const isCharacterSelected = (character) => {
        return (
            character === battleField.left ||
            character === battleField.right
        );
    };
    // save the history to the localStorage [battleHistory]
    const addToBattleHistory = (leftCharacter, rightCharacter) => {
        const newBattleRecord = { left: leftCharacter.name, right: rightCharacter.name, date: new Date().toISOString() };
        const currentHistory = JSON.parse(localStorage.getItem('battleHistory')) || [];
        currentHistory.unshift(newBattleRecord);
        const updatedHistory = currentHistory.slice(0, 10);
        localStorage.setItem('battleHistory', JSON.stringify(updatedHistory));
        setBattleHistory(prevHistory => [
            ...prevHistory,
            { left: leftCharacter, right: rightCharacter }
        ]);
    };

    const handleSliderChange = (attribute, index, value) => {
        if (!checkLoginAndWarn()) return;
        setSliderValues(prev => ({
            ...prev,
            [attribute]: index === 0
                ? [parseInt(value), prev[attribute][1]]
                : [prev[attribute][0], parseInt(value)]
        }));
    };

    const handleRowClick = (id) => {
        if (!checkLoginAndWarn()) return;
        setTimeout(() => {
            navigate(`/characterdetail/${id}`);
        }, 666);
    };

    function Slider({ attribute, values, handleSliderChange }) {
        const [trackStyle, setTrackStyle] = useState({});

        useEffect(() => {
            const percent1 = (values[0] /100 ) * 100
            const percent2 = (values[1]/100 ) * 100
            const colorFillStyle = {
                background: `linear-gradient(to right, #e1e1e1 ${percent1}% , #000000 ${percent1}% , #000000 ${percent2}%, #e1e1e1 ${percent2}%)`,
            };
            setTrackStyle(colorFillStyle);
        }, [values]);

        const handleLeftSliderChange = (e) => {
            handleSliderChange(attribute, 0, e.target.value);
            console.log(e.target.value)
        };

        const handleRightSliderChange = (e) => {
            handleSliderChange(attribute, 1, e.target.value);
        };

        return (
            <div className="category-level-module">
                <p className="category-level-name">{attribute}</p>
                <div className="wrapper">
                    <div className={`slider-container slider-container-${attribute.toLowerCase()}`}>
                        <div className={`slider-track slider-track-${attribute.toLowerCase()}`} style={trackStyle}></div>
                        <div className="slider-point-left">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={values[0]}
                                onChange={handleLeftSliderChange}
                                className="slider slider-left"
                                id={`slider-left-${attribute.toLowerCase()}`}
                            />
                            <div className={`slider-value-left ${attribute.toLowerCase()}-left-value`} style={{left: `${values[0]}%`, top: '-6px'}}>{values[0]}</div>
                        </div>
                        <div className="slider-point-right">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={values[1]}
                                onChange={handleRightSliderChange}
                                className="slider slider-right"
                                id={`slider-right-${attribute.toLowerCase()}`}
                            />
                            <div className={`slider-value-right ${attribute.toLowerCase()}-right-value`} style={{left: `${values[1]}%`, top: '-6px'}}>{values[1]}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function OperationBar({ sliderValues, handleSliderChange, searchTerm, searchFilter, noCharacterFoundAlert, filteredCharacters, handleCheckboxChange, isCharacterSelected, battleHistory }) {
        return (
            <div className="operation-bar">
                <div className="character-filter-bar">
                    <p className="filter-title">Filters</p>
                    <div className="filter-underline"></div>
                    {Object.keys(sliderValues).map(key => (
                        <Slider
                            key={key}
                            attribute={key}
                            values={sliderValues[key]}
                            handleSliderChange={handleSliderChange}
                        />
                    ))}
                </div>

                <div className="character-search-bar">
                    <div className="character-search-input">
                        <input
                            type="text"
                            className="character-search-input-text"
                            placeholder="Search characters..."
                            value={searchTerm}
                            onChange={searchFilter}
                        />
                        <p className="no-character-found-text" style={{ display: noCharacterFoundAlert ? 'block' : 'none' }}>
                            No characters found
                        </p>
                    </div>
                    <div className="character-search-result-table-container">
                        <table className="character-search-result-table">
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
                                <th>Selected</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredCharacters.map(character => (
                                <tr key={character.name}>
                                    <td className="first-column" onClick={() => handleRowClick(character.id)}>{character.name}</td>
                                    <td>{character.strength}</td>
                                    <td>{character.speed}</td>
                                    <td>{character.skill}</td>
                                    <td>{character.fear_factor}</td>
                                    <td>{character.power}</td>
                                    <td>{character.intelligence}</td>
                                    <td>{character.wealth}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={isCharacterSelected(character)}
                                            onChange={() => handleCheckboxChange(character, !isCharacterSelected(character))}
                                        />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <HistoryBar battleHistory={battleHistory} />
            </div>
        );
    }

    function CharacterImage({ imageName, className}) {
        const [imageSrc, setImageSrc] = useState(questionImg);
        useEffect(() => {
            if (imageName) {
                setImageSrc(imageName);
            }
            else {
                setImageSrc(questionImg)
            }
        }, [imageName]);

        return <img src={imageSrc} alt="Character" className={className} />;
    }

    function BattleField({ battleField }) {
        return (
            <div className="battlefield-bar">
                <div className="character-module character-module-left">
                    <p className="battle-character-name left-name">{battleField.left ? battleField.left.name : 'Unknown'}</p>
                    <div className="circle-character-avator-container">
                        <CharacterImage
                            imageName={battleField.left && battleField.left.image_url}
                            className="character-circle-image left-circle-image"
                        />
                    </div>
                </div>
                <div className="character-module character-module-right">
                    <p className="battle-character-name right-name">{battleField.right ? battleField.right.name : 'Unknown'}</p>
                    <div className="circle-character-avator-container">
                        <CharacterImage
                            imageName={battleField.right && battleField.right.image_url}
                            className="character-circle-image right-circle-image"
                        />
                    </div>
                </div>
            </div>
        );
    }

    function HistoryBar({ battleHistory }) {
        return (
            <div className="battle-history-bar">
                <p className="filter-title">Previous Comparisons</p>
                <div className="filter-underline"></div>
                {battleHistory.map((battle, index) => (
                    <div key={index} className="comparisons-history" onClick={() => handleHistoryItemClick(battle)}>
                        <p className="history-character-name-left">{battle.left.name}</p>
                        <p className="history-character-name-right">{battle.right.name}</p>
                    </div>
                ))}
            </div>
        );
    }

    const handleHistoryItemClick = (battle) => {
        setBattleField({
            left: battle.left,
            right: battle.right,
            isLeftOccupied: true,
            isRightOccupied: true
        });
        const battleResults = startBattle(battle.left, battle.right);
        setBattleResult(battleResults.result);
        setOverallWinner(battleResults.overallWinner);
    }

    function BattleResults({ battleResult }) {
        if (!battleResult){
            return null;
        }
        return (
            <div className="attributes-competition-bar">
                {Object.keys(battleResult).map((attribute) => (
                    <div key={attribute} className="battle-attributes-line ">
                        <div className={`battle-attribute-vs leftwin-${attribute} ${getLeftWinHighlightClass(overallWinner)}`}>
                            <img
                                className="win-click-img"
                                src={clickImg}
                                alt=""
                                style={{ display: battleResult[attribute] === 'left' ? 'block' : 'none' }}
                            />
                        </div>
                        <p className={`battle-attribute attribute-${attribute}`}>{attribute.toUpperCase()}</p>
                        <div className={`battle-attribute-vs rightwin-${attribute} ${getRightWinHighlightClass(overallWinner)}`}>
                            <img
                                className="win-click-img"
                                src={clickImg}
                                alt=""
                                style={{ display: battleResult[attribute] === 'right' ? 'block' : 'none' }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    const hasWinStatus = (result) => {
        return result;
    };

    const getLeftWinHighlightClass = (overall) => {
        if (!overall) return '';
        if (overall === 'left') {
            return 'win-highlighted';
        }
        else {
            return 'lose-highlighted'
        }
    };

    const getRightWinHighlightClass = (overall) => {
        if (!overall) return '';
        if (overall === 'right') {
            return 'win-highlighted';
        }
        else {
            return 'lose-highlighted'
        }
    };

    return (
        <>
            <HeadBar userRole={userRole}></HeadBar>
            <div className="cartoonopia-header">
                <div className="web-intro">
                    <h1 className="cartoonopia-title">Cartoonopia</h1>
                    <p className="cartoonopia-intro">
                        The home of characters and cartoons!
                    </p>
                </div>
            </div>

            <div className="background-image-blur-whitewash"></div>
            <div className="all-component-bar">
                <OperationBar
                    sliderValues={sliderValues}
                    handleSliderChange={handleSliderChange}
                    searchTerm={searchTerm}
                    searchFilter={searchFilter}
                    noCharacterFoundAlert={noCharacterFoundAlert}
                    filteredCharacters={filteredCharacters}
                    handleCheckboxChange={handleCheckboxChange}
                    isCharacterSelected={isCharacterSelected}
                    battleHistory={battleHistory}
                />
                <BattleField battleField={battleField} />
                {
                    hasWinStatus(battleResult) && (
                        <BattleResults battleResult={battleResult} />
                    )
                }
                <Footer></Footer>
            </div>
        </>
    );
}

export default Main;
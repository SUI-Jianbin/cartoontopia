import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Main from './pages/Main';
import AddCharacter from './pages/NewCharacter';
import ListCharacter from './pages/CharacterList';
import EditCharacter from './pages/EditCharacter';
import DeleteCharacter from './pages/DeleteCharacter';
import UserProfile from './pages/UserProfile';
import UserList from './pages/UserList';
import ApplicationList from './pages/ApplicationList';
import CheckUserProfileList from './pages/CheckUserProfileList';
import CharacterDetail from './pages/CharacterDetail';
import ChangeHistory from './pages/ChangeHistory';

// add routes here, the default route is naviagting to main page
function App() {
  return (
      <Router>
        <Routes>
        <Route path="/" element={<Navigate replace to="/main" />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/main" element={<Main/>} />
          <Route path="/add_character" element={<AddCharacter/>} />
          <Route path="/list_character" element={<ListCharacter/>} />
          <Route path="/edit_character/:id" element={<EditCharacter/>} />
          <Route path="/pages/userProfile" element={<UserProfile/>} />
          <Route path="/pages/userList" element={<UserList/>} />
          <Route path="/pages/applicationList" element={<ApplicationList/>} />
          <Route path="/pages/userProfileList" element={<CheckUserProfileList />} />
          <Route path="/deletecharacter" element={<DeleteCharacter />} />
          <Route path="/characterdetail/:id" element={<CharacterDetail />} />
          <Route path="/pages/changeHistory" element={<ChangeHistory/>} />
        </Routes>
      </Router>
  );
}

export default App;


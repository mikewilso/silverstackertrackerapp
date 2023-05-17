import './App.css';
// import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppContainer } from './components/AppContainer';

export const App = () => {
    return (
        <div className='App'>
            <Router>
                <AppContainer></AppContainer>
            </Router>
        </div>
    );
};

export default App;

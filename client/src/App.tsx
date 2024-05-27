// import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppContainer } from './components/AppContainer';

export const App = () => {
    return (
        <div className='App' data-testid="app-container">
            <Router>
                <AppContainer></AppContainer>
            </Router>
        </div>
    );
};

export default App;

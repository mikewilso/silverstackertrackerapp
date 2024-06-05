import React from 'react';
import { render } from '@testing-library/react';
import { HomePage } from '../views/HomePage';
import '@testing-library/jest-dom';

describe('AboutUs', () => {
    it('renders without crashing', async () => {
        render(<HomePage />);
    });

    it('displays the correct heading', async () => {
        const { getByText } = render(<HomePage />);
        const titleText = getByText("Michael's Home Page");
        expect(titleText).toBeInTheDocument();
    });
});
import React from 'react';
import { render } from '@testing-library/react';
import { AboutUs } from '../views/AboutUs';
import '@testing-library/jest-dom';

describe('AboutUs', () => {
    it('renders without crashing', async () => {
        render(<AboutUs />);
    });

    it('displays the correct heading', async () => {
        const { getByText } = render(<AboutUs />);
        const placeholderText = getByText('About us placeholder');
        expect(placeholderText).toBeInTheDocument();
    });
});
import React from 'react';
import { render } from '@testing-library/react';
import { ContactUs } from '../views/ContactUs';
import '@testing-library/jest-dom';

describe('ContactUs', () => {
    it('renders without crashing', async () => {
        render(<ContactUs />);
    });

    it('displays the correct heading', async () => {
        const { getByText } = render(<ContactUs  />);
        const placeholderText = getByText('Contact us placeholder');
        expect(placeholderText).toBeInTheDocument();
    });
});
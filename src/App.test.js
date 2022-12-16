import React, { StrictMode } from 'react';
import { screen, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import '@testing-library/jest-dom';

import App from './App';
import { store } from 'store';

test('renders learn react link', () => {
    window.scrollTo = jest.fn();

    render(
        <StrictMode>
            <ReduxProvider store={store}>
                <BrowserRouter basename="/">
                    <App />
                </BrowserRouter>
            </ReduxProvider>
        </StrictMode>
    );

    const linkElement = screen.getByText(/login/i);
    expect(linkElement).toBeInTheDocument();
});

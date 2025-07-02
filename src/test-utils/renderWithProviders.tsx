import React, { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import bookingReducer from '../redux/bookingSlice';

interface RenderOptions {
  preloadedState?: any;
  store?: any;
  route?: string;
}

const rootReducer = combineReducers({
  booking: bookingReducer,
});

export function renderWithProviders(
  ui: React.ReactElement,
  { preloadedState, store = configureStore({ reducer: rootReducer, preloadedState }), route = '/', ...renderOptions }: RenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          {children}
        </MemoryRouter>
      </Provider>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
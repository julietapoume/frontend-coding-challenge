import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

/*
I do not have any experience with this testing library,
also, I ran out of time, I would like to have more time
to investigate this, but the first thing that comes to my 
mind is add a new test to avoid adding duplicated elements.
Also, checking the add and remove button using mock data
*/
test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

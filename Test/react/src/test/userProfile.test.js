import { render } from '@testing-library/react';
import UserProfile from '../components/userProfile';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('<UserProfile />', () => {
  const mock = new MockAdapter(axios, { delayResponse: 200 });
  mock.onGet('https://jsonplaceholder.typicode.com/users/1').reply(200, {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
    address: {
      street: 'Kulas Light',
      suite: 'Apt. 556',
      city: 'Gwenborough',
      zipcode: '92998-3874',
      geo: {
        lat: '-37.3159',
        lng: '81.1496'
      }
    },
    phone: '1-770-736-8031 x56442',
    website: 'hildegard.org',
    company: {
      name: 'Romaguera-Crona',
      catchPhrase: 'Multi-layered client-server neural-net',
      bs: 'harness real-time e-markets'
    }
  });

  it('loads userData properly', async () => {
    // TODO
    const { findByText } = render(<UserProfile id={1} />)
    await findByText('Loading...');
    await findByText('Bret');
  });
});
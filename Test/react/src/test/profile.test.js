import Profile from '../components/profile';
import { render } from '@testing-library/react';

describe('<Profile />', () => {
  // it('matches snapshot', () => {
  //   const utils = render(<Profile username={'RTL'} name={'TEST'} />);
  //   expect(utils.container).toMatchSnapshot();
  // });

  it('shows the props correctly', () => {
    const utils = render(<Profile username={'RTL'} name={'TEST'} />);
    utils.getByText('RTL');
    utils.getByText('(TEST)');
    utils.getByText(/R/);
  });
});
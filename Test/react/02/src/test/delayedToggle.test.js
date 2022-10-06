import { render, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import DelayedToggle from '../components/delayedToggle';

describe('<DelayedToggle />', () => {
  const setup = () => {
    const utils = render(<DelayedToggle />);
    const button = utils.getByText('Toggle');
    return {
      ...utils,
      button,
    }
  };
  /**
   * ! default timeout: 1초를 넘김
   */
  it('reveals next when toggle is ON', async () => {
    const { button, findByText } = setup();
    fireEvent.click(button);
    await findByText('ON');
  });

  it('toggles text ON/OFF', async () => {
    const { button, findByText } = setup();
    fireEvent.click(button);
    await findByText('ON');

    fireEvent.click(button);
    await findByText('OFF');
  });

  it('removes text when toggle is OFF', async () => {
    const { button, getByText } = setup();
    fireEvent.click(button);
    await waitForElementToBeRemoved(() => getByText('OFF'));
  });
});

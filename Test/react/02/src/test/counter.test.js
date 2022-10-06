import { render, fireEvent } from '@testing-library/react';
import Counter from '../components/counter';

describe('<Counter />', () => {
  // it('matches snapshot', () => {
  //   const utils = render(<Counter />);
  //   expect(utils.container).toMatchSnapshot();
  // });

  it('has a number and two buttons', () => {
    const utils = render(<Counter />);
    utils.getByText('0');
    utils.getByText('+1');
    utils.getByText('-1');
  });

  it('increase', () => {
    const utils = render(<Counter />);
    const count = utils.getByText('0');
    const plusButton = utils.getByText('+1');

    fireEvent.click(plusButton);
    expect(count).toHaveTextContent('1');
    expect(count.textContent).toBe('1');
  });

  it('decrease', () => {
    const utils = render(<Counter />);
    const count = utils.getByText('0');
    const miunsButton = utils.getByText('-1');

    fireEvent.click(miunsButton);
    expect(count).toHaveTextContent('-1');
    expect(count.textContent).toBe('-1');
  });
});
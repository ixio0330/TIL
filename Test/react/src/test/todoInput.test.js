import { render, fireEvent } from '@testing-library/react';
import TodoInput from '../components/todo/todoInput';

describe('<TodoInput />', () => {
  const setup = (props = {}) => {
    const utils = render(<TodoInput {...props} />);
    const input = utils.getByPlaceholderText('할 일을 입력해주세요');
    const button = utils.getByText('등록');
    return {
      ...utils,
      input,
      button,
    }
  };

  it('has input and a button', () => {
    const { input, button } = setup();
    expect(input).toBeTruthy();
    expect(button).toBeTruthy();
  });

  it('changes input', () => {
    const { input } = setup();
    fireEvent.change(input, {
      target: {
        value: 'TDD',
      },
    });
    expect(input).toHaveAttribute('value', 'TDD');
  });

  it('calls onInsert and clears input', () => {
    const onInsert = jest.fn();
    const { input, button } = setup({ onInsert });
    fireEvent.change(input, {
      target: {
        value: 'TDD',
      },
    });
    fireEvent.click(button);
    expect(onInsert).toBeCalledWith('TDD');
    expect(input).toHaveAttribute('value', '');
  });
});
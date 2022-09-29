import { render, fireEvent } from '@testing-library/react';
import TodoItem from '../components/todo/todoItem';

const fakeDataTodo = {
  id: 1,
  text: 'TDD',
  done: false,
};

describe('<TodoItem />', () => {
  const setup = (props = {}) => {
    const initalProps = { todo: fakeDataTodo };
    const utils = render(<TodoItem {...initalProps} {...props} />);
    const todo = props.todo || initalProps.todo;
    const span = utils.getByText(todo.text);
    const button = utils.getByText('삭제');
    return {
      ...utils,
      span,
      button,
    };
  };
  
  it('has sapn and button', () => {
    const { span, button } = setup();
    expect(span).toBeTruthy();
    expect(button).toBeTruthy();
  });
  
  it('does not show line-through on span when done is false', () => {
    const { span } = setup({ todo: { ...fakeDataTodo }});
    expect(span).not.toHaveStyle('text-decoration: line-through');
  });
  
  it('shows line-through on span when done is true', () => {
    const { span } = setup({ todo: { ...fakeDataTodo, done: true }});
    expect(span).toHaveStyle('text-decoration: line-through');
  });
  
  it('calls onToggle', () => {
    const onToggle = jest.fn();
    const { span } = setup({ onToggle });
    fireEvent.click(span);
    expect(onToggle).toBeCalledWith(fakeDataTodo.id);
  });

  it('calls onRemove', () => {
    const onRemove = jest.fn();
    const { button } = setup({ onRemove });
    fireEvent.click(button);
    expect(onRemove).toBeCalledWith(fakeDataTodo.id);
  });
});
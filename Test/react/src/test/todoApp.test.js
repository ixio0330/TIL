import { render, fireEvent } from '@testing-library/react';
import TodoApp from '../components/todo/todoApp';

describe('<TodoApp />', () => {
  it('renders TodoInput and TodoList', () => {
    const { getByText, getByTestId } = render(<TodoApp />);
    getByText('등록'); // Target: TodoInput
    getByTestId('todoList') // Target: TodoList
  });
  
  it('renders two defaults todos', () => {
    const { getByText } = render(<TodoApp />);
    getByText('TDD');
    getByText('react-testing-library');
  });

  it('creates new todo', () => {
    const { getByText, getByPlaceholderText } = render(<TodoApp />);
    fireEvent.change(getByPlaceholderText('할 일을 입력해주세요'), {
      target: {
        value: 'New item',
      },
    });
    fireEvent.click(getByText('등록'));
    getByText('New item');
  });

  it('toggles todo', () => {
    const { getByText } = render(<TodoApp />);
    const todoText = getByText('TDD');
    expect(todoText).toHaveStyle('text-decoration: line-through');
    fireEvent.click(todoText);
    expect(todoText).not.toHaveStyle('text-decoration: line-through');
    fireEvent.click(todoText);
    expect(todoText).toHaveStyle('text-decoration: line-through');
  });

  it('removes todo', () => {
    const { getByText } = render(<TodoApp />);
    const todoText = getByText('TDD');
    const removeButton = todoText.nextSibling;
    fireEvent.click(removeButton);
    expect(todoText).not.toBeInTheDocument();
  });
});
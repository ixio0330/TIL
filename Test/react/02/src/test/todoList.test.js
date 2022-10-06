import { render, fireEvent } from '@testing-library/react';
import TodoList from '../components/todo/todoList';

const fakeDataTodos = [
  {
    id: 1,
    text: 'TDD',
    done: true
  },
  {
    id: 2,
    text: 'react-testing-library',
    done: false
  },
];

describe('<TodoList />', () => {
  it('renders todos properly', () => {
    const { getByText } = render(<TodoList todos={fakeDataTodos} />);
    getByText(fakeDataTodos[0].text);
    getByText(fakeDataTodos[1].text);
  });

  it('calls onToggle and onRemove', () => {
    const onToggle = jest.fn();
    const onRemove = jest.fn();
    const { getByText, getAllByText } = render(<TodoList todos={fakeDataTodos} onToggle={onToggle} onRemove={onRemove} />);
    fireEvent.click(getByText(fakeDataTodos[0].text));
    expect(onToggle).toBeCalledWith(fakeDataTodos[0].id);

    fireEvent.click(getAllByText('삭제')[0]);
    expect(onRemove).toBeCalledWith(fakeDataTodos[0].id);
  });
});
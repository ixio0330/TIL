import { atom, selector } from 'recoil';

export const todoListState = atom({
  key: 'todoListState',
  default: [],
});

export const todoListFilterTypeState = atom({
  key: 'todoListFilterType',
  default: 'all'
});

export const todoListFilterState = selector({
  key: 'todoListFilter',
  get({ get }) {
    const todos = get(todoListState);
    const type = get(todoListFilterTypeState);
    const filters = {
      all() {
        return todos;
      },
      completed() {
        return todos.filter((todo) => todo.done);
      },
      uncompleted() {
        return todos.filter((todo) => !todo.done);
      }
    }
    return filters[type]();
  }
})
import { render, screen } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import SummaryPage from '.';

describe.skip('<SummaryPage />', () => {
  it('checkbox and button init settings', () => {
    render(<SummaryPage />);
    const checkbox = screen.getByRole('checkbox', {
      name: '주문하려는 것을 확인하셨나요?'
    });
    expect(checkbox.checked).toBeFalsy();
    const confirmBtn = screen.getByRole('button', { name: '주문 확인' });
    expect(confirmBtn.disabled).toBeTruthy();
  });

  it('button to be abled when checkbox is clicked', () => {
    render(<SummaryPage />);
    const checkbox = screen.getByRole('checkbox', {
      name: '주문하려는 것을 확인하셨나요?'
    });
    const confirmBtn = screen.getByRole('button', { name: '주문 확인' });
    userEvent.type(checkbox, true);
    expect(confirmBtn.disabled).toBeFalsy();
  });
});
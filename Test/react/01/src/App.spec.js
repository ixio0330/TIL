import { render, screen } from './test-utils';
import App from './App';
import userEvent from '@testing-library/user-event';

describe('Page Step', () => {
  it('From order to order completion', async () => {
    render(<App />);
    const americaInput = await screen.findByRole('spinbutton', {
      name: 'America',
    });
    await userEvent.clear(americaInput);
    await userEvent.type(americaInput, '2');

    const englandInput = await screen.findByRole('spinbutton', {
      name: 'England',
    });
    await userEvent.clear(englandInput);
    await userEvent.type(englandInput, '3');

    const dinnerCbox = await screen.findByRole('checkbox', {
      name: 'Dinner'
    });
    await userEvent.click(dinnerCbox);

    const orderButton = screen.getByRole('button', {
      name: '주문'
    });
    await userEvent.click(orderButton);

    // 주문 확인 페이지
    const summaryHeading = screen.getByRole('heading', {
      name: '주문 확인서'
    })
    expect(summaryHeading).toBeInTheDocument();

    const productsHeading = screen.getByRole('heading', {
      name: '상품: 5000',
    });
    expect(productsHeading).toBeInTheDocument();

    const optionsHeading = screen.getByRole('heading', {
      name: '옵션: 500',
    });
    expect(optionsHeading).toBeInTheDocument();

    expect(screen.getByText('2 America')).toBeInTheDocument();
    expect(screen.getByText('3 England')).toBeInTheDocument();
    expect(screen.getByText('Dinner')).toBeInTheDocument();

    const confirmCbox = screen.getByRole('checkbox', {
      name: '주문하려는 것을 확인하셨나요?'
    });
    await userEvent.click(confirmCbox);
    
    const confrimOrderButton = screen.getByRole('button', {
      name: '주문 확인'
    });
    await userEvent.click(confrimOrderButton);

    // 주문 완료 페이지
    const loading = screen.getByText(/loading/i);
    expect(loading).toBeInTheDocument();

    const completionHeading = await screen.findByRole('heading', {
      name: '주문을 완료했습니다.',
    });
    expect(completionHeading).toBeInTheDocument();
    
    const loadingDisappeared = screen.queryByText(/loading/i);
    expect(loadingDisappeared).not.toBeInTheDocument();

    const firstPageButton = screen.getByRole('button', {
      name: '첫 페이지로'
    });
    await userEvent.click(firstPageButton);

    const productsTotal = screen.getByText('Products Total Price: 0');
    expect(productsTotal).toBeInTheDocument();

    const optionsTotal = screen.getByText('Options Total Price: 0');
    expect(optionsTotal).toBeInTheDocument();
  });
});
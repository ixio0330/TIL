import { render, screen } from "../../test-utils";
import userEvent from '@testing-library/user-event';
import Type from "./type";
import OrderPage from "../../pages/order";

describe.skip('price updaing when products and options change', () => {
  it('update product total when products change', async () => {
    render(<Type orderType='products' />);
    const productsTotal = screen.getByText('Total Price: ', { exact: false });
    expect(productsTotal).toHaveTextContent(0);

    const americaInput = await screen.findByRole('spinbutton', {
      name: 'America',
    });

    /**
     * Promise를 반환해서 await으로 비동기 처리를 해야 올바른 값으로 테스트가 가능하다.
     */
    await userEvent.clear(americaInput);
    await userEvent.type(americaInput, '1');
    expect(productsTotal).toHaveTextContent(1000);
  });

  it('update options total when options change', async () => {
    render(<Type orderType='options' />);
    const otpionsTotal = screen.getByText('Total Price: ', { exact: false });
    expect(otpionsTotal).toHaveTextContent(0);

    const dinnerCbox = await screen.findByRole('checkbox', {
      name: 'Dinner',
    });

    await userEvent.click(dinnerCbox);
    expect(otpionsTotal).toHaveTextContent(500);
    
    await userEvent.click(dinnerCbox);
    expect(otpionsTotal).toHaveTextContent(0);
  });
});

describe.skip('total price of goods and options', () => {
  it('total price starts with 0 and updating total price when adding one product', async () => {
    render(<OrderPage />);

    const total = screen.getByText('All Total Price: ', { exact: false });
    expect(total).toHaveTextContent(0);

    const americaInput = await screen.findByRole('spinbutton', {
      name: 'America'
    });
    await userEvent.clear(americaInput);
    await userEvent.type(americaInput, '1');

    expect(total).toHaveTextContent(1000);
  });

  it('updating total price when adding one option', async () => {
    render(<OrderPage />);
    const total = screen.getByText('All Total Price: ', { exact: false });
    const dinnerCbox = await screen.findByRole('checkbox', {
      name: 'Dinner',
    });

    await userEvent.click(dinnerCbox);
    
    expect(total).toHaveTextContent(500);
  });

  it('updating total price when removing option and product', async () => {
    render(<OrderPage />);
    const total = screen.getByText('All Total Price: ', { exact: false });
    const dinnerCbox = await screen.findByRole('checkbox', {
      name: 'Dinner',
    });
    await userEvent.click(dinnerCbox);

    const americaInput = await screen.findByRole('spinbutton', {
      name: 'America'
    });
    await userEvent.clear(americaInput);
    await userEvent.type(americaInput, '3');
    expect(total).toHaveTextContent(3500);

    await userEvent.clear(americaInput);
    await userEvent.type(americaInput, '1');

    expect(total).toHaveTextContent(1500);
  });
});
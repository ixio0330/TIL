import { render, screen } from "../../test-utils";
import Type from "./type";
import server from '../../mocks/server';
import { rest } from "msw";

describe.skip('<Type />', () => {
  it('display product images from server', async () => {
    render(<Type orderType='products' />);

    const productImages = await screen.findAllByRole('img', {
      name: /product$/i,
    });
    expect(productImages).toHaveLength(4);

    const altTextList = productImages.map((imgEl) => imgEl.alt);
    expect(altTextList).toEqual(['America product', 'England product', 'Japan product', 'Jeju product']);
  });

  it('face an error when fetching product datas', async () => {
    server.resetHandlers(
      rest.get('http://localhost:5000/products', (req, res, ctx) => res(ctx.status(500)))
    );

    render(<Type orderType='products' />);

    const errorBanner = await screen.findByTestId('error-banner');
    expect(errorBanner).toHaveTextContent('에러가 발생했습니다.');
  });

  it('fetch option information from server', async () => {
    render(<Type orderType='options' />);

    const optionCboxes = await screen.findAllByRole('checkbox');
    expect(optionCboxes).toHaveLength(2);
  });
});
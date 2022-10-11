import { rest } from 'msw';

export const handlers = [
  rest.get('http://localhost:5000/products', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          'name': 'America',
          'price': 1500,
          'imgPath': 'images/america.jpg'
        },
        {
          'name': 'England',
          'price': 1000,
          'imgPath': 'images/england.jpg'
        },
        {
          'name': 'Japan',
          'price': 500,
          'imgPath': 'images/japan.jpg'
        },
        {
          'name': 'Jeju',
          'price': 100,
          'imgPath': 'images/jeju.jpg'
        },
      ])
    );
  }),
  rest.get('http://localhost:5000/options', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          'name': 'Insurance',
          'price': 300
        },
        {
          'name': 'Dinner',
          'price': 50
        }
      ])
    );
  }),
  rest.post('http://localhost:5000/order', (req, res, ctx) => {
  return res(
      ctx.json([
        {
          'orderNumber': 12345678,
          'price': 4500
        }
      ])
    )
  })
]
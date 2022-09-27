const productController = require('../../src/module/products/product.controller');
const productService = require('../../src/module/products/product.service');
const httpMocks = require('node-mocks-http');
const newProduct = require('../data/new-product.json');
const allProducts = require('../data/all-products.json');

productService.create = jest.fn();
productService.find = jest.fn();
productService.findById = jest.fn();
productService.findByIdAndUpdate = jest.fn();
productService.findByIdAndDelete = jest.fn();

const productId = 'd6f960e0-3e1b-11ed-8c76-3dd58ce3bdc3';
const updatedProduct = {
  name: 'Gloves update',
  description: 'good to wear update',
  price: 15,
};

let req;
let res;
let next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('Product Controller Create', () => {
  beforeEach(() => {
    req.body = newProduct;
  });

  it('should have a createProducts function', () => {
    expect(typeof productController.createProduct).toBe('function');
  });

  it('should call productService.create', async () => {
    await productController.createProduct(req, res, next);
    expect(productService.create).toBeCalledWith(newProduct);
  });

  it('should return 201 response code', async () => {
    await productController.createProduct(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should retur json body in response', async () => {
    productService.create.mockReturnValue(newProduct);
    await productController.createProduct(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newProduct);
  });

  it('should handle error', async () => {
    const errorMessage = { message: 'description property missing' };
    const rejectedPromise = Promise.reject(errorMessage);
    productService.create.mockReturnValue(rejectedPromise);
    await productController.createProduct(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe('Product Controller Get', () => {
  it('should have a getProducts function', () => {
    expect(typeof productController.getProducts).toBe('function');
  });

  it('should call ProductService.find()', async () => {
    await productController.getProducts(req, res, next);
    expect(productService.find);
  });

  it('should return 200 response', async () => {
    await productController.getProducts(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
  });

  it('should return json body in response', async () => {
    productService.find.mockReturnValue(allProducts);
    await productController.getProducts(req, res, next);
    expect(res._getJSONData()).toStrictEqual(allProducts);
  });

  it('should handle errors', async () => {
    const errorMessage = { message: 'Error finding product data' };
    const rejectedPromise = Promise.reject(errorMessage);
    productService.find.mockReturnValue(rejectedPromise);
    await productController.getProducts(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe('Product Controller GetById', () => {
  it('should have a getProductById', () => {
    expect(typeof productController.getProductById).toBe('function');
  });

  it('should call ProductService.findById', async () => {
    req.params.id = productId;
    await productController.getProductById(req, res, next);
    expect(productService.findById).toBeCalledWith(productId);
  });

  it('should return json body and response code 200', async () => {
    productService.findById.mockReturnValue(newProduct);
    req.params.id = productId;
    await productController.getProductById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newProduct);
    expect(res._isEndCalled).toBeTruthy();
  });

  describe('should handle errors', () => {
    it('should throw error when productId is not exist', async () => {
      const errorMessage = { message: 'productId is required' };
      const rejectedPromise = Promise.reject(errorMessage);
      productService.findById.mockReturnValue(rejectedPromise);
      await productController.getProductById(req, res, next);
      expect(next).toHaveBeenCalledWith(errorMessage);
    });

    it('should throw error when product is not exist', async () => {
      const errorMessage = { message: 'not found product' };
      const rejectedPromise = Promise.reject(errorMessage);
      productService.findById.mockReturnValue(rejectedPromise);
      req.params.id = 'test';
      await productController.getProductById(req, res, next);
      expect(next).toHaveBeenCalledWith(errorMessage);
    });
  })
});

describe('Product Controller Update', () => {
  it('should have an updateProduct function', () => {
    expect(typeof productController.updateProduct).toBe('function');
  });

  it('should call productService.findByIdAndUpdate', async () => {
    req.params.id = productId;
    req.body = {...updatedProduct};
    await productController.updateProduct(req, res, next);
    expect(productService.findByIdAndUpdate).toHaveBeenCalledWith(
      productId,
      {...updatedProduct}
    );
  });

  it('should return json body and response code 200', async () => {
    req.params.id = productId;
    req.body = {...updatedProduct};
    productService.findByIdAndUpdate.mockReturnValue({...updatedProduct});
    await productController.updateProduct(req, res, next);
    expect(res._isEndCalled).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual({...updatedProduct});
  });

  describe('should handle errors', () => {
    it('should throw error when productId is not exist', async () => {
      const errorMessage = { message: 'productId is required' };
      const rejectedPromise = Promise.reject(errorMessage);
      productService.findByIdAndUpdate.mockReturnValue(rejectedPromise);
      await productController.updateProduct(req, res, next);
      expect(next).toHaveBeenCalledWith(errorMessage);
    });

    it('should throw error when product is not exist', async () => {
      const errorMessage = { message: 'not found product' };
      const rejectedPromise = Promise.reject(errorMessage);
      productService.findByIdAndUpdate.mockReturnValue(rejectedPromise);
      req.params.id = 'test';
      await productController.updateProduct(req, res, next);
      expect(next).toHaveBeenCalledWith(errorMessage);
    });
  })
});

describe('Product Controller Delete function', () => {
  it('should have a deleteProduct function', () => {
    expect(typeof productController.deleteProduct).toBe('function');
  });

  it('should call ProductService.findByIdAndDelete', async () => {
    req.params.id = productId;
    await productController.deleteProduct(req, res, next);
    expect(productService.findByIdAndDelete).toBeCalledWith(productId);
  });

  it('should return 200 response', async ()=>{
    let deletedProduct = {
      name: 'deleted name',
      description: 'it is deleted',
    };
    productService.findByIdAndDelete.mockReturnValue(deletedProduct);
    await productController.deleteProduct(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(deletedProduct);
    expect(res._isEndCalled()).toBeTruthy();
  });

  describe('should handle errors', () => {
    it('should throw error when productId is not exist', async () => {
      const errorMessage = { message: 'productId is required' };
      const rejectedPromise = Promise.reject(errorMessage);
      productService.findByIdAndDelete.mockReturnValue(rejectedPromise);
      await productController.deleteProduct(req, res, next);
      expect(next).toHaveBeenCalledWith(errorMessage);
    });

    it('should throw error when product is not exist', async () => {
      const errorMessage = { message: 'not found product' };
      const rejectedPromise = Promise.reject(errorMessage);
      productService.findByIdAndDelete.mockReturnValue(rejectedPromise);
      req.params.id = 'test';
      await productController.deleteProduct(req, res, next);
      expect(next).toHaveBeenCalledWith(errorMessage);
    });
  });
});
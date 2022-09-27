const productService = require('./product.service');

exports.createProduct = async (req, res, next) => {
  try {
    const createdProduct = await productService.create(req.body);
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
}

exports.getProducts = async (req, res, next) => {
  try {
    const allProducts = await productService.find(); 
    res.status(200).json(allProducts);
  } catch (error) {
    next(error);
  }
}

exports.getProductById = async (req, res, next) => {
  try {
    const product = await productService.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
}

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await productService.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
}

exports.deleteProduct = async (req, res, next) => {
  try {
    const deletedProduct = await productService.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedProduct);
  } catch (error) {
    next(error);
  }
}
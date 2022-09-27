const database = require('../../db');
const BadRequest = require('../../error/badRequest');
const NotFound = require('../../error/notfound');
const uuid = require('uuid');

exports.create = async (body) => {
  const { name, description, price } = body;
  if (!name) {
    throw new BadRequest('name property missing');
  }
  if (!description) {
    throw new BadRequest('description property missing');
  }
  await database.query(`insert into products (id, name, description, price) values ('${uuid.v1()}', '${name}', '${description}', ${price ?? null})`);
  return body;
};

exports.find = async () => {
  const { rows } = await database.query(`select * from products`);
  return rows;
};

exports.findById = async (id) => {
  if (!id) {
    throw new BadRequest('productId is required');
  }
  const { rows } = await database.query(`select * from products where id='${id}'`);
  if (!rows[0]) {
    throw new NotFound('not found product');
  }
  return rows[0];
}

exports.findByIdAndUpdate = async (id, updateProduct) => {
  await this.findById(id);
  const { name, description, price }  = updateProduct;
  if (!name) {
    throw new BadRequest('name property missing');
  }
  if (!description) {
    throw new BadRequest('description property missing');
  }
  await database.query(`update products set name='${name}', description='${description}', price=${price ?? null} where id='${id}'`);
  return updateProduct;
};

exports.findByIdAndDelete = async (id) => {
  const deletedProduct = await this.findById(id);
  await database.query(`delete from products where id='${id}'`);
  return deletedProduct;
};
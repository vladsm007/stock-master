const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500).allow('', null),
  sku: Joi.string().alphanum().min(3).max(20).required(),
  barcode: Joi.string().max(50).allow('', null),
  price: Joi.number().positive().required(),
  cost: Joi.number().positive().allow(null),
  minStock: Joi.number().min(0).default(0),
  maxStock: Joi.number().min(0).allow(null),
  unit: Joi.string().max(10).default('UN'),
  categoryId: Joi.string().uuid().required(),
  supplierId: Joi.string().uuid().allow(null)
});

const productUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  description: Joi.string().max(500).allow('', null),
  sku: Joi.string().alphanum().min(3).max(20),
  barcode: Joi.string().max(50).allow('', null),
  price: Joi.number().positive(),
  cost: Joi.number().positive().allow(null),
  minStock: Joi.number().min(0),
  maxStock: Joi.number().min(0).allow(null),
  unit: Joi.string().max(10),
  categoryId: Joi.string().uuid(),
  supplierId: Joi.string().uuid().allow(null)
});

const stockMovementSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
  type: Joi.string().valid('IN', 'OUT', 'ADJUSTMENT', 'TRANSFER', 'LOSS', 'RETURN').required(),
  reason: Joi.string().max(200).allow('', null),
  reference: Joi.string().max(50).allow('', null),
  unitCost: Joi.number().positive().allow(null)
});

const categorySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500).allow('', null)
});

const validateProduct = (data) => {
  return productSchema.validate(data);
};

const validateProductUpdate = (data) => {
  return productUpdateSchema.validate(data);
};

const validateStockMovement = (data) => {
  return stockMovementSchema.validate(data);
};

const validateCategory = (data) => {
  return categorySchema.validate(data);
};

module.exports = {
  validateProduct,
  validateProductUpdate,
  validateStockMovement,
  validateCategory
};
const express = require('express');
const CategoryController = require('../controllers/CategoryController');
const router = express.Router();

// Rota de teste
router.get('/test', (req, res) => {
  res.json({ message: 'Rota de categorias funcionando!' });
});

router.post('/', CategoryController.create.bind(CategoryController));
router.get('/', CategoryController.getAll.bind(CategoryController));
router.get('/:id', CategoryController.getById.bind(CategoryController));
router.put('/:id', CategoryController.update.bind(CategoryController));
router.delete('/a:id', CategoryController.delete.bind(CategoryController));

module.exports = router;
const errorHandler = (err, req, res, next) => {
  console.error('Erro capturado:', err);

  // Erro de validação do Prisma
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      error: 'Dados duplicados - recurso já existe',
      details: err.meta
    });
  }

  // Erro de registro não encontrado do Prisma
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      error: 'Recurso não encontrado'
    });
  }

  // Erro de validação do Joi
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      error: 'Dados inválidos',
      details: err.details[0].message
    });
  }

  // Erro personalizado com message
  if (err.message) {
    const statusCode = err.statusCode || 400;
    return res.status(statusCode).json({
      success: false,
      error: err.message
    });
  }

  // Erro genérico
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
export const requireSuperAdmin = async (req, res, next) => {
  const { role } = req.user;

  console.log(role);

  if (role !== 'overlord') {
    return res.status(403).json({
      success: false,
      error: 'Acesso restrito a super administradores',
    });
  }

  next();
};

export const requireOrgAdmin = async (req, res, next) => {
  const { role } = req.user;

  if (role !== 'admin' && role !== 'overlord') {
    return res.status(403).json({
      success: false,
      error: 'Acesso restrito a administradores de organização',
    });
  }

  next();
};

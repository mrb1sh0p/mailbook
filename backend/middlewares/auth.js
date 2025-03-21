export const requireSuperAdmin = async () => {
  const { role } = req.user;

  if (role !== 'overload') {
    return res.status(403).json({
      success: false,
      error: 'Acesso restrito a super administradores',
    });
  }

  next();
};

export const requireOrgAdmin = async () => {
  const { role } = req.user;

  if (role === 'overload') {
    next();
  } else if (role !== 'user') {
    return res.status(403).json({
      success: false,
      error: 'Acesso restrito a membros de organização',
    });
  }

  next();
};

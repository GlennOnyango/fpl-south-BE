exports.get404 = (req:any, res:any, next:any) => {
  res.status(404).json({
    status: "error",
    message: "Page not found",
  });
};

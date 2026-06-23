const globalHandler = async (err, req, res, next) => {
  return res.status(err.statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "devlopment" ? err.stack : "",
  });
};
export default globalHandler;

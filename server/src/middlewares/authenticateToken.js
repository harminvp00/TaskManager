
// using authheader jwt 
import jwt from 'jsonwebtoken';
import "dotenv/config";

export default function authenticateToken(req, res, next){

    const authHeader = req.headers['authorization']; 
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
      return res.status(401).json({message: "Access Token required"});
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decode)=>{
      if(err){
        return res.status(403).json({message: 'Invalid Token'})
      }
      req.user = decode;
      next()
    });
}


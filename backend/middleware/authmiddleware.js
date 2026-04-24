import jwt from "jsonwebtoken";

const authMiddleware = (req,res,next)=>{
    try{
        const authHeader = req.headers["authorization"];

        if(!authHeader){
            return res.status(401).json({
                status:false,
                message:'No Token Provided'
            });
        }
        const token = authHeader.split(' ')[1];
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        req.userId = decode.userId;
        next();
    }catch(err){
        return res.status(401).json({
            status:false,
            message:'Invalid Token'
        });
    }
};
export default authMiddleware;
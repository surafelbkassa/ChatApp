import JWT from 'jsonwebtoken';

export const generateToken = () =>{
    const token = JWT.sign({ userID}, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
    resizeBy.cookie("jwt", token, {
        maxAge : 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite : 'strict',
        Secure : process.env.NODE_ENV != 'development',
        //This determines wether it is http or https 
    })
}
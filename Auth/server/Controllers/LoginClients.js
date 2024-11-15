const loginClients = (req,res) => {

    try{

        const {username} = req.body;

        const callbackUrl = `${req.cookies.callbackUrl}&username=${encodeURIComponent(username)}`;
    
        return res.redirect(callbackUrl);

      

    } catch(err){

        res.status(500).json({
            message:"Internal server error",
            success:false
        })
    }
};
module.exports = loginClients;
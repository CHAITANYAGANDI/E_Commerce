const loginClients = (req,res) => {

    try{

        const {username} = req.body;

        const callbackUrl = `${req.cookies.callbackUrl}&username=${encodeURIComponent(username)}&client_id=${encodeURIComponent(req.cookies.client_id)}`;
    
        return res.redirect(callbackUrl);

      

    } catch(err){

        res.status(500).json({
            message:"Internal server error",
            success:false
        })
    }
};
module.exports = loginClients;
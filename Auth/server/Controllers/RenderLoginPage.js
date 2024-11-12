const renderLoginPage = (req,res)=>{

    res.cookie('callbackUrl', req.query.callbackUrl, { httpOnly: true });

    res.render('login');
}

module.exports = renderLoginPage;
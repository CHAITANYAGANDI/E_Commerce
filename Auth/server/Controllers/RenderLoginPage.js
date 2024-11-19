const renderLoginPage = (req,res)=>{

    res.cookie('callbackUrl', req.query.callbackUrl, { httpOnly: true });
    res.cookie('client_id', req.query.client_id, { httpOnly: true });

    res.render('login');
}

module.exports = renderLoginPage;
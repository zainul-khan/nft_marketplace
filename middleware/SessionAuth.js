const SessionAuth = (req, res, next) => {
    if(req.session.user == undefined){
        return res.redirect("/");
    }
    else{
        next();
    }
}

module.exports = SessionAuth;
const auth = (req, res, next) => {

    if (req.session && req.session.userId) {
        req.user = { userId: req.session.userId };
        
        return next(); 
    }

    return res.status(401).json({ message: "Brak autoryzacji (zaloguj się)" });
}

export default auth;
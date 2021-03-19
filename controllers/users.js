const User = require('../models/user');
const { cloudinary } = require("../cloudinary");

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password, role} = req.body;
        const user = new User({ email, username, role });
        if(req.file){
             user.photo = { url: req.file.path, filename: req.file.filename }
        }
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.profile = (req, res) => {
    res.render('users/profile')
}

module.exports.renderEditProfile = (req, res) => {
    res.render('users/edit');
}

module.exports.updateProfile = async (req, res) => {

    const user = await User.findById(req.params.id)
    if(req.file){
        //deleting image from cloudinary
        await cloudinary.uploader.destroy(user.photo.filename);
        user.photo = {url: req.file.path, filename: req.file.filename}
    }
    user.save();
    res.redirect(`/user/${user.id}`);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/campgrounds');
}
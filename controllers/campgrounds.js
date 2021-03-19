const Campground = require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");
const User = require('../models/user')


module.exports.index = async (req, res) => {
    const searchTerm = req.query.searchTerm;
    let noMatch = '';
    if(req.query.searchTerm){
        const campgrounds = await Campground.find({title: {$regex: searchTerm, $options: '$i'}});
        if(campgrounds.length > 0){
            res.render('campgrounds/index', { campgrounds, noMatch })
        } else {
            noMatch = `No campground found for ${searchTerm}, please try again `
            res.render('campgrounds/index', { campgrounds, noMatch})
        }
        
    } else {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds, noMatch })
    }
    
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    const user = await User.findById(req.user._id)
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    user.userPlaces.push(campground.id);
    await campground.save();
    await user.save();

    
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    console.log(req.user);

   
    
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndUpdate(req.user._id, {$pull:{ userPlaces: id}});
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
}

module.exports.addFavorite = async (req, res) => {
    const user = await User.findById(req.user._id)
    const campground = await Campground.findById(req.params.id);
    user.userPlaces.push(campground.id)
    await user.save();
    req.flash('success', 'Campground added to favorite');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.getFavorites = async(req, res) => {
    const user = await User.findById(req.user._id).populate({
        path: 'userPlaces'
    });
    res.render('campgrounds/favorites', {user});
}

module.exports.removeFavorite = async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {$pull:{ userPlaces: req.params.id}});
    if(req.params.id){
        const id = req.params.id
        req.flash('success', 'Removed from favorites');
        return res.redirect(`/campgrounds/${id}`)
    }else{
        req.flash('success', 'Removed from favorites');
        res.redirect(`/campgrounds/favorites`);
    }
    
    
}
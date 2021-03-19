const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const Review = require('../models/review')


const DB_URL = 'mongodb://localhost:27017/yelp-camp'

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    await Review.deleteMany({})

    for (let i = 0; i < 10; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            //YOUR USER ID
            author: '6054e8e25758490a443046cf',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/emanueltejada/image/upload/v1610671000/YelpCamp/dalxzaf1se3lzydlohv4.jpg',
                    filename: 'YelpCamp/dalxzaf1se3lzydlohv4.jpg'
                    
                },
                {
                    url: 'https://res.cloudinary.com/emanueltejada/image/upload/v1610671000/YelpCamp/rq2slzo4zl1kyboumfid.jpg',
                    filename: 'YelpCamp/rq2slzo4zl1kyboumfid.jpg'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
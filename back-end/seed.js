require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Listing = require('./models/Listing');

const SEED_EMAIL = 'seed-landlord@unihousing.com';

const seedListings = (landlordId) => [
    // UCI
    {
        title: 'Irvine Gateway Studios',
        address: '100 Theory, Irvine CA 92612',
        university: 'UCI',
        price: 1100,
        bathrooms: 1,
        bedrooms: 1,
        housingType: 'studio',
        distanceToCampus: 0.4,
        amenities: ['WiFi', 'Laundry', 'Air Conditioning'],
        imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop',
        landlord: landlordId,
        isAvailable: true,
        latitude: 33.6441,
        longitude: -117.8419,
    },
    {
        title: 'Campus View Apartments',
        address: '150 W Peltason Dr, Irvine CA 92697',
        university: 'UCI',
        price: 1450,
        bathrooms: 1,
        bedrooms: 2,
        housingType: 'apartment',
        distanceToCampus: 0.6,
        amenities: ['WiFi', 'Parking', 'Pool', 'Gym'],
        imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
        landlord: landlordId,
        isAvailable: true,
        latitude: 33.6474,
        longitude: -117.8397,
    },
    {
        title: 'Anteater Suites',
        address: '5300 Aldrich Rd, Irvine CA 92617',
        university: 'UCI',
        price: 1800,
        bathrooms: 2,
        bedrooms: 3,
        housingType: 'apartment',
        distanceToCampus: 0.9,
        amenities: ['WiFi', 'Parking', 'Laundry', 'Dishwasher'],
        imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop',
        landlord: landlordId,
        isAvailable: true,
        latitude: 33.6362,
        longitude: -117.8511,
    },
    // UCLA
    {
        title: 'Westwood Village Studio',
        address: '1060 Gayley Ave, Los Angeles CA 90024',
        university: 'UCLA',
        price: 1300,
        bathrooms: 1,
        bedrooms: 1,
        housingType: 'studio',
        distanceToCampus: 0.3,
        amenities: ['WiFi', 'Laundry', 'Air Conditioning'],
        imageUrl: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&auto=format&fit=crop',
        landlord: landlordId,
        isAvailable: true,
        latitude: 34.0622,
        longitude: -118.4477,
    },
    {
        title: 'Bruins Court',
        address: '547 Veteran Ave, Los Angeles CA 90024',
        university: 'UCLA',
        price: 1650,
        bathrooms: 1,
        bedrooms: 2,
        housingType: 'apartment',
        distanceToCampus: 0.7,
        amenities: ['WiFi', 'Parking', 'Gym', 'Laundry'],
        imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
        landlord: landlordId,
        isAvailable: true,
        latitude: 34.0595,
        longitude: -118.4423,
    },
    {
        title: 'Hilgard Flats',
        address: '601 Hilgard Ave, Los Angeles CA 90024',
        university: 'UCLA',
        price: 2200,
        bathrooms: 2,
        bedrooms: 3,
        housingType: 'house',
        distanceToCampus: 0.5,
        amenities: ['WiFi', 'Parking', 'Backyard', 'Dishwasher'],
        imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop',
        landlord: landlordId,
        isAvailable: true,
        latitude: 34.0672,
        longitude: -118.4391,
    },
    // UC Berkeley
    {
        title: 'Telegraph Studios',
        address: '2511 Telegraph Ave, Berkeley CA 94704',
        university: 'UCB',
        price: 1500,
        bathrooms: 1,
        bedrooms: 1,
        housingType: 'studio',
        distanceToCampus: 0.5,
        amenities: ['WiFi', 'Laundry', 'Bike Storage'],
        imageUrl: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&auto=format&fit=crop',
        landlord: landlordId,
        isAvailable: true,
        latitude: 37.8637,
        longitude: -122.2592,
    },
    {
        title: 'Northside Apartments',
        address: '1730 Euclid Ave, Berkeley CA 94709',
        university: 'UCB',
        price: 1900,
        bathrooms: 1,
        bedrooms: 2,
        housingType: 'apartment',
        distanceToCampus: 0.4,
        amenities: ['WiFi', 'Parking', 'Laundry', 'Gym'],
        imageUrl: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&auto=format&fit=crop',
        landlord: landlordId,
        isAvailable: true,
        latitude: 37.8774,
        longitude: -122.2549,
    },
    {
        title: 'Durant House',
        address: '2608 Durant Ave, Berkeley CA 94704',
        university: 'UCB',
        price: 2400,
        bathrooms: 2,
        bedrooms: 3,
        housingType: 'house',
        distanceToCampus: 0.3,
        amenities: ['WiFi', 'Parking', 'Backyard', 'Washer/Dryer'],
        imageUrl: 'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=800&auto=format&fit=crop',
        landlord: landlordId,
        isAvailable: true,
        latitude: 37.8668,
        longitude: -122.2585,
    },
    // UCSD
    {
        title: 'La Jolla Cove Apartments',
        address: '9246 Regents Rd, San Diego CA 92037',
        university: 'UCSD',
        price: 1400,
        bathrooms: 1,
        bedrooms: 2,
        housingType: 'apartment',
        distanceToCampus: 0.6,
        amenities: ['WiFi', 'Pool', 'Parking', 'Gym'],
        imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop',
        landlord: landlordId,
        isAvailable: true,
        latitude: 32.8732,
        longitude: -117.2264,
    },
    {
        title: 'Torrey Pines Studio',
        address: '3265 Holiday Ct, La Jolla CA 92037',
        university: 'UCSD',
        price: 1150,
        bathrooms: 1,
        bedrooms: 1,
        housingType: 'studio',
        distanceToCampus: 0.8,
        amenities: ['WiFi', 'Laundry', 'Air Conditioning'],
        imageUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop',
        landlord: landlordId,
        isAvailable: true,
        latitude: 32.8869,
        longitude: -117.2414,
    },
    {
        title: 'Geisel House',
        address: '9500 Gilman Dr, La Jolla CA 92093',
        university: 'UCSD',
        price: 2000,
        bathrooms: 2,
        bedrooms: 3,
        housingType: 'house',
        distanceToCampus: 0.3,
        amenities: ['WiFi', 'Parking', 'Backyard', 'Washer/Dryer'],
        imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop',
        landlord: landlordId,
        isAvailable: true,
        latitude: 32.8801,
        longitude: -117.2376,
    },
    // UCSB
    {
        title: 'Isla Vista Studio',
        address: '6503 Trigo Rd, Goleta CA 93117',
        university: 'UCSB',
        price: 950,
        bathrooms: 1,
        bedrooms: 1,
        housingType: 'studio',
        distanceToCampus: 0.4,
        amenities: ['WiFi', 'Laundry', 'Bike Storage'],
        imageUrl: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&auto=format&fit=crop',
        landlord: landlordId,
        isAvailable: true,
        latitude: 34.4125,
        longitude: -119.8616,
    },
    {
        title: 'Del Playa Apartments',
        address: '6640 Del Playa Dr, Goleta CA 93117',
        university: 'UCSB',
        price: 1350,
        bathrooms: 1,
        bedrooms: 2,
        housingType: 'apartment',
        distanceToCampus: 0.5,
        amenities: ['WiFi', 'Parking', 'Ocean View', 'Laundry'],
        imageUrl: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&auto=format&fit=crop',
        landlord: landlordId,
        isAvailable: true,
        latitude: 34.4132,
        longitude: -119.8640,
    },
    {
        title: 'Sabado Tarde House',
        address: '6714 Sabado Tarde Rd, Goleta CA 93117',
        university: 'UCSB',
        price: 1800,
        bathrooms: 2,
        bedrooms: 4,
        housingType: 'house',
        distanceToCampus: 0.7,
        amenities: ['WiFi', 'Parking', 'Backyard', 'Washer/Dryer'],
        imageUrl: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&auto=format&fit=crop',
        landlord: landlordId,
        isAvailable: true,
        latitude: 34.4118,
        longitude: -119.8628,
    },
];

async function seed() {
    await mongoose.connect(process.env.DB_URI);
    console.log('Connected to MongoDB');

    // Find or create seed landlord
    let landlord = await User.findOne({ email: SEED_EMAIL });
    if (!landlord) {
        landlord = await User.create({
            fullName: 'UniHousing Demo',
            email: SEED_EMAIL,
            password: bcrypt.hashSync('SeedPass123!', 10),
            role: 'landlord/agent',
        });
        console.log('Created seed landlord:', landlord._id);
    } else {
        console.log('Found existing seed landlord:', landlord._id);
    }

    // Remove previously seeded listings
    const deleted = await Listing.deleteMany({ landlord: landlord._id });
    console.log(`Deleted ${deleted.deletedCount} old seeded listings`);

    // Insert fresh listings
    const listings = seedListings(landlord._id);
    await Listing.insertMany(listings);
    console.log(`Inserted ${listings.length} listings`);

    console.log('Done. Disconnecting...');
    await mongoose.disconnect();
}

seed().catch((err) => {
    console.error('Seed failed:', err.message);
    process.exit(1);
});

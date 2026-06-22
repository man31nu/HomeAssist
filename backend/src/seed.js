require('dotenv').config();
const { sequelize } = require('./config/db');
const { Service, Role, ServiceCategory } = require('./models');

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected for seeding...');

    // Seed Categories
    const categories = [
      { name: 'Cleaning', description: 'Home cleaning services', image_url: 'https://cdn-icons-png.flaticon.com/512/2932/2932594.png' },
      { name: 'Plumber', description: 'Plumbing services', image_url: 'https://cdn-icons-png.flaticon.com/512/3712/3712217.png' },
      { name: 'Electrician', description: 'Electrical services', image_url: 'https://cdn-icons-png.flaticon.com/512/4241/4241193.png' },
      { name: 'Carpenter', description: 'Carpentry services', image_url: 'https://cdn-icons-png.flaticon.com/512/1217/1217316.png' },
      { name: 'Salon for Women', description: 'Beauty and grooming services', image_url: 'https://cdn-icons-png.flaticon.com/512/1973/1973685.png' },
      { name: 'AC Repair', description: 'AC servicing and repair', image_url: 'https://cdn-icons-png.flaticon.com/512/2942/2942914.png' }
    ];
    
    // Ignore duplicates if they exist based on name
    for (const cat of categories) {
      await ServiceCategory.findOrCreate({ where: { name: cat.name }, defaults: cat });
    }
    console.log('Service Categories seeded successfully!');

    // Fetch categories back to map IDs
    const dbCategories = await ServiceCategory.findAll();
    const catMap = {};
    dbCategories.forEach(c => { catMap[c.name] = c.id; });

    // Seed Services
    const services = [
      // Cleaning
      { title: 'Bathroom Deep Cleaning', description: 'Complete cleaning of bathroom tiles, floors, and fixtures.', category_id: catMap['Cleaning'], base_price: 599.00, estimated_duration: 60, status: 'active' },
      { title: 'Full Home Deep Cleaning', description: 'Deep cleaning of all rooms, kitchen, and bathrooms.', category_id: catMap['Cleaning'], base_price: 3499.00, estimated_duration: 360, status: 'active' },
      { title: 'Sofa Cleaning', description: 'Dry vacuuming, shampooing and wet vacuuming of sofa seats.', category_id: catMap['Cleaning'], base_price: 749.00, estimated_duration: 90, status: 'active' },
      { title: 'Kitchen Deep Cleaning', description: 'Removal of oil stains, grease and deep cleaning of cabinets.', category_id: catMap['Cleaning'], base_price: 1299.00, estimated_duration: 150, status: 'active' },
      
      // Plumber
      { title: 'Tap Repair & Installation', description: 'Fixing leaking taps or installing new ones.', category_id: catMap['Plumber'], base_price: 149.00, estimated_duration: 30, status: 'active' },
      { title: 'Washbasin Blockage', description: 'Clearing blockage in washbasin pipes.', category_id: catMap['Plumber'], base_price: 249.00, estimated_duration: 45, status: 'active' },
      { title: 'Water Tank Cleaning', description: 'Mechanized cleaning of overhead water tanks.', category_id: catMap['Plumber'], base_price: 899.00, estimated_duration: 120, status: 'active' },
      { title: 'Toilet Pot Installation', description: 'Installation of western or Indian toilet pot.', category_id: catMap['Plumber'], base_price: 1499.00, estimated_duration: 120, status: 'active' },

      // Electrician
      { title: 'Switch/Socket Replacement', description: 'Replacing damaged electrical switches or sockets.', category_id: catMap['Electrician'], base_price: 99.00, estimated_duration: 20, status: 'active' },
      { title: 'Fan Installation', description: 'Installation of ceiling or exhaust fans.', category_id: catMap['Electrician'], base_price: 199.00, estimated_duration: 40, status: 'active' },
      { title: 'Inverter Installation', description: 'Setup and wiring for home inverter systems.', category_id: catMap['Electrician'], base_price: 499.00, estimated_duration: 90, status: 'active' },
      { title: 'MCB Box Repair', description: 'Repair or replacement of Miniature Circuit Breakers.', category_id: catMap['Electrician'], base_price: 349.00, estimated_duration: 60, status: 'active' },

      // AC Repair
      { title: 'AC Service & Cleaning', description: 'Foam jet cleaning for Split/Window AC.', category_id: catMap['AC Repair'], base_price: 499.00, estimated_duration: 45, status: 'active' },
      { title: 'AC Gas Refill', description: 'Complete gas top-up and leakage checking.', category_id: catMap['AC Repair'], base_price: 2499.00, estimated_duration: 90, status: 'active' },
      { title: 'AC Installation', description: 'Professional installation of Split or Window AC.', category_id: catMap['AC Repair'], base_price: 1199.00, estimated_duration: 120, status: 'active' },

      // Carpenter
      { title: 'Bed/Wardrobe Assembly', description: 'Assembly and fitting of modular furniture.', category_id: catMap['Carpenter'], base_price: 399.00, estimated_duration: 120, status: 'active' },
      { title: 'Door Lock Repair', description: 'Fixing or replacing main door or bedroom locks.', category_id: catMap['Carpenter'], base_price: 249.00, estimated_duration: 45, status: 'active' },
      { title: 'Custom Wooden Shelf', description: 'Making and installing custom wooden shelves.', category_id: catMap['Carpenter'], base_price: 899.00, estimated_duration: 180, status: 'active' },

      // Salon for Women
      { title: 'Classic Manicure & Pedicure', description: 'Complete nail care, massage and polish.', category_id: catMap['Salon for Women'], base_price: 699.00, estimated_duration: 75, status: 'active' },
      { title: 'Fruit Facial', description: 'Relaxing fruit facial for glowing skin.', category_id: catMap['Salon for Women'], base_price: 899.00, estimated_duration: 60, status: 'active' },
      { title: 'Full Arms & Legs Waxing', description: 'Smooth waxing experience with premium wax.', category_id: catMap['Salon for Women'], base_price: 499.00, estimated_duration: 45, status: 'active' }
    ];

    for (const srv of services) {
      await Service.findOrCreate({ where: { title: srv.title }, defaults: srv });
    }
    console.log('Services seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();

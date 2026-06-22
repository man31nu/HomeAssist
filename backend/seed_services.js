require('dotenv').config({ path: 'c:/Assigned-Project/services-booking-app/backend/.env' });
const { sequelize } = require('./src/config/db');
const { ServiceCategory, Service } = require('./src/models');

const seedData = async () => {
  try {
    await sequelize.authenticate();

    const categories = [
      { name: 'Cleaning', description: 'Professional cleaning services for your home and office.' },
      { name: 'Plumber', description: 'Expert plumbing services for repairs and installations.' },
      { name: 'AC Repair', description: 'Air conditioning repair, maintenance, and installation.' },
      { name: 'Electrician', description: 'Electrical repairs, wiring, and appliance installation.' },
      { name: 'Carpenter', description: 'Carpentry services for furniture repair and custom builds.' },
      { name: 'Salon for Women', description: 'At-home beauty and salon services for women.' },
      { name: 'All', description: 'All services' }
    ];

    const categoryMap = {};

    for (const catData of categories) {
      if (catData.name !== 'All') {
        const [category] = await ServiceCategory.findOrCreate({
          where: { name: catData.name },
          defaults: catData
        });
        categoryMap[catData.name] = category.id;
      }
    }

    const services = [
      // Cleaning
      {
        category_name: 'Cleaning',
        title: 'Deep Home Cleaning',
        description: 'Intensive cleaning for every room in your home. Includes dusting, mopping, and bathroom deep clean.',
        base_price: 8500.00,
        estimated_duration: 360
      },
      {
        category_name: 'Cleaning',
        title: 'Sofa Cleaning',
        description: 'Professional dry and wet cleaning of sofas (per seat).',
        base_price: 800.00,
        estimated_duration: 45
      },
      {
        category_name: 'Cleaning',
        title: 'Bathroom Deep Cleaning',
        description: 'Stain removal, tile scrubbing, and sanitization of one bathroom.',
        base_price: 1500.00,
        estimated_duration: 90
      },
      {
        category_name: 'Cleaning',
        title: 'Kitchen Deep Cleaning',
        description: 'Degreasing of chimneys, slab cleaning, and cabinet exterior wiping.',
        base_price: 3000.00,
        estimated_duration: 120
      },

      // Plumber
      {
        category_name: 'Plumber',
        title: 'Tap Repair / Installation',
        description: 'Fixing leaking taps or installing new fixtures.',
        base_price: 600.00,
        estimated_duration: 30
      },
      {
        category_name: 'Plumber',
        title: 'Pipe Leakage Fix',
        description: 'Identifying and fixing concealed or exposed pipe leaks.',
        base_price: 1800.00,
        estimated_duration: 90
      },
      {
        category_name: 'Plumber',
        title: 'Washbasin Blockage Removal',
        description: 'Clearing clogged washbasins or sinks.',
        base_price: 1000.00,
        estimated_duration: 45
      },
      {
        category_name: 'Plumber',
        title: 'Water Heater Installation',
        description: 'Professional installation of geysers/water heaters.',
        base_price: 2000.00,
        estimated_duration: 60
      },

      // AC Repair
      {
        category_name: 'AC Repair',
        title: 'AC Servicing (Split/Window)',
        description: 'Foam jet cleaning of indoor and outdoor units for better cooling.',
        base_price: 1200.00,
        estimated_duration: 60
      },
      {
        category_name: 'AC Repair',
        title: 'AC Gas Refill',
        description: 'Checking gas levels, fixing minor leaks, and refilling refrigerant.',
        base_price: 4500.00,
        estimated_duration: 90
      },
      {
        category_name: 'AC Repair',
        title: 'AC Installation',
        description: 'Complete installation of Split or Window AC units.',
        base_price: 3500.00,
        estimated_duration: 120
      },
      {
        category_name: 'AC Repair',
        title: 'AC PCB Repair',
        description: 'Diagnosing and repairing faulty AC circuit boards.',
        base_price: 5000.00,
        estimated_duration: 120
      },

      // Electrician
      {
        category_name: 'Electrician',
        title: 'Fan Installation/Repair',
        description: 'Installation of ceiling/wall fans or fixing regulator issues.',
        base_price: 700.00,
        estimated_duration: 30
      },
      {
        category_name: 'Electrician',
        title: 'Switchboard Repair/Replacement',
        description: 'Fixing or replacing damaged electrical switchboards.',
        base_price: 800.00,
        estimated_duration: 45
      },
      {
        category_name: 'Electrician',
        title: 'MCB/Fuse Replacement',
        description: 'Replacing burnt fuses or faulty MCBs in the main panel.',
        base_price: 1200.00,
        estimated_duration: 30
      },
      {
        category_name: 'Electrician',
        title: 'Inverter Installation',
        description: 'Wiring and setup for home inverters/batteries.',
        base_price: 2500.00,
        estimated_duration: 90
      },

      // Carpenter
      {
        category_name: 'Carpenter',
        title: 'Furniture Assembly',
        description: 'Assembling pre-packaged beds, tables, and cabinets.',
        base_price: 1500.00,
        estimated_duration: 60
      },
      {
        category_name: 'Carpenter',
        title: 'Door Lock Repair/Replacement',
        description: 'Fixing jammed locks or installing new door locks.',
        base_price: 1200.00,
        estimated_duration: 30
      },
      {
        category_name: 'Carpenter',
        title: 'Hinge Replacement',
        description: 'Replacing broken hinges for doors or cabinets.',
        base_price: 800.00,
        estimated_duration: 30
      },
      {
        category_name: 'Carpenter',
        title: 'Custom Shelving',
        description: 'Making and installing custom wall shelves.',
        base_price: 3500.00,
        estimated_duration: 120
      },

      // Salon for Women
      {
        category_name: 'Salon for Women',
        title: 'Basic Haircut',
        description: 'Professional haircut and styling at the comfort of your home.',
        base_price: 1500.00,
        estimated_duration: 45
      },
      {
        category_name: 'Salon for Women',
        title: 'Manicure & Pedicure',
        description: 'Complete nail care, cuticle cleaning, and massage.',
        base_price: 3500.00,
        estimated_duration: 90
      },
      {
        category_name: 'Salon for Women',
        title: 'Facial & Cleanup',
        description: 'Deep cleansing and skin rejuvenation facial treatments.',
        base_price: 4000.00,
        estimated_duration: 60
      },
      {
        category_name: 'Salon for Women',
        title: 'Waxing (Full Arms & Legs)',
        description: 'Smooth hair removal using premium quality wax.',
        base_price: 2000.00,
        estimated_duration: 45
      }
    ];

    for (const serviceData of services) {
      const category_id = categoryMap[serviceData.category_name];
      if (category_id) {
        const existingService = await Service.findOne({ where: { title: serviceData.title } });
        if (existingService) {
          await existingService.update({
            category_id,
            description: serviceData.description,
            base_price: serviceData.base_price,
            estimated_duration: serviceData.estimated_duration,
            status: 'active'
          });
        } else {
          await Service.create({
            category_id,
            title: serviceData.title,
            description: serviceData.description,
            base_price: serviceData.base_price,
            estimated_duration: serviceData.estimated_duration,
            status: 'active'
          });
        }
      }
    }

    console.log('Seed data successfully inserted!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed data:', error);
    process.exit(1);
  }
};

seedData();

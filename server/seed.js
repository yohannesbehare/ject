/**
 * TaskR Database Seed Script
 * Run: node seed.js
 * Creates sample workers, customers, contacts, and reviews.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const WorkerProfile = require('./models/WorkerProfile');
const ContactRequest = require('./models/ContactRequest');
const Review = require('./models/Review');
const SavedWorker = require('./models/SavedWorker');

const WORKERS = [
  { name: 'Alemu Bekele', email: 'worker@taskr.com', phone: '+251911001001', city: 'Addis Ababa', profession: 'plumber', hourlyRate: 180, experience: 8, skills: ['Pipe Fitting', 'Water Heater', 'Bathroom Install', 'Leak Repair', 'Drainage'], bio: 'Experienced plumber with 8 years working on residential and commercial projects across Addis Ababa.', rating: 4.9, reviews: 47 },
  { name: 'Dawit Haile', email: 'dawit@taskr.com', phone: '+251922002002', city: 'Addis Ababa', profession: 'electrician', hourlyRate: 220, experience: 12, skills: ['Wiring', 'Circuit Boards', 'Solar Install', 'Generator', 'Switch Panels'], bio: 'Master electrician with over a decade of expertise. Licensed by EEAE.', rating: 4.8, reviews: 89 },
  { name: 'Tigist Worku', email: 'tigist@taskr.com', phone: '+251933003003', city: 'Hawassa', profession: 'painter', hourlyRate: 120, experience: 5, skills: ['Interior Paint', 'Exterior Paint', 'Texture Finish', 'Waterproof', 'Wallpaper'], bio: 'Professional painter creating beautiful spaces with attention to detail.', rating: 4.7, reviews: 34 },
  { name: 'Yonas Tesfaye', email: 'yonas@taskr.com', phone: '+251944004004', city: 'Bahir Dar', profession: 'carpenter', hourlyRate: 200, experience: 15, skills: ['Furniture', 'Doors & Windows', 'Roofing', 'Flooring', 'Custom Cabinetry'], bio: 'Master carpenter with 15 years building beautiful, durable furniture and structures.', rating: 4.9, reviews: 62 },
  { name: 'Kebede Mulat', email: 'kebede@taskr.com', phone: '+251955005005', city: 'Addis Ababa', profession: 'driver', hourlyRate: 100, experience: 10, skills: ['Long Distance', 'Cargo', 'Luxury Vehicles', 'Night Driving', 'Route Planning'], bio: 'Professional driver with clean record and 10 years experience.', rating: 4.6, reviews: 128 },
  { name: 'Hana Girma', email: 'hana@taskr.com', phone: '+251966006006', city: 'Adama', profession: 'painter', hourlyRate: 110, experience: 3, skills: ['Interior Paint', 'Wall Art', 'Decorative', 'Stenciling', 'Color Consult'], bio: 'Creative painter offering free color consultations and custom wall art.', rating: 4.5, reviews: 18 },
  { name: 'Solomon Amare', email: 'solomon@taskr.com', phone: '+251977007007', city: 'Dire Dawa', profession: 'laborer', hourlyRate: 80, experience: 7, skills: ['Heavy Lifting', 'Excavation', 'Demolition', 'Site Cleanup', 'Material Handling'], bio: 'Hardworking and reliable laborer for construction and renovation projects.', rating: 4.4, reviews: 29 },
  { name: 'Meron Teshome', email: 'meron@taskr.com', phone: '+251988008008', city: 'Mekelle', profession: 'electrician', hourlyRate: 190, experience: 9, skills: ['Residential Wiring', 'CCTV Install', 'Smart Home', 'Emergency Repairs', 'Meter Install'], bio: 'Certified electrician specializing in smart home and CCTV installations.', rating: 4.7, reviews: 41 },
];

const CUSTOMERS = [
  { name: 'John Doe', email: 'customer@taskr.com', phone: '+251900000001', city: 'Addis Ababa' },
  { name: 'Sara Kebede', email: 'sara@taskr.com', phone: '+251900000002', city: 'Hawassa' },
  { name: 'Biniam Tadesse', email: 'biniam@taskr.com', phone: '+251900000003', city: 'Addis Ababa' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}), WorkerProfile.deleteMany({}),
      ContactRequest.deleteMany({}), Review.deleteMany({}), SavedWorker.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    const password = await bcrypt.hash('password123', 12);

    // Create customers
    const customerDocs = await User.create(
      CUSTOMERS.map((c) => ({ ...c, password, role: 'customer' }))
    );
    console.log(`✅ Created ${customerDocs.length} customers`);

    // Create workers
    const workerUsers = await User.create(
      WORKERS.map((w) => ({
        name: w.name, email: w.email, phone: w.phone, city: w.city,
        password, role: 'worker',
      }))
    );

    const workerProfiles = await WorkerProfile.create(
      WORKERS.map((w, i) => ({
        userId: workerUsers[i]._id,
        profession: w.profession,
        hourlyRate: w.hourlyRate,
        experience: w.experience,
        skills: w.skills,
        bio: w.bio,
        isAvailable: true,
        isApproved: true,
        averageRating: w.rating,
        totalReviews: w.reviews,
        totalViews: Math.floor(Math.random() * 300) + 50,
        totalContacts: Math.floor(Math.random() * 50) + 10,
      }))
    );
    console.log(`✅ Created ${workerUsers.length} workers with profiles`);

    // Create contact requests
    const customer = customerDocs[0];
    const contactDocs = await ContactRequest.create([
      {
        customerId: customer._id, workerId: workerUsers[0]._id,
        customerName: customer.name, customerPhone: customer.phone,
        jobDescription: 'Fix leaking pipe under kitchen sink',
        preferredDate: '2026-05-10', urgency: 'high', status: 'completed', reviewSubmitted: true,
      },
      {
        customerId: customer._id, workerId: workerUsers[1]._id,
        customerName: customer.name, customerPhone: customer.phone,
        jobDescription: 'Install new ceiling fan in master bedroom',
        preferredDate: '2026-05-15', urgency: 'medium', status: 'accepted',
      },
      {
        customerId: customer._id, workerId: workerUsers[2]._id,
        customerName: customer.name, customerPhone: customer.phone,
        jobDescription: 'Paint living room and dining room walls',
        preferredDate: '2026-05-20', urgency: 'low', status: 'pending',
      },
    ]);
    console.log(`✅ Created ${contactDocs.length} contact requests`);

    // Create reviews
    await Review.create([
      {
        customerId: customerDocs[1]._id, workerId: workerUsers[0]._id,
        contactRequestId: contactDocs[0]._id, rating: 5,
        comment: 'Excellent work! Alemu fixed the leak quickly and cleanly. Very professional and left no mess.',
      },
      {
        customerId: customerDocs[2]._id, workerId: workerUsers[0]._id,
        contactRequestId: contactDocs[0]._id, rating: 5,
        comment: 'Arrived on time, diagnosed the problem immediately and had it fixed within an hour. Highly recommend!',
      },
      {
        customerId: customerDocs[0]._id, workerId: workerUsers[1]._id,
        contactRequestId: contactDocs[1]._id, rating: 5,
        comment: 'Dawit is an excellent electrician. Very knowledgeable and professional. Will hire again.',
      },
    ]);
    console.log('✅ Created sample reviews');

    // Create bookmarks
    await SavedWorker.create([
      { customerId: customer._id, workerId: workerUsers[1]._id },
      { customerId: customer._id, workerId: workerUsers[4]._id },
    ]);
    console.log('✅ Created sample bookmarks');

    console.log('\n🎉 Seeding complete!\n');
    console.log('Demo accounts:');
    console.log('  Customer: customer@taskr.com / password123');
    console.log('  Worker:   worker@taskr.com / password123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();

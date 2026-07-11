require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

// Subscription details template
const subscriptionTemplates = [
  {
    serviceName: 'Netflix',
    cost: 15.49,
    billingCycle: 'monthly',
    category: 'streaming',
    status: 'active',
    usageFrequency: 'daily',
    daysToRenewal: 3,
  },
  {
    serviceName: 'Spotify',
    cost: 10.99,
    billingCycle: 'monthly',
    category: 'streaming',
    status: 'active',
    usageFrequency: 'daily',
    daysToRenewal: 7,
  },
  {
    serviceName: 'YouTube Premium',
    cost: 13.99,
    billingCycle: 'monthly',
    category: 'streaming',
    status: 'active',
    usageFrequency: 'daily',
    daysToRenewal: 14,
  },
  {
    serviceName: 'GitHub Copilot',
    cost: 10.00,
    billingCycle: 'monthly',
    category: 'software',
    status: 'active',
    usageFrequency: 'daily',
    daysToRenewal: 20,
  },
  {
    serviceName: 'OpenAI ChatGPT Plus',
    cost: 20.00,
    billingCycle: 'monthly',
    category: 'software',
    status: 'active',
    usageFrequency: 'daily',
    daysToRenewal: 5,
  },
  {
    serviceName: 'AWS Cloud Services',
    cost: 45.30,
    billingCycle: 'monthly',
    category: 'cloud',
    status: 'active',
    usageFrequency: 'weekly',
    daysToRenewal: 1,
  },
  {
    serviceName: 'Gym Membership',
    cost: 50.00,
    billingCycle: 'monthly',
    category: 'fitness',
    status: 'active',
    usageFrequency: 'weekly',
    daysToRenewal: 12,
  },
  {
    serviceName: 'Calm App',
    cost: 69.99,
    billingCycle: 'yearly',
    category: 'fitness',
    status: 'active',
    usageFrequency: 'monthly',
    daysToRenewal: 120,
  },
  {
    serviceName: 'Coursera Plus',
    cost: 39.00,
    billingCycle: 'monthly',
    category: 'learning',
    status: 'active',
    usageFrequency: 'weekly',
    daysToRenewal: 8,
  },
  {
    serviceName: 'Adobe Creative Cloud',
    cost: 54.99,
    billingCycle: 'monthly',
    category: 'software',
    status: 'inactive',
    usageFrequency: 'rarely',
    daysToRenewal: 15,
  },
  {
    serviceName: 'Hulu',
    cost: 7.99,
    billingCycle: 'monthly',
    category: 'streaming',
    status: 'inactive',
    usageFrequency: 'rarely',
    daysToRenewal: 22,
  },
  {
    serviceName: 'Amazon Prime',
    cost: 139.00,
    billingCycle: 'yearly',
    category: 'streaming',
    status: 'active',
    usageFrequency: 'weekly',
    daysToRenewal: 250,
  },
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/subscription-manager';
    console.log(`Connecting to database: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB.');

    // 1. Clean up existing data
    console.log('Cleaning existing User and Subscription documents...');
    await User.deleteMany({});
    await Subscription.deleteMany({});
    console.log('✅ Database cleaned.');

    // 2. Create default demo user
    console.log('Creating demo user...');
    // Password will be automatically hashed in User schema pre-save hook
    const demoUser = new User({
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'Password123',
    });
    await demoUser.save();
    console.log(`✅ Demo user created: ${demoUser.email} (Password: Password123)`);

    // 3. Create subscriptions with relative dates
    console.log('Generating subscriptions...');
    const now = new Date();

    const subscriptions = subscriptionTemplates.map(template => {
      const renewalDate = new Date();
      renewalDate.setDate(now.getDate() + template.daysToRenewal);

      return {
        userId: demoUser._id,
        serviceName: template.serviceName,
        cost: template.cost,
        billingCycle: template.billingCycle,
        category: template.category,
        status: template.status,
        usageFrequency: template.usageFrequency,
        renewalDate: renewalDate,
      };
    });

    await Subscription.insertMany(subscriptions);
    console.log(`✅ Seeded ${subscriptions.length} subscriptions successfully.`);

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

seedDatabase();

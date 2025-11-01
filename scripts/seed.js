const mongoose = require('mongoose');
const Role = require('../models/role');
const Privilege = require('../models/privilege');
const Menu = require('../models/menu');
const ModuleMaster = require('../models/moduleMaster');
const User = require('../models/user');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/adminservices';

async function seed() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to', MONGO_URI);

  // Clear existing data (safe for initial setup)
  await Privilege.deleteMany({});
  await Role.deleteMany({});
  await Menu.deleteMany({});
  await ModuleMaster.deleteMany({});
  await User.deleteMany({});

  // Create privileges first
  const privileges = await Privilege.create([
    { name: 'All Privileges', code: 'ALL' },
    { name: 'Read Only', code: 'READ' },
    { name: 'Write', code: 'WRITE' },
    { name: 'View Users', code: 'VIEWUSER' },
    { name: 'Create User', code: 'CREATEUSER' },
    { name: 'Edit User', code: 'EDITUSER' },
    { name: 'Delete User', code: 'DELETEUSER' }
  ]);

  // Create roles referencing privileges
  const roles = await Role.create([
    { roleName: 'Administrator', roleCode: 'ADMIN', privileges: [privileges[0]._id, privileges[2]._id] },
    { roleName: 'Regular User', roleCode: 'USER', privileges: [privileges[1]._id] }
  ]);

  // Create menus (two documents). Each menu document contains a `menu` array.
  const menus = await Menu.create([
    {
      menu: [
        {
          name: 'Dashboard',
          link: '/dashboard',
          submenu: [
            { name: 'Overview', link: '/dashboard/overview' },
            { name: 'Reports', link: '/dashboard/reports' }
          ]
        },
        {
          name: 'Projects',
          link: '/projects',
          submenu: [
            { name: 'Active', link: '/projects/active' },
            { name: 'Archived', link: '/projects/archived' }
          ]
        }
      ]
    },
    {
      menu: [
        {
          name: 'Settings',
          link: '/settings',
          submenu: [
            { name: 'Profile', link: '/settings/profile' },
            {
              name: 'Security',
              link: '/settings/security',
              submenu: [
                { name: 'Password', link: '/settings/security/password' }
              ]
            }
          ]
        }
      ]
    }
  ]);

  // Create a sample ModuleMaster entry
  const modules = await ModuleMaster.create([
    {
      moduleName: 'User Profile',
      moduleCode: 'USER_PROFILE',
      dropdowns: [
        {
          fieldName: 'gender',
          displayName: 'Gender',
          options: [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' }
          ]
        }
      ]
    }
  ]);

  // Create users referencing the roles created above
  const users = await User.create([
    {
      username: 'admin',
      email: 'admin@example.com',
      firtName: 'Admin',
      lastName: 'User',
      password: 'Password123',
      roleId: roles[0]._id
    },
    {
      username: 'johndoe',
      email: 'john@example.com',
      firtName: 'John',
      lastName: 'Doe',
      password: 'Password123',
      roleId: roles[1]._id
    }
  ]);

  console.log('Seed complete:');
  console.log(' Roles:', roles.map(r => r.roleCode));
  console.log(' Menus created:', menus.length);
  console.log(' Modules created:', modules.length);
  console.log(' Users:', users.map(u => u.username));

  await mongoose.disconnect();
  console.log('Disconnected.');
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});

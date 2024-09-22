import {enablePromise, openDatabase} from 'react-native-sqlite-storage';
import auth from '@react-native-firebase/auth';
// Enable promise support
enablePromise(true);

// Open or create the database
const getDBConnection = async () => {
  return openDatabase({name: 'appdb.db', location: 'default'});
};

// Create users table if it doesn't exist
export const createTable = async () => {
  const db = await getDBConnection();
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      age INTEGER,
      month TEXT,
      mobile TEXT
    );
  `;
  await db.executeSql(query);
  console.log('Table created or exists already');
};

// Function to check if a user exists by email and insert if not found
export const checkAndInsertUser = async (name, email, month) => {
  const db = await getDBConnection();
  const checkQuery = 'SELECT * FROM users WHERE email = ?';
  const insertQuery = 'INSERT INTO users (name, email, month) VALUES (?, ?, ?)';

  try {
    // Check if user exists
    const results = await db.executeSql(checkQuery, [email]);
    if (results[0].rows.length > 0) {
      console.log('User with this email already exists');
      return false; // User already exists
    } else {
      // Insert new user
      await db.executeSql(insertQuery, [name, email, month]);
      console.log('New user inserted successfully');
      return true; // New user created
    }
  } catch (error) {
    console.error('Error checking or inserting user', error);
    throw error;
  }
};

// Function to fetch user profile by email
export const fetchUserProfileByEmail = async email => {
  const db = await getDBConnection();
  const query = 'SELECT * FROM users WHERE email = ?';

  try {
    const results = await db.executeSql(query, [email]);
    if (results[0].rows.length > 0) {
      const user = results[0].rows.item(0); // Get the first user from the result
      console.log('User profile found:', user);
      return user; // Return the user profile
    } else {
      console.log('No user found with the provided email');
      return null; // Return null if no user found
    }
  } catch (error) {
    console.error('Error fetching user profile by email', error);
    throw error; // Re-throw error for further handling
  }
};

export const updateUserProfile = async (name, age, mobile, email) => {
  const db = await getDBConnection(); // Get the database connection
  const query =
    'UPDATE users SET name = ?, age = ?, mobile = ? WHERE email = ?';

  try {
    const results = await db.executeSql(query, [name, age, mobile, email]);
    console.log(results);

    // Check rowsAffected from the first result set
    if (results[0].rowsAffected > 0) {
      console.log('User profile updated successfully for email:', email);
      return true; // Return true if the update was successful
    } else {
      console.log('No user found with the provided email');
      return false; // Return false if no rows were affected
    }
  } catch (error) {
    console.error('Error updating user profile', error);
    throw error; // Re-throw error for further handling
  }
};

export const fetchAllUsers = async () => {
  const db = await getDBConnection(); // Get the database connection
  const query = 'SELECT * FROM users'; // Query to fetch all users

  try {
    const results = await db.executeSql(query); // Execute the query
    const users = [];

    // Loop through the results and push each user to the users array
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        users.push(result.rows.item(index)); // Add user object to the array
      }
    });

    console.log('Fetched users:', users); // Log the fetched users
    return users; // Return the array of users
  } catch (error) {
    console.error('Error fetching users', error);
    throw error; // Re-throw error for further handling
  }
};

export const countUsersByMonth = async () => {
  const db = await getDBConnection(); // Get the database connection
  const currentDate = new Date();
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Get current month index
  const currentMonthIndex = currentDate.getMonth(); // 0-11
  const lastFiveMonths = [];

  // Get the last five months and the current month
  for (let i = 0; i < 6; i++) {
    const monthIndex = (currentMonthIndex - i + 12) % 12; // Wrap around using modulus
    lastFiveMonths.push(months[monthIndex]);
  }

  const userCounts = lastFiveMonths.map(month => ({month, count: 0})); // Initialize counts for each month

  try {
    // Loop through each month and count users
    for (const month of lastFiveMonths) {
      const query = `SELECT COUNT(*) as count FROM users WHERE month = ?`;
      const results = await db.executeSql(query, [month]);

      if (results[0].rows.length > 0) {
        userCounts.find(m => m.month === month).count =
          results[0].rows.item(0).count; // Update count for the month
      }
    }

    console.log('User counts by month:', userCounts); // Log the user counts
    return userCounts; // Return the counts
  } catch (error) {
    console.error('Error counting users by month', error);
    throw error; // Re-throw error for further handling
  }
};

export const createContactTable = async () => {
  const db = await getDBConnection(); // Get the database connection

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      phone TEXT,
      experience INTEGER,
      salaryExpectation INTEGER,
      position TEXT,
      user_email TEXT 
    );  
  `;

  try {
    await db.executeSql(createTableQuery); // Execute the create table query
    console.log('Contact table created or already exists.');
  } catch (error) {
    console.error('Error creating contact table', error);
    throw error; // Re-throw error for further handling
  }
};

export const addContactDetails = async contactData => {
  const db = await getDBConnection(); // Get the database connection

  const {name, email, phone, experience, salaryExpectation, position} =
    contactData;

  // Get the currently logged-in user's email
  const currentUser = auth().currentUser;
  const loggedInUserEmail = currentUser ? currentUser.email : null;

  if (!loggedInUserEmail) {
    console.error('No logged-in user found.');
    throw new Error('You must be logged in to add contact details.');
  }

  const insertQuery = `
    INSERT INTO contacts (name, email, phone, experience, salaryExpectation, position, user_email)
    VALUES (?, ?, ?, ?, ?, ?, ?); 
  `;

  try {
    // Add the contact details along with the logged-in user's email as a reference
    await db.executeSql(insertQuery, [
      name,
      email,
      phone,
      experience,
      salaryExpectation,
      position,
      loggedInUserEmail,
    ]);
    console.log('Contact details added successfully.');
  } catch (error) {
    console.error('Error adding contact details', error);
    throw error; // Re-throw error for further handling
  }
};

export const fetchContactsByCurrentUser = async () => {
  const db = await getDBConnection(); // Get the database connection

  // Get the currently logged-in user's email
  const currentUser = auth().currentUser;
  const loggedInUserEmail = currentUser ? currentUser.email : null;

  if (!loggedInUserEmail) {
    console.error('No logged-in user found.');
    throw new Error('You must be logged in to fetch contact details.');
  }

  const selectQuery = `
    SELECT * FROM contacts WHERE user_email = ?;
  `;

  try {
    // Execute the query to fetch contacts by logged-in user's email
    const results = await db.executeSql(selectQuery, [loggedInUserEmail]);

    if (results[0].rows.length > 0) {
      const contacts = [];
      for (let i = 0; i < results[0].rows.length; i++) {
        contacts.push(results[0].rows.item(i));
      }
      console.log('Fetched contacts:', contacts);
      return contacts; // Return the fetched contacts
    } else {
      console.log('No contacts found for the current user.');
      return []; // Return an empty array if no contacts found
    }
  } catch (error) {
    console.error('Error fetching contacts', error);
    throw error; // Re-throw error for further handling
  }
};

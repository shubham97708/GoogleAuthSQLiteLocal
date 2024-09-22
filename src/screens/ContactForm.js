import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList, Modal, TouchableOpacity } from 'react-native';
import { addContactDetails ,fetchContactsByCurrentUser } from '../services/database';


const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState('');
  const [salaryExpectation, setSalaryExpectation] = useState('');
  const [position, setPosition] = useState('');
  const [contacts, setContacts] = useState([]); // State to store fetched contacts
  const [modalVisible, setModalVisible] = useState(false); // State to toggle modal

  // Fetch all contacts on initial render and after adding a new contact
  const fetchContacts = async () => {
    try {
      const fetchedContacts = await fetchContactsByCurrentUser();
      setContacts(fetchedContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  useEffect(() => {
    fetchContacts(); // Fetch contacts when the component loads
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    if (!name || !email || !phone || !experience || !salaryExpectation || !position) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const userData = {
        name,
        email,
        phone,
        experience,
        salaryExpectation,
        position,
      };

      await addContactDetails(userData);

      Alert.alert('Success', 'Your information has been submitted!');
      resetForm();
      fetchContacts(); // Fetch contacts after form submission
      setModalVisible(false); // Close the modal after submission
    } catch (error) {
      console.error('Error during form submission:', error);
      Alert.alert('Error', 'There was an issue submitting your information. Please try again.');
    }
  };

  // Reset form fields
  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setExperience('');
    setSalaryExpectation('');
    setPosition('');
  };

  return (
    <View style={styles.container}>
      {/* Modal for Contact Form */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Enter Details</Text>

            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              placeholder="Years of Experience"
              value={experience}
              onChangeText={setExperience}
              keyboardType="numeric"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              placeholder="Salary Expectation"
              value={salaryExpectation}
              onChangeText={setSalaryExpectation}
              keyboardType="numeric"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              placeholder="Position Applied For"
              value={position}
              onChangeText={setPosition}
              placeholderTextColor="#888"
            />

            <Button title="Submit" onPress={handleSubmit} color="#007BFF" />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="#FF6347" />
          </View>
        </View>
      </Modal>

      {/* List of Contacts */}
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            <Text>Name: {item.name}</Text>
            <Text>Email: {item.email}</Text>
            <Text>Phone: {item.phone}</Text>
            <Text>Experience: {item.experience}</Text>
            <Text>Salary Expectation: {item.salaryExpectation}</Text>
            <Text>Position: {item.position}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No contacts available.</Text>}
      />

      {/* Button to Open Modal */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add Contact</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 45,
    borderColor: '#007BFF',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  contactItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ContactForm;

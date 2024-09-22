import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { countUsersByMonth } from '../services/database'; // Ensure this function counts users by month

const DashboardScreen = () => {
  const [userCounts, setUserCounts] = useState([]);

  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        const counts = await countUsersByMonth(); // Fetch user counts by month
        setUserCounts(counts); // Store counts in state
      } catch (error) {
        console.error('Failed to fetch user counts:', error);
      }
    };

    fetchUserCounts();
  }, []);

  // Prepare data for the BarChart
  const data = {
    labels: userCounts.map(item => item.month), // Month names
    datasets: [
      {
        data: userCounts.map(item => item.count), // User counts
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Counts by Month</Text>
      <View style={styles.chartContainer}>
        <BarChart
          data={data}
          width={400} // Adjust width as necessary
          height={220}
          fromZero={true}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0, // No decimal places for counts
            color: (opacity = 1) => `rgba(139, 69, 19, ${opacity})`, // Dark orange color
            labelColor: () => 'black', // Set label color to black
            style: {
              borderRadius: 16,
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
            overflow: 'hidden', // Ensure no overflow
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5', // Light gray background for contrast
    justifyContent: 'center',
    alignItems: 'center', // Center content
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Darker text color for better readability
    marginBottom: 20,
  },
  chartContainer: {
    backgroundColor: '#ffffff', // White background for the chart
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4, // Shadow effect for Android
    padding: 10,
  },
});

export default DashboardScreen;

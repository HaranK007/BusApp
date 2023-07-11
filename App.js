import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, ScrollView, Text, Image } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('BusApp.db');

const App = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [databaseInitialized, setDatabaseInitialized] = useState(false);
  const [busList, setBusList] = useState([]);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS buses (id INTEGER PRIMARY KEY AUTOINCREMENT, busName TEXT NOT NULL, busSource TEXT NOT NULL, busDestination TEXT NOT NULL)',
        [],
        () => {
          tx.executeSql(
            'SELECT * FROM buses',
            [],
            (_, result) => {
              if (result.rows.length === 0) {
                // Insert sample data
                tx.executeSql('INSERT INTO buses (busName, busSource, busDestination) VALUES (?, ?, ?)', ['Bus 1', 'Source 1', 'Destination 1']);
                tx.executeSql('INSERT INTO buses (busName, busSource, busDestination) VALUES (?, ?, ?)', ['Bus 2', 'Source 2', 'Destination 2']);
                tx.executeSql('INSERT INTO buses (busName, busSource, busDestination) VALUES (?, ?, ?)', ['Bus 3', 'Source 3', 'Destination 3']);
                tx.executeSql('INSERT INTO buses (busName, busSource, busDestination) VALUES (?, ?, ?)', ['Bus 4', 'Source 4', 'Destination 4']);
                tx.executeSql('INSERT INTO buses (busName, busSource, busDestination) VALUES (?, ?, ?)', ['Bus 5', 'Source 5', 'Destination 5']);
              }
            },
            (_, error) => {
              Alert.alert('Error checking existing data:', error.message);
            }
          );
          setDatabaseInitialized(true);
        },
        (_, error) => {
          Alert.alert('Error initializing database:', error.message);
        }
      );
    });
  };

  const searchBus = () => {
    if (!databaseInitialized) {
      Alert.alert('Database not initialized');
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM buses WHERE busSource = ? OR busDestination = ?',
        [from, to],
        (_, result) => {
          if (result.rows.length > 0) {
            const buses = [];
            for (let i = 0; i < result.rows.length; i++) {
              const bus = result.rows.item(i);
              buses.push(bus);
            }
            setBusList(buses);
          } else {
            setBusList([]);
            Alert.alert('No buses found');
          }
        },
        (_, error) => {
          Alert.alert('Error searching for buses:', error.message);
        }
      );
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#f1f4ed', padding: 20 }}>
      <View style={{ alignItems: 'center' }}>
        {/* <Image
          source={require('./logo4.jpg')}
          style={{ width: 200, height: 200, marginBottom: 50 }}
          resizeMode="contain"
        /> */}
      </View>
      <View style={{ backgroundColor: '#0b1820', padding: 20, borderRadius: 5 }}>
        <TextInput
          placeholder="From"
          value={from}
          onChangeText={(text) => setFrom(text)}
          style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 5, backgroundColor: '#ffffff' }}
        />
        <TextInput
          placeholder="To"
          value={to}
          onChangeText={(text) => setTo(text)}
          style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 5, backgroundColor: '#ffffff' }}
        />
        <Button title="Submit" onPress={searchBus} />
      </View>

      <ScrollView style={{ flex: 2 }}>
        {busList.length > 0 ? (
          busList.map((bus, index) => (
            <View
              key={index}
              style={{
                borderBottomWidth: 1,
                borderBottomColor: 'gray',
                paddingVertical: 10,
                paddingHorizontal: 20,
              }}
            >
              <Text style={{ fontWeight: 'bold' }}>{bus.busName}</Text>
              <Text>Source: {bus.busSource}</Text>
              <Text>Destination: {bus.busDestination}</Text>
            </View>
          ))
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>No buses available</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default App;

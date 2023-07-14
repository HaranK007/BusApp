import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, ScrollView, Text, Image } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('BusApp0.2.db');

const main = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [databaseInitialized, setDatabaseInitialized] = useState(false);
  const [bus, setBus] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS buses03 (id INTEGER PRIMARY KEY AUTOINCREMENT, busName TEXT NOT NULL, busSource TEXT NOT NULL, busDestination TEXT NOT NULL, busTimings TEXT, travelTime TEXT, calculatedDelay TEXT)',
        [],
        () => {
          tx.executeSql(
            'SELECT * FROM buses03',
            [],
            (_, result) => {
              if (result.rows.length === 0) {
                tx.executeSql('INSERT INTO buses03 (busName, busSource, busDestination, busTimings, travelTime, calculatedDelay) VALUES (?, ?, ?, ?, ?, ?)', ['Bus 1', 'Vit', 'Usa', '10:00 AM', '2 hours', '10 minutes']);
                tx.executeSql('INSERT INTO buses03 (busName, busSource, busDestination, busTimings, travelTime, calculatedDelay) VALUES (?, ?, ?, ?, ?, ?)', ['Bus 2', 'Salem', 'Vit', '2:00 PM', '3 hours', '5 minutes']);
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

  const handleLogin = () => {
    if (username === 'admin' && password === 'password') {
      setIsLoggedIn(true);
      Alert.alert('Login successful');
    } else {
      Alert.alert('Invalid username or password');
    }
  };

  const searchBus = () => {
    if (!databaseInitialized) {
      Alert.alert('Database not initialized');
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM buses03 WHERE busSource = ? AND busDestination = ?',
        [from, to],
        (_, result) => {
          if (result.rows.length > 0) {
            const bus = result.rows.item(0);
            setBus(bus);
          } else {
            setBus(null);
            Alert.alert('No bus found');
          }
        },
        (_, error) => {
          Alert.alert('Error searching for bus:', error.message);
        }
      );
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white', padding: 20 }}>
      {!isLoggedIn ? (
        <View>
          <Image
            source={require('../assets/login.png')}
            style={{ width: 350, height: 400, justifyContent: 'center'}}
            resizeMode="contain"
          />
          {/* <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Login</Text> */}
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={text => setUsername(text)}
            style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 5, backgroundColor: '#ffffff' }}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry
            style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 5 }}
          />
          <Button title="Login" onPress={handleLogin} 
            style={{ backgroundColor: 'black' }}
          />
        </View>
      ) : (
        <ScrollView>
          <View style={{ alignItems: 'center', paddingTop:80, display:'flex' }}>
            <Image
              source={require('./logo40.png')}
              style={{ width: 300, height: 250, marginBottom: 50 }}
              resizeMode="contain"
            />
            <View style={{ backgroundColor: '#0b1820', padding: 20, borderRadius: 5, width:300,height:200 }}>
              <TextInput
                placeholder="From address"
                value={from}
                onChangeText={text => setFrom(text)}
                style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 5, backgroundColor: '#ffffff' }}
              />
              <TextInput
                placeholder="To address"
                value={to}
                onChangeText={text => setTo(text)}
                style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 5, backgroundColor: '#ffffff' }}
              />
              <Button title="Submit" onPress={searchBus} />
            </View>
          </View>
          {bus && (
            <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
              <Text style={{ fontWeight: 'bold' }}>Bus Details:</Text>
              <Text>Bus Name: {bus.busName}</Text>
              <Text>Source: {bus.busSource}</Text>
              <Text>Destination: {bus.busDestination}</Text>
              <Text>Timings: {bus.busTimings}</Text>
              <Text>Travel Time: {bus.travelTime}</Text>
              <Text>Calculated Delay: {bus.calculatedDelay}</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default main;
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Onbording from './component/Onbording'
import Main from './component/Main';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  return (
    // <View style={styles.container}>
    //   <Onbording />
    //   <StatusBar style="auto" />
    // </View>

    <NavigationContainer>
      <Stack.Navigator
      screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen  name="Onbording" component={Onbording} />
        <Stack.Screen  name="Main" component={Main} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

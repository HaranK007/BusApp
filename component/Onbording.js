import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Animated, TouchableOpacity } from 'react-native'; // Import TouchableOpacity
import slides from "../slides";
import OnbordingItem from './OnbordingItem'
import Paginator from "./Paginator";

import { useNavigation } from '@react-navigation/native'

export default Onboarding = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(Number(viewableItems[0].item.id));
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      console.log('Last slide');
    }
  }

  useEffect(() => {
    setCurrentIndex(Number(slides[0].id));
  }, []);


  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={{ flex: 3 }}>
        <FlatList
          data={slides}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => <OnbordingItem item={item} />}
          horizontal
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={32}
          viewableItemChanged={viewableItemChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>

      <Paginator data={slides} scrollX={scrollX} />

      {/* Updated code for sign-in button */}
      <TouchableOpacity style={styles.signinContainer} onPress={()=>navigation.navigate('Main')}>
        <Text style={styles.signinText}>Sign In</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signinContainer: {
    position: 'absolute',
    bottom: 20,
    left: 280,
  },
  signinText: {
    fontSize: 25,
    backgroundColor: '#493d8a',
    color: 'white',
    borderRadius: 20,
    paddingBottom: 3,
    paddingLeft: 20,
    paddingRight: 20,
  },
});

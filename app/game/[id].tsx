// app/game/[id].tsx
import React, { useLayoutEffect, useState, useEffect, useRef } from "react";
import { View, StyleSheet, ScrollView, Alert, Platform } from "react-native";
import {
  Text,
  Button,
  Card,
  Title,
  Paragraph,
  ProgressBar,
} from "react-native-paper";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import useGameStore from "@/store/game/useGameStore";
import { Accelerometer } from "expo-sensors";

export default function GameDetailScreen() {
  const navigation = useNavigation();
  const [isAccelerometerAvailable, setIsAccelerometerAvailable] =
    useState(false);
  const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });
  const [movementCount, setMovementCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isJoined, setIsJoined] = useState(false);
  const subscriptionRef = useRef<any>(null);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const { id } = useLocalSearchParams();
  const { games, joinGame } = useGameStore();

  const game = games.find((g) => g.id === id);

  useEffect(() => {
    checkAccelerometerAvailability();
    return () => {
      stopAccelerometerTracking();
    };
  }, []);

  const checkAccelerometerAvailability = async () => {
    const isAvailable = await Accelerometer.isAvailableAsync();
    setIsAccelerometerAvailable(isAvailable);
  };

  const startAccelerometerTracking = () => {
    Accelerometer.setUpdateInterval(100); // Update every 100ms
    subscriptionRef.current = Accelerometer.addListener((accelerometerData) => {
      setData(accelerometerData);
      const magnitude = Math.sqrt(
        accelerometerData.x ** 2 +
          accelerometerData.y ** 2 +
          accelerometerData.z ** 2
      );
      if (magnitude > 1.2) {
        // Threshold for considering it a "step"
        setMovementCount((prevCount) => {
          const newCount = prevCount + 1;
          updateProgress(newCount);
          return newCount;
        });
      }
    });
  };

  const stopAccelerometerTracking = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
  };

  const updateProgress = (count: number) => {
    if (game) {
      const newProgress = Math.min(count / game.goal, 1);
      setProgress(newProgress);
    }
  };

  const handleJoinGame = () => {
    if (game) {
      joinGame(game.id);
      setIsJoined(true);
      if (game.category === "fitness" && game.unit === "steps") {
        startAccelerometerTracking();
      }
    }
  };

  if (!game) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Game not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Card>
          <Card.Cover source={{ uri: game.imageUrl }} />
          <Card.Content>
            <Title>{game.title}</Title>
            <Paragraph>{game.fullDescription}</Paragraph>
            <View style={styles.detailsContainer}>
              <Text style={styles.detailText}>Category: {game.category}</Text>
              <Text style={styles.detailText}>
                Goal: {game.goal} {game.unit}
              </Text>
              <Text style={styles.detailText}>
                Duration: {game.duration} days
              </Text>
              <Text style={styles.detailText}>Entry Fee: ${game.entryFee}</Text>
              <Text style={styles.detailText}>Prize: ${game.prize}</Text>
              <Text style={styles.detailText}>
                Participants: {game.participantCount}
              </Text>
              <Text style={styles.detailText}>
                Start Date: {new Date(game.startDate).toLocaleDateString()}
              </Text>
            </View>
          </Card.Content>
        </Card>
        {isJoined && game.category === "fitness" && game.unit === "steps" && (
          <View style={styles.progressContainer}>
            <Text>Movement Count: {movementCount}</Text>
            <ProgressBar progress={progress} style={styles.progressBar} />
            <Text>Progress: {Math.round(progress * 100)}%</Text>
            <Text>Accelerometer: (in gs where 1g = 9.81 m/s^2)</Text>
            <Text>
              x: {x.toFixed(2)}, y: {y.toFixed(2)}, z: {z.toFixed(2)}
            </Text>
          </View>
        )}
        <Button
          mode="contained"
          onPress={handleJoinGame}
          style={styles.joinButton}
          disabled={isJoined}
        >
          {isJoined ? "Joined" : "Join Challenge"}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  detailsContainer: {
    marginTop: 16,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
  },
  joinButton: {
    margin: 16,
  },
  progressContainer: {
    margin: 16,
  },
  progressBar: {
    height: 10,
    marginVertical: 8,
  },
});

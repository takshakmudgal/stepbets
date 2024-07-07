import React, { useLayoutEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Button, Card, Title, Paragraph } from "react-native-paper";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import useGameStore from "@/store/game/useGameStore";

export default function GameDetailScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const { id } = useLocalSearchParams();
  const { games, joinGame } = useGameStore();

  const game = games.find((g) => g.id === id);

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
        <Button
          mode="contained"
          onPress={() => joinGame(game.id)}
          style={styles.joinButton}
        >
          Join Challenge
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
});

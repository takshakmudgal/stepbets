import React, { useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Text, Card, Title, Paragraph, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import useGameStore from "@/store/game/useGameStore";
import { WageringGame } from "@/types/game";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2; // 48 is the total horizontal padding

export default function GamesScreen() {
  const router = useRouter();
  const { games, fetchGames, isLoading } = useGameStore();
  const theme = useTheme();

  useEffect(() => {
    fetchGames();
  }, []);

  const renderGameCard = ({ item }: { item: WageringGame }) => (
    <TouchableOpacity onPress={() => router.push(`/game/${item.id}`)}>
      <Card style={styles.card}>
        <Card.Cover source={{ uri: item.imageUrl }} style={styles.cardImage} />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.gradient}
        />
        <Card.Content style={styles.cardContent}>
          <Title style={styles.cardTitle}>{item.title}</Title>
          <Paragraph numberOfLines={2} style={styles.cardDescription}>
            {item.shortDescription}
          </Paragraph>
          <Text style={styles.prizeText}>Prize: ${item.prize}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.headerText}>
          Wagering Games
        </Text>
      </View>
      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={games}
          renderItem={renderGameCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    alignItems: "center",
  },
  headerText: {
    fontWeight: "bold",
  },
  listContent: {
    padding: 12,
  },
  card: {
    width: cardWidth,
    height: 200,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  cardImage: {
    height: 200,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 160,
  },
  cardContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  cardTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardDescription: {
    color: "white",
    fontSize: 12,
    marginTop: 4,
  },
  row: {
    justifyContent: "space-between",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  prizeText: {
    marginTop: 8,
    fontWeight: "bold",
    color: "#FFD700",
    fontSize: 14,
  },
});

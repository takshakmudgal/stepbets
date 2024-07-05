import { Stack } from "expo-router";
import { useNavigation } from "expo-router";
import { useLayoutEffect } from "react";

export default function AuthLayout() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}

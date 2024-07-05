#!/usr/bin/env node

/**
 * This script is used to reset the project to a blank state.
 * It moves the /app directory to /app-example and creates a new /app directory with an index.tsx and _layout.tsx file.
 * You can remove the `reset-project` script from package.json and safely delete this file after running it.
 */

import * as fs from "fs";
import * as path from "path";

const root: string = process.cwd();
const oldDirPath: string = path.join(root, "app");
const newDirPath: string = path.join(root, "app-example");
const newAppDirPath: string = path.join(root, "app");

const indexContent: string = `import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
`;

const layoutContent: string = `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
    </Stack>
  );
}
`;

fs.rename(oldDirPath, newDirPath, (error: NodeJS.ErrnoException | null) => {
  if (error) {
    return console.error(`Error renaming directory: ${error}`);
  }
  console.log("/app moved to /app-example.");

  fs.mkdir(
    newAppDirPath,
    { recursive: true },
    (error: NodeJS.ErrnoException | null) => {
      if (error) {
        return console.error(`Error creating new app directory: ${error}`);
      }
      console.log("New /app directory created.");

      const indexPath: string = path.join(newAppDirPath, "index.tsx");
      fs.writeFile(
        indexPath,
        indexContent,
        (error: NodeJS.ErrnoException | null) => {
          if (error) {
            return console.error(`Error creating index.tsx: ${error}`);
          }
          console.log("app/index.tsx created.");

          const layoutPath: string = path.join(newAppDirPath, "_layout.tsx");
          fs.writeFile(
            layoutPath,
            layoutContent,
            (error: NodeJS.ErrnoException | null) => {
              if (error) {
                return console.error(`Error creating _layout.tsx: ${error}`);
              }
              console.log("app/_layout.tsx created.");
            }
          );
        }
      );
    }
  );
});

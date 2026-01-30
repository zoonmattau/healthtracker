import { Stack } from 'expo-router';
import { colors } from '../../src/constants/theme';

export default function ProgramLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.primary },
        animation: 'slide_from_right',
      }}
    />
  );
}

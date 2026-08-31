import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';
import { View, Text } from 'react-native'

export default function Home() {
  const { colors } = useTheme();
  const {logout} = useUser();
  
  return (
    <View>
      <Text>home</Text>
    </View>
  )
}
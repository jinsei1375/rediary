import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';

export default function Index() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.container}>
        <Image
          source={require('@/assets/images/splash-icon.png')}
          style={styles.splashImage}
          resizeMode="cover"
        />
        <ActivityIndicator size="large" color="#FFFFFF" style={styles.loader} />
      </View>
    );
  }

  // 認証状態に応じてリダイレクト
  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5B8CFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  loader: {
    position: 'absolute',
    bottom: 100,
  },
});

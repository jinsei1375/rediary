import { StyleSheet, Text, View } from 'react-native';

export default function DiaryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>日記</Text>
      <Text style={styles.text}>日記の作成・編集画面</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
});

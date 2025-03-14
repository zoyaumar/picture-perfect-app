import { Image, StyleSheet, Platform, ScrollView, StatusBar, Button } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TaskListScreen } from '@/components/TaskList';

export default function Picture() {
  const today = new Date().toLocaleDateString();
  return (
    <ScrollView style={styles.scrollView}>
      <ThemedView style={[styles.titleContainer, styles.centering]}>
        <ThemedText style={styles.textStyle} type="title">Create Your Picture Perfect Day</ThemedText>
      </ThemedView>
      <ThemedView style={[styles.titleContainer, styles.centering]}>
        <ThemedText type="subtitle">{today}</ThemedText>
      </ThemedView>
      <TaskListScreen></TaskListScreen>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12
  },
  taskContainer: {
    gap: 8,
    padding: 12
  },
  centering: {
    justifyContent: 'center',
  },
  textStyle: {
    fontSize: 25
  },
  scrollView: {
    paddingTop: StatusBar.currentHeight
  }
});

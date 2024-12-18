import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useSQLiteContext } from '@/SQLiteProvider';
import TaskClient from '@/TaskClient';
import { Task } from '@/types';
import logger from '@/logger';
import type { ListRenderItem } from '@react-native/virtualized-lists';
import { router } from 'expo-router';
import globalStyles from '@/globalStyles';

const LandingPage = () => {
  const ctx = useSQLiteContext();
  const client = new TaskClient(ctx);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  const addTask = async () => {
    if (newTask.trim()) {
      await client.add(newTask.trim());
      setNewTask('');
    }
  };
  const prepareTasks = React.useCallback(async () => {
    if (newTask.length === 0) {
      logger.log('prepare tasks');
      setTasks(await client.tasks());
    }
  }, [newTask]);

  React.useEffect(() => {
    void prepareTasks();
  }, [prepareTasks]);

  const renderItem: ListRenderItem<Task> = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push(`/detail/${item.id}`)}
      style={globalStyles.taskItem}>
      <Text style={globalStyles.taskText}>{item.task}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      style={globalStyles.taskList}
      ListHeaderComponent={
        <View style={globalStyles.inputContainer}>
          <TextInput
            style={globalStyles.input}
            placeholder="Adicione um novo item a sua lista"
            value={newTask}
            onChangeText={setNewTask}
          />
          <TouchableOpacity
            style={globalStyles.addButton}
            onPress={addTask}>
            <Text style={globalStyles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      }
    />
  );
};

export default LandingPage;

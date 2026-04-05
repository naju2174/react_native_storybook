import AsyncStorage from '@react-native-async-storage/async-storage';
import { view } from './storybook.requires';
import { theme as lightTheme } from '@storybook/react-native';

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
  theme: lightTheme,
});

export default StorybookUIRoot;

import type { Meta, StoryObj } from '@storybook/react-native';
import { Accordion, AccordionGroup } from '../components/molecules/Accordion';
import { Text, View } from 'react-native';
import type { AccordionProps } from '../components/molecules/Accordion/Accordion.types';

const meta: Meta<AccordionProps> = {
  title: 'MOLECULES/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'responsive',
    },
  },
  decorators: [
    (Story) => (
      <View style={{ minWidth: 600, width: 600 }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<AccordionProps>;

export const Default: Story = {
  args: {
    title: 'What is React Native?',
    children:
      'React Native lets you build mobile apps using React. It renders native platform components, giving your app a truly native look and feel.',
  },
};

export const LongContent: Story = {
  args: {
    title: 'How does the accordion animate?',
    children:
      'The header uses a chevron icon that rotates 180° via Animated.timing on press. The body expands and collapses using LayoutAnimation.easeInEaseOut, which smoothly transitions the height without needing to measure the content manually.',
  },
};

export const ShortContent: Story = {
  args: {
    title: 'Quick answer',
    children: 'Yes.',
  },
};

export const MultipleItems: Story = {
  render: () => (
    <AccordionGroup
      items={[
        {
          title: 'What is Tailwind CSS?',
          children:
            'Tailwind CSS is a utility-first CSS framework that lets you build designs directly in your markup using small, composable class names.',
        },
        {
          title: 'What is NativeWind?',
          children:
            'NativeWind brings Tailwind CSS to React Native, letting you use className on native components with full utility class support.',
        },
        {
          title: 'Does this work on web?',
          children:
            'Yes — via react-native-web, NativeWind maps Tailwind utilities to CSS, so the same component renders correctly in both native and web environments.',
        },
      ]}
    />
  ),
};

export const WithCustomContent: Story = {
  args: {
    title: 'Custom rich content',
    children: (
      <View style={{ gap: 8 }}>
        <Text className="text-sm font-semibold text-gray-800">Key points:</Text>
        <Text className="text-sm text-gray-600">• Utility-first styling with Tailwind</Text>
        <Text className="text-sm text-gray-600">• Works on iOS, Android, and Web</Text>
        <Text className="text-sm text-gray-600">• Powered by NativeWind v4</Text>
      </View>
    ),
  },
};

import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { Input } from '../components/atoms/Input';
import type { InputProps } from '../components/atoms/Input/Input.types';

const meta: Meta<InputProps> = {
  title: 'ATOMS/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    color: {
      control: 'select',
      options: ['info', 'warning', 'success', 'error'],
    },
    rounded: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  render: (args) => (
    <View style={{ paddingHorizontal: 32, paddingVertical: 40, width: 400 }}>
      <Input {...args} />
    </View>
  ),
};

export default meta;
type Story = StoryObj<InputProps>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
    size: 'md',
    color: 'info',
  },
};

export const Small: Story = {
  args: {
    placeholder: 'Small input',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    placeholder: 'Large input',
    size: 'lg',
  },
};

export const Warning: Story = {
  args: {
    placeholder: 'Warning state',
    color: 'warning',
  },
};

export const Success: Story = {
  args: {
    placeholder: 'Success state',
    color: 'success',
  },
};

export const Error: Story = {
  args: {
    placeholder: 'Error state',
    color: 'error',
  },
};

export const Rounded: Story = {
  args: {
    placeholder: 'Rounded input',
    rounded: true,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
    value: 'Cannot edit this',
  },
};

export const WithPrefix: Story = {
  args: {
    placeholder: 'Search...',
    prefix: '🔍',
  },
};

export const WithSuffix: Story = {
  args: {
    placeholder: 'Enter amount',
    suffix: '$',
  },
};

export const WithPrefixAndSuffix: Story = {
  args: {
    placeholder: '0.00',
    prefix: '$',
    suffix: 'USD',
  },
};

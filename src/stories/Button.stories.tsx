import type { Meta, StoryObj } from '@storybook/react-native';
import { Button } from '../components/atoms/Button';
import type { ButtonProps } from '../components/atoms/Button/Button.types';

const meta: Meta<ButtonProps> = {
  title: 'ATOMS/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  args: { onClick: () => {} },
};

export default meta;
type Story = StoryObj<ButtonProps>;

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Button',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    label: 'Button',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Button',
  },
};

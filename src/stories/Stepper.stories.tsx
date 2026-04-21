import type { Meta, StoryObj } from '@storybook/react-native';
import { Stepper, StepperItem } from '../components/atoms/Stepper';
import type { StepperProps } from '../components/atoms/Stepper/Stepper.types';
import React from 'react';

const meta: Meta<StepperProps> = {
  title: 'ATOMS/Stepper',
  component: Stepper,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    orientation: {
      control: { type: 'radio' },
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the steps.',
      defaultValue: 'horizontal',
    },
    ghost: {
      control: 'boolean',
      description: '',
      defaultValue: false,
    },
    showCheckMark: {
      control: 'boolean',
      description: '',
      defaultValue: true,
    },
    showProgress: {
      control: 'boolean',
      description: '',
      defaultValue: false,
    },
    activeStep: {
      control: { type: 'number', min: 0, max: 10, step: 1 },
      description: 'The index of the active step.',
      defaultValue: 0,
    },
    percentage: {
      control: { type: 'number', min: 0, max: 100, step: 10 },
      description: 'The percentage for the progress bar from 1 to 100. It will works when we use showProgress as true',
      defaultValue: 0,
    },
    progressColor: { control: 'color' },
  },
  args: {
    activeStep: 0,
    orientation: 'horizontal',
    percentage: 0,
    progressColor: '#2563eb',
    ghost: false,
    showCheckMark: true,
    showProgress: false,
  },
  render: (args) => (
    <Stepper {...args}>
      <StepperItem label="Basic" description="This is a description." />
      <StepperItem label="Medical" description="This is a description." />
      <StepperItem label="Dental" description="This is a description." />
    </Stepper>
  ),
};

export default meta;
type Story = StoryObj<StepperProps>;

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
};

export const StepperWithoutLabel: Story = {
  render: (args) => (
    <Stepper {...args}>
      <StepperItem label="Basic" />
      <StepperItem label="Medical" />
      <StepperItem label="Dental" />
    </Stepper>
  ),
};

export const CheckedStepper: Story = {
  args: {
    activeStep: 1,
  },
};

export const GhostStepper: Story = {
  args: {
    ghost: true,
    activeStep: 0,
  },
};

export const StepperWithHorizontalProgressBar: Story = {
  args: {
    activeStep: 1,
    percentage: 70,
    showProgress: true,
  },
};

export const StepperWithVerticalProgressBar: Story = {
  args: {
    orientation: 'vertical',
    activeStep: 1,
    percentage: 70,
    showProgress: true,
  },
};

export const CustomProgressBar: Story = {
  args: {
    activeStep: 1,
    percentage: 70,
    showProgress: true,
    progressColor: '#10b981',
  },
};

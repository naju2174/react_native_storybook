import type { Meta, StoryObj } from '@storybook/react-native';
import { Page } from '../components/organisms/Page';

const meta: Meta<typeof Page> = {
  title: 'ORGANISMS/Page',
  component: Page,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

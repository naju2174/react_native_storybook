import type { Meta, StoryObj } from '@storybook/react-native';
import { Header } from '../components/Header';
import type { HeaderProps } from '../components/Header/Header.types';

const meta: Meta<HeaderProps> = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onLogin: () => {},
    onLogout: () => {},
    onCreateAccount: () => {},
  },
};

export default meta;
type Story = StoryObj<HeaderProps>;

export const LoggedIn: Story = {
  args: {
    user: {
      name: 'Jane Doe',
    },
  },
};

export const LoggedOut: Story = {};

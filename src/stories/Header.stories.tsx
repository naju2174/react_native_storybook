import type { Meta, StoryObj } from '@storybook/react-native';
import { Header } from '../components/molecules/Header';
import type { HeaderProps } from '../components/molecules/Header/Header.types';

const meta: Meta<HeaderProps> = {
  title: 'MOLECULES/Header',
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

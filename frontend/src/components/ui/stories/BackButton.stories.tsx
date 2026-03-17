import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import BackButton from '../BackButton';

const meta: Meta<typeof BackButton> = {
  title: 'UI/BackButton',
  component: BackButton,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  argTypes: {
    to: { control: 'text' },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof BackButton>;

export const Default: Story = {
  args: {
    to: '/events',
    label: 'Back to Events',
  },
};

export const Custom: Story = {
  args: {
    to: '/dashboard',
    label: 'Back to Dashboard',
  },
};
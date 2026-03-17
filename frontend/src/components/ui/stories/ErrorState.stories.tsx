import type { Meta, StoryObj } from '@storybook/react';
import ErrorState from '../ErrorState';

const meta: Meta<typeof ErrorState> = {
  title: 'UI/ErrorState',
  component: ErrorState,
  tags: ['autodocs'],
  argTypes: {
    message: { control: 'text' },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    fullScreen: { control: 'boolean' },
    showBackButton: { control: 'boolean' },
    onRetry: { action: 'retry' },
    onBack: { action: 'back' },
  },
};

export default meta;
type Story = StoryObj<typeof ErrorState>;

export const Default: Story = {
  args: {
    message: 'Something went wrong. Please try again.',
  },
};

export const WithRetry: Story = {
  args: {
    message: 'Failed to load events',
    onRetry: () => { },
  },
};

export const FullScreen: Story = {
  args: {
    message: 'Page not found',
    fullScreen: true,
  },
};
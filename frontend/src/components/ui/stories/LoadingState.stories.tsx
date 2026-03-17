import type { Meta, StoryObj } from '@storybook/react';
import LoadingState from '../LoadingState';

const meta: Meta<typeof LoadingState> = {
  title: 'UI/LoadingState',
  component: LoadingState,
  tags: ['autodocs'],
  argTypes: {
    message: { control: 'text' },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    fullScreen: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingState>;

export const Default: Story = {
  args: {
    message: 'Loading...',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    message: 'Loading small...',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    message: 'Loading large...',
  },
};

export const FullScreen: Story = {
  args: {
    fullScreen: true,
    message: 'Loading page...',
  },
};
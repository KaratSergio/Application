import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';
import { CalendarIcon } from '@heroicons/react/24/outline';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'join', 'leave', 'full', 'ended', 'disabled'],
    },
    size: {
      control: 'radio',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    fullWidth: { control: 'boolean' },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    size: 'md',
  },
};

export const Join: Story = {
  args: {
    children: 'Join Event',
    variant: 'join',
    size: 'md',
  },
};

export const Leave: Story = {
  args: {
    children: 'Leave Event',
    variant: 'leave',
    size: 'md',
  },
};

export const Full: Story = {
  args: {
    children: 'Event Full',
    variant: 'full',
    size: 'md',
  },
};

export const Ended: Story = {
  args: {
    children: 'Event Ended',
    variant: 'ended',
    size: 'md',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    variant: 'disabled',
    size: 'md',
  },
};

export const WithIcon: Story = {
  args: {
    children: 'With Icon',
    variant: 'primary',
    icon: <CalendarIcon />,
    iconPosition: 'left',
  },
};

export const Loading: Story = {
  args: {
    children: 'Loading...',
    variant: 'primary',
    loading: true,
  },
};
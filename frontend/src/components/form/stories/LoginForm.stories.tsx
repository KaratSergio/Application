import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../LoginForm';

const meta: Meta<typeof LoginForm> = {
  title: 'Form/LoginForm',
  component: LoginForm,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className="p-4 bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="max-w-md w-full">
            <Story />
          </div>
        </div>
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

export const Default: Story = {};

export const Interactive: Story = {
  render: () => (
    <div onSubmit={(e) => e.preventDefault()}>
      <LoginForm />
    </div>
  ),
};
import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterForm from '../RegisterForm';

const meta: Meta<typeof RegisterForm> = {
  title: 'Form/RegisterForm',
  component: RegisterForm,
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
type Story = StoryObj<typeof RegisterForm>;

export const Default: Story = {};

export const Interactive: Story = {
  render: () => (
    <div onSubmit={(e) => e.preventDefault()}>
      <RegisterForm />
    </div>
  ),
};
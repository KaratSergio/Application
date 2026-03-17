import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import DeleteConfirmation from '../DeleteConfirmation';

const meta: Meta<typeof DeleteConfirmation> = {
  title: 'UI/DeleteConfirmation',
  component: DeleteConfirmation,
  tags: ['autodocs'],
  argTypes: {
    eventTitle: { control: 'text' },
    onConfirm: { action: 'confirmed' },
    onCancel: { action: 'cancelled' },
    isDeleting: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div className="p-8 max-w-md mx-auto">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DeleteConfirmation>;

export const Default: Story = {
  args: {
    eventTitle: 'Tech Conference 2024',
    onConfirm: async () => { },
    onCancel: () => { },
    isDeleting: false,
  },
};

export const LongTitle: Story = {
  args: {
    eventTitle: 'International Web Development Workshop and Conference 2024',
    onConfirm: async () => { },
    onCancel: () => { },
    isDeleting: false,
  },
};

export const Deleting: Story = {
  args: {
    eventTitle: 'Tech Conference 2024',
    onConfirm: async () => { },
    onCancel: () => { },
    isDeleting: true,
  },
};

export const Interactive = {
  render: () => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);

    const handleConfirm = async () => {
      setIsDeleting(true);

      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsDeleting(false);
      setIsDeleted(true);

      setTimeout(() => setIsDeleted(false), 3000);
    };

    if (isDeleted) {
      return (
        <div className="text-center p-8 bg-green-50 rounded-lg">
          <p className="text-green-600 font-medium">Event successfully deleted!</p>
        </div>
      );
    }

    return (
      <DeleteConfirmation
        eventTitle="Tech Conference 2024"
        onConfirm={handleConfirm}
        onCancel={() => console.log('Cancelled')}
        isDeleting={isDeleting}
      />
    );
  },
};
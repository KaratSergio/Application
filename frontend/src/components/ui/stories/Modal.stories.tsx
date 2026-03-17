import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Modal from '../Modal';

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    title: { control: 'text' },
    maxWidth: { control: 'select', options: ['sm', 'md', 'lg', 'xl', '2xl'] },
    showCloseButton: { control: 'boolean' },
    onClose: { action: 'closed' },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: {
    isOpen: true,
    title: 'Modal Title',
    children: <p className="text-gray-600">This is modal content</p>,
    maxWidth: 'md',
    showCloseButton: true,
  },
};

export const Interactive = {
  render: (args: any) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Open Modal
        </button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          {args.children}
        </Modal>
      </div>
    );
  },
  args: {
    title: 'Interactive Modal',
    children: <p className="text-gray-600">Click outside or press ESC to close</p>,
  },
};
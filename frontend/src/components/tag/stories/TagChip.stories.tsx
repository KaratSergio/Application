import type { Meta, StoryObj } from '@storybook/react';
import TagChip from '../TagChip';

const meta: Meta<typeof TagChip> = {
  title: 'TAG/TagChip',
  component: TagChip,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: ['tech', 'music', 'art', 'business', 'sports', 'food', 'workshop', 'conference', 'networking', 'custom']
    },
    onRemove: { action: 'removed' },
  },
};

export default meta;
type Story = StoryObj<typeof TagChip>;

export const Tech: Story = {
  args: {
    name: 'tech',
  },
};

export const Music: Story = {
  args: {
    name: 'music',
  },
};

export const Art: Story = {
  args: {
    name: 'art',
  },
};

export const Business: Story = {
  args: {
    name: 'business',
  },
};

export const WithRemove: Story = {
  args: {
    name: 'tech',
    onRemove: () => { },
  },
};

export const CustomColor: Story = {
  args: {
    name: 'custom',
  },
};

export const AllTags: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <TagChip name="tech" />
      <TagChip name="music" />
      <TagChip name="art" />
      <TagChip name="business" />
      <TagChip name="sports" />
      <TagChip name="food" />
      <TagChip name="workshop" />
      <TagChip name="conference" />
      <TagChip name="networking" />
    </div>
  ),
};
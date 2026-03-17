import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import TagSelect from '../TagSelect';
import type { Tag } from '../../../services/tags/tags.types';

const mockTags: Tag[] = [
  { id: '1', name: 'tech' },
  { id: '2', name: 'music' },
  { id: '3', name: 'art' },
  { id: '4', name: 'business' },
  { id: '5', name: 'sports' },
  { id: '6', name: 'food' },
  { id: '7', name: 'workshop' },
  { id: '8', name: 'conference' },
  { id: '9', name: 'networking' },
];

const meta: Meta<typeof TagSelect> = {
  title: 'TAG/TagSelect',
  component: TagSelect,
  tags: ['autodocs'],
  parameters: {
    mockData: [
      {
        url: '/tags',
        method: 'GET',
        status: 200,
        response: mockTags,
      },
    ],
  },
  argTypes: {
    maxTags: { control: { type: 'number', min: 1, max: 10 } },
    error: { control: 'text' },
    isDisabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    label: { control: 'text' },
    showMaxTags: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof TagSelect>;

export const Default: Story = {
  args: {
    value: [],
    onChange: (tags) => console.log('Selected:', tags),
    placeholder: 'Select tags...',
  },
};

export const WithLabel: Story = {
  args: {
    value: [],
    onChange: (tags) => console.log('Selected:', tags),
    label: 'Event Tags',
    placeholder: 'Choose tags...',
  },
};

export const WithSelectedTags: Story = {
  args: {
    value: [mockTags[0], mockTags[2], mockTags[4]],
    onChange: (tags) => console.log('Selected:', tags),
    label: 'Event Tags',
  },
};

export const WithError: Story = {
  args: {
    value: [],
    onChange: (tags) => console.log('Selected:', tags),
    label: 'Event Tags',
    error: 'Maximum 5 tags allowed',
  },
};

export const Disabled: Story = {
  args: {
    value: [mockTags[0], mockTags[1]],
    onChange: (tags) => console.log('Selected:', tags),
    label: 'Event Tags',
    isDisabled: true,
  },
};

export const MaxTagsReached: Story = {
  args: {
    value: mockTags.slice(0, 5),
    onChange: (tags) => console.log('Selected:', tags),
    label: 'Event Tags',
    maxTags: 5,
  },
};

// Интерактивная история
export const Interactive = {
  render: (args: any) => {
    const [selected, setSelected] = useState<Tag[]>([]);
    return (
      <div className="space-y-4">
        <TagSelect
          {...args}
          value={selected}
          onChange={setSelected}
        />
        <div className="text-sm text-gray-600">
          Selected: {selected.map(t => t.name).join(', ') || 'none'}
        </div>
      </div>
    );
  },
  args: {
    label: 'Interactive Tag Select',
    placeholder: 'Choose tags...',
    maxTags: 5,
  },
};
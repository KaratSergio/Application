import { useId } from 'react';
import Select, { components } from 'react-select';
import type { MultiValue, StylesConfig, OptionProps, MultiValueProps } from 'react-select';
import { useTags } from '../../services/hooks/useTags';
import type { Tag } from '../../services/tags/tags.types';
import TagChip from './TagChip';

interface TagOption {
  value: string;
  label: string;
  tag: Tag;
}

interface TagSelectProps {
  value: Tag[];
  onChange: (tags: Tag[]) => void;
  maxTags?: number;
  error?: string;
  isDisabled?: boolean;
  placeholder?: string;
  label?: string;
  showMaxTags?: boolean;
}

const CustomMultiValue = (props: MultiValueProps<TagOption, true>) => {
  const { data, removeProps } = props;

  const handleRemove = () => {
    if (removeProps.onClick) {
      const mockEvent = {
        stopPropagation: () => { },
        preventDefault: () => { }
      } as React.MouseEvent<HTMLDivElement>;

      removeProps.onClick(mockEvent);
    }
  };

  return (
    <components.MultiValue {...props}>
      <TagChip
        name={data.label}
        onRemove={handleRemove}
      />
    </components.MultiValue>
  );
};

const CustomOption = (props: OptionProps<TagOption, true>) => {
  const { data, innerRef, innerProps, isDisabled } = props;
  return (
    <div
      ref={innerRef}
      {...innerProps}
      className={`cursor-pointer px-2 py-1 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <TagChip name={data.label} />
    </div>
  );
};

const customStyles: StylesConfig<TagOption, true> = {
  control: (base, state) => ({
    ...base,
    minHeight: '38px',
    borderColor: state.isFocused ? '#10b981' : '#e5e7eb',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(16, 185, 129, 0.2)' : 'none',
    '&:hover': {
      borderColor: '#10b981',
    },
    backgroundColor: '#f9fafb',
  }),
  multiValue: () => ({}),
  multiValueLabel: () => ({}),
  multiValueRemove: () => ({ display: 'none' }),
  option: (base, { isDisabled }) => ({
    ...base,
    backgroundColor: 'transparent',
    opacity: isDisabled ? 0.5 : 1,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    '&:hover': isDisabled ? {} : {
      backgroundColor: '#f3f4f6',
    },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  }),
  menuList: (base) => ({
    ...base,
    padding: '4px',
    maxHeight: '200px',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#9ca3af',
    fontSize: '0.875rem',
  }),
  noOptionsMessage: (base) => ({
    ...base,
    color: '#6b7280',
    fontSize: '0.875rem',
    padding: '16px',
  }),
  valueContainer: (base) => ({
    ...base,
    gap: '4px',
    padding: '2px 8px',
  }),
};

export default function TagSelect({
  value,
  onChange,
  maxTags = 5,
  error,
  isDisabled = false,
  placeholder = 'Search or select tags...',
  label,
  showMaxTags = true,
}: TagSelectProps) {
  const instanceId = useId();
  const { tags, isLoading } = useTags();

  const options: TagOption[] = tags.map(tag => ({
    value: tag.id,
    label: tag.name,
    tag,
  }));

  const selectedValues = value.map(tag => ({
    value: tag.id,
    label: tag.name,
    tag,
  }));

  const handleChange = (newValue: MultiValue<TagOption>) => {
    const selectedTags = newValue.map(v => v.tag);
    onChange(selectedTags);
  };

  const isOptionDisabled = () => value.length >= maxTags;

  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {label}
          {showMaxTags && (
            <span className="text-gray-400 ml-1">(optional, max {maxTags})</span>
          )}
        </label>
      )}

      <Select<TagOption, true>
        instanceId={instanceId}
        isMulti
        options={options}
        value={selectedValues}
        onChange={handleChange}
        isLoading={isLoading}
        isDisabled={isDisabled}
        placeholder={placeholder}
        styles={customStyles}
        noOptionsMessage={() => 'No tags found'}
        loadingMessage={() => 'Loading tags...'}
        isClearable={false}
        closeMenuOnSelect={false}
        blurInputOnSelect={false}
        maxMenuHeight={200}
        isOptionDisabled={isOptionDisabled}
        components={{
          MultiValue: CustomMultiValue,
          Option: CustomOption,
        }}
        hideSelectedOptions={true}
      />

      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}

      {value.length > 0 && (
        <p className="mt-1 text-xs text-gray-500">
          {value.length} / {maxTags} tags selected
        </p>
      )}
    </div>
  );
}
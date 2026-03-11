import * as yup from 'yup';

export const eventSchema = yup.object({
  title: yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
  description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters').max(500, 'Description cannot exceed 500 characters'),
  date: yup.string().required('Date is required'),
  time: yup.string().required('Time is required'),
  location: yup.string().required('Location is required').min(3, 'Location must be at least 3 characters'),
  capacity: yup
    .number()
    .transform((value) => isNaN(value) ? null : value)
    .nullable()
    .min(1, 'Capacity must be at least 1')
    .integer('Capacity must be a whole number')
    .defined(),
  visibility: yup
    .string()
    .oneOf(['public', 'private'])
    .required('Visibility is required')
    .defined(),
});

export type EventFormData = yup.InferType<typeof eventSchema>;
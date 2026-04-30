export interface ContactInfo {
  id: string;
  type: 'email' | 'phone' | 'address' | 'social';
  label: string;
  value: string;
  is_primary?: boolean;
  order: number;
}

export const contactData: ContactInfo[] = [
  {
    id: '1',
    type: 'email',
    label: 'Email',
    value: 'contact@kamlewa.org',
    is_primary: true,
    order: 1,
  },
  {
    id: '2',
    type: 'phone',
    label: 'Primary Phone',
    value: '+123 456 789',
    is_primary: true,
    order: 2,
  },
  {
    id: '3',
    type: 'phone',
    label: 'Secondary Phone',
    value: '+123 456 789',
    is_primary: false,
    order: 3,
  },
  {
    id: '4',
    type: 'address',
    label: 'Address',
    value: 'Yaoundé, Cameroon',
    is_primary: false,
    order: 4,
  },
];



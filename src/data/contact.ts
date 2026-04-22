export interface ContactInfo {
  id: string;
  type: 'email' | 'phone' | 'address' | 'social';
  label: string;
  value: string;
  isPrimary?: boolean;
  order: number;
}

export const contactData: ContactInfo[] = [
  {
    id: '1',
    type: 'email',
    label: 'Email',
    value: 'contact@kamlewa.com',
    isPrimary: true,
    order: 1,
  },
  {
    id: '2',
    type: 'phone',
    label: 'Primary Phone',
    value: '+123 456 789',
    isPrimary: true,
    order: 2,
  },
  {
    id: '3',
    type: 'phone',
    label: 'Secondary Phone',
    value: '+123 456 789',
    isPrimary: false,
    order: 3,
  },
  {
    id: '4',
    type: 'address',
    label: 'Address',
    value: 'Yaoundé, Cameroon',
    isPrimary: false,
    order: 4,
  },
];



export interface ContactInfo {
  id: string;
  type: 'email' | 'phone' | 'address' | 'social';
  label: string;
  value: string;
  is_primary?: boolean;
  display_order: number;
}

export const contactData: ContactInfo[] = [
  {
    id: '1',
    type: 'email',
    label: 'Email',
    value: 'contact@kamlewa.org',
    is_primary: true,
    display_order: 1,
  },
  {
    id: '2',
    type: 'phone',
    label: 'Primary Phone',
    value: '+237 653 906 594',
    is_primary: true,
    display_order: 2,
  },
  {
    id: '3',
    type: 'phone',
    label: 'Secondary Phone',
    value: '+237 671 317 500',
    is_primary: false,
    display_order: 3,
  },
  {
    id: '4',
    type: 'address',
    label: 'Address',
    value: 'Douala, Cameroon',
    is_primary: false,
    display_order: 4,
  },
];


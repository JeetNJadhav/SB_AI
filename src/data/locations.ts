export const locations = [
  {
    venue: 'Main Office',
    buildings: [
      {
        name: 'A',
        floors: [
          { number: '1', seats: Array.from({ length: 30 }, (_, i) => ({ id: i + 1, booked: Math.random() < 0.2 })) },
          { number: '2', seats: Array.from({ length: 40 }, (_, i) => ({ id: i + 1, booked: Math.random() < 0.2 })) },
          { number: '3', seats: Array.from({ length: 25 }, (_, i) => ({ id: i + 1, booked: Math.random() < 0.2 })) },
        ]
      },
      {
        name: 'B',
        floors: [
          { number: '1', seats: Array.from({ length: 35 }, (_, i) => ({ id: i + 1, booked: Math.random() < 0.2 })) },
          { number: '2', seats: Array.from({ length: 45 }, (_, i) => ({ id: i + 1, booked: Math.random() < 0.2 })) },
          { number: '3', seats: Array.from({ length: 20 }, (_, i) => ({ id: i + 1, booked: Math.random() < 0.2 })) },
          { number: '4', seats: Array.from({ length: 50 }, (_, i) => ({ id: i + 1, booked: Math.random() < 0.2 })) },
        ]
      }
    ]
  },
  {
    venue: 'Branch Office',
    buildings: [
      {
        name: 'C',
        floors: [
          { number: '1', seats: Array.from({ length: 15 }, (_, i) => ({ id: i + 1, booked: Math.random() < 0.2 })) },
          { number: '2', seats: Array.from({ length: 20 }, (_, i) => ({ id: i + 1, booked: Math.random() < 0.2 })) },
        ]
      }
    ]
  }
];
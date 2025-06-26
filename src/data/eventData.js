export const eventData = {
  wedding: {
    themes: ['Rustic Romance', 'Modern Elegance', 'Vintage Charm', 'Beach Bliss'],
    timeline: [
      { milestone: 'Venue Booking', daysBefore: 180 },
      { milestone: 'Send Invitations', daysBefore: 60 },
      { milestone: 'Catering Finalized', daysBefore: 30 },
      { milestone: 'Event Day', daysBefore: 0 },
    ],
    budgetCategories: [
      { category: 'Venue', amount: 5000 },
      { category: 'Catering', amount: 3000 },
      { category: 'Decorations', amount: 1000 },
      { category: 'Photography', amount: 2000 },
      { category: 'Entertainment', amount: 1500 },
    ],
    tasks: ['Book venue', 'Hire caterer', 'Send invitations'],
  },
  birthday: {
    themes: ['Superhero Bash', 'Enchanted Forest', 'Retro Disco', 'Tropical Fiesta'],
    timeline: [
      { milestone: 'Theme Selection', daysBefore: 30 },
      { milestone: 'Send Invitations', daysBefore: 14 },
      { milestone: 'Cake Order', daysBefore: 7 },
      { milestone: 'Event Day', daysBefore: 0 },
    ],
    budgetCategories: [
      { category: 'Venue', amount: 500 },
      { category: 'Food & Drinks', amount: 300 },
      { category: 'Decorations', amount: 200 },
      { category: 'Cake', amount: 100 },
      { category: 'Entertainment', amount: 200 },
    ],
    tasks: ['Choose theme', 'Order cake', 'Plan games'],
  },
  corporate: {
    themes: ['Tech Summit', 'Gala Night', 'Team Building Retreat', 'Product Launch'],
    timeline: [
      { milestone: 'Venue Booking', daysBefore: 90 },
      { milestone: 'Speaker Confirmation', daysBefore: 30 },
      { milestone: 'Send Invitations', daysBefore: 21 },
      { milestone: 'Event Day', daysBefore: 0 },
    ],
    budgetCategories: [
      { category: 'Venue', amount: 3000 },
      { category: 'Catering', amount: 2000 },
      { category: 'AV Equipment', amount: 1500 },
      { category: 'Speakers', amount: 2500 },
      { category: 'Marketing', amount: 1000 },
    ],
    tasks: ['Book speakers', 'Arrange AV', 'Promote event'],
  },
  concert: {
    themes: ['Rock Revival', 'Jazz Lounge', 'Pop Extravaganza', 'Classical Evening'],
    timeline: [
      { milestone: 'Artist Booking', daysBefore: 120 },
      { milestone: 'Ticket Sales Start', daysBefore: 60 },
      { milestone: 'Stage Setup', daysBefore: 7 },
      { milestone: 'Event Day', daysBefore: 0 },
    ],
    budgetCategories: [
      { category: 'Venue', amount: 4000 },
      { category: 'Artists', amount: 5000 },
      { category: 'Sound & Lighting', amount: 2000 },
      { category: 'Promotion', amount: 1500 },
      { category: 'Security', amount: 1000 },
    ],
    tasks: ['Book artists', 'Set up stage', 'Sell tickets'],
  },
};
import { Contact } from '@/lib/supabase';

// Demo contacts for development
export const demoContacts: Omit<Contact, 'id' | 'user_id' | 'created_at' | 'updated_at'>[] = [
  {
    first_name: 'Sarah',
    last_name: 'Chen',
    preferred_name: 'Sarah',
    phone_e164: '+1234567890',
    email: 'sarah.chen@techcorp.com',
    linkedin_url: 'https://linkedin.com/in/sarahchen',
    company: 'TechCorp',
    role: 'VP of Engineering',
    city: 'San Francisco',
    timezone: 'America/Los_Angeles',
    segment: 'TOP5',
    importance_score: 95,
    closeness_score: 90,
    frequency_days: 3,
    last_contacted_at: '2024-01-15T10:00:00Z',
    next_due_at: '2024-01-18T10:00:00Z',
    current_situation: 'Leading AI initiative',
    working_on: 'Machine learning platform',
    how_i_can_add_value: 'Product strategy insights',
    goals: 'Scale engineering team to 200+',
    interests: 'AI, hiking, wine tasting',
    notes: 'Former colleague from StartupX. Very influential in tech community.',
    tags: 'tech,ai,leadership'
  },
  {
    first_name: 'Michael',
    last_name: 'Rodriguez',
    preferred_name: 'Mike',
    phone_e164: '+1234567891',
    email: 'mike@growthcorp.com',
    company: 'GrowthCorp',
    role: 'CMO',
    city: 'Austin',
    segment: 'TOP5',
    importance_score: 88,
    closeness_score: 85,
    frequency_days: 3,
    last_contacted_at: '2024-01-14T15:30:00Z',
    next_due_at: '2024-01-17T15:30:00Z',
    current_situation: 'Expanding to new markets',
    working_on: 'Q1 marketing campaign',
    how_i_can_add_value: 'Growth hacking strategies',
    goals: 'Double customer acquisition',
    interests: 'Marketing, soccer, cooking',
    notes: 'Great connector. Always willing to make introductions.',
    tags: 'marketing,growth,connector'
  },
  {
    first_name: 'Emily',
    last_name: 'Thompson',
    phone_e164: '+1234567892',
    email: 'emily.thompson@designstudio.com',
    company: 'Design Studio',
    role: 'Creative Director',
    city: 'New York',
    segment: 'WEEKLY15',
    importance_score: 75,
    closeness_score: 80,
    frequency_days: 7,
    last_contacted_at: '2024-01-10T09:00:00Z',
    next_due_at: '2024-01-17T09:00:00Z',
    working_on: 'Rebranding project',
    how_i_can_add_value: 'UX research connections',
    interests: 'Design, photography, travel',
    notes: 'Exceptional designer. Could be valuable for future projects.',
  },
  {
    first_name: 'David',
    last_name: 'Kim',
    phone_e164: '+1234567893',
    email: 'david@venture.fund',
    linkedin_url: 'https://linkedin.com/in/davidkim',
    company: 'Venture Fund',
    role: 'Partner',
    city: 'Palo Alto',
    segment: 'WEEKLY15',
    importance_score: 85,
    closeness_score: 70,
    frequency_days: 7,
    last_contacted_at: '2024-01-08T14:00:00Z',
    next_due_at: '2024-01-15T14:00:00Z',
    current_situation: 'Raising new fund',
    working_on: 'Series A investments',
    how_i_can_add_value: 'Deal flow insights',
    goals: 'Deploy $100M fund',
    interests: 'VC, startups, tennis',
    notes: 'Key investor. Good relationship for funding opportunities.',
    tags: 'vc,funding,investor'
  },
  {
    first_name: 'Lisa',
    last_name: 'Wang',
    phone_e164: '+1234567894',
    email: 'lisa.wang@consultant.com',
    company: 'Strategic Consulting',
    role: 'Senior Consultant',
    city: 'Chicago',
    segment: 'MONTHLY100',
    importance_score: 60,
    closeness_score: 65,
    frequency_days: 30,
    last_contacted_at: '2023-12-20T11:00:00Z',
    next_due_at: '2024-01-19T11:00:00Z',
    working_on: 'Digital transformation projects',
    how_i_can_add_value: 'Technology introductions',
    interests: 'Consulting, yoga, reading',
    notes: 'Smart consultant. Could be valuable for enterprise connections.',
  },
  {
    first_name: 'James',
    last_name: 'Foster',
    phone_e164: '+1234567895',
    email: 'james@techstartup.com',
    company: 'TechStartup',
    role: 'Founder & CEO',
    city: 'Seattle',
    segment: 'WEEKLY15',
    importance_score: 80,
    closeness_score: 75,
    frequency_days: 7,
    last_contacted_at: '2024-01-12T16:00:00Z',
    next_due_at: '2024-01-19T16:00:00Z',
    current_situation: 'Post Series B growth',
    working_on: 'International expansion',
    how_i_can_add_value: 'Market entry strategies',
    goals: 'IPO in 3 years',
    interests: 'Startups, rock climbing, music',
    notes: 'Rising star in the startup ecosystem. Worth staying close to.',
    tags: 'startup,founder,ceo'
  }
];

// Function to generate contacts with current timestamps
export function generateDemoContactsWithTimestamps(): typeof demoContacts {
  const now = new Date();
  
  return demoContacts.map((contact, index) => {
    // Make some contacts overdue for demo purposes
    const isOverdue = index < 3;
    const lastContactDays = isOverdue ? contact.frequency_days + 2 : Math.floor(contact.frequency_days * 0.8);
    
    const lastContacted = new Date(now);
    lastContacted.setDate(lastContacted.getDate() - lastContactDays);
    
    const nextDue = new Date(lastContacted);
    nextDue.setDate(nextDue.getDate() + contact.frequency_days);
    
    return {
      ...contact,
      last_contacted_at: lastContacted.toISOString(),
      next_due_at: nextDue.toISOString()
    };
  });
}
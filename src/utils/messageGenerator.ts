import { Contact, EnergyLevel } from '@/lib/supabase';

interface MessageSuggestion {
  text: string;
  tone: 'warm' | 'professional' | 'casual';
}

/**
 * Generate AI-powered or rule-based message suggestions
 */
export async function generateMessageSuggestions(
  contact: Contact,
  energy: EnergyLevel = 'medium',
  language: 'en' | 'fr' = 'en'
): Promise<MessageSuggestion[]> {
  // Try OpenAI first if API key is available
  if (import.meta.env.VITE_OPENAI_API_KEY) {
    try {
      return await generateAISuggestions(contact, energy, language);
    } catch (error) {
      console.warn('AI generation failed, falling back to templates:', error);
    }
  }
  
  // Fallback to rule-based templates
  return generateTemplateSuggestions(contact, energy, language);
}

async function generateAISuggestions(
  contact: Contact,
  energy: EnergyLevel,
  language: 'en' | 'fr'
): Promise<MessageSuggestion[]> {
  const prompt = buildPrompt(contact, energy, language);
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates personalized, natural WhatsApp messages for staying in touch with contacts. Keep messages concise, warm, and authentic.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 300,
    }),
  });
  
  const data = await response.json();
  const suggestions = data.choices[0].message.content.split('\n').filter(Boolean);
  
  return suggestions.slice(0, 3).map((text, index) => ({
    text: text.replace(/^\d+\.\s*/, ''),
    tone: index === 0 ? 'warm' : index === 1 ? 'professional' : 'casual'
  }));
}

function generateTemplateSuggestions(
  contact: Contact,
  energy: EnergyLevel,
  language: 'en' | 'fr'
): MessageSuggestion[] {
  const name = contact.preferred_name || contact.first_name;
  const suggestions: MessageSuggestion[] = [];
  
  if (language === 'fr') {
    if (energy === 'low') {
      suggestions.push(
        {
          text: `Salut ${name} ! J'espère que tu vas bien. Je pensais à toi et voulais prendre de tes nouvelles. Comment ça se passe ?`,
          tone: 'warm'
        },
        {
          text: `Coucou ${name}, j'espère que tout va bien pour toi ! J'aimerais qu'on se rattrape bientôt.`,
          tone: 'casual'
        },
        {
          text: `${name}, j'espère que tu passes une excellente semaine ! Je t'envoie de bonnes ondes.`,
          tone: 'warm'
        }
      );
    } else if (energy === 'medium') {
      if (contact.working_on) {
        suggestions.push({
          text: `Salut ${name} ! Comment avance le projet ${contact.working_on} ? J'aimerais avoir des nouvelles quand tu auras un moment.`,
          tone: 'professional'
        });
      }
      
      if (contact.how_i_can_add_value) {
        suggestions.push({
          text: `Salut ${name} ! J'ai vu quelque chose d'intéressant sur ${contact.how_i_can_add_value} et j'ai pensé à toi. Ça te dit qu'on en parle autour d'un café ?`,
          tone: 'warm'
        });
      }
      
      suggestions.push({
        text: `${name}, je repensais à notre dernière conversation. Comment les choses ont-elles évolué ?`,
        tone: 'professional'
      });
    } else { // high energy
      suggestions.push(
        {
          text: `${name} ! J'aimerais vraiment qu'on se rattrape comme il faut. Tu es libre pour un appel de 15 min cette semaine ? J'ai des idées à partager avec toi.`,
          tone: 'professional'
        },
        {
          text: `Salut ${name}, je travaille sur quelque chose qui pourrait vraiment t'intéresser. Ça te dérange si je t'appelle rapidement pour t'en parler ?`,
          tone: 'professional'
        },
        {
          text: `${name}, j'espère que tu déchires tout ! J'aimerais qu'on programme un vrai rattrapage. Quand est-ce qui t'arrange le mieux ?`,
          tone: 'warm'
        }
      );
    }
  } else {
    // English templates (existing)
    if (energy === 'low') {
      suggestions.push(
        {
          text: `Hey ${name}! Hope you're doing well. Just thinking of you and wanted to check in. How are things going?`,
          tone: 'warm'
        },
        {
          text: `Hi ${name}, hope all is well with you! Would love to catch up soon.`,
          tone: 'casual'
        },
        {
          text: `${name}, hope you're having a great week! Sending good vibes your way.`,
          tone: 'warm'
        }
      );
    } else if (energy === 'medium') {
      if (contact.working_on) {
        suggestions.push({
          text: `Hey ${name}! How's the ${contact.working_on} project going? Would love to hear an update when you have a moment.`,
          tone: 'professional'
        });
      }
      
      if (contact.how_i_can_add_value) {
        suggestions.push({
          text: `Hi ${name}! I saw something interesting about ${contact.how_i_can_add_value} and thought of you. Want to share it over coffee sometime?`,
          tone: 'warm'
        });
      }
      
      suggestions.push({
        text: `${name}, been thinking about our last conversation. How have things been progressing?`,
        tone: 'professional'
      });
    } else { // high energy
      suggestions.push(
        {
          text: `${name}! Would love to catch up properly. Are you free for a 15-min call this week? I have some ideas I'd love to bounce off you.`,
          tone: 'professional'
        },
        {
          text: `Hey ${name}, I've been working on something that could be really relevant to you. Mind if I give you a quick call to share?`,
          tone: 'professional'
        },
        {
          text: `${name}, hope you're crushing it! I'd love to schedule a proper catch-up call. When works best for you?`,
          tone: 'warm'
        }
      );
    }
  }
  
  // Ensure we have 3 suggestions
  while (suggestions.length < 3) {
    suggestions.push({
      text: language === 'fr' ? `Salut ${name} ! Comment ça va ? J'aimerais qu'on se rattrape bientôt.` : `Hey ${name}! How are things going? Would love to catch up soon.`,
      tone: 'casual'
    });
  }
  
  return suggestions.slice(0, 3);
}

function buildPrompt(contact: Contact, energy: EnergyLevel, language: 'en' | 'fr'): string {
  const name = contact.preferred_name || contact.first_name;
  const context = [
    `Name: ${name}`,
    contact.working_on && `Working on: ${contact.working_on}`,
    contact.current_situation && `Current situation: ${contact.current_situation}`,
    contact.how_i_can_add_value && `How I can add value: ${contact.how_i_can_add_value}`,
    contact.company && `Company: ${contact.company}`,
    contact.role && `Role: ${contact.role}`,
  ].filter(Boolean).join('\n');
  
  const energyInstructions = {
    low: 'Generate a short, friendly check-in message (1-2 sentences). Keep it light and caring.',
    medium: 'Generate a message that offers value or asks about their current projects. Show genuine interest.',
    high: 'Generate a message proposing a specific action like a call or meeting. Be direct but warm.'
  };
  
  const languageInstruction = language === 'fr' 
    ? 'Generate messages in French. Use informal "tu" form and natural French expressions.'
    : 'Generate messages in English.';

  return `Generate 3 personalized WhatsApp messages for staying in touch with this contact:

${context}

Energy level: ${energy}
Instructions: ${energyInstructions[energy]}

Requirements:
- ${languageInstruction}
- Keep messages natural and conversational
- Avoid being salesy or overly formal
- Make it sound like it's from a friend who genuinely cares
- Each message should be different in approach
- Number each message (1, 2, 3)`;
}
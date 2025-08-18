import { useState } from 'react';
import { Contact, EnergyLevel } from '@/lib/supabase';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SegmentBadge } from './SegmentBadge';
import { EnergySelector } from './EnergySelector';
import { LanguageSelector } from './LanguageSelector';
import { generateMessageSuggestions } from '@/utils/messageGenerator';
import { openWhatsApp } from '@/utils/whatsapp';
import { MessageSquare, Clock, CheckCircle, SkipForward, ZapOff } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ContactCardProps {
  contact: Contact;
  onMarkSent: (contactId: string, message: string) => void;
  onSnooze: (contactId: string) => void;
  onSkip: (contactId: string) => void;
}

export function ContactCard({ contact, onMarkSent, onSnooze, onSkip }: ContactCardProps) {
  const [energy, setEnergy] = useState<EnergyLevel>('medium');
  const [language, setLanguage] = useState<'en' | 'fr'>('en');
  const [suggestions, setSuggestions] = useState<Array<{text: string; tone: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string>('');

  const loadSuggestions = async () => {
    setIsLoading(true);
    try {
      const generated = await generateMessageSuggestions(contact, energy, language);
      setSuggestions(generated);
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnergyChange = async (newEnergy: EnergyLevel) => {
    setEnergy(newEnergy);
    setSuggestions([]); // Reset suggestions
    setSelectedSuggestion('');
  };

  const handleSendWhatsApp = (message: string) => {
    if (!contact.phone_e164) {
      alert('No phone number available for this contact');
      return;
    }
    
    setSelectedSuggestion(message);
    openWhatsApp(contact.phone_e164, message);
  };

  const handleMarkSent = () => {
    onMarkSent(contact.id, selectedSuggestion);
  };

  const name = contact.preferred_name || contact.first_name;
  const isOverdue = contact.next_due_at && new Date(contact.next_due_at) < new Date();
  const lastContactedText = contact.last_contacted_at 
    ? formatDistanceToNow(new Date(contact.last_contacted_at), { addSuffix: true })
    : 'Never';

  return (
    <Card className="contact-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              {name}
              {contact.last_name && contact.preferred_name !== `${contact.first_name} ${contact.last_name}` && (
                <span className="text-gray-500 ml-1">({contact.last_name})</span>
              )}
            </h3>
            {contact.company && contact.role && (
              <p className="text-sm text-gray-600">{contact.role} at {contact.company}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            <SegmentBadge segment={contact.segment} />
            {isOverdue && (
              <Badge variant="destructive" className="text-xs">
                Overdue
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {contact.working_on && (
            <Badge variant="outline" className="text-xs">
              Working on: {contact.working_on}
            </Badge>
          )}
          {contact.how_i_can_add_value && (
            <Badge variant="secondary" className="text-xs">
              Value: {contact.how_i_can_add_value}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Last contact: {lastContactedText}
          </div>
          <div className="flex items-center gap-2">
            <EnergySelector 
              value={energy} 
              onChange={handleEnergyChange}
            />
            <LanguageSelector 
              language={language} 
              onLanguageChange={setLanguage} 
            />
          </div>
        </div>

        {/* Message Suggestions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">Message Suggestions</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={loadSuggestions}
              disabled={isLoading}
              className="text-xs"
            >
              {isLoading ? 'Generating...' : 'Refresh'}
            </Button>
          </div>
          
          {suggestions.length > 0 && (
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors"
                >
                  <p className="text-sm text-gray-800 mb-2">{suggestion.text}</p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-xs capitalize">
                      {suggestion.tone}
                    </Badge>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleSendWhatsApp(suggestion.text)}
                      disabled={!contact.phone_e164}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Send on WhatsApp
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2 border-t">
          <Button
            variant="default"
            size="sm"
            onClick={handleMarkSent}
            disabled={!selectedSuggestion}
            className="flex-1 bg-success hover:bg-success-light"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Mark Sent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSnooze(contact.id)}
            className="flex-1"
          >
            <ZapOff className="w-4 h-4 mr-1" />
            Snooze
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSkip(contact.id)}
            className="flex-1 text-gray-500"
          >
            <SkipForward className="w-4 h-4 mr-1" />
            Skip
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
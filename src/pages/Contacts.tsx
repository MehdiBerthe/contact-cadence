import { useState } from 'react';
import { useContacts } from '@/hooks/useContacts';
import { SegmentBadge } from '@/components/SegmentBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, User, Phone, Mail, Linkedin, Building2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Contacts() {
  const { contacts, loading } = useContacts();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchTerm.toLowerCase();
    return (
      contact.first_name.toLowerCase().includes(searchLower) ||
      contact.last_name.toLowerCase().includes(searchLower) ||
      (contact.preferred_name?.toLowerCase().includes(searchLower)) ||
      (contact.company?.toLowerCase().includes(searchLower)) ||
      (contact.role?.toLowerCase().includes(searchLower))
    );
  });

  const segmentCounts = {
    TOP5: contacts.filter(c => c.segment === 'TOP5').length,
    WEEKLY15: contacts.filter(c => c.segment === 'WEEKLY15').length,
    MONTHLY100: contacts.filter(c => c.segment === 'MONTHLY100').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="grid gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-muted rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Contacts</h1>
          <p className="text-gray-600">Manage your network and relationships</p>
          
          {/* Stats */}
          <div className="flex gap-4 mt-4">
            <Badge variant="outline" className="segment-top5">
              Top 5: {segmentCounts.TOP5}
            </Badge>
            <Badge variant="outline" className="segment-weekly15">
              Weekly 15: {segmentCounts.WEEKLY15}
            </Badge>
            <Badge variant="outline" className="segment-monthly100">
              Monthly 100: {segmentCounts.MONTHLY100}
            </Badge>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search contacts by name, company, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contacts Grid */}
        <div className="grid gap-4">
          {filteredContacts.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm ? 'No contacts found' : 'No contacts yet'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm 
                    ? 'Try adjusting your search terms'
                    : 'Import your contacts to get started'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredContacts.map((contact) => {
              const name = contact.preferred_name || `${contact.first_name} ${contact.last_name}`;
              const lastContactedText = contact.last_contacted_at 
                ? formatDistanceToNow(new Date(contact.last_contacted_at), { addSuffix: true })
                : 'Never';
              const isOverdue = contact.next_due_at && new Date(contact.next_due_at) < new Date();
              
              return (
                <Card key={contact.id} className="contact-card">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                            {contact.first_name[0]}{contact.last_name[0]}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{name}</h3>
                            {contact.company && contact.role && (
                              <p className="text-sm text-gray-600">
                                {contact.role} at {contact.company}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Contact Info */}
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                          {contact.phone_e164 && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              {contact.phone_e164}
                            </div>
                          )}
                          {contact.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              {contact.email}
                            </div>
                          )}
                          {contact.linkedin_url && (
                            <div className="flex items-center gap-2">
                              <Linkedin className="w-4 h-4" />
                              LinkedIn
                            </div>
                          )}
                          {contact.city && (
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4" />
                              {contact.city}
                            </div>
                          )}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {contact.working_on && (
                            <Badge variant="outline" className="text-xs">
                              {contact.working_on}
                            </Badge>
                          )}
                          {contact.how_i_can_add_value && (
                            <Badge variant="secondary" className="text-xs">
                              {contact.how_i_can_add_value}
                            </Badge>
                          )}
                        </div>

                        {/* Last Contact */}
                        <p className="text-xs text-gray-500">
                          Last contact: {lastContactedText}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <SegmentBadge segment={contact.segment} />
                        {isOverdue && (
                          <Badge variant="destructive" className="text-xs">
                            Overdue
                          </Badge>
                        )}
                        <div className="text-right text-xs text-gray-500">
                          Score: {contact.importance_score}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
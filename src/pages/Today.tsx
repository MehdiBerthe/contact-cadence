import { ContactCard } from '@/components/ContactCard';
import { useContacts } from '@/hooks/useContacts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Calendar, Users, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Today() {
  const { dueContacts, loading, error, markContactSent, snoozeContact, skipContact, refreshContacts } = useContacts();
  const { toast } = useToast();

  const handleMarkSent = async (contactId: string, message: string) => {
    try {
      await markContactSent(contactId, message);
      toast({
        title: "Contact updated",
        description: "Message marked as sent and next contact scheduled.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update contact. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSnooze = async (contactId: string) => {
    try {
      await snoozeContact(contactId);
      toast({
        title: "Contact snoozed",
        description: "Contact will appear in your queue later.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to snooze contact. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSkip = async (contactId: string) => {
    try {
      await skipContact(contactId);
      toast({
        title: "Contact skipped",
        description: "Contact moved to next scheduled date.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to skip contact. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="grid gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-muted rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">Error loading contacts: {error}</p>
              <Button onClick={refreshContacts} className="mt-4">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Today's Connections</h1>
              <p className="text-blue-100">{today}</p>
            </div>
            <Button
              variant="secondary"
              onClick={refreshContacts}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{dueContacts.length}</p>
                  <p className="text-sm text-muted-foreground">Due Today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Users className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-sm text-muted-foreground">Daily Capacity</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {dueContacts.filter(c => c.next_due_at && new Date(c.next_due_at) < new Date()).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        {dueContacts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-success/10 rounded-full">
                  <Calendar className="w-8 h-8 text-success" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">All caught up!</h2>
                  <p className="text-gray-600">No contacts due for outreach today. Great job staying on top of your network!</p>
                </div>
                <Badge variant="secondary" className="mt-2">
                  ✨ Inbox Zero
                </Badge>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Contacts to Reach Out ({dueContacts.length})
              </h2>
              <Badge variant="outline">
                Daily capacity: {dueContacts.length}/8
              </Badge>
            </div>
            
            <div className="grid gap-6">
              {dueContacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onMarkSent={handleMarkSent}
                  onSnooze={handleSnooze}
                  onSkip={handleSkip}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Clock, 
  Users, 
  MessageSquare,
  Globe
} from 'lucide-react';

export default function Settings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    dailyCapacity: 8,
    timezone: 'America/New_York',
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    notificationsEnabled: true,
    reminderTime1: '09:00',
    reminderTime2: '18:00',
    defaultTone: 'warm',
    defaultEnergy: 'medium'
  });

  const handleSave = () => {
    // TODO: Save settings to database
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleEnableNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setSettings(prev => ({ ...prev, notificationsEnabled: true }));
        toast({
          title: "Notifications enabled",
          description: "You'll receive reminders when contacts are due.",
        });
      } else {
        toast({
          title: "Notifications blocked",
          description: "Please enable notifications in your browser settings.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Configure your contact management preferences</p>
        </div>

        <div className="grid gap-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dailyCapacity">Daily Capacity</Label>
                  <Input
                    id="dailyCapacity"
                    type="number"
                    min="1"
                    max="20"
                    value={settings.dailyCapacity}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      dailyCapacity: parseInt(e.target.value) || 8 
                    }))}
                  />
                  <p className="text-sm text-gray-600">
                    Maximum contacts to reach out to per day
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, timezone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Europe/Paris">Paris</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications" className="text-base font-medium">
                    Push Notifications
                  </Label>
                  <p className="text-sm text-gray-600">
                    Get reminded when contacts are due for outreach
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.notificationsEnabled}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleEnableNotifications();
                    } else {
                      setSettings(prev => ({ ...prev, notificationsEnabled: false }));
                    }
                  }}
                />
              </div>

              {settings.notificationsEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="reminder1">Morning Reminder</Label>
                    <Input
                      id="reminder1"
                      type="time"
                      value={settings.reminderTime1}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        reminderTime1: e.target.value 
                      }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reminder2">Evening Reminder</Label>
                    <Input
                      id="reminder2"
                      type="time"
                      value={settings.reminderTime2}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        reminderTime2: e.target.value 
                      }))}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quiet Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Quiet Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="quietStart">Quiet Hours Start</Label>
                  <Input
                    id="quietStart"
                    type="time"
                    value={settings.quietHoursStart}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      quietHoursStart: e.target.value 
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quietEnd">Quiet Hours End</Label>
                  <Input
                    id="quietEnd"
                    type="time"
                    value={settings.quietHoursEnd}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      quietHoursEnd: e.target.value 
                    }))}
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                No notifications will be sent during these hours
              </p>
            </CardContent>
          </Card>

          {/* Message Defaults */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Message Defaults
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="defaultTone">Default Tone</Label>
                  <Select
                    value={settings.defaultTone}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, defaultTone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warm">Warm</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultEnergy">Default Energy Level</Label>
                  <Select
                    value={settings.defaultEnergy}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, defaultEnergy: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Quick check-in</SelectItem>
                      <SelectItem value="medium">Medium - Share value</SelectItem>
                      <SelectItem value="high">High - Propose call</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Segment Targets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Segment Targets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Top 5</h4>
                    <p className="text-sm text-gray-600">Your most important contacts (3-day cadence)</p>
                  </div>
                  <Badge className="segment-top5">5 contacts</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Weekly 15</h4>
                    <p className="text-sm text-gray-600">Regular important contacts (7-day cadence)</p>
                  </div>
                  <Badge className="segment-weekly15">15 contacts</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Monthly 100</h4>
                    <p className="text-sm text-gray-600">Broader network (30-day cadence)</p>
                  </div>
                  <Badge className="segment-monthly100">100 contacts</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary-dark">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
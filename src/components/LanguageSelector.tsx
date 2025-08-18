import { Button } from './ui/button';

interface LanguageSelectorProps {
  language: 'en' | 'fr';
  onLanguageChange: (language: 'en' | 'fr') => void;
}

export function LanguageSelector({ language, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
      <Button
        variant={language === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onLanguageChange('en')}
        className="h-7 px-3 text-xs font-medium"
      >
        EN
      </Button>
      <Button
        variant={language === 'fr' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onLanguageChange('fr')}
        className="h-7 px-3 text-xs font-medium"
      >
        FR
      </Button>
    </div>
  );
}
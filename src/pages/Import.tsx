import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export default function Import() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importResults, setImportResults] = useState<{
    imported: number;
    skipped: number;
    errors: string[];
  } | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setImportStatus('idle');
      setImportResults(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setImportStatus('idle');

    try {
      // For now, simulate import process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setImportResults({
        imported: 23,
        skipped: 2,
        errors: ['Row 5: Missing phone number', 'Row 12: Invalid email format']
      });
      setImportStatus('success');
    } catch (error) {
      setImportStatus('error');
    } finally {
      setImporting(false);
    }
  };

  const expectedColumns = [
    'first_name', 'last_name', 'preferred_name', 'email', 'phone', 
    'linkedin_url', 'company', 'role', 'city', 'segment', 
    'importance_score', 'closeness_score', 'current_situation', 
    'working_on', 'how_i_can_add_value', 'goals', 'interests', 'notes'
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Import Contacts</h1>
          <p className="text-gray-600">Upload a CSV file to import your contacts</p>
        </div>

        <div className="grid gap-6">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload CSV File
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-900">
                    Choose your CSV file
                  </p>
                  <p className="text-gray-600">
                    Upload a CSV file with your contact information
                  </p>
                </div>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="mt-4 max-w-xs mx-auto"
                />
              </div>

              {file && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-600">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleImport}
                    disabled={importing}
                    className="bg-primary hover:bg-primary-dark"
                  >
                    {importing ? 'Importing...' : 'Import Contacts'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Expected Format */}
          <Card>
            <CardHeader>
              <CardTitle>Expected CSV Format</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Your CSV file should include the following columns (not all are required):
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {expectedColumns.map((column) => (
                  <Badge key={column} variant="outline" className="text-xs">
                    {column}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Required fields:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <code>first_name</code> and <code>last_name</code></li>
                  <li>• <code>segment</code> (TOP5, WEEKLY15, or MONTHLY100)</li>
                  <li>• At least one contact method (<code>phone</code> or <code>email</code>)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Import Results */}
          {importResults && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {importStatus === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  Import Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {importResults.imported}
                    </p>
                    <p className="text-sm text-green-800">Contacts Imported</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">
                      {importResults.skipped}
                    </p>
                    <p className="text-sm text-yellow-800">Contacts Skipped</p>
                  </div>
                </div>

                {importResults.errors.length > 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <p className="font-medium">Import warnings:</p>
                        {importResults.errors.map((error, index) => (
                          <p key={index} className="text-sm">{error}</p>
                        ))}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2">
                  <Button 
                    variant="default"
                    onClick={() => window.location.href = '/contacts'}
                    className="flex-1"
                  >
                    View Imported Contacts
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setFile(null);
                      setImportResults(null);
                      setImportStatus('idle');
                    }}
                    className="flex-1"
                  >
                    Import More
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
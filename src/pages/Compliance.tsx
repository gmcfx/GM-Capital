import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, FileText, Upload, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const Compliance = () => {
  const { settings } = useSettings();

  const complianceItems = [
    {
      id: 'kyc',
      title: 'Know Your Customer (KYC)',
      description: 'Identity verification and documentation',
      status: settings.kycStatus === 'verified' ? 'completed' : 'pending',
      required: true,
      documents: ['Government ID', 'Proof of Address', 'Selfie Verification']
    },
    {
      id: 'aml',
      title: 'Anti-Money Laundering (AML)',
      description: 'Source of funds verification',
      status: 'completed',
      required: true,
      documents: ['Bank Statement', 'Employment Letter']
    },
    {
      id: 'tax',
      title: 'Tax Compliance',
      description: 'Tax identification and reporting',
      status: 'pending',
      required: false,
      documents: ['Tax ID Number', 'Tax Residency Certificate']
    },
    {
      id: 'pep',
      title: 'PEP Declaration',
      description: 'Politically Exposed Person screening',
      status: 'completed',
      required: true,
      documents: ['PEP Declaration Form']
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'rejected': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      default: return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-green-500/30 bg-green-900/10';
      case 'pending': return 'border-yellow-500/30 bg-yellow-900/10';
      case 'rejected': return 'border-red-500/30 bg-red-900/10';
      default: return 'border-slate-600';
    }
  };

  const completedItems = complianceItems.filter(item => item.status === 'completed').length;
  const totalItems = complianceItems.length;
  const completionPercentage = (completedItems / totalItems) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-2 sm:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 pt-16 sm:pt-0">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6 px-2">
          <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent break-words">
              Compliance Center
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Regulatory compliance and document management
            </p>
          </div>
        </div>

        {/* Compliance Overview */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              Compliance Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Overall Completion</span>
                <span className="text-white font-semibold">{completedItems}/{totalItems} Items</span>
              </div>
              <Progress value={completionPercentage} className="h-3" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">{completedItems}</div>
                  <div className="text-xs text-slate-400">Completed</div>
                </div>
                <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">{totalItems - completedItems}</div>
                  <div className="text-xs text-slate-400">Pending</div>
                </div>
                <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">{Math.round(completionPercentage)}%</div>
                  <div className="text-xs text-slate-400">Complete</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Items */}
        <div className="grid gap-4">
          {complianceItems.map((item) => (
            <Card key={item.id} className={`bg-slate-800/50 border-slate-700 backdrop-blur-sm ${getStatusColor(item.status)}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(item.status)}
                    <div>
                      <h3 className="text-white font-semibold flex items-center gap-2">
                        {item.title}
                        {item.required && (
                          <Badge variant="outline" className="text-red-400 border-red-400 text-xs">
                            Required
                          </Badge>
                        )}
                      </h3>
                      <p className="text-slate-400 text-sm mt-1">{item.description}</p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${
                      item.status === 'completed' 
                        ? 'text-green-400 border-green-400'
                        : item.status === 'pending'
                        ? 'text-yellow-400 border-yellow-400'
                        : 'text-red-400 border-red-400'
                    }`}
                  >
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-300">Required Documents:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {item.documents.map((doc, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-slate-700/30 rounded text-sm">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300">{doc}</span>
                        {item.status === 'completed' && (
                          <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {item.status !== 'completed' && (
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Documents
                    </Button>
                    <Button size="sm" variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
                      View Requirements
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Compliance;
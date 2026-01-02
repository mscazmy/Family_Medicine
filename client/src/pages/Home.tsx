import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight, Search, BookOpen, AlertCircle, CheckCircle2, Stethoscope } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Algorithm {
  id: string;
  title: string;
  description: string;
  mainComplaints: string[];
  [key: string]: any;
}

export default function Home() {
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/algorithms.json')
      .then(res => res.json())
      .then(data => {
        setAlgorithms(data.algorithms);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading algorithms:', err);
        setLoading(false);
      });
  }, []);

  const filteredAlgorithms = algorithms.filter(algo =>
    algo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    algo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    algo.mainComplaints.some(complaint => complaint.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Stethoscope className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-pulse" />
          <p className="text-slate-600">Loading clinical guidelines...</p>
        </div>
      </div>
    );
  }

  if (selectedAlgorithm) {
    return <AlgorithmDetail algorithm={selectedAlgorithm} onBack={() => setSelectedAlgorithm(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-4">
            <Stethoscope className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">Clinical Guidelines</h1>
          </div>
          <p className="text-slate-600 text-lg">Interactive diagnostic and treatment algorithms for family medicine</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="Search by complaint, condition, or symptom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-6 text-base border-slate-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Algorithm Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlgorithms.length > 0 ? (
            filteredAlgorithms.map((algo) => (
              <Card
                key={algo.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-blue-300 group"
                onClick={() => setSelectedAlgorithm(algo)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-slate-900 group-hover:text-blue-600 transition-colors">
                        {algo.title}
                      </CardTitle>
                      <CardDescription className="text-slate-600 mt-2">
                        {algo.description}
                      </CardDescription>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors mt-1" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-700">Common Complaints:</p>
                    <div className="flex flex-wrap gap-2">
                      {algo.mainComplaints.slice(0, 3).map((complaint, idx) => (
                        <span
                          key={idx}
                          className="inline-block bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full border border-blue-200"
                        >
                          {complaint}
                        </span>
                      ))}
                      {algo.mainComplaints.length > 3 && (
                        <span className="inline-block text-xs text-slate-500 px-2.5 py-1">
                          +{algo.mainComplaints.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 text-lg">No algorithms found matching your search.</p>
              <p className="text-slate-500 text-sm mt-2">Try a different search term or browse all guidelines.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function AlgorithmDetail({ algorithm, onBack }: { algorithm: Algorithm; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            ← Back to Guidelines
          </Button>
          <h1 className="text-3xl font-bold text-slate-900">{algorithm.title}</h1>
          <p className="text-slate-600 mt-2">{algorithm.description}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-white border border-slate-200">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
            <TabsTrigger value="exam">Physical Exam</TabsTrigger>
            <TabsTrigger value="investigations">Investigations</TabsTrigger>
            <TabsTrigger value="treatment">Treatment</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Main Complaints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {algorithm.mainComplaints?.map((complaint: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{complaint}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Diagnosis Tab */}
          <TabsContent value="diagnosis" className="space-y-6">
            {algorithm.cardiacCauses && (
              <Card>
                <CardHeader>
                  <CardTitle>Cardiac Causes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {algorithm.cardiacCauses.map((cause: any, idx: number) => (
                      <div key={idx} className="border-l-4 border-red-500 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900">{cause.name}</h4>
                        <p className="text-slate-600 text-sm mt-1">{cause.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {algorithm.classification && (
              <Card>
                <CardHeader>
                  <CardTitle>Classification</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {algorithm.classification.map((cls: any, idx: number) => (
                      <div key={idx}>
                        <h4 className="font-semibold text-slate-900 mb-3">{cls.type}</h4>
                        <p className="text-sm text-slate-600 mb-3">Duration: {cls.duration}</p>
                        {cls.cardiacCauses && (
                          <div className="mb-4">
                            <p className="text-sm font-semibold text-slate-700 mb-2">Cardiac Causes:</p>
                            <ul className="space-y-1">
                              {cls.cardiacCauses.map((cause: string, i: number) => (
                                <li key={i} className="text-sm text-slate-600 ml-4">• {cause}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {cls.pulmonaryCauses && (
                          <div className="mb-4">
                            <p className="text-sm font-semibold text-slate-700 mb-2">Pulmonary Causes:</p>
                            <ul className="space-y-1">
                              {cls.pulmonaryCauses.map((cause: string, i: number) => (
                                <li key={i} className="text-sm text-slate-600 ml-4">• {cause}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {cls.otherCauses && (
                          <div className="mb-4">
                            <p className="text-sm font-semibold text-slate-700 mb-2">Other Causes:</p>
                            <ul className="space-y-1">
                              {cls.otherCauses.map((cause: string, i: number) => (
                                <li key={i} className="text-sm text-slate-600 ml-4">• {cause}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {cls.nonCardiacPulmonaryCauses && (
                          <div>
                            <p className="text-sm font-semibold text-slate-700 mb-2">Non-Cardiac/Pulmonary Causes:</p>
                            <ul className="space-y-1">
                              {cls.nonCardiacPulmonaryCauses.map((cause: string, i: number) => (
                                <li key={i} className="text-sm text-slate-600 ml-4">• {cause}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Physical Exam Tab */}
          <TabsContent value="exam" className="space-y-6">
            {algorithm.history && (
              <Card>
                <CardHeader>
                  <CardTitle>History</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {algorithm.history.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {algorithm.physicalExam && (
              <Card>
                <CardHeader>
                  <CardTitle>Physical Examination</CardTitle>
                </CardHeader>
                <CardContent>
                  {typeof algorithm.physicalExam[0] === 'string' ? (
                    <ul className="space-y-2">
                      {algorithm.physicalExam.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-slate-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="space-y-6">
                      {algorithm.physicalExam.map((section: any, idx: number) => (
                        <div key={idx}>
                          <h4 className="font-semibold text-slate-900 mb-3">{section.section}</h4>
                          <ul className="space-y-2">
                            {section.findings.map((finding: string, i: number) => (
                              <li key={i} className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-slate-700">{finding}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Investigations Tab */}
          <TabsContent value="investigations" className="space-y-6">
            {algorithm.investigations && (
              <Card>
                <CardHeader>
                  <CardTitle>Diagnostic Investigations</CardTitle>
                </CardHeader>
                <CardContent>
                  {typeof algorithm.investigations[0] === 'string' ? (
                    <ul className="space-y-2">
                      {algorithm.investigations.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-slate-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="space-y-6">
                      {algorithm.investigations.map((inv: any, idx: number) => (
                        <div key={idx} className="border-l-4 border-purple-500 pl-4 py-2">
                          <h4 className="font-semibold text-slate-900">{inv.test}</h4>
                          <ul className="mt-2 space-y-1">
                            {inv.findings.map((finding: string, i: number) => (
                              <li key={i} className="text-sm text-slate-600 ml-4">• {finding}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Treatment Tab */}
          <TabsContent value="treatment" className="space-y-6">
            {algorithm.preHospitalCare && (
              <Card>
                <CardHeader>
                  <CardTitle>Pre-Hospital Care</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {algorithm.preHospitalCare.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {algorithm.referralIndications && (
              <Card>
                <CardHeader>
                  <CardTitle>Referral Indications</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {algorithm.referralIndications.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {algorithm.patientEducation && (
              <Card>
                <CardHeader>
                  <CardTitle>Patient Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {algorithm.patientEducation.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {algorithm.treatmentCOPD && (
              <Card>
                <CardHeader>
                  <CardTitle>COPD Treatment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Unstable Patients</h4>
                    <ul className="space-y-1">
                      {algorithm.treatmentCOPD.unstablePatients.map((item: string, idx: number) => (
                        <li key={idx} className="text-sm text-slate-600 ml-4">• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Stable Patients</h4>
                    <ul className="space-y-1">
                      {algorithm.treatmentCOPD.stablePatients.map((item: string, idx: number) => (
                        <li key={idx} className="text-sm text-slate-600 ml-4">• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Further Management</h4>
                    <ul className="space-y-1">
                      {algorithm.treatmentCOPD.furtherManagement.map((item: string, idx: number) => (
                        <li key={idx} className="text-sm text-slate-600 ml-4">• {item}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {algorithm.treatmentHeartFailure && (
              <Card>
                <CardHeader>
                  <CardTitle>Heart Failure Treatment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(algorithm.treatmentHeartFailure).map(([key, items]: [string, any]) => (
                    <div key={key}>
                      <h4 className="font-semibold text-slate-900 mb-2 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <ul className="space-y-1">
                        {items.map((item: string, idx: number) => (
                          <li key={idx} className="text-sm text-slate-600 ml-4">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {algorithm.referralGuidelines && (
              <Card>
                <CardHeader>
                  <CardTitle>Referral Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {algorithm.referralGuidelines.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

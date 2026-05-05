// Test script to demonstrate real case analysis
const testRealCase = async () => {
  const realCaseData = {
    caseId: "TEST-2026-001",
    analysisType: "Wrongful Conviction Analysis",
    caseData: {
      caseNumber: "SC-Criminal-2024-4567",
      court: "Additional Sessions Court, Delhi",
      caseType: "Criminal",
      status: "Under Trial",
      parties: [
        { type: "Accused", name: "Rajesh Kumar" },
        { type: "Complainant", name: "State of Delhi" },
        { type: "Victim", name: "Priya Sharma" }
      ],
      caseDetails: {
        sections: [
          { act: "IPC", section: "302", description: "Murder" },
          { act: "IPC", section: "201", description: "Causing disappearance of evidence" }
        ],
        evidence: [
          { type: "Physical", description: "Bloodstained clothes found near crime scene", reliability: 3 },
          { type: "Digital", description: "CCTV footage from nearby area", reliability: 4 },
          { type: "Forensic", description: "DNA samples from crime scene", reliability: 2 }
        ],
        witnesses: [
          { type: "Eyewitness", name: "Mohan Singh", credibility: 3 },
          { type: "Expert", name: "Dr. Forensic Expert", credibility: 4 }
        ],
        summary: "A case involving alleged murder where the accused claims innocence. Key evidence includes circumstantial evidence and witness testimony. The defense argues procedural violations and inadequate investigation."
      },
      timeline: [
        { date: "2024-01-15", description: "Incident reported" },
        { date: "2024-01-16", description: "Accused arrested" },
        { date: "2024-01-18", description: "First court appearance" },
        { date: "2024-02-01", description: "Charge sheet filed" }
      ]
    },
    additionalContext: "The accused belongs to a marginalized community and initially had limited legal representation. There are allegations of coerced confession during police custody."
  };

  try {
    const response = await fetch('http://localhost:3000/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(realCaseData)
    });

    const result = await response.json();
    console.log('Analysis Result:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.success && result.data.aiModel !== 'mock-analysis-fallback') {
      console.log('\n✅ SUCCESS: Got real AI analysis!');
      console.log(`Model used: ${result.data.aiModel}`);
      console.log(`Risk Score: ${result.data.riskScore}/10`);
      console.log(`Confidence: ${(result.data.confidence * 100).toFixed(1)}%`);
    } else {
      console.log('\n❌ STILL GETTING MOCK DATA');
      console.log('The AI models are not working - check API key');
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
};

// You can also test other analysis types:
const testBiasDetection = async () => {
  const biasTestCase = {
    caseId: "BIAS-TEST-001",
    analysisType: "BIAS_DETECTION",
    caseData: {
      caseNumber: "HC-Civil-2024-1234",
      court: "High Court of Karnataka",
      caseType: "Civil",
      status: "Judgment Reserved",
      parties: [
        { type: "Petitioner", name: "Mohammed Ali" },
        { type: "Respondent", name: "State Housing Board" }
      ],
      caseDetails: {
        summary: "A discrimination case where a Muslim family was denied housing despite meeting all criteria. The housing board cited 'locality preferences' but internal documents suggest religious bias in decision-making."
      }
    },
    additionalContext: "Pattern of similar denials to Muslim applicants in the same area over past 2 years."
  };

  try {
    const response = await fetch('http://localhost:3000/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(biasTestCase)
    });

    const result = await response.json();
    console.log('\nBias Detection Analysis:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Bias test failed:', error);
  }
};

// Run the test
console.log('Testing with real case data...');
testRealCase().then(() => {
  console.log('\nTesting bias detection...');
  return testBiasDetection();
});
// Test the specific case data that was failing
const testSpecificCase = async () => {
  const caseData = {
    caseId: "TEST-PARSING-001",
    analysisType: "Wrongful Conviction Analysis",
    caseData: {
      caseNumber: "CRL.A. 1247/2023",
      title: "Test Case", 
      court: "High Court",
      state: "Delhi",
      caseType: "Criminal",
      status: "Under Review",
      parties: [
        { type: "Accused", name: "Amit Sharma" },
        { type: "Complainant", name: "State of Delhi" }
      ],
      caseDetails: {
        summary: `**Parties Involved:**
Accused: Amit Sharma
Complainant: State of Delhi  
Victim: Priya Singh
Defense Lawyer: Advocate Rajesh Kumar
Public Prosecutor: APP Meera Gupta

**Case Details:**
A 25-year-old software engineer Priya Singh was found dead in her apartment. The accused Amit Sharma, her colleague, is charged with rape and murder.`,
        charges: [
          "IPC Section 302 - Murder",
          "IPC Section 376 - Rape",
          "IPC Section 201 - Causing disappearance of evidence",
          "Evidence Act Section 8 - Motive, preparation and conduct"
        ],
        evidence: [
          { type: "Physical", description: "Bloodstained clothes found at scene (Reliability: 3/5)", reliability: 3 },
          { type: "Physical", description: "Mobile phone with deleted messages (Reliability: 4/5)", reliability: 4 },
          { type: "Physical", description: "Weapon recovered from nearby drain (Reliability: 2/5)", reliability: 2 },
          { type: "Digital", description: "CCTV footage from 200m away (Reliability: 4/5)", reliability: 4 },
          { type: "Digital", description: "Call records showing communication (Reliability: 5/5)", reliability: 5 },
          { type: "Digital", description: "WhatsApp chat history (partial) (Reliability: 3/5)", reliability: 3 },
          { type: "Forensic", description: "DNA samples from victim's nails (Reliability: 2/5)", reliability: 2 },
          { type: "Forensic", description: "Fingerprints on weapon (Reliability: 1/5)", reliability: 1 },
          { type: "Forensic", description: "Post-mortem report inconsistencies (Reliability: 2/5)", reliability: 2 }
        ],
        witnesses: [
          { type: "Eyewitness", name: "Ramesh Gupta (Credibility: 3/5)", credibility: 3 },
          { type: "Expert", name: "Dr. Forensic Pathologist (Credibility: 4/5)", credibility: 4 },
          { type: "Character", name: "Accused's employer (Credibility: 4/5)", credibility: 4 },
          { type: "Hostile", name: "Victim's friend who changed testimony (Credibility: 1/5)", credibility: 1 }
        ]
      }
    },
    additionalContext: "Case has multiple evidence reliability issues and witness credibility concerns"
  };

  console.log('Testing improved JSON parsing with specific case...');
  console.log('='.repeat(60));

  try {
    const response = await fetch('http://localhost:3000/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(caseData)
    });

    const result = await response.json();
    
    console.log('Response Status:', response.status);
    console.log('Success:', result.success);
    
    if (result.success) {
      console.log('✅ PARSING SUCCESS!');
      console.log(`AI Model: ${result.data.aiModel}`);
      console.log(`Risk Score: ${result.data.riskScore}/10`);
      console.log(`Confidence: ${(result.data.confidence * 100).toFixed(1)}%`);
      console.log(`Processing Time: ${result.processingTime}ms`);
      console.log(`Findings: ${result.data.findings.length}`);
      console.log(`Recommendations: ${result.data.recommendations.length}`);
      
      console.log('\nFindings:');
      result.data.findings.forEach((f, i) => {
        console.log(`  ${i+1}. ${f.category} (${f.severity}): ${f.description.substring(0, 100)}...`);
      });
      
      console.log('\nRecommendations:');
      result.data.recommendations.forEach((r, i) => {
        console.log(`  ${i+1}. ${r.type} (${r.priority}): ${r.description.substring(0, 100)}...`);
      });
      
      // Check if it's the old parsing error
      const hasParsingError = result.data.findings.some(f => 
        f.category === "Analysis Processing" || 
        f.description.includes("parsing failed")
      );
      
      if (hasParsingError) {
        console.log('\n⚠️  Still getting parsing fallback - but at least no crash!');
      } else {
        console.log('\n🎉 Real AI analysis - parsing fixed!');
      }
      
    } else {
      console.log('❌ API Error:', result.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Run the test
testSpecificCase();
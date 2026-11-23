/**
 * SHLOKA YATRA 2027 — OFFICIAL DOCUMENT SPECIFICATIONS
 * Source of truth:
 * 1. SYPL-RISK-2027: Shlloka_Yatra_2027_Risk_Declaration_and_Indemnity.pdf (5 Pages, 24 numbered clauses)
 * 2. SYPL-MED-2027: Shlloka_Yatra_2027_Medical_Fitness_Certificate.pdf (3 Pages, Clinical assessment)
 * Status: Draft 1.0 – 23 November 2026 (Preserves Draft status until formal corporate approval)
 */

export const SYPL_RISK_DOCUMENT = {
  documentRef: 'SYPL-RISK-2027',
  title: 'Participant Declaration, Assumption of Inherent High-Altitude Risk, and Limited Indemnity Agreement',
  shortTitle: 'Risk Declaration & Limited Indemnity',
  version: 'Draft 1.0 – 23 November 2026',
  effectiveDate: '2026-11-23',
  isDraft: true,
  draftNotice: 'DRAFT 1.0 – 23 NOVEMBER 2026. This document is currently in review draft status and will become legally binding upon official publication by Shloka Yatra Private Limited.',
  totalClauses: 24,
  totalPages: 5,
  downloadUrl: '/documents/Shlloka_Yatra_2027_Risk_Declaration_and_Indemnity.pdf',

  pages: [
    {
      pageNumber: 1,
      pageTitle: 'Page 1 — Identification & Inherent High-Altitude Risks',
      sections: [
        {
          sectionNumber: '01',
          sectionTitle: 'Participant and Booking Identification',
          clauses: [
            {
              clauseNumber: '01',
              title: 'Legal Identity and Primary Contact',
              body: 'The participant affirmatively confirms that their full legal name, date of birth, passport number, nationality, and contact details entered for booking correspond exactly with their valid government-issued passport or identity card. Any permit rejection, transit refusal, or expulsion resulting from discrepancies shall be the sole responsibility of the participant.',
            },
            {
              clauseNumber: '02',
              title: 'Journey Schedule and Sector Allocation',
              body: 'This declaration governs the participant’s registration, transit, high-altitude acclimatization, and parikrama trek for Kailash Mansarovar Yatra 2027 across the selected package sector (Overland Drive via Kyirong, Lhasa Flight Sector, or Lhasa–Ali VIP Helicopter Sector).',
            },
          ],
        },
        {
          sectionNumber: '02',
          sectionTitle: 'Informed Participation & Assumption of Inherent High-Altitude Risk',
          clauses: [
            {
              clauseNumber: '03',
              title: 'Extreme High-Altitude Environment',
              body: 'The participant expressly understands that the Kailash Mansarovar Parikrama traverses terrain exceeding 4,500 metres above sea level, culminating at Dolma La Pass (5,630 metres / 18,600 feet). The participant acknowledges that high altitude entails severe hypobaric hypoxia, extreme cold, erratic winds, and rapid weather transitions.',
            },
            {
              clauseNumber: '04',
              title: 'Medical and Physiological Hazards',
              body: 'The participant acknowledges the inherent risk of Acute Mountain Sickness (AMS), High Altitude Pulmonary Oedema (HAPE), High Altitude Cerebral Oedema (HACE), thromboembolic events, cardiac arrest, peripheral frostbite, hypothermia, retinal haemorrhage, and severe physical exhaustion, any of which may cause permanent bodily impairment or death despite prompt care.',
            },
          ],
        },
      ],
    },
    {
      pageNumber: 2,
      pageTitle: 'Page 2 — Medical Disclosure, Fitness & High-Altitude Insurance',
      sections: [
        {
          sectionNumber: '02',
          sectionTitle: 'Informed Participation & Inherent Risk (Continued)',
          clauses: [
            {
              clauseNumber: '05',
              title: 'Remote Wilderness Terrain and Healthcare Limitations',
              body: 'The pilgrimage takes place in remote, sparsely populated Tibetan Plateau territory where advanced tertiary hospitals, critical intensive care units, and rapid rescue helicopters are non-existent or subject to sovereign military air-space clearance. On-site medical support is restricted to basic emergency first aid, supplemental oxygen, hyperbaric chambers, and land-based evacuation.',
            },
          ],
        },
        {
          sectionNumber: '03',
          sectionTitle: 'Medical Disclosure, Physical Preparation, and Mandatory Insurance',
          clauses: [
            {
              clauseNumber: '06',
              title: 'Duty of Full and Accurate Medical Disclosure',
              body: 'The participant warrants that they have fully and truthfully disclosed all pre-existing medical conditions, surgical history, cardiovascular anomalies, respiratory ailments, diabetes, neurological history, and active medications. Deliberate concealment constitutes an immediate material breach and grounds for immediate removal from the expedition.',
            },
            {
              clauseNumber: '07',
              title: 'Mandatory Specialized High-Altitude Travel Insurance',
              body: 'The participant undertakes to obtain and maintain valid specialized high-altitude international travel insurance covering emergency high-altitude medical treatment, emergency land/air ambulance evacuation up to 6,000 metres, and mortal remains repatriation. Shloka Yatra does not act as an insurer.',
            },
            {
              clauseNumber: '08',
              title: 'Personal Physical Fitness and Aerobic Conditioning',
              body: 'The participant acknowledges that completing the 52-kilometre Kailash Parikrama requires strenuous physical exertion over multiple consecutive days. The participant certifies that they have undertaken diligent cardiovascular training and have been cleared by their personal physician.',
            },
          ],
        },
      ],
    },
    {
      pageNumber: 3,
      pageTitle: 'Page 3 — Expedition Leadership, Safety & Uncontrollable Delays',
      sections: [
        {
          sectionNumber: '04',
          sectionTitle: 'Group Safety, Expedition Leadership, and Emergency Evacuation',
          clauses: [
            {
              clauseNumber: '09',
              title: 'Paramount Authority of Expedition Leader and Sherpa Guides',
              body: 'For the safety and preservation of the entire group, the appointed Shloka Yatra Expedition Leader, accompanying medical officer, and authorized local Tibetan guides hold absolute authority. The participant agrees to abide unconditionally by all leadership directives regarding pace, acclimatization, departure times, and safety protocols.',
            },
            {
              clauseNumber: '10',
              title: 'Absolute Medical Veto and Forced Descent Protocol',
              body: 'If the expedition medical officer or leader determines that a participant exhibits worsening symptoms of AMS, HAPE, HACE, or severe incapacitation, the participant must immediately submit to mandatory descent to lower elevation. The leader’s medical veto is final and non-negotiable.',
            },
            {
              clauseNumber: '11',
              title: 'Emergency Search, Rescue, and Evacuation Operations',
              body: 'In an acute medical crisis, the organizer will initiate immediate evacuation to the nearest available clinic or border crossing. All arrangements are subject to regional road conditions, military checkpoint clearances, weather viability, and international border regulations.',
            },
            {
              clauseNumber: '12',
              title: 'Financial Responsibility for Evacuation and Individual Medical Care',
              body: 'All direct third-party expenditures associated with special vehicular evacuation, emergency oxygen consumption beyond standard quotas, local hospitalization, and ambulance transit are the sole financial responsibility of the participant or their insurance carrier.',
            },
          ],
        },
        {
          sectionNumber: '05',
          sectionTitle: 'Uncontrollable Travel Realities and Service Disruptions',
          clauses: [
            {
              clauseNumber: '13',
              title: 'Geopolitical, Border, and Sovereign Authority Actions',
              body: 'Cross-border pilgrimage to the Tibet Autonomous Region (TAR) is strictly governed by the Ministry of Foreign Affairs of the People’s Republic of China, CIPSC, and immigration authorities. Shloka Yatra has no control over sudden visa regulations, group permit suspensions, or border closures.',
            },
            {
              clauseNumber: '14',
              title: 'Severe Weather, Landslides, and Road Inaccessibility',
              body: 'Himalayan highways and mountain passes are vulnerable to unexpected landslides, avalanches, snowstorms, mudslides, and flash floods that may block vehicle transit or delay flight sectors for days.',
            },
          ],
        },
      ],
    },
    {
      pageNumber: 4,
      pageTitle: 'Page 4 — Route Adjustments & Limited Indemnity Agreement',
      sections: [
        {
          sectionNumber: '05',
          sectionTitle: 'Travel Uncertainties (Continued)',
          clauses: [
            {
              clauseNumber: '15',
              title: 'Route Adjustments and Equivalent Service Substitutions',
              body: 'The organizer reserves the right to alter itineraries, modify halt stations, or reroute travel if deemed necessary for devotee safety, acclimatization, or compliance with local sovereign decrees. Such operational adaptations shall not constitute breach of contract.',
            },
            {
              clauseNumber: '16',
              title: 'No Organizer Liability for Force Majeure Disruptions',
              body: 'Shloka Yatra shall not be held liable for indirect losses, missed onward flights, or personal distress occasioned by events of Force Majeure, including military restrictions, border shutdowns, or natural disasters beyond reasonable commercial control.',
            },
          ],
        },
        {
          sectionNumber: '06',
          sectionTitle: 'Limited Indemnity and Preservation of Non-Excludable Statutory Rights',
          clauses: [
            {
              clauseNumber: '17',
              title: 'Voluntary Assumption of Adventure and High-Altitude Risks',
              body: 'To the fullest extent permissible by law, the participant knowingly and voluntarily assumes all inherent risks of high-altitude pilgrimage, terrain transit, and wilderness travel, releasing Shloka Yatra from claims arising from normal inherent adventure hazards.',
            },
            {
              clauseNumber: '18',
              title: 'Participant Indemnity for Unlawful Acts or Protocol Breach',
              body: 'The participant agrees to indemnify and hold harmless Shloka Yatra, its directors, employees, and local partners from any statutory fines, damages, or losses resulting from the participant’s unlawful acts, visa violations, photography of military installations, or gross breach of rules.',
            },
            {
              clauseNumber: '19',
              title: 'Full Preservation of Non-Excludable Statutory Consumer Rights',
              body: 'Nothing in this declaration or indemnity shall exclude, restrict, or modify any statutory consumer protection guarantee, non-excludable legal right, or statutory remedy available to the participant under the Consumer Protection Act, 2019 or applicable Indian consumer law.',
            },
            {
              clauseNumber: '20',
              title: 'No Exclusion for Gross Negligence or Wilful Misconduct',
              body: 'Nothing in this agreement purports to exclude or limit the legal liability of the organizer for gross negligence, wilful misconduct, or fraudulent misrepresentation proven in a competent court of law.',
            },
          ],
        },
      ],
    },
    {
      pageNumber: 5,
      pageTitle: 'Page 5 — Direct Acknowledgements, Insurance & Execution',
      sections: [
        {
          sectionNumber: '07',
          sectionTitle: 'Personal Data, Digital Consent, and Evidentiary Contract Record',
          clauses: [
            {
              clauseNumber: '21',
              title: 'Consent for Emergency Health Data Processing under DPDPA 2023',
              body: 'The participant explicitly consents under India’s Digital Personal Data Protection Act, 2023 to the processing, cross-border transmission, and sharing of their sensitive medical disclosures with border immigration, local military checkpoints, and emergency rescue personnel solely for travel permits and high-altitude safety.',
            },
            {
              clauseNumber: '22',
              title: 'Digital Execution and Evidentiary Admissibility',
              body: 'The participant agrees that digital submission with page initials and electronic confirmation carries the evidentiary validity of a written instrument under the Information Technology Act, 2000.',
            },
            {
              clauseNumber: '23',
              title: 'Severability of Clauses',
              body: 'If any clause or provision of this agreement is adjudicated invalid or unenforceable, such adjudication shall not affect the enforceability of remaining provisions.',
            },
            {
              clauseNumber: '24',
              title: 'Governing Law and Exclusive Dispute Jurisdiction',
              body: 'This declaration and indemnity agreement is governed by the laws of India. Any formal dispute arising out of this pilgrimage contract shall be submitted to the exclusive jurisdiction of the competent civil courts at New Delhi / Gautam Buddha Nagar, Uttar Pradesh, India.',
            },
          ],
        },
      ],
    },
  ],

  // Section 8: Direct Acknowledgements (Must be affirmatively initialed/checked by participant)
  directAcknowledgements: [
    {
      id: 'ack1_extreme_altitude',
      statementNumber: 1,
      text: 'I acknowledge the extreme altitude (up to 5,630 metres / 18,600 feet at Dolma La Pass), severe cold, erratic weather, and remote wilderness of Mount Kailash and Lake Mansarovar.',
    },
    {
      id: 'ack2_medical_conditions',
      statementNumber: 2,
      text: 'I confirm that I have disclosed all pre-existing medical conditions, cardiac/respiratory history, medications, and physical limitations truthfully and completely.',
    },
    {
      id: 'ack3_insurance_mandatory',
      statementNumber: 3,
      text: 'I confirm that I will maintain valid high-altitude travel insurance covering emergency high-altitude medical treatment, helicopter/land evacuation up to 6,000m, and repatriation.',
    },
    {
      id: 'ack4_leader_authority',
      statementNumber: 4,
      text: 'I agree to abide unconditionally by all safety instructions, pace guidance, and acclimatization protocols issued by the Tour Leader, Guides, and accompanying medical staff.',
    },
    {
      id: 'ack5_evacuation_costs',
      statementNumber: 5,
      text: 'I understand that any emergency evacuation or individual hospitalisation costs incurred are my financial responsibility or that of my designated insurance provider.',
    },
    {
      id: 'ack6_uncertainties',
      statementNumber: 6,
      text: 'I understand that sovereign border clearances, military checkpoints, flight disruptions, road closures, and weather delays are beyond the direct control of Shloka Yatra.',
    },
    {
      id: 'ack7_limited_indemnity',
      statementNumber: 7,
      text: 'I understand this limited indemnity releases ordinary adventure hazards but preserves all non-excludable statutory consumer rights under Indian law and organizer liability for gross negligence.',
    },
    {
      id: 'ack8_read_all_pages',
      statementNumber: 8,
      text: 'I have read all 5 pages and 24 clauses of this Risk Declaration & Limited Indemnity Agreement in full before executing this signature.',
    },
  ],
};

export const SYPL_MEDICAL_DOCUMENT = {
  documentRef: 'SYPL-MED-2027',
  title: 'Shlloka Yatra 2027 – Medical Fitness & Clinical Clearance Certificate',
  shortTitle: 'Medical Fitness & Clinical Clearance',
  version: 'Draft 1.0 – 23 November 2026',
  effectiveDate: '2026-11-23',
  isDraft: true,
  draftNotice: 'DRAFT 1.0 – 23 NOVEMBER 2026. This clinical certificate must be printed, completed, and signed/stamped by an authorized registered medical practitioner with photograph authentication.',
  downloadUrl: '/documents/Shlloka_Yatra_2027_Medical_Fitness_Certificate.pdf',
  totalPages: 3,

  // 16 Self-Declaration Health Conditions on Page 1
  healthConditions: [
    { id: 'c1', code: 'CARDIAC', label: 'Heart disease / chest pain / heart attack / bypass / stent / pacemaker / angina' },
    { id: 'c2', code: 'HYPERTENSION', label: 'High blood pressure / uncontrolled hypertension / irregular heart rhythm' },
    { id: 'c3', code: 'RESPIRATORY', label: 'Asthma / COPD / chronic bronchitis / lung disease / persistent shortness of breath' },
    { id: 'c4', code: 'SLEEP_APNOEA', label: 'Sleep apnoea / CPAP machine use / need for home oxygen therapy' },
    { id: 'c5', code: 'DIABETES', label: 'Diabetes mellitus (Type 1 or Type 2) / severe low blood sugar episodes' },
    { id: 'c6', code: 'NEUROLOGICAL', label: 'Stroke / TIA / epilepsy / seizures / fainting spells / neurological illness' },
    { id: 'c7', code: 'RENAL_HEPATIC', label: 'Chronic kidney disease / kidney stones / liver disease / hepatitis' },
    { id: 'c8', code: 'HAEMATOLOGICAL', label: 'Anaemia / deep vein thrombosis (DVT) / pulmonary embolism / blood clotting disorder' },
    { id: 'c9', code: 'SURGICAL', label: 'Major surgery / hospital admission / general anaesthesia in last 12 months' },
    { id: 'c10', code: 'MUSCULOSKELETAL', label: 'Joint replacement / severe arthritis / spine disc disease / walking limitation' },
    { id: 'c11', code: 'ALLERGIES', label: 'Significant allergies to medicines, foods, or insect stings / anaphylaxis history' },
    { id: 'c12', code: 'PSYCHIATRIC', label: 'Severe anxiety, panic disorder, claustrophobia, or psychiatric condition' },
    { id: 'c13', code: 'ALTITUDE_HISTORY', label: 'Prior severe altitude sickness / pulmonary oedema (HAPE) / cerebral oedema (HACE)' },
    { id: 'c14', code: 'PREGNANCY', label: 'Currently pregnant or possibility of pregnancy (female devotees)' },
    { id: 'c15', code: 'RECENT_ILLNESS', label: 'Recent respiratory infection, fever, persistent cough, or acute illness in last 30 days' },
    { id: 'c16', code: 'NONE_OF_ABOVE', label: 'None of the above conditions apply to the best of my knowledge' },
  ],

  // 4 Declarations on Page 2
  declarations: [
    {
      id: 'd1',
      title: 'Health Change Notification',
      text: 'I agree to immediately notify Shloka Yatra in writing if my medical condition, active prescriptions, or physical fitness changes significantly before departure.',
    },
    {
      id: 'd2',
      title: 'Medication Carrying & Self-Administration',
      text: 'I confirm that I will carry an adequate personal supply of all prescribed and personal emergency medicines for the entire duration of the pilgrimage in my hand baggage.',
    },
    {
      id: 'd3',
      title: 'Further Clinical Evaluation',
      text: 'I acknowledge that the expedition medical staff or leader may require an on-site clinical assessment or SpO2 check at Kathmandu, Kyirong, or Mansarovar prior to parikrama.',
    },
    {
      id: 'd4',
      title: 'Truthful Medical Disclosure',
      text: 'I solemnly attest that all information provided in this medical declaration is accurate, complete, and truthful, and I have not withheld any medical fact.',
    },
  ],

  // Physician Clearance Decisions on Page 3
  clearanceOptions: [
    {
      code: 'FIT',
      title: '1. FIT FOR HIGH-ALTITUDE EXPEDITION',
      description: 'The candidate is medically examined, shows adequate physiological reserve, and is clinically fit for the proposed high-altitude itinerary up to 5,630 metres without specific medical restrictions.',
    },
    {
      code: 'FIT_WITH_CONDITIONS',
      title: '2. FIT ONLY WITH CONDITIONS / SPECIFIC RESTRICTIONS',
      description: 'The candidate is conditionally fit subject to continuous medication, acclimatization precautions, or specific physical limitations documented by the assessing clinician.',
    },
    {
      code: 'NOT_FIT',
      title: '3. NOT FIT FOR HIGH-ALTITUDE TRAVEL',
      description: 'The candidate presents severe cardiac, pulmonary, metabolic, or physical contraindications and is clinically advised against high-altitude travel above 3,000 metres.',
    },
    {
      code: 'DEFER',
      title: '4. DEFER DECISION – FURTHER SPECIALIST EVALUATION REQUIRED',
      description: 'Decision deferred pending stress ECG, echocardiogram, pulmonary function testing, or specialist clinical review before final clearance.',
    },
  ],
};

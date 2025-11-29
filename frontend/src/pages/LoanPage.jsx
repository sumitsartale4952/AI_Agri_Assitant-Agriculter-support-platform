import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function LoanPage() {
  const [activeTab, setActiveTab] = useState('types');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBank, setFilterBank] = useState('all');
  const [expandedLoan, setExpandedLoan] = useState(null);

  const tabs = [
    { id: 'types', label: 'All Loans & Credit', icon: '💳' },
    { id: 'directory', label: 'Loan Directory', icon: '📚' },
    { id: 'eligibility', label: 'Eligibility', icon: '✓' },
    { id: 'process', label: 'Apply', icon: '📝' },
  ];

  // Comprehensive loan data
  const allLoans = [
    {
      name: 'Kisan Credit Card (SBI)',
      type: 'Agricultural Cash Credit (KCC)',
      bank: 'State Bank of India (SBI)',
      limit: 'Need-based (no fixed limit)',
      rate: 'Up to ₹3.00L: 7% p.a.; Above ₹3.00L to ₹50.00L: 3.25% + 1-year MCLR; ≥₹50.00L: based on CRA rating',
      repayment: 'Up to 1 year (aligned with crop cycle)',
      uses: 'Cultivation of crops, post-harvest processing, household consumption, and allied agri activities',
      pros: ['No collateral up to ₹2/3L', '3% prompt repayment interest subvention', '5-year card with annual limit review'],
      website: 'https://sbi.bank.in/web/agri-rural/agriculture-banking/crop-loan/kisan-credit-card',
      form: 'https://sbi.bank.in/documents/14463/22577/application+form.pdf',
    },
    {
      name: 'Kisan Samriddhi Rin',
      type: 'Agriculture Term Loan',
      bank: 'State Bank of India (SBI)',
      limit: 'Min ₹5.00L, up to ₹50.00 crore',
      rate: 'Loans ≤ ₹50.00L: 3.25% + 1-year MCLR; Loans > ₹50.00L: as per credit rating',
      repayment: 'As per crop/investment cycle (usually up to 7 years)',
      uses: 'Agricultural crop cultivation and allied activities for progressive/corporate farmers (min 4 acres)',
      pros: ['High loan ceiling (₹50 Cr)', 'Flexible investment credit', 'Competitive interest linked to MCLR/CRA'],
      website: 'https://sbi.bank.in/web/agri-rural/agriculture-banking/crop-loan/kisan-samriddhi-rin',
    },
    {
      name: 'Pradhan Mantri Mudra Yojana (PMMY)',
      type: 'Micro/Small Enterprise Loan',
      bank: 'Government of India (via banks)',
      limit: 'Shishu: ₹50K; Kishor: ₹50K–₹5L; Tarun: ₹5L–₹10L',
      rate: '3.25% above EBLR (≈12.15% p.a. from Feb 2025)',
      repayment: '≤₹5.00L: up to 5 years; ₹5.00–10.00L: up to 7 years',
      uses: 'Non-corporate, non-farm micro/small enterprises including allied agricultural activities',
      pros: ['Collateral-free up to ₹10L', 'No margin up to ₹50K', 'Government guarantee (CGFMU) cover'],
      website: 'https://sbi.bank.in/web/agri-rural/pradhan-mantri-mudra-yojna',
    },
    {
      name: 'KCC for Animal Husbandry & Fisheries',
      type: 'Agricultural Cash Credit (KCC for Allied)',
      bank: 'State Bank of India (SBI)',
      limit: 'No fixed ceiling (as per district scale of finance)',
      rate: '7.0% p.a. (fixed) up to ₹2.00L; 4.0% p.a. effective with 3% prompt repayment subvention',
      repayment: 'Up to 1 year (aligned with animal/fish production cycle)',
      uses: 'Dairy, poultry, sheep/goat/pig rearing, rabbit farming, fisheries (inland/marine aquaculture)',
      pros: ['Special KCC scheme for livestock/fisheries', 'Collateral waiver up to ₹2/3L', 'Interest subsidy and subvention'],
      website: 'https://sbi.bank.in/web/agri-rural/agriculture-banking/kcc-for-alied-activities',
    },
    {
      name: 'Kisan All Purpose Term Loan',
      type: 'Agricultural Term Loan',
      bank: 'IDBI Bank',
      limit: '₹50,000 (min) to ₹20,00,000 (max)',
      rate: 'Varies (as per IDBI\'s agricultural lending rates)',
      repayment: 'Up to 9 years (including moratorium up to 2 years)',
      uses: 'Farm mechanization, land development, minor irrigation, horticulture, allied agri activities',
      pros: ['Multi-purpose term loan', 'Long tenor with moratorium', 'For owner cultivators, individuals/SHG/JLG'],
      website: 'https://www.idbi.bank.in/kisan-all-purpose-term-loan.aspx',
      form: 'https://www.idbi.bank.in/pdf/agri/Farm_Mechanization_Loan_Application_Form.pdf',
    },
    {
      name: 'Dairy Farming Loan',
      type: 'Agricultural Term Loan (Dairy)',
      bank: 'IDBI Bank',
      limit: '₹20,000 (min) to ₹10,00,000 (max)',
      rate: 'Varies (subject to IDBI lending rates)',
      repayment: 'Up to 5–6 years (including gestation period)',
      uses: 'Purchase of high-yield milch cattle/buffaloes, dairy shed construction, equipment',
      pros: ['Encourages dairy units', 'Finance for livestock and infrastructure', 'Supports small/marginal dairy farmers'],
      website: 'https://www.idbi.bank.in/dairy-farming.aspx',
      form: 'https://www.idbi.bank.in/pdf/agri/Dairy_Loan_Application_Form.pdf',
    },
    {
      name: 'Kisan Power',
      type: 'Short-Term Crop Loan',
      bank: 'Axis Bank',
      limit: '₹25,001 – ₹2.50 crore',
      rate: 'Average ~12.5% p.a.',
      repayment: 'Up to 5 years',
      uses: 'Cultivation expenses (seeds, inputs, labor, post-harvest) for crop & horticulture',
      pros: ['Large loan range', 'Digital processing', 'Lower interest with prompt repayment', 'Quick sanctions'],
      website: 'https://www.axis.bank.in/agri-and-rural/loans/farmer-funding/kisan-power',
    },
    {
      name: 'Kisan Samarth 2.0',
      type: 'Consumption Credit (Personal Loan)',
      bank: 'Axis Bank',
      limit: 'Starting ₹1,00,001',
      rate: 'Competitive rates',
      repayment: '1 year',
      uses: 'Household consumption (marriage, medical, education) not related to farming',
      pros: ['Rapid disbursal', 'For personal needs', 'Minimal documentation', 'Handles non-agri emergencies'],
      website: 'https://www.axis.bank.in/agri-and-rural/loans/farmer-funding/kisan-samarth',
    },
    {
      name: 'Kisan Tatkal',
      type: 'Loan Against Fixed Deposit',
      bank: 'Axis Bank',
      limit: 'Up to ₹5.00 crore',
      rate: 'Interest on FD less margin (Loan@up to 1.5% above FD rate)',
      repayment: '1 year',
      uses: 'Household consumption and personal needs against own fixed deposit collateral',
      pros: ['High loan amount using fixed deposit', 'Quick processing', 'Minimal documentation'],
      website: 'https://www.axis.bank.in/agri-and-rural/loans/farmer-funding/kisan-tatkal',
    },
    {
      name: 'Kisan Matsya',
      type: 'Short-Term Fishery Loan',
      bank: 'Axis Bank',
      limit: '₹25,001 – ₹1.50 crore',
      rate: 'Average ~11.8% p.a.',
      repayment: 'Up to 5 years',
      uses: 'Fisheries operations (freshwater/brackish/marine culture) and allied recurring expenses',
      pros: ['Supports fish farming investments', 'Wide loan range', 'Tailored for fisheries sector'],
      website: 'https://www.axis.bank.in/agri-and-rural/loans/farmer-funding/kisan-matsya',
    },
    {
      name: 'Poultry Power',
      type: 'Poultry Loan',
      bank: 'Axis Bank',
      limit: '₹2,00,000 – ₹5.00 crore',
      rate: 'Average ~12.7% p.a.',
      repayment: 'Up to 3 years',
      uses: 'Working capital and term loans for poultry farms (layer, broiler) and allied units',
      pros: ['Designed for poultry businesses', 'Large loan amounts', 'Digital branchless credit channels'],
      website: 'https://www.axis.bank.in/agri-and-rural/loans/farmer-funding/poultry-power',
    },
    {
      name: 'PM-KUSUM Scheme Loan',
      type: 'Agricultural Equipment Loan (Solar Pumps)',
      bank: 'Axis Bank (Govt. of India Scheme)',
      limit: '₹25,001 – ₹2.50 crore',
      rate: 'Interest rate as per scheme (subsidized) or bank\'s lending rates',
      repayment: 'Up to 7 years (incl. moratorium)',
      uses: 'Loans for standalone solar-powered irrigation pumps or solarisation of grid-connected pumps',
      pros: ['Government interest subvention', 'Encourages solar irrigation', 'Long tenor'],
      website: 'https://www.axis.bank.in/agri-and-rural/loans/farmer-funding/pm-kusum',
    },
    {
      name: 'Dairy Power',
      type: 'Livestock Loan (Dairy)',
      bank: 'Axis Bank',
      limit: '₹25,001 – ₹5.00 lakh',
      rate: 'Bank lending rate applies',
      repayment: 'Up to 39 months',
      uses: 'Credit for dairy farmers (milk production units) to purchase animals, equipment, or feed',
      pros: ['Tailored dairy financing', 'Small loan amounts for small farmers', 'Supports milk production units'],
      website: 'https://www.axis.bank.in/agri-and-rural/loans/farmer-funding/dairy-power',
    },
    {
      name: 'Farm Development Term Loan',
      type: 'Agricultural Term Loan',
      bank: 'Axis Bank',
      limit: 'Starting ₹25,001 (no upper limit)',
      rate: 'As per bank\'s agri loan rate',
      repayment: 'Up to 7 years (6–24 months moratorium)',
      uses: 'Land development, leveling, fencing, irrigation systems (drip/sprinkler)',
      pros: ['Covers infrastructure/improvement needs', 'Long tenure with moratorium', 'One-time processing'],
      website: 'https://www.axis.bank.in/agri-and-rural/loans/farmer-funding/farm-development-term-loan',
    },
    {
      name: 'Overdraft Consumption',
      type: 'Overdraft (Consumption Loan)',
      bank: 'Axis Bank',
      limit: 'Starting ₹1,00,001',
      rate: 'As per bank\'s OD rate',
      repayment: 'Up to 1 year',
      uses: 'Household consumption (non-farm expenses) of farmers/individuals',
      pros: ['Flexible overdraft', 'For personal needs', 'Minimal documentation'],
      website: 'https://www.axis.bank.in/agri-and-rural/loans/farmer-funding/overdraft-consumption',
    },
    {
      name: 'Krishi Unnati (FPO Financing)',
      type: 'Term Loan (FPO/FPC)',
      bank: 'IDBI Bank',
      limit: '₹50,000 (min) to ₹2,00,00,000 (max)',
      rate: 'Market-linked rate',
      repayment: '3–8 years (as per project life)',
      uses: 'Registered Farmer Producer Companies (FPCs) and Farmer Producer Organizations (FPOs)',
      pros: ['Finances collective ventures', 'Input procurement, marketing, processing', 'Credit guarantee up to ₹100L for small FPOs'],
      website: 'https://www.idbi.bank.in/krishi-unnati-financing-to-fpc-fpos.aspx',
    },
    {
      name: 'Kisan Credit Card (PNB)',
      type: 'Agricultural Cash Credit (KCC)',
      bank: 'Punjab National Bank (PNB)',
      limit: 'Need-based (set by district technical committee)',
      rate: 'Up to ₹3.00L: 7% p.a.; >₹3.00L to ₹50.00L: 3.25% + MCLR; >₹50.00L: CRA-based',
      repayment: 'Up to 1 year (as per cropping cycle)',
      uses: 'Crop cultivation, allied and post-harvest activities',
      pros: ['Single-window credit', 'Interest subvention', 'Simplified documentation', 'Debit card access'],
      website: 'https://pnbindia.in/agricultural-banking.html',
    },
    {
      name: 'Farm Equipment Loan',
      type: 'Term Loan for Farm Mechanization',
      bank: 'Government Banks/Agri Finance',
      limit: 'Typical loan up to ₹10 lakh',
      rate: 'Varies (around 10-12% p.a.)',
      repayment: 'Up to 5 years',
      uses: 'Purchase of agricultural equipment (tractors, harvesters, etc.)',
      pros: ['High finance for mechanization', 'Improved productivity', 'Various equipment financing'],
      website: '',
    },
    {
      name: 'Agricultural Crop Loan',
      type: 'Short-Term Agriculture Credit',
      bank: 'Multiple Banks (Govt. Priority Sector)',
      limit: 'Up to ₹3.00 lakh (subvented rates); higher limits subject to norms',
      rate: 'Generally low, ~7% up to ₹3L as per GOI subvention',
      repayment: 'Up to 1 year (crop cycle)',
      uses: 'Cultivation of notified crops',
      pros: ['Low-rate credit for farmers', 'Interest subvention schemes', 'Widens banking reach'],
      website: 'https://sbi.bank.in/web/agri-rural',
    },
    {
      name: 'Agricultural Infrastructure Fund',
      type: 'Medium-Long Term Loan (Govt. Scheme)',
      bank: 'Government of India (Ministry of Agriculture)',
      limit: 'Up to ₹2.00 crore per farmer',
      rate: '3% p.a. interest subvention (for 7 years) on loans up to ₹2Cr',
      repayment: 'Up to 7 years',
      uses: 'Post-harvest infrastructure (storage, cold chain, etc.), community farming assets, agri-processing',
      pros: ['Focused on infrastructure', 'Cheap credit with govt subsidy', 'Boosts value-chain'],
      website: 'https://pmkisan.gov.in',
    },
  ];

  const howToApplyData = [
    {
      loanName: "Kisan Credit Card (KCC)",
      steps: [
        "Visit nearest bank branch (e.g. SBI, PNB, BOB) and request the KCC application form",
        "Fill out and submit the form with land records, Aadhaar/ID proof, bank passbook, and photos",
        "Bank officials verify land ownership, cropping details and check credit history (CIBIL)",
        "Credit limit is sanctioned based on land size and crop details; KCC card is issued (usually within ~14 days)"
      ]
    },
    {
      loanName: "PMFBY Crop Insurance (Claim Support)",
      steps: [
        "Check if your crop and area are covered under PMFBY crop insurance",
        "Immediately notify authorities of the crop loss and submit a loss intimation form with evidence",
        "An insurance company assesses the loss (including crop-cutting experiments) to calculate the claim",
        "Upon approval, the insurance claim amount is credited to the farmer's bank account through the lending bank"
      ]
    },
    {
      loanName: "PM-Kisan Linked Credit (KCC)",
      steps: [
        "Ensure you are a registered PM-Kisan beneficiary with Aadhaar-seeded bank account",
        "Choose a bank participating in the PM-Kisan credit scheme and visit it (or use its online portal)",
        "For online: apply on the bank's website by filling the PM-Kisan credit card form and submit required details",
        "For offline: visit the bank branch, fill out the Kisan Credit Card application form and submit with land records and Aadhaar/PAN",
        "Bank verifies your PM-Kisan ID and eligibility, then sanctions the loan/credit limit and issues the KCC card"
      ]
    },
    {
      loanName: "SBI Crop Loan",
      steps: [
        "Visit your nearest SBI branch (or use the SBI YONO online platform) and request the agricultural crop loan application",
        "Submit the filled application form along with KYC documents, land ownership papers, income proof and a crop cultivation plan",
        "SBI officials verify all documents and details (they may conduct a field visit to inspect the farm)",
        "Upon approval by the credit committee, the loan is sanctioned and the amount is disbursed to your bank account"
      ]
    },
    {
      loanName: "SBI Dairy Loan (KCC Dairy)",
      steps: [
        "Visit the nearest SBI branch and request the dairy/agri-loan application (or KCC for animal husbandry) form",
        "Provide details of your dairy enterprise, including the number of cattle, shed details and expected milk yield",
        "Submit proof of dairy activity (e.g. cattle ownership papers, shed documents, any milk procurement records)",
        "Bank verifies the information (may inspect the farm); loan up to the eligible limit (without collateral) is sanctioned and credited to your account"
      ]
    },
    {
      loanName: "HDFC Tractor Loan",
      steps: [
        "Visit an HDFC Bank rural/agri branch or an authorized tractor dealer with your chosen tractor's quotation",
        "Submit a completed tractor loan application with KYC, income proof, and landholding documents",
        "HDFC Bank verifies the dealer's invoice/quotation and your repayment capacity (including CIBIL score)",
        "If approved, the loan is sanctioned for up to 90% of the tractor cost and paid directly to the dealer"
      ]
    },
    {
      loanName: "HDFC Kisan Gold Card",
      steps: [
        "Visit an HDFC Bank rural/agri branch and fill out the Kisan Gold Card application form",
        "Submit land ownership records and any required documents to establish the credit limit",
        "A bank officer may visit your farm to verify the details",
        "Bank approves the credit limit and issues the Kisan Gold Card for agricultural expenses"
      ]
    },
    {
      loanName: "Axis Bank Agriculture Term Loan",
      steps: [
        "Visit an Axis Bank branch and choose the specific agricultural loan purpose (e.g. equipment, irrigation, farm development)",
        "Submit a detailed project plan or equipment quotation along with KYC documents and land papers",
        "Axis Bank evaluates the plan's financial viability and your repayment capacity",
        "If approved, the term loan is sanctioned and the funds are disbursed to your account for project implementation"
      ]
    },
    {
      loanName: "Axis Bank KCC",
      steps: [
        "Visit the nearest Axis Bank branch (agri desk) and ask for the Kisan Credit Card application form",
        "Fill out the form and submit it with land documents, Aadhaar, PAN and other KYC proofs",
        "Axis Bank conducts field verification of your land and cropping pattern",
        "Credit limit is approved as per landholding and crop needs; the Axis KCC card is issued"
      ]
    },
    {
      loanName: "ICICI Kisan Credit Card",
      steps: [
        "Visit the rural/agri branch of ICICI Bank and obtain the KCC application form",
        "Submit the completed form along with copies of land records, Aadhaar/ID and a farming/cropping plan",
        "An ICICI Bank officer will inspect your land and verify the farming details",
        "The credit limit is decided based on your land and needs, and the Kisan Credit Card is issued upon approval"
      ]
    },
    {
      loanName: "ICICI Tractor Loan",
      steps: [
        "Visit an ICICI Bank rural/agri branch or a tractor dealership with your tractor choice and quotation",
        "Fill out the tractor loan application and submit KYC, income proof and landholding documents",
        "ICICI Bank verifies your eligibility (including credit score and income) and the dealer's price quote",
        "If approved, the loan amount (typically up to 90% of the tractor cost) is paid directly to the dealer"
      ]
    },
    {
      loanName: "Bank of Baroda Agriculture Loan",
      steps: [
        "Visit your nearest Bank of Baroda branch and decide on the type of agriculture loan needed (crop, equipment, etc.)",
        "Submit a detailed project plan or cost estimates along with KYC documents and land/asset proofs",
        "Bank of Baroda assesses your repayment capacity and the feasibility of the project",
        "Upon manager approval, the loan is sanctioned and disbursed to your nominated account"
      ]
    },
    {
      loanName: "PNB Krishi Tatkal Loan",
      steps: [
        "Ensure you are an existing Punjab National Bank account holder",
        "Visit the PNB branch and request the special Krishi Tatkal loan form",
        "Submit the short-form application with KYC documents and recent account statements",
        "PNB provides quick approval (usually within 24 hours) and credits the loan amount to your account"
      ]
    },
    {
      loanName: "PNB Kisan Credit Card",
      steps: [
        "Visit the PNB agricultural finance branch or agriculture desk and apply for the KCC",
        "Fill out the Kisan Credit Card application form and submit it with Aadhaar, PAN and land records",
        "PNB verifies your cropping pattern and land details",
        "The KCC limit is sanctioned based on land and crop economics; the card is issued after approval"
      ]
    },
    {
      loanName: "NABARD Poultry Loan",
      steps: [
        "Prepare a detailed project report for your poultry farm including cost estimates",
        "Approach a commercial bank co-opted by NABARD (e.g. SBI/PNB/BOB) for poultry loans",
        "Submit the NABARD poultry subsidy scheme form along with your project report and KYC documents",
        "The bank evaluates project feasibility; upon sanction, the loan is disbursed and NABARD subsidy is credited as applicable"
      ]
    },
    {
      loanName: "NABARD Dairy Entrepreneurship Loan",
      steps: [
        "Develop a comprehensive dairy farm project plan with cost and capacity details",
        "Apply through a bank branch under NABARD's Dairy Entrepreneurship Development Scheme (DEDS)",
        "Submit KYC, project report and equipment quotations to the bank",
        "Bank officials inspect the proposed site; if approved, loan is sanctioned",
        "NABARD subsidy (usually a percentage of the project cost) is released after the unit is set up"
      ]
    },
    {
      loanName: "IDBI Agriculture Loan",
      steps: [
        "Visit your nearest IDBI Bank branch and select the specific agriculture loan product you need",
        "Submit the loan application form with KYC documents, land/asset papers, and a project or purpose plan",
        "IDBI officials verify the documents and may carry out a field inspection",
        "Once approved, the loan is sanctioned and the funds are disbursed to your account"
      ]
    },
    {
      loanName: "Kotak Mahindra Tractor Loan",
      steps: [
        "Go to a Kotak Mahindra Bank branch or a qualified tractor dealer with your chosen tractor model",
        "Fill the tractor loan application and submit KYC, proof of landholding and the tractor quotation",
        "Kotak Bank assesses your eligibility (including income and credit score) and the dealer's quote",
        "On approval, the loan (up to a high percentage of the tractor cost) is disbursed to the dealer for delivery"
      ]
    },
    {
      loanName: "Union Bank Agriculture Loan",
      steps: [
        "Visit the nearest Union Bank branch and apply for the suitable farm/agriculture loan product",
        "Submit the application with land documents, cropping/business plan and KYC proofs",
        "A Union Bank field officer may inspect your land; the bank reviews your repayment capacity",
        "Once approved under the priority sector, the loan amount is credited to your account"
      ]
    },
    {
      loanName: "Canara Bank KCC",
      steps: [
        "Visit your nearest Canara Bank branch and request a Kisan Credit Card application form",
        "Fill in the form and submit it along with identity proof and land ownership documents",
        "Canara Bank verifies your eligibility and land details (no collateral needed up to specified limits)",
        "Upon approval, the Kisan Credit Card is sanctioned and issued for your agricultural needs"
      ]
    }
  ];

  const loanEligibilityData = [
    {
      "loan_name": "Kisan Credit Card (KCC)",
      "provider": "All Banks",
      "eligibility": {
        "farmer_type": "All farmers (owner/tenant/sharecropper)",
        "age": "18-75 years",
        "documents": ["Land records", "ID proof", "Address proof"],
        "credit_score_required": "Not mandatory",
        "special": "Senior citizen (60-75) needs co-borrower"
      }
    },
    {
      "loan_name": "PM Fasal Bima Yojana – Claim Loan Support",
      "provider": "Government",
      "eligibility": {
        "farmer_type": "All insured farmers",
        "criteria": ["Crop must be registered under PMFBY", "Premium paid"],
        "documents": ["Insurance slip", "Land papers", "Bank passbook"]
      }
    },
    {
      "loan_name": "PM Kisan Credit Loan – Additional Limit",
      "provider": "Government + Banks",
      "eligibility": {
        "farmer_type": "PM Kisan beneficiaries",
        "criteria": ["Name must be verified under PM Kisan", "Aadhaar linked"],
        "documents": ["PM Kisan ID", "Land records", "Bank passbook"]
      }
    },
    {
      "loan_name": "SBI Crop Loan",
      "provider": "State Bank of India",
      "eligibility": {
        "farmer_type": "Owner/tenant farmers",
        "land_size": "Minimum 0.5 acre",
        "documents": ["KYC", "Land documents", "Crop plan"],
        "credit_score_required": "Basic CIBIL check"
      }
    },
    {
      "loan_name": "SBI KCC Dairy Loan",
      "provider": "State Bank of India",
      "eligibility": {
        "farmer_type": "Dairy farmers",
        "documents": ["Livestock ownership proof", "KYC"],
        "collateral": "Not required up to ₹1.6 lakhs"
      }
    },
    {
      "loan_name": "HDFC Tractor Loan",
      "provider": "HDFC Bank",
      "eligibility": {
        "farmer_type": "Farm owners",
        "age": "18-60 years",
        "income_proof": "Basic income proof required",
        "down_payment": "15-25%"
      }
    },
    {
      "loan_name": "HDFC Kisan Gold Card",
      "provider": "HDFC Bank",
      "eligibility": {
        "farmer_type": "Cultivating owners/tenants",
        "documents": ["Land records", "KYC"],
        "loan_limit_based_on": "Landholding + crop pattern"
      }
    },
    {
      "loan_name": "Axis Bank Agriculture Term Loan",
      "provider": "Axis Bank",
      "eligibility": {
        "purpose": "Equipment, irrigation, farm development",
        "farmer_type": "Owner cultivators",
        "documents": ["Land documents", "KYC", "Quotation of equipment"]
      }
    },
    {
      "loan_name": "Axis Bank Kisan Credit Card",
      "provider": "Axis Bank",
      "eligibility": {
        "farmer_type": "Crop cultivators",
        "land_proof_required": true,
        "age": "18-75 years"
      }
    },
    {
      "loan_name": "ICICI Kisan Credit Card",
      "provider": "ICICI Bank",
      "eligibility": {
        "farmer_type": "Owner/tenant farmers",
        "landholding": "Mandatory",
        "documents": ["KYC", "Land papers"]
      }
    },
    {
      "loan_name": "ICICI Tractor Loan",
      "provider": "ICICI Bank",
      "eligibility": {
        "farmer_type": "Owners/operators",
        "down_payment": "10-25%",
        "documents": ["ID proof", "Address proof", "Land proof"]
      }
    },
    {
      "loan_name": "Bank of Baroda Agriculture Loan",
      "provider": "BoB",
      "eligibility": {
        "farmer_type": "Small/marginal farmers",
        "documents": ["Land documents", "KYC"],
        "collateral": "NIL up to ₹1.6 lakhs"
      }
    },
    {
      "loan_name": "PNB Krishi Tatkal Loan",
      "provider": "Punjab National Bank",
      "eligibility": {
        "criteria": ["Existing PNB farmer customer"],
        "documents": ["KYC", "Account statement"],
        "limit": "₹50,000 - ₹1,00,000"
      }
    },
    {
      "loan_name": "PNB KCC",
      "provider": "Punjab National Bank",
      "eligibility": {
        "farmer_type": "Owner cultivators",
        "documents": ["Land records", "KYC"],
        "age": "18-75 years"
      }
    },
    {
      "loan_name": "NABARD Poultry Loan",
      "provider": "NABARD",
      "eligibility": {
        "farmer_type": "Poultry farmers",
        "documents": ["Farm plan", "KYC"],
        "subsidy_available": true
      }
    },
    {
      "loan_name": "NABARD Dairy Entrepreneurship Development Loan",
      "provider": "NABARD",
      "eligibility": {
        "purpose": "Dairy farm setup",
        "documents": ["Project report", "KYC"],
        "subsidy": "25-33% depending on category"
      }
    },
    {
      "loan_name": "IDBI Agriculture Loan",
      "provider": "IDBI Bank",
      "eligibility": {
        "farmer_type": "Cultivators",
        "documents": ["Land proof", "KYC"],
        "purpose": "Irrigation, equipment, crop production"
      }
    },
    {
      "loan_name": "Kotak Mahindra Tractor Loan",
      "provider": "Kotak Bank",
      "eligibility": {
        "farmer_type": "Farm owners",
        "documents": ["Land records", "KYC"],
        "down_payment": "15-25%"
      }
    },
    {
      "loan_name": "Union Bank Agriculture Loan",
      "provider": "Union Bank of India",
      "eligibility": {
        "farmer_type": "Small and marginal farmers",
        "documents": ["Land records", "Crop plan"],
        "collateral": "Not needed up to ₹1.6 lakhs"
      }
    },
    {
      "loan_name": "Canara Bank KCC",
      "provider": "Canara Bank",
      "eligibility": {
        "farmer_type": "Crop farmers",
        "age": "18-75 years",
        "documents": ["KYC", "Land documents"]
      }
    }
  ];

  const applicationSteps = [
    { step: 1, title: 'Choose Loan Type', description: 'Select appropriate loan based on your needs' },
    { step: 2, title: 'Select Bank', description: 'Visit any nationalized or private bank branch' },
    { step: 3, title: 'Fill Application', description: 'Complete application form with all details' },
    { step: 4, title: 'Submit Documents', description: 'Land records, ID, address, income documents' },
    { step: 5, title: 'Field Verification', description: 'Bank conducts field verification if needed' },
    { step: 6, title: 'Approval', description: 'Loan approved by bank credit committee' },
    { step: 7, title: 'Disbursement', description: 'Amount credited to your bank account' },
  ];

  const faqs = [
    {
      q: 'What\'s the difference between KCC and Agricultural Term Loan?',
      a: 'KCC is for short-term seasonal needs (12 months), while Agricultural Term Loan is for long-term investment (3-7 years) like buying machinery or developing land.',
    },
    {
      q: 'Can I get subsidy on loan?',
      a: 'Yes! Under AIBP scheme, farmers get 2% interest subsidy. Women farmers get additional 1% subsidy. Marginal farmers get up to 5% subsidy.',
    },
    {
      q: 'What if my loan application is rejected?',
      a: 'You can appeal to the bank. Improve credit score, get co-borrower, increase collateral, or try microfinance options like MUDRA.',
    },
    {
      q: 'How quickly can I get the loan?',
      a: 'KCC typically takes 7-14 days. Personal loans take 3-5 days. Collateral-based loans take 15-30 days depending on verification.',
    },
  ];

  return (
    <div className="min-h-screen bg-white bg-cover bg-fixed" style={{ backgroundImage: 'url(/images/services/Loan\\ \\&\\ Credit\\ Guidance.webp)' }}>
      <Navbar />

      {/* Hero Section - Sticky */}
      <section 
        className="sticky top-20 z-40 text-white pt-8 pb-8 px-4 lg:px-6"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="text-6xl drop-shadow-lg">💰</div>
            <div>
              <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">Loan & Credit Guidance</h1>
              <p className="text-lg drop-shadow">
                KCC, agricultural loans & credit options explained.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12 bg-white/98 backdrop-blur-sm rounded-t-2xl relative z-10">
        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-smooth flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-green-700 text-green-700'
                  : 'border-transparent text-textLight hover:text-textDark'
              }`}
              aria-selected={activeTab === tab.id}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Loan Types Tab */}
            {activeTab === 'types' && (
              <div className="space-y-6">
                <h3 className="text-h3 font-bold text-textDark mb-6">Available Loan & Credit Options</h3>
                {allLoans.slice(0, 5).map((loan, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-smooth">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-lg font-bold text-textDark">{loan.name}</h4>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full whitespace-nowrap ml-2">
                        {loan.bank.split(' (')[0]}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-textLight font-semibold">Loan Limit</p>
                        <p className="text-sm font-bold text-textDark mt-1">{loan.limit}</p>
                      </div>
                      <div>
                        <p className="text-xs text-textLight font-semibold">Interest Rate</p>
                        <p className="text-sm font-bold text-textDark mt-1">{loan.rate.substring(0, 20)}...</p>
                      </div>
                      <div>
                        <p className="text-xs text-textLight font-semibold">Repayment</p>
                        <p className="text-sm font-bold text-textDark mt-1">{loan.repayment}</p>
                      </div>
                    </div>

                    <div className="mb-4 p-3 bg-gray-50 rounded">
                      <p className="text-xs text-textLight font-semibold mb-2">Available For</p>
                      <p className="text-sm text-textDark">{loan.uses}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-textLight font-semibold mb-2">Key Benefits</p>
                      <ul className="space-y-1">
                        {loan.pros.map((pro, idx) => (
                          <li key={idx} className="flex gap-2 text-sm text-textDark">
                            <span className="text-green-600 font-bold">✓</span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-2">
                      {loan.website && (
                        <a
                          href={loan.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-4 py-2 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800 transition-smooth text-center text-sm"
                        >
                          Learn More
                        </a>
                      )}
                      {loan.form && (
                        <a
                          href={loan.form}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-smooth text-center text-sm"
                        >
                          Download Form
                        </a>
                      )}
                    </div>
                  </div>
                ))}
                <p className="text-center text-sm text-textLight">
                  📚 See the <strong className="text-green-700 cursor-pointer" onClick={() => setActiveTab('directory')}>Loan Directory</strong> for all {allLoans.length} loans
                </p>
              </div>
            )}

            {/* Loan Directory Tab */}
            {activeTab === 'directory' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-h3 font-bold text-textDark">Complete Loan Directory</h3>
                  
                  {/* Search and Filter */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Search by loan name or type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <select
                        value={filterBank}
                        onChange={(e) => setFilterBank(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
                      >
                        <option value="all">All Banks</option>
                        <option value="SBI">State Bank of India (SBI)</option>
                        <option value="IDBI">IDBI Bank</option>
                        <option value="Axis">Axis Bank</option>
                        <option value="PNB">Punjab National Bank (PNB)</option>
                        <option value="Government">Government Schemes</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Loan Cards */}
                <div className="space-y-3">
                  {allLoans
                    .filter((loan) => {
                      const matchesSearch =
                        loan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        loan.type.toLowerCase().includes(searchTerm.toLowerCase());
                      const matchesBank = filterBank === 'all' || loan.bank.includes(filterBank);
                      return matchesSearch && matchesBank;
                    })
                    .map((loan, idx) => (
                      <div
                        key={idx}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-smooth"
                      >
                        <button
                          onClick={() => setExpandedLoan(expandedLoan === idx ? null : idx)}
                          className="w-full px-6 py-4 flex items-start justify-between hover:bg-gray-50 transition-smooth text-left"
                        >
                          <div className="flex-1">
                            <h4 className="font-bold text-textDark mb-1 flex items-center gap-2">
                              {loan.name}
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded font-normal">
                                {loan.type}
                              </span>
                            </h4>
                            <div className="grid grid-cols-3 gap-4 mt-2">
                              <p className="text-xs text-textLight">
                                <span className="font-semibold">Limit:</span> {loan.limit}
                              </p>
                              <p className="text-xs text-textLight">
                                <span className="font-semibold">Rate:</span> {loan.rate.substring(0, 15)}...
                              </p>
                              <p className="text-xs text-textLight">
                                <span className="font-semibold">Tenure:</span> {loan.repayment}
                              </p>
                            </div>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <span className="text-xl">{expandedLoan === idx ? '▼' : '▶'}</span>
                          </div>
                        </button>

                        {expandedLoan === idx && (
                          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 space-y-4">
                            <div>
                              <p className="text-xs font-semibold text-textLight mb-1">Provider</p>
                              <p className="text-sm text-textDark">{loan.bank}</p>
                            </div>

                            <div>
                              <p className="text-xs font-semibold text-textLight mb-1">Interest Rate</p>
                              <p className="text-sm text-textDark">{loan.rate}</p>
                            </div>

                            <div>
                              <p className="text-xs font-semibold text-textLight mb-1">Eligible For</p>
                              <p className="text-sm text-textDark">{loan.uses}</p>
                            </div>

                            <div>
                              <p className="text-xs font-semibold text-textLight mb-2">Key Benefits</p>
                              <ul className="space-y-1">
                                {loan.pros.map((pro, pidx) => (
                                  <li key={pidx} className="flex gap-2 text-sm text-textDark">
                                    <span className="text-green-600">✓</span>
                                    {pro}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="flex gap-2 pt-4 border-t border-gray-300">
                              {loan.website && (
                                <a
                                  href={loan.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 px-4 py-2 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800 transition-smooth text-center text-sm"
                                >
                                  Visit Website
                                </a>
                              )}
                              {loan.form && (
                                <a
                                  href={loan.form}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-smooth text-center text-sm"
                                >
                                  Application Form
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>

                <div className="text-center py-6 text-sm text-textLight">
                  Found {allLoans.filter((loan) => {
                    const matchesSearch = loan.name.toLowerCase().includes(searchTerm.toLowerCase()) || loan.type.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesBank = filterBank === 'all' || loan.bank.includes(filterBank);
                    return matchesSearch && matchesBank;
                  }).length} loans matching your criteria
                </div>
              </div>
            )}

            {/* Eligibility Tab */}
            {activeTab === 'eligibility' && (
              <div className="space-y-6">
                <h3 className="text-h3 font-bold text-textDark mb-4">Loan Eligibility Criteria by Loan Type</h3>
                <p className="text-sm text-textLight mb-6">Below are eligibility criteria for various agricultural loans from different banks and government schemes.</p>
                
                <div className="space-y-4">
                  {loanEligibilityData.map((loan, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-smooth"
                    >
                      <button
                        onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                        className="w-full px-6 py-4 flex items-start justify-between hover:bg-gray-50 transition-smooth text-left"
                      >
                        <div className="flex-1">
                          <h4 className="font-bold text-textDark mb-1">{loan.loan_name}</h4>
                          <p className="text-xs text-textLight">
                            <span className="font-semibold">Provider:</span> {loan.provider}
                          </p>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <span className="text-xl">{expandedFAQ === idx ? '▼' : '▶'}</span>
                        </div>
                      </button>

                      {expandedFAQ === idx && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 space-y-4">
                          {loan.eligibility.farmer_type && (
                            <div>
                              <p className="text-xs font-semibold text-green-700 mb-1">👨‍🌾 Farmer Type</p>
                              <p className="text-sm text-textDark">{loan.eligibility.farmer_type}</p>
                            </div>
                          )}

                          {loan.eligibility.age && (
                            <div>
                              <p className="text-xs font-semibold text-green-700 mb-1">📅 Age</p>
                              <p className="text-sm text-textDark">{loan.eligibility.age}</p>
                            </div>
                          )}

                          {loan.eligibility.land_size && (
                            <div>
                              <p className="text-xs font-semibold text-green-700 mb-1">🌾 Land Size</p>
                              <p className="text-sm text-textDark">{loan.eligibility.land_size}</p>
                            </div>
                          )}

                          {loan.eligibility.landholding && (
                            <div>
                              <p className="text-xs font-semibold text-green-700 mb-1">📋 Landholding</p>
                              <p className="text-sm text-textDark">{loan.eligibility.landholding}</p>
                            </div>
                          )}

                          {loan.eligibility.purpose && (
                            <div>
                              <p className="text-xs font-semibold text-green-700 mb-1">🎯 Purpose</p>
                              <p className="text-sm text-textDark">{loan.eligibility.purpose}</p>
                            </div>
                          )}

                          {loan.eligibility.criteria && loan.eligibility.criteria.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-green-700 mb-2">✓ Criteria</p>
                              <ul className="space-y-1">
                                {loan.eligibility.criteria.map((criterion, cidx) => (
                                  <li key={cidx} className="flex gap-2 text-sm text-textDark">
                                    <span className="text-green-600">✓</span>
                                    {criterion}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {loan.eligibility.documents && loan.eligibility.documents.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-green-700 mb-2">📄 Required Documents</p>
                              <ul className="space-y-1">
                                {loan.eligibility.documents.map((doc, didx) => (
                                  <li key={didx} className="flex gap-2 text-sm text-textDark">
                                    <span className="text-green-600">✓</span>
                                    {doc}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {loan.eligibility.credit_score_required && (
                            <div>
                              <p className="text-xs font-semibold text-green-700 mb-1">💯 Credit Score</p>
                              <p className="text-sm text-textDark">{loan.eligibility.credit_score_required}</p>
                            </div>
                          )}

                          {loan.eligibility.special && (
                            <div className="bg-yellow-50 p-3 rounded border-l-2 border-yellow-500">
                              <p className="text-xs font-semibold text-yellow-800 mb-1">⚠️ Special Condition</p>
                              <p className="text-sm text-yellow-700">{loan.eligibility.special}</p>
                            </div>
                          )}

                          {loan.eligibility.collateral && (
                            <div>
                              <p className="text-xs font-semibold text-green-700 mb-1">🔐 Collateral</p>
                              <p className="text-sm text-textDark">{loan.eligibility.collateral}</p>
                            </div>
                          )}

                          {loan.eligibility.income_proof && (
                            <div>
                              <p className="text-xs font-semibold text-green-700 mb-1">💰 Income Proof</p>
                              <p className="text-sm text-textDark">{loan.eligibility.income_proof}</p>
                            </div>
                          )}

                          {loan.eligibility.down_payment && (
                            <div>
                              <p className="text-xs font-semibold text-green-700 mb-1">💳 Down Payment</p>
                              <p className="text-sm text-textDark">{loan.eligibility.down_payment}</p>
                            </div>
                          )}

                          {loan.eligibility.subsidy && (
                            <div className="bg-green-50 p-3 rounded border-l-2 border-green-500">
                              <p className="text-xs font-semibold text-green-800 mb-1">🎁 Subsidy</p>
                              <p className="text-sm text-green-700">{loan.eligibility.subsidy}</p>
                            </div>
                          )}

                          {loan.eligibility.subsidy_available && (
                            <div className="bg-green-50 p-3 rounded border-l-2 border-green-500">
                              <p className="text-xs font-semibold text-green-800 mb-1">🎁 Subsidy Available</p>
                              <p className="text-sm text-green-700">Yes, subsidies are available under this scheme</p>
                            </div>
                          )}

                          {loan.eligibility.loan_limit_based_on && (
                            <div>
                              <p className="text-xs font-semibold text-green-700 mb-1">💹 Loan Limit Based On</p>
                              <p className="text-sm text-textDark">{loan.eligibility.loan_limit_based_on}</p>
                            </div>
                          )}

                          {loan.eligibility.limit && (
                            <div>
                              <p className="text-xs font-semibold text-green-700 mb-1">💰 Loan Limit</p>
                              <p className="text-sm text-textDark">{loan.eligibility.limit}</p>
                            </div>
                          )}

                          {loan.eligibility.land_proof_required && (
                            <div>
                              <p className="text-xs font-semibold text-green-700 mb-1">📋 Land Proof Required</p>
                              <p className="text-sm text-textDark">Yes, mandatory</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 mt-8">
                  <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <span>📋</span>
                    General Requirements for Most Agricultural Loans
                  </h4>
                  <div className="space-y-2 text-sm text-blue-800">
                    <p>✓ <strong>Age:</strong> Most loans require you to be 18-75 years old</p>
                    <p>✓ <strong>Land Records:</strong> Essential for all crop loans (Patta, FMB, Lampsum, etc.)</p>
                    <p>✓ <strong>KYC Documents:</strong> Aadhaar, Voter ID, Driving License, or PAN</p>
                    <p>✓ <strong>Address Proof:</strong> Bill, lease agreement, or official documents</p>
                    <p>✓ <strong>Bank Account:</strong> Active savings account in any nationalized/private bank</p>
                    <p>✓ <strong>Credit History:</strong> Should have no defaults or NPAs in last 2 years</p>
                    <p>✓ <strong>Collateral:</strong> Usually NOT required for loans up to ₹1.6 lakhs</p>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6 border border-green-200 mt-6">
                  <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                    <span>💡</span>
                    Interest Subsidies & Special Benefits
                  </h4>
                  <div className="space-y-2 text-sm text-green-800">
                    <p>✓ <strong>General Farmers:</strong> 2% subsidy on loans up to ₹3 lakh</p>
                    <p>✓ <strong>Women Farmers:</strong> 2% + 1% additional = 3% subsidy</p>
                    <p>✓ <strong>SC/ST Farmers:</strong> Additional 1% subsidy</p>
                    <p>✓ <strong>Marginal Farmers:</strong> Up to 5% subsidy on ₹1 lakh loan</p>
                    <p>✓ <strong>New Farmers:</strong> Special schemes with flexible eligibility</p>
                    <p>✓ <strong>Senior Citizens (60-75):</strong> May need a co-borrower</p>
                  </div>
                </div>
              </div>
            )}

            {/* Application Process Tab */}
            {activeTab === 'process' && (
              <div className="space-y-6">
                <h3 className="text-h3 font-bold text-textDark mb-4">How to Apply for Agricultural Loans</h3>
                <p className="text-sm text-textLight mb-6">Step-by-step guide on how to apply for different agricultural loans from various banks. Click on a loan to see the application process.</p>

                <div className="space-y-3">
                  {howToApplyData.map((loan, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-smooth"
                    >
                      <button
                        onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                        className="w-full px-6 py-4 flex items-start justify-between hover:bg-gray-50 transition-smooth text-left"
                      >
                        <div className="flex-1">
                          <h4 className="font-bold text-textDark">{loan.loanName}</h4>
                          <p className="text-xs text-textLight mt-1">{loan.steps.length} steps to apply</p>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <span className="text-xl">{expandedFAQ === idx ? '▼' : '▶'}</span>
                        </div>
                      </button>

                      {expandedFAQ === idx && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 space-y-4">
                          <div className="space-y-3">
                            {loan.steps.map((step, stepIdx) => (
                              <div key={stepIdx} className="flex gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                  {stepIdx + 1}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-textDark">{step}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200 mt-8">
                  <h4 className="font-bold text-yellow-900 mb-3 flex items-center gap-2">
                    <span>⏰</span> Processing Timeline
                  </h4>
                  <div className="space-y-2 text-sm text-yellow-800">
                    <p>• KCC Processing: 7-14 days</p>
                    <p>• Agricultural Term Loan: 15-30 days</p>
                    <p>• Tractor/Equipment Loan: 15-30 days</p>
                    <p>• PMFBY Insurance Claim: 30-45 days</p>
                    <p>• NABARD Subsidy Loans: 45-60 days</p>
                    <p>• First disbursement: 1-5 days after approval</p>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6 border border-green-200 mt-6">
                  <h4 className="font-bold text-green-900 mb-3">📋 Common Documents Required</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-sm text-green-800">Land records (Patta, FMB, Lampsum)</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-sm text-green-800">Aadhaar/Voter ID/Driving License</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-sm text-green-800">Address proof (bill, rent agreement)</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-sm text-green-800">Bank account passbook</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-sm text-green-800">PAN/Income tax return (if applicable)</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-sm text-green-800">Recent color photographs</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-sm text-green-800">Equipment quotation (if applicable)</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-sm text-green-800">Project plan (for term loans)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 mt-6">
                  <h4 className="font-bold text-blue-900 mb-3">💡 Tips for Faster Approval</h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>✓ Submit complete and accurate documents on first visit</li>
                    <li>✓ Prepare land records and documents beforehand</li>
                    <li>✓ Maintain good relationship with your bank</li>
                    <li>✓ Have good credit history (no defaults)</li>
                    <li>✓ Apply before crop sowing season</li>
                    <li>✓ Consider getting a co-borrower if eligible</li>
                    <li>✓ Keep all documents organized and ready</li>
                    <li>✓ Follow up regularly with the bank</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* CTA Box */}
              <div className="bg-green-700 text-white rounded-lg p-6 space-y-4">
                <h4 className="font-bold text-lg">Get a Loan</h4>
                <p className="text-sm opacity-90">Apply for KCC or agricultural loan</p>
                <button className="w-full bg-white text-green-700 font-semibold py-2 rounded-lg hover:bg-gray-100 transition-smooth focus-ring">
                  Apply Now
                </button>
              </div>

              {/* Quick Comparison */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 space-y-4">
                <h4 className="font-bold text-textDark">KCC vs Term Loan</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-bold text-green-700">KCC (Kisan Credit Card)</p>
                    <p className="text-xs text-textLight mt-1">• Seasonal/short-term</p>
                    <p className="text-xs text-textLight">• Max 12 months</p>
                    <p className="text-xs text-textLight">• For inputs & working capital</p>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <p className="text-xs font-bold text-green-700">Term Loan</p>
                    <p className="text-xs text-textLight mt-1">• Long-term investment</p>
                    <p className="text-xs text-textLight">• 3-7 years</p>
                    <p className="text-xs text-textLight">• For machinery, irrigation, land</p>
                  </div>
                </div>
              </div>

              {/* Banks List */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h5 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  Participating Banks
                </h5>
                <p className="text-xs text-blue-800">All nationalized banks, private banks, cooperative banks, and microfinance institutions offer these loans.</p>
              </div>

              {/* Repayment Tips */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h5 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <span>💡</span> Repayment Tips
                </h5>
                <ul className="text-xs text-green-800 space-y-1">
                  <li>• Set up auto-debit for timely payment</li>
                  <li>• Repay on schedule to maintain credit</li>
                  <li>• Keep loan documents safe</li>
                  <li>• Get repayment certificate after closure</li>
                </ul>
              </div>

              {/* FAQs */}
              <div className="space-y-3">
                <h4 className="font-bold text-textDark">FAQs</h4>
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                      className="w-full px-3 py-3 flex items-start gap-2 hover:bg-gray-50 transition-smooth text-left"
                    >
                      <span className="flex-shrink-0">❓</span>
                      <span className="font-medium text-xs text-textDark">{faq.q}</span>
                    </button>
                    {expandedFAQ === idx && (
                      <div className="px-3 py-3 bg-gray-50 border-t border-gray-200 text-xs text-textLight">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

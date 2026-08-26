'use client';

import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import Link from 'next/link';
import { 
  User, 
  Phone, 
  Calendar, 
  MapPin, 
  Activity, 
  AlertTriangle, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  HeartPulse,
  UserCheck,
  Clock,
  Info,
  Search,
  Check
} from 'lucide-react';

// Grouped and Categorized Medical Options with Patient Guidance Subtexts & Search Keywords
const groupedConditionOptions = [
  {
    label: '🩺 Cardiovascular & Blood Pressure',
    options: [
      { value: 'High BP (Hypertension)', label: 'High BP (Hypertension)', subtext: 'Consistently high blood pressure (140/90+)', keywords: 'bp blood pressure high hypertension' },
      { value: 'Low BP (Hypotension)', label: 'Low BP (Hypotension)', subtext: 'Consistently low blood pressure (below 90/60)', keywords: 'bp blood pressure low hypotension' },
      { value: 'Blood Pressure Condition (General/Unspecified)', label: 'Blood Pressure Condition (General)', subtext: 'Not sure if high or low BP', keywords: 'bp blood pressure general' },
      { value: 'Coronary Artery / Heart Disease', label: 'Heart Disease / CAD', subtext: 'Blockage in heart arteries, chest pain, stent', keywords: 'heart cad chest pain angina' },
      { value: 'High Cholesterol (Hyperlipidemia)', label: 'High Cholesterol', subtext: 'Elevated blood lipids/fats', keywords: 'cholesterol lipid fat' },
      { value: 'Heart Arrhythmia / Irregular Heartbeat', label: 'Heart Arrhythmia', subtext: 'Irregular or rapid heart rhythm', keywords: 'heart rhythm arrhythmia pulse' },
    ]
  },
  {
    label: '🩸 Endocrine & Diabetes',
    options: [
      { value: 'Type 2 Diabetes', label: 'Type 2 Diabetes', subtext: 'High blood sugar (insulin resistance / lifestyle)', keywords: 'sugar diabetes type 2' },
      { value: 'Type 1 Diabetes', label: 'Type 1 Diabetes', subtext: 'Autoimmune diabetes (insulin dependent)', keywords: 'sugar diabetes type 1 insulin' },
      { value: 'Diabetes (General/Unspecified)', label: 'Diabetes (Unspecified Type)', subtext: 'High blood sugar, type not specified', keywords: 'sugar diabetes' },
      { value: 'Hypothyroidism (Underactive)', label: 'Thyroid - Hypothyroidism', subtext: 'Sluggish thyroid (weight gain, fatigue)', keywords: 'thyroid hypo sluggish' },
      { value: 'Hyperthyroidism (Overactive)', label: 'Thyroid - Hyperthyroidism', subtext: 'Overactive thyroid (rapid heart, weight loss)', keywords: 'thyroid hyper' },
      { value: 'Thyroid Disorder (General/Unspecified)', label: 'Thyroid Disorder (General)', subtext: 'Not sure if hypo or hyper', keywords: 'thyroid general' },
      { value: 'PCOS / PCOD', label: 'PCOS / PCOD', subtext: 'Polycystic ovary syndrome', keywords: 'pcos pcod hormonal' },
    ]
  },
  {
    label: '🫁 Respiratory & Lungs',
    options: [
      { value: 'Asthma', label: 'Asthma', subtext: 'Airway inflammation and wheezing', keywords: 'asthma breathing wheezing inhaler' },
      { value: 'COPD / Chronic Bronchitis', label: 'COPD / Chronic Bronchitis', subtext: 'Long-term lung or airway disease', keywords: 'copd bronchitis lungs smoker' },
      { value: 'Allergic Rhinitis / Sinusitis', label: 'Sinusitis / Allergic Rhinitis', subtext: 'Chronic sinus inflammation or nasal allergies', keywords: 'sinus allergy nose rhinitis' },
      { value: 'Sleep Apnea', label: 'Sleep Apnea', subtext: 'Breathing pauses during sleep', keywords: 'sleep apnea snoring' },
    ]
  },
  {
    label: '🧠 Neurological & Mental Health',
    options: [
      { value: 'Migraine / Chronic Headaches', label: 'Migraine', subtext: 'Severe recurring headaches', keywords: 'headache migraine neuro' },
      { value: 'Epilepsy / Seizures', label: 'Epilepsy / Seizures', subtext: 'Seizure disorder', keywords: 'seizure epilepsy fit' },
      { value: 'Anxiety / Depression', label: 'Anxiety / Depression', subtext: 'Mood or anxiety disorder', keywords: 'anxiety depression stress' },
      { value: 'Vertigo / Balance Disorder', label: 'Vertigo', subtext: 'Dizziness or spinning sensation', keywords: 'vertigo dizziness balance' },
    ]
  },
  {
    label: '🦴 Joints & Musculoskeletal',
    options: [
      { value: 'Osteoarthritis', label: 'Osteoarthritis', subtext: 'Joint wear and tear / knee pain', keywords: 'joint pain arthritis knee' },
      { value: 'Rheumatoid Arthritis', label: 'Rheumatoid Arthritis', subtext: 'Autoimmune joint inflammation', keywords: 'arthritis ra joint autoimmune' },
      { value: 'Gout / Uric Acid', label: 'Gout / High Uric Acid', subtext: 'Joint inflammation from uric crystals', keywords: 'gout uric acid toe' },
      { value: 'Osteoporosis', label: 'Osteoporosis', subtext: 'Weak or brittle bones', keywords: 'bone osteoporosis fracture' },
    ]
  },
  {
    label: '🧪 Gastrointestinal & Kidney',
    options: [
      { value: 'Chronic Kidney Disease (CKD)', label: 'Chronic Kidney Disease (CKD)', subtext: 'Kidney dysfunction or high creatinine', keywords: 'kidney ckd renal creatinine' },
      { value: 'GERD / Acid Reflux', label: 'GERD / Acid Reflux', subtext: 'Frequent heartburn or stomach acid', keywords: 'acid reflux gerd acidity stomach' },
      { value: 'Fatty Liver Disease', label: 'Fatty Liver Disease', subtext: 'Hepatic steatosis / liver fat', keywords: 'liver fatty liver sgpt' },
      { value: 'IBS / Inflammatory Bowel', label: 'IBS / Inflammatory Bowel', subtext: 'Irritable bowel syndrome', keywords: 'ibs bowel digestion stomach' },
    ]
  }
];

const groupedAllergyOptions = [
  {
    label: '💊 Medication & Antibiotics',
    options: [
      { value: 'Penicillin / Amoxicillin', label: 'Penicillin / Amoxicillin', subtext: 'Beta-lactam antibiotic allergy', keywords: 'penicillin amoxicillin antibiotic' },
      { value: 'Sulfa Drugs / Trimethoprim', label: 'Sulfa Drugs', subtext: 'Sulfonamide antibiotics', keywords: 'sulfa septran antibiotic' },
      { value: 'Aspirin / NSAIDs (Ibuprofen)', label: 'Aspirin / NSAIDs / Painkillers', subtext: 'Painkiller sensitivity', keywords: 'aspirin nsaid ibuprofen brufen painkiller' },
      { value: 'Codeine / Morphine / Opioids', label: 'Opioids (Codeine / Morphine)', subtext: 'Narcotic painkiller allergy', keywords: 'codeine morphine opioid' },
      { value: 'Other Drug Allergy', label: 'Other Drug Allergy (Specify below)', subtext: 'Any other prescription drug', keywords: 'other drug medicine allergy' },
    ]
  },
  {
    label: '🥜 Food & Dietary',
    options: [
      { value: 'Peanuts & Tree Nuts', label: 'Peanuts & Tree Nuts', subtext: 'Peanuts, almonds, walnuts, etc.', keywords: 'peanut nut almond cashew' },
      { value: 'Lactose / Dairy Intolerance', label: 'Lactose / Dairy Intolerance', subtext: 'Milk, cheese, butter allergy or lactose intolerance', keywords: 'milk lactose dairy cheese' },
      { value: 'Gluten / Wheat (Celiac)', label: 'Gluten / Wheat Allergy', subtext: 'Celiac disease or wheat sensitivity', keywords: 'gluten wheat celiac roti' },
      { value: 'Shellfish & Seafood', label: 'Shellfish / Fish / Seafood', subtext: 'Prawns, crab, fish allergy', keywords: 'fish shellfish seafood prawn' },
      { value: 'Eggs', label: 'Egg Allergy', subtext: 'Egg protein sensitivity', keywords: 'egg albume' },
      { value: 'Soy / Soybeans', label: 'Soy / Soybean Allergy', subtext: 'Soy products or lecithin', keywords: 'soy tofu' },
      { value: 'Other Food Allergy', label: 'Other Food Allergy (Specify below)', subtext: 'Other food item', keywords: 'other food allergy' },
    ]
  },
  {
    label: '🌿 Environmental & Contact',
    options: [
      { value: 'Latex', label: 'Latex', subtext: 'Rubber / latex gloves or medical products', keywords: 'latex glove rubber' },
      { value: 'Dust Mites & Pollen', label: 'Dust Mites / Pollen', subtext: 'Seasonal sneezing, airborne dust', keywords: 'dust pollen seasonal allergic sneezes' },
      { value: 'Mold / Fungal Spores', label: 'Mold & Fungal Spores', subtext: 'Dampness or mold allergy', keywords: 'mold fungus spores' },
      { value: 'Pet Dander (Cats / Dogs)', label: 'Pet Dander (Cats / Dogs)', subtext: 'Animal hair & skin dander', keywords: 'cat dog pet animal' },
      { value: 'Insect Stings (Bee / Wasp)', label: 'Bee / Wasp Sting Allergy', subtext: 'Severe reaction to stings', keywords: 'bee wasp sting insect' },
      { value: 'Other Environmental Allergy', label: 'Other Allergy (Specify below)', subtext: 'Any other allergen', keywords: 'other allergy' },
    ]
  }
];

// Custom Option Component for React Select to show Subtext Guidance
const CustomOption = (props: any) => {
  const { data } = props;
  return (
    <components.Option {...props}>
      <div className="flex flex-col py-0.5">
        <div className="font-semibold text-white text-sm flex items-center justify-between">
          <span>{data.label}</span>
          {props.isSelected && <Check className="w-4 h-4 text-teal-400" />}
        </div>
        {data.subtext && (
          <span className="text-[11px] text-slate-400 mt-0.5 leading-snug">
            {data.subtext}
          </span>
        )}
      </div>
    </components.Option>
  );
};

// Filter function to match input against label, value, subtext, and keywords
const customFilterOption = (option: any, rawInput: string) => {
  if (!rawInput) return true;
  const input = rawInput.toLowerCase().trim();
  const data = option.data;
  const textToSearch = `${data.label} ${data.value} ${data.subtext || ''} ${data.keywords || ''}`.toLowerCase();
  return textToSearch.includes(input);
};

export default function PatientSignup() {
  // Step: 1 = Demographics, 2 = Set Password, 3 = Success
  const [step, setStep] = useState(1);
  const [generatedUhid, setGeneratedUhid] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    age: '',
    sex: '',
    phone_number: '',
    address: '',
    customAllergy: '',
  });

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [selectedAllergies, setSelectedAllergies] = useState<any[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<any[]>([]);
  const [showCustomAllergy, setShowCustomAllergy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Category filter state for quick filtering
  const [conditionCategoryFilter, setConditionCategoryFilter] = useState('ALL');
  const [allergyCategoryFilter, setAllergyCategoryFilter] = useState('ALL');

  // Auto-calculate age whenever date of birth changes
  useEffect(() => {
    if (!formData.dob) {
      setFormData((prev) => ({ ...prev, age: '' }));
      return;
    }

    const birthDate = new Date(formData.dob);
    const today = new Date();
    
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }

    setFormData((prev) => ({ 
      ...prev, 
      age: calculatedAge >= 0 ? calculatedAge.toString() : '0' 
    }));
  }, [formData.dob]);

  // Show custom allergy input when "Other" is selected
  useEffect(() => {
    const hasOther = selectedAllergies.some((item) => item.value.toLowerCase().includes('other'));
    setShowCustomAllergy(hasOther);
  }, [selectedAllergies]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'name') {
      const filteredValue = value.replace(/[^A-Za-z\s]/g, '');
      setFormData((prev) => ({ ...prev, [name]: filteredValue }));
      return;
    }

    if (name === 'phone_number') {
      const filteredValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: filteredValue }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Step 1 submit: register demographics and generate UHID
  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    let finalAllergies = selectedAllergies
      .filter((item) => !item.value.toLowerCase().includes('other'))
      .map((item) => item.value);
    
    if (showCustomAllergy && formData.customAllergy.trim()) {
      finalAllergies.push(formData.customAllergy.trim());
    }

    const finalConditions = selectedConditions.map((item) => item.value);

    const payload = {
      name: formData.name,
      dob: formData.dob,
      sex: formData.sex,
      phone_number: formData.phone_number,
      address: formData.address,
      known_allergies: finalAllergies,
      preexisting_conditions: finalConditions,
    };

    try {
      const response = await fetch('/api/auth/patient-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Registration failed.');

      setGeneratedUhid(data.uhid);
      setStep(2);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Step 2 submit: hash and save the patient's password
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Error: Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setMessage('Error: Password must be at least 6 characters long.');
      return;
    }
    
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uhid: generatedUhid, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save password.');

      setStep(3);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter options based on category tabs
  const filteredConditionOptions = conditionCategoryFilter === 'ALL'
    ? groupedConditionOptions
    : groupedConditionOptions.filter(group => group.label.includes(conditionCategoryFilter));

  const filteredAllergyOptions = allergyCategoryFilter === 'ALL'
    ? groupedAllergyOptions
    : groupedAllergyOptions.filter(group => group.label.includes(allergyCategoryFilter));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-20 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-blue-300 bg-clip-text text-transparent">
                Digital Health Platform
              </span>
              <span className="block text-xs text-slate-400 font-medium">Unified Healthcare Network</span>
            </div>
          </Link>
          <Link 
            href="/login"
            className="text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 px-4 py-2 rounded-lg transition flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4 text-teal-400" />
            Existing Patient Login
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10 z-10">
        <div className="w-full max-w-3xl bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800 p-6 sm:p-10 relative">
          
          {/* Progress Tracker */}
          <div className="mb-8 border-b border-slate-800/80 pb-6">
            <div className="flex items-center justify-between max-w-lg mx-auto">
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= 1 ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-500/20' : 'bg-slate-800 text-slate-500'}`}>
                  1
                </div>
                <span className={`text-xs font-medium ${step >= 1 ? 'text-blue-400' : 'text-slate-500'}`}>Demographics</span>
              </div>

              <div className={`flex-1 h-0.5 mx-3 transition-colors ${step >= 2 ? 'bg-gradient-to-r from-blue-500 to-teal-500' : 'bg-slate-800'}`} />

              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= 2 ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-500/20' : 'bg-slate-800 text-slate-500'}`}>
                  2
                </div>
                <span className={`text-xs font-medium ${step >= 2 ? 'text-blue-400' : 'text-slate-500'}`}>Security</span>
              </div>

              <div className={`flex-1 h-0.5 mx-3 transition-colors ${step >= 3 ? 'bg-gradient-to-r from-blue-500 to-teal-500' : 'bg-slate-800'}`} />

              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= 3 ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-500/20' : 'bg-slate-800 text-slate-500'}`}>
                  3
                </div>
                <span className={`text-xs font-medium ${step >= 3 ? 'text-emerald-400' : 'text-slate-500'}`}>Complete</span>
              </div>
            </div>
          </div>

          {/* Feedback Banner */}
          {message && (
            <div className={`p-4 rounded-xl mb-6 text-sm font-medium flex items-start gap-3 border animate-fadeIn ${
              message.startsWith('Error') 
                ? 'bg-rose-950/50 text-rose-300 border-rose-800/80' 
                : 'bg-emerald-950/50 text-emerald-300 border-emerald-800/80'
            }`}>
              {message.startsWith('Error') ? (
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div>{message}</div>
            </div>
          )}

          {/* STEP 1: DEMOGRAPHICS */}
          {step === 1 && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  Patient Profile Onboarding
                  <Sparkles className="w-5 h-5 text-teal-400" />
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Create your universal digital health record. Multiple family members can register with a shared mobile number.
                </p>
              </div>

              <form onSubmit={handleDetailsSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-400" />
                      Full Name *
                    </label>
                    <input 
                      type="text" 
                      name="name" 
                      required 
                      value={formData.name} 
                      onChange={handleChange} 
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition" 
                      placeholder="e.g. Ramesh Kumar" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-blue-400" />
                      Mobile Number *
                    </label>
                    <input 
                      type="tel" 
                      name="phone_number" 
                      required 
                      value={formData.phone_number} 
                      onChange={handleChange} 
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition" 
                      placeholder="10-digit mobile number" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      Date of Birth *
                    </label>
                    <input 
                      type="date" 
                      name="dob" 
                      required 
                      value={formData.dob} 
                      onChange={handleChange} 
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      Calculated Age
                    </label>
                    <input 
                      type="text" 
                      disabled 
                      value={formData.age ? `${formData.age} yrs` : ''} 
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-teal-400 font-semibold cursor-not-allowed" 
                      placeholder="Auto-calculated" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Biological Sex *
                    </label>
                    <select 
                      name="sex" 
                      required 
                      value={formData.sex} 
                      onChange={handleChange} 
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                    >
                      <option value="" className="bg-slate-900">Select sex...</option>
                      <option value="Male" className="bg-slate-900">Male</option>
                      <option value="Female" className="bg-slate-900">Female</option>
                      <option value="Other" className="bg-slate-900">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    Residential Address *
                  </label>
                  <textarea 
                    name="address" 
                    required 
                    rows={2} 
                    value={formData.address} 
                    onChange={handleChange} 
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition resize-none" 
                    placeholder="Enter complete permanent address..." 
                  />
                </div>

                {/* EXPANDED & CATEGORIZED MEDICAL HISTORY & ALLERGIES */}
                <div className="border-t border-slate-800 pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-teal-400" />
                      Pre-existing Medical History & Allergies
                    </h3>
                    <span className="text-[11px] text-teal-300 bg-teal-950/60 border border-teal-800/60 px-2.5 py-0.5 rounded-full font-medium">
                      Smart Categorized
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                    Search or browse categories below. If you're unsure of exact clinical classifications (e.g. High vs Low BP), select the <span className="text-slate-200 font-medium">"General/Unspecified"</span> option.
                  </p>

                  <div className="space-y-6">
                    {/* 1. KNOWN DISEASES & CONDITIONS */}
                    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                          Known Illnesses & Chronic Conditions
                        </label>
                        <span className="text-[11px] text-slate-400">Search by name or keyword (e.g., BP, Sugar)</span>
                      </div>

                      {/* Quick Category Filter Pills */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {['ALL', 'Cardiovascular', 'Endocrine', 'Respiratory', 'Neurological', 'Joints', 'Gastrointestinal'].map(cat => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setConditionCategoryFilter(cat)}
                            className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition ${
                              conditionCategoryFilter === cat
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                            }`}
                          >
                            {cat === 'ALL' ? 'All Categories' : cat}
                          </button>
                        ))}
                      </div>

                      <Select
                        instanceId="conditions-select"
                        isMulti
                        name="conditions"
                        options={filteredConditionOptions}
                        value={selectedConditions}
                        onChange={(selected: any) => setSelectedConditions(selected || [])}
                        components={{ Option: CustomOption }}
                        filterOption={customFilterOption}
                        className="text-sm"
                        classNamePrefix="react-select"
                        placeholder="Search conditions (e.g., High BP, Type 2 Diabetes, Asthma, Sinus)..."
                        closeMenuOnScroll={true}
                        menuPosition="fixed"
                        styles={{
                          control: (base) => ({
                            ...base,
                            backgroundColor: 'rgb(3 7 18 / 0.9)',
                            borderColor: 'rgb(51 65 85 / 0.8)',
                            borderRadius: '0.75rem',
                            padding: '4px',
                            color: 'white',
                          }),
                          menu: (base) => ({
                            ...base,
                            backgroundColor: 'rgb(15 23 42)',
                            borderColor: 'rgb(51 65 85)',
                            color: 'white',
                            maxHeight: '280px',
                            zIndex: 9999,
                          }),
                          groupHeading: (base) => ({
                            ...base,
                            color: 'rgb(45 212 191)',
                            fontWeight: '700',
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            padding: '8px 12px 4px 12px',
                            backgroundColor: 'rgb(15 23 42)',
                            borderBottom: '1px solid rgb(30 41 59)',
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isFocused ? 'rgb(30 41 59)' : 'transparent',
                            color: 'white',
                            cursor: 'pointer',
                            padding: '8px 12px',
                            borderBottom: '1px solid rgb(30 41 59 / 0.4)',
                          }),
                          multiValue: (base) => ({
                            ...base,
                            backgroundColor: 'rgb(30 58 138 / 0.6)',
                            borderRadius: '0.5rem',
                            border: '1px solid rgb(59 130 246 / 0.4)',
                          }),
                          multiValueLabel: (base) => ({
                            ...base,
                            color: 'rgb(147 197 253)',
                            fontWeight: '600',
                            fontSize: '12px',
                          }),
                          input: (base) => ({ ...base, color: 'white' }),
                          singleValue: (base) => ({ ...base, color: 'white' }),
                        }}
                      />
                    </div>

                    {/* 2. DRUG, FOOD & ENVIRONMENTAL ALLERGIES */}
                    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                          Drug, Food & Environmental Allergies
                        </label>
                        <span className="text-[11px] text-slate-400">Search drugs, nuts, dust, latex...</span>
                      </div>

                      {/* Quick Category Filter Pills */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {['ALL', 'Medication', 'Food', 'Environmental'].map(cat => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setAllergyCategoryFilter(cat)}
                            className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition ${
                              allergyCategoryFilter === cat
                                ? 'bg-teal-600 text-white shadow-sm'
                                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                            }`}
                          >
                            {cat === 'ALL' ? 'All Categories' : cat}
                          </button>
                        ))}
                      </div>

                      <Select
                        instanceId="allergies-select"
                        isMulti
                        name="allergies"
                        options={filteredAllergyOptions}
                        value={selectedAllergies}
                        onChange={(selected: any) => setSelectedAllergies(selected || [])}
                        components={{ Option: CustomOption }}
                        filterOption={customFilterOption}
                        className="text-sm"
                        classNamePrefix="react-select"
                        placeholder="Search allergies (e.g., Penicillin, Peanuts, Lactose, Latex)..."
                        closeMenuOnScroll={true}
                        menuPosition="fixed"
                        styles={{
                          control: (base) => ({
                            ...base,
                            backgroundColor: 'rgb(3 7 18 / 0.9)',
                            borderColor: 'rgb(51 65 85 / 0.8)',
                            borderRadius: '0.75rem',
                            padding: '4px',
                            color: 'white',
                          }),
                          menu: (base) => ({
                            ...base,
                            backgroundColor: 'rgb(15 23 42)',
                            borderColor: 'rgb(51 65 85)',
                            color: 'white',
                            maxHeight: '280px',
                            zIndex: 9999,
                          }),
                          groupHeading: (base) => ({
                            ...base,
                            color: 'rgb(45 212 191)',
                            fontWeight: '700',
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            padding: '8px 12px 4px 12px',
                            backgroundColor: 'rgb(15 23 42)',
                            borderBottom: '1px solid rgb(30 41 59)',
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isFocused ? 'rgb(30 41 59)' : 'transparent',
                            color: 'white',
                            cursor: 'pointer',
                            padding: '8px 12px',
                            borderBottom: '1px solid rgb(30 41 59 / 0.4)',
                          }),
                          multiValue: (base) => ({
                            ...base,
                            backgroundColor: 'rgb(153 27 27 / 0.5)',
                            borderRadius: '0.5rem',
                            border: '1px solid rgb(239 68 68 / 0.4)',
                          }),
                          multiValueLabel: (base) => ({
                            ...base,
                            color: 'rgb(254 202 202)',
                            fontWeight: '600',
                            fontSize: '12px',
                          }),
                          input: (base) => ({ ...base, color: 'white' }),
                          singleValue: (base) => ({ ...base, color: 'white' }),
                        }}
                      />
                    </div>

                    {/* Custom Allergy Specifier */}
                    {showCustomAllergy && (
                      <div className="pt-2 animate-fadeIn">
                        <label className="block text-xs font-semibold text-rose-400 mb-1 flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5" />
                          Specify Custom / Other Allergy Details *
                        </label>
                        <input 
                          type="text" 
                          name="customAllergy" 
                          required={showCustomAllergy} 
                          value={formData.customAllergy} 
                          onChange={handleChange} 
                          className="w-full bg-slate-950/80 border border-rose-800/80 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-rose-500 outline-none text-sm" 
                          placeholder="Please specify specific drug, substance or food item name..." 
                        />
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>Generating Universal Health ID...</span>
                  ) : (
                    <>
                      <span>Generate Health Profile</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: SET PASSWORD */}
          {step === 2 && (
            <div>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 text-xs font-semibold mb-3">
                  <ShieldCheck className="w-4 h-4" />
                  Health ID Allocated
                </div>
                <h1 className="text-2xl font-bold text-white">Set Account Security Credentials</h1>
                <p className="text-sm text-slate-400 mt-1">
                  Your Universal Health ID (UHID) has been created. Create a secure password for portal login.
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                {/* UHID Display Card */}
                <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-blue-500/30 rounded-xl p-5 shadow-inner">
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
                    Your Assigned Patient ID (UHID)
                  </div>
                  <div className="font-mono text-2xl font-extrabold text-teal-300 tracking-wider select-all flex items-center justify-between">
                    <span>{generatedUhid}</span>
                    <span className="text-xs font-sans font-normal text-slate-400 bg-slate-800/80 border border-slate-700 px-2.5 py-1 rounded-md">
                      Permanent ID
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    💡 You can log in using either this UHID or your mobile number (<span className="text-white font-medium">{formData.phone_number}</span>).
                  </p>
                </div>

                {/* Choose Password with Toggle */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-400" />
                    Choose Password *
                  </label>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      required 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-4 pr-12 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition" 
                      placeholder="At least 6 characters" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1.5 transition"
                      title={showPassword ? 'Hide Password' : 'Show Password'}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password with Toggle */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-400" />
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? 'text' : 'password'} 
                      required 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-4 pr-12 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition" 
                      placeholder="Re-enter password" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1.5 transition"
                      title={showConfirmPassword ? 'Hide Password' : 'Show Password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Encrypting & Saving Credentials...' : 'Save Password & Complete Registration'}
                </button>
              </form>
            </div>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 3 && (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-emerald-950/80 border border-emerald-700/80 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-extrabold text-white mb-2">Registration Confirmed!</h2>
              <p className="text-sm text-slate-400 mb-8 max-w-md mx-auto">
                Your universal health profile has been successfully initialized and encrypted in the digital health system.
              </p>

              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 mb-8 max-w-md mx-auto text-left space-y-3">
                <div className="flex justify-between items-center text-sm border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400">Patient Name:</span>
                  <span className="font-semibold text-white">{formData.name}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400">Universal Health ID (UHID):</span>
                  <span className="font-mono font-bold text-teal-300">{generatedUhid}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Registered Mobile:</span>
                  <span className="font-medium text-white">{formData.phone_number}</span>
                </div>
              </div>

              <Link 
                href="/login" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-500/25 transition"
              >
                <span>Proceed to Patient Login</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500 z-10">
        Digital Health Portal &bull; Encrypted Medical Identity & Data Protection System
      </footer>
    </div>
  );
}
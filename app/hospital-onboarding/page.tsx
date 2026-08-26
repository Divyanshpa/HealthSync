'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Select from 'react-select';
import { 
  Building2, 
  FileText, 
  MapPin, 
  Phone, 
  Mail, 
  Stethoscope, 
  BedDouble, 
  Ambulance, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles,
  HeartPulse,
  UploadCloud,
  FileCheck,
  Award,
  Flame,
  Check,
  Paperclip
} from 'lucide-react';

const departmentOptions = [
  { value: 'General Medicine / OPD', label: 'General Medicine / OPD' },
  { value: 'Cardiology & Heart Care', label: 'Cardiology & Heart Care' },
  { value: 'Orthopedics & Joint Surgery', label: 'Orthopedics & Joint Surgery' },
  { value: 'Neurology & Neurosurgery', label: 'Neurology & Neurosurgery' },
  { value: 'Pediatrics & Child Health', label: 'Pediatrics & Child Health' },
  { value: 'Gynecology & Obstetrics', label: 'Gynecology & Obstetrics' },
  { value: 'Emergency & Trauma Care', label: 'Emergency & Trauma Care' },
  { value: 'ICU & Critical Care', label: 'ICU & Critical Care' },
  { value: 'Oncology & Cancer Care', label: 'Oncology & Cancer Care' },
  { value: 'Dermatology & Skin', label: 'Dermatology & Skin' },
  { value: 'ENT & Head Neck', label: 'ENT & Head Neck' },
  { value: 'Nephrology & Dialysis', label: 'Nephrology & Dialysis' },
  { value: 'Gastroenterology', label: 'Gastroenterology' },
  { value: 'Radiology & Diagnostics', label: 'Radiology & Diagnostics' },
];

export default function HospitalOnboarding() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    license_number: '',
    type: 'Multi-Specialty',
    email: '',
    phone: '',
    emergency_contact: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    total_beds: '50',
    icu_beds: '10',
    ambulance_available: true,
    admin_contact_name: '',
    admin_contact_phone: '',
  });

  const [selectedDepartments, setSelectedDepartments] = useState<any[]>([
    { value: 'General Medicine / OPD', label: 'General Medicine / OPD' },
    { value: 'Emergency & Trauma Care', label: 'Emergency & Trauma Care' },
  ]);

  // Document Uploads State (Type -> File details with Base64 Data URL)
  const [attachedDocs, setAttachedDocs] = useState<{
    [type: string]: { file_name: string; file_url: string; file_size: string }
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Convert File to Base64 Data URL so Super Admin can open & preview it natively
  const handleFileUpload = (docType: string, e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (file) {
      const fileSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
      
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64DataUrl = uploadEvent.target?.result as string;
        setAttachedDocs((prev) => ({
          ...prev,
          [docType]: {
            file_name: file.name,
            file_url: base64DataUrl,
            file_size: fileSize,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.license_number || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode || !formData.admin_contact_name || !formData.admin_contact_phone) {
      setMessage('Error: Please complete all required hospital detail fields.');
      return;
    }

    if (!attachedDocs['LICENSE_PROOF'] || !attachedDocs['ADDRESS_PROOF']) {
      setMessage('Error: Please attach Medical Registration Certificate and Premises Address Proof alongside their respective fields.');
      return;
    }

    setLoading(true);
    setMessage('');

    const documentsArray = Object.entries(attachedDocs).map(([docType, details]) => ({
      document_type: docType,
      file_name: details.file_name,
      file_url: details.file_url,
      file_size: details.file_size,
    }));

    const payload = {
      ...formData,
      total_beds: Number(formData.total_beds) || 0,
      icu_beds: Number(formData.icu_beds) || 0,
      departments: selectedDepartments.map((d) => d.value),
      documents: documentsArray,
    };

    try {
      const response = await fetch('/api/hospital/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application.');
      }

      setSubmitted(true);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation Header */}
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
              <span className="block text-xs text-slate-400 font-medium">Hospital Onboarding & Legal Verification</span>
            </div>
          </Link>
          <Link 
            href="/admin/login"
            className="text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 px-4 py-2 rounded-lg transition flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            Super Admin Portal
          </Link>
        </div>
      </header>

      {/* Main Content Form */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10 z-10">
        <div className="w-full max-w-4xl bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800 p-6 sm:p-10 relative">
          
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  Hospital Facility Onboarding Dossier
                  <Sparkles className="w-5 h-5 text-teal-400" />
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Fill in facility details and attach legal verification certificates inline alongside each section.
                </p>
              </div>

              {/* Feedback Alert */}
              {message && (
                <div className={`p-4 rounded-xl text-sm font-medium flex items-start gap-3 border animate-fadeIn ${
                  message.startsWith('Error') 
                    ? 'bg-rose-950/50 text-rose-300 border-rose-800/80' 
                    : 'bg-emerald-950/50 text-emerald-300 border-emerald-800/80'
                }`}>
                  {message.startsWith('Error') ? (
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <div>{message}</div>
                </div>
              )}

              {/* SECTION 1: FACILITY IDENTITY & LICENSE PROOF */}
              <div className="p-6 bg-slate-950/80 border border-slate-800/90 rounded-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    1. Facility Identity & Medical Registration
                  </h2>
                  <span className="text-[11px] text-slate-400 font-medium">Required Legal Proof</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Hospital / Facility Name *
                    </label>
                    <input 
                      type="text" 
                      name="name" 
                      required 
                      value={formData.name} 
                      onChange={handleChange} 
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 outline-none transition" 
                      placeholder="e.g. Apex Multispecialty Hospital" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Facility Type *
                    </label>
                    <select 
                      name="type" 
                      value={formData.type} 
                      onChange={handleChange} 
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-teal-500 outline-none transition"
                    >
                      <option value="Multi-Specialty">Multi-Specialty Hospital</option>
                      <option value="Government Hospital">Government Hospital</option>
                      <option value="Private General Hospital">Private General Hospital</option>
                      <option value="Specialty Clinic">Specialty Clinic</option>
                      <option value="Diagnostic & Daycare">Diagnostic & Daycare Center</option>
                    </select>
                  </div>
                </div>

                {/* License Number & CONTEXTUAL INLINE DOCUMENT UPLOAD */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-teal-400" />
                      License / Registration Number *
                    </label>
                    <input 
                      type="text" 
                      name="license_number" 
                      required 
                      value={formData.license_number} 
                      onChange={handleChange} 
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 outline-none transition uppercase tracking-wider font-mono" 
                      placeholder="e.g. REG-MH-2026-8801" 
                    />
                  </div>

                  {/* INLINE ATTACHMENT BOX NEXT TO LICENSE NUMBER */}
                  <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-teal-400" />
                        Attach Registration Certificate *
                      </span>
                      {attachedDocs['LICENSE_PROOF'] && (
                        <span className="text-[10px] text-teal-400 bg-teal-950 border border-teal-800 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Attached
                        </span>
                      )}
                    </div>

                    <label className="border border-dashed border-slate-700 hover:border-teal-500 rounded-lg p-2.5 flex items-center justify-between cursor-pointer transition bg-slate-950/60">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-teal-400 shrink-0" />
                        <span className="text-xs text-slate-300 truncate max-w-[180px]">
                          {attachedDocs['LICENSE_PROOF'] ? attachedDocs['LICENSE_PROOF'].file_name : 'Choose Registration PDF / Image'}
                        </span>
                      </div>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded font-semibold shrink-0">Browse</span>
                      <input 
                        type="file" 
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => handleFileUpload('LICENSE_PROOF', e)} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-400" />
                      Official Email *
                    </label>
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      value={formData.email} 
                      onChange={handleChange} 
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 outline-none transition" 
                      placeholder="info@hospital.org" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-blue-400" />
                      Main Desk Phone *
                    </label>
                    <input 
                      type="tel" 
                      name="phone" 
                      required 
                      value={formData.phone} 
                      onChange={handleChange} 
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 outline-none transition" 
                      placeholder="022-25901122 or 9820011223" 
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: GEOGRAPHIC LOCATION & PREMISES PROOF */}
              <div className="p-6 bg-slate-950/80 border border-slate-800/90 rounded-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    2. Location & Premises Establishment Proof
                  </h2>
                  <span className="text-[11px] text-slate-400 font-medium">Trade License / Deed</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Full Street Address *
                    </label>
                    <textarea 
                      name="address" 
                      required 
                      rows={3} 
                      value={formData.address} 
                      onChange={handleChange} 
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition resize-none" 
                      placeholder="Building No, Sector, Street Name..." 
                    />
                  </div>

                  {/* INLINE ATTACHMENT BOX NEXT TO ADDRESS */}
                  <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        Attach Address & Premises Proof *
                      </span>
                      {attachedDocs['ADDRESS_PROOF'] && (
                        <span className="text-[10px] text-blue-400 bg-blue-950 border border-blue-800 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Attached
                        </span>
                      )}
                    </div>

                    <label className="border border-dashed border-slate-700 hover:border-blue-500 rounded-lg p-2.5 flex items-center justify-between cursor-pointer transition bg-slate-950/60">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-blue-400 shrink-0" />
                        <span className="text-xs text-slate-300 truncate max-w-[180px]">
                          {attachedDocs['ADDRESS_PROOF'] ? attachedDocs['ADDRESS_PROOF'].file_name : 'Choose Trade License / Property Deed'}
                        </span>
                      </div>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded font-semibold shrink-0">Browse</span>
                      <input 
                        type="file" 
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => handleFileUpload('ADDRESS_PROOF', e)} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">City *</label>
                    <input 
                      type="text" 
                      name="city" 
                      required 
                      value={formData.city} 
                      onChange={handleChange} 
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition" 
                      placeholder="e.g. Navi Mumbai" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">State *</label>
                    <input 
                      type="text" 
                      name="state" 
                      required 
                      value={formData.state} 
                      onChange={handleChange} 
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition" 
                      placeholder="e.g. Maharashtra" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Pincode *</label>
                    <input 
                      type="text" 
                      name="pincode" 
                      required 
                      value={formData.pincode} 
                      onChange={handleChange} 
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition font-mono" 
                      placeholder="400703" 
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: CLINICAL CAPABILITIES & SAFETY CLEARANCES */}
              <div className="p-6 bg-slate-950/80 border border-slate-800/90 rounded-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" />
                    3. Clinical Infrastructure & Environmental Clearances
                  </h2>
                  <span className="text-[11px] text-slate-400 font-medium">Specialties & Safety</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Active Specialties & Departments *
                    </label>
                    <Select
                      isMulti
                      name="departments"
                      options={departmentOptions}
                      value={selectedDepartments}
                      onChange={(selected: any) => setSelectedDepartments(selected || [])}
                      className="text-sm"
                      classNamePrefix="react-select"
                      placeholder="Select departments..."
                      styles={{
                        control: (base) => ({
                          ...base,
                          backgroundColor: 'rgb(15 23 42)',
                          borderColor: 'rgb(51 65 85 / 0.8)',
                          borderRadius: '0.75rem',
                          padding: '3px',
                          color: 'white',
                        }),
                        menu: (base) => ({
                          ...base,
                          backgroundColor: 'rgb(15 23 42)',
                          borderColor: 'rgb(51 65 85)',
                          color: 'white',
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isFocused ? 'rgb(30 41 59)' : 'transparent',
                          color: 'white',
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
                        }),
                        input: (base) => ({ ...base, color: 'white' }),
                      }}
                    />
                  </div>

                  {/* INLINE NABH ACCREDITATION UPLOAD */}
                  <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-indigo-400" />
                        Attach NABH Accreditation (Optional)
                      </span>
                      {attachedDocs['ACCREDITATION_CERT'] && (
                        <span className="text-[10px] text-indigo-400 bg-indigo-950 border border-indigo-800 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Attached
                        </span>
                      )}
                    </div>

                    <label className="border border-dashed border-slate-700 hover:border-indigo-500 rounded-lg p-2.5 flex items-center justify-between cursor-pointer transition bg-slate-950/60">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="text-xs text-slate-300 truncate max-w-[180px]">
                          {attachedDocs['ACCREDITATION_CERT'] ? attachedDocs['ACCREDITATION_CERT'].file_name : 'Choose Quality Cert PDF / Image'}
                        </span>
                      </div>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded font-semibold shrink-0">Browse</span>
                      <input 
                        type="file" 
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => handleFileUpload('ACCREDITATION_CERT', e)} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                      <BedDouble className="w-3.5 h-3.5 text-teal-400" />
                      Total General Beds
                    </label>
                    <input 
                      type="number" 
                      name="total_beds" 
                      value={formData.total_beds} 
                      onChange={handleChange} 
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                      <BedDouble className="w-3.5 h-3.5 text-teal-400" />
                      ICU Beds
                    </label>
                    <input 
                      type="number" 
                      name="icu_beds" 
                      value={formData.icu_beds} 
                      onChange={handleChange} 
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-rose-400" />
                      24/7 Emergency Line *
                    </label>
                    <input 
                      type="tel" 
                      name="emergency_contact" 
                      value={formData.emergency_contact} 
                      onChange={handleChange} 
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none transition" 
                      placeholder="022-25909999" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Ambulance className="w-5 h-5 text-teal-400" />
                      <div>
                        <span className="text-xs font-semibold text-white block">24/7 Ambulance Fleet</span>
                        <span className="text-[11px] text-slate-400">ALS & Basic Emergency Units</span>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      name="ambulance_available" 
                      checked={formData.ambulance_available} 
                      onChange={handleChange} 
                      className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-teal-500 focus:ring-teal-500 cursor-pointer" 
                    />
                  </div>

                  {/* INLINE FIRE SAFETY & WASTE CLEARANCE UPLOAD */}
                  <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-rose-400" />
                        Attach Fire Safety & Bio-Waste NOC
                      </span>
                      {attachedDocs['FIRE_SAFETY_NOC'] && (
                        <span className="text-[10px] text-rose-400 bg-rose-950 border border-rose-800 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Attached
                        </span>
                      )}
                    </div>

                    <label className="border border-dashed border-slate-700 hover:border-rose-500 rounded-lg p-2.5 flex items-center justify-between cursor-pointer transition bg-slate-950/60">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-rose-400 shrink-0" />
                        <span className="text-xs text-slate-300 truncate max-w-[180px]">
                          {attachedDocs['FIRE_SAFETY_NOC'] ? attachedDocs['FIRE_SAFETY_NOC'].file_name : 'Choose Fire NOC / Environmental Cert'}
                        </span>
                      </div>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded font-semibold shrink-0">Browse</span>
                      <input 
                        type="file" 
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => handleFileUpload('FIRE_SAFETY_NOC', e)} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* SECTION 4: PRIMARY ADMIN REPRESENTATIVE & SUBMIT */}
              <div className="p-6 bg-slate-950/80 border border-slate-800/90 rounded-2xl space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-400" />
                  4. Authorized Hospital Administrator Representative
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Admin Full Name & Title *</label>
                    <input 
                      type="text" 
                      name="admin_contact_name" 
                      required 
                      value={formData.admin_contact_name} 
                      onChange={handleChange} 
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition" 
                      placeholder="e.g. Dr. Vikramaditya Roy (Medical Director)" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Admin Direct Phone *</label>
                    <input 
                      type="tel" 
                      name="admin_contact_phone" 
                      required 
                      value={formData.admin_contact_phone} 
                      onChange={handleChange} 
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition" 
                      placeholder="e.g. 9820099887" 
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-bold shadow-xl shadow-teal-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-base"
              >
                {loading ? 'Submitting Dossier & Encoded Files...' : 'Submit Complete Hospital Dossier & Legal Proofs'}
              </button>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-emerald-950/80 border border-emerald-700/80 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-extrabold text-white mb-2">Facility Dossier & Real File Proofs Submitted!</h2>
              <p className="text-sm text-slate-400 mb-8 max-w-md mx-auto">
                Your hospital profile and attached legal documents have been encoded into the database for native browser inspection.
              </p>

              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 mb-8 max-w-md mx-auto text-left space-y-3">
                <div className="flex justify-between items-center text-sm border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400">Hospital Name:</span>
                  <span className="font-semibold text-white">{formData.name}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400">License Number:</span>
                  <span className="font-mono font-bold text-teal-300">{formData.license_number}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Attached Documents:</span>
                  <span className="font-semibold text-emerald-400 flex items-center gap-1">
                    <FileCheck className="w-4 h-4" />
                    {Object.keys(attachedDocs).length} Encoded Files
                  </span>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Link 
                  href="/" 
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-6 py-3 rounded-xl text-sm font-semibold transition"
                >
                  Return to Home
                </Link>
                <Link 
                  href="/admin/login" 
                  className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 transition flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Super Admin Portal
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500 z-10">
        Digital Health Platform &bull; Real Base64 File Storage System
      </footer>
    </div>
  );
}

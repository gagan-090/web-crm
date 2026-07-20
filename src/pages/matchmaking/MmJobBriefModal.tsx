import React, { useState } from 'react';
import { useSubmitMmJobBriefMutation, type MmJobBriefPayload } from '../../services/api/webCrmApi';

// ── Transporter Job Brief ────────────────────────────────────────────────────
//
// Web port of the mobile JobBriefFeedbackModal
// (src/screens/matchmaking-telecalling/components/JobBriefFeedbackModal.tsx).
// SAME sections, SAME field set, SAME validations (name + job location are the
// only required fields, "Skip" closes without saving), SAME payload field
// names. The only difference is the destination: the Web CRM writes the brief
// onto the `jobs` row instead of job_details_call_logs.

/** Seed values from the existing job row — every field is optional/nullable
 *  because the API returns nulls for anything the transporter never filled. */
export interface JobBriefJobData {
  transporter_name?: string | null;
  job_location?: string | null;
  route?: string | null;
  number_of_drivers_required?: number | string | null;
  vehicle_type?: string | null;
  license_type?: string | null;
  required_experience?: string | null;
  salary_range?: string | null;
  benefits?: {
    esi_pf?: string | null;
    food_allowance?: string | null;
    trip_incentive?: string | null;
    rahane_ki_suvidha?: string | null;
    mileage?: string | null;
    fast_tag_road_kharcha?: string | null;
  } | null;
}

interface Props {
  open: boolean;
  jobId: string;
  prefillName?: string;
  jobData?: JobBriefJobData | null;
  onClose: () => void;
  onSaved?: (payload: MmJobBriefPayload) => void;
}

// Same helpers the mobile modal uses to seed the form from existing job data.
const numericValue = (value: unknown): string =>
  value === null || value === undefined || value === '' ? '' : String(value);

const yesNoValue = (value: unknown): 'Yes' | 'No' => {
  if (!value) return 'No';
  const str = String(value).toLowerCase();
  return str === 'yes' || str === '1' || str === 'true' ? 'Yes' : 'No';
};

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <h4 className="text-[11px] font-extrabold text-gray-800 uppercase tracking-wide mt-4 mb-2 first:mt-0">
    {title}
  </h4>
);

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  numeric?: boolean;
  required?: boolean;
}> = ({ label, value, onChange, placeholder, numeric, required }) => (
  <label className="block">
    <span className="text-[9.5px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
      {label}{required && <span className="text-red-500"> *</span>}
    </span>
    <input
      type={numeric ? 'number' : 'text'}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder || label}
      className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-800 outline-none focus:ring-1 focus:ring-[#8E44AD] focus:border-[#8E44AD]"
    />
  </label>
);

const Choice: React.FC<{
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}> = ({ label, value, options, onChange }) => (
  <label className="block">
    <span className="text-[9.5px] text-gray-400 font-bold uppercase tracking-wider block mb-1">{label}</span>
    <div className="flex gap-1.5">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`flex-1 py-1.5 rounded-lg border font-bold text-[11px] transition-colors ${
            value === opt
              ? 'bg-purple-100 border-[#8E44AD] text-[#7D3C98]'
              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  </label>
);

const MmJobBriefModal: React.FC<Props> = ({ open, jobId, prefillName, jobData, onClose, onSaved }) => {
  const [submitJobBrief, { isLoading }] = useSubmitMmJobBriefMutation();
  const [error, setError] = useState<string | null>(null);

  // Basic Information
  const [name, setName] = useState(prefillName || jobData?.transporter_name || '');
  const [jobLocation, setJobLocation] = useState(jobData?.job_location || '');
  const [route, setRoute] = useState(jobData?.route || '');
  const [requiredDrivers, setRequiredDrivers] = useState(numericValue(jobData?.number_of_drivers_required));

  // Vehicle & License
  const [vehicleType, setVehicleType] = useState(jobData?.vehicle_type || '');
  const [licenseType, setLicenseType] = useState(jobData?.license_type || '');
  const [experience, setExperience] = useState(jobData?.required_experience || '');

  // Salary Details
  const [fixedSalary, setFixedSalary] = useState(jobData?.salary_range || '');
  const [variableSalary, setVariableSalary] = useState('');

  // Benefits & Allowances
  const [esiPf, setEsiPf] = useState<'Yes' | 'No'>(yesNoValue(jobData?.benefits?.esi_pf));
  const [foodAllowance, setFoodAllowance] = useState(numericValue(jobData?.benefits?.food_allowance));
  const [tripIncentive, setTripIncentive] = useState(numericValue(jobData?.benefits?.trip_incentive));
  const [rehneKiSuvidha, setRehneKiSuvidha] = useState<'Yes' | 'No'>(yesNoValue(jobData?.benefits?.rahane_ki_suvidha));

  // Other Details
  const [mileage, setMileage] = useState(jobData?.benefits?.mileage || '');
  const [fastagRoadKharcha, setFastagRoadKharcha] = useState<'Company' | 'Driver'>(
    jobData?.benefits?.fast_tag_road_kharcha === 'Driver' ? 'Driver' : 'Company',
  );

  if (!open) return null;

  const handleSubmit = async () => {
    // Identical validation to the mobile modal.
    if (!name.trim()) { setError('Please enter the transporter name.'); return; }
    if (!jobLocation.trim()) { setError('Please enter the job location.'); return; }
    setError(null);

    const payload: MmJobBriefPayload = {
      job_id: jobId,
      name: name.trim(),
      job_location: jobLocation.trim(),
      route,
      required_drivers: requiredDrivers,
      vehicle_type: vehicleType,
      license_type: licenseType,
      experience,
      salary_fixed: fixedSalary,
      salary_variable: variableSalary ? Number(variableSalary) : undefined,
      esi_pf: esiPf,
      food_allowance: foodAllowance ? Number(foodAllowance) : undefined,
      trip_incentive: tripIncentive ? Number(tripIncentive) : undefined,
      rehne_ki_suvidha: rehneKiSuvidha,
      mileage,
      fast_tag_road_kharcha: fastagRoadKharcha,
      closed_job: 0,
    };

    try {
      await submitJobBrief(payload).unwrap();
      onSaved?.(payload);
      onClose();
    } catch (err) {
      const apiMessage = (err as { data?: { message?: string } })?.data?.message;
      setError(apiMessage || 'Failed to save job brief. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#8E44AD] text-xl">description</span>
            </div>
            <div>
              <h3 className="font-extrabold text-gray-800 text-sm">Job Brief Feedback</h3>
              <p className="text-[10px] text-gray-400 font-mono">Job ID: {jobId || 'N/A'}</p>
            </div>
          </div>
          <span className="bg-amber-50 text-amber-600 text-[10px] font-extrabold px-2 py-1 rounded-lg">Required</span>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2.5 custom-scrollbar">
          <SectionTitle title="Basic Information" />
          <Field label="Name" value={name} onChange={setName} required />
          <Field label="Job Location" value={jobLocation} onChange={setJobLocation} required />
          <Field label="Route" value={route} onChange={setRoute} placeholder="e.g. Delhi - Mumbai" />
          <Field label="Required Drivers" value={requiredDrivers} onChange={setRequiredDrivers} numeric />

          <SectionTitle title="Vehicle & License" />
          <Field label="Vehicle Type" value={vehicleType} onChange={setVehicleType} />
          <Field label="License Type" value={licenseType} onChange={setLicenseType} />
          <Field label="Experience" value={experience} onChange={setExperience} placeholder="e.g. 5-10 years" />

          <SectionTitle title="Salary Details" />
          <Field label="Fixed Salary" value={fixedSalary} onChange={setFixedSalary} />
          <Field label="Variable Salary" value={variableSalary} onChange={setVariableSalary} numeric />

          <SectionTitle title="Benefits & Allowances" />
          <Choice label="ESI / PF" value={esiPf} options={['Yes', 'No']} onChange={v => setEsiPf(v as 'Yes' | 'No')} />
          <Field label="Food Allowance" value={foodAllowance} onChange={setFoodAllowance} numeric />
          <Field label="Trip Incentive" value={tripIncentive} onChange={setTripIncentive} numeric />
          <Choice
            label="Rehne Ki Suvidha"
            value={rehneKiSuvidha}
            options={['Yes', 'No']}
            onChange={v => setRehneKiSuvidha(v as 'Yes' | 'No')}
          />

          <SectionTitle title="Other Details" />
          <Field label="Mileage" value={mileage} onChange={setMileage} />
          <Choice
            label="FASTag / Road Kharcha"
            value={fastagRoadKharcha}
            options={['Company', 'Driver']}
            onChange={v => setFastagRoadKharcha(v as 'Company' | 'Driver')}
          />

          {error && (
            <p className="text-red-600 font-bold text-[11px] bg-red-50 border border-red-100 rounded-lg px-2.5 py-1.5">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 py-3.5 border-t border-gray-100 shrink-0">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 font-bold hover:bg-gray-100 disabled:opacity-50"
          >
            Skip
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-[2] py-2.5 rounded-xl bg-[#8E44AD] hover:bg-[#7D3C98] text-white font-extrabold shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-base">check_circle</span>
            {isLoading ? 'Saving…' : 'Save Job Brief'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MmJobBriefModal;

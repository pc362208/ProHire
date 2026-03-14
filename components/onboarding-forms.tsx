'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Profession = { id: string; name: string };
type Company = { id: string; name: string };

async function uploadAsset(file: File, kind: 'resume' | 'logo' | 'verification' | 'profile-image') {
  const form = new FormData();
  form.append('file', file);
  form.append('kind', kind);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: form,
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Upload failed');
  return json.file.url as string;
}

export function SeekerProfileForm({ professions }: { professions: Profession[]; userId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    try {
      const resumeFile = formData.get('resume');
      const profileImageFile = formData.get('profileImage');
      const resumeUrl = resumeFile instanceof File && resumeFile.size > 0
        ? await uploadAsset(resumeFile, 'resume')
        : undefined;
      const profileImageUrl = profileImageFile instanceof File && profileImageFile.size > 0
        ? await uploadAsset(profileImageFile, 'profile-image')
        : undefined;

      const payload = {
        professionId: String(formData.get('professionId') || ''),
        bio: String(formData.get('bio') || ''),
        location: String(formData.get('location') || ''),
        yearsExperience: Number(formData.get('yearsExperience') || 0),
        preferredWorkType: String(formData.get('preferredWorkType') || '') || null,
        expectedSalaryMin: Number(formData.get('expectedSalaryMin') || 0) || null,
        expectedSalaryMax: Number(formData.get('expectedSalaryMax') || 0) || null,
        availability: String(formData.get('availability') || 'OPEN_TO_OFFERS'),
        resumeUrl,
        profileImageUrl,
      };

      const res = await fetch('/api/seeker/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Could not save profile');
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save profile');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={onSubmit} className="grid form-grid">
      <label>
        Profession
        <select name="professionId" required>
          <option value="">Select a profession</option>
          {professions.map((profession) => <option key={profession.id} value={profession.id}>{profession.name}</option>)}
        </select>
      </label>
      <label>
        Location
        <input name="location" placeholder="Melbourne" />
      </label>
      <label>
        Years of experience
        <input name="yearsExperience" type="number" min={0} defaultValue={0} />
      </label>
      <label>
        Preferred work type
        <select name="preferredWorkType" defaultValue="HYBRID">
          <option value="ONSITE">On-site</option>
          <option value="REMOTE">Remote</option>
          <option value="HYBRID">Hybrid</option>
        </select>
      </label>
      <label>
        Availability
        <select name="availability" defaultValue="OPEN_TO_OFFERS">
          <option value="AVAILABLE">Available</option>
          <option value="OPEN_TO_OFFERS">Open to offers</option>
          <option value="NOT_AVAILABLE">Not available</option>
        </select>
      </label>
      <label>
        Expected salary min
        <input name="expectedSalaryMin" type="number" min={0} />
      </label>
      <label>
        Expected salary max
        <input name="expectedSalaryMax" type="number" min={0} />
      </label>
      <label>
        Resume
        <input name="resume" type="file" accept=".pdf,.doc,.docx" />
      </label>
      <label>
        Profile image
        <input name="profileImage" type="file" accept="image/*" />
      </label>
      <label>
        Bio
        <textarea name="bio" rows={4} placeholder="Tell employers about your background" />
      </label>
      {error ? <p className="error">{error}</p> : null}
      <button className="button" disabled={loading}>{loading ? 'Saving...' : 'Save profile'}</button>
    </form>
  );
}

export function CompanyForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    try {
      const logoFile = formData.get('logo');
      const logoUrl = logoFile instanceof File && logoFile.size > 0
        ? await uploadAsset(logoFile, 'logo')
        : undefined;

      const payload = {
        userId,
        name: String(formData.get('name') || ''),
        website: String(formData.get('website') || ''),
        description: String(formData.get('description') || ''),
        industry: String(formData.get('industry') || ''),
        location: String(formData.get('location') || ''),
        jobTitle: String(formData.get('jobTitle') || ''),
        logoUrl,
      };

      const res = await fetch('/api/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Could not save company');
      router.push('/employer');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save company');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={onSubmit} className="grid form-grid">
      <label>
        Company name
        <input name="name" required />
      </label>
      <label>
        Your job title
        <input name="jobTitle" placeholder="Hiring Manager" />
      </label>
      <label>
        Company logo
        <input name="logo" type="file" accept="image/*" />
      </label>
      <label>
        Website
        <input name="website" type="url" placeholder="https://example.com" />
      </label>
      <label>
        Industry
        <input name="industry" placeholder="Healthcare" />
      </label>
      <label>
        Location
        <input name="location" placeholder="Sydney" />
      </label>
      <label>
        Company description
        <textarea name="description" rows={4} />
      </label>
      {error ? <p className="error">{error}</p> : null}
      <button className="button" disabled={loading}>{loading ? 'Saving...' : 'Save company'}</button>
    </form>
  );
}

export function JobForm({ professions, companies }: { professions: Profession[]; companies: Company[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setError(null);
    const payload = {
      companyId: String(formData.get('companyId') || ''),
      title: String(formData.get('title') || ''),
      professionId: String(formData.get('professionId') || ''),
      description: String(formData.get('description') || ''),
      location: String(formData.get('location') || ''),
      workType: String(formData.get('workType') || '') || null,
      employmentType: String(formData.get('employmentType') || '') || null,
      salaryMin: Number(formData.get('salaryMin') || 0) || null,
      salaryMax: Number(formData.get('salaryMax') || 0) || null,
      experienceRequired: Number(formData.get('experienceRequired') || 0) || null,
      deadline: formData.get('deadline') ? new Date(String(formData.get('deadline'))).toISOString() : null,
    };

    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || 'Could not create job');
      return;
    }
    router.push('/employer');
    router.refresh();
  }

  return (
    <form action={onSubmit} className="grid form-grid">
      <label>
        Company
        <select name="companyId" required>
          <option value="">Select company</option>
          {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
        </select>
      </label>
      <label>
        Job title
        <input name="title" required />
      </label>
      <label>
        Profession
        <select name="professionId" required>
          <option value="">Select profession</option>
          {professions.map((profession) => <option key={profession.id} value={profession.id}>{profession.name}</option>)}
        </select>
      </label>
      <label>
        Location
        <input name="location" placeholder="Melbourne" />
      </label>
      <label>
        Work type
        <select name="workType" defaultValue="HYBRID">
          <option value="ONSITE">On-site</option>
          <option value="REMOTE">Remote</option>
          <option value="HYBRID">Hybrid</option>
        </select>
      </label>
      <label>
        Employment type
        <select name="employmentType" defaultValue="FULL_TIME">
          <option value="FULL_TIME">Full-time</option>
          <option value="PART_TIME">Part-time</option>
          <option value="CONTRACT">Contract</option>
          <option value="TEMPORARY">Temporary</option>
          <option value="INTERNSHIP">Internship</option>
          <option value="FREELANCE">Freelance</option>
        </select>
      </label>
      <label>
        Experience required
        <input name="experienceRequired" type="number" min={0} />
      </label>
      <label>
        Salary min
        <input name="salaryMin" type="number" min={0} />
      </label>
      <label>
        Salary max
        <input name="salaryMax" type="number" min={0} />
      </label>
      <label>
        Deadline
        <input name="deadline" type="date" />
      </label>
      <label>
        Description
        <textarea name="description" rows={6} required />
      </label>
      {error ? <p className="error">{error}</p> : null}
      <button className="button">Create job</button>
    </form>
  );
}

export function ApplyButton({ jobId, hasApplied }: { jobId: string; hasApplied: boolean }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function apply() {
    if (hasApplied || loading) return;
    setLoading(true);
    setMessage(null);
    const res = await fetch(`/api/jobs/${jobId}/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const json = await res.json();
    setMessage(res.ok ? 'Application submitted.' : (json.error || 'Could not apply'));
    setLoading(false);
    if (res.ok) router.refresh();
  }

  return (
    <div className="grid" style={{ gap: 8 }}>
      <button className="button" onClick={apply} disabled={hasApplied || loading}>
        {hasApplied ? 'Already applied' : loading ? 'Submitting...' : 'Apply now'}
      </button>
      {message ? <p className="muted small">{message}</p> : null}
    </div>
  );
}

export function ApplicationStatusForm({ applicationId, currentStatus }: { applicationId: string; currentStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function updateStatus() {
    setLoading(true);
    setMessage(null);
    const res = await fetch(`/api/applications/${applicationId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    setMessage(res.ok ? 'Applicant status updated.' : (json.error || 'Could not update status'));
    setLoading(false);
    if (res.ok) router.refresh();
  }

  return (
    <div className="inline-actions" style={{ marginTop: 12 }}>
      <select value={status} onChange={(event) => setStatus(event.target.value)}>
        <option value="REVIEWING">Reviewing</option>
        <option value="SHORTLISTED">Shortlisted</option>
        <option value="REJECTED">Rejected</option>
        <option value="HIRED">Hired</option>
      </select>
      <button className="button button-secondary" onClick={updateStatus} disabled={loading}>
        {loading ? 'Saving...' : 'Update status'}
      </button>
      {message ? <p className="muted small">{message}</p> : null}
    </div>
  );
}

export function CompanyVerificationForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const document = formData.get('document');
      if (!(document instanceof File) || document.size <= 0) {
        throw new Error('Choose a document to upload');
      }
      const documentUrl = await uploadAsset(document, 'verification');
      const res = await fetch('/api/company/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentUrl }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Could not submit verification');
      setMessage('Verification request submitted.');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit verification');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={onSubmit} className="grid form-grid">
      <label>
        Supporting document
        <input name="document" type="file" accept=".pdf,image/*" required />
      </label>
      <p className="muted small">Examples: business registration, company letterhead, or other proof of legitimacy.</p>
      {error ? <p className="error">{error}</p> : null}
      {message ? <p className="muted small">{message}</p> : null}
      <button className="button" disabled={loading}>{loading ? 'Submitting...' : 'Submit verification request'}</button>
    </form>
  );
}

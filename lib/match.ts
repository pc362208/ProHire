type JobInput = {
  professionId?: string;
  location?: string | null;
  salaryMax?: number | null;
  experienceRequired?: number | null;
  skills?: string[];
};

type SeekerInput = {
  professionId?: string;
  location?: string | null;
  expectedSalaryMin?: number | null;
  yearsExperience?: number | null;
  skills?: string[];
};

export function calculateMatch(job: JobInput, seeker: SeekerInput) {
  let score = 0;
  if (job.professionId && seeker.professionId && job.professionId === seeker.professionId) score += 40;

  const requiredSkills = job.skills ?? [];
  const seekerSkills = new Set(seeker.skills ?? []);
  if (requiredSkills.length > 0) {
    const matched = requiredSkills.filter((s) => seekerSkills.has(s)).length;
    score += Math.round((matched / requiredSkills.length) * 25);
  }

  if (job.location && seeker.location && job.location === seeker.location) score += 15;
  if ((seeker.yearsExperience ?? 0) >= (job.experienceRequired ?? 0)) score += 10;
  if ((seeker.expectedSalaryMin ?? 0) <= (job.salaryMax ?? Number.MAX_SAFE_INTEGER)) score += 10;

  return Math.min(score, 100);
}

import { AvailabilityStatus, EmploymentType, JobStatus, UserRole, WorkType } from '@prisma/client';
import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.nativeEnum(UserRole),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const seekerProfileSchema = z.object({
  userId: z.string().min(1),
  professionId: z.string().min(1),
  bio: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  yearsExperience: z.number().int().min(0).optional().nullable(),
  preferredWorkType: z.nativeEnum(WorkType).optional().nullable(),
  expectedSalaryMin: z.number().int().min(0).optional().nullable(),
  expectedSalaryMax: z.number().int().min(0).optional().nullable(),
  availability: z.nativeEnum(AvailabilityStatus).optional().default(AvailabilityStatus.OPEN_TO_OFFERS),
});

export const companySchema = z.object({
  name: z.string().min(2),
  website: z.string().url().optional().or(z.literal('')).transform((v) => v || undefined),
  description: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
});

export const jobSchema = z.object({
  companyId: z.string().min(1),
  title: z.string().min(2),
  professionId: z.string().min(1),
  description: z.string().min(20),
  location: z.string().optional().nullable(),
  workType: z.nativeEnum(WorkType).optional().nullable(),
  employmentType: z.nativeEnum(EmploymentType).optional().nullable(),
  salaryMin: z.number().int().min(0).optional().nullable(),
  salaryMax: z.number().int().min(0).optional().nullable(),
  experienceRequired: z.number().int().min(0).optional().nullable(),
  deadline: z.string().datetime().optional().nullable().transform((v) => (v ? new Date(v) : undefined)),
  status: z.nativeEnum(JobStatus).optional().default(JobStatus.OPEN),
});


export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(20),
  password: z.string().min(8),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(20),
});

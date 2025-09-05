-- Create the job applications table
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL,
  candidate_id UUID NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(job_id, candidate_id)
);

-- Enable RLS
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Policies for job applications
CREATE POLICY "Candidates can create applications" 
ON public.job_applications 
FOR INSERT 
WITH CHECK (
  auth.uid() = candidate_id AND 
  get_user_role(auth.uid()) = ANY(ARRAY['candidate'::user_role, 'admin'::user_role])
);

CREATE POLICY "Users can view their own applications" 
ON public.job_applications 
FOR SELECT 
USING (
  auth.uid() = candidate_id OR 
  auth.uid() IN (SELECT recruiter_id FROM jobs WHERE id = job_applications.job_id) OR
  get_user_role(auth.uid()) = 'admin'::user_role
);

CREATE POLICY "Recruiters can update applications for their jobs" 
ON public.job_applications 
FOR UPDATE 
USING (
  auth.uid() IN (SELECT recruiter_id FROM jobs WHERE id = job_applications.job_id) OR
  get_user_role(auth.uid()) = 'admin'::user_role
);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_job_applications_updated_at 
BEFORE UPDATE ON public.job_applications 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
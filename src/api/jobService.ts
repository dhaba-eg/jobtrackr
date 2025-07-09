import axios from "axios";

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  status: "Applied" | "Interview" | "Offer" | "Rejected";
  dateApplied: string;
  salary?: number;
  location: string;
  description?: string;
  notes?: string;
  contactPerson?: string;
  contactEmail?: string;
  applicationUrl?: string;
}

const api = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 10000,
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const jobsAPI = {
  async getJobs(): Promise<JobApplication[]> {
    const response = await api.get<JobApplication[]>("/jobs");
    return response.data;
  },

  async getJob(id: string): Promise<JobApplication> {
    const response = await api.get<JobApplication>(`/jobs/${id}`);
    return response.data;
  },

  async createJob(job: Omit<JobApplication, "id">): Promise<JobApplication> {
    const response = await api.post<JobApplication>("/jobs", job);
    return response.data;
  },

  async updateJob(
    id: string,
    updates: Partial<JobApplication>
  ): Promise<JobApplication> {
    const response = await api.put<JobApplication>(`/jobs/${id}`, updates);
    return response.data;
  },

  async deleteJob(id: string): Promise<void> {
    await api.delete(`/jobs/${id}`);
  },
};

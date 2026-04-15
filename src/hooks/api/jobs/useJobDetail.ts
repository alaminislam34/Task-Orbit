import { useGetJobById as useGetJobByIdFromJobs } from "./useJobs";

export const useJobDetail = (jobId: string) => {
  return useGetJobByIdFromJobs(jobId);
};

export const useGetJobDetail = useJobDetail;

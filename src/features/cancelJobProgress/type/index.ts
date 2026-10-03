export type CancelJobProgressInput = {
  jobId: string;
  teamId: string;
};

export type CancelJobProgressButtonProps = CancelJobProgressInput & {
  onCancelled?: () => void;
};

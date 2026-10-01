export type AcceptJobButtonProps = {
  postId: string;
  teamId: string;
  onAccepted?: () => void;
};

export interface AcceptJobProps {
  teamId: string;
  postId: string;
}

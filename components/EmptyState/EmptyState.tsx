interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return <p style={{ opacity: 0.6 }}>{message}</p>;
}

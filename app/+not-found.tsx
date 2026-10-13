import { useRouter } from 'expo-router';
import { EmptyState } from '../src/ui';

export default function NotFoundScreen() {
  const router = useRouter();
  return (
    <EmptyState
      emoji="🧭"
      title="This page doesn't exist"
      subtitle="The link may be broken or the page may have moved."
      actionLabel="Go home"
      onAction={() => router.replace('/')}
    />
  );
}

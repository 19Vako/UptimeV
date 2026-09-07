import { JobPostCard } from '@/entities/jobPost';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { JobPostListItemProps } from '../type';

export function JobPostListItem({ jobPost }: JobPostListItemProps) {
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/(job)/jobPost',
          params: { id: jobPost.id },
        })
      }
    >
      <JobPostCard jobPost={jobPost} />
    </Pressable>
  );
}

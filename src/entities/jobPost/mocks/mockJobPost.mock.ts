import JobPost from '@/shared/db';

export const mockJobPost = {
  title: 'Проверка: монтаж двери',
  description: 'Проверяем внешний вид карточки и отображение данных на примере мокового поста.',
  status: 'В работе',
  customerId: 'customer-123',
  customer: 'ООО «Успех»',
  location: 'Москва, ул. Пушкина, д. 10',
  createdAt: new Date(),
  updatedAt: new Date(),
} as JobPost;

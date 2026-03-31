import { redirect } from 'next/navigation';

export default function SearchPage({ searchParams }) {
  const query = searchParams?.q || '';
  redirect(`/shop?search=${encodeURIComponent(query)}`);
}

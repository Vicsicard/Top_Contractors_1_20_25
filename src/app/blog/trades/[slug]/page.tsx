import { redirect } from 'next/navigation';

interface Props {
  params: { 
    slug: string;
  }
}

export default async function TradeBlogPage({ params }: Props) {
  redirect(`/blog/trades/${params.slug}/page/1`);
}

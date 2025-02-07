import { redirect } from 'next/navigation';

interface Props {
  params: { 
    category: string;
  }
}

export default async function TradeBlogPage({ params }: Props) {
  redirect(`/blog/trades/${params.category}/page/1`);
}

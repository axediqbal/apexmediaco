import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import GlassCard from '@/components/ui/GlassCard';

export const metadata: Metadata = {
  title: 'Production Terms — APEX MEDIA CO',
  description: 'Terms governing orders, production, delivery, and warranties at APEX MEDIA CO.',
};

const sections = [
  {
    title: 'Orders & Pricing',
    body: 'All orders are confirmed at the prices listed in our catalog at the time of checkout. Order totals are calculated by our servers from current catalog pricing — any discrepancy between a displayed estimate and the server-calculated total is resolved in favor of the server calculation, and you will be notified before production begins.',
  },
  {
    title: 'Production & Lead Times',
    body: 'Each product page lists its production lead time. Custom and made-to-order kits begin production after order verification. Lead times are estimates; we will communicate proactively if a schedule changes.',
  },
  {
    title: 'Shipping & Delivery',
    body: 'Standard insured freight is $45, complimentary on orders of $1,500 or more. White-glove delivery adds $150 and includes placement and packaging removal. Risk of loss transfers on delivery confirmation.',
  },
  {
    title: 'Returns & Warranty',
    body: 'Unopened standard kits may be returned within 30 days of delivery. Custom, personalized, or made-to-order pieces are final sale unless defective. Manufacturing defects are covered under a 12-month production warranty.',
  },
  {
    title: 'Payment',
    body: 'We accept invoice billing and corporate cards. Invoice orders are subject to credit approval; NET-30 terms may be extended to qualified business accounts.',
  },
  {
    title: 'Security',
    body: 'Order data is accessible only through authenticated internal systems. We apply rate limiting and server-side validation on all commerce endpoints, and we never store full payment card numbers on our servers.',
    id: 'security',
  },
  {
    title: 'Changes',
    body: 'These terms may be updated periodically. Continued use of the storefront after changes constitutes acceptance of the revised terms.',
  },
];

export default function TermsPage() {
  return (
    <div className="py-24 md:py-32">
      <Container size="sm">
        <div className="space-y-3 mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-[#2D68FF]">
            Legal
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#F5F5F8] font-display">
            Production Terms
          </h1>
          <p className="text-[#A1A1AA]">
            The terms governing orders, production, delivery, and warranties.
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((s) => (
            <GlassCard key={s.title} id={s.id} className="p-6 md:p-8 space-y-3 scroll-mt-28">
              <h2 className="text-lg font-bold text-[#F5F5F8] font-display">{s.title}</h2>
              <p className="text-sm text-[#A1A1AA] leading-relaxed">{s.body}</p>
            </GlassCard>
          ))}
        </div>
      </Container>
    </div>
  );
}

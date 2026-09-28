import type { Metadata } from 'next';
import Container from '@/components/ui/Container';
import GlassCard from '@/components/ui/GlassCard';

export const metadata: Metadata = {
  title: 'Privacy Shield — APEX MEDIA CO',
  description: 'How APEX MEDIA CO collects, uses, and protects customer information.',
};

const sections = [
  {
    title: 'Information We Collect',
    body: 'When you place an order or contact us, we collect the business details you provide: name, company, work email, phone number, and delivery address. We also collect basic technical information (device type, browser, pages visited) to operate and improve the storefront.',
  },
  {
    title: 'How We Use It',
    body: 'Your information is used to process and fulfill orders, arrange insured freight and white-glove delivery, respond to inquiries, and send transactional updates about your purchase. We do not sell your personal information to third parties.',
  },
  {
    title: 'Data Retention',
    body: 'Order records are retained for as long as needed to fulfill warranties, handle returns, and meet legal or accounting obligations. You may request a copy or deletion of your personal data at any time.',
  },
  {
    title: 'Security',
    body: 'Access to order and customer data is restricted to authorized personnel through authenticated internal tooling. No payment card data is stored on our servers — card transactions are processed by PCI-compliant payment providers.',
  },
  {
    title: 'Cookies',
    body: 'We use essential cookies and local storage to keep your cart and checkout state. No advertising or cross-site tracking cookies are set.',
  },
  {
    title: 'Contact',
    body: 'For privacy questions or data requests, contact our studio and we will respond within a reasonable timeframe.',
  },
];

export default function PrivacyPage() {
  return (
    <div className="py-24 md:py-32">
      <Container size="sm">
        <div className="space-y-3 mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-[#2D68FF]">
            Legal
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#F5F5F8] font-display">
            Privacy Shield
          </h1>
          <p className="text-[#A1A1AA]">
            How APEX MEDIA CO collects, uses, and protects your information.
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((s) => (
            <GlassCard key={s.title} className="p-6 md:p-8 space-y-3">
              <h2 className="text-lg font-bold text-[#F5F5F8] font-display">{s.title}</h2>
              <p className="text-sm text-[#A1A1AA] leading-relaxed">{s.body}</p>
            </GlassCard>
          ))}
        </div>
      </Container>
    </div>
  );
}

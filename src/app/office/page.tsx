import Office3D from '@/components/Office3D/Office3D';

export const metadata = {
  title: 'The Office 3D | Mission Control',
  description: 'Visualiza tus agentes trabajando en tiempo real en un entorno 3D',
};

export default function OfficePage() {
  return (
    <>
      <div style={{ position: 'fixed', top: 12, left: 80, zIndex: 100 }}>
        <a href="/" style={{
          padding: '6px 12px', borderRadius: 6, backgroundColor: 'rgba(201,168,76,0.15)',
          color: '#C9A84C', fontSize: 12, fontWeight: 600, textDecoration: 'none',
          border: '1px solid rgba(201,168,76,0.3)',
        }}>← Dashboard</a>
      </div>
      <Office3D />
    </>
  );
}

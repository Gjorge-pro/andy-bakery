export default function Spinner({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div style={{
        width: 60,
        height: 60,
        border: '4px solid #FFF8F0',
        borderTop: '4px solid #7B4F2E',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: '#7B4F2E' }} className="mt-4 font-medium">{label}</p>
    </div>
  )
}

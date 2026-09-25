import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 18,
          background: '#0A0A0C',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#2D68FF',
          fontWeight: 900,
          borderRadius: 8,
          border: '1px solid rgba(45, 104, 255, 0.5)',
        }}
      >
        ▲
      </div>
    ),
    {
      ...size,
    }
  );
}

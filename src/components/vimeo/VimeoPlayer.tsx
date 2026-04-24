interface VimeoPlayerProps {
  vimeoId: string;
}

export default function VimeoPlayer({ vimeoId }: VimeoPlayerProps) {
  return (
    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 'var(--radius)', background: '#000' }}>
      <iframe
        src={`https://player.vimeo.com/video/${vimeoId}`}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}

'use client';

interface VideoChaptersProps {
  timestamps: Record<string, string>;
}

export default function VideoChapters({ timestamps }: VideoChaptersProps) {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Video Chapters</h3>
      <div className="space-y-2">
        {Object.entries(timestamps).map(([time, label]) => (
          <button
            key={time}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => {
              const seconds = time.split(':').reduce((acc, curr) => acc * 60 + parseInt(curr), 0);
              const iframe = document.querySelector('iframe');
              if (iframe) {
                iframe.contentWindow?.postMessage(
                  JSON.stringify({
                    event: 'command',
                    func: 'seekTo',
                    args: [seconds, true],
                  }),
                  '*'
                );
              }
            }}
          >
            <span className="font-medium">{time}</span> - {label}
          </button>
        ))}
      </div>
    </div>
  );
}

'use client';

interface ViewEvent {
  viewerName: string;
  viewedAt: string;
  durationSeconds: number;
  sectionsViewed: { name: string; timeSpent: number }[];
}

interface ViewTrackerProps {
  views: ViewEvent[];
  proposalTitle: string;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function ViewTracker({ views, proposalTitle }: ViewTrackerProps) {
  const totalViews = views.length;
  const avgDuration = totalViews > 0
    ? Math.round(views.reduce((sum, v) => sum + v.durationSeconds, 0) / totalViews)
    : 0;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">Proposal Analytics</h3>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glow-card p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{totalViews}</div>
          <div className="text-xs text-muted">Views</div>
        </div>
        <div className="glow-card p-4 text-center">
          <div className="text-2xl font-bold text-accent">{formatDuration(avgDuration)}</div>
          <div className="text-xs text-muted">Avg. Time</div>
        </div>
        <div className="glow-card p-4 text-center">
          <div className="text-2xl font-bold text-foreground">
            {views.length > 0 ? timeAgo(views[0].viewedAt) : '—'}
          </div>
          <div className="text-xs text-muted">Last Viewed</div>
        </div>
      </div>

      {/* View history */}
      {views.length > 0 && (
        <div className="glow-card divide-y divide-border">
          {views.map((view, i) => (
            <div key={i} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center text-xs font-bold text-accent">
                    {view.viewerName.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-foreground">{view.viewerName}</span>
                </div>
                <div className="text-xs text-muted">
                  {timeAgo(view.viewedAt)} · {formatDuration(view.durationSeconds)}
                </div>
              </div>

              {/* Section heatmap */}
              {view.sectionsViewed.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {view.sectionsViewed.map((section, j) => {
                    const maxTime = Math.max(...view.sectionsViewed.map((s) => s.timeSpent));
                    const intensity = maxTime > 0 ? section.timeSpent / maxTime : 0;
                    return (
                      <div
                        key={j}
                        className="flex-1 h-2 rounded-full"
                        style={{ backgroundColor: `rgba(var(--accent), ${0.2 + intensity * 0.8})`, opacity: 0.3 + intensity * 0.7 }}
                        title={`${section.name}: ${formatDuration(section.timeSpent)}`}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {views.length === 0 && (
        <div className="glow-card p-6 text-center">
          <p className="text-sm text-muted">No views yet. Share your proposal to start tracking.</p>
        </div>
      )}
    </div>
  );
}

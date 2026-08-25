/**
 * Displays information explaining each vehicle status.
 *
 * @returns {JSX.Element} Status information card.
 */
function StatusInfo() {
  const statusInformation = [
    {
      icon: '✓',
      className: 'available-icon',
      title: 'Available',
      description:
        "Pick a stand and you're instantly bookable by nearby passengers.",
    },
    {
      icon: '⊗',
      className: 'busy-icon',
      title: 'Busy',
      description:
        "Your route stays visible. If there's room, passengers can still join.",
    },
    {
      icon: '◇',
      className: 'full-icon',
      title: 'Full & busy',
      description:
        'Once your seats are full, new ride requests stop coming to you automatically.',
    },
    {
      icon: '◷',
      className: 'offline-icon',
      title: 'Offline',
      description:
        "You're off the clock — invisible to passengers until you become available again.",
    },
  ];

  return (
    <div className="info-card">
      <div className="info-card-header">
        <h2>How it works</h2>
      </div>

      <div className="status-info-list">
        {statusInformation.map((item) => (
          <div className="info-item" key={item.title}>
            <div className={`info-icon ${item.className}`}>
              {item.icon}
            </div>

            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatusInfo;
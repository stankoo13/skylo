function Loading() {
  return (
    <div className="dashboard skeleton">
      <div className="dashboard-top">
        <div className="main-info">
          <div className="skel skel-title"></div>
          <div className="skel skel-date"></div>
          <div className="skel skel-temp"></div>
        </div>
        <div className="details-grid">
          {[...Array(6)].map((_, i) => (
            <div className="detail-item" key={i}>
              <div className="skel skel-label"></div>
              <div className="skel skel-value"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="hourly-section">
        <div className="skel skel-label"></div>
        <div className="hourly-scroll">
          {[...Array(8)].map((_, i) => (
            <div className="hourly-item" key={i}>
              <div className="skel skel-small"></div>
              <div className="skel skel-icon"></div>
              <div className="skel skel-small"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Loading
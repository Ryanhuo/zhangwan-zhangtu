import { getProjectName } from "./branding";

type SiteBrandProps = {
  tagline?: string;
};

export function SiteBrand({ tagline }: SiteBrandProps) {
  return (
    <div className="site-brand">
      <div className="site-brand-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="site-brand-icon">
          <rect x="2.1" y="2.1" width="19.8" height="19.8" rx="5.8" fill="currentColor" opacity="0.15" />
          <rect x="4.3" y="6" width="15.4" height="3.4" rx="1.7" fill="currentColor" />
          <rect x="4.3" y="10.3" width="11.3" height="3.4" rx="1.7" fill="currentColor" />
          <rect x="4.3" y="14.6" width="15.4" height="3.4" rx="1.7" fill="currentColor" />
        </svg>
      </div>
      <div className="site-brand-copy">
        <span className="site-brand-name">{getProjectName()}</span>
        {tagline ? <span className="site-brand-tagline">{tagline}</span> : null}
      </div>
    </div>
  );
}

import { useState } from "react";
import Link from "next/link";

const styles = `
  .view-all-wrapper {
    display: flex;
    // justify-content: center;
    padding: 2rem 1rem;
  }

  .view-all-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 28px;
    border: 1.5px solid #8B6914;
    border-radius: 4px;
    background: transparent;
    color: #8B6914;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.04em;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease;
    font-family: inherit;
    white-space: nowrap;
  }

  .view-all-btn:hover {
    background: #8B6914;
    color: #ffffff;
    border-color: #8B6914;
  }

  .btn-label {
    line-height: 1;
  }

  .btn-arrow {
    display: inline-flex;
    align-items: center;
    overflow: hidden;
    width: 16px;
    transition: width 0.3s ease;
  }

  .view-all-btn:not(:hover) .btn-arrow {
    width: 0px;
    opacity: 0;
    transition: width 0.3s ease, opacity 0.2s ease;
  }

  .view-all-btn:hover .btn-arrow {
    width: 20px;
    opacity: 1;
    transition: width 0.3s ease, opacity 0.2s ease 0.05s;
  }

  .arrow-icon {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
    transform: translateX(-4px);
    transition: transform 0.3s ease;
  }

  .view-all-btn:hover .arrow-icon {
    transform: translateX(0px);
  }

  @media (max-width: 480px) {
    .view-all-btn {
      font-size: 13px;
      padding: 11px 22px;
    }
  }
`;

export default function ViewAllButton({ label = "View All", href = "/news" }) {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <style>{styles}</style>
      <div className="view-all-wrapper">
        <Link
          href={href}
          className="view-all-btn"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <span className="btn-label">{label}</span>
          <span className="btn-arrow">
            <svg className="arrow-icon" viewBox="0 0 16 16" aria-hidden="true">
              <line x1="1" y1="8" x2="14" y2="8" />
              <polyline points="9,3 14,8 9,13" />
            </svg>
          </span>
        </Link>
      </div>
    </>
  );
}

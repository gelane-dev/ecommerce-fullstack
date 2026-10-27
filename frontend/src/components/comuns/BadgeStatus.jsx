import "./BadgeStatus.css";

export const BadgeStatus = ({ status }) => (
    <span className={`badge-status badge-status-${status}`}>
        {status}
    </span>
);

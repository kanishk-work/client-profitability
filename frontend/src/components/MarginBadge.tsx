import { Tag } from "antd";

export default function MarginBadge({ margin_pct }: { margin_pct: number }) {
  if (margin_pct >= 20) return <Tag color="success">{margin_pct}% ✓</Tag>;
  if (margin_pct >= 10) return <Tag color="warning">{margin_pct}% ~</Tag>;
  return <Tag color="error">{margin_pct}% ✗</Tag>;
}
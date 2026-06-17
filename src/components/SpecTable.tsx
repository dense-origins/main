import type { SpecRow } from '@/lib/types';

export default function SpecTable({ rows, ariaLabel }: { rows: SpecRow[]; ariaLabel?: string }) {
  if (rows.length === 0) return null;

  return (
    <table className="spec-table" aria-label={ariaLabel}>
      <tbody>
        {rows.map((row) => (
          <tr key={`${row.section_id}-${row.row_order}`}>
            <td>{row.label}</td>
            <td>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

import { useState } from "react";
import { Table, DatePicker, Spin, Modal } from "antd";
import dayjs from "dayjs";
import {
  useGetProfitabilityQuery,
  useGetClientProfitabilityQuery,
} from "../api";
import MarginBadge from "../components/MarginBadge";
import type { ProfitabilityRow } from "../types";

function ClientDetailModal({
  clientId,
  clientName,
  month,
  open,
  onClose,
}: {
  clientId: number;
  clientName: string;
  month: string;
  open: boolean;
  onClose: () => void;
}) {
  const { data = [], isLoading } = useGetClientProfitabilityQuery(
    { clientId, month },
    { skip: !open }
  );

  const columns = [
    { title: "Role", dataIndex: "role_name", key: "role_name" },
    {
      title: "Cost / Hr",
      dataIndex: "cost_per_hour",
      key: "cost_per_hour",
      render: (v: number) => `$${Number(v).toFixed(2)}`,
    },
    { title: "Hours", dataIndex: "hours", key: "hours" },
    {
      title: "Total Cost",
      dataIndex: "cost",
      key: "cost",
      render: (v: number) => `$${Number(v).toLocaleString()}`,
    },
  ];

  return (
    <Modal
      title={`${clientName} — Role Breakdown`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={640}
    >
      {isLoading ? (
        <Spin />
      ) : (
        <Table
          rowKey="role_id"
          dataSource={data}
          columns={columns}
          pagination={false}
        />
      )}
    </Modal>
  );
}

export default function Dashboard() {
  const [month, setMonth] = useState(
    dayjs().startOf("month").format("YYYY-MM-DD")
  );
  const [selected, setSelected] = useState<ProfitabilityRow | null>(null);

  const { data = [], isLoading } = useGetProfitabilityQuery(month);

  const columns = [
    { title: "Client", dataIndex: "client_name", key: "client_name" },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      render: (v: number) => `$${Number(v).toLocaleString()}`,
    },
    {
      title: "Actual Hrs",
      dataIndex: "actual_hours",
      key: "actual_hours",
      render: (v: number) => Number(v).toFixed(1),
    },
    {
      title: "Delivery Cost",
      dataIndex: "delivery_cost",
      key: "delivery_cost",
      render: (v: number) => `$${Number(v).toLocaleString()}`,
    },
    {
      title: "Gross Margin",
      dataIndex: "gross_margin",
      key: "gross_margin",
      render: (v: number) => (
        <span className={Number(v) >= 0 ? "text-green-600" : "text-red-500"}>
          ${Number(v).toLocaleString()}
        </span>
      ),
    },
    {
      title: "Margin %",
      dataIndex: "margin_pct",
      key: "margin_pct",
      render: (v: number) => <MarginBadge margin_pct={Number(v)} />,
    },
    {
      title: "Hrs Variance %",
      dataIndex: "hours_variance_pct",
      key: "hours_variance_pct",
      render: (v: number | null) =>
        v == null ? (
          "—"
        ) : (
          <span className={Number(v) > 0 ? "text-red-500" : "text-green-600"}>
            {Number(v) > 0 ? "+" : ""}
            {Number(v).toFixed(1)}%
          </span>
        ),
    },
    {
      title: "Detail",
      key: "detail",
      render: (_: any, r: ProfitabilityRow) => (
        <a onClick={() => setSelected(r)}>View</a>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold m-0">Profitability Dashboard</h2>
        <DatePicker
          picker="month"
          defaultValue={dayjs()}
          onChange={(d) => {
            if (d) setMonth(d.startOf("month").format("YYYY-MM-DD"));
          }}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center mt-20">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          rowKey="client_id"
          dataSource={data}
          columns={columns}
          pagination={false}
        />
      )}

      {selected && (
        <ClientDetailModal
          clientId={selected.client_id}
          clientName={selected.client_name}
          month={month}
          open={!!selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

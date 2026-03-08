import { useState } from "react";
import { Table, Button, Modal, Form, Select, InputNumber, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import {
  useGetRevenueQuery,
  useSetRevenueMutation,
  useGetClientsQuery,
} from "../api";
import type { ClientMonthlyRevenue } from "../types";

export default function Revenue() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const { data: revenues = [], isLoading } = useGetRevenueQuery();
  const { data: clients = [] } = useGetClientsQuery();
  const [setRevenue, { isLoading: saving }] = useSetRevenueMutation();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await setRevenue({
        ...values,
        month: values.month.startOf("month").format("YYYY-MM-DD"),
      }).unwrap();
      message.success("Revenue saved");
      form.resetFields();
      setOpen(false);
    } catch (err: any) {
      message.error(err?.data?.error || "Failed to save revenue");
    }
  };

  const columns = [
    {
      title: "Client",
      key: "client",
      render: (_: any, r: ClientMonthlyRevenue) =>
        r.client?.name ?? r.client_id,
    },
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
      render: (v: string) => dayjs(v).format("MMM YYYY"),
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      render: (v: number) => `$${Number(v).toLocaleString()}`,
    },
    {
      title: "Estimated Hours",
      dataIndex: "estimated_hours",
      key: "estimated_hours",
      render: (v: number | null) => v ?? "—",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold m-0">Revenue</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
        >
          Set Revenue
        </Button>
      </div>

      <Table
        rowKey="id"
        dataSource={revenues}
        columns={columns}
        loading={isLoading}
      />

      <Modal
        title="Set Monthly Revenue"
        open={open}
        onOk={handleSubmit}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
        }}
        confirmLoading={saving}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="client_id"
            label="Client"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select client">
              {clients.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="month" label="Month" rules={[{ required: true }]}>
            <DatePicker picker="month" className="w-full" />
          </Form.Item>
          <Form.Item
            name="revenue"
            label="Revenue ($)"
            rules={[{ required: true }]}
          >
            <InputNumber className="w-full" min={0} placeholder="10000" />
          </Form.Item>
          <Form.Item name="estimated_hours" label="Estimated Hours (optional)">
            <InputNumber className="w-full" min={0} placeholder="120" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

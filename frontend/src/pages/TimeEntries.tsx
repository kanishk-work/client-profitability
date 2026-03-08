import { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  InputNumber,
  DatePicker,
  Popconfirm,
  message,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useGetTimeEntriesQuery,
  useCreateTimeEntryMutation,
  useDeleteTimeEntryMutation,
  useGetClientsQuery,
  useGetRolesQuery,
} from "../api";
import type { TimeEntry } from "../types";

export default function TimeEntries() {
  const [open, setOpen] = useState(false);
  const [filterClient, setFilterClient] = useState<number | undefined>();
  const [filterMonth, setFilterMonth] = useState<string | undefined>();
  const [form] = Form.useForm();

  const { data: entries = [], isLoading } = useGetTimeEntriesQuery({
    client_id: filterClient,
    month: filterMonth,
  });
  const { data: clients = [] } = useGetClientsQuery();
  const { data: roles = [] } = useGetRolesQuery();
  const [createEntry, { isLoading: creating }] = useCreateTimeEntryMutation();
  const [deleteEntry] = useDeleteTimeEntryMutation();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await createEntry({
        ...values,
        date: values.date.format("YYYY-MM-DD"),
      }).unwrap();
      message.success("Time entry added");
      form.resetFields();
      setOpen(false);
    } catch (err: any) {
      message.error(err?.data?.error || "Failed to add time entry");
    }
  };

  const columns = [
    {
      title: "Client",
      key: "client",
      render: (_: any, r: TimeEntry) => r.client?.name ?? r.client_id,
    },
    {
      title: "Role",
      key: "role",
      render: (_: any, r: TimeEntry) => r.role?.name ?? r.role_id,
    },
    { title: "Hours", dataIndex: "hours", key: "hours" },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (v: string) => dayjs(v).format("DD MMM YYYY"),
    },
    {
      title: "",
      key: "actions",
      render: (_: any, r: TimeEntry) => (
        <Popconfirm
          title="Delete this entry?"
          onConfirm={async () => {
            await deleteEntry(r.id);
            message.success("Entry deleted");
          }}
        >
          <Button danger icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold m-0">Time Entries</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
        >
          Add Entry
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <Select
          allowClear
          placeholder="Filter by client"
          className="w-48"
          onChange={(v) => setFilterClient(v)}
        >
          {clients.map((c) => (
            <Select.Option key={c.id} value={c.id}>
              {c.name}
            </Select.Option>
          ))}
        </Select>
        <DatePicker
          picker="month"
          placeholder="Filter by month"
          onChange={(d) =>
            setFilterMonth(
              d ? d.startOf("month").format("YYYY-MM-DD") : undefined
            )
          }
        />
      </div>

      <Table
        rowKey="id"
        dataSource={entries}
        columns={columns}
        loading={isLoading}
      />

      <Modal
        title="Add Time Entry"
        open={open}
        onOk={handleSubmit}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
        }}
        confirmLoading={creating}
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
          <Form.Item name="role_id" label="Role" rules={[{ required: true }]}>
            <Select placeholder="Select role">
              {roles.map((r) => (
                <Select.Option key={r.id} value={r.id}>
                  {r.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="hours" label="Hours" rules={[{ required: true }]}>
            <InputNumber
              className="w-full"
              min={0.5}
              max={24}
              step={0.5}
              placeholder="8"
            />
          </Form.Item>
          <Form.Item name="date" label="Date" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

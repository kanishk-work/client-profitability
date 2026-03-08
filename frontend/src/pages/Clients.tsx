import { useState } from "react";
import { Table, Button, Modal, Form, Input, Popconfirm, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  useGetClientsQuery,
  useCreateClientMutation,
  useDeleteClientMutation,
} from "../api";
import type { Client } from "../types";

export default function Clients() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const { data: clients = [], isLoading } = useGetClientsQuery();
  const [createClient, { isLoading: creating }] = useCreateClientMutation();
  const [deleteClient] = useDeleteClientMutation();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await createClient(values).unwrap();
      message.success("Client created");
      form.resetFields();
      setOpen(false);
    } catch (err: any) {
      message.error(err?.data?.error || "Failed to create client");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      render: (v: string) => new Date(v).toLocaleDateString(),
    },
    {
      title: "",
      key: "actions",
      render: (_: any, r: Client) => (
        <Popconfirm
          title="Delete this client?"
          onConfirm={async () => {
            await deleteClient(r.id);
            message.success("Client deleted");
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
        <h2 className="text-xl font-semibold m-0">Clients</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
        >
          Add Client
        </Button>
      </div>

      <Table
        rowKey="id"
        dataSource={clients}
        columns={columns}
        loading={isLoading}
      />

      <Modal
        title="Add Client"
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
            name="name"
            label="Client Name"
            rules={[{ required: true }]}
          >
            <Input placeholder="e.g. Acme Corp" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

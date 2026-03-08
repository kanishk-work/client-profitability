import { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  message,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useDeleteRoleMutation,
} from "../api";
import type { Role } from "../types";

export default function Roles() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const { data: roles = [], isLoading } = useGetRolesQuery();
  const [createRole, { isLoading: creating }] = useCreateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await createRole(values).unwrap();
      message.success("Role created");
      form.resetFields();
      setOpen(false);
    } catch (err: any) {
      message.error(err?.data?.error || "Failed to create role");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Monthly Salary",
      dataIndex: "monthly_salary",
      key: "monthly_salary",
      render: (v: number) => `$${Number(v).toLocaleString()}`,
    },
    {
      title: "Productive Hrs/Month",
      dataIndex: "productive_hours_per_month",
      key: "productive_hours_per_month",
    },
    {
      title: "Cost / Hour",
      key: "cost_per_hour",
      render: (_: any, r: Role) =>
        `$${(
          Number(r.monthly_salary) / Number(r.productive_hours_per_month)
        ).toFixed(2)}`,
    },
    {
      title: "",
      key: "actions",
      render: (_: any, r: Role) => (
        <Popconfirm
          title="Delete this role?"
          onConfirm={async () => {
            await deleteRole(r.id);
            message.success("Role deleted");
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
        <h2 className="text-xl font-semibold m-0">Roles</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
        >
          Add Role
        </Button>
      </div>

      <Table
        rowKey="id"
        dataSource={roles}
        columns={columns}
        loading={isLoading}
      />

      <Modal
        title="Add Role"
        open={open}
        onOk={handleSubmit}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
        }}
        confirmLoading={creating}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="name" label="Role Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Designer" />
          </Form.Item>
          <Form.Item
            name="monthly_salary"
            label="Monthly Salary ($)"
            rules={[{ required: true }]}
          >
            <InputNumber className="w-full" min={0} placeholder="5000" />
          </Form.Item>
          <Form.Item
            name="productive_hours_per_month"
            label="Productive Hours / Month"
            rules={[{ required: true }]}
          >
            <InputNumber
              className="w-full"
              min={1}
              max={744}
              placeholder="160"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

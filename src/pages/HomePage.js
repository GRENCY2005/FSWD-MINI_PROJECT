import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  message,
  Table,
  DatePicker,
  Button,
} from "antd";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import Spinner from "../components/Spinner";
import moment from "moment";
import {
  UnorderedListOutlined,
  AreaChartOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Analytics from "../components/Analytics";

const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [selectedDate, setSelectedDate] = useState([]);
  const [type, setType] = useState("all");
  const [viewData, setViewData] = useState("table");
  const [editable, setEditable] = useState(null);

  const [form] = Form.useForm();

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Reference",
      dataIndex: "reference",
    },
    {
      title: "Actions",
      render: (text, record) => (
        <div>
          <EditOutlined
            onClick={() => {
              setEditable(record);
              setShowModal(true);
              form.setFieldsValue({
                ...record,
                date: moment(record.date, "YYYY-MM-DD"), // fix for edit
              });
            }}
          />
          <DeleteOutlined className="mx-2" onClick={() => {handleDelete(record);}}/>
        </div>
      ),
    },
  ];

  // Fetch Transactions
  useEffect(() => {
    const getAllTransactions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        setLoading(true);
        const res = await axios.post("/transections/get-transection", {
          userid: user._id,
          frequency,
          selectedDate,
          type,
        });
        setAllTransaction(res.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
        message.error("Failed to fetch transactions");
      }
    };
    getAllTransactions();
  }, [frequency, selectedDate, type]);

//delete handle
const handleDelete = async (record) => {
  try{
    setLoading(true);
    await axios.post("/transections/delete-transection",{transactionId:record._id});
    setLoading(false);
    message.success("Transaction deleted");
  }
  catch(error)
  {
    setLoading(false);
    console.log(error);
    message.error('unable to delete');
  }
};

  // Handle Add Transaction
  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);

      values.date = values.date.format("YYYY-MM-DD"); // fix for submit

      if (editable) {
        await axios.post("/transections/edit-transection", {
          payload: {
            ...values,
            userid: user._id,
          },
          transactionId: editable._id,
        });
        setLoading(false);
        message.success("Transaction Updated successfully");
      } else {
        await axios.post("/transections/add-transection", {
          ...values,
          userid: user._id,
        });
        setLoading(false);
        message.success("Transaction added successfully");
      }

      form.resetFields();
      setShowModal(false);
      setEditable(null);
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error("Failed to add transaction");
    }
  };

  return (
    <Layout>
      {loading && <Spinner />}

      <div className="filters d-flex justify-content-between align-items-center">
        <div>
          <h6>Select Frequency</h6>
          <Select value={frequency} onChange={(value) => setFrequency(value)}>
            <Select.Option value="0">Today</Select.Option>
            <Select.Option value="1">Yesterday</Select.Option>
            <Select.Option value="7">Last 1 Week</Select.Option>
            <Select.Option value="30">Last 1 Month</Select.Option>
            <Select.Option value="365">Last 1 Year</Select.Option>
            <Select.Option value="custom">Custom</Select.Option>
          </Select>

          {frequency === "custom" && (
            <RangePicker
              value={selectedDate}
              onChange={(values) => setSelectedDate(values)}
            />
          )}
        </div>

        <div>
          <h6>Select Type</h6>
          <Select value={type} onChange={(value) => setType(value)}>
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="income">Income</Select.Option>
            <Select.Option value="expense">Expense</Select.Option>
          </Select>
        </div>

        <div className="d-flex">
          <Button onClick={() => setViewData("table")} icon={<UnorderedListOutlined />} />
          <Button onClick={() => setViewData("analytics")} icon={<AreaChartOutlined />} />
          <Button onClick={() => setShowModal(true)} icon={<PlusCircleOutlined />}>
            Add New
          </Button>
        </div>
      </div>

      <div className="content">
        {viewData === "table" ? (
          <Table columns={columns} dataSource={allTransaction} />
        ) : (
          <Analytics allTransaction={allTransaction} />
        )}
      </div>

      <Modal
        title={editable ? "Edit Transaction" : "Add Transaction"}
        open={showModal}
        onCancel={() => {
          setShowModal(false);
          setEditable(null);
        }}
        onOk={() => {
          form.submit();
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Type" name="type" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
  label="Category"
  name="category"
  rules={[{ required: true, message: "Please select a category" }]}
>
  <Select placeholder="Select Category">
    <Select.Option value="Movie">Movie</Select.Option>
    <Select.Option value="Salary">Salary</Select.Option>
    <Select.Option value="Tip">Tip</Select.Option>
    <Select.Option value="Food">Food</Select.Option>
    <Select.Option value="Medicine">Medicine</Select.Option>
    <Select.Option value="Bill">Bill</Select.Option>
    <Select.Option value="Other">Other</Select.Option>
  </Select>
</Form.Item>
          <Form.Item label="Date" name="date" rules={[{ required: true }]}>
            <DatePicker />
          </Form.Item>
          <Form.Item label="Reference" name="reference">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input type="text" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;

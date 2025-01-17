import React from 'react';
import { Form, Input, Select, Button, Space, Card } from 'antd';
import { SearchOutlined, UndoOutlined } from '@ant-design/icons';
import styles from './index.module.css';

const { Option } = Select;

interface SearchFormProps {
  fields: {
    name: string;
    label: string;
    type: 'input' | 'select';
    options?: Array<{ label: string; value: string | number }>;
  }[];
  onSearch: (values: any) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ fields, onSearch }) => {
  const [form] = Form.useForm();

  const handleReset = () => {
    form.resetFields();
    onSearch({});
  };

  const handleSearch = async () => {
    try {
      const values = await form.validateFields();
      onSearch(values);
    } catch (error) {
      console.error('Search form validation failed:', error);
    }
  };

  const renderField = (field: SearchFormProps['fields'][0]) => {
    if (field.type === 'select' && field.options) {
      return (
        <Select allowClear>
          {field.options.map(option => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      );
    }
    return <Input placeholder={`请输入${field.label}`} allowClear />;
  };

  return (
    <Card className={styles.searchForm}>
      <Form
        form={form}
        layout="inline"
        onFinish={handleSearch}
      >
        {fields.map(field => (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
          >
            {renderField(field)}
          </Form.Item>
        ))}
        <Form.Item>
          <Space>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
            >
              搜索
            </Button>
            <Button
              icon={<UndoOutlined />}
              onClick={handleReset}
            >
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SearchForm;

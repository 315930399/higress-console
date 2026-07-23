import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Space, Table, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { getConsumers } from '@/services/consumer';
import { Consumer } from '@/interfaces/consumer';
import styles from './index.module.css';

interface ConsumerSelectorProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

const PAGE_SIZE = 10;

const ConsumerSelector: React.FC<ConsumerSelectorProps> = ({
  value = [],
  onChange,
  disabled = false,
  placeholder,
}) => {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [consumerList, setConsumerList] = useState<Consumer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [tempSelectedKeys, setTempSelectedKeys] = useState<string[]>([]);

  const fetchConsumers = async () => {
    setLoading(true);
    try {
      const result = await getConsumers();
      setConsumerList(result || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (modalVisible) {
      setSearchKeyword('');
      setCurrentPage(1);
      setTempSelectedKeys([...value]);
      fetchConsumers();
    }
  }, [modalVisible]);

  const handleOk = () => {
    onChange?.(tempSelectedKeys);
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleRemoveConsumer = (name: string) => {
    onChange?.(value.filter((v) => v !== name));
  };

  const filteredList = searchKeyword
    ? consumerList.filter((c) => c.name.toLowerCase().includes(searchKeyword.toLowerCase()))
    : consumerList;

  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const currentPageItems = filteredList.slice(startIdx, startIdx + PAGE_SIZE);
  const currentPageKeySet = new Set(currentPageItems.map((c) => c.name));

  const rowSelection = {
    selectedRowKeys: tempSelectedKeys,
    onChange: (keys: React.Key[]) => {
      const selectedCurrentPageKeys = (keys as string[]).filter((k) => currentPageKeySet.has(k));

      if (selectedCurrentPageKeys.length === currentPageItems.length) {
        setTempSelectedKeys(filteredList.map((c) => c.name));
      } else if (selectedCurrentPageKeys.length === 0) {
        setTempSelectedKeys([]);
      } else {
        setTempSelectedKeys(keys as string[]);
      }
    },
  };

  const columns = [
    {
      title: t('consumer.columns.name'),
      dataIndex: 'name',
      key: 'name',
    },
  ];

  return (
    <>
      <div
        className={styles.trigger}
        style={disabled ? { cursor: 'not-allowed', background: '#f5f5f5' } : undefined}
        onClick={() => {
          if (!disabled) setModalVisible(true);
        }}
      >
        {value.length > 0 ? (
          <Space size={[0, 4]} wrap>
            {value.map((name) => (
              <Tag
                key={name}
                closable
                onClose={(e) => {
                  e.preventDefault();
                  handleRemoveConsumer(name);
                }}
              >
                {name}
              </Tag>
            ))}
          </Space>
        ) : (
          <span className={styles.placeholder}>{placeholder}</span>
        )}
      </div>
      <Modal
        title={placeholder}
        open={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={560}
        destroyOnClose
      >
        <Input.Search
          placeholder={t('misc.search')}
          allowClear
          onSearch={(val) => {
            setSearchKeyword(val);
            setCurrentPage(1);
          }}
          onChange={(e) => {
            if (!e.target.value) {
              setSearchKeyword('');
              setCurrentPage(1);
            }
          }}
          style={{ marginBottom: 16 }}
        />
        <Table
          rowKey="name"
          columns={columns}
          dataSource={filteredList}
          rowSelection={rowSelection}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: PAGE_SIZE,
            showSizeChanger: true,
            showTotal: (total) => `${t('misc.total')} ${total}`,
          }}
          onChange={(pag: any) => setCurrentPage(pag.current)}
          size="small"
        />
      </Modal>
    </>
  );
};

export default ConsumerSelector;

import React, { useEffect, useState } from 'react';
import { Drawer, Form, Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import ConsumerSelector from '@/pages/route/components/ConsumerSelector';
import { addMcpConsumers, listMcpConsumers } from '@/services/mcp';

interface AddConsumerAuthProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mcpName: string;
  strategyConfigId: string;
}

const AddConsumerAuth: React.FC<AddConsumerAuthProps> = ({
  visible,
  onClose,
  onSuccess,
  mcpName,
  strategyConfigId,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [authorizedConsumers, setAuthorizedConsumers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAuthorizedConsumers = async () => {
    try {
      const res = await listMcpConsumers({ mcpServerName: mcpName });
      setAuthorizedConsumers(res.map((item: any) => item.consumerName));
    } catch (error) {
      // 如果获取已授权消费者失败，不影响添加功能
      message.warning(t('mcp.detail.fetchAuthorizedConsumersError'));
    }
  };

  useEffect(() => {
    if (visible) {
      fetchAuthorizedConsumers();
      form.resetFields();
    }
  }, [visible, mcpName]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await addMcpConsumers({
        mcpServerName: mcpName,
        consumers: values.consumerIds,
      });
      message.success(t('mcp.detail.authSuccess'));
      onSuccess();
      onClose();
    } catch (error) {
      message.error(t('mcp.detail.authError'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Drawer
      title={t('mcp.detail.addConsumerAuth')}
      open={visible}
      onClose={handleClose}
      width={700}
      destroyOnClose
      extra={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={handleClose} style={{ marginRight: 8 }}>
            {t('mcp.common.cancel')}
          </Button>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            {t('mcp.common.add')}
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" initialValues={{ consumerIds: [] }}>
        <Form.Item label={t('mcp.detail.authScope')}>{t('mcp.detail.authScopeMcpService', { name: mcpName })}</Form.Item>
        <Form.Item
          name="consumerIds"
          label={t('mcp.detail.consumer')}
          rules={[{ required: true, message: t('mcp.detail.selectConsumer') || '请选择消费者' }]}
        >
          <ConsumerSelector placeholder={t('mcp.detail.selectConsumer') || '请选择消费者'} />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddConsumerAuth;

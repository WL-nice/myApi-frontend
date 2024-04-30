import { ProColumns, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { message, Modal } from 'antd';
import React from 'react';
import { updateUserInterfaceInfo } from '@/services/myapi/userInterfaceInfoController';

interface Props {
  oldData?: API.User;
  visible: boolean;
  columns: ProColumns<API.UserInterfaceInfo>[];
  onSubmit: (values: API.UserInterfaceInfoUpdateRequest) => void;
  onCancel: () => void;
}

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.UserInterfaceInfoUpdateRequest) => {
  const hide = message.loading('正在更新');
  try {
    await updateUserInterfaceInfo(fields);
    hide();
    message.success('更新成功');
    return true;
  } catch (error: any) {
    hide();
    message.error('更新失败，' + error.message);
    return false;
  }
};

/**
 * 更新弹窗
 * @param props
 * @constructor
 */
const UpdateModal: React.FC<Props> = (props) => {
  const {oldData, visible, columns, onSubmit, onCancel} = props;

  if (!oldData) {
    return <></>;
  }

  return (
    <Modal
      destroyOnClose
      title={'更新'}
      open={visible}
      footer={null}
      onCancel={() => {
        onCancel?.();
      }}
    >
      <ProTable
        type="form"
        columns={[
          {
          title: '总调用次数',
          dataIndex: 'totalNum',
          valueType: 'text',
        },
        {
          title: '剩余次数',
          dataIndex: 'leftNum',
          valueType: 'text',
        }]
      }
        form={{
          initialValues: oldData,
        }}
        onSubmit={async (values: API.UserInterfaceInfoUpdateRequest) => {
          const success = await handleUpdate({
            ...values,
            id: oldData.id as any,
          });
          if (success) {
            onSubmit?.(values);
          }
        }}
      />
    </Modal>
  );
};
export default UpdateModal;

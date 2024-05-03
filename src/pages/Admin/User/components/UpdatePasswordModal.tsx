import {ProColumns, ProTable} from '@ant-design/pro-components';
import '@umijs/max';
import {message, Modal} from 'antd';
import React from 'react';
import {updatePwd, updateUser} from '@/services/myapi/userController';

interface Props {
  oldData?: API.User;
  visible: boolean;
  columns: ProColumns<API.User>[];
  onSubmit: (values: API.UserUpdatePasswordRequest) => void;
  onCancel: () => void;
}

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.UserUpdatePasswordRequest) => {
  const hide = message.loading('正在更新');
  try {
    await updatePwd(fields);
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
const UpdatePasswordModal: React.FC<Props> = (props) => {
  const {oldData, visible, columns, onSubmit, onCancel} = props;

  if (!oldData) {
    return <></>;
  }

  return (
    <Modal
      destroyOnClose
      title={'修改密码'}
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
            title: '密码',
            dataIndex: 'password',
            valueType: 'password',
          },
          {
            title: '确认密码',
            dataIndex: 'checkPassword',
            valueType: 'password',
          }]
        }
        form={{
          initialValues: undefined,
        }}
        onSubmit={async (values: API.UserUpdateRequest) => {
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
export default UpdatePasswordModal;

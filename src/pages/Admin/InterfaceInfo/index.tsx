import CreateModal from '@/pages/Admin/InterfaceInfo/components/CreateModal';
import UpdateModal from '@/pages/Admin/InterfaceInfo/components/UpdateModal';
import {PlusOutlined} from '@ant-design/icons';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProTable} from '@ant-design/pro-components';
import '@umijs/max';
import {Button, Space, Typography, message} from 'antd';
import React, {useRef, useState} from 'react';
import {
  deleteInterfaceInfo,
  listInterfaceInfoByPage, offlineInterfaceInfo,
  onlineInterfaceInfo
} from "@/services/myapi/interfaceInfoController";

/**
 * 用户管理页面
 *
 * @constructor
 */
const InterfaceInfoAdminPage: React.FC = () => {
    // 是否显示新建窗口
    const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
    // 是否显示更新窗口
    const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    // 当前用户点击的数据
    const [currentRow, setCurrentRow] = useState<API.User>();

    /**
     * 删除节点
     *
     * @param row
     */
    const handleDelete = async (row: API.User) => {
      const hide = message.loading('正在删除');
      if (!row) return true;
      try {
        await deleteInterfaceInfo({id: row.id as any,});
        hide();
        message.success('删除成功');
        actionRef?.current?.reload();
        return true;
      } catch (error: any) {
        hide();
        message.error('删除失败，' + error.message);
        return false;
      }
    };

    /**
     * 发布接口
     *
     * @param record
     */
    const handleOnline = async (record: API.IdRequest) => {
      const hide = message.loading('发布中');
      if (!record) return true;
      try {
        await onlineInterfaceInfo({
          id: record.id
        });
        hide();
        message.success('操作成功');
        actionRef.current?.reload();
        return true;
      } catch (error: any) {
        hide();
        message.error('操作失败，' + error.message);
        return false;
      }
    };

    /**
     * 下线接口
     *
     * @param record
     */
    const handleOffline = async (record: API.IdRequest) => {
      const hide = message.loading('发布中');
      if (!record) return true;
      try {
        await offlineInterfaceInfo({
          id: record.id
        });
        hide();
        message.success('操作成功');
        actionRef.current?.reload();
        return true;
      } catch (error: any) {
        hide();
        message.error('操作失败，' + error.message);
        return false;
      }
    };


    /**
     * 表格列配置
     */
    const columns: ProColumns<API.InterfaceInfo>[] = [
      {
        title: 'id',
        dataIndex: 'id',
        valueType: 'text',
        hideInForm: true,
      },
      {
        title: '接口名',
        dataIndex: 'name',
        valueType: 'text',
        formItemProps: {
          rules: [{
            required: true,
            message: '接口名不能为空',
          }],
        },
      },
      {
        title: '描述',
        dataIndex: 'description',
        valueType: 'text',
      },
      {
        title: '请求方法',
        dataIndex: 'method',
        valueType: 'text',
        formItemProps: {
          rules: [{
            required: true,
            message: '请求方法不能为空',
          }],
        },
      },
      {
        title: 'url',
        dataIndex: 'url',
        valueType: 'text',
        formItemProps: {
          rules: [{
            required: true,
            message: '接口url不能为空',
          }],
        }
      },
      {
        title: '请求参数',
        dataIndex: 'requestParams',
        valueType: 'jsonCode',
        hideInSearch: true,
      },
      {
        title: '请求头',
        dataIndex: 'requestHeader',
        valueType: 'jsonCode',
        hideInSearch: true,
      },
      {
        title: '响应头',
        dataIndex: 'responseHeader',
        valueType: 'jsonCode',
        hideInSearch: true,
      },
      {
        title: '状态',
        dataIndex: 'status',
        valueType: 'text',
        valueEnum: {
          0: {
            text: '下线',
          },
          1: {
            text: '正常',
          },
        },
        hideInForm: true,
      },
      {
        title: '创建人',
        dataIndex: 'userId',
        valueType: 'text',
        hideInForm: true,
      },
      {
        title: '创建时间',
        sorter: true,
        dataIndex: 'createTime',
        valueType: 'dateTime',
        hideInSearch: true,
        hideInForm: true,
      },
      // {
      //   title: '更新时间',
      //   sorter: true,
      //   dataIndex: 'updateTime',
      //   valueType: 'dateTime',
      //   hideInSearch: true,
      //   hideInForm: true,
      // },
      {
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        render: (_, record) => (
          <Space size="middle">
            <Typography.Link
              onClick={() => {
                setCurrentRow(record);
                setUpdateModalVisible(true);
              }}
            >
              修改
            </Typography.Link>
            {record.status === 0 ? <Typography.Link
              key="config"
              onClick={() => {
                handleOnline(record);
              }}
            >
              发布
            </Typography.Link> : null}
            {record.status === 1 ? <Typography.Link
              key="config"
              onClick={() => {
                handleOffline(record);
              }}
            >
              下线
            </Typography.Link> : null}
            <Typography.Link type="danger" onClick={() => handleDelete(record)}>
              删除
            </Typography.Link>
          </Space>
        ),
      },
    ];
    return (
      <PageContainer>
        <ProTable<API.User>
          headerTitle={'查询表格'}
          actionRef={actionRef}
          rowKey="key"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                setCreateModalVisible(true);
              }}
            >
              <PlusOutlined/> 新建
            </Button>,
          ]}
          request={async (params, sort, filter) => {
            const sortField = Object.keys(sort)?.[0];
            const sortOrder = sort?.[sortField] ?? undefined;

            const {data, code} = await listInterfaceInfoByPage({
              ...params,
              sortField,
              sortOrder,
              ...filter,
            } as API.InterfaceInfoQueryRequest);

            return {
              success: code === 0,
              data: data?.records || [],
              total: Number(data?.total) || 0,
            };
          }}
          columns={columns}
        />
        <CreateModal
          visible={createModalVisible}
          columns={columns}
          onSubmit={() => {
            setCreateModalVisible(false);
            actionRef.current?.reload();
          }}
          onCancel={() => {
            setCreateModalVisible(false);
          }}
        />
        <UpdateModal
          visible={updateModalVisible}
          columns={columns}
          oldData={currentRow}
          onSubmit={() => {
            setUpdateModalVisible(false);
            setCurrentRow(undefined);
            actionRef.current?.reload();
          }}
          onCancel={() => {
            setUpdateModalVisible(false);
          }}
        />
      </PageContainer>
    );
  }
;
export default InterfaceInfoAdminPage;

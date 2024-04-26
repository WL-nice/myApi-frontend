import {PageContainer} from '@ant-design/pro-components';
import React, {useEffect, useState} from 'react';
import {Button, Card, Descriptions, message} from 'antd';

import {useModel} from '@@/exports';
import {getUserKey, rebuildUserKey} from "@/services/myapi/userController";

/**
 * 主页
 * @constructor
 */
const GetAKSK: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<API.UserAkSk>();
  const {initialState} = useModel('@@initialState');
  const [invokeLoading, setInvokeLoading] = useState(false);


  const loadData = async () => {
    if (!initialState) {
      message.error('未登录');
      return;
    }
    setLoading(true);
    try {
      const res = await getUserKey({
        id: Number(initialState?.currentUser?.id),
      });
      setData(res.data);
    } catch (error: any) {
      message.error('请求失败，' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onFinish = async () => {
    if (!initialState) {
      message.error('未登录');
      return;
    }
    setInvokeLoading(true);
    try {
      const res = await rebuildUserKey({
        id: Number(initialState?.currentUser?.id),
      });
      setData(res.data);
      message.success('请求成功');
    } catch (error: any) {
      message.error('操作失败，' + error.message);
    }
    setInvokeLoading(false);
  };

  return (
    <PageContainer>
      <Card>
        {data ? (
          <Descriptions title={"开发者密钥"} column={1} extra={<Button onClick={onFinish}>重新生成</Button>}>
            <Descriptions.Item label="accessKey">{data.accessKey}</Descriptions.Item>
            <Descriptions.Item label="secretKey">{data.secretKey}</Descriptions.Item>
          </Descriptions>
        ) : (
          <>用户不存在</>
        )}
      </Card>
    </PageContainer>
  );
};

export default GetAKSK;

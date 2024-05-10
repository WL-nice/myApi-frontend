import { PageContainer, ProForm, ProFormText } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import {Card, Descriptions, Input, message, Select} from 'antd';
import React from 'react';
import useStyles from './index.style';
import {getCurrentUser, updateUserBySelf} from '@/services/myapi/userController';
import { ProFormSelect } from '@ant-design/pro-form/lib';
import dayjs from "dayjs";
import {useModel} from "@@/exports";

const validatorPhone = (rule: any, value: string, callback: (message?: string) => void) => {
  if (!value) {
    callback('手机号码不能为空');
  }
  callback();
};

const BaseView: React.FC = () => {
  const { styles } = useStyles();

  const { data: currentUser, loading } = useRequest(() => {
    return getCurrentUser();
  });
  const handleFinish = async (values :API.UserUpdateByUserRequest) => {
    console.log('form data', values);
    try {
      await updateUserBySelf({
        ...values,
      id: currentUser?.id,});
      message.success('更新基本信息成功');
      // 刷新当前页面
      window.location.reload();
      return true;
    } catch (error: any) {
      message.error('更新失败，' + error.message);
      return false;
    }
  };
  return (
    <PageContainer title="个人中心">
      <Card>
        {currentUser ? (
          <Descriptions title={currentUser.username} column={1}>
            <Descriptions.Item label="账号">{currentUser.userAccount}</Descriptions.Item>
            <Descriptions.Item label="性别">{currentUser.gender ? '女' : '男'}</Descriptions.Item>
            <Descriptions.Item label="角色">{currentUser.userRole ? '普通用户' : '管理员'}</Descriptions.Item>
            <Descriptions.Item label="注册时间">{dayjs(currentUser.createTime).format('YYYY-MM-DD HH:mm')}</Descriptions.Item>
          </Descriptions>
        ) : (
          <>用户不存在</>
        )}
      </Card>
      <Card>
        <Descriptions title="更新信息" column={1}></Descriptions>
        <div className={styles.baseView}>
          {loading ? null : (
            <>
              <div className={styles.left}>
                <ProForm
                  layout="vertical"
                  onFinish={handleFinish}
                  submitter={{
                    searchConfig: {
                      submitText: '更新基本信息',
                    },
                    render: (_, dom) => dom[1],
                  }}
                  initialValues={{
                    ...currentUser,

                  }}
                >
                  <ProFormText
                    width="md"
                    name="email"
                    label="邮箱"
                    rules={[
                      {
                        required: false,
                        message: '请输入您的邮箱!',
                      },
                    ]}
                  />
                  <ProFormText
                    width="md"
                    name="username"
                    label="昵称"
                    rules={[
                      {
                        required: true,
                        message: '请输入您的昵称!',
                      },
                    ]}
                  />
                  <ProFormSelect
                    width="sm"
                    name="gender"
                    label="性别"
                    rules={[
                      {
                        required: true,
                        message: '选择你的性别!',
                      },
                    ]}
                    valueEnum={{
                      0: '男',
                      1: '女',
                    }}
                  />
                  <ProFormText
                    name="phone"
                    label="联系电话"
                    rules={[
                      {
                        required: false,
                        message: '请输入您的联系电话!',
                      },
                      {
                        validator: validatorPhone,
                      },
                    ]}
                  >
                    <Input className={styles.phone_number} />
                  </ProFormText>
                </ProForm>
              </div>
              {/*<div className={styles.right}>*/}
              {/*  <AvatarView avatar={getAvatarURL()} />*/}
              {/*</div>*/}
            </>
          )}
        </div>
      </Card>
    </PageContainer>
  );
};
export default BaseView;

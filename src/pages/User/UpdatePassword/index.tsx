import { PageContainer, ProForm, ProFormText } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { message } from 'antd';
import React from 'react';
import useStyles from './index.style';
import {getCurrentUser, updatePwd, userLogout} from '@/services/myapi/userController';
import {flushSync} from "react-dom";
import {history, useModel} from "@@/exports";
import {stringify} from "querystring";

const BaseView: React.FC = () => {
  const { styles } = useStyles();

  const { data: currentUser, loading } = useRequest(() => {
    return getCurrentUser();
  });
  const {initialState, setInitialState} = useModel('@@initialState');

  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    await userLogout();
    const {search, pathname} = window.location;
    const urlParams = new URL(window.location.href).searchParams;
    /** 此方法会跳转到 redirect 参数所在的位置 */
    const redirect = urlParams.get('redirect');
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: pathname + search,
        }),
      });
    }
  };
  const handleFinish = async (values: API.UserUpdatePasswordRequest) => {
    console.log('form data', values);
    try {
      await updatePwd({
        ...values,
        id: currentUser?.id,
      });
      message.success('修改密码成功');
      flushSync(() => {
        setInitialState((s) => ({...s, currentUser: undefined}));
      });
      loginOut();
      return true;
    } catch (error: any) {
      message.error('更新失败，' + error.message);
      return false;
    }
  };
  return (
    <PageContainer title="修改密码">
      <div className={styles.baseView}>
        {loading ? null : (
          <>
            <div className={styles.left}>
              <ProForm
                layout="vertical"
                onFinish={handleFinish}
                submitter={{
                  searchConfig: {
                    submitText: '修改密码',
                  },
                  render: (_, dom) => dom[1],
                }}
                initialValues={{
                  ...currentUser,
                }}
              >
                <ProFormText.Password
                  width="md"
                  name="password"
                  label="密码"
                  rules={[
                    {
                      required: true,
                      message: '请输入密码!',
                    },
                  ]}
                />
                <ProFormText.Password
                  width="md"
                  name="checkPassword"
                  label="确认密码"
                  rules={[
                    {
                      required: true,
                      message: '请确认密码!',
                    },
                  ]}
                />
              </ProForm>
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
};
export default BaseView;

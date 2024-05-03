import { Footer } from '@/components';
import { getValidCode, userRegister } from '@/services/myapi/userController';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { FormattedMessage, Helmet, history, useIntl } from '@umijs/max';
import { message, Tabs } from 'antd';
import { createStyles } from 'antd-style';
import React, { useEffect, useState } from 'react';

import Settings from '../../../../config/defaultSettings';

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});

const Register: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const {styles} = useStyles();
  const intl = useIntl();
  const [captchaSrc, setCaptchaSrc] = useState<string>('');
  const [captchaKey, setCaptchaKey] = useState<string>('');
  const handleSubmit = async (values: API.UserRegisterRequest) => {
    if (values.userPassword !== values.checkPassword) {
      message.error('两次输入的密码不一致');
      return;
    }
    try {
      // 登录
      const res = await userRegister({
        ...values,
        captchaKey: captchaKey,});
      if (res.code === 0) {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'register.success',
          defaultMessage: '注册成功！',
        });
        message.success(defaultLoginSuccessMessage);
        history.push('/user/login');
        return;
      } else {
        message.error(res.message);
      }
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'register.failure',
        defaultMessage: '注册失败，请重试！',
      });
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };

  const refreshCaptcha = async () => {
    try{
      const res = await getValidCode();
      if (res.code === 0) {
        if(res.data?.codeValue && res.data?.codeKey){
          setCaptchaSrc(res.data.codeValue);
          setCaptchaKey(res.data.codeKey);
        }
      } else {
        message.error('刷新验证码失败，请重试');
      }
    }catch(error){
      message.error('刷新验证码失败，请重试');
    }
  };

  useEffect(()=>{
    refreshCaptcha();
  },[])

  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: '注册',
            defaultMessage: '注册',
          })}
          - {Settings.title}
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          submitter={{
            searchConfig: {
              submitText: '注册',
            },
          }}
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.svg"/>}
          title="MyApi 开放API平台"
          subTitle={ '开放API平台' }
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.UserRegisterRequest);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: intl.formatMessage({
                  id: '注册',
                  defaultMessage: '注册',
                }),
              },
            ]}
          />

          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined/>,
                }}
                placeholder={intl.formatMessage({
                  id: '请输入账号',
                  defaultMessage: '请输入账号',
                })}
                rules={[
                  {
                    required: true,
                    message: <FormattedMessage id="请输入账号" defaultMessage="请输入账号!"/>,
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                placeholder={intl.formatMessage({
                  id: '请输入密码',
                  defaultMessage: '请输入密码',
                })}
                rules={[
                  {
                    required: true,
                    message: <FormattedMessage id="请输入密码" defaultMessage="请输入密码！"/>,
                  },
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                placeholder={intl.formatMessage({
                  id: '请确认密码',
                  defaultMessage: '请确认密码',
                })}
                rules={[
                  {
                    required: true,
                    message: <FormattedMessage id="请确认密码" defaultMessage="请确认密码！"/>,
                  },
                ]}
              />
              <div>
              <ProFormText
                name="captcha"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                placeholder={intl.formatMessage({ id: '请输入验证码', defaultMessage: '请输入验证码' })}
                rules={[
                  {
                    required: true,
                    message: <FormattedMessage id="请输入验证码" defaultMessage="请输入验证码！"/>,
                  },
                ]}
              />
                <img src={captchaSrc} onClick={refreshCaptcha} />
              </div>
            </>
          )}
        </LoginForm>
      </div>
      <Footer/>
    </div>
  );
};

export default Register;

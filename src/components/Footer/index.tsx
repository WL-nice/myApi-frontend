import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';
import img from '/public/备案图标.png'

const Footer: React.FC = () => {
  const defaultMessage = '小汪出品';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      copyright={`${currentYear} ${defaultMessage}`}
      style={{
        background: 'none',
      }}
      links={[
        {
          key: 'MyApi',
          title: 'MyApi',
          href: 'http://wlsite.icu',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined title={'myGithub'} />,
          href: 'https://github.com/WL-nice',
          blankTarget: true,
        },
        {
          key: '工信部',
          title: '皖ICP备2024047661号',
          href: 'https://beian.miit.gov.cn/',
          blankTarget: true,
        },
        {
          key: '皖公网安备34020202000700',
          title: <img
            src={img}
            alt="皖公网安备34020202000700"
            style={{
              width: '22px', // 根据需要调整图片尺寸
              height: '22px',
            }}
          />,
          href: 'https://beian.mps.gov.cn/#/query/webSearch?code=34020202000700',
          blankTarget: true,
        },
        {
          key: '皖公网安备34020202000700',
          title: '皖公网安备34020202000700',
          href: 'https://beian.mps.gov.cn/#/query/webSearch?code=34020202000700',
          blankTarget: true,
        },
      ]}
    >

    </DefaultFooter>

  );
};

export default Footer;

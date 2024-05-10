import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

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
          href: 'http://127.0.0.1',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined title={'myGithub'} />,
          href: 'https://github.com/WL-nice',
          blankTarget: true,
        },
        {
          key: ' MyApi',
          title: 'MyApi',
          href: 'http://127.0.0.1',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;

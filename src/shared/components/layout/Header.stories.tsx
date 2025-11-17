import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';

const meta = {
  title: 'Design System/Layout/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'FAN:STAGE 디자인 시스템의 헤더 컴포넌트입니다. 네비게이션, 로고, 액션 버튼을 포함합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    activeNav: {
      control: 'select',
      options: [null, 'inbox', 'discover'],
      description: '활성 네비게이션 항목',
    },
    showCreateButton: {
      control: 'boolean',
      description: '편지 만들기 버튼 표시 여부',
    },
    showProfile: {
      control: 'boolean',
      description: '프로필 아바타 표시 여부',
    },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Landing: Story = {
  args: {
    activeNav: null,
    showCreateButton: false,
    showProfile: false,
  },
};

export const WithInboxActive: Story = {
  args: {
    activeNav: 'inbox',
    showCreateButton: true,
    showProfile: true,
  },
};

export const WithDiscoverActive: Story = {
  args: {
    activeNav: 'discover',
    showCreateButton: true,
    showProfile: true,
  },
};

export const WithCreateButton: Story = {
  args: {
    showCreateButton: true,
    showProfile: false,
  },
};

export const WithProfile: Story = {
  args: {
    showCreateButton: true,
    showProfile: true,
  },
};


import type { Meta, StoryObj } from '@storybook/react';
import { ProfileAvatar } from './ProfileAvatar';

const meta = {
  title: 'Design System/UI/ProfileAvatar',
  component: ProfileAvatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'FAN:STAGE 디자인 시스템의 프로필 아바타 컴포넌트입니다. 노란색 배경에 이니셜을 표시합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    initials: {
      control: 'text',
      description: '표시할 이니셜',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '아바타 크기',
    },
  },
} satisfies Meta<typeof ProfileAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: {
    initials: 'AB',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    initials: 'AB',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    initials: 'AB',
    size: 'lg',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ProfileAvatar initials="AB" size="sm" />
      <ProfileAvatar initials="CD" size="md" />
      <ProfileAvatar initials="EF" size="lg" />
    </div>
  ),
};

export const Examples: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ProfileAvatar initials="김" />
      <ProfileAvatar initials="이" />
      <ProfileAvatar initials="박" />
      <ProfileAvatar initials="ME" />
    </div>
  ),
};


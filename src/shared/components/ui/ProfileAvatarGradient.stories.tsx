import type { Meta, StoryObj } from '@storybook/react';
import { ProfileAvatarGradient } from './ProfileAvatarGradient';

const meta = {
  title: 'Design System/UI/ProfileAvatarGradient',
  component: ProfileAvatarGradient,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'FAN:STAGE 디자인 시스템의 그라데이션 프로필 아바타 컴포넌트입니다. 노란색에서 시안색으로 그라데이션 배경에 이니셜을 표시합니다.',
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
} satisfies Meta<typeof ProfileAvatarGradient>;

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
      <ProfileAvatarGradient initials="AB" size="sm" />
      <ProfileAvatarGradient initials="CD" size="md" />
      <ProfileAvatarGradient initials="EF" size="lg" />
    </div>
  ),
};

export const Examples: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ProfileAvatarGradient initials="김" />
      <ProfileAvatarGradient initials="이" />
      <ProfileAvatarGradient initials="박" />
      <ProfileAvatarGradient initials="ME" />
    </div>
  ),
};


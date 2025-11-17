import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';

const meta = {
  title: 'Design System/UI/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'FAN:STAGE 디자인 시스템의 빈 상태 컴포넌트입니다. 데이터가 없을 때 사용자에게 안내 메시지를 표시합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'select',
      options: ['music', 'letter'],
      description: '표시할 아이콘 타입',
    },
    message: {
      control: 'text',
      description: '표시할 메시지',
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MusicIcon: Story = {
  args: {
    icon: 'music',
    message: '곡이 없습니다',
  },
};

export const LetterIcon: Story = {
  args: {
    icon: 'letter',
    message: '받은 편지가 없습니다',
  },
};

export const CustomMessage: Story = {
  args: {
    icon: 'music',
    message: '플레이리스트가 비어있습니다',
  },
};


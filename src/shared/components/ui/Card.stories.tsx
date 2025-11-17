import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta = {
  title: 'Design System/UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'FAN:STAGE 디자인 시스템의 카드 컴포넌트입니다. 콘텐츠를 담는 컨테이너로 사용됩니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: {
      action: 'clicked',
      description: '카드 클릭 시 실행되는 함수',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '카드 내용',
  },
};

export const WithContent: Story = {
  args: {
    children: (
      <div>
        <h3 className="text-lg font-semibold mb-2">카드 제목</h3>
        <p className="text-gray-600">카드 내용입니다.</p>
      </div>
    ),
  },
};

export const Clickable: Story = {
  args: {
    onClick: () => alert('카드가 클릭되었습니다!'),
    children: '클릭 가능한 카드',
  },
};


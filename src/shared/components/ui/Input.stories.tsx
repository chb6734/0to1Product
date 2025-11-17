import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta = {
  title: 'Design System/UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'FAN:STAGE 디자인 시스템의 입력 필드 컴포넌트입니다. 라벨과 에러 메시지를 지원합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: '입력 필드 라벨',
    },
    error: {
      control: 'text',
      description: '에러 메시지',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number'],
      description: '입력 필드 타입',
    },
    placeholder: {
      control: 'text',
      description: '플레이스홀더 텍스트',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 여부',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: '입력하세요',
  },
};

export const WithLabel: Story = {
  args: {
    label: '이메일',
    placeholder: 'example@email.com',
    type: 'email',
  },
};

export const WithError: Story = {
  args: {
    label: '비밀번호',
    type: 'password',
    error: '비밀번호는 8자 이상이어야 합니다.',
  },
};

export const Disabled: Story = {
  args: {
    label: '비활성화된 입력',
    placeholder: '입력할 수 없습니다',
    disabled: true,
  },
};


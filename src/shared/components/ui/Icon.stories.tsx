import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';

const meta = {
  title: 'Design System/UI/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'FAN:STAGE 디자인 시스템의 아이콘 컴포넌트입니다. 다양한 아이콘을 제공합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: ['music', 'play', 'heart', 'search', 'plus', 'arrow-back', 'link', 'qr-code', 'copy', 'check'],
      description: '아이콘 이름',
    },
    size: {
      control: 'number',
      description: '아이콘 크기 (픽셀)',
    },
    color: {
      control: 'color',
      description: '아이콘 색상',
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Music: Story = {
  args: {
    name: 'music',
    size: 24,
  },
};

export const Play: Story = {
  args: {
    name: 'play',
    size: 24,
  },
};

export const Heart: Story = {
  args: {
    name: 'heart',
    size: 24,
  },
};

export const Search: Story = {
  args: {
    name: 'search',
    size: 24,
  },
};

export const Plus: Story = {
  args: {
    name: 'plus',
    size: 24,
  },
};

export const ArrowBack: Story = {
  args: {
    name: 'arrow-back',
    size: 24,
  },
};

export const Link: Story = {
  args: {
    name: 'link',
    size: 24,
  },
};

export const QrCode: Story = {
  args: {
    name: 'qr-code',
    size: 24,
  },
};

export const Copy: Story = {
  args: {
    name: 'copy',
    size: 24,
  },
};

export const Check: Story = {
  args: {
    name: 'check',
    size: 24,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Icon name="music" size={16} />
      <Icon name="music" size={24} />
      <Icon name="music" size={32} />
      <Icon name="music" size={48} />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Icon name="heart" size={24} color="#FFE11D" />
      <Icon name="heart" size={24} color="#2ADFFF" />
      <Icon name="heart" size={24} color="#FF0000" />
      <Icon name="heart" size={24} color="#00FF00" />
    </div>
  ),
};


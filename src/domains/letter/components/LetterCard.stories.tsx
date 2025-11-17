import type { Meta, StoryObj } from '@storybook/react';
import { LetterCard } from './LetterCard';

const meta = {
  title: 'Design System/Domain/LetterCard',
  component: LetterCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'FAN:STAGE 디자인 시스템의 편지 카드 컴포넌트입니다. 받은 편지, 보낸 편지, 둘러보기에서 공통으로 사용됩니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    sender: {
      control: 'text',
      description: '보낸 사람 이름',
    },
    recipient: {
      control: 'text',
      description: '받는 사람 이름',
    },
    senderInitials: {
      control: 'text',
      description: '보낸 사람 이니셜',
    },
    recipientInitials: {
      control: 'text',
      description: '받는 사람 이니셜',
    },
    title: {
      control: 'text',
      description: '편지 제목',
    },
    message: {
      control: 'text',
      description: '편지 메시지',
    },
    trackCount: {
      control: 'number',
      description: '곡 개수',
    },
    playCount: {
      control: 'number',
      description: '재생 횟수',
    },
    likeCount: {
      control: 'number',
      description: '좋아요 개수',
    },
    date: {
      control: 'text',
      description: '날짜',
    },
    onClick: {
      action: 'clicked',
      description: '카드 클릭 시 실행되는 함수',
    },
  },
} satisfies Meta<typeof LetterCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReceivedLetter: Story = {
  args: {
    sender: '김서연',
    senderInitials: '김',
    message: '안녕하세요! 이 편지를 받아주셔서 감사합니다.',
    trackCount: 5,
    playCount: 12,
    likeCount: 3,
    date: '2024-01-15',
  },
};

export const SentLetter: Story = {
  args: {
    recipient: '이민수',
    recipientInitials: '이',
    message: '좋은 하루 되세요!',
    trackCount: 3,
    playCount: 8,
    likeCount: 2,
    date: '2024-01-14',
  },
};

export const DiscoverLetter: Story = {
  args: {
    sender: '박지영',
    senderInitials: '박',
    title: '겨울 감성 플레이리스트',
    trackCount: 10,
    playCount: 45,
    likeCount: 12,
    date: '3일 전',
  },
};

export const Clickable: Story = {
  args: {
    sender: '김서연',
    senderInitials: '김',
    message: '클릭 가능한 편지 카드입니다.',
    trackCount: 5,
    playCount: 12,
    likeCount: 3,
    date: '2024-01-15',
    onClick: () => alert('편지 카드가 클릭되었습니다!'),
  },
};

export const WithLongMessage: Story = {
  args: {
    sender: '김서연',
    senderInitials: '김',
    message: '이 편지는 매우 긴 메시지를 포함하고 있습니다. 여러 줄에 걸쳐 표시되며, 사용자가 전체 내용을 읽을 수 있도록 합니다.',
    trackCount: 5,
    playCount: 12,
    likeCount: 3,
    date: '2024-01-15',
  },
};


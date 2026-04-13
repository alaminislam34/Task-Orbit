import { ChatAccountType } from "@/types/chat.types";

const ALLOWED_CHAT_PAIRS: Record<ChatAccountType, ChatAccountType[]> = {
  SELLER: ["CLIENT"],
  CLIENT: ["SELLER"],
  JOB_SEEKER: ["RECRUITER"],
  RECRUITER: ["JOB_SEEKER"],
};

export const canChatPair = (
  currentAccountType?: ChatAccountType,
  participantAccountType?: ChatAccountType,
) => {
  if (!currentAccountType || !participantAccountType) {
    return false;
  }

  return ALLOWED_CHAT_PAIRS[currentAccountType].includes(participantAccountType);
};

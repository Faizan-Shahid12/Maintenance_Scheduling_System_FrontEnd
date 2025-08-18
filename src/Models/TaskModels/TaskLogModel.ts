import type Attachment from "./AttachmentModel";

export interface TaskLog {
  logId: number;
  note: string;
  createdBy: string;
  createdAt: string;
  attachments: Attachment[];
}
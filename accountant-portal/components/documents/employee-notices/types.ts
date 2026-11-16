export interface NoticeRecipient {
  name: string;
  email: string;
  avatar: string;
}

export interface EmployeeNotice {
  id: string;
  title: string;
  recipient: NoticeRecipient;
  dateSent: string;
  status: "Read" | "Unread";
}

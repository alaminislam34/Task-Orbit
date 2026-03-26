export interface Career {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Part-time" | "Remote" | "Freelance";
  level: "Entry" | "Mid" | "Expert";
  salary: string;
  category: string;
  tags: string[];
  description: string;
  postedAt: string;
}

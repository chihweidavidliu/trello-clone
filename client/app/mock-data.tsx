export interface User {
  id: string;
  email: string;
  fullname: string;
}

export interface Ticket {
  id: string;
  title: string;
  assignedTo?: User;
  index: number;
  columnId: string;
}

const users: Record<string, User> = {
  david: {
    id: "test-user",
    email: "david@sourceful.com",
    fullname: "David Liu",
  },
  karlson: {
    id: "fbwrhwhe",
    email: "karlson@sourceful.com",
    fullname: "Karlson Lee",
  },
};

const backlogTickets: Ticket[] = [
  {
    id: "1",
    title: "Fix Hero image alignment",
    index: 0,
    columnId: "backlog",
    assignedTo: users.karlson,
  },
  {
    id: "2",
    title: "Add E2E test for ProductCard List",
    index: 1,
    columnId: "backlog",
    assignedTo: users.david,
  },
  {
    id: "3",
    title: "Boff",
    index: 2,
    columnId: "backlog",
    assignedTo: users.karlson,
  },
];

export interface Column {
  id: string;
  title: string;
  tickets: Ticket[];
}

export const backlogColumn: Column = {
  id: "backlog",
  title: "Backlog",
  tickets: backlogTickets,
};

export const prioritisedTickets: Ticket[] = [
  {
    id: "4",
    title: "Prioritised One",
    index: 0,
    columnId: "prioritised-for-sprint",
    assignedTo: users.karlson,
  },
  {
    id: "5",
    title: "Prioritised Two",
    index: 1,
    columnId: "prioritised-for-sprint",
    assignedTo: users.david,
  },
  {
    id: "6",
    title: "Prioritised Three",
    index: 2,
    columnId: "prioritised-for-sprint",
    assignedTo: users.karlson,
  },
  {
    id: "7",
    title: "Prioritised Four",
    index: 3,
    columnId: "prioritised-for-sprint",
  },
];

export const prioritisedForSprintColumn: Column = {
  id: "prioritised-for-sprint",
  title: "Prioritised For Sprint",
  tickets: prioritisedTickets,
};

export const inProgressColumn: Column = {
  id: "in-progress",
  title: "In Progress",
  tickets: [],
};

export const mockColumns = [
  backlogColumn,
  prioritisedForSprintColumn,
  inProgressColumn,
];

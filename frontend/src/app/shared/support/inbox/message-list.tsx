/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { useAtom, useAtomValue } from 'jotai';
import { atomWithReset, atomWithStorage } from 'jotai/utils';
import { useState, useEffect, useRef } from 'react';
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';
import { PiCaretDownBold, PiChats, PiPaperclipLight } from 'react-icons/pi';
import { useRouter } from 'next/navigation';
import { Select, Title, Badge, Checkbox, ActionIcon, Avatar } from 'rizzui';
import cn from '@/utils/class-names';
import { useHover } from '@/hooks/use-hover';
import { useMedia } from '@/hooks/use-media';
import { getRelativeTime } from '@/utils/get-relative-time';
import rangeMap from '@/utils/range-map';
import { routes } from '@/config/routes';
import {
  messages,
  MessageType,
  supportStatuses,
  SupportStatusType,
  supportTypes,
} from '@/data/support-inbox';
import { LineGroup, Skeleton } from '@/components/ui/skeleton';
import SimpleBar from '@/components/ui/simplebar';
import {
  adminSeeAgents,
  loadingTickets,
  selectedTicket,
  tickets,
  ticketsSorting,
  ticketsToView,
  userToShowMessages,
} from '@/store/atoms';
import axios from 'axios';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';

interface TicketItemProps {
  ticket: any;
  className?: string;
}

export const messageIdAtom = atomWithStorage('messageId', '');
export const dataAtom = atomWithReset<MessageType[]>(messages);

export function MessageItem({ className, ticket }: TicketItemProps) {
  const hoverRef = useRef(null);
  const router = useRouter();
  const isHover = useHover(hoverRef);
  const [data, setData] = useAtom(dataAtom);
  const [ticketsToShow, setTicketToShow] = useAtom(selectedTicket);
  const isMobile = useMedia('(max-width: 1023px)', false);

  const [messageId, setMessageId] = useAtom(messageIdAtom);

  const isActive = messageId === ticket.id;

  const handleItemChange = (itemId: string) => {
    const updatedItems = data.map((item) =>
      item.id === itemId ? { ...item, selected: !item.selected } : item
    );
    setData(updatedItems);
  };

  const url = routes.support.messageDetails(messageId);

  useEffect(() => {
    setMessageId(data[0].id);
  }, [data]);

  function handleChange() {
    setMessageId(ticket.id);
    setTicketToShow(ticket);
    if (isMobile) {
      router.push(url);
    }
  }

  return (
    <div
      ref={hoverRef}
      onClick={handleChange}
      className={cn(
        className,
        'grid cursor-pointer grid-cols-[24px_1fr] items-start gap-3 border-t border-muted p-5',
        isActive && 'border-t-2 border-t-primary dark:bg-gray-100/70'
      )}
    >
      <ActionIcon
        variant="flat"
        size="sm"
        className={cn('h-6 w-6 p-0', isActive && 'bg-primary text-white')}
      >
        <PiChats className="h-3.5 w-3.5" />
      </ActionIcon>
      <div>
        <div className="flex items-center justify-between lg:flex-col lg:items-start 2xl:flex-row 2xl:items-center">
          <Title as="h4" className="flex items-center">
            <span className="text-sm font-semibold dark:text-gray-700">
              {ticket.name}
            </span>
          </Title>
          <span className="text-xs text-gray-500">
            {dayjs(
              ticket.messages[ticket.messages?.length - 1]?.timestamp
            ).format('DD-MM-YYYY |  h : m A')}
          </span>
        </div>
        <p className="mt-1 line-clamp-3 text-sm text-gray-500">
          {ticket.messages[ticket.messages?.length - 1].message}
        </p>
      </div>
    </div>
  );
}

export function UserItem({ className, userData }: any) {
  const hoverRef = useRef(null);
  const router = useRouter();
  const isHover = useHover(hoverRef);
  const [data, setData] = useAtom(dataAtom);
  const [selectedUser, setSelectedUser] = useAtom(userToShowMessages);
  const isMobile = useMedia('(max-width: 1023px)', false);
  const session : any = useSession();
  const [messageId, setMessageId] = useAtom(messageIdAtom);

  const isActive = messageId === userData.id;



  const url = routes.support.messageDetails(messageId);

  useEffect(() => {
    setMessageId(data[0].id);
  }, [data]);

  function handleChange() {
    setMessageId(userData.id);
    setSelectedUser(userData);
    if (isMobile) {
      router.push(url);
    }
  }

  return (
    <div
      ref={hoverRef}
      onClick={handleChange}
      className={cn(
        className,
        'grid cursor-pointer grid-cols-[24px_1fr] items-start gap-3 border-t border-muted p-5',
        isActive && 'border-t-2 border-t-primary dark:bg-gray-100/70'
      )}
    >
      <ActionIcon
        variant="flat"
        size="sm"
        className={cn('h-6 w-6 p-0', isActive && 'bg-primary text-white')}
      >
        <PiChats className="h-3.5 w-3.5" />
      </ActionIcon>
      <div>
        <div className="flex items-center justify-between lg:flex-col lg:items-start 2xl:flex-row 2xl:items-center">
          <Title as="h4" className="flex items-center">
            <span className="text-sm font-semibold dark:text-gray-700">
            <Avatar
            src={userData?.avator || userData.image}
            name={userData?.firstname ? (userData?.firstname + '' + userData?.lastname) : session?.data?.userData?.name}
            className={cn('!h-9 w-9 sm:!h-10 sm:!w-10')}
          /> {userData.firstname + ' ' + userData.lastname}
              <p>{userData.email}</p>
            </span>
          </Title>
        </div>
      </div>
    </div>
  );
}

const sortOptions = {
  value: 'asc',
  desc: 'desc',
} as const;

const options = [
  {
    value: 'Oldest',
    label: 'Oldest',
  },
  {
    value: 'Newest',
    label: 'Newest',
  },
];

interface InboxListProps {
  className?: string;
}
// type SortByType = keyof typeof sortOptions;

export async function updateTickets() {
  try {
    const [isLoading, setIsLoading] = useAtom(loadingTickets);
    const [allTickets, setTickets] = useAtom(tickets);
    const [sortBy, setSortBy] = useAtom(ticketsSorting);
    const [ticketsToShow, setTicketsToShow]: any = useAtom(ticketsToView);
    const session: any = useSession();
    setIsLoading(true);
    if (session?.data?.userData?.userrole === 'admin') {
      await axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-all-tickets`)
        .then((res) => {
          setTickets(res.data.data);
          const activeTicktes = res.data.data.filter(
            (item: any) => !item.closed
          );

          let orderedTickets;
          if (sortBy === 'Oldest') {
            orderedTickets = activeTicktes.sort((a: any, b: any) =>
              dayjs(a.messages[a.messages?.length - 1]?.timestamp).diff(
                dayjs(b.messages[b.messages?.length - 1]?.timestamp)
              )
            );
          } else {
            orderedTickets = activeTicktes.sort((a: any, b: any) =>
              dayjs(b.messages[b.messages?.length - 1]?.timestamp).diff(
                dayjs(a.messages[a.messages?.length - 1]?.timestamp)
              )
            );
          }
          setTicketsToShow(orderedTickets);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      await axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/get-user-tickets/${session?.data?.userData?.email}`
        )
        .then((res) => {
          setTickets(res.data.data);
          const activeTicktes = res.data.data.filter(
            (item: any) => !item.closed
          );
          let orderedTickets;
          if (sortBy === 'Oldest') {
            orderedTickets = activeTicktes.sort((a: any, b: any) =>
              dayjs(a.messages[a.messages?.length - 1]?.timestamp).diff(
                dayjs(b.messages[b.messages?.length - 1]?.timestamp)
              )
            );
          } else {
            orderedTickets = activeTicktes.sort((a: any, b: any) =>
              dayjs(b.messages[b.messages?.length - 1]?.timestamp).diff(
                dayjs(a.messages[a.messages?.length - 1]?.timestamp)
              )
            );
          }
          setTicketsToShow(orderedTickets);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    return <></>;
  } catch (error) {
    console.log(error);
  }
}

export default function MessageList({ className }: InboxListProps) {
  const [allTickets, setTickets] = useAtom(tickets);
  const [ticketsToShow, setTicketsToShow]: any = useAtom(ticketsToView);
  // const resetData = useResetAtom(dataAtom);
  const [isLoading, setIsLoading] = useAtom(loadingTickets);
  const [sortBy, setSortBy] = useAtom(ticketsSorting);
  const [status, setStatus] = useState<SupportStatusType>(supportStatuses.Open);
  const [selectAll, setSelectAll] = useState(false);
  const session: any = useSession();
  const [allUsers, setAllUsers] = useState([]);
  const adminForAgents = useAtomValue(adminSeeAgents);
  console.log(session);

  const getTickets = async () => {
    if (session?.data?.userData?.userrole === 'admin') {
      await axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-all-tickets`)
        .then((res) => {
          setTickets(res.data.data);
          const activeTicktes = res.data.data.filter(
            (item: any) => !item.closed
          );
          let orderedTickets;
          if (sortBy === 'Oldest') {
            orderedTickets = activeTicktes.sort((a: any, b: any) =>
              dayjs(a.messages[a.messages?.length - 1]?.timestamp).diff(
                dayjs(b.messages[b.messages?.length - 1]?.timestamp)
              )
            );
          } else {
            orderedTickets = activeTicktes.sort((a: any, b: any) =>
              dayjs(b.messages[b.messages?.length - 1]?.timestamp).diff(
                dayjs(a.messages[a.messages?.length - 1]?.timestamp)
              )
            );
          }
          setTicketsToShow(orderedTickets);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (session?.data?.userData?.userrole === 'buyer') {
      await axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/get-user-tickets/${session?.data?.userData?.email}`
        )
        .then((res) => {
          setTickets(res.data.data);
          const activeTicktes = res.data.data.filter(
            (item: any) => !item.closed
          );
          let orderedTickets;
          if (sortBy === 'Oldest') {
            orderedTickets = activeTicktes.sort((a: any, b: any) =>
              dayjs(a.messages[a.messages?.length - 1]?.timestamp).diff(
                dayjs(b.messages[b.messages?.length - 1]?.timestamp)
              )
            );
          } else {
            orderedTickets = activeTicktes.sort((a: any, b: any) =>
              dayjs(b.messages[b.messages?.length - 1]?.timestamp).diff(
                dayjs(a.messages[a.messages?.length - 1]?.timestamp)
              )
            );
          }
          setTicketsToShow(orderedTickets);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  const getUsersList = async () => {
    if (session?.data?.userData?.userrole === 'agent') {
      await axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-all-admins`)
        .then((res) => {
          setAllUsers(res.data.admins);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if(session?.data?.userData?.userrole === 'admin' && adminForAgents){
      await axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-admin-messages-agents/${session?.data?.userData?.email}`)
        .then((res) => {
          setAllUsers(res.data.data);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    updateTickets();
    getTickets();
    getUsersList();
  }, []);
  useEffect(()=>{
    if(adminForAgents){
      getUsersList();
    }
  }, [adminForAgents])
  const handleOpen = () => {
    const updatedItems = allTickets?.filter(
      (item: any) => item.closed === false
    );
    let orderedTickets;
    if (sortBy === 'Oldest') {
      orderedTickets = updatedItems.sort((a: any, b: any) =>
        dayjs(a.messages[a.messages?.length - 1]?.timestamp).diff(
          dayjs(b.messages[b.messages?.length - 1]?.timestamp)
        )
      );
    } else {
      orderedTickets = updatedItems.sort((a: any, b: any) =>
        dayjs(b.messages[b.messages?.length - 1]?.timestamp).diff(
          dayjs(a.messages[a.messages?.length - 1]?.timestamp)
        )
      );
    }
    setTicketsToShow(orderedTickets);
    setStatus(supportStatuses.Open);
  };

  const handleClosed = () => {
    const updatedItems = allTickets?.filter(
      (item: any) => item.closed === true
    );
    let orderedTickets;
    if (sortBy === 'Oldest') {
      orderedTickets = updatedItems.sort((a: any, b: any) =>
        dayjs(a.messages[a.messages?.length - 1]?.timestamp).diff(
          dayjs(b.messages[b.messages?.length - 1]?.timestamp)
        )
      );
    } else {
      orderedTickets = updatedItems.sort((a: any, b: any) =>
        dayjs(b.messages[b.messages?.length - 1]?.timestamp).diff(
          dayjs(a.messages[a.messages?.length - 1]?.timestamp)
        )
      );
    }
    setTicketsToShow(orderedTickets);
    setStatus(supportStatuses.Closed);
  };

  function handleOnChange(order: any) {
    setSortBy(order);
    let orderedTickets;
    if (order === 'Oldest') {
      orderedTickets = ticketsToShow.sort((a: any, b: any) =>
        dayjs(a.messages[a.messages?.length - 1]?.timestamp).diff(
          dayjs(b.messages[b.messages?.length - 1]?.timestamp)
        )
      );
    } else {
      orderedTickets = ticketsToShow.sort((a: any, b: any) =>
        dayjs(b.messages[b.messages?.length - 1]?.timestamp).diff(
          dayjs(a.messages[a.messages?.length - 1]?.timestamp)
        )
      );
    }
    console.log(orderedTickets);
    setTicketsToShow(orderedTickets);
  }

  return (
    <>
      <div className={cn(className, 'sticky')}>
        {session?.data?.userData?.userrole != 'agent' && (
        <div className="mb-7 flex items-center justify-between">
          <div className="overflow-hidden rounded border border-muted">
            <button
              className={cn(
                'px-2.5 py-1.5 text-sm font-medium text-gray-500 transition duration-300',
                status === supportStatuses.Open && 'bg-gray-100 text-gray-900'
              )}
              onClick={handleOpen}
            >
              Open
            </button>
            <button
              className={cn(
                'px-2.5 py-1.5 text-sm font-medium text-gray-500 transition duration-300',
                status === supportStatuses.Closed && 'bg-gray-100 text-gray-900'
              )}
              onClick={handleClosed}
            >
              Closed
            </button>
          </div>

          <Select
            size="sm"
            variant="text"
            value={sortBy}
            options={options}
            getOptionValue={(option) => option.value}
            onChange={(option: any) => handleOnChange(option)}
            displayValue={(selected) =>
              options.find((o) => o.value === selected)?.label
            }
            suffix={<PiCaretDownBold className="w- ml-2 h-3.5 w-3.5" />}
            selectClassName="text-sm px-2.5"
            optionClassName="text-sm"
            dropdownClassName="p-2 !w-32 !z-0"
            placement="bottom-end"
            className={'w-auto'}
          />
        </div>
         )}

        <div className="overflow-hidden rounded-lg border border-muted">
          <SimpleBar className="max-h-[calc(100dvh-356px)] md:max-h-[calc(100dvh-311px)] lg:max-h-[calc(100dvh-240px)] xl:max-h-[calc(100dvh-230px)] 2xl:max-h-[calc(100dvh-240px)] 3xl:max-h-[calc(100dvh-270px)]">
            {isLoading ? (
              <div className="grid gap-4">
                {rangeMap(5, (i) => (
                  <MessageLoader key={i} />
                ))}
              </div>
            ) : (
              <>
                {(session?.data?.userData?.userrole === 'agent' || (session?.data?.userData?.userrole === 'admin' && adminForAgents))  ? (
                  <>
                    {allUsers?.map((user: any) => (
                      <>
                        <UserItem userData={user} />
                      </>
                    ))}
                  </>
                ) : (
                  <>
                    {ticketsToShow?.map((ticket: any) => (
                      <>
                        <MessageItem ticket={ticket} />
                      </>
                    ))}
                  </>
                )}
              </>
            )}
          </SimpleBar>
        </div>
      </div>
    </>
  );
}

export function MessageLoader() {
  return (
    <div className="grid gap-3 border-t border-muted p-5">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded" />
        <Skeleton className="h-3 w-32 rounded" />
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="ml-auto h-3 w-16 rounded" />
      </div>
      <LineGroup
        columns={6}
        className="grid-cols-6 gap-1.5"
        skeletonClassName="h-2"
      />
      <LineGroup
        columns={5}
        className="grid-cols-5 gap-1.5"
        skeletonClassName="h-2"
      />
      <LineGroup
        columns={4}
        className="grid-cols-4 gap-1.5"
        skeletonClassName="h-2"
      />
    </div>
  );
}

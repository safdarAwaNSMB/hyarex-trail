'use client';

import { PiPlusBold } from 'react-icons/pi';
import { routes } from '@/config/routes';
import { Button } from 'rizzui';
import PageHeader from '@/app/shared/page-header';
import { TabList } from '@/app/shared/support/inbox/inbox-tabs';
import SupportInbox from '@/app/shared/support/inbox';
import { metaObject } from '@/config/site.config';
import { useModal } from '@/app/shared/modal-views/use-modal';
import CreateSnippetTemplateForm from '@/app/shared/support/create-snippet-template-from';
import CreateTicketTemplateForm from '@/app/shared/support/create-ticket';
import { useSession } from 'next-auth/react';
import { useAtom } from 'jotai';
import { adminSeeAgents } from '@/store/atoms';

const pageHeader = {
  title: 'Support Inbox',
  breadcrumb: [
    {
      href: '/',
      name: 'Home',
    },
    {
      href: routes.support.dashboard,
      name: 'Support',
    },
  ],
};

export default function SupportInboxPage() {
  const { openModal } = useModal();
  const session: any = useSession();
  const [adminToAgents, setadminToAgents] = useAtom(adminSeeAgents);
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        {session?.data?.userData?.userrole !== 'admin' &&
          session?.data?.userData?.userrole !== 'agent' && (
            <Button
              onClick={() => {
                openModal({
                  view: <CreateTicketTemplateForm title={'ticket'} />,
                  customSize: '720px',
                });
              }}
              className="mt-4 w-full @lg:mt-0 @lg:w-auto"
            >
              <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
              Create Ticket
            </Button>
          )}
        {session?.data?.userData?.userrole === 'admin' && (
          <Button
            onClick={() => {
              setadminToAgents(!adminToAgents);
            }}
            className="mt-4 w-full @lg:mt-0 @lg:w-auto"
          > {adminToAgents ? "Buyers Support" : "Agents Support"}
          </Button>
        )}
      </PageHeader>

      {/* <TabList /> */}

      <SupportInbox />
    </>
  );
}

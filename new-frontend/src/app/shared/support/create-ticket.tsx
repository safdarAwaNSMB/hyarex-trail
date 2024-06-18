'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { PiXBold } from 'react-icons/pi';
import { Controller, SubmitHandler } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import {
    Button,
    ActionIcon,
    Select,
    Title,
    Text,
    Input,
    Loader,
    cn,
    Textarea,
} from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import dynamic from 'next/dynamic';
import {
    folders,
    SnippetType,
    snippetsAndTemplates,
} from '@/data/snippets-and-templates';
import { avatarIds } from '@/utils/get-avatar';
import { getRandomArrayElement } from '@/utils/get-random-array-element';
import {
    CreateSnippetInput,
    createSnippetSchema,
} from '@/utils/validators/create-snippet.schema';
import {
    CreateTemplateInput,
    createTemplateSchema,
} from '@/utils/validators/create-template.schema';
import { CreateTicketInput, createTicketSchema } from '@/utils/validators/create-ticket-schema';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { tickets } from '@/store/atoms';
import { useAtom } from 'jotai';
import { updateTickets } from './inbox/message-list';

const QuillEditor = dynamic(() => import('@/components/ui/quill-editor'), {
    ssr: false,
    loading: () => (
        <div className="grid h-[111px] place-content-center">
            <Loader variant="spinner" />
        </div>
    ),
});

interface EditProfileFormProps {
    data?: SnippetType;
    title: TitleType;
    className?: string;
    type?: 'Create' | 'Edit';
}

const initialValues = {
    name: '',
    folder: '',
    snippet: '',
};

type TitleType = 'ticket';

type FormInputType = CreateTicketInput;

function generateUID() {
    const timestamp = Date.now().toString(36); // Convert current timestamp to base36
    const randomPart = Math.random().toString(36).substring(2, 7); // Generate a random string
    return timestamp + randomPart;
}

export default function CreateTicketTemplateForm({
    data,
    type = 'Create',
    title,
    className,
}: EditProfileFormProps) {
    const { closeModal } = useModal();
    const [reset, setReset] = useState({});
    const [ticketsToShow, setTickets] = useAtom(tickets);
    const [isLoading, setLoading] = useState(false);
    const session: any = useSession();

    const onSubmit: SubmitHandler<FormInputType> = async (data) => {
        // set timeout ony required to display loading state of the create product button
        setLoading(true);
        console.log(data);
        console.log(session);
        if (data.ticketType === 'email') {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/send-ticket-mail`, { ...data, senderMail: session?.data?.user?.email }).then(() => {
                toast.success('Your Mail sended successfully!')
            }).catch((err) => {
                console.log(err);
            }).finally(() => {
                setLoading(false)
                closeModal();
            })
        } else {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/create-ticket`, { ...data, buyer: session?.data?.userData }).then(async () => {
                await updateTickets();
                setLoading(false)
                closeModal();
            }).catch((err) => {
                console.log(err);
            })
        }

        // setTimeout(() => {
        //     setLoading(false);
        //     console.log(title, data);
        //     setReset(initialValues);
        //     toast.success(
        //         <Text as="b" fontWeight="medium">
        //             `${title} created successfully`
        //         </Text>
        //     );
        //     snippetsAndTemplates.unshift({
        //         id: generateUID(),
        //         name: data.name,
        //         avatar: `https://isomorphic-furyroad.s3.amazonaws.com/public/avatars-blur/avatar-${getRandomArrayElement(
        //             avatarIds
        //         )}.png`,
        //         folder: data?.folder,
        //         createdBy: getRandomArrayElement([
        //             'Gilberto Balistreri II',
        //             'Handcrafted Steel Computer',
        //             'Oriental Plastic Shoes',
        //             'Handcrafted Granite Gloves',
        //         ]) as string,
        //         createdAt: new Date(),
        //         updatedAt: new Date(),
        //     });
        //     closeModal();
        // }, 600);
    };

    return (
        <div className={cn('max-w-full rounded-md p-6', className)}>
            <div className="flex items-center justify-between">
                <Title as="h4" className="font-semibold">
                    {type} Ticket
                </Title>
                <ActionIcon variant="text" onClick={() => closeModal()}>
                    <PiXBold className="h-5 w-5" />
                </ActionIcon>
            </div>

            <Form<FormInputType>
                onSubmit={onSubmit}
                resetValues={reset}
                validationSchema={createTicketSchema}
                useFormProps={{
                    defaultValues: {
                        name: data?.name,
                        ticketType: data?.folder,
                    },
                }}
                className="mt-6 grid gap-6"
            >
                {({ register, control, formState: { errors } }) => {
                    return (
                        <>
                            <Input
                                label={`${title} Name`}
                                placeholder={`Enter your ${title} name...`}
                                labelClassName="font-medium text-gray-900 dark:text-white capitalize"
                                {...register('name')}
                                error={errors.name?.message}
                            />
                            <Controller
                                control={control}
                                name="ticketType"
                                render={({ field: { value, onChange } }) => (
                                    <Select
                                        label="Type"
                                        inPortal={false}
                                        labelClassName="font-medium text-gray-900 dark:text-white"
                                        dropdownClassName="p-2 gap-1 grid !z-[10]"
                                        value={value}
                                        onChange={onChange}
                                        options={folders}
                                        getOptionValue={(option) => option.value}
                                        displayValue={(selected: string) =>
                                            folders?.find((f) => f.value === selected)?.label ?? ''
                                        }
                                        error={errors?.ticketType?.message as string}
                                    />
                                )}
                            />
                            <Textarea
                                label={`Ticket Details`}
                                error={errors.content?.message}
                                placeholder="Enter your message"
                                {...register('content')}
                            />
                            <div className="col-span-full mt-2 flex items-center justify-end">
                                <Button
                                    type="submit"
                                    className="capitalize"
                                    isLoading={isLoading}
                                >
                                    {type} {title}
                                </Button>
                            </div>
                        </>
                    );
                }}
            </Form>
        </div>
    );
}

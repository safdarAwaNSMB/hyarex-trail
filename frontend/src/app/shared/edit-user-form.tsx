'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import {
  PiArrowLineDownBold,
  PiFile,
  PiFileCsv,
  PiFileDoc,
  PiFilePdf,
  PiFileXls,
  PiFileZip,
  PiTrashBold,
  PiXBold,
} from 'react-icons/pi';
import { ActionIcon, Title, Text, Button, Input, Password, Select, RadioGroup, Radio } from 'rizzui';
import cn from '@/utils/class-names';
import Upload from '@/components/ui/upload';
import { useModal } from '@/app/shared/modal-views/use-modal';
import SimpleBar from '@/components/ui/simplebar';
import { toast } from 'react-hot-toast';
import { Form } from '@/components/ui/form';
import { SignUpSchema, signUpSchema } from '@/utils/validators/signup.schema';
import { SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { useAtom } from 'jotai';
import { userToEdit } from '@/store/atoms';

type AcceptedFiles = 'img' | 'pdf' | 'csv' | 'imgAndPdf' | 'all';

export default function EditUserForm({
  label = 'Upload Files',
  btnLabel = 'Upload',
  fieldLabel,
  multiple = true,
  accept = 'all',
}: {
  label?: string;
  fieldLabel?: string;
  btnLabel?: string;
  multiple?: boolean;
  accept?: AcceptedFiles;
}) {
    const [editUserData, setUserData] = useAtom(userToEdit);
    const [loading, setLoading] = useState(false)
    const [value, setValue] = useState(editUserData?.userrole);
  
  const initialValues = {
    firstname: editUserData?.firstname,
    lastname: editUserData?.lastname,
    email: editUserData?.email,
    password: editUserData?.password,
    confirmpassword: editUserData?.password,
  };
  const { closeModal } = useModal();
  const onSubmit: SubmitHandler<any> = async (data) => {
    console.log(data);
    if(value === ''){
      setLoading(false);
      closeModal();
      toast.error('Please Select user Role');
      return
    }
    if (!loading) {
      console.log('submitted');
      if (data.password === data.confirmpassword) {
        setLoading(true)
          await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/edit-user`, { ...data, userrole: value }).then(() => {
            setLoading(false);
            closeModal();
            toast.success('User Information Updated!')
            window.location.reload()
          }).catch(err => {
            setLoading(false);
            closeModal()
            toast.error(<Text as="b" className="z-20">Server Error</Text>, {
              className: 'z-20', // Add classname for the toast container
            });
          })
        
      } else {
        closeModal()
        toast.error(<Text as="b" className="z-20">Confirm Password not matched!</Text>, {
          className: 'z-20', // Add classname for the toast container
        })
      };
    }
  }

  return (
    <div className="m-auto px-5 pb-8 pt-5 @lg:pt-6 @2xl:px-7">
      <div className="mb-6 flex items-center justify-between">
        <Title as="h3" className="text-lg">
          {label}
        </Title>
        <ActionIcon
          size="sm"
          variant="text"
          onClick={() => closeModal()}
          className="p-0 text-gray-500 hover:!text-gray-900"
        >
          <PiXBold className="h-[18px] w-[18px]" />
        </ActionIcon>
      </div>

      <Form<SignUpSchema>
        validationSchema={signUpSchema}
        // resetValues={reset}
        onSubmit={onSubmit}
        useFormProps={{
          defaultValues: initialValues,
        }}
      >
        {({ register, formState: { errors } }) => (
          <div className="flex flex-col gap-x-4 gap-y-5 md:grid md:grid-cols-2 lg:gap-5">
            <Input
              type="text"
              size="lg"
              label="First Name"
              placeholder="Enter your first name"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('firstname')}
              error={errors.firstname?.message}
            />
            <Input
              type="text"
              size="lg"
              label="Last Name"
              placeholder="Enter your last name"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('lastname')}
              error={errors.lastname?.message}
            />
            <Input
              type="email"
              size="lg"
              label="Email"
              className="col-span-2 [&>label>span]:font-medium"
              inputClassName="text-sm"
              placeholder="Enter your email"
              readOnly
              {...register('email')}
              error={errors.email?.message}
            />

            <Password
              label="Password"
              placeholder="Enter your password"
              size="lg"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('password')}
              error={errors.password?.message}
            />
            <Password
              label="Confirm Password"
              placeholder="Enter confirm password"
              size="lg"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('confirmpassword')}
              error={errors.confirmpassword?.message}
            />
            <RadioGroup value={value} setValue={setValue} className="flex gap-4 w-full justify-between">
              <Radio label="Buyer" value="buyer" />
              <Radio label="Agent" value="agent" />
              <Radio label="Admin" value="admin" />
            </RadioGroup>

            <Button size="lg" type="submit" className="col-span-2 mt-2">
              {loading ? (
                <div className="smallspinner"></div>
              ) : (
                <>
                  <span>Update User</span>{' '}
                  {/* <PiArrowRightBold className="ms-2 mt-0.5 h-5 w-5" /> */}
                </>
              )}
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
}

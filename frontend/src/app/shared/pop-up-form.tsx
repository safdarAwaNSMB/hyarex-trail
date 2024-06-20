'use client';

import React, { useState } from 'react';
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
import axios from 'axios';

type AcceptedFiles = 'img' | 'pdf' | 'csv' | 'imgAndPdf' | 'all';

export default function PopUpForm({
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
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmpassword: '',
  });
  const { closeModal } = useModal();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formValues);

    if (value === '') {
      setLoading(false);
      closeModal();
      toast.error('Please Select user Role');
      return;
    }

    if (!loading) {
      console.log('submitted');
      if (formValues.password === formValues.confirmpassword) {
        setLoading(true);
        const userExist = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user-existence`, formValues).catch(err => {
          setLoading(false);
          console.log(err);
          toast.error('Server Error');
        });

        if (userExist?.status === 200) {
          setLoading(false);
          toast.error(userExist?.data.message);
          return;
        } else if (userExist?.status === 201) {
          await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/create-user`, { ...formValues, userrole: value }).then(() => {
            setLoading(false);
            closeModal();
            toast.success('User Created!');
            window.location.reload();
          }).catch(err => {
            setLoading(false);
            closeModal();
            toast.error(<Text as="b" className="z-20">Server Error</Text>, {
              className: 'z-20',
            });
          });
        }
      } else {
        closeModal();
        toast.error(<Text as="b" className="z-20">Confirm Password not matched!</Text>, {
          className: 'z-20',
        });
      }
    }
  };

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

      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-x-4 gap-y-5 md:grid md:grid-cols-2 lg:gap-5">
          <Input
            type="text"
            size="lg"
            label="First Name"
            placeholder="Enter your first name"
            className="[&>label>span]:font-medium"
            inputClassName="text-sm"
            name="firstname"
            value={formValues.firstname}
            onChange={handleChange}
          />
          <Input
            type="text"
            size="lg"
            label="Last Name"
            placeholder="Enter your last name"
            className="[&>label>span]:font-medium"
            inputClassName="text-sm"
            name="lastname"
            value={formValues.lastname}
            onChange={handleChange}
          />
          <Input
            type="email"
            size="lg"
            label="Email"
            className="col-span-2 [&>label>span]:font-medium"
            inputClassName="text-sm"
            placeholder="Enter your email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
          />
          <Password
            label="Password"
            placeholder="Enter your password"
            size="lg"
            className="[&>label>span]:font-medium"
            inputClassName="text-sm"
            name="password"
            value={formValues.password}
            onChange={handleChange}
          />
          <Password
            label="Confirm Password"
            placeholder="Enter confirm password"
            size="lg"
            className="[&>label>span]:font-medium"
            inputClassName="text-sm"
            name="confirmpassword"
            value={formValues.confirmpassword}
            onChange={handleChange}
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
                <span>Create User</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

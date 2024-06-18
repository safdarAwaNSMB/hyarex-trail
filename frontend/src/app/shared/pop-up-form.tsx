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
  const [loading, setLoading] = useState(false)
  const initialValues = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmpassword: '',
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
        const userExist = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user-existence`, data).catch(err => {
          setLoading(false)
          // closeModal()
          console.log(err);
          
          toast.error('Server Error');
        })
        if (userExist?.status === 200) {
          setLoading(false)
          toast.error(userExist?.data.message);
          return
        } else if (userExist?.status === 201) {
          await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/create-user`, { ...data, userrole: value }).then(() => {
            setLoading(false);
            closeModal();
            toast.success('User Created!')
            window.location.reload()
          }).catch(err => {
            setLoading(false);
            closeModal()
            toast.error(<Text as="b" className="z-20">Server Error</Text>, {
              className: 'z-20', // Add classname for the toast container
            });
          })
        }
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

            <Button size="lg" onClick={() => {
              console.log('clicked');

            }} type="submit" className="col-span-2 mt-2">
              {loading ? (
                <div className="smallspinner"></div>
              ) : (
                <>
                  <span>Create User</span>{' '}
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

// const fileType = {
//   'text/csv': <PiFileCsv className="h-5 w-5" />,
//   'text/plain': <PiFile className="h-5 w-5" />,
//   'application/pdf': <PiFilePdf className="h-5 w-5" />,
//   'application/xml': <PiFileXls className="h-5 w-5" />,
//   'application/zip': <PiFileZip className="h-5 w-5" />,
//   'application/gzip': <PiFileZip className="h-5 w-5" />,
//   'application/msword': <PiFileDoc className="h-5 w-5" />,
// } as { [key: string]: React.ReactElement };

// export const FileInput = ({
//   label,
//   btnLabel = 'Upload',
//   multiple = true,
//   accept = 'img',
//   className,
// }: {
//   className?: string;
//   label?: React.ReactNode;
//   multiple?: boolean;
//   btnLabel?: string;
//   accept?: AcceptedFiles;
// }) => {
//   const { closeModal } = useModal();
//   const [files, setFiles] = useState<Array<File>>([]);
//   const imageRef = useRef<HTMLInputElement>(null);

//   function handleFileDrop(event: React.ChangeEvent<HTMLInputElement>) {
//     const uploadedFiles = (event.target as HTMLInputElement).files;
//     const newFiles = Object.entries(uploadedFiles as object)
//       .map((file) => {
//         if (file[1]) return file[1];
//       })
//       .filter((file) => file !== undefined);
//     setFiles((prevFiles) => [...prevFiles, ...newFiles]);
//   }

//   function handleImageDelete(index: number) {
//     const updatedFiles = files.filter((_, i) => i !== index);
//     setFiles(updatedFiles);
//     (imageRef.current as HTMLInputElement).value = '';
//   }

//   function handleFileUpload() {
//     if (files.length) {
//       console.log('uploaded files:', files);
//       toast.success(<Text as="b">File successfully added</Text>);

//       setTimeout(() => {
//         closeModal();
//       }, 200);
//     } else {
//       toast.error(<Text as="b">Please drop your file</Text>);
//     }
//   }

//   return (
//     <div className={className}>
//       <Upload
//         label={label}
//         ref={imageRef}
//         accept={accept}
//         multiple={multiple}
//         onChange={(event) => handleFileDrop(event)}
//         className="mb-6 min-h-[280px] justify-center border-dashed bg-gray-50 dark:bg-transparent"
//       />

//       {files.length > 1 ? (
//         <Text className="mb-2 text-gray-500">{files.length} files</Text>
//       ) : null}

//       {files.length > 0 && (
//         <SimpleBar className="max-h-[280px]">
//           <div className="grid grid-cols-1 gap-4">
//             {files?.map((file: File, index: number) => (
//               <div
//                 className="flex min-h-[58px] w-full items-center rounded-xl border border-muted px-3 dark:border-gray-300"
//                 key={file.name}
//               >
//                 <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-muted bg-gray-50 object-cover px-2 py-1.5 dark:bg-transparent">
//                   {file.type.includes('image') ? (
//                     <Image
//                       src={URL.createObjectURL(file)}
//                       fill
//                       className=" object-contain"
//                       priority
//                       alt={file.name}
//                       sizes="(max-width: 768px) 100vw"
//                     />
//                   ) : (
//                     <>{fileType[file.type]}</>
//                   )}
//                 </div>
//                 <div className="truncate px-2.5">{file.name}</div>
//                 <ActionIcon
//                   onClick={() => handleImageDelete(index)}
//                   size="sm"
//                   variant="flat"
//                   color="danger"
//                   className="ms-auto flex-shrink-0 p-0 dark:bg-red-dark/20"
//                 >
//                   <PiTrashBold className="w-6" />
//                 </ActionIcon>
//               </div>
//             ))}
//           </div>
//         </SimpleBar>
//       )}
//       <div className="mt-4 flex justify-end gap-3">
//         <Button
//           variant="outline"
//           className={cn(!files.length && 'hidden', 'w-full')}
//           onClick={() => setFiles([])}
//         >
//           Reset
//         </Button>
//         <Button className="w-full" onClick={() => handleFileUpload()}>
//           <PiArrowLineDownBold className="me-1.5 h-[17px] w-[17px]" />
//           {btnLabel}
//         </Button>
//       </div>
//     </div>
//   );
// };

'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { AdvancedRadio, FieldError, RadioGroup } from 'rizzui';
import cn from '@/utils/class-names';

export default function GetSize(sizes: any) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
console.log(sizes);

  return (
    <>
      <Controller
        control={control}
        name="productSize"
        render={({ field: { value, onChange } }) => {
          console.log(value);
          return (
            <RadioGroup
              value={value}
              setValue={onChange}
              className="flex flex-wrap items-center gap-4"
            >
              {sizes?.length > 0 && sizes?.map((attribute: any) => (
                <AdvancedRadio
                  key={attribute.attributeId}
                  value={attribute?.valueTrans}
                  contentClassName={cn(
                    'px-3 py-2 min-w-[unset] min-h-[unset] flex items-center justify-between content-classname',
                    String(attribute.valueTrans) === String(attribute.valueTrans) &&
                    'border-primary ring-primary ring-1'
                  )}
                >
                  {attribute.valueTrans}
                </AdvancedRadio>
              ))}
            </RadioGroup>
          );
        }}
      />
      {errors?.productSize && (
        <FieldError
          className="mt-1"
          error={errors?.productSize?.message as string}
        />
      )}
    </>
  );
}

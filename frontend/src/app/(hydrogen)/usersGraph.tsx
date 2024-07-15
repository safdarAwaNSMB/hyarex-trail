'use client';

import WidgetCard from '@/components/cards/widget-card';
import { CustomTooltip } from '@/components/charts/custom-tooltip';
import {
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Line,
} from 'recharts';
import { useMedia } from '@/hooks/use-media';
import SimpleBar from '@/components/ui/simplebar';
import DropdownAction from '@/components/charts/dropdown-action';
import { Title } from 'rizzui';
import cn from '@/utils/class-names';
import TrendingUpIcon from '@/components/icons/trending-up';
import { getAllUsers, getApprovedQuotations } from '@/data/order-data';
import { useEffect, useState } from 'react';




function processData(backendData : any) {
    console.log('backend Data');
    console.log(backendData);
    
    
  // Function to format the month
  function getMonthYear(dateString : any) {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${month} ${year}`;
  }

  // Get current date
  const currentDate = new Date();
  
  // Get 10 recent months
  const recentMonths = [];
  for (let i = 9; i >=0; i--) {
    const date = new Date();
    date.setMonth(currentDate.getMonth() - i);
    recentMonths.push(getMonthYear(date));
  }

  // Process backend data
  const graphData = recentMonths.map(monthYear => ({
    label: monthYear,
    users: 0,
  }));

  backendData?.forEach((item : any) => {
    const monthYear = getMonthYear(item.signupdate);
    const graphItem = graphData.find(data => data.label === monthYear);
    if (graphItem) {
      graphItem.users++;
    }
  });

  return graphData;
}

export default function UsersGraph({ className }: { className?: string }) {
  const isTablet = useMedia('(max-width: 800px)', false);
  
  const [data, setData] = useState<any>(null)
  let allUsers : any
  const getData = async ()=> {
    allUsers = await getAllUsers()
 
    
    const graphData = processData(allUsers.user)
    setData(graphData)
  }
  const getTotalAmount = (data : any[])=>{
      let total = 0;
      data?.forEach(obj => {
        total += total + obj.users
      })
      return total
  }

  useEffect(()=>{
    getData()
  }, [])
  return (
    <WidgetCard
      title="Total Users"
      titleClassName="text-gray-700 font-normal sm:text-sm font-inter"
      headerClassName="items-center"
      // action={
      //   <DropdownAction
      //     className="rounded-md border"
      //     options={viewOptions}
      //     onChange={handleChange}
      //     dropdownClassName="!z-0"
      //   />
      // }
      className={cn('min-h-[28rem]', className)}
    >
      <div className="mb-4 mt-1 flex items-center gap-2">
        <Title as="h2" className="font-semibold">
         {data && getTotalAmount(data)}
        </Title>
        {/* <span className="flex items-center gap-1 text-green-dark">
          <TrendingUpIcon className="h-auto w-5" />
          <span className="font-medium leading-none"> +32.40%</span>
        </span> */}
      </div>
      <SimpleBar>
        <div className="h-[27.3rem] w-full pt-9 @lg:pt-8">
          <ResponsiveContainer
            width="100%"
            height="100%"
            {...(isTablet && { minWidth: '500px' })}
          >
            <ComposedChart
              data={data}
              margin={{
                left: -17,
                top: 27,
              }}
              className="[&_.recharts-tooltip-cursor]:fill-opacity-20 dark:[&_.recharts-tooltip-cursor]:fill-opacity-10 [&_.recharts-cartesian-axis-tick-value]:fill-gray-500 [&_.recharts-cartesian-axis.xAxis]:translate-y-2 [&_.recharts-cartesian-axis.yAxis]:-translate-y-3 rtl:[&_.recharts-cartesian-axis.yAxis]:-translate-x-12 [&_path.recharts-rectangle]:!stroke-none"
            >
              <defs>
                <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3CBA92" stopOpacity={1} />
                  <stop offset="95%" stopColor="#0BA360" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeOpacity={0.435}
                strokeDasharray="8 10"
              />
              <XAxis dataKey="label" axisLine={false} tickLine={false} />
              <YAxis
              domain={[0, 5]}
              interval={0}
              tickCount={6}
                // axisLine={false}
                tickLine={false}
                // tickFormatter={(label) => `$${label}`}
              />
              <Tooltip
                content={
                  <CustomTooltip className="[&_.chart-tooltip-item:last-child]:hidden" />
                }
                cursor={false}
              />
              
              <Bar
                dataKey="users"
                fill="#3872FA"
                barSize={36}
                radius={[4, 4, 0, 0]}
              />
              <Line
                dataKey="users"
                className="-translate-y-3"
                stroke="#CDDDFE"
                strokeWidth={3}
                activeDot={false}
                dot={<CustomizedDot />}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </SimpleBar>
    </WidgetCard>
  );
}

function CustomizedDot(props: any) {
  const { cx, cy } = props;
  return (
    <svg
      x={cx - 10}
      y={cy - 7}
      width="15"
      height="14"
      viewBox="0 0 15 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="7.03906"
        cy="7"
        r="5.5"
        fill="#3872FA"
        stroke="white"
        strokeWidth="3"
      />
    </svg>
  );
}

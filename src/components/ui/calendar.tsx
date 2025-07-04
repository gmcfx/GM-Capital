import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
  DayPicker, 
  CaptionProps, 
  useNavigation
} from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const CustomCaption = (props: CaptionProps) => {
  // Access the month directly from calendarMonth property
  const displayMonth = (props as any).calendarMonth.month;
  
  const month = displayMonth.toLocaleString("default", { month: "long" });
  const year = displayMonth.getFullYear();
  
  return (
    <div className="flex justify-between items-center px-2 py-1">
      <span className="text-sm font-medium">
        {month} {year}
      </span>
      <div className="flex space-x-1">
        <NavigationButton direction="previous" />
        <NavigationButton direction="next" />
      </div>
    </div>
  );
};

const NavigationButton = ({ direction }: { direction: 'previous' | 'next' }) => {
  const { goToMonth, nextMonth, previousMonth } = useNavigation();
  
  const isPrevious = direction === 'previous';
  const isDisabled = isPrevious ? !previousMonth : !nextMonth;
  
  return (
    <button
      type="button"
      onClick={() => isPrevious ? goToMonth(previousMonth!) : goToMonth(nextMonth!)}
      className={cn(
        buttonVariants({ variant: "outline" }),
        "h-7 w-7 p-0 opacity-50 hover:opacity-100",
        isDisabled && "opacity-20 cursor-not-allowed"
      )}
      disabled={isDisabled}
      aria-label={isPrevious ? "Previous month" : "Next month"}
    >
      {isPrevious ? (
        <ChevronLeft className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </button>
  );
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  // Create components object with proper typing
  const componentsOverride = {
    Caption: CustomCaption
  } as React.ComponentProps<typeof DayPicker>['components'];
  
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={componentsOverride}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
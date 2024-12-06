'use client'

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

// Hardcoded colors derived from your original HSL values
const accent = "#eef5fb"
const accentForeground = "#0b1426"
const primary = "#0b1426"
const primaryForeground = "#f7fafc"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
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
        cell: cn(
          "h-9 w-9 text-center text-sm p-0 relative",
          // Ensuring the selected day gets rounded corners 
          "[&:has([aria-selected].day-range-end)]:rounded-r-md",
          "[&:has([aria-selected].day-outside)]:bg-[rgba(238,245,251,0.5)]", // accent/50
          "[&:has([aria-selected])]:bg-[#eef5fb]",
          "first:[&:has([aria-selected])]:rounded-l-md",
          "last:[&:has([aria-selected])]:rounded-r-md",
          "focus-within:relative focus-within:z-20"
        ),
        day: cn(
          buttonVariants({ variant: "secondary" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        // Applying primary & primaryForeground to the selected day
        day_selected: cn(
          "bg-[#0b1426] text-[#f7fafc]",
          "hover:bg-[#0b1426] hover:text-[#f7fafc]",
          "focus:bg-[#0b1426] focus:text-[#f7fafc]"
        ),
        // Applying accent & accentForeground to the today day
        day_today: cn(
          `bg-[${accent}] text-[${accentForeground}]`
        ),
        // Outside days appear with reduced opacity
        day_outside: cn(
          "day-outside text-muted-foreground opacity-50",
          "aria-selected:bg-[rgba(238,245,251,0.5)] aria-selected:text-muted-foreground"
        ),
        // Disabled days appear with reduced opacity
        day_disabled: "text-muted-foreground opacity-50",
        // Middle of a range gets the accent colors
        day_range_middle: cn(
          "aria-selected:bg-[#eef5fb] aria-selected:text-[#0b1426]"
        ),
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }

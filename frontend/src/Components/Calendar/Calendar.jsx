"use client";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "phosphor-react";
import { Button, DatePicker, Popover } from "keep-react";
import "./styles.css";

const DatePickerComponent = () => {
  const [selected, setSelected] = useState(null);
  return (
    <>
      <Popover showArrow={false} placement="bottom-start">
        <Popover.Action asChild>
          <Button
            className="bt-default"
            variant="outline"
            color="secondary"
          >
            <Calendar size={20} color="#AFBACA" />
            {selected? (
              <>
                <span style={{ color: "blue" }}>
                  {format(selected?.from ?? new Date(), "LLL dd, y")} -{" "}
                  {format(selected?.to ?? new Date(), "LLL dd, y")}
                </span>
              </>
            ) : (
              <span className="info">Select Your Date</span>
            )}
          </Button>
        </Popover.Action>
        <Popover.Content className="z-50 max-w-min">
          <DatePicker
            mode="range"
            selected={selected}
            onSelect={setSelected}
            showOutsideDays={true}
          />
        </Popover.Content>
      </Popover>
    </>
  );
};

export default DatePickerComponent;
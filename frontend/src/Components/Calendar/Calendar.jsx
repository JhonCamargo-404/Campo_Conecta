"use client";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "phosphor-react";
import { Button, DatePicker, Popover } from "keep-react";
import axios from "axios";
import "./styles.css";

const DatePickerComponent = ({ userId, offerId }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (range) => {
    setSelected(range);
    if (range?.from && range?.to) {
      const startDate = format(range.from, "yyyy-MM-dd");
      const endDate = format(range.to, "yyyy-MM-dd");

      // Send the selected dates to the backend
      axios.post("http://127.0.0.1:8000/submit-dates", { 
        startDate, 
        endDate, 
        user_id: userId, 
        offer_id: offerId 
      })
        .then(response => {
          console.log("Dates submitted successfully:", response.data);
        })
        .catch(error => {
          console.error("Error submitting dates:", error);
        });
    }
  };

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
            {selected ? (
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
            onSelect={handleSelect}
            showOutsideDays={true}
          />
        </Popover.Content>
      </Popover>
    </>
  );
};

export default DatePickerComponent;

import useFetchDateData from "../../hooks/useFetchDateData";
// import { useState, useRef } from "react";
import { Button, Card } from "react-bootstrap";

// import "flatpickr/dist/themes/material_green.css"; // can use different themes
import Flatpickr from "react-flatpickr";
import { Japanese } from 'flatpickr/dist/l10n/ja.js';

const CalendarComponent = ({ selectedDate, onDateSelect, machineNumber, titleKeyword }) => {
  const { dates, loading, error } = useFetchDateData(machineNumber, titleKeyword);

  const getDateStatus = (date) => {
    // const match = dates.find(
    //   // (d) => d.date === date.toISOString().split("T")[0]
    //   // (d) => new Date(d.formatted_date).toISOString().split('T')[0] === date.toISOString().split('T')[0]
    //   (d) => new Date(d.date).toISOString().split('T')[0] === date.toISOString().split('T')[0]
    // );
    const normalizedDate = date.toISOString().split('T')[0];
    const match = dates.find(
      (d) => d.formatted_date === normalizedDate
    );
    return match
      ? match.accomplished
        ? "completed"
        : "selectable"
      : "unselectable";
  };

  const goToToday = () => {
    onDateSelect(new Date()); // Set picker to today's date
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading dates!</p>;

  return (
    <>
      <Card className="p-3" style={{ minHeight: "400px" }}>
        <Card.Title>
          <h4>Checking Date</h4>
        </Card.Title>
        <Card.Body>
          <div className="d-flex align-items-start mb-3">
            <Button
              variant="outline-secondary"
              style={{ fontSize: "0.7rem" }}
              onClick={goToToday}
            >
              Today
            </Button>
            <div className="flex-grow-1">
              {/* <Flatpickr
                value={selectedDate}
                onChange={date => {
                  onDateSelect(date[0]);
                }}
              
                options={{
                  inline: true,
                  dateFormat: "Y-m-d",
                  // locale: Japanese,
                  onDayCreate: (dObj, dStr, fp, dayElem) => {
                    // Apply custom class names to the days
                    const status = getDateStatus(new Date(dayElem.dateObj));
                    const className =
                      status === "completed"
                        ? "completed"
                        : status === "selectable"
                        ? "selectable"
                        : "unselectable";
                    dayElem.className += ` calendar-day--${className}`;
                  },
                  disable: [
                    function (date) {
                      // Disable dates that are unselectable
                      return getDateStatus(date) === "unselectable";
                    },
                  ],
                }}
                render={({ defaultValue, value, ...props }, ref) => {
                  // Custom rendering can be applied here
                  return <input {...props} ref={ref} />;
                }}
              /> */}
              <Flatpickr
                value={selectedDate}
                onChange={(date) => {
                  onDateSelect(date[0]);
                }}
                options={{
                  inline: true,
                  dateFormat: 'Y-m-d',
                  locale: Japanese,
                  onDayCreate: (dObj, dStr, fp, dayElem) => {
                    const status = getDateStatus(dayElem.dateObj);
                    const className =
                      status === 'completed'
                        ? 'completed'
                        : status === 'selectable'
                          ? 'selectable'
                          : 'unselectable';
                    dayElem.className += ` calendar-day--${className}`;
                  },
                  disable: [
                    function (date) {
                      return getDateStatus(date) === 'unselectable';
                    },
                  ],
                }}
                render={({ defaultValue, value, ...props }, ref) => {
                  return <input {...props} ref={ref} />;
                }}
              />
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default CalendarComponent;

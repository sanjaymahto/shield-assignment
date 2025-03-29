import { forwardRef, useState } from "react";
import DatePicker from "react-datepicker";
import moment from "moment-timezone";
import {
  HOLIDAYS,
  MAX_DAYS_ALLOWED,
  MAX_FUTURE_DAYS,
  TIMEZONES,
} from "./constants";
import { formatDate } from "../../utilities";
import "react-datepicker/dist/react-datepicker.css";
import "./index.css";

interface dateSelectorProps {
  setCalendarRange: Function;
}

const DateSelector = (props: dateSelectorProps) => {
  const { setCalendarRange } = props;

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + MAX_FUTURE_DAYS);

  const defaultStartDate = new Date();
  const defaultEndDate = new Date();
  defaultEndDate.setDate(defaultStartDate.getDate() + 7);

  const [isRange, setIsRange] = useState<boolean>(true);
  const [singleDate, setSingleDate] = useState<Date | null>(null);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    defaultStartDate,
    defaultEndDate,
  ]);
  const [timezone, setTimezone] = useState<string>("Asia/Calcutta");

  const handleRangeChange = (update: [Date | null, Date | null]) => {
    const [start, end] = update;

    if (start && end) {
      const diffInDays =
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      if (diffInDays > MAX_DAYS_ALLOWED) {
        return; // Prevent updating the range
      }
      setCalendarRange({
        startDate: formatDate(new Date(start)),
        endDate: formatDate(new Date(end)),
      });
    } else if (!start && !end) {
      setCalendarRange({
        startDate: null,
        endDate: null,
      });
    }
    setDateRange(update);
  };

  const formatDateWithTimezone = (date: Date | null) => {
    return date
      ? moment(date).tz(timezone).format("DD MMM YYYY, HH:mm:ss [GMT]Z")
      : "";
  };

  const formatDateWithTimezoneRange = (dateArr: [Date | null, Date | null]) => {
    if (dateArr[0] && dateArr[1]) {
      return `${moment(dateArr[0]).tz(timezone).format("DD MMM")} - ${moment(
        dateArr[1]
      )
        .tz(timezone)
        .format("DD MMM YYYY, HH:mm:ss [GMT]Z")}`;
    } else {
      return "";
    }
  };

  // Render tooltip for holidays and max-days violations
  const renderDayContents = (day: number, date?: Date) => {
    if (!date) return day;

    const dateKey = moment(date).tz(timezone).format("YYYY-MM-DD");
    const holidayMessage = HOLIDAYS[dateKey];

    let tooltipMessage = "",
      outRangeDay = false;

    if (dateRange[0]) {
      const diffInDays =
        (date.getTime() - dateRange[0].getTime()) / (1000 * 60 * 60 * 24);
      if (diffInDays > MAX_DAYS_ALLOWED) {
        tooltipMessage = `Max ${MAX_DAYS_ALLOWED} days allowed`;
      }
    }

    if (holidayMessage) {
      tooltipMessage = holidayMessage;
    }

    if (date > maxDate) {
      outRangeDay = true;
    }

    return (
      <div className="tooltip-container">
        <span
          style={{
            color: holidayMessage ? "blue" : tooltipMessage ? "red" : "black",
            fontWeight: holidayMessage ? "bold" : "normal",
            textDecoration: tooltipMessage ? "line-through" : "none",
          }}
        >
          {outRangeDay ? <span style={{ color: "#ccc" }}>{day}</span> : day}
        </span>
        {tooltipMessage && <div className="tooltip">{tooltipMessage}</div>}
      </div>
    );
  };

// @ts-expect-error  
  const CustomInputRange = forwardRef(({ value, onClick }, ref) => (
    // @ts-expect-error
    <div className="inputContainer" onClick={onClick} ref={ref}>
      {formatDateWithTimezoneRange(dateRange)}
    </div>
  ));

  // @ts-expect-error
  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    // @ts-expect-error
    <div className="inputContainer" onClick={onClick} ref={ref}>
      {formatDateWithTimezone(singleDate)}
    </div>
  ));

  return (
    <div className="dateWrapper">
      <div>
        {isRange ? (
          <DatePicker
            showIcon
            selectsRange
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={handleRangeChange}
            customInput={<CustomInputRange />}
            renderDayContents={renderDayContents}
            maxDate={maxDate}
            showDisabledMonthNavigation
            isClearable
          />
        ) : (
          <DatePicker
            showIcon
            selected={singleDate}
            onChange={(date) => {
              setSingleDate(date);
              setCalendarRange({
                startDate: null,
                endDate: null,
                specificDate: date ? formatDate(date) : null,
              });
            }}
            customInput={<CustomInput />}
            renderDayContents={renderDayContents}
            maxDate={maxDate}
            showDisabledMonthNavigation
            isClearable
          />
        )}
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={isRange}
            onChange={() => {
              setIsRange(!isRange);
              setDateRange([null, null]);
              setCalendarRange({
                startDate: null,
                endDate: null,
              });
            }}
          />
          Range Selection
        </label>
        &nbsp;|&nbsp;
        <label>
          Timezone:&nbsp;
          <select
            className="timeZoneSelector"
            onChange={(e) => setTimezone(e.target.value)}
            value={timezone}
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};

export default DateSelector;

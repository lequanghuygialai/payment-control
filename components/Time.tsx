import React from "react";

export interface TimeProps {
  date: Date;
}

export default function Time({ date }: TimeProps) {
  return (
    // <Moment locale="vi" format="DD-MM-YYYY">
    //   {date}
    // </Moment>

    <>{date}</>
  );
}

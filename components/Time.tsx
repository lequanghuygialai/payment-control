import moment from "moment";
import React from "react";

export interface TimeProps {
  date: Date;
}

export default function Time({ date }: TimeProps) {
  return <>{moment(date).format("DD-MM-YYYY")}</>;
}

import React from "react";
import Moment from "react-moment";

export interface TimeProps {
  date: Date;
}

export default function Time({ date }: TimeProps) {
  return <Moment format="ll">{date}</Moment>;
}

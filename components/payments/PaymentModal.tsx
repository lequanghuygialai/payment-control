import { Payment, PaymentType } from "@prisma/client";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PaymentForm } from "../../data/models";

export interface PaymentModalProps {
  isModalOpen: boolean;
  model?: Payment;
  onSubmit: (data: PaymentForm) => void;
  onDelete: (data: Payment) => void;
  onCancel: () => void;
}

export default function PaymentModal({
  isModalOpen,
  model,
  onSubmit,
  onDelete,
  onCancel,
}: PaymentModalProps) {
  return <></>
}

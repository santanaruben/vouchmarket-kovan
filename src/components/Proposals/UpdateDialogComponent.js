import React from "react";
import UpdateProposal from "./UpdateProposal";
import { useSelector, useDispatch } from "react-redux";
import {
  updateDialog,
  setUpdateDialog,
} from "../../app/features/updateDialogSlice";

export default function UpdateDialogComponent() {
  const dispatch = useDispatch();
  var openDialog = useSelector(updateDialog);

  return (
    <UpdateProposal
      open={openDialog}
      onClose={() => dispatch(setUpdateDialog(false))}
    />
  );
}

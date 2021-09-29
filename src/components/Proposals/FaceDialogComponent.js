import React from "react";
import CheckFace from "./CheckFace";
import { useSelector, useDispatch } from "react-redux";
import { faceDialog, setFaceDialog } from "../../app/features/faceDialogSlice";

export default function FaceDialogComponent() {
  const dispatch = useDispatch();
  var openDialog = useSelector(faceDialog);

  return (
    <CheckFace
      open={openDialog}
      onClose={() => dispatch(setFaceDialog(false))}
    />
  );
}
